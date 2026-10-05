#!/usr/bin/env ruby
# frozen_string_literal: true

require 'csv'
require 'json'
require 'optparse'

# 固定的 67 个技能清单。
# 输入 CSV 必须包含这些技能，顺序可以不同，但不能缺少或多出技能。
SKILLS = %w[
  剪刀脚假动作 两次触球 牛摆尾 马赛回旋 挑球过顶 脚后跟磕球变向 向后切球并转身 磕球过人 后脚磕球变向 足底控球
  旋风盘带 瞬间加速 磁力脚 头球 炮弹式头球 远距离弧线球 弧线落叶射门 吊射控制 落叶球射门 急坠射门 急升射门
  远射 掠地瞬击 瞬发射门 杂技般进球 脚跟绝技 一脚射门 无定型射门 百折不挠 一脚传球 直传球 精准长传 精确横传球
  急坠传中 外脚背弧线球 插花脚 不看球员传球 翻盘传球 到位传球 无定型传球 低空传球 守门员低弹道凌空球
  守门员高弹道凌空球 长距离投掷 守门员长距离投掷 点球专家 守门员扑点球 守门员指挥防守 门神战吼 假摔 盯人 压迫
  截球 封堵 空中优势 飞身铲球 伸脚抢截 后防领袖 杂技般解围 空中堡垒 紧急回防 队长 进攻号手 超级候补 战斗精神 进攻提速 强力抢断
].freeze

# 最终输出的 10 个标准位置。所有专家 CSV 的原始列都会映射到这里。
POSITIONS = %w[CF SS RWF/LWF AMF CMF DMF RMF/LMF RB/LB CB GK].freeze

# 自动寻找技能名称列。脚本也支持“技能名称”“技巧名称-中文”等不同表头。
def find_skill_column(headers)
  headers.find { |h| h.to_s.match?(/技能|技巧|名称|skill/i) } || headers.first
end

# 把单元格转换成专家推荐分：
# - ★～★★★ 转为 1～3
# - 空白、—、❌ 都视为没有正向推荐
# 注意：❌ 已按当前约定处理为空白，不会作为 0 分参与平均。
def parse_cell(value)
  text = value.to_s.strip
  return nil if text.empty? || text == '—' || text.include?('❌')

  stars = [text.count('★'), 3].min
  stars.positive? ? stars.to_f : nil
end

# 根据原始列名自动映射到标准位置。
# 例如：
#   CF（高点型）       -> CF
#   CMF/DMF-扫荡型     -> CMF、DMF
#   LWF/RWF/LMF/RMF... -> RWF/LWF、RMF/LMF
# 如果以后遇到无法自动识别的列，可以通过 --mapping 提供 JSON 映射。
def auto_targets(header)
  h = header.to_s.strip
  return [] if h.empty? || h.match?(/技能推荐度|全局|global|rating/i)

  targets = []
  targets << 'CF' if h.match?(/\ACF(?:$|[（(）)_\/-])/i)
  targets << 'SS' if h.match?(/\ASS(?:$|[（(）)_\/-])/i)
  targets << 'AMF' if h.match?(/AMF/i)
  targets << 'CMF' if h.match?(/CMF/i)
  targets << 'DMF' if h.match?(/DMF/i)
  targets << 'RB/LB' if h.match?(/(?:LB\/RB|RB\/LB)/i)
  targets << 'CB' if h.match?(/\ACB(?:$|[（(）)_\/-])/i)
  targets << 'GK' if h.match?(/GK/i)
  if h.match?(/(?:LWF\/RWF|RWF\/LWF)/i)
    targets << 'RWF/LWF'
    targets << 'RMF/LMF' if h.match?(/(?:LMF\/RMF|RMF\/LMF)/i)
  end
  targets << 'RMF/LMF' if h.match?(/(?:LMF\/RMF|RMF\/LMF)/i) && !targets.include?('RMF/LMF')
  targets.uniq
end

# 可选的 JSON 映射格式：
# {
#   "专家名": {
#     "CF": ["原始 CF 列名"],
#     "RMF/LMF": ["原始边路列名"]
#   }
# }
def load_mapping(path)
  return nil unless path

  JSON.parse(File.read(path, encoding: 'UTF-8'))
end

# 为某位专家建立“标准位置 -> 原始列名数组”的映射。
def source_columns_for(expert, headers, mapping)
  return mapping.fetch(expert, {}) if mapping

  result = Hash.new { |hash, key| hash[key] = [] }
  headers.each do |header|
    auto_targets(header).each { |target| result[target] << header }
  end
  result
end

