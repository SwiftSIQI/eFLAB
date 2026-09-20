'use client';

import { Check, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { SiteFooter } from '@/components/site-footer';
import { Input } from '@/components/ui/input';
import { getAttribute, playerAttributes, type AttributeId } from '../attributes/data';
import { boosters } from './data';

const usedAttributeIds = new Set<AttributeId>(boosters.flatMap((booster) => [...booster.attributes]));
const availableAttributes = playerAttributes.filter((item) => usedAttributeIds.has(item.id));

export function BoostersExplorer() {
  const [query, setQuery] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState<AttributeId[]>([]);

  function toggleAttribute(id: AttributeId) {
    setSelectedAttributes((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  const results = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase();
    return boosters.filter((booster) => {
      const text = `${booster.nameZh} ${booster.nameEn} ${booster.attributes.map((id) => {
        const item = getAttribute(id);
        return `${item.nameZh} ${item.nameEn}`;
      }).join(' ')}`.toLocaleLowerCase();
      return selectedAttributes.every((attribute) =>
        (booster.attributes as readonly AttributeId[]).includes(attribute),
      ) &&
        (!keyword || text.includes(keyword));
    });
  }, [query, selectedAttributes]);

  return (
    <main className="site-shell reference-page boosters-page">
      <section className="reference-workspace">
        <header className="reference-intro booster-intro">
          <p className="eyebrow">CRAFTABLE BOOSTERS</p>
          <h1>增能 Booster</h1>
          <p>每种可制作增能会同时提升 4 项球员属性。可按属性反查适合的增能组合。</p>
          <div className="booster-rule"><Sparkles aria-hidden="true" /><span>所有可制作增能均可通过随机增能代币抽取，各种增能的出现概率相同。</span></div>
        </header>

        <div className="booster-toolbar">
          <label className="search-box reference-search">
            <span className="sr-only">搜索增能</span>
            <Search aria-hidden="true" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索增能或受益属性…" />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="清除搜索"><X aria-hidden="true" /></button>}
          </label>
        </div>

        <section className="attribute-filter" aria-labelledby="attribute-filter-title">
          <div className="attribute-filter-heading">
            <span className="attribute-filter-icon"><SlidersHorizontal aria-hidden="true" /></span>
            <div>
              <h2 id="attribute-filter-title">想提升哪些属性？</h2>
              <p>可多选；结果需同时提升所有已选属性。</p>
            </div>
            {selectedAttributes.length > 0 && (
              <button type="button" className="attribute-filter-clear" onClick={() => setSelectedAttributes([])}>
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
                  <span className="attribute-check">{selected && <Check aria-hidden="true" />}</span>
                  <span>{item.nameZh}<small>{item.nameEn}</small></span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="booster-result-heading" aria-live="polite">
          <div>
            <p className="eyebrow">BOOSTER LIST</p>
            <h2>{selectedAttributes.length === 0 ? '全部增能' : `同时提升「${selectedAttributes.map((id) => getAttribute(id).nameZh).join('＋')}」`}</h2>
          </div>
          <span>{results.length} / {boosters.length}</span>
        </div>

        <div className="booster-grid">
          {results.map((booster, index) => (
            <article key={booster.id} className="booster-card">
              <div className="booster-card-heading">
                <span className="booster-index">{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{booster.nameZh}</h3><p lang="en">{booster.nameEn}</p></div>
              </div>
              <p className="booster-effect">提升以下 4 项球员属性</p>
              <div className="booster-attributes">
                {booster.attributes.map((id) => {
                  const item = getAttribute(id);
                  return <span key={id}><strong>{item.nameZh}</strong><small>{item.nameEn}</small></span>;
                })}
              </div>
            </article>
          ))}
          {results.length === 0 && <div className="empty-state booster-empty"><Search aria-hidden="true" /><h3>没有找到相关增能</h3><p>试试其他属性或关键词。</p></div>}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
