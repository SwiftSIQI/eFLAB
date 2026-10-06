'use client';

import { CircleHelp, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ReferenceIntentOption } from '@/components/reference-intent-option';
import { ReferenceChoiceGrid } from '@/components/reference-choice-grid';
import { ReferenceFilterHeading } from '@/components/reference-filter-heading';
import { ReferenceRatingOptions } from '@/components/reference-rating-options';
import { ReferenceSearchField } from '@/components/reference-search-field';
import { ReferenceDebugPanel } from '@/components/reference-debug-panel';
import { ReferencePageIntro } from '@/components/reference-page-intro';
import { ReferenceSectionHeading } from '@/components/reference-section-heading';
import { SiteFooter } from '@/components/site-footer';
import externalLinks from '@/config/external-links.json';
import { normalizeSearchText } from '@/lib/utils';
import {
  getHighestPositionLevel,
  positionRecommendationLabels,
} from '@/lib/skill-recommendation';
import {
  playerSkills,
  skillCategories,
  skillRecommendationPlans,
  skillPositions,
  type PlayerSkill,
  type SkillPosition,
  type SkillPositionRecommendation,
  type SkillRecommendationPlanId,
} from './data';
import { skillComboGroups, type SkillComboId } from './skill-combos';
import { SkillCard } from './skill-card';

type Category = (typeof skillCategories)[number]['id'];
type SkillRecommendation = Exclude<PlayerSkill['recommendation'], null>;
type SkillIntent = 'lookup' | 'value' | 'recommend';
const isDebugBuild = import.meta.env.DEV || import.meta.env.MODE === 'test';
const skillIntentDescriptions: Record<SkillIntent, string> = {
  lookup: '搜索技巧中文或英文名称，查看它的实际作用。',
  recommend: '通过 1-5 星的方式来区分不同球员技巧的价值。',
  value: '根据球员位置、场上定位、技能推荐度等维度筛选出最合适的球员技巧。',
};
type SkillCategoryDefinition = Extract<
  (typeof skillCategories)[number],
  { id: Exclude<Category, 'all'> }
>;
const nonAllSkillCategories = skillCategories.filter(
  (item): item is SkillCategoryDefinition => item.id !== 'all',
);
const skillCategoryOrder: readonly Exclude<Category, 'all'>[] = [
  'Showtime',
  'Shooting',
  'Passing',
  'Dribbling',
  'Defending',
  'Goalkeeping',
  'Other',
];
const orderedSkillCategories: SkillCategoryDefinition[] = [
  ...skillCategoryOrder
    .map((id) => nonAllSkillCategories.find((item) => item.id === id))
    .filter((item): item is SkillCategoryDefinition => item !== undefined),
  ...nonAllSkillCategories.filter(
    (item) => !skillCategoryOrder.includes(item.id),
  ),
];
const allSkillCategory = skillCategories.find((item) => item.id === 'all');
if (!allSkillCategory) {
  throw new Error('技巧分类数据缺少 all 分类。');
}
const displaySkillCategories = [allSkillCategory, ...orderedSkillCategories];

