import Link from 'next/link';
import { Activity, ArrowRight, Crosshair, Search, Sparkles, Zap } from 'lucide-react';

import { SiteFooter } from '@/components/site-footer';
import { styles } from './data';
import { playerSkills } from './skills/data';
import { playerAttributes } from './attributes/data';
import { boosters } from './boosters/data';

const tools = [
  {
    href: '/styles',
    eyebrow: 'PLAYING STYLES',
    title: '比赛风格速查',
    description: '从球场位置出发，快速确认可触发的进攻与防守风格。',
    count: styles.length,
    unit: '种比赛风格',
    icon: Crosshair,
    accent: 'attack',
  },
  {
    href: '/skills',
    eyebrow: 'PLAYER SKILLS',
    title: '球员技巧速查',
    description: '按盘带、射门、传球、防守与付费技能分类查找。',
    count: playerSkills.length,
    unit: '项球员技巧',
    icon: Sparkles,
    accent: 'defense',
  },
  {
    href: '/attributes',
    eyebrow: 'PLAYER ATTRIBUTES',
    title: '球员属性',
    description: '按进攻、防守、身体素质 3 大类浏览全部球员属性。',
    count: playerAttributes.length,
    unit: '项球员属性',
    icon: Activity,
    accent: 'attributes',
  },
  {
    href: '/boosters',
    eyebrow: 'CRAFTABLE BOOSTERS',
    title: '增能 Booster',
    description: '查询每种增能提升的 4 项属性，也可以按属性反查。',
    count: boosters.length,
    unit: '种可制作增能',
    icon: Zap,
    accent: 'boosters',
  },
] as const;

export default function HomePage() {
  return (
    <main className="site-shell home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-kicker"><span /> EFOOTBALL TOOLKIT</p>
          <h1>把复杂资料，<br /><em>变成赛前 10 秒</em>能查到的答案。</h1>
          <p className="home-lead">面向 eFootball 玩家打造的中文速查工具。按位置、分类和关键词快速找到需要的信息。</p>
          <div className="home-actions">
            <Link className="home-primary-action" href="/styles">查询比赛风格 <ArrowRight aria-hidden="true" /></Link>
            <Link className="home-secondary-action" href="/boosters">查询增能组合</Link>
          </div>
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
            <span><small>QUICK FIND</small>位置 · 分类 · 关键词</span>
          </div>
        </div>
      </section>

      <section className="home-tools" aria-labelledby="home-tools-title">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">QUICK ACCESS</p>
            <h2 id="home-tools-title">选择你要查询的工具</h2>
          </div>
          <p>内容直接、入口清晰，减少在菜单中反复查找。</p>
        </div>

        <div className="home-tool-grid">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.href} className={`home-tool-card ${tool.accent}`} href={tool.href}>
                <div className="home-tool-topline">
                  <span className="home-tool-index">{String(index + 1).padStart(2, '0')}</span>
                  <Icon aria-hidden="true" />
                </div>
                <p>{tool.eyebrow}</p>
                <h3>{tool.title}</h3>
                <p className="home-tool-description">{tool.description}</p>
                <div className="home-tool-footer">
                  <span><strong>{tool.count}</strong> {tool.unit}</span>
                  <span className="home-tool-arrow"><ArrowRight aria-hidden="true" /></span>
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
