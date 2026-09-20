import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '比赛风格速查 | eFootball 工具站',
  description: '按球员位置与攻防类型查询 eFootball 比赛风格。',
};

export default function StylesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