type RecommendationPosition = {
  readonly id: SkillPosition;
  readonly profiles: readonly string[];
};
const recommendationLevels: SkillRecommendation[] = [
  ...new Set(
    playerSkills
      .map((skill) => skill.recommendation)
      .filter((level): level is SkillRecommendation => level !== null),
  ),
].sort((first, second) => second - first);
const maxRecommendationLevel = Math.max(...recommendationLevels, 0);
const positionRecommendationLevels: SkillPositionRecommendation[] = [
  ...new Set(
    playerSkills
      .flatMap((skill) =>
        Object.values(skill.positionRecommendations).flatMap((plan) =>
          Object.values(plan ?? {}).flatMap((position) =>
            Object.values(position ?? {}),
          ),
        ),
      )
      .filter(
        (level): level is SkillPositionRecommendation =>
          level !== null && level !== undefined,
      ),
  ),
].sort((first, second) => second - first);
const recommendationSourceUrls: Record<string, string> = {
  '冲啊大叔 CasToR':
    externalLinks.find((link) => link.id === 'skill-plan-castor')?.url ?? '',
  Skye: externalLinks.find((link) => link.id === 'skill-plan-skye')?.url ?? '',
};
const preferredRecommendationPlanLabels = ['冲啊大叔 CasToR'] as const;
const orderedRecommendationPlans = [...skillRecommendationPlans].sort(
  (first, second) => {
    const firstOrder = preferredRecommendationPlanLabels.indexOf(
      first.label as (typeof preferredRecommendationPlanLabels)[number],
    );
    const secondOrder = preferredRecommendationPlanLabels.indexOf(
      second.label as (typeof preferredRecommendationPlanLabels)[number],
    );
    return (
      (firstOrder === -1
        ? preferredRecommendationPlanLabels.length
        : firstOrder) -
      (secondOrder === -1
        ? preferredRecommendationPlanLabels.length
        : secondOrder)
    );
  },
);
const skillOverviewStats = [
  { label: '球员技能', value: playerSkills.length },
  ...orderedSkillCategories.map((item) => ({
    label: item.id === 'Showtime' ? 'ST 技能' : `${item.label}技能`,
    value: playerSkills.filter((skill) => skill.categories.includes(item.id))
      .length,
  })),
];

