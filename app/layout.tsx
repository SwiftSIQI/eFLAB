import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'eFootball 比赛风格速查',
  description: '按球员位置查询可触发的进攻型与防守型比赛风格。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
