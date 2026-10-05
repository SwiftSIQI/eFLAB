'use client';

import { Check, CircleHelp, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { SiteFooter } from '@/components/site-footer';
import { Input } from '@/components/ui/input';
import {
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

export function BoostersExplorer() {
  const [query, setQuery] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState<AttributeId[]>(
    [],
  );
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<BoosterRecommendation | null>(null);
  const [selectedPosition, setSelectedPosition] =
    useState<BoosterPosition | null>(null);

  function toggleAttribute(id: AttributeId) {
    setSelectedAttributes((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  const results = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase();
    return boosters.filter((booster) => {
      const text = `${booster.nameZh} ${booster.nameEn} ${booster.attributes
        .map((id) => {
          const item = getAttribute(id);
          return `${item.nameZh} ${item.nameEn}`;
        })
        .join(' ')}`.toLocaleLowerCase();
      return (
        (selectedPosition === null ||
          (
            boosterIdsByPosition[selectedPosition] as readonly BoosterId[]
          ).includes(booster.id)) &&
        (selectedRecommendation === null ||
          booster.recommendation === selectedRecommendation) &&
        selectedAttributes.every((attribute) =>
          (booster.attributes as readonly AttributeId[]).includes(attribute),
        ) &&
        (!keyword || text.includes(keyword))
      );
    });
  }, [query, selectedAttributes, selectedPosition, selectedRecommendation]);

  return (
    <main id="main-content" className="site-shell reference-page boosters-page">
      <section className="reference-workspace">
        <header className="reference-intro booster-intro">
          <p className="eyebrow">CRAFTABLE BOOSTERS</p>
          <h1>球员增能</h1>
          <p>
            有 {boosters.length} 个球员增能可以同时提升 {boosterAttributeCount}{' '}
            项球员属性，选择合适的增能可以进一步强化球员的场上竞争力。
          </p>
          <div className="reference-stats" aria-label="球员增能概览">
            <span>
              <strong>{boosters.length}</strong>球员增能
            </span>
          </div>
        </header>

        <section className="usage-guide" aria-labelledby="boosters-usage-title">
          <div className="usage-guide-heading">
            <p className="eyebrow">HOW TO USE</p>
            <h2 id="boosters-usage-title">增能查询怎么用？</h2>
            <p>根据球员位置、想提升的属性和增能价值逐步缩小结果。</p>
          </div>
          <ol className="usage-steps">
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
          </ol>
        </section>

        <div className="booster-toolbar">
          <label className="search-box reference-search">
            <span className="sr-only">搜索增能</span>
            <Search aria-hidden="true" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索增能或受益属性…"
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
          className="recommendation-filter"
          aria-labelledby="recommendation-filter-title"
        >
          <div className="recommendation-filter-heading">
            <div>
              <div className="recommendation-heading-title">
                <h2 id="recommendation-filter-title">增能价值</h2>
                <span className="booster-source-info">
                  <button
                    type="button"
                    aria-label="查看球员增能价值来源"
                    aria-describedby="booster-source"
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
          className="position-filter"
          aria-labelledby="position-filter-title"
        >
          <div className="position-filter-heading">
            <div>
              <h2 id="position-filter-title">球员位置</h2>
              <p>只显示该位置可通过随机增能代币获得的增能</p>
            </div>
            {selectedPosition !== null && (
              <button type="button" onClick={() => setSelectedPosition(null)}>
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
            {availableAttributes.map((item) => {
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

        <div className="booster-result-heading" aria-live="polite">
          <div>
            <p className="eyebrow">BOOSTER LIST</p>
            <h2>
              {selectedPosition
                ? `${selectedPosition} 可随机获得的增能`
                : selectedAttributes.length === 0
                  ? '全部增能'
                  : `同时提升「${selectedAttributes.map((id) => getAttribute(id).nameZh).join('＋')}」`}
            </h2>
          </div>
          <span>
            {results.length} / {boosters.length}
          </span>
        </div>

        <div className="booster-grid">
          {results.map((booster, index) => (
            <article key={booster.id} className="booster-card">
              <div className="booster-card-heading">
                <span className="booster-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>
                    {booster.nameZh}
                    <span className="booster-name-separator" aria-hidden="true">
                      {' '}
                      /{' '}
                    </span>
                    <span lang="en" className="booster-name-en">
                      {booster.nameEn}
                    </span>
                  </h3>
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
              <p className="booster-effect">
                提升以下 {boosterAttributeCount} 项球员属性
              </p>
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
                        {' '}
                        /{' '}
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
              <p>试试其他位置、星级、属性或关键词。</p>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
