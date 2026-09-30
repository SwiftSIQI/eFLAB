'use client';

import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { SiteFooter } from '@/components/site-footer';
import { playerSkills, skillCategories } from './data';

type Category = (typeof skillCategories)[number]['id'];

export function SkillsExplorer() {
  const [category, setCategory] = useState<Category>('all');
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase();
    return playerSkills.filter((skill) =>
      (category === 'all' || skill.categories.includes(category)) &&
      (!keyword || `${skill.nameZh} ${skill.nameEn} ${skill.description} ${skill.descriptionEn} ${skill.researchZh ?? ''} ${skill.researchEn ?? ''}`.toLocaleLowerCase().includes(keyword)),
    );
  }, [category, query]);

  const activeCategory = skillCategories.find((item) => item.id === category)!;

  return (
    <main className="site-shell skills-page">
      <section className="skills-workspace" aria-label="球员技巧查询">
        <div className="skills-intro">
          <p className="eyebrow">PLAYER SKILLS GUIDE</p>
          <h1>球员技巧速查</h1>
          <p>按原始技巧分类，快速查找球员技巧的中英文名称与效果。</p>
        </div>

        <div className="skills-controls">
          <nav className="skill-category-list" aria-label="技巧分类">
            {skillCategories.map((item) => {
              const count = item.id === 'all'
                ? playerSkills.length
                : playerSkills.filter((skill) => skill.categories.includes(item.id)).length;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`skill-category ${category === item.id ? 'is-active' : ''}`}
                  onClick={() => setCategory(item.id)}
                  aria-pressed={category === item.id}
                >
                  <span>{item.label}<small>{item.nameEn}</small></span>
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
                  <button type="button" onClick={() => setQuery('')} aria-label="清除搜索">
                    <X aria-hidden="true" />
                  </button>
                )}
              </label>
            </div>

            <div className="result-heading skill-result-heading" aria-live="polite">
              <div>
                <p className="eyebrow">{activeCategory.nameEn.toUpperCase()}</p>
                <h2>{category === 'Showtime' || category === 'Goalkeeping' ? activeCategory.label : `${activeCategory.label}技巧`}</h2>
              </div>
              <span className="skill-result-count">{results.length} 项</span>
            </div>

            <div className="skill-list">
              {results.map((skill) => (
                <details key={skill.id} className="skill-card">
                  <summary>
                    <span className="skill-number">{String(skill.id).padStart(2, '0')}</span>
                    <span className="skill-title">
                      <strong>{skill.nameZh}<span> / {skill.nameEn}</span></strong>
                    </span>
                    <span className="skill-category-tags" aria-label="技能分类">
                      {skill.categories.map((id) => (
                        <span key={id} className="skill-category-tag">
                          {skillCategories.find((item) => item.id === id)?.label}
                        </span>
                      ))}
                    </span>
                    <span className="skill-expand" aria-hidden="true">＋</span>
                  </summary>
                  <div className="skill-detail">
                    <Image
                      className="skill-image"
                      src={skill.image}
                      alt={`${skill.nameZh}技巧示意图`}
                      width={567}
                      height={319}
                      unoptimized
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="skill-detail-copy">
                      <p>{skill.description}</p>
                      <p lang="en" className="skill-description-en">{skill.descriptionEn}</p>
                      {skill.researchZh && (
                        <section className="skill-research" aria-label="三方研究">
                          <div className="skill-research-heading">
                            <strong>三方研究</strong>
                            <span>THIRD-PARTY RESEARCH</span>
                          </div>
                          <p className="skill-research-copy">{skill.researchZh}</p>
                          {skill.researchEn && (
                            <p lang="en" className="skill-research-copy skill-research-copy-en">{skill.researchEn}</p>
                          )}
                        </section>
                      )}
                    </div>
                  </div>
                </details>
              ))}
              {results.length === 0 && (
                <div className="empty-state">
                  <Search aria-hidden="true" />
                  <h3>没有找到相关技巧</h3>
                  <p>试试其他分类或搜索词。</p>
                  <button type="button" className="clear-search" onClick={() => setQuery('')}>清除搜索</button>
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
