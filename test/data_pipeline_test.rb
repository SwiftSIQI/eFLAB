# frozen_string_literal: true

require 'csv'
require 'fileutils'
require 'minitest/autorun'
require 'open3'
require 'tmpdir'

ROOT = File.expand_path('..', __dir__)

class DataPipelineTest < Minitest::Test
  SKILLS = CSV.read(File.join(ROOT, 'csv/player_skill.csv'), headers: true, encoding: 'bom|utf-8')
  EXPERT_DIR = File.join(ROOT, 'csv/expert')

  def csv(path)
    CSV.read(File.join(ROOT, path), headers: true, encoding: 'bom|utf-8')
  end

  def test_expert_directory_honors_nouse_prefix
    files = Dir.glob(File.join(EXPERT_DIR, '*.csv')).sort
    active = files.reject { |path| File.basename(path).match?(/\Anouse(?:-|_)/i) }

    refute_empty active
    assert files.any? { |path| File.basename(path).match?(/\Anouse(?:-|_)/i) }
    assert_equal active.length, csv('csv/play_skill_rec_by_expert.csv').map { |row| row['方案ID'] }.uniq.length
  end

  def test_active_expert_files_match_skill_catalog
    expected = SKILLS.map { |row| row['技巧名称-中文'].to_s.strip }.sort
    active_files = Dir.glob(File.join(EXPERT_DIR, '*.csv')).sort.reject do |path|
      File.basename(path).match?(/\Anouse(?:-|_)/i)
    end

    active_files.each do |path|
      table = CSV.read(path, headers: true, encoding: 'bom|utf-8')
      skill_column = table.headers.find { |header| header.to_s.match?(/技能|技巧|名称|skill/i) }
      actual = table.map { |row| row[skill_column].to_s.strip }.reject(&:empty?).sort
      assert_equal expected, actual, "技能清单不一致：#{path}"
    end
  end

  def test_expert_output_has_valid_unique_records
    skills = SKILLS.map { |row| row['技巧名称-中文'].to_s.strip }
    table = csv('csv/play_skill_rec_by_expert.csv')
    keys = table.map { |row| row.values_at('方案ID', '位置', '定位', '技能') }

    refute_empty table
    assert_equal keys.uniq.length, keys.length
    assert table.all? { |row| skills.include?(row['技能']) }
    assert table.all? { |row| (1..3).include?(Integer(row['推荐等级'], 10)) }
  end

  def test_unknown_expert_skill_fails_during_normalization
    source = Dir.glob(File.join(EXPERT_DIR, '*.csv')).find do |path|
      !File.basename(path).match?(/\Anouse(?:-|_)/i)
    end

    Dir.mktmpdir do |directory|
      invalid = File.join(directory, File.basename(source))
      FileUtils.cp(source, invalid)
      content = File.read(invalid, encoding: 'bom|utf-8')
      content.sub!('一脚射门', '不存在的测试技能')
      File.write(invalid, content, encoding: 'utf-8')

      _output, error, status = Open3.capture3(
        'ruby',
        File.join(ROOT, 'script/normalize_skill_recommendations.rb'),
        '--expert-dir',
        directory,
        '--output',
        File.join(directory, 'output.csv'),
      )

      refute status.success?
      assert_includes error, '包含 player_skill.csv 中不存在的技能'
    end
  end

  def test_invalid_expert_rating_fails_during_normalization
    source = Dir.glob(File.join(EXPERT_DIR, '*.csv')).find do |path|
      !File.basename(path).match?(/\Anouse(?:-|_)/i)
    end

    Dir.mktmpdir do |directory|
      invalid = File.join(directory, File.basename(source))
      FileUtils.cp(source, invalid)
      content = File.read(invalid, encoding: 'bom|utf-8')
      content.sub!('★★', '★★推荐')
      File.write(invalid, content, encoding: 'utf-8')

      _output, error, status = Open3.capture3(
        'ruby',
        File.join(ROOT, 'script/normalize_skill_recommendations.rb'),
        '--expert-dir',
        directory,
        '--output',
        File.join(directory, 'output.csv'),
      )

      refute status.success?
      assert_includes error, '专家推荐等级格式无效'
    end
  end

  def test_generated_data_matches_source_counts
    generated = {
      'app/data.ts' => [csv('csv/player_style.csv').length, /nameZh: "/],
      'app/attributes/data.ts' => [csv('csv/player_ability.csv').length, /"nameZh":"/],
      'app/boosters/data.ts' => [csv('csv/player_booster.csv').length, /nameZh: "/],
      'app/skills/data.ts' => [SKILLS.length, /nameZh: "/],
    }

    generated.each do |path, (expected, marker)|
      content = File.read(File.join(ROOT, path), encoding: 'UTF-8')
      assert_equal expected, content.scan(marker).length, "生成产物数量不一致：#{path}"
    end
  end

  def test_attributes_and_boosters_share_one_catalog
    attributes = csv('csv/player_ability.csv')
    boosters = csv('csv/player_booster.csv')
    names = attributes.flat_map { |row| [row['属性名称-中文'], row['属性名称-英文']] }
    positions = %w[CF SS RWF/LWF AMF RMF/LMF CMF DMF RB/LB CB GK]
    attribute_headers = boosters.headers[4, boosters.headers.length - 4 - positions.length]

    assert_empty attribute_headers.reject { |name| names.include?(name) }
    boosters.each do |row|
      assert_equal 4, attribute_headers.count { |name| row[name].to_s.strip == '✓' }, row['序号']
    end
  end

  def test_skill_images_exist
    SKILLS.each do |row|
      source_image = row['技巧图片索引'].to_s.strip
      assert_match(/\A\d{2}\.png\z/, source_image)
      image = source_image.sub(/\.png\z/, '.webp')
      assert File.file?(File.join(ROOT, 'public', 'skills', image)), image
    end
    assert_empty Dir.glob(File.join(ROOT, 'public', 'skills', '*.png'))
  end

  def test_styles_use_known_positions
    allowed = %w[CF SS LWF RWF AMF LMF RMF CMF DMF LB CB RB GK]
    csv('csv/player_style.csv').each do |row|
      positions = row['生效位置'].to_s.split('/').map(&:strip)
      assert positions.all? { |position| allowed.include?(position) }, row['序号']
    end
  end
end
