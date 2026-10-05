import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Crosshair,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';

import { SiteFooter } from '@/components/site-footer';
import { styles } from './data';
import { playerSkills, skillCategories } from './skills/data';
import { attributeCategories, playerAttributes } from './attributes/data';
import { boosters } from './boosters/data';

const skillCategoryCount = skillCategories.filter(
  (category) => category.id !== 'all',
).length;

const tools = [
  {
    href: '/attributes',
    eyebrow: 'PLAYER ATTRIBUTES',
    title: '球员属性',
    description: `按 ${attributeCategories.length} 类查看属性说明，了解每个属性背后的运作机制。`,
    count: playerAttributes.length,
    unit: '项球员属性',
    icon: Activity,
    accent: 'attributes',
  },
  {
    href: '/styles',
    eyebrow: 'PLAYING STYLES',
    title: '比赛风格',
    description: `按球场位置与攻防类型，快速了解 ${styles.length} 种比赛风格和其推荐程度。`,
    count: styles.length,
    unit: '种比赛风格',
    icon: Crosshair,
    accent: 'attack',
  },
  {
    href: '/skills',
    eyebrow: 'PLAYER SKILLS',
    title: '球员技巧',
    description: `按 ${skillCategoryCount} 大分类了解 ${playerSkills.length} 个球员技能，并根据球员位置与定位推荐相应技巧。`,
    count: playerSkills.length,
    unit: '项球员技巧',
    icon: Sparkles,
    accent: 'defense',
  },
  {
    href: '/boosters',
    eyebrow: 'PLAYER BOOSTERS',
    title: '球员增能',
    description: `快速了解 ${boosters.length} 种增能，并根据球员位置推荐最合适的增能选项。`,
    count: boosters.length,
    unit: '种可制作增能',
    icon: Zap,
    accent: 'boosters',
  },
] as const;

export const dynamic = 'force-static';

export default function HomePage() {
  return (
    <main id="main-content" className="site-shell home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-kicker">
            <span /> EFOOTBALL LAB
          </p>
          <h1>
            你的球员，
            <br />
            <em>你来定义。</em>
          </h1>
          <p className="home-tagline">自由构建球员，不再四处求人。</p>
          <p className="home-lead">
            面向 eFootball 玩家打造的球员自定义构建工具。当前收录 {styles.length}{' '}
            种比赛风格、{playerSkills.length} 项球员技巧、
            {playerAttributes.length} 项球员属性和 {boosters.length}{' '}
            种球员增能。
          </p>
        </div>

        <div className="home-visual" aria-hidden="true">
          <div className="home-orbit home-orbit-one" />
          <div className="home-orbit home-orbit-two" />
          <div className="home-pitch-card">
            <span className="home-pitch-line" />
            <span className="home-pitch-circle" />
            <span className="home-player-dot dot-one">CF</span>
            <span className="home-player-dot dot-two">AMF</span>
            <span className="home-player-dot dot-three">DMF</span>
            <span className="home-player-dot dot-four">CB</span>
          </div>
          <div className="home-floating-card">
            <Search />
            <span>
              <small>QUICK FIND</small>属性 · 风格 · 技巧 · 增能
            </span>
          </div>
        </div>
      </section>

      <section className="home-tools" aria-labelledby="home-tools-title">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">QUICK ACCESS</p>
            <h2 id="home-tools-title">选择你要查询的工具</h2>
          </div>
        </div>

        <div className="home-tool-grid">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                className={`home-tool-card ${tool.accent}`}
                href={tool.href}
              >
                <div className="home-tool-topline">
                  <span className="home-tool-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Icon aria-hidden="true" />
                </div>
                <p>{tool.eyebrow}</p>
                <h3>{tool.title}</h3>
                <p className="home-tool-description">{tool.description}</p>
                <div className="home-tool-footer">
                  <span>
                    <strong>{tool.count}</strong> {tool.unit}
                  </span>
                  <span className="home-tool-arrow">
                    <ArrowRight aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
