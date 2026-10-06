#!/usr/bin/env ruby

require "csv"
require "json"

# 从技巧 CSV 生成 app/skills/data.ts。
# 技巧分类支持使用“、”分隔的多个分类，并保留 CSV 中的中英文描述、研究资料和图片索引。
# 位置适配度来自各专家独立的 csv/play_skill_rec_by_expert.csv。
# 别名和旧名称暂不写入网页数据；技能推荐度用于技巧卡片展示。
ROOT = File.expand_path("..", __dir__)
CSV_PATH = File.join(ROOT, "csv/player_skill.csv")
POSITION_RECOMMENDATION_PATH = File.join(ROOT, "csv/play_skill_rec_by_expert.csv")
OUTPUT_PATH = File.join(ROOT, "app/skills/data.ts")
POSITION_ORDER = %w[CF SS RWF/LWF AMF CMF DMF RMF/LMF RB/LB CB GK].freeze
SKILL_RECOMMENDATION_RANGE = 1..5
POSITION_RECOMMENDATION_RANGE = 1..3

def fail_with(message)
  abort("球员技巧生成失败：#{message}")
end

table = CSV.read(CSV_PATH, headers: true, encoding: "bom|utf-8")
headers = table.headers.map(&:to_s)
headers[0] = headers[0].sub(/^\uFEFF/, "")
required = %w[序号 技巧名称-中文 技巧名称-英文 技巧描述-中文 技巧描述-英文 技巧图片索引 技巧类型-中文 技巧类型-英文 技能推荐度 三方研究-中文 三方研究-英文]
fail_with("缺少字段") unless (required - headers).empty?
fail_with("没有数据") if table.empty?

position_table = CSV.read(POSITION_RECOMMENDATION_PATH, headers: true, encoding: "bom|utf-8")
position_headers = position_table.headers.map(&:to_s)
required_position_headers = %w[方案 方案ID 位置 定位 技能 推荐等级]
fail_with("位置推荐文件缺少字段") unless (required_position_headers - position_headers).empty?
position_recommendations = Hash.new { |hash, skill_name| hash[skill_name] = {} }
recommendation_plans = {}
skill_names = table.map { |row| row["技巧名称-中文"].to_s.strip }
fail_with("技巧名称-中文 存在重复") unless skill_names.uniq.length == skill_names.length
position_table.each do |row|
  plan_id = row["方案ID"].to_s.strip
  plan_label = row["方案"].to_s.strip
  position = row["位置"].to_s.strip
  profile = row["定位"].to_s.strip
  skill_name = row["技能"].to_s.strip
  level = Integer(row["推荐等级"].to_s, 10) rescue nil
  fail_with("位置推荐方案为空") if plan_id.empty? || plan_label.empty?
  fail_with("位置推荐中的位置无效：#{position}") unless POSITION_ORDER.include?(position)
  fail_with("位置推荐中的定位为空") if profile.empty?
  fail_with("位置推荐中的技能为空") if skill_name.empty?
  fail_with("位置推荐中的技能不存在于 player_skill.csv：#{skill_name}") unless skill_names.include?(skill_name)
  fail_with("技能 #{skill_name} 的位置推荐等级无效") unless level && POSITION_RECOMMENDATION_RANGE.include?(level)
  recommendation_plans[plan_id] ||= { label: plan_label, positions: Hash.new { |hash, key| hash[key] = [] } }
  recommendation_plans[plan_id][:positions][position] << profile unless recommendation_plans[plan_id][:positions][position].include?(profile)
  position_recommendations[skill_name][plan_id] ||= {}
  position_recommendations[skill_name][plan_id][position] ||= {}
  fail_with("方案 #{plan_label} 的 #{position} / #{profile} / #{skill_name} 推荐重复") if position_recommendations[skill_name][plan_id][position].key?(profile)
  position_recommendations[skill_name][plan_id][position][profile] = level
end

recommendation_skill_names = position_recommendations.keys
unknown_skills = recommendation_skill_names - skill_names
fail_with("位置推荐中存在未知技能：#{unknown_skills.join('、')}") unless unknown_skills.empty?

ids = table.map { |row| Integer(row["序号"].to_s, 10) rescue nil }
fail_with("序号必须连续且从 1 开始") unless ids == (1..table.length).to_a

split_categories = lambda do |value|
  value.to_s.split("、").map(&:strip).reject(&:empty?)
end

