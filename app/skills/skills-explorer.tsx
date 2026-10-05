'use client';

import { CircleHelp, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { SiteFooter } from '@/components/site-footer';
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
type RecommendationPosition = {
  readonly id: SkillPosition;
  readonly profiles: readonly string[];
};
const recommendationLevels = [
  5, 4, 3, 2, 1,
] as const satisfies readonly SkillRecommendation[];
const positionRecommendationLabels = {
  3: '必备',
  2: '推荐',
  1: '可选',
} as const;
const positionRecommendationLevels = [
  3, 2, 1,
] as const satisfies readonly SkillPositionRecommendation[];
const recommendationSourceUrls: Record<string, string> = {
  '冲啊大叔 CasToR': 'https://www.bilibili.com/video/BV1UuJazNE8s/',
  Skye:
    'https://docs.google.com/spreadsheets/u/0/d/1A33zBtq6cVTghg6ytROST6k70SRMSFoOxEkSvdXSeRk/htmlview?pli=1#gid=2081134566',
};
const getHighestPositionLevel = (
  values: Partial<Record<string, SkillPositionRecommendation>> | undefined,
) =>
  Math.max(
    0,
    ...Object.values(values ?? {}).filter(
      (level): level is SkillPositionRecommendation => level !== undefined,
    ),
  );
export function SkillsExplorer() {
  const [category, setCategory] = useState<Category>('all');
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
  const [selectedSkillCombo, setSelectedSkillCombo] =
    useState<SkillComboId | null>(null);
  const [selectedOwnedSkillIds, setSelectedOwnedSkillIds] = useState<number[]>(
    [],
  );

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
    const keyword = query.trim().toLocaleLowerCase();
    const selectedComboSkillIds =
      selectedPosition === null || selectedSkillCombo === null
        ? undefined
        : (skillComboGroups.find((group) => group.id === selectedSkillCombo)
            ?.skillIds as readonly number[] | undefined);
    const filtered = playerSkills.filter((skill) => {
      const matchesPositionFilters =
        selectedPosition === null ||
        (selectedPlan !== null &&
          skill.positionRecommendations[selectedPlan]?.[selectedPosition] !==
            undefined &&
          (selectedPosition === null ||
            selectedProfile === null ||
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
      const matchesSelectedCombo =
        selectedComboSkillIds === undefined ||
        selectedComboSkillIds.includes(skill.id);

      return (
        (category === 'all' || skill.categories.includes(category)) &&
        (selectedRecommendation === null ||
          skill.recommendation === selectedRecommendation) &&
        !selectedOwnedSkillIds.includes(skill.id) &&
        matchesPositionFilters &&
        matchesSelectedCombo &&
        (!keyword ||
          `${skill.nameZh} ${skill.nameEn} ${skill.description} ${skill.descriptionEn} ${skill.researchZh ?? ''} ${skill.researchEn ?? ''}`
            .toLocaleLowerCase()
            .includes(keyword))
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
    selectedOwnedSkillIds,
    selectedPlan,
    selectedPosition,
    selectedPositionRecommendation,
    selectedProfile,
    selectedRecommendation,
    selectedSkillCombo,
  ]);

  const activeCategory = skillCategories.find((item) => item.id === category)!;
  const overviewStats = [
    { label: '球员技能', value: playerSkills.length },
    ...skillCategories
      .filter((item) => item.id !== 'all')
      .map((item) => ({
        label: item.id === 'Showtime' ? 'ST 技能' : `${item.label}技能`,
        value: playerSkills.filter((skill) =>
          skill.categories.includes(item.id),
        ).length,
      })),
  ];

  return (
    <main id="main-content" className="site-shell reference-page skills-page">
      <section className="reference-workspace skills-reference-workspace">
        <header className="reference-intro">
          <p className="eyebrow">PLAYER SKILLS GUIDE</p>
          <h1>球员技巧</h1>
          <p>
            {playerSkills.length} 个球员技巧分为 {skillCategories.length - 1}{' '}
            类，涵盖 ShowTime
            技能、射门、盘带、传球、防守、守门和其他，帮助你快速了解每项技巧的效果与适用场景。
          </p>
          <div className="reference-stats" aria-label="球员技巧概览">
            {overviewStats.map((item) => (
              <span key={item.label}>
                <strong>{item.value}</strong>
                {item.label}
              </span>
            ))}
          </div>
        </header>
      </section>

      <section className="skills-workspace" aria-label="球员技巧查询">
        <div className="skills-controls">
          <nav className="skill-category-list" aria-label="技巧分类">
            {skillCategories.map((item) => {
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

          <div className="skill-results">
            <div className="skill-search-row">
              <label className="search-box">
                <span className="sr-only">搜索球员技巧</span>
                <Search aria-hidden="true" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索技巧名称或效果…"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="清除搜索"
                  >
                    <X aria-hidden="true" />
                  </button>
                )}
              </label>
            </div>

            <section
              className="recommendation-filter skill-recommendation-filter"
              aria-labelledby="skill-recommendation-filter-title"
            >
              <div className="recommendation-filter-heading">
                <div className="recommendation-title-with-info">
                  <div>
                    <div className="recommendation-heading-title">
                      <h2 id="skill-recommendation-filter-title">技巧价值</h2>
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
                            href="https://mp.weixin.qq.com/s/2QyJhO7otdglQJKDAKldwA"
                            target="_blank"
                            rel="noreferrer"
                          >
                            查看相关资料
                          </a>
                          。
                        </span>
                      </span>
                    </div>
                    <p>按价值等级筛选技巧</p>
                  </div>
                </div>
                {selectedRecommendation !== null && (
                  <button
                    type="button"
                    onClick={() => setSelectedRecommendation(null)}
                  >
                    显示全部
                  </button>
                )}
              </div>
              <div className="recommendation-options">
                {recommendationLevels.map((level) => {
                  const selected = selectedRecommendation === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      className={selected ? 'is-selected' : ''}
                      onClick={() =>
                        setSelectedRecommendation(selected ? null : level)
                      }
                      aria-pressed={selected}
                    >
                      <strong>{level} 星</strong>
                      <span aria-label={`${level} 颗星`}>
                        {'★'.repeat(level)}
                        <i>{'★'.repeat(5 - level)}</i>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section
              className="position-filter skill-position-filter"
              aria-labelledby="skill-position-filter-title"
            >
              <div className="position-filter-heading">
                <div>
                  <h2 id="skill-position-filter-title">推荐方案</h2>
                  <p>先选择专家方案，再按位置和球员定位查看技巧</p>
                </div>
                {selectedPlan !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlan(null);
                      setSelectedPosition(null);
                      setSelectedProfile(null);
                      setSelectedPositionRecommendation(null);
                      setSelectedSkillCombo(null);
                    }}
                  >
                    清除选择
                  </button>
                )}
              </div>
              <div className="recommendation-plan-options">
                {skillRecommendationPlans.map((plan) => {
                  const selected = selectedPlan === plan.id;
                  const sourceUrl = recommendationSourceUrls[plan.label];
                  return (
                    <div
                      key={plan.id}
                      className={`recommendation-plan-option${selected ? ' is-selected' : ''}`}
                    >
                      <button
                        type="button"
                        className="recommendation-plan-select"
                        onClick={() => {
                          setSelectedPlan(plan.id);
                          setSelectedPosition(null);
                          setSelectedProfile(null);
                          setSelectedPositionRecommendation(null);
                          setSelectedSkillCombo(null);
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
                          <a href={sourceUrl} target="_blank" rel="noreferrer">
                            查看相关资料
                          </a>
                          。
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="position-filter-heading">
                <div>
                  <h2>位置适配</h2>
                  <p>
                    {selectedPlan === null
                      ? '请先选择专家方案'
                      : '选择位置后，按适配度优先显示技巧'}
                  </p>
                </div>
                {selectedPosition !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPosition(null);
                      setSelectedProfile(null);
                      setSelectedPositionRecommendation(null);
                      setSelectedSkillCombo(null);
                    }}
                  >
                    显示全部
                  </button>
                )}
              </div>
              <div className="position-options">
                {positionOptions.map((position) => {
                  const selected = selectedPosition === position.id;
                  return (
                    <button
                      key={position.id}
                      type="button"
                      className={selected ? 'is-selected' : ''}
                      disabled={selectedPlan === null}
                      onClick={() => {
                        setSelectedPosition(selected ? null : position.id);
                        setSelectedProfile(null);
                        setSelectedPositionRecommendation(null);
                        setSelectedSkillCombo(null);
                      }}
                      aria-pressed={selected}
                    >
                      {position.id}
                    </button>
                  );
                })}
              </div>
              {selectedPosition !== null &&
                activePosition &&
                activePosition.profiles.length > 0 && (
                  <div className="skill-profile-filter">
                    <div className="position-filter-heading">
                      <div>
                        <h2>球员定位</h2>
                        <p>不同定位可以有不同的技能优先级</p>
                      </div>
                      {selectedProfile !== null &&
                        activePosition.profiles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProfile(null);
                              setSelectedPositionRecommendation(null);
                            }}
                          >
                            显示全部
                          </button>
                        )}
                    </div>
                    {activePosition.profiles.length === 1 &&
                    String(activePosition.profiles[0]) === '通用' ? (
                      <p className="skill-profile-note">
                        <span aria-hidden="true">NOTE</span>
                        当前方案未在该位置做球员定位细化
                      </p>
                    ) : (
                      <div className="profile-options">
                        {activePosition.profiles
                          .filter((profile) => profile !== '通用')
                          .map((profile) => (
                            <button
                              key={profile}
                              type="button"
                              className={
                                selectedProfile === profile ? 'is-selected' : ''
                              }
                              onClick={() => {
                                setSelectedProfile(
                                  selectedProfile === profile ? null : profile,
                                );
                                setSelectedPositionRecommendation(null);
                              }}
                              aria-pressed={selectedProfile === profile}
                            >
                              {profile}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              <div className="skill-position-level-filter">
                <div className="position-filter-heading">
                  <div>
                    <h2>位置适配等级</h2>
                    <p>
                      {selectedPosition === null
                        ? '请先选择位置'
                        : '按必备、推荐或可选筛选'}
                    </p>
                  </div>
                  {selectedPositionRecommendation !== null && (
                    <button
                      type="button"
                      onClick={() => setSelectedPositionRecommendation(null)}
                    >
                      显示全部
                    </button>
                  )}
                </div>
                <div className="position-level-options">
                  {positionRecommendationLevels.map((level) => {
                    const selected = selectedPositionRecommendation === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        className={selected ? 'is-selected' : ''}
                        disabled={selectedPosition === null}
                        onClick={() =>
                          setSelectedPositionRecommendation(
                            selected ? null : level,
                          )
                        }
                        aria-pressed={selected}
                      >
                        {positionRecommendationLabels[level]}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="skill-custom-filter">
                <div className="position-filter-heading">
                  <div>
                    <h2>定制化技能组</h2>
                    <p>选择技能组后，在下方展示对应技能</p>
                  </div>
                  {selectedSkillCombo !== null && (
                    <button
                      type="button"
                      onClick={() => setSelectedSkillCombo(null)}
                    >
                      显示全部
                    </button>
                  )}
                </div>
                <div className="custom-filter-options">
                  {skillComboGroups.map((group) => {
                    const selected = selectedSkillCombo === group.id;
                    const comboSkills = group.skillIds
                      .map(
                        (id) =>
                          playerSkills.find((skill) => skill.id === id)?.nameZh,
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
                          onClick={() =>
                            setSelectedSkillCombo(selected ? null : group.id)
                          }
                          aria-pressed={selected}
                          disabled={selectedPosition === null}
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
              </div>
              <div className="skill-owned-filter">
                <div className="position-filter-heading">
                  <div>
                    <h2>剔除球员已有技能</h2>
                    <p>
                      通过剔除球员已经拥有的技能，帮助玩家更好的聚焦应该新增的技能。
                    </p>
                  </div>
                  {selectedOwnedSkillIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedOwnedSkillIds([])}
                    >
                      清空已选
                    </button>
                  )}
                </div>
                <div className="owned-skill-options">
                  {playerSkills.map((skill) => {
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
              </div>
            </section>

            <div
              className="result-heading skill-result-heading"
              aria-live="polite"
            >
              <div>
                <p className="eyebrow">{activeCategory.nameEn.toUpperCase()}</p>
                <h2>
                  {category === 'Showtime' || category === 'Goalkeeping'
                    ? activeCategory.label
                    : `${activeCategory.label}技巧`}
                </h2>
              </div>
              <span className="skill-result-count">{results.length} 项</span>
            </div>

            <div className="skill-list">
              {results.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  selectedPlan={selectedPlan}
                  selectedPosition={selectedPosition}
                  selectedProfile={selectedProfile}
                  selectedPositionRecommendation={selectedPositionRecommendation}
                />
              ))}
              {results.length === 0 && (
                <div className="empty-state">
                  <Search aria-hidden="true" />
                  <h3>没有找到相关技巧</h3>
                  <p>试试其他分类或搜索词。</p>
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setQuery('')}
                  >
                    清除搜索
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
