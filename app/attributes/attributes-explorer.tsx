'use client';

import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { SiteFooter } from '@/components/site-footer';
import { Input } from '@/components/ui/input';
import {
  attributeCategories,
  playerAttributes,
  type AttributeCategory,
} from './data';

type CategoryFilter = 'all' | AttributeCategory;

export function AttributesExplorer() {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase();
    return playerAttributes.filter(
      (attribute) =>
        (category === 'all' || attribute.category === category) &&
        (!keyword ||
          `${attribute.nameZh} ${attribute.nameEn} ${attribute.descriptionZh} ${attribute.descriptionEn}`
            .toLocaleLowerCase()
            .includes(keyword)),
    );
  }, [category, query]);

  const activeCategory =
    category === 'all'
      ? { label: '全部', nameEn: 'All' }
      : attributeCategories.find((item) => item.id === category)!;

  return (
    <main id="main-content" className="site-shell reference-page attributes-page">
      <section className="reference-workspace">
        <header className="reference-intro">
          <p className="eyebrow">PLAYER ATTRIBUTES</p>
          <h1>球员属性</h1>
          <p>
            {playerAttributes.length} 项球员属性分为
            {attributeCategories.length} 大类，包含游戏内中英文说明。
          </p>
          <div className="reference-stats" aria-label="属性概览">
            <span>
              <strong>{playerAttributes.length}</strong>球员属性
            </span>
            {attributeCategories.map((item) => (
              <span key={item.id}>
                <strong>
                  {
                    playerAttributes.filter(
                      (attribute) => attribute.category === item.id,
                    ).length
                  }
                </strong>
                {item.label}
              </span>
            ))}
          </div>
        </header>
      </section>

      <section
        className="skills-workspace attribute-explorer-workspace"
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
              const count = playerAttributes.filter(
                (attribute) => attribute.category === item.id,
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
                <span className="sr-only">搜索球员属性</span>
                <Search aria-hidden="true" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索属性名称或描述…"
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
                <div className="empty-state">
                  <Search aria-hidden="true" />
                  <h3>没有找到相关属性</h3>
                  <p>试试其他分类或关键词。</p>
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
