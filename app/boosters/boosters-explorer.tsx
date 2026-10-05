'use client';

import { Check, CircleHelp, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { SiteFooter } from '@/components/site-footer';
import { ReferenceDebugPanel } from '@/components/reference-debug-panel';
import { ReferenceIntentOption } from '@/components/reference-intent-option';
import { ReferenceSectionHeading } from '@/components/reference-section-heading';
import { Input } from '@/components/ui/input';
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
  const [expandedBoosterIntent, setExpandedBoosterIntent] =
    useState<BoosterIntent | null>(null);
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

  function toggleBoosterIntent(intent: BoosterIntent) {
    setExpandedBoosterIntent((current) => (current === intent ? null : intent));
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
                expanded={expandedBoosterIntent === 'lookup'}
                detailId="booster-lookup-steps"
                onToggle={toggleBoosterIntent}
              >
                <ol
                  id="booster-lookup-steps"
                  className="usage-steps reference-intent-detail reference-intent-lookup-steps"
                >
                  <li>
                    <strong>搜索增能名称</strong>
                    <span>
                      在搜索框输入增能的中文或英文名称，即可查看该增能对属性的提升情况。
                    </span>
                  </li>
                </ol>
              </ReferenceIntentOption>
              <ReferenceIntentOption
                intent="recommend"
                selectedIntent={boosterIntent}
                title="我想给球员添加合适的增能"
                description="根据球员位置、球员属性和增能价值等维度筛选出最合适的球员增能。"
                radioName="booster-intent"
                onSelect={selectBoosterIntent}
                expanded={expandedBoosterIntent === 'recommend'}
                detailId="booster-recommend-steps"
                onToggle={toggleBoosterIntent}
              >
                <ol
                  id="booster-recommend-steps"
                  className="usage-steps reference-intent-detail"
                >
                  <li>
                    <strong>选择球员位置</strong>
                    <span>只显示该位置可以通过随机增能代币获得的增能。</span>
                  </li>
                  <li>
                    <strong>选择想提升的属性</strong>
                    <span>支持多选，结果会同时满足所有已选属性。</span>
                  </li>
                  <li>
                    <strong>选择增能价值</strong>
                    <span>按必备、推荐或可选查看不同优先级的增能。</span>
                  </li>
                  <li>
                    <strong>设置随机增能限制</strong>
                    <span>根据需要决定是否遵守游戏对随机增能的系统限制。</span>
                  </li>
                </ol>
              </ReferenceIntentOption>
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
              <label className="search-box reference-search">
                <span className="sr-only">搜索增能</span>
                <Search aria-hidden="true" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索增能中文或英文名称…"
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
                className="position-filter"
                aria-labelledby="position-filter-title"
              >
                <div className="position-filter-heading">
                  <div>
                    <h2 id="position-filter-title">球员位置</h2>
                    <p>只显示该位置可通过随机增能代币获得的增能</p>
                  </div>
                  {selectedPosition !== null && (
                    <button
                      type="button"
                      onClick={() => setSelectedPosition(null)}
                    >
                      显示全部
                    </button>
                  )}
                </div>
                <div className="position-options">
                  {boosterPositions.map((position) => {
                    const selected = selectedPosition === position;
                    return (
                      <button
                        key={position}
                        type="button"
                        className={selected ? 'is-selected' : ''}
                        onClick={() =>
                          setSelectedPosition(selected ? null : position)
                        }
                        aria-pressed={selected}
                      >
                        {position}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section
                className="attribute-filter"
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
                className="recommendation-filter reference-filter-module"
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
                          <i>{'★'.repeat(maxRecommendationLevel - level)}</i>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section
                className="random-limit-filter"
                aria-labelledby="random-limit-filter-title"
              >
                <div className="position-filter-heading">
                  <div>
                    <h2 id="random-limit-filter-title">随机增能限制</h2>
                    <p>控制是否遵守游戏对随机增能的系统限制</p>
                  </div>
                </div>
                <div className="random-limit-options">
                  {[false, true].map((enabled) => (
                    <button
                      key={String(enabled)}
                      type="button"
                      className={
                        respectRandomBoosterLimit === enabled
                          ? 'is-selected'
                          : ''
                      }
                      onClick={() => setRespectRandomBoosterLimit(enabled)}
                      aria-pressed={respectRandomBoosterLimit === enabled}
                    >
                      {enabled ? '开启随机增能限制' : '不开启随机增能限制'}
                    </button>
                  ))}
                </div>
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
              <article key={booster.id} className="booster-card">
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
