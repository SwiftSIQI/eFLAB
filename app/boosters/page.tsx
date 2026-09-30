import type { Metadata } from 'next';
import { BoostersExplorer } from './boosters-explorer';

export const metadata: Metadata = {
  title: '增能 Booster | eFootball 工具站',
  description: '查询 eFootball 可制作增能的中英文名称、受益属性和各球员位置可获得的增能。',
};

export default function BoostersPage() {
  return <BoostersExplorer />;
}
