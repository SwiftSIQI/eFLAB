'use client';

import { Activity, Search, Shield, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { SiteFooter } from '@/components/site-footer';
import { Input } from '@/components/ui/input';
import { attributeCategories, playerAttributes, type AttributeCategory } from './data';

type CategoryFilter = 'all' | AttributeCategory;

const categoryIcons = {
  attacking: Sparkles,
  defending: Shield,
  athleticism: Activity,
} as const;

export function AttributesExplorer() {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase();
    return playerAttributes.filter((attribute) =>
      (category === 'all' || attribute.category === category) &&
      (!keyword || `${attribute.nameZh} ${attribute.nameEn}`.toLocaleLowerCase().includes(keyword)),
    );
  }, [category, query]);

  return (
    <main className="site-shell reference-page attributes-page">
      <section className="reference-workspace">
        <header className="reference-intro">
          <p className="eyebrow">PLAYER ATTRIBUTES</p>
          <h1>球员属性</h1>
          <p>26 项球员属性分为进攻、防守和身体素质 3 大类。属性价值与实战意义将持续补充。</p>
          <div className="reference-stats" aria-label="属性概览">
            {attributeCategories.map((item) => (
              <span key={item.id}><strong>{playerAttributes.filter((attribute) => attribute.category === item.id).length}</strong>{item.label}</span>
            ))}
          </div>
        </header>

        <div className="reference-toolbar">
          <div className="reference-tabs" aria-label="属性分类">
            <button type="button" className={category === 'all' ? 'is-active' : ''} onClick={() => setCategory('all')} aria-pressed={category === 'all'}>全部</button>
            {attributeCategories.map((item) => (
              <button key={item.id} type="button" className={category === item.id ? `is-active ${item.id}` : item.id} onClick={() => setCategory(item.id)} aria-pressed={category === item.id}>
                {item.label}<small>{item.nameEn}</small>
              </button>
            ))}
          </div>
          <label className="search-box reference-search">
            <span className="sr-only">搜索球员属性</span>
            <Search aria-hidden="true" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索中英文属性…" />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="清除搜索"><X aria-hidden="true" /></button>}
          </label>
        </div>

        <div className="attribute-groups">
          {attributeCategories.map((group) => {
            const attributes = results.filter((attribute) => attribute.category === group.id);
            const Icon = categoryIcons[group.id];
            if (attributes.length === 0) return null;
            return (
              <section key={group.id} className={`attribute-group ${group.id}`}>
                <div className="attribute-group-heading">
                  <span><Icon aria-hidden="true" /></span>
                  <div><p>{group.nameEn}</p><h2>{group.label}</h2></div>
                  <b>{attributes.length}</b>
                </div>
                <div className="attribute-grid">
                  {attributes.map((attribute) => (
                    <article key={attribute.id} className="attribute-card">
                      <div>
                        <h3>{attribute.nameZh}</h3>
                        <p lang="en">{attribute.nameEn}</p>
                      </div>
                      <span className="pending-note">价值与意义 · 待补充</span>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
          {results.length === 0 && <div className="empty-state"><Search aria-hidden="true" /><h3>没有找到相关属性</h3><p>试试其他分类或关键词。</p></div>}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
