#!/usr/bin/env ruby

require "csv"
require "json"

# 从技巧 CSV 生成 app/skills/data.ts。
# 技巧分类支持使用“、”分隔的多个分类，并保留 CSV 中的中英文描述、研究资料和图片索引。
# 别名、旧名称和技能推荐度暂不写入网页数据，因为当前页面没有对应字段。
ROOT = File.expand_path("..", __dir__)
CSV_PATH = File.join(ROOT, "csv/player_skill.csv")
OUTPUT_PATH = File.join(ROOT, "app/skills/data.ts")
CATEGORY_ORDER = %w[Showtime Shooting Dribbling Passing Defending Goalkeeping Other].freeze

def fail_with(message)
  abort("球员技巧生成失败：#{message}")
end

table = CSV.read(CSV_PATH, headers: true, encoding: "bom|utf-8")
headers = table.headers.map(&:to_s)
headers[0] = headers[0].sub(/^\uFEFF/, "")
required = %w[序号 技巧名称-中文 技巧名称-英文 技巧描述-中文 技巧描述-英文 技巧图片索引 技巧类型-中文 技巧类型-英文 三方研究-中文 三方研究-英文]
fail_with("缺少字段") unless (required - headers).empty?
fail_with("没有数据") if table.empty?

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
    fail_with("序号 #{row["序号"]} 的技巧分类不在允许列表") unless CATEGORY_ORDER.include?(name_en)
    category_pairs[name_en] ||= { label: label, nameEn: name_en }
    fail_with("技巧分类 #{name_en} 的中文名称不一致") unless category_pairs[name_en][:label] == label
    name_en
  end.uniq

  image = row["技巧图片索引"].to_s.strip
  fail_with("序号 #{row["序号"]} 的图片索引无效") unless image.match?(/\A\d{2}\.png\z/)

  skill = {
    id: Integer(row["序号"], 10),
    nameZh: row["技巧名称-中文"].to_s,
    nameEn: row["技巧名称-英文"].to_s,
    description: row["技巧描述-中文"].to_s,
    descriptionEn: row["技巧描述-英文"].to_s,
    categories: categories,
    image: "/skills/#{image}",
  }
  research_zh = row["三方研究-中文"].to_s
  research_en = row["三方研究-英文"].to_s
  skill[:researchZh] = research_zh unless research_zh.empty?
  skill[:researchEn] = research_en unless research_en.empty?
  skill
end

fail_with("技巧序号重复") unless skills.map { |skill| skill[:id] }.uniq.length == skills.length
json = ->(value) { JSON.generate(value, ensure_ascii: false) }
category_rows = CATEGORY_ORDER.select { |category| category_pairs.key?(category) }.map do |category|
  pair = category_pairs.fetch(category)
  "  { id: #{json.call(category)}, label: #{json.call(pair[:label])}, nameEn: #{json.call(pair[:nameEn])} },"
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
  };

  export const playerSkills: PlayerSkill[] = [
  #{skill_rows}
  ];
TS

File.write(OUTPUT_PATH, output)
puts "已生成 #{OUTPUT_PATH}（#{skills.length} 条球员技巧）"
