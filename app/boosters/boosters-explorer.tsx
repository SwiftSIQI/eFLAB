'use client';

import { Check, CircleHelp, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { SiteFooter } from '@/components/site-footer';
import { ReferenceDebugPanel } from '@/components/reference-debug-panel';
import { ReferenceIntentOption } from '@/components/reference-intent-option';
import { ReferenceChoiceGrid } from '@/components/reference-choice-grid';
import { ReferenceFilterHeading } from '@/components/reference-filter-heading';
import { ReferenceRatingOptions } from '@/components/reference-rating-options';
import { ReferenceSearchField } from '@/components/reference-search-field';
import { ReferenceSectionHeading } from '@/components/reference-section-heading';
import { normalizeSearchText } from '@/lib/utils';
import {
  attributeCategories,
  getAttribute,
  playerAttributes,
  type AttributeId,
} from '../attributes/data';
import {
  boosterIdsByPosition,
  boosterPositions,
  boosters,
  type BoosterId,
  type BoosterPosition,
  type BoosterRecommendation,
} from './data';

const boosterAttributeCount = Math.max(
  ...boosters.map((booster) => booster.attributes.length),
  0,
);

const usedAttributeIds = new Set<AttributeId>(
  boosters.flatMap((booster) => [...booster.attributes]),
);
const availableAttributes = playerAttributes.filter((item) =>
  usedAttributeIds.has(item.id),
);
const recommendationLevels = [
  ...new Set(boosters.map((booster) => booster.recommendation)),
].sort((first, second) => second - first);
const maxRecommendationLevel = Math.max(...recommendationLevels, 0);
type BoosterIntent = 'lookup' | 'recommend';
const isDebugBuild = import.meta.env.DEV || import.meta.env.MODE === 'test';

export function BoostersExplorer() {
  const [query, setQuery] = useState('');
  const [boosterIntent, setBoosterIntent] = useState<BoosterIntent>('lookup');
  const [selectedAttributes, setSelectedAttributes] = useState<AttributeId[]>(
    [],
  );
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<BoosterRecommendation | null>(null);
  const [selectedPosition, setSelectedPosition] =
    useState<BoosterPosition | null>(null);
  const [respectRandomBoosterLimit, setRespectRandomBoosterLimit] =
    useState(false);
  const [showBoosterSource, setShowBoosterSource] = useState(false);

  function toggleAttribute(id: AttributeId) {
    setSelectedAttributes((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function selectBoosterIntent(intent: BoosterIntent) {
    setBoosterIntent(intent);
    setQuery('');
    setSelectedAttributes([]);
    setSelectedRecommendation(null);
    setSelectedPosition(null);
    setRespectRandomBoosterLimit(false);
  }

  const results = useMemo(() => {
    const keyword = normalizeSearchText(query);
    const isRecommendationMode = boosterIntent === 'recommend';
    return boosters.filter((booster) => {
      const matchesPosition =
        !isRecommendationMode ||
        selectedPosition === null ||
        !respectRandomBoosterLimit ||
        (
          boosterIdsByPosition[selectedPosition] as readonly BoosterId[]
        ).includes(booster.id);
      const matchesRecommendation =
        !isRecommendationMode ||
        selectedRecommendation === null ||
        booster.recommendation === selectedRecommendation;
      const matchesAttributes =
        !isRecommendationMode ||
        selectedAttributes.every((attribute) =>
          (booster.attributes as readonly AttributeId[]).includes(attribute),
        );
      const matchesKeyword =
        isRecommendationMode ||
        !keyword ||
        [booster.nameZh, booster.nameEn].some((name) =>
          normalizeSearchText(name).includes(keyword),
        );

      return (
        matchesPosition &&
        matchesRecommendation &&
        matchesAttributes &&
        matchesKeyword
      );
    });
  }, [
    boosterIntent,
    query,
    respectRandomBoosterLimit,
    selectedAttributes,
    selectedPosition,
    selectedRecommendation,
  ]);

  return (
    <main id="main-content" className="site-shell reference-page boosters-page">
      {isDebugBuild && <ReferenceDebugPanel />}
      <section className="reference-workspace">
        <div className="reference-intro reference-intro-layout">
          <ReferenceSectionHeading
            className="reference-hero-copy"
            eyebrow="CRAFTABLE BOOSTERS"
            title="球员增能"
            description={`有 ${boosters.length} 个球员增能可以同时提升 ${boosterAttributeCount} 项球员属性，选择合适的增能可以进一步强化球员的场上竞争力。`}
            level="h1"
          />
          <div className="reference-stats" aria-label="球员增能概览">
            <span>
              <strong>{boosters.length}</strong>球员增能
            </span>
          </div>
          <section
            className="usage-guide reference-intent-guide"
            aria-labelledby="boosters-usage-title"
          >
            <div className="usage-guide-heading">
              <strong id="boosters-usage-title">我想：</strong>
              <span>选择一个使用方式，开始查询增能。</span>
            </div>
            <div
              className="reference-intent-options"
              role="radiogroup"
              aria-labelledby="boosters-usage-title"
            >
              <ReferenceIntentOption
                intent="lookup"
                selectedIntent={boosterIntent}
                title="我想查询某个增能的作用"
                description="搜索增能中文或英文名称，查看它会增加哪些属性。"
                radioName="booster-intent"
                onSelect={selectBoosterIntent}
              />
              <ReferenceIntentOption
                intent="recommend"
                selectedIntent={boosterIntent}
                title="我想给球员添加合适的增能"
                description="根据球员位置、球员属性和增能价值等维度筛选出最合适的球员增能。"
                radioName="booster-intent"
                onSelect={selectBoosterIntent}
              />
            </div>
          </section>
        </div>
      </section>

      <section className="reference-filter-section" aria-label="增能筛选">
        <div className="reference-filter-panel reference-section-panel">
          <div className="reference-filter-heading">
            <ReferenceSectionHeading
              eyebrow="BOOSTER SEARCH AREA"
              title="增能筛选区"
              description={
                boosterIntent === 'lookup'
                  ? '搜索增能中文或英文名称，查看它会增加哪些属性。'
                  : '根据球员位置、球员属性和增能价值等维度筛选出最合适的球员增能。'
              }
              level="h2"
            />
          </div>
          {boosterIntent === 'lookup' && (
            <div className="reference-toolbar">
              <ReferenceSearchField
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onClear={() => setQuery('')}
                label="搜索增能"
                placeholder="搜索增能中文或英文名称…"
                className="reference-search"
              />
              {query && (
                <p className="booster-search-feedback" aria-live="polite">
                  {results.length > 0
                    ? `已匹配 ${results.length} 个增能`
                    : '没有匹配的增能，请尝试其他中文或英文关键词。'}
                </p>
              )}
            </div>
          )}

          {boosterIntent === 'recommend' && (
            <>
              <section
                className="reference-filter-module position-filter"
                aria-labelledby="position-filter-title"
              >
                <ReferenceFilterHeading
                  headingId="position-filter-title"
                  title="球员位置"
                  description="开启随机增能限制后，只显示该位置可通过随机增能代币获得的增能"
                  action={
                    selectedPosition !== null && (
                      <button type="button" onClick={() => setSelectedPosition(null)}>
                        显示全部
                      </button>
                    )
                  }
                />
                <ReferenceChoiceGrid
                  values={boosterPositions}
                  selectedValue={selectedPosition}
                  onSelect={setSelectedPosition}
                  className="position-options"
                />
              </section>

              <section
                className="reference-filter-module attribute-filter"
                aria-labelledby="attribute-filter-title"
              >
                <div className="attribute-filter-heading">
                  <div>
                    <h2 id="attribute-filter-title">想提升哪些属性？</h2>
                    <p>可多选；结果需同时提升所有已选属性。</p>
                  </div>
                  {selectedAttributes.length > 0 && (
                    <button
                      type="button"
                      className="attribute-filter-clear"
                      onClick={() => setSelectedAttributes([])}
                    >
                      清除 {selectedAttributes.length} 项
                    </button>
                  )}
                </div>
                <div className="attribute-options">
                  {attributeCategories.map((category) => {
                    const categoryAttributes = availableAttributes.filter(
                      (item) => item.category === category.id,
                    );
                    return (
                      <section
                        key={category.id}
                        className="attribute-category"
                        aria-labelledby={`attribute-category-${category.id}`}
                      >
                        <h3 id={`attribute-category-${category.id}`}>
                          {category.label}
                          <span>{category.nameEn}</span>
                        </h3>
                        <div className="attribute-category-options">
                          {categoryAttributes.map((item) => {
                            const selected = selectedAttributes.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                className={selected ? 'is-selected' : ''}
                                onClick={() => toggleAttribute(item.id)}
                                aria-pressed={selected}
                              >
                                <span className="attribute-check">
                                  {selected && <Check aria-hidden="true" />}
                                </span>
                                <span>
                                  {item.nameZh}
                                  <small>{item.nameEn}</small>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </section>

              <section
                className="reference-filter-module recommendation-filter"
                aria-labelledby="recommendation-filter-title"
              >
                <div className="recommendation-filter-heading">
                  <div>
                    <div className="recommendation-heading-title">
                      <h2 id="recommendation-filter-title">增能通用价值</h2>
                      <span
                        className={`booster-source-info${showBoosterSource ? ' is-visible' : ''}`}
                      >
                        <button
                          type="button"
                          aria-label="查看球员增能价值来源"
                          aria-describedby="booster-source"
                          aria-expanded={showBoosterSource}
                          onClick={() =>
                            setShowBoosterSource((current) => !current)
                          }
                        >
                          <CircleHelp aria-hidden="true" />
                        </button>
                        <span
                          id="booster-source"
                          className="custom-filter-tooltip recommendation-source-tooltip booster-source-tooltip"
                          role="tooltip"
                        >
                          球员增能价值参考自vearwu的研究成果，
                          <a
                            href="https://www.bilibili.com/video/BV1M3m3BaEuM/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            查看相关资料。
                          </a>
                        </span>
                      </span>
                    </div>
                    <p>按价值等级筛选增能</p>
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
                <ReferenceRatingOptions
                  levels={recommendationLevels}
                  maxLevel={maxRecommendationLevel}
                  selectedLevel={selectedRecommendation}
                  onSelect={setSelectedRecommendation}
                />
              </section>

              <section
                className="reference-filter-module random-limit-filter"
                aria-labelledby="random-limit-filter-title"
              >
                <ReferenceFilterHeading
                  headingId="random-limit-filter-title"
                  title="随机增能限制"
                  description="控制是否遵守游戏对随机增能的系统限制"
                />
                <ReferenceChoiceGrid
                  values={[false, true] as const}
                  selectedValue={respectRandomBoosterLimit}
                  onSelect={(value) =>
                    setRespectRandomBoosterLimit(value ?? false)
                  }
                  getLabel={(value) =>
                    value ? '开启随机增能限制' : '不开启随机增能限制'
                  }
                  className="random-limit-options"
                />
              </section>
            </>
          )}
        </div>
      </section>

      <section
        className="reference-content reference-results-section"
        aria-label="增能查询结果"
      >
        <div className="reference-results-panel reference-section-panel">
          <div
            className="reference-result-heading"
            aria-live="polite"
          >
            <ReferenceSectionHeading
              eyebrow="BOOSTER RESULT LIST"
              title="增能结果列表"
              level="h2"
            />
            <span>
              显示 {results.length} / 共 {boosters.length}
            </span>
          </div>

          <div className="booster-grid">
            {results.map((booster) => (
              <article
                key={booster.id}
                className="reference-result-card booster-card"
              >
                <div className="booster-card-heading">
                  <span className="booster-index">
                    {String(booster.id).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>
                      {booster.nameZh}
                      <span
                        className="booster-name-separator"
                        aria-hidden="true"
                      >
                        {' / '}
                      </span>
                      <span lang="en" className="booster-name-en">
                        {booster.nameEn}
                      </span>
                    </h3>
                    <p className="booster-effect">
                      提升以下 {boosterAttributeCount} 项球员属性
                    </p>
                  </div>
                  <div
                    className="booster-recommendation"
                    aria-label={`增能价值 ${booster.recommendation} 颗星`}
                  >
                    <strong>{booster.recommendation} 星</strong>
                    <span>
                      {'★'.repeat(booster.recommendation)}
                      <i>
                        {'★'.repeat(
                          maxRecommendationLevel - booster.recommendation,
                        )}
                      </i>
                    </span>
                  </div>
                </div>
                <div className="booster-attributes">
                  {booster.attributes.map((id) => {
                    const item = getAttribute(id);
                    return (
                      <span key={id}>
                        <strong>{item.nameZh}</strong>
                        <span
                          className="booster-name-separator"
                          aria-hidden="true"
                        >
                          {' / '}
                        </span>
                        <small lang="en">{item.nameEn}</small>
                      </span>
                    );
                  })}
                </div>
              </article>
            ))}
            {results.length === 0 && (
              <div className="empty-state booster-empty">
                <Search aria-hidden="true" />
                <h3>没有找到相关增能</h3>
                <p>
                  {boosterIntent === 'lookup'
                    ? '请尝试其他中文或英文关键词。'
                    : '请尝试其他位置、星级或属性组合。'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
