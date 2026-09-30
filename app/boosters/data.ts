import type { AttributeId } from '../attributes/data';

export type BoosterRecommendation = 1 | 2 | 3 | 4 | 5;

export const boosters = [
  { id: 1, nameZh: '攻门', nameEn: 'Shooting', recommendation: 5, attributes: [2, 7, 22, 24] },
  { id: 2, nameZh: '罚任意球', nameEn: 'Free-kick Taking', recommendation: 1, attributes: [7, 9, 10, 22] },
  { id: 3, nameZh: '空中对抗', nameEn: 'Aerial', recommendation: 4, attributes: [7, 8, 23, 24] },
  { id: 4, nameZh: '传球', nameEn: 'Passing', recommendation: 2, attributes: [5, 6, 10, 22] },
  { id: 5, nameZh: '带球', nameEn: 'Ball-carrying', recommendation: 5, attributes: [3, 4, 20, 25] },
  { id: 6, nameZh: '技术', nameEn: 'Technique', recommendation: 3, attributes: [2, 3, 4, 5] },
  { id: 7, nameZh: '防守', nameEn: 'Defending', recommendation: 4, attributes: [11, 13, 21, 23] },
  { id: 8, nameZh: '1对1', nameEn: 'Duelling', recommendation: 3, attributes: [11, 13, 20, 26] },
  { id: 9, nameZh: '敏捷', nameEn: 'Agility', recommendation: 5, attributes: [20, 21, 25, 26] },
  { id: 10, nameZh: '身体素质', nameEn: 'Physicality', recommendation: 3, attributes: [23, 24, 25, 26] },
  { id: 11, nameZh: '守门', nameEn: 'Goalkeeping', recommendation: 4, attributes: [15, 16, 17, 18] },
  { id: 12, nameZh: '射手本能', nameEn: "Striker's Instinct", recommendation: 5, attributes: [1, 2, 7, 21] },
  { id: 13, nameZh: '一夫当关', nameEn: 'Shutdown', recommendation: 4, attributes: [11, 13, 12, 20] },
  { id: 14, nameZh: '防守铁人', nameEn: 'Hard Worker', recommendation: 4, attributes: [14, 21, 24, 26] },
  { id: 15, nameZh: '固若金汤', nameEn: 'Saving', recommendation: 5, attributes: [15, 17, 18, 19] },
  { id: 16, nameZh: '传球大师', nameEn: 'Crossing', recommendation: 4, attributes: [6, 10, 20, 26] },
  { id: 17, nameZh: '球场幻想家', nameEn: 'Fantasista', recommendation: 4, attributes: [2, 3, 7, 25] },
  { id: 18, nameZh: '指挥官', nameEn: 'Regista', recommendation: 1, attributes: [4, 5, 11, 13] },
  { id: 19, nameZh: '后场组织', nameEn: 'Rebuilding', recommendation: 1, attributes: [5, 11, 14, 12] },
  { id: 20, nameZh: '精准', nameEn: 'Accuracy', recommendation: 2, attributes: [5, 6, 7, 22] },
  { id: 21, nameZh: '进攻发动机', nameEn: 'Offence Creator', recommendation: 1, attributes: [1, 2, 5, 22] },
  { id: 22, nameZh: '护球', nameEn: 'Ball Protection', recommendation: 2, attributes: [2, 4, 24, 25] },
  { id: 23, nameZh: '攻守兼备', nameEn: 'Balancer', recommendation: 1, attributes: [1, 11, 21, 26] },
  { id: 24, nameZh: '反击', nameEn: 'Counter', recommendation: 1, attributes: [5, 13, 12, 24] },
  { id: 25, nameZh: '空中防守', nameEn: 'Aerial Block', recommendation: 2, attributes: [8, 11, 23, 24] },
  { id: 26, nameZh: '突破', nameEn: 'Breakthrough', recommendation: 4, attributes: [3, 20, 22, 24] },
  { id: 27, nameZh: '强壮', nameEn: 'Strength', recommendation: 3, attributes: [20, 22, 23, 24] },
  { id: 28, nameZh: '无球跑位', nameEn: 'Off the Ball', recommendation: 5, attributes: [1, 20, 21, 26] },
  { id: 29, nameZh: '抢断', nameEn: 'Stealing', recommendation: 5, attributes: [13, 14, 21, 24] },
] as const satisfies ReadonlyArray<{
  id: number;
  nameZh: string;
  nameEn: string;
  recommendation: BoosterRecommendation;
  attributes: readonly AttributeId[];
}>;

export const boosterPositions = ['CF', 'SS', 'RWF/LWF', 'AMF', 'RMF/LMF', 'CMF', 'DMF', 'RB/LB', 'CB', 'GK'] as const;

export type BoosterPosition = (typeof boosterPositions)[number];
export type BoosterId = (typeof boosters)[number]['id'];

export const boosterIdsByPosition = {
  CF: [1, 5, 9, 12, 28, 3, 17, 26, 6, 10, 27, 4, 20, 2, 21],
  SS: [1, 5, 9, 12, 28, 3, 17, 26, 6, 10, 4, 20, 22, 2, 21],
  'RWF/LWF': [1, 5, 9, 12, 28, 14, 16, 17, 26, 6, 10, 27, 4, 22, 2, 21],
  AMF: [1, 5, 9, 12, 14, 16, 17, 26, 6, 10, 27, 4, 22, 2, 21],
  'RMF/LMF': [1, 5, 9, 12, 28, 14, 16, 17, 26, 6, 10, 27, 4, 2, 21, 23],
  CMF: [1, 5, 9, 12, 29, 13, 14, 17, 6, 10, 4, 18, 19, 24],
  DMF: [9, 12, 29, 7, 13, 14, 6, 8, 10, 4, 22, 25, 18, 19, 24],
  'RB/LB': [5, 9, 29, 7, 13, 14, 16, 26, 6, 8, 10, 27, 25, 19, 24],
  CB: [1, 9, 29, 3, 13, 14, 8, 10, 27, 4, 22, 25, 19, 24],
  GK: [15, 3, 11, 10, 27, 4, 22, 25],
} as const satisfies Record<BoosterPosition, readonly BoosterId[]>;
