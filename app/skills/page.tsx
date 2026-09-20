import type { Metadata } from 'next';
import { SkillsExplorer } from './skills-explorer';

export const metadata: Metadata = {
  title: '球员技巧速查 | eFootball 工具站',
  description: '按盘带、射门、传球、防守、其他及付费技能分类查询球员技巧。',
};

export default function SkillsPage() {
  return <SkillsExplorer />;
}
