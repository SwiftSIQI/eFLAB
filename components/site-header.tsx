'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: '首页', description: 'HOME' },
  { href: '/attributes', label: '球员属性', description: 'ATTRIBUTES' },
  { href: '/styles', label: '比赛风格速查', description: 'PLAYING STYLES' },
  { href: '/skills', label: '球员技巧速查', description: 'PLAYER SKILLS' },
  { href: '/boosters', label: '增能', description: 'BOOSTERS' },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <Link className="brand-lockup" href="/" aria-label="eFootball 工具站首页">
        <span className="brand">eFootball</span>
        <span className="brand-rule" aria-hidden="true" />
        <span className="site-name">工具站</span>
      </Link>
      <nav className="site-nav" aria-label="工具导航">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`site-nav-link ${pathname === link.href ? 'is-active' : ''}`}
            aria-current={pathname === link.href ? 'page' : undefined}
          >
            <span>{link.label}</span>
            <small>{link.description}</small>
          </Link>
        ))}
      </nav>
    </header>
  );
}