export function SkillsExplorer() {
  const [category, setCategory] = useState<Category>('all');
  const [skillIntent, setSkillIntent] = useState<SkillIntent>('lookup');
  const [query, setQuery] = useState('');
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<SkillRecommendation | null>(null);
  const [selectedPlan, setSelectedPlan] =
    useState<SkillRecommendationPlanId | null>(null);
  const [selectedPosition, setSelectedPosition] =
    useState<SkillPosition | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [selectedPositionRecommendation, setSelectedPositionRecommendation] =
    useState<SkillPositionRecommendation | null>(null);
  const [selectedSkillCombos, setSelectedSkillCombos] = useState<
    SkillComboId[]
  >([]);
  const [selectedOwnedSkillIds, setSelectedOwnedSkillIds] = useState<number[]>(
    [],
  );

  function selectSkillIntent(intent: SkillIntent) {
    setSkillIntent(intent);
    setCategory('all');
    setQuery('');
    setSelectedRecommendation(null);
    setSelectedPlan(null);
    setSelectedPosition(null);
    setSelectedProfile(null);
    setSelectedPositionRecommendation(null);
    setSelectedSkillCombos([]);
    setSelectedOwnedSkillIds([]);
  }

  const activePlan =
    selectedPlan === null
      ? undefined
      : skillRecommendationPlans.find((plan) => plan.id === selectedPlan);
  const activePosition = activePlan?.positions.find(
    (position) => position.id === selectedPosition,
  );
  const positionOptions: readonly RecommendationPosition[] =
    activePlan?.positions ?? skillPositions.map((id) => ({ id, profiles: [] }));

  const results = useMemo(() => {
    const keyword = skillIntent === 'lookup' ? normalizeSearchText(query) : '';
    const selectedComboSkillIds = new Set<number>(
      skillComboGroups
        .filter((group) => selectedSkillCombos.includes(group.id))
        .flatMap((group) => group.skillIds),
    );
    const filtered = playerSkills.filter((skill) => {
      const isSelectedComboSkill = selectedComboSkillIds.has(skill.id);
      const matchesPositionFilters =
        selectedPosition === null ||
        (selectedPlan !== null &&
          skill.positionRecommendations[selectedPlan]?.[selectedPosition] !==
            undefined &&
          (selectedProfile === null ||
            skill.positionRecommendations[selectedPlan]?.[selectedPosition]?.[
              selectedProfile
            ] !== undefined) &&
          (selectedPositionRecommendation === null ||
            (selectedProfile === null
              ? Object.values(
                  skill.positionRecommendations[selectedPlan]?.[
                    selectedPosition
                  ] ?? {},
                ).includes(selectedPositionRecommendation)
              : skill.positionRecommendations[selectedPlan]?.[
                  selectedPosition
                ]?.[selectedProfile] === selectedPositionRecommendation)));
      return (
        (category === 'all' || skill.categories.includes(category)) &&
        (selectedRecommendation === null ||
          skill.recommendation === selectedRecommendation) &&
        !selectedOwnedSkillIds.includes(skill.id) &&
        (matchesPositionFilters || isSelectedComboSkill) &&
        (!keyword ||
          normalizeSearchText(`${skill.nameZh} ${skill.nameEn}`).includes(
            keyword,
          ))
      );
    });
    return selectedPosition === null || selectedPlan === null
      ? filtered
      : filtered.sort((first, second) => {
          const firstLevel =
            selectedProfile === null
              ? getHighestPositionLevel(
                  first.positionRecommendations[selectedPlan]?.[
                    selectedPosition
                  ],
                )
              : (first.positionRecommendations[selectedPlan]?.[
                  selectedPosition
                ]?.[selectedProfile] ?? 0);
          const secondLevel =
            selectedProfile === null
              ? getHighestPositionLevel(
                  second.positionRecommendations[selectedPlan]?.[
                    selectedPosition
                  ],
                )
              : (second.positionRecommendations[selectedPlan]?.[
                  selectedPosition
                ]?.[selectedProfile] ?? 0);
          return secondLevel - firstLevel;
        });
  }, [
    category,
    query,
    skillIntent,
    selectedOwnedSkillIds,
    selectedPlan,
    selectedPosition,
    selectedPositionRecommendation,
    selectedProfile,
    selectedRecommendation,
    selectedSkillCombos,
  ]);

  const renderOwnedSkillCategory = (categoryItem: SkillCategoryDefinition) => {
    const categorySkills = playerSkills.filter((skill) =>
      skill.categories.includes(categoryItem.id),
    );
    return (
      <section
        key={categoryItem.id}
        className="owned-skill-category"
        aria-labelledby={`owned-skill-category-${categoryItem.id}`}
      >
        <h3 id={`owned-skill-category-${categoryItem.id}`}>
          {categoryItem.label}
          <span>{categoryItem.nameEn}</span>
        </h3>
        <div className="owned-skill-category-options">
          {categorySkills.map((skill) => {
            const selected = selectedOwnedSkillIds.includes(skill.id);
            return (
              <button
                key={skill.id}
                type="button"
                className={selected ? 'is-selected' : ''}
                onClick={() =>
                  setSelectedOwnedSkillIds((current) =>
                    selected
                      ? current.filter((id) => id !== skill.id)
                      : [...current, skill.id],
                  )
                }
                aria-pressed={selected}
              >
                {skill.nameZh}
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <main id="main-content" className="site-shell reference-page skills-page">
      {isDebugBuild && <ReferenceDebugPanel />}
      <section className="reference-workspace skills-reference-workspace">
        <ReferencePageIntro
          eyebrow="PLAYER SKILLS GUIDE"
          title="球员技巧"
          description={`${playerSkills.length} 个球员技巧分为 ${skillCategories.length - 1} 类，涵盖 ShowTime 技能、射门、盘带、传球、防守、守门和其他，帮助你快速了解每项技巧的效果与适用场景。`}
          stats={skillOverviewStats}
          className="skills-intro-copy"
        >
          <section
            className="usage-guide reference-intent-guide skill-intent-guide"
            aria-labelledby="skills-intent-title"
          >
            <div className="usage-guide-heading">
              <strong id="skills-intent-title">我想：</strong>
              <span>选择一个使用方式，开始筛选球员技巧。</span>
            </div>
            <div
              className="reference-intent-options"
              role="radiogroup"
              aria-labelledby="skills-intent-title"
            >
              <ReferenceIntentOption
                intent="lookup"
                selectedIntent={skillIntent}
                title="我想查询某个技巧的作用"
                description={skillIntentDescriptions.lookup}
                radioName="skill-intent"
                onSelect={selectSkillIntent}
              />
              <ReferenceIntentOption
                intent="recommend"
                selectedIntent={skillIntent}
                title="我想了解不同技巧的通用价值"
                description={skillIntentDescriptions.recommend}
                radioName="skill-intent"
                onSelect={selectSkillIntent}
              />
              <ReferenceIntentOption
                intent="value"
                selectedIntent={skillIntent}
                title="我想给球员添加合适的技巧"
                description={skillIntentDescriptions.value}
                radioName="skill-intent"
                onSelect={selectSkillIntent}
              />
            </div>
          </section>
        </ReferencePageIntro>
      </section>

      <div className="reference-query-layout">
        <section
          className="skills-workspace skills-filter-workspace reference-filter-section"
          aria-label="球员技巧筛选"
        >
          <div className="skills-controls reference-filter-panel reference-section-panel">
            <div className="skill-results">
              {skillIntent === 'lookup' && (
                <section className="skills-module skills-query-module">
                  <div className="skills-module-heading reference-filter-heading">
                    <ReferenceSectionHeading
                      eyebrow="SKILL SEARCH AREA"
                      title="技巧筛选区"
                      description={skillIntentDescriptions.lookup}
                      level="h2"
                    />
                  </div>
                  <div className="skill-search-row reference-toolbar">
                    <ReferenceSearchField
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onClear={() => setQuery('')}
                      label="搜索球员技巧"
                      placeholder="搜索技巧中文或英文名称…"
                    />
                  </div>
                </section>
              )}

              {skillIntent !== 'lookup' && (
                <section
                  className={`skills-module skills-recommendation-module skill-intent-${skillIntent}`}
                >
                  <div className="skills-module-heading reference-filter-heading">
                    <ReferenceSectionHeading
                      eyebrow="SKILL SEARCH AREA"
                      title="技巧筛选区"
                      description={skillIntentDescriptions[skillIntent]}
                      level="h2"
                    />
                  </div>
                  <div className="skill-position-filter">
                    <section
                      className="reference-filter-module position-filter"
                      aria-labelledby="skill-position-filter-title"
                    >
                      <ReferenceFilterHeading
                        headingId="skill-position-filter-title"
                        title="推荐方案"
                        description="先选择专家方案，再按位置和球员定位查看技巧"
                      />
                      <div className="recommendation-plan-options">
                        {orderedRecommendationPlans.map((plan) => {
                          const selected = selectedPlan === plan.id;
                          const sourceUrl =
                            recommendationSourceUrls[plan.label];
                          return (
                            <div
                              key={plan.id}
                              className={`recommendation-plan-option${selected ? ' is-selected' : ''}`}
                            >
                              <button
                                type="button"
                                className="recommendation-plan-select"
                                onClick={() => {
                                  setSelectedPlan(selected ? null : plan.id);
                                  setSelectedPosition(null);
                                  setSelectedProfile(null);
                                  setSelectedPositionRecommendation(null);
                                }}
                                aria-pressed={selected}
                                aria-describedby={
                                  sourceUrl
                                    ? `recommendation-plan-source-${plan.id}`
                                    : undefined
                                }
                              >
                                <span>{plan.label}</span>
                                <span
                                  className="recommendation-plan-info"
                                  aria-hidden="true"
                                >
                                  <CircleHelp />
                                </span>
                              </button>
                              {sourceUrl && (
                                <span
                                  id={`recommendation-plan-source-${plan.id}`}
                                  className="custom-filter-tooltip recommendation-source-tooltip"
                                  role="tooltip"
                                >
                                  推荐方案参考自{plan.label}的研究成果，
                                  <a
                                    href={sourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    查看相关资料
                                  </a>
                                  。
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    <section className="reference-filter-module position-filter">
                      <ReferenceFilterHeading
                        title="位置适配"
                        description={
                          selectedPlan === null
                            ? '请先选择专家方案'
                            : '选择位置后，按适配度优先显示技巧'
                        }
                      />
                      <ReferenceChoiceGrid
                        values={positionOptions.map((position) => position.id)}
                        selectedValue={selectedPosition}
                        onSelect={(position) => {
                          setSelectedPosition(position as SkillPosition | null);
                          setSelectedProfile(null);
                          setSelectedPositionRecommendation(null);
                        }}
                        disabled={selectedPlan === null}
                        className="position-options"
                      />
                      {selectedPosition !== null &&
                        activePosition &&
                        activePosition.profiles.length > 0 && (
                          <div className="skill-profile-filter">
                            <ReferenceFilterHeading
                              title="球员定位"
                              description="不同定位可以有不同的技能优先级"
                            />
                            {activePosition.profiles.length === 1 &&
                            String(activePosition.profiles[0]) === '通用' ? (
                              <p className="skill-profile-note">
                                <span aria-hidden="true">NOTE</span>
                                当前方案未在该位置做球员定位细化
                              </p>
                            ) : (
                              <ReferenceChoiceGrid
                                values={activePosition.profiles.filter(
                                  (profile) => profile !== '通用',
                                )}
                                selectedValue={selectedProfile}
                                onSelect={(profile) => {
                                  setSelectedProfile(profile);
                                  setSelectedPositionRecommendation(null);
                                }}
                                className="profile-options"
                              />
                            )}
                          </div>
                        )}
                    </section>
                    <section className="reference-filter-module position-filter skill-position-level-filter">
                      <ReferenceFilterHeading
                        title="位置适配等级"
                        description={
                          selectedPosition === null
                            ? '请先选择位置'
                            : '按必备、推荐或可选筛选'
                        }
                      />
                      <ReferenceChoiceGrid
                        values={positionRecommendationLevels}
                        selectedValue={selectedPositionRecommendation}
                        onSelect={setSelectedPositionRecommendation}
                        getLabel={(level) =>
                          positionRecommendationLabels[level]
                        }
                        disabled={selectedPlan === null}
                        className="position-level-options"
                      />
                    </section>
                    <section className="reference-filter-module skill-custom-filter">
                      <div className="position-filter-heading">
                        <div>
                          <h2>定制化技能组</h2>
                          <p>
                            右侧列表分类会切换到“全部”，并将球员技巧添加到列表下方。
                          </p>
                        </div>
                      </div>
                      <div className="custom-filter-options">
                        {skillComboGroups.map((group) => {
                          const selected = selectedSkillCombos.includes(
                            group.id,
                          );
                          const comboSkills = group.skillIds
                            .map(
                              (id) =>
                                playerSkills.find((skill) => skill.id === id)
                                  ?.nameZh,
                            )
                            .filter(Boolean)
                            .join('、');
                          return (
                            <div
                              key={group.id}
                              className={`custom-filter-option${selected ? ' is-selected' : ''}`}
                            >
                              <button
                                type="button"
                                className={`custom-filter-select${selected ? ' is-selected' : ''}`}
                                onClick={() => {
                                  setSelectedSkillCombos((current) =>
                                    selected
                                      ? current.filter((id) => id !== group.id)
                                      : [...current, group.id],
                                  );
                                  if (!selected) {
                                    setCategory('all');
                                  }
                                }}
                                aria-pressed={selected}
                              >
                                {group.label}
                              </button>
                              <span className="custom-filter-info-wrap">
                                <button
                                  type="button"
                                  className="custom-filter-info"
                                  aria-label={`查看${group.label}包含的技能`}
                                  aria-describedby={`skill-combo-${group.id}`}
                                >
                                  <CircleHelp aria-hidden="true" />
                                </button>
                                <span
                                  id={`skill-combo-${group.id}`}
                                  className="custom-filter-tooltip"
                                  role="tooltip"
                                >
                                  包含技能：{comboSkills || '暂无技能'}
                                </span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                    <section
                      className="reference-filter-module position-filter skill-recommendation-filter"
                      aria-labelledby="skill-recommendation-filter-title"
                    >
                      <div className="recommendation-filter-heading">
                        <div className="recommendation-title-with-info">
                          <div>
                            <div className="recommendation-heading-title">
                              <h2 id="skill-recommendation-filter-title">
                                {skillIntent === 'recommend'
                                  ? '技巧通用价值'
                                  : '技巧价值筛选器'}
                              </h2>
                              <span className="custom-filter-option recommendation-info-option">
                                <button
                                  type="button"
                                  className="recommendation-info-button"
                                  aria-label="查看技巧价值评分来源"
                                  aria-describedby="skill-recommendation-source"
                                >
                                  <CircleHelp aria-hidden="true" />
                                </button>
                                <span
                                  id="skill-recommendation-source"
                                  className="custom-filter-tooltip recommendation-source-tooltip"
                                  role="tooltip"
                                >
                                  技巧价值评分参考自珠海amadeusz的研究成果，
                                  <a
                                    href={
                                      externalLinks.find(
                                        (link) =>
                                          link.id === 'skill-value-source',
                                      )?.url
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    查看相关资料
                                  </a>
                                  。
                                </span>
                              </span>
                            </div>
                            <p>
                              {skillIntent === 'recommend'
                                ? '根据珠海amadeusz的研究成果，了解每个技巧的实际价值。'
                                : '按珠海 amadeusz 整理的技巧价值等级，筛选值得为球员添加的技巧。'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <ReferenceRatingOptions
                        levels={recommendationLevels}
                        maxLevel={maxRecommendationLevel}
                        selectedLevel={selectedRecommendation}
                        onSelect={setSelectedRecommendation}
                      />
                    </section>
                    <section className="reference-filter-module skill-owned-filter">
                      <div className="position-filter-heading">
                        <div>
                          <h2>剔除球员已有技能</h2>
                          <p>
                            通过剔除球员已经拥有的技能，帮助玩家更好的聚焦应该新增的技能。
                          </p>
                        </div>
                      </div>
                      <div className="owned-skill-options">
                        <div className="owned-skill-category-columns">
                          <div className="owned-skill-category-column">
                            {orderedSkillCategories
                              .filter((item) =>
                                ['Shooting', 'Goalkeeping', 'Other'].includes(
                                  item.id,
                                ),
                              )
                              .map(renderOwnedSkillCategory)}
                          </div>
                          <div className="owned-skill-category-column">
                            {orderedSkillCategories
                              .filter((item) =>
                                ['Passing', 'Dribbling', 'Defending'].includes(
                                  item.id,
                                ),
                              )
                              .map(renderOwnedSkillCategory)}
                          </div>
                        </div>
                        <div className="owned-skill-featured-category">
                          {renderOwnedSkillCategory(
                            orderedSkillCategories.find(
                              (item) => item.id === 'Showtime',
                            )!,
                          )}
                        </div>
                      </div>
                    </section>
                  </div>
                </section>
              )}
            </div>
          </div>
        </section>

        <section
          className="skills-workspace skills-list-workspace reference-content reference-results-section"
          aria-label="技巧列表"
        >
          <div className="skills-controls">
            <div className="skill-results reference-results-panel reference-section-panel">
              <div
                className="result-heading skill-result-heading reference-result-heading"
                aria-live="polite"
              >
                <ReferenceSectionHeading
                  eyebrow="SKILL RESULT LIST"
                  title="技巧结果列表"
                  level="h2"
                />
                <span className="skill-result-count">
                  显示 {results.length} / 共 {playerSkills.length}
                </span>
              </div>

              <nav className="skill-category-list" aria-label="技巧分类">
                {displaySkillCategories.map((item) => {
                  const count =
                    item.id === 'all'
                      ? playerSkills.length
                      : playerSkills.filter((skill) =>
                          skill.categories.includes(item.id),
                        ).length;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`skill-category ${category === item.id ? 'is-active' : ''}`}
                      onClick={() => setCategory(item.id)}
                      disabled={
                        selectedSkillCombos.length > 0 && item.id !== 'all'
                      }
                      aria-pressed={category === item.id}
                    >
                      <span>
                        {item.label}
                        <small>{item.nameEn}</small>
                      </span>
                      <b>{count}</b>
                    </button>
                  );
                })}
              </nav>

              <div className="skill-list">
                {results.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    selectedPlan={selectedPlan}
                    selectedPosition={selectedPosition}
                    selectedProfile={selectedProfile}
                    selectedPositionRecommendation={
                      selectedPositionRecommendation
                    }
                  />
                ))}
                {results.length === 0 && (
                  <div className="empty-state booster-empty">
                    <Search aria-hidden="true" />
                    <h3>没有找到相关技巧</h3>
                    <p>请尝试其他中文或英文关键词。</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
