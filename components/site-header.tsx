'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { withBasePath } from '@/lib/site-path';

const links = [
  { href: '/', label: '首页', description: 'HOME' },
  { href: '/attributes', label: '球员属性', description: 'ATTRIBUTES' },
  { href: '/styles', label: '比赛风格', description: 'PLAYING STYLES' },
  { href: '/skills', label: '球员技巧', description: 'PLAYER SKILLS' },
  { href: '/boosters', label: '球员增能', description: 'BOOSTERS' },
] as const;

function SiteNavigation({ pathname }: { readonly pathname: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        className="mobile-nav-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        {menuOpen ? (
          <X size={18} aria-hidden="true" />
        ) : (
          <Menu size={18} aria-hidden="true" />
        )}
        <span>菜单</span>
        <small>MENU</small>
      </button>
      <nav
        id="site-navigation"
        className={`site-nav ${menuOpen ? 'is-open' : ''}`}
        aria-label="工具导航"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`site-nav-link ${pathname === link.href ? 'is-active' : ''}`}
            aria-current={pathname === link.href ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            <span>{link.label}</span>
            <small>{link.description}</small>
          </Link>
        ))}
      </nav>
    </>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <Link className="brand-lockup" href="/" aria-label="eFLAB 首页">
        <Image
          className="brand-logo"
          src={withBasePath('/eflab-logo.svg')}
          alt="eFLAB"
          width={136}
          height={36}
          priority
        />
      </Link>
      <SiteNavigation key={pathname} pathname={pathname} />
    </header>
  );
}
