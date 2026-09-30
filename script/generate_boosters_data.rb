#!/usr/bin/env ruby

require "csv"
require "json"

# 从增能 CSV 生成 app/boosters/data.ts。
# 属性序号按照 CSV 中属性字段的列顺序对应，位置列中的非空值生成位置增能列表。
# 推荐度从“增能推荐度”的星级文本转换为 1～5 的数字。
ROOT = File.expand_path("..", __dir__)
CSV_PATH = File.join(ROOT, "csv/player_booster.csv")
OUTPUT_PATH = File.join(ROOT, "app/boosters/data.ts")
POSITIONS = %w[CF SS RWF/LWF AMF RMF/LMF CMF DMF RB/LB CB GK].freeze
FIXED_HEADERS = %w[序号 增能-中文 增能-英文 增能推荐度].freeze

def fail_with(message)
  abort("增能生成失败：#{message}")
end

table = CSV.read(CSV_PATH, headers: true, encoding: "bom|utf-8")
headers = table.headers.map(&:to_s)
headers[0] = headers[0].sub(/^\uFEFF/, "")
fail_with("缺少基础字段") unless (FIXED_HEADERS - headers).empty?
fail_with("位置字段不符合规范") unless headers.last(POSITIONS.length) == POSITIONS
attribute_headers = headers[FIXED_HEADERS.length, headers.length - FIXED_HEADERS.length - POSITIONS.length]
fail_with("没有属性字段") if attribute_headers.nil? || attribute_headers.empty?
fail_with("没有数据") if table.empty?

ids = table.map { |row| Integer(row["序号"].to_s, 10) rescue nil }
fail_with("序号必须连续且从 1 开始") unless ids == (1..table.length).to_a

attribute_ids = attribute_headers.each_with_index.to_h { |name, index| [name, index + 1] }
boosters = table.map do |row|
  recommendation = row["增能推荐度"].to_s.strip.delete_suffix("星")
  recommendation = Integer(recommendation, 10) rescue nil
  fail_with("序号 #{row["序号"]} 的推荐度无效") unless recommendation && (1..5).include?(recommendation)

  attributes = attribute_headers.each_with_object([]) do |name, selected|
    selected << attribute_ids.fetch(name) if row[name].to_s.strip == "✓"
  end
  fail_with("序号 #{row["序号"]} 没有四项属性") unless attributes.length == 4

  {
    id: Integer(row["序号"], 10),
    nameZh: row["增能-中文"].to_s,
    nameEn: row["增能-英文"].to_s,
    recommendation: recommendation,
    attributes: attributes,
  }
end

position_ids = POSITIONS.to_h do |position|
  ids = table.each_with_object([]) do |row, selected|
    selected << Integer(row["序号"], 10) if row[position].to_s.strip != ""
  end
  [position, ids]
end
json = ->(value) { JSON.generate(value, ensure_ascii: false) }
booster_rows = boosters.map do |booster|
  "  { id: #{booster[:id]}, nameZh: #{json.call(booster[:nameZh])}, nameEn: #{json.call(booster[:nameEn])}, recommendation: #{booster[:recommendation]}, attributes: #{json.call(booster[:attributes])} },"
end.join("\n")
position_rows = position_ids.map { |position, ids| "  #{JSON.generate(position)}: #{json.call(ids)}," }.join("\n")

output = <<~TS
  import type { AttributeId } from '../attributes/data';

  // 此文件由 csv/player_booster.csv 自动生成，请勿直接编辑。
  export type BoosterRecommendation = 1 | 2 | 3 | 4 | 5;

  export const boosters = [
  #{booster_rows}
  ] as const satisfies ReadonlyArray<{
    id: number;
    nameZh: string;
    nameEn: string;
    recommendation: BoosterRecommendation;
    attributes: readonly AttributeId[];
  }>;

  export const boosterPositions = #{json.call(POSITIONS)} as const;

  export type BoosterPosition = (typeof boosterPositions)[number];
  export type BoosterId = (typeof boosters)[number]['id'];

  export const boosterIdsByPosition = {
  #{position_rows}
  } as const satisfies Record<BoosterPosition, readonly BoosterId[]>;
TS

File.write(OUTPUT_PATH, output)
puts "已生成 #{OUTPUT_PATH}（#{boosters.length} 条增能）"
