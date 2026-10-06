'use client';

import { Search, Shield, Swords } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReferenceDebugPanel } from '@/components/reference-debug-panel';
import { ReferencePageIntro } from '@/components/reference-page-intro';
import { ReferenceResultsHeading } from '@/components/reference-results-heading';
import { ReferenceSectionHeading } from '@/components/reference-section-heading';
import { SiteFooter } from '@/components/site-footer';
import { normalizeSearchText } from '@/lib/utils';
import { positions, styles, type Side } from '../data';

export const dynamic = 'force-static';

type SideFilter = 'all' | Side;
type Position = (typeof positions)[number];
const isDebugBuild = import.meta.env.DEV || import.meta.env.MODE === 'test';

const pitchNodes: Array<{
  position: Exclude<Position, 'ALL'>;
  x: number;
  y: number;
}> = [
  { position: 'CF', x: 50, y: 8 },
  { position: 'LWF', x: 16, y: 22 },
  { position: 'SS', x: 50, y: 25 },
  { position: 'RWF', x: 84, y: 22 },
  { position: 'AMF', x: 50, y: 39 },
  { position: 'LMF', x: 16, y: 48 },
  { position: 'CMF', x: 50, y: 53 },
  { position: 'RMF', x: 84, y: 48 },
  { position: 'DMF', x: 50, y: 68 },
  { position: 'LB', x: 17, y: 79 },
  { position: 'CB', x: 50, y: 82 },
  { position: 'RB', x: 83, y: 79 },
  { position: 'GK', x: 50, y: 94 },
];

const totalAttackCount = styles.filter(
  (style) => style.side === 'attack',
).length;
const totalDefenseCount = styles.length - totalAttackCount;
const stylePositionCounts = new Map(
  positions.map((position) => [
    position,
    styles.filter((style) => style.positions.includes(position)).length,
  ]),
);

type WebMcpContext = {
  registerTool: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute: (input: unknown) => unknown;
    },
    options?: { signal: AbortSignal },
  ) => void | Promise<void>;
};

