import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

export const metadata: Metadata = {
  title: 'eFootball Lab',
  description: '快速查询 eFootball 比赛风格、球员技巧、球员属性与增能。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body><SiteHeader />{children}</body>
    </html>
  );
}
