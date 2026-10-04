#!/usr/bin/env ruby

require "csv"
require "json"

# 从属性 CSV 生成 app/attributes/data.ts。
# 属性记录的 id 直接使用 CSV 序号；分类 id 是网页筛选所需的稳定结构值，
# 中文名和英文名仍然全部来自 CSV。
ROOT = File.expand_path("..", __dir__)
CSV_PATH = File.join(ROOT, "csv/player_attributes.csv")
OUTPUT_PATH = File.join(ROOT, "app/attributes/data.ts")
CATEGORY_IDS = {
  "Attack" => "attacking",
  "Defence" => "defending",
  "Strength" => "athleticism",
}.freeze

def fail_with(message)
  abort("属性生成失败：#{message}")
end

table = CSV.read(CSV_PATH, headers: true, encoding: "bom|utf-8")
headers = table.headers.map(&:to_s)
required = %w[序号 属性名称-中文 属性名称-英文 属性分类-中文 属性分类-英文 属性描述-中文 属性描述-英文]
fail_with("缺少字段") unless (required - headers).empty?
fail_with("没有数据") if table.empty?

ids = table.map { |row| Integer(row["序号"].to_s, 10) rescue nil }
fail_with("序号必须连续且从 1 开始") unless ids == (1..table.length).to_a

categories = []
attributes = table.map do |row|
  category_en = row["属性分类-英文"].to_s.strip
  category_zh = row["属性分类-中文"].to_s.strip
  category_id = CATEGORY_IDS[category_en]
  fail_with("序号 #{row["序号"]} 的属性分类无效") if category_id.nil? || category_zh.empty?
  categories << { id: category_id, label: category_zh, nameEn: category_en } unless categories.any? { |item| item[:id] == category_id }

  {
    id: Integer(row["序号"], 10),
    nameZh: row["属性名称-中文"].to_s,
    nameEn: row["属性名称-英文"].to_s,
    category: category_id,
    descriptionZh: row["属性描述-中文"].to_s,
    descriptionEn: row["属性描述-英文"].to_s,
  }
end

fail_with("属性序号重复") unless attributes.map { |item| item[:id] }.uniq.length == attributes.length
json = ->(value) { JSON.generate(value, ensure_ascii: false) }

output = <<~TS
  // 此文件由 csv/player_attributes.csv 自动生成，请勿直接编辑。
  export const attributeCategories = #{json.call(categories)} as const;

  export type AttributeCategory = (typeof attributeCategories)[number]['id'];

  export const playerAttributes = #{json.call(attributes)} as const satisfies ReadonlyArray<{
    id: number;
    nameZh: string;
    nameEn: string;
    category: AttributeCategory;
    descriptionZh: string;
    descriptionEn: string;
  }>;

  export type AttributeId = (typeof playerAttributes)[number]['id'];

  export function getAttribute(id: AttributeId) {
    return playerAttributes.find((attribute) => attribute.id === id)!;
  }
TS

File.write(OUTPUT_PATH, output)
puts "已生成 #{OUTPUT_PATH}（#{attributes.length} 条球员属性）"
