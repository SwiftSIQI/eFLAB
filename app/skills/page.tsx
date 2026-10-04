import type { Metadata } from 'next';
import { SkillsExplorer } from './skills-explorer';

export const metadata: Metadata = {
  title: '球员技巧 | eFootball Lab',
  description: '按 ShowTime、射门、盘带、传球、防守、守门和其他 7 类查询球员技巧。',
};

export default function SkillsPage() {
  return <SkillsExplorer />;
}
