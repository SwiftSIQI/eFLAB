import type { Metadata } from 'next';
import { skillCategories } from './data';
import { SkillsExplorer } from './skills-explorer';

const categoryLabels = skillCategories
  .filter((category) => category.id !== 'all')
  .map((category) => category.label);

export const metadata: Metadata = {
  title: '球员技巧 | eflab',
  description: `按 ${categoryLabels.join('、')} 等 ${categoryLabels.length} 类查询球员技巧。`,
};

export const dynamic = 'force-static';

export default function SkillsPage() {
  return <SkillsExplorer />;
}
