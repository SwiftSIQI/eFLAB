import type { Metadata } from 'next';
import { BoostersExplorer } from './boosters-explorer';

export const metadata: Metadata = {
  title: '球员增能 | eFLAB',
  description:
    '查询 eFootball 可制作增能的中英文名称、受益属性和各球员位置可获得的增能。',
};

export const dynamic = 'force-static';

export default function BoostersPage() {
  return <BoostersExplorer />;
}