def position_profile(header)
  text = header.to_s.strip
  return '通用' if text.empty?

  if text.match?(/\A[^（(]+[（(].+[）)]\z/)
    return text.sub(/\A[^（(]+[（(]/, '').sub(/[）)]\z/, '')
  end
  return text.split('-', 2).last.strip if text.include?('-')

  '通用'
end

# 读取一个专家 CSV，并保存技能行、原始表头和位置映射。
def load_expert(id, label, path, mapping)
  rows = CSV.read(path, headers: true, encoding: 'bom|utf-8')
  raise "#{label}: CSV 没有表头" if rows.headers.empty?

  skill_column = find_skill_column(rows.headers)
  skill_rows = {}
  rows.each do |row|
    skill = row[skill_column].to_s.strip
    next if skill.empty?
    raise "#{label}: 技能重复：#{skill}" if skill_rows.key?(skill)
    skill_rows[skill] = row.to_h
  end

  {
    label: label,
    id: id,
    rows: skill_rows,
    skill_column: skill_column,
    mapping: source_columns_for(label, rows.headers, mapping)
  }
end

# 命令行参数：专家 CSV 可以重复传入，格式为数字 ID=显示名称=文件路径，例如：
# --expert "1=DK=/path/DK.csv" --expert "2=Skye=/path/Skye.csv"
options = {
  experts: [],
  out_dir: File.join(File.expand_path("..", __dir__), "csv"),
  mapping: nil
}

parser = OptionParser.new do |opts|
  opts.banner = <<~USAGE
    用法：ruby script/normalize_skill_recommendations.rb --expert 数字ID=名称=文件.csv [--expert 数字ID=名称=文件.csv ...]
  USAGE
  opts.on('--expert ID=NAME=PATH', '专家 CSV，可重复指定；ID 是数字唯一标识') { |value| options[:experts] << value }
  opts.on('--mapping PATH', '可选 JSON 映射文件') { |value| options[:mapping] = value }
  opts.on('--out-dir PATH', '输出目录，默认项目的 csv 目录') { |value| options[:out_dir] = value }
  opts.on('-h', '--help', '显示帮助') { puts opts; exit }
end
parser.parse!

raise parser.banner unless options[:experts].any?

expert_specs = options[:experts].map do |spec|
  id, label, path = spec.split('=', 3)
  raise "专家参数格式错误：#{spec}，应为 ID=NAME=PATH" unless id && label && path
  raise "专家方案 ID 无效：#{id}，只能使用正整数" unless id.match?(/\A[1-9][0-9]*\z/)
  [id, label, path]
end

mapping = load_mapping(options[:mapping])
experts = expert_specs.map { |id, label, path| load_expert(id, label, path, mapping) }
duplicate_ids = experts.group_by { |expert| expert[:id] }.select { |_id, items| items.length > 1 }.keys
raise "专家方案 ID 重复：#{duplicate_ids.join('、')}" unless duplicate_ids.empty?

# 输入校验：保证所有专家使用同一套 67 个技能，避免技能错位计算。
missing = experts.flat_map { |expert| SKILLS - expert[:rows].keys }.uniq
extra = experts.flat_map { |expert| expert[:rows].keys - SKILLS }.uniq
raise "输入缺少技能：#{missing.join('、')}" unless missing.empty?
raise "输入包含未识别技能：#{extra.join('、')}" unless extra.empty?

expert_detail = []

experts.each do |expert|
  expert[:mapping].each do |position, columns|
    columns.each do |header|
      next if header == expert[:skill_column] || header.to_s.match?(/序号|技能推荐度|全局|global|rating|备注/i)

      profile = position_profile(header)
      SKILLS.each do |skill|
        level = parse_cell(expert[:rows][skill][header])&.to_i
        next unless level && level.positive?

        expert_detail << {
          '方案' => expert[:label],
          '方案ID' => expert[:id],
          '位置' => position,
          '定位' => profile,
          '技能' => skill,
          '推荐等级' => level
        }
      end
    end
  end
end
# 输出专家明细，供 generate_skills_data.rb 转换为 app/skills/data.ts。
Dir.mkdir(options[:out_dir]) unless Dir.exist?(options[:out_dir])
expert_path = File.join(options[:out_dir], 'play_skill_rec_by_expert.csv')

CSV.open(expert_path, 'w', write_headers: true,
         headers: ['方案', '方案ID', '位置', '定位', '技能', '推荐等级'], encoding: 'UTF-8') do |csv|
  expert_detail.sort_by { |row| [experts.index { |expert| expert[:id] == row['方案ID'] }, POSITIONS.index(row['位置']), row['定位'], -row['推荐等级'], row['技能']] }.each do |row|
    csv << row.values_at('方案', '方案ID', '位置', '定位', '技能', '推荐等级')
  end
end

puts "已生成：#{expert_path}"
