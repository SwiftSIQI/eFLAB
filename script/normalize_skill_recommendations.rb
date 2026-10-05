#!/usr/bin/env ruby
# frozen_string_literal: true

require 'csv'
require 'optparse'

# 专家 CSV 的唯一输入目录。文件名以 nouse 开头时不参与生成。
ROOT = File.expand_path('..', __dir__)
EXPERT_DIR = File.join(ROOT, 'csv', 'expert')
OUTPUT_PATH = File.join(ROOT, 'csv', 'play_skill_rec_by_expert.csv')

# 固定的技能清单。专家 CSV 必须完整覆盖这 67 项技能，且不能出现额外名称。
SKILLS = %w[
  剪刀脚假动作 两次触球 牛摆尾 马赛回旋 挑球过顶 脚后跟磕球变向 向后切球并转身 磕球过人 后脚磕球变向 足底控球
  旋风盘带 瞬间加速 磁力脚 头球 炮弹式头球 远距离弧线球 弧线落叶射门 吊射控制 落叶球射门 急坠射门 急升射门
  远射 掠地瞬击 瞬发射门 杂技般进球 脚跟绝技 一脚射门 无定型射门 百折不挠 一脚传球 直传球 精准长传 精确横传球
  急坠传中 外脚背弧线球 插花脚 不看球员传球 翻盘传球 到位传球 无定型传球 低空传球 守门员低弹道凌空球
  守门员高弹道凌空球 长距离投掷 守门员长距离投掷 点球专家 守门员扑点球 守门员指挥防守 门神战吼 假摔 盯人 压迫
  截球 封堵 空中优势 飞身铲球 伸脚抢截 后防领袖 杂技般解围 空中堡垒 紧急回防 队长 进攻号手 超级候补 战斗精神 进攻提速 强力抢断
].freeze

POSITIONS = %w[CF SS RWF/LWF AMF CMF DMF RMF/LMF RB/LB CB GK].freeze
IGNORED_HEADERS = /序号|技能|技巧|名称|技能推荐度|全局|global|rating|备注/i

def fail_with(message)
  abort("专家推荐归一化失败：#{message}")
end

def find_skill_column(headers)
  headers.find { |header| header.to_s.match?(/技能|技巧|名称|skill/i) } || headers.first
end

def parse_cell(value)
  text = value.to_s.strip
  return nil if text.empty? || text == '—' || text.include?('❌')

  stars = [text.count('★'), 3].min
  stars.positive? ? stars : nil
end

def auto_targets(header)
  text = header.to_s.strip
  return [] if text.empty? || text.match?(IGNORED_HEADERS)

  targets = []
  targets << 'CF' if text.match?(/\ACF(?:$|[（(）)_\/-])/i)
  targets << 'SS' if text.match?(/\ASS(?:$|[（(）)_\/-])/i)
  targets << 'AMF' if text.match?(/AMF/i)
  targets << 'CMF' if text.match?(/CMF/i)
  targets << 'DMF' if text.match?(/DMF/i)
  targets << 'RB/LB' if text.match?(/(?:LB\/RB|RB\/LB)/i)
  targets << 'CB' if text.match?(/\ACB(?:$|[（(）)_\/-])/i)
  targets << 'GK' if text.match?(/GK/i)
  if text.match?(/(?:LWF\/RWF|RWF\/LWF)/i)
    targets << 'RWF/LWF'
    targets << 'RMF/LMF' if text.match?(/(?:LMF\/RMF|RMF\/LMF)/i)
  end
  targets << 'RMF/LMF' if text.match?(/(?:LMF\/RMF|RMF\/LMF)/i) && !targets.include?('RMF/LMF')
  targets.uniq
end

