#!/usr/bin/env ruby

require "csv"
require "json"

# 从比赛风格 CSV 生成 app/data.ts。
# CSV 负责记录内容；positions 列表和攻防类型映射属于网页的数据结构。
# 运行前会校验序号、攻防类型和生效位置，生成文件不可直接手工编辑。
ROOT = File.expand_path("..", __dir__)
CSV_PATH = File.join(ROOT, "csv/player_style.csv")
OUTPUT_PATH = File.join(ROOT, "app/data.ts")
POSITIONS = %w[ALL CF SS LWF RWF AMF LMF RMF CMF DMF LB CB RB GK].freeze
SIDE_NAMES = { "进攻型" => "attack", "防守型" => "defense" }.freeze

def fail_with(message)
  abort("比赛风格生成失败：#{message}")
end

table = CSV.read(CSV_PATH, headers: true, encoding: "bom|utf-8")
headers = table.headers.map(&:to_s)
required = %w[序号 比赛风格名称-中文 比赛风格名称-英文 进攻型or防守型-中文 进攻型or防守型-英文 风格描述-中文 风格描述-英文 生效位置]
fail_with("缺少字段") unless (required - headers).empty?
fail_with("没有数据") if table.empty?

ids = table.map { |row| Integer(row["序号"].to_s, 10) rescue nil }
fail_with("序号必须连续且从 1 开始") unless ids == (1..table.length).to_a

styles = table.map do |row|
  name_zh = row["比赛风格名称-中文"].to_s.strip
  name_en = row["比赛风格名称-英文"].to_s.strip
  side_zh = row["进攻型or防守型-中文"].to_s.strip
  side_en = row["进攻型or防守型-英文"].to_s.strip
  positions = row["生效位置"].to_s.split("/").map(&:strip).reject(&:empty?)

  fail_with("序号 #{row["序号"]} 缺少比赛风格名称") if name_zh.empty? || name_en.empty?
  fail_with("序号 #{row["序号"]} 的攻防类型无效") unless SIDE_NAMES.key?(side_zh) && side_en == SIDE_NAMES.fetch(side_zh)
  fail_with("序号 #{row["序号"]} 没有生效位置") if positions.empty?
  fail_with("序号 #{row["序号"]} 含有无效位置") unless positions.all? { |position| POSITIONS.include?(position) }

  {
    id: Integer(row["序号"], 10),
    side: SIDE_NAMES.fetch(side_zh),
    nameZh: name_zh,
    nameEn: name_en,
    positions: positions,
    descriptionZh: row["风格描述-中文"].to_s,
    descriptionEn: row["风格描述-英文"].to_s,
  }
end

json = ->(value) { JSON.generate(value, ensure_ascii: false) }
output = <<~TS
  // 此文件由 csv/player_style.csv 自动生成，请勿直接编辑。
  export type Side = 'attack' | 'defense';

  export type PlayingStyle = {
    id: number;
    side: Side;
    nameZh: string;
    nameEn: string;
    positions: string[];
    descriptionZh: string;
    descriptionEn: string;
  };

  export const positions = #{json.call(POSITIONS)} as const;

  export const styles: PlayingStyle[] = [
  #{styles.map { |style|
    <<~STYLE.chomp
      {
        id: #{style[:id]},
        side: #{json.call(style[:side])},
        nameZh: #{json.call(style[:nameZh])},
        nameEn: #{json.call(style[:nameEn])},
        positions: #{json.call(style[:positions])},
        descriptionZh: #{json.call(style[:descriptionZh])},
        descriptionEn: #{json.call(style[:descriptionEn])},
      },
    STYLE
  }.join("\n").gsub(/^/, "  ")}
  ];
TS

File.write(OUTPUT_PATH, output)
puts "已生成 #{OUTPUT_PATH}（#{styles.length} 条比赛风格）"
