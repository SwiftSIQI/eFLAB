'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: '首页', description: 'HOME' },
  { href: '/attributes', label: '球员属性', description: 'ATTRIBUTES' },
  { href: '/styles', label: '比赛风格', description: 'PLAYING STYLES' },
  { href: '/skills', label: '球员技巧', description: 'PLAYER SKILLS' },
  { href: '/boosters', label: '球员增能', description: 'BOOSTERS' },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <Link className="brand-lockup" href="/" aria-label="eFootball Lab 首页">
        <Image
          className="brand-logo"
          src="/efootball-lab-logo.svg"
          alt="eFootball Lab"
          width={205}
          height={64}
          priority
        />
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