export default function StylesPage() {
  const [position, setPosition] = useState<Position>('ALL');
  const [side, setSide] = useState<SideFilter>('all');
  const [query, setQuery] = useState('');
  const filterState = useRef({ position, side, query });

  useEffect(() => {
    filterState.current = { position, side, query };
  }, [position, query, side]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: WebMcpContext })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    void Promise.resolve(
      context.registerTool(
        {
          name: 'filter_playing_styles',
          title: '筛选比赛风格',
          description:
            '按兼容位置、进攻或防守类型以及中英文关键词筛选页面中的比赛风格。',
          inputSchema: {
            type: 'object',
            properties: {
              position: { type: 'string', enum: positions },
              side: { type: 'string', enum: ['all', 'attack', 'defense'] },
              query: { type: 'string' },
            },
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute(input) {
            if (!input || typeof input !== 'object')
              throw new Error('筛选参数必须是对象。');
            const values = input as {
              position?: string;
              side?: string;
              query?: string;
            };
            if (
              values.position &&
              !positions.includes(values.position as Position)
            ) {
              throw new Error('不支持该位置。');
            }
            if (
              values.side &&
              !['all', 'attack', 'defense'].includes(values.side)
            ) {
              throw new Error('不支持该比赛风格类型。');
            }
            if (
              values.query !== undefined &&
              typeof values.query !== 'string'
            ) {
              throw new Error('搜索词必须是字符串。');
            }
            if (values.position) setPosition(values.position as Position);
            if (values.side) setSide(values.side as SideFilter);
            if (values.query !== undefined) setQuery(values.query);
            return {
              position: values.position ?? filterState.current.position,
              side: values.side ?? filterState.current.side,
              query: values.query ?? filterState.current.query,
            };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);

    return () => lifecycle.abort();
  }, []);

  const results = useMemo(() => {
    const keyword = normalizeSearchText(query);
    return styles.filter((style) => {
      const positionMatches =
        position === 'ALL' || style.positions.includes(position);
      const sideMatches = side === 'all' || style.side === side;
      const searchMatches =
        !keyword ||
        normalizeSearchText(
          `${style.nameZh} ${style.nameEn} ${style.descriptionZh} ${style.descriptionEn} ${style.positions.join(' ')}`,
        ).includes(keyword);
      return positionMatches && sideMatches && searchMatches;
    });
  }, [position, query, side]);

  const attackCount = results.filter((style) => style.side === 'attack').length;
  const defenseCount = results.length - attackCount;
  const overviewStats = [
    { label: '球员风格', value: styles.length },
    { label: '进攻', value: totalAttackCount },
    { label: '防守', value: totalDefenseCount },
  ];
  const resultPositionLabel = position === 'ALL' ? '全部位置' : position;
  const resultSideLabel =
    side === 'all' ? '' : side === 'attack' ? '进攻型' : '防守型';
  const resultTitle = `${resultPositionLabel}可触发的${resultSideLabel}比赛风格`;

  return (
    <main id="main-content" className="site-shell reference-page styles-page">
      {isDebugBuild && <ReferenceDebugPanel />}
      <section className="reference-workspace styles-reference-workspace">
        <ReferencePageIntro
          eyebrow="PLAYING STYLES"
          title="比赛风格"
          description={`${styles.length} 项比赛风格分为进攻和防守两大类，帮助你快速了解球员在场上的跑位倾向与职责。`}
          stats={overviewStats}
          className="styles-intro"
        />
      </section>
      <div
        className="reference-query-layout styles-query-layout"
        aria-label="比赛风格查询"
      >
        <aside
          className="pitch-panel reference-section-panel"
          aria-label="球员位置和比赛风格选择"
        >
          <ReferenceSectionHeading
            eyebrow="POSITION MAP"
            title="选择球员位置和比赛风格"
            level="h2"
          />
          <Tabs
            value={side}
            onValueChange={(value) => setSide(value as SideFilter)}
            className="pitch-side-filter"
          >
            <TabsList
              className="side-tabs pitch-side-tabs"
              aria-label="比赛风格类型"
            >
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="attack" className="attack-tab">
                <Swords aria-hidden="true" />
                进攻型
              </TabsTrigger>
              <TabsTrigger value="defense" className="defense-tab">
                <Shield aria-hidden="true" />
                防守型
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="pitch">
            <span className="pitch-box top" />
            <span className="pitch-box bottom" />
            <span className="pitch-circle" />
            <span className="pitch-half" />
            {pitchNodes.map((node) => {
              const count = stylePositionCounts.get(node.position) ?? 0;
              return (
                <button
                  key={node.position}
                  type="button"
                  className={`pitch-node ${position === node.position ? 'is-active' : ''}`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  onClick={() =>
                    setPosition(
                      position === node.position ? 'ALL' : node.position,
                    )
                  }
                  aria-pressed={position === node.position}
                  aria-label={`${node.position}，${count} 种风格`}
                >
                  <strong>{node.position}</strong>
                  <small>{count}</small>
                </button>
              );
            })}
          </div>
          <p className="pitch-note">只有放在兼容位置时，比赛风格才会触发。</p>
        </aside>

        <section
          className="results-panel reference-content reference-results-section"
          aria-label="比赛风格列表"
        >
          <div className="reference-results-panel reference-section-panel">
            <ReferenceResultsHeading
              eyebrow="COMPATIBLE STYLES"
              title={resultTitle}
              className="result-heading"
              count={
                <div
                  className="result-counts"
                  aria-label={`${results.length} 项结果`}
                >
                  <span className="attack-count">攻 {attackCount}</span>
                  <span className="defense-count">防 {defenseCount}</span>
                </div>
              }
            />

            <div className="style-list">
              {results.map((style) => (
                <details key={style.id} className={`style-card ${style.side}`}>
                  <summary>
                    <span className="type-mark" aria-hidden="true">
                      {style.side === 'attack' ? <Swords /> : <Shield />}
                    </span>
                    <span className="style-heading">
                      <span className="style-title">
                        <strong>{style.nameZh}</strong>
                        <span>/ {style.nameEn}</span>
                      </span>
                      <span className="expand-label">说明</span>
                    </span>
                    <span className="compatible-positions">
                      {style.positions.map((item) => (
                        <b key={item}>{item}</b>
                      ))}
                    </span>
                  </summary>
                  <div className="style-description">
                    <p>{style.descriptionZh}</p>
                    <p lang="en">{style.descriptionEn}</p>
                  </div>
                </details>
              ))}
              {results.length === 0 && (
                <div className="empty-state">
                  <Search aria-hidden="true" />
                  <h3>没有找到相关风格</h3>
                  <p>尝试更换位置、类型或搜索词。</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setQuery('')}
                  >
                    清除搜索
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
