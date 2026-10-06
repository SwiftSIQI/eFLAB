import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteAccessGate } from '@/components/site-access-gate';
import { withBasePath } from '@/lib/site-path';
import './globals.css';

export const metadata: Metadata = {
  title: 'eFLAB',
  description: '快速查询 eFootball 比赛风格、球员技巧、球员属性与增能。',
  icons: {
    icon: withBasePath('/favicon.svg'),
  },
};

export const dynamic = 'force-static';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteAccessGate>
          <SiteHeader />
          {children}
        </SiteAccessGate>
      </body>
    </html>
  );
}
