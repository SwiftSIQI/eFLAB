import type { Metadata } from 'next';
import { AttributesExplorer } from './attributes-explorer';

export const metadata: Metadata = {
  title: '球员属性 | eFootball Lab',
  description: '按进攻、防守和身体素质分类查询 eFootball 球员属性。',
};

export const dynamic = 'force-static';

export default function AttributesPage() {
  return <AttributesExplorer />;
}