def position_profile(header)
  text = header.to_s.strip
  return '通用' if text.empty?
  return text.sub(/\A[^（(]+[（(]/, '').sub(/[）)]\z/, '') if text.match?(/\A[^（(]+[（(].+[）)]\z/)
  return text.split('-', 2).last.strip if text.include?('-')

  '通用'
end

def display_name(path)
  name = File.basename(path, '.csv').sub(/\A(?:nouse-)?player_skill_rec_from_/, '')
  { '大叔' => '冲啊大叔 CasToR', 'skye' => 'Skye' }.fetch(name, name)
end

def load_expert(id, path)
  rows = CSV.read(path, headers: true, encoding: 'bom|utf-8')
  fail_with("#{path}: CSV 没有表头") if rows.headers.empty?

  skill_column = find_skill_column(rows.headers)
  skill_rows = {}
  rows.each do |row|
    skill = row[skill_column].to_s.strip
    next if skill.empty?
    fail_with("#{path}: 技能重复：#{skill}") if skill_rows.key?(skill)

    skill_rows[skill] = row.to_h
  end

  missing = SKILLS - skill_rows.keys
  extra = skill_rows.keys - SKILLS
  fail_with("#{path}: 包含 player_skill.csv 中不存在的技能：#{extra.join('、')}") unless extra.empty?
  fail_with("#{path}: 缺少技能：#{missing.join('、')}") unless missing.empty?

  mappings = Hash.new { |hash, position| hash[position] = [] }
  rows.headers.each do |header|
    next if header == skill_column || header.to_s.match?(IGNORED_HEADERS)

    targets = auto_targets(header)
    fail_with("#{path}: 无法识别位置列：#{header}") if targets.empty?
    targets.each { |position| mappings[position] << header }
  end

  { id: id, label: display_name(path), rows: skill_rows, skill_column: skill_column, mappings: mappings }
end

options = { expert_dir: EXPERT_DIR, output: OUTPUT_PATH }
OptionParser.new do |parser|
  parser.banner = '用法：ruby script/normalize_skill_recommendations.rb [--expert-dir PATH] [--output PATH]'
  parser.on('--expert-dir PATH', '专家 CSV 目录，默认 csv/expert') { |value| options[:expert_dir] = value }
  parser.on('--output PATH', '输出 CSV 路径，默认 csv/play_skill_rec_by_expert.csv') { |value| options[:output] = value }
  parser.on('-h', '--help', '显示帮助') { puts parser; exit }
end.parse!

paths = Dir.glob(File.join(options[:expert_dir], '*.csv')).sort.reject do |path|
  File.basename(path).match?(/\Anouse(?:-|_)/i)
end
fail_with("#{options[:expert_dir]} 中没有可用专家 CSV") if paths.empty?

experts = paths.each_with_index.map { |path, index| load_expert(index + 1, path) }
expert_detail = []

experts.each do |expert|
  expert[:mappings].each do |position, columns|
    columns.each do |header|
      profile = position_profile(header)
      SKILLS.each do |skill|
        level = parse_cell(expert[:rows][skill][header])
        next unless level

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

fail_with('没有生成任何专家推荐记录') if expert_detail.empty?
duplicate_keys = expert_detail.group_by { |row| row.values_at('方案ID', '位置', '定位', '技能') }.select { |_key, rows| rows.length > 1 }
fail_with("生成了重复推荐记录：#{duplicate_keys.keys.first.inspect}") unless duplicate_keys.empty?

Dir.mkdir(File.dirname(options[:output])) unless Dir.exist?(File.dirname(options[:output]))
CSV.open(options[:output], 'w', write_headers: true,
         headers: ['方案', '方案ID', '位置', '定位', '技能', '推荐等级'], encoding: 'UTF-8') do |csv|
  expert_detail.sort_by { |row| [row['方案ID'], POSITIONS.index(row['位置']), row['定位'], -row['推荐等级'], row['技能']] }.each do |row|
    csv << row.values_at('方案', '方案ID', '位置', '定位', '技能', '推荐等级')
  end
end

puts "已生成：#{options[:output]}（#{expert_detail.length} 条）"
