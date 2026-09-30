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
POSITIONS = %w[CF SS L/RWF AMF CMF DMF L/RMF L/RB CB GK].freeze

# 自动寻找技能名称列。脚本也支持“技能名称”“技巧名称-中文”等不同表头。
def find_skill_column(headers)
  headers.find { |h| h.to_s.match?(/技能|技巧|名称|skill/i) } || headers.first
end

# 全局技能评分可以放在“技能推荐度”“全局评分”或类似列中。
def find_global_column(headers)
  headers.find { |h| h.to_s.match?(/技能推荐度|全局|global|rating/i) }
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

# 把 1～5 星的全局技能评分换算为 0～3 分，作为轻量先验。
def global_score(value)
  stars = value.to_s.count('★')
  return nil if stars.zero?

  [stars.to_f / 5.0 * 3.0, 3.0].min
end

# 根据原始列名自动映射到标准位置。
# 例如：
#   CF（高点型）       -> CF
#   CMF/DMF-扫荡型     -> CMF、DMF
#   LWF/RWF/LMF/RMF... -> L/RWF、L/RMF
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
  targets << 'L/RB' if h.match?(/LB\/?RB|L\/?RB/i)
  targets << 'CB' if h.match?(/\ACB(?:$|[（(）)_\/-])/i)
  targets << 'GK' if h.match?(/GK/i)
  if h.match?(/LWF|RWF/i)
    targets << 'L/RWF'
    targets << 'L/RMF' if h.match?(/LMF|RMF/i)
  end
  targets << 'L/RMF' if h.match?(/LMF|RMF/i) && !targets.include?('L/RMF')
  targets.uniq
end

# 可选的 JSON 映射格式：
# {
#   "专家名": {
#     "CF": ["原始 CF 列名"],
#     "L/RMF": ["原始边路列名"]
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

# 读取一个专家 CSV，并保存技能行、原始表头、位置映射和全局评分列。
def load_expert(label, path, mapping)
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
    path: path,
    rows: skill_rows,
    headers: rows.headers,
    mapping: source_columns_for(label, rows.headers, mapping),
    global_column: find_global_column(rows.headers)
  }
end

# 读取独立的全局评分 CSV。
# 如果没有通过 --global 指定文件，脚本会尝试从第一个专家 CSV 中读取全局评分列。
def load_global(path)
  return {} unless path

  rows = CSV.read(path, headers: true, encoding: 'bom|utf-8')
  skill_column = find_skill_column(rows.headers)
  value_column = (rows.headers - [skill_column]).find { |h| h.to_s.match?(/技能推荐度|全局|global|rating/i) } || (rows.headers - [skill_column]).first
  raise "全局评分文件缺少评分列：#{path}" unless value_column

  rows.each_with_object({}) do |row, result|
    result[row[skill_column].to_s.strip] = global_score(row[value_column])
  end
end

# 命令行参数：专家 CSV 可以重复传入，例如：
# --expert "DK=/path/DK.csv" --expert "Skye=/path/Skye.csv"
options = {
  experts: [],
  out_dir: Dir.pwd,
  mapping: nil,
  global: nil
}

parser = OptionParser.new do |opts|
  opts.banner = <<~USAGE
    用法：ruby normalize_skill_recommendations.rb --expert 名称=文件.csv [--expert 名称=文件.csv ...]
  USAGE
  opts.on('--expert NAME=PATH', '专家 CSV，可重复指定') { |value| options[:experts] << value }
  opts.on('--global PATH', '可选的独立全局技能评分 CSV') { |value| options[:global] = value }
  opts.on('--mapping PATH', '可选 JSON 映射文件') { |value| options[:mapping] = value }
  opts.on('--out-dir PATH', '输出目录，默认当前目录') { |value| options[:out_dir] = value }
  opts.on('-h', '--help', '显示帮助') { puts opts; exit }
end
parser.parse!

raise parser.banner unless options[:experts].any?

expert_specs = options[:experts].map do |spec|
  label, path = spec.split('=', 2)
  raise "专家参数格式错误：#{spec}，应为 NAME=PATH" unless label && path
  [label, path]
end

mapping = load_mapping(options[:mapping])
experts = expert_specs.map { |label, path| load_expert(label, path, mapping) }

# 输入校验：保证所有专家使用同一套 67 个技能，避免技能错位计算。
missing = experts.flat_map { |expert| SKILLS - expert[:rows].keys }.uniq
extra = experts.flat_map { |expert| expert[:rows].keys - SKILLS }.uniq
raise "输入缺少技能：#{missing.join('、')}" unless missing.empty?
raise "输入包含未识别技能：#{extra.join('、')}" unless extra.empty?

