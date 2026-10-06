'use client';

import { useMemo, useState } from 'react';

import { ReferenceEmptyState } from '@/components/reference-empty-state';
import { SiteFooter } from '@/components/site-footer';
import { ReferencePageIntro } from '@/components/reference-page-intro';
import { ReferenceSearchField } from '@/components/reference-search-field';
import { normalizeSearchText } from '@/lib/utils';
import { useReferenceSearch } from '@/lib/use-reference-search';
import {
  attributeCategories,
  playerAttributes,
  type AttributeCategory,
} from './data';

type CategoryFilter = 'all' | AttributeCategory;

const attributeCounts = new Map(
  attributeCategories.map((category) => [
    category.id,
    playerAttributes.filter((attribute) => attribute.category === category.id)
      .length,
  ]),
);

export function AttributesExplorer() {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const { query, keyword, setQuery, clearQuery } = useReferenceSearch();

  const results = useMemo(() => {
    return playerAttributes.filter(
      (attribute) =>
        (category === 'all' || attribute.category === category) &&
        (!keyword ||
          normalizeSearchText(
            `${attribute.nameZh} ${attribute.nameEn} ${attribute.descriptionZh} ${attribute.descriptionEn}`,
          ).includes(keyword)),
    );
  }, [category, keyword]);

  const activeCategory =
    category === 'all'
      ? { label: '全部', nameEn: 'All' }
      : attributeCategories.find((item) => item.id === category)!;

  return (
    <main
      id="main-content"
      className="site-shell reference-page"
    >
      <section className="reference-workspace">
        <ReferencePageIntro
          eyebrow="PLAYER ATTRIBUTES"
          title="球员属性"
          description={`${playerAttributes.length} 项球员属性分为 ${attributeCategories.length} 大类，包含游戏内中英文说明。`}
        />
      </section>

      <section
        className="skills-workspace"
        aria-label="球员属性查询"
      >
        <div className="skills-controls">
          <nav
            className="skill-category-list attribute-category-list"
            aria-label="属性分类"
          >
            <button
              type="button"
              className={`skill-category ${category === 'all' ? 'is-active' : ''}`}
              onClick={() => setCategory('all')}
              aria-pressed={category === 'all'}
            >
              <span>
                全部<small>All</small>
              </span>
              <b>{playerAttributes.length}</b>
            </button>
            {attributeCategories.map((item) => {
              const count = attributeCounts.get(item.id) ?? 0;
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
              <ReferenceSearchField
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onClear={() => setQuery('')}
                label="搜索球员属性"
                placeholder="搜索属性名称或描述…"
              />
            </div>

            <div
              className="result-heading attribute-result-heading"
              aria-live="polite"
            >
              <div>
                <p className="eyebrow">{activeCategory.nameEn.toUpperCase()}</p>
                <h2>{activeCategory.label}</h2>
              </div>
              <span className="skill-result-count">{results.length} 项</span>
            </div>

            <div className="attribute-list">
              {results.map((attribute) => (
                <article
                  key={attribute.id}
                  className={`attribute-card ${attribute.category}`}
                >
                  <div>
                    <div className="attribute-title-row">
                      <h3>
                        {attribute.nameZh}
                        <span lang="en"> / {attribute.nameEn}</span>
                      </h3>
                      <span className="attribute-number">
                        {String(attribute.id).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="attribute-description">
                      {attribute.descriptionZh}
                    </p>
                    <p className="attribute-description" lang="en">
                      {attribute.descriptionEn}
                    </p>
                  </div>
                </article>
              ))}
              {results.length === 0 && (
                <ReferenceEmptyState
                  title="没有找到相关属性"
                  description="试试其他分类或关键词。"
                  actionLabel="清除搜索"
                  onAction={clearQuery}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