category_pairs = {}
skills = table.map do |row|
  zh_categories = split_categories.call(row["技巧类型-中文"])
  en_categories = split_categories.call(row["技巧类型-英文"])
  fail_with("序号 #{row["序号"]} 的技巧分类中英文数量不一致") unless zh_categories.length == en_categories.length

  categories = zh_categories.zip(en_categories).map do |label, name_en|
    fail_with("序号 #{row["序号"]} 的技巧分类为空") if name_en.empty? || label.empty?
    category_pairs[name_en] ||= { label: label, nameEn: name_en }
    fail_with("技巧分类 #{name_en} 的中文名称不一致") unless category_pairs[name_en][:label] == label
    name_en
  end.uniq

  image = row["技巧图片索引"].to_s.strip
  fail_with("序号 #{row["序号"]} 的图片索引无效") unless image.match?(/\A\d{2}\.png\z/)
  image = image.sub(/\.png\z/, '.webp')

  recommendation_text = row["技能推荐度"].to_s.strip
  recommendation = if recommendation_text == "—" || recommendation_text.empty?
    nil
  else
    recommendation_value = recommendation_text.count("★")
    fail_with("序号 #{row["序号"]} 的推荐度无效") unless recommendation_text.match?(/\A★{1,5}☆{0,4}\z/) && SKILL_RECOMMENDATION_RANGE.include?(recommendation_value)
    recommendation_value
  end

  skill = {
    id: Integer(row["序号"], 10),
    nameZh: row["技巧名称-中文"].to_s,
    nameEn: row["技巧名称-英文"].to_s,
    description: row["技巧描述-中文"].to_s,
    descriptionEn: row["技巧描述-英文"].to_s,
    categories: categories,
    image: "/skills/#{image}",
    recommendation: recommendation,
    positionRecommendations: position_recommendations[row["技巧名称-中文"].to_s.strip],
  }
  research_zh = row["三方研究-中文"].to_s
  research_en = row["三方研究-英文"].to_s
  skill[:researchZh] = research_zh unless research_zh.empty?
  skill[:researchEn] = research_en unless research_en.empty?
  skill
end

fail_with("技巧序号重复") unless skills.map { |skill| skill[:id] }.uniq.length == skills.length
json = ->(value) { JSON.generate(value, ensure_ascii: false) }
category_rows = category_pairs.map do |category, pair|
  "  { id: #{json.call(category)}, label: #{json.call(pair[:label])}, nameEn: #{json.call(pair[:nameEn])} },"
end.join("\n")
plan_rows = recommendation_plans.map do |plan_id, plan|
  positions = POSITION_ORDER.map do |position|
    profiles = plan[:positions][position]
    next if profiles.empty?

    "{ id: #{json.call(position)}, profiles: #{json.call(profiles)} }"
  end.compact.join(", ")
  "  { id: #{json.call(plan_id)}, label: #{json.call(plan[:label])}, positions: [#{positions}] },"
end.join("\n")
skill_rows = skills.map do |skill|
  fields = [
    "id: #{skill[:id]}",
    "nameZh: #{json.call(skill[:nameZh])}",
    "nameEn: #{json.call(skill[:nameEn])}",
    "description: #{json.call(skill[:description])}",
    "descriptionEn: #{json.call(skill[:descriptionEn])}",
    ("researchZh: #{json.call(skill[:researchZh])}" if skill.key?(:researchZh)),
    ("researchEn: #{json.call(skill[:researchEn])}" if skill.key?(:researchEn)),
    "categories: #{json.call(skill[:categories])}",
    "image: #{json.call(skill[:image])}",
    "recommendation: #{skill[:recommendation] || 'null'}",
    "positionRecommendations: #{json.call(skill[:positionRecommendations])}",
  ].compact.join(", ")
  "  { #{fields} },"
end.join("\n")

output = <<~TS
  // 此文件由 csv/player_skill.csv 自动生成，请勿直接编辑。
  export const skillCategories = [
    { id: 'all', label: '全部', nameEn: 'All' },
  #{category_rows}
  ] as const;

  export type SkillCategory = Exclude<(typeof skillCategories)[number]['id'], 'all'>;

  export const skillRecommendationPlans = [
  #{plan_rows}
  ] as const;

  export type SkillRecommendationPlanId = (typeof skillRecommendationPlans)[number]['id'];

  export const skillPositions = #{json.call(POSITION_ORDER)} as const;
  export type SkillPosition = (typeof skillPositions)[number];
  export type SkillPositionRecommendation = 1 | 2 | 3;

  export type PlayerSkill = {
    id: number;
    nameZh: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    researchZh?: string;
    researchEn?: string;
    categories: SkillCategory[];
    image: string;
    recommendation: 1 | 2 | 3 | 4 | 5 | null;
    positionRecommendations: Partial<Record<SkillRecommendationPlanId, Partial<Record<SkillPosition, Partial<Record<string, SkillPositionRecommendation>>>>>>;
  };

  export const playerSkills: PlayerSkill[] = [
  #{skill_rows}
  ];
TS

File.write(OUTPUT_PATH, output)
puts "已生成 #{OUTPUT_PATH}（#{skills.length} 条球员技巧）"