global_values = load_global(options[:global])
if global_values.empty?
  source = experts.find { |expert| expert[:global_column] }
  if source
    column = source[:global_column]
    global_values = SKILLS.to_h { |skill| [skill, global_score(source[:rows][skill][column])] }
  end
end

# 判断某位专家是否真正覆盖某个标准位置。
# 如果该专家虽然有对应列，但整列都是空白，也视为未覆盖，不能进入分母。
available_by_position = {}
POSITIONS.each do |position|
  available_by_position[position] = experts.select do |expert|
    columns = expert[:mapping].fetch(position, [])
    columns.any? && columns.any? do |column|
      expert[:rows].values.any? { |row| parse_cell(row[column]) }
    end
  end
end

matrix = []
detail = []

# 主计算：逐个技能、逐个标准位置计算最终等级。
SKILLS.each do |skill|
  output = { '技能' => skill }

  POSITIONS.each do |position|
    # eligible 是“真正覆盖该位置”的专家集合。
    # 没有覆盖的位置不会被当成 0 分专家。
    eligible = available_by_position.fetch(position)
    expert_scores = []
    support_count = 0
    evaluated_count = 0

    eligible.each do |expert|
      columns = expert[:mapping].fetch(position, [])
      values = columns.map { |column| parse_cell(expert[:rows][skill][column]) }.compact
      next if values.empty?

      evaluated_count += values.size
      # 只要该专家至少有一个正向星级，就算作一位“支持专家”。
      # 空白不会拉低专家平均分，但会降低后面的意见一致性。
      support_count += 1 if values.any?(&:positive?)
      expert_scores << values.sum / values.size
    end

    expert_score = expert_scores.empty? ? nil : expert_scores.sum / expert_scores.size
    prior = global_values[skill]

    if expert_score.nil?
      # 没有任何专家推荐时，直接输出 0，不能用全局技能评分兜底。
      final_score = 0.0
      level = 0
      support_rate = 0.0
      consensus_factor = 0.0
    else
      # 一致性修正：支持专家越少，最终分越低。
      # 3/3 支持 -> 1.00；2/3 -> 0.83；1/3 -> 0.67。
      support_rate = support_count.to_f / eligible.size
      consensus_factor = 0.5 + 0.5 * support_rate

      # 只有至少一位专家实际推荐时，才加入全局技能评分。
      base_score = prior.nil? ? expert_score : expert_score * 0.80 + prior * 0.20
      final_score = base_score * consensus_factor

      # 连续分最后才离散成 0～3：
      # 2.5 以上为 3，1.5～2.49 为 2，0～1.49 为 1。
      level = if final_score >= 2.5
                3
              elsif final_score >= 1.5
                2
              elsif final_score.positive?
                1
              else
                0
              end
    end

    output[position] = level
    detail << {
      '位置' => position,
      '技能' => skill,
      '推荐等级' => level,
      '最终连续分' => final_score.round(4),
      '专家推荐分' => expert_score&.round(4),
      '全局评分(0-3)' => prior&.round(4),
      '可参与专家数' => eligible.size,
      '支持专家数' => support_count,
      '专家支持率' => support_rate.round(4),
      '一致性系数' => consensus_factor.round(4),
      '专家有效评价数' => evaluated_count
    }
  end

  matrix << output
end

# 输出两个文件：
# 1. 归一化矩阵：技能为行，标准位置为列，单元格为 0～3。
# 2. 位置摘要：列出每个位置全部推荐等级大于 0 的技能，按 3、2、1 分排序。
Dir.mkdir(options[:out_dir]) unless Dir.exist?(options[:out_dir])
matrix_path = File.join(options[:out_dir], '技能推荐-归一化-矩阵.csv')
summary_path = File.join(options[:out_dir], '技能推荐-归一化-位置摘要.csv')

CSV.open(matrix_path, 'w', write_headers: true, headers: ['技能', *POSITIONS], encoding: 'UTF-8') do |csv|
  matrix.each { |row| csv << ['技能', *POSITIONS].map { |header| row[header] } }
end

CSV.open(summary_path, 'w', write_headers: true,
         headers: ['位置', '技能', '推荐等级', '最终连续分', '可参与专家数', '支持专家数', '专家支持率'], encoding: 'UTF-8') do |csv|
  POSITIONS.each do |position|
    rows = detail.select { |row| row['位置'] == position }
    selected = rows.select { |row| row['推荐等级'].positive? }
    selected.sort_by { |row| [-row['推荐等级'], -row['最终连续分'], row['技能']] }.each do |row|
      csv << [row['位置'], row['技能'], row['推荐等级'], row['最终连续分'], row['可参与专家数'], row['支持专家数'], row['专家支持率']]
    end
  end
end

puts "已生成：#{matrix_path}"
puts "已生成：#{summary_path}"
