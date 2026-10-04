#!/usr/bin/env ruby

require "csv"
require "json"

ROOT = File.expand_path("..", __dir__)
CSV_PATH = File.join(ROOT, "csv/player_skill_combo.csv")
SKILLS_CSV_PATH = File.join(ROOT, "csv/player_skill.csv")
OUTPUT_PATH = File.join(ROOT, "app/skills/skill-combos.ts")

def fail_with(message)
  abort("定制化技能组生成失败：#{message}")
end

table = CSV.read(CSV_PATH, headers: true, encoding: "bom|utf-8")
headers = table.headers.map(&:to_s)
headers[0] = headers[0].sub(/^\uFEFF/, "")
required = %w[序号 技能]
fail_with("缺少字段") unless (required - headers).empty?
group_names = headers.drop(2).reject(&:empty?)
fail_with("没有技能组") if group_names.empty?
fail_with("没有技能数据") if table.empty?

skill_table = CSV.read(SKILLS_CSV_PATH, headers: true, encoding: "bom|utf-8")
skill_names = skill_table.map { |row| row["技巧名称-中文"].to_s.strip }
ids = table.map { |row| Integer(row["序号"].to_s, 10) rescue nil }
fail_with("序号必须连续且从 1 开始") unless ids == (1..table.length).to_a
fail_with("技能组 CSV 与技能 CSV 行数不一致") unless table.length == skill_names.length

table.each_with_index do |row, index|
  fail_with("第 #{index + 1} 行技能名称不一致") unless row["技能"].to_s.strip == skill_names[index]
end

groups = group_names.map do |group_name|
  skill_ids = table.each_with_object([]) do |row, ids_for_group|
    ids_for_group << Integer(row["序号"].to_s, 10) if row[group_name].to_s.strip.match?(/\A(?:✓|√|是|true|1)\z/i)
  end
  { id: group_name, label: group_name, skillIds: skill_ids }
end

json = ->(value) { JSON.generate(value, ensure_ascii: false) }
group_rows = groups.map do |group|
  "  { id: #{json.call(group[:id])}, label: #{json.call(group[:label])}, skillIds: #{json.call(group[:skillIds])} },"
end.join("\n")

File.write(OUTPUT_PATH, <<~TS, encoding: "UTF-8")
  // 此文件由 csv/player_skill_combo.csv 自动生成，请勿直接编辑。
  export const skillComboGroups = [
  #{group_rows}
  ] as const;

  export type SkillComboId = (typeof skillComboGroups)[number]['id'];
TS

puts "已生成：#{OUTPUT_PATH}"
