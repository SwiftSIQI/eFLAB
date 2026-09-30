import type { AttributeId } from '../attributes/data';

export type BoosterRecommendation = 1 | 2 | 3 | 4 | 5;

export const boosters = [
  { id: 'shooting', nameZh: '攻门', nameEn: 'Shooting', recommendation: 5, attributes: ['ball-control', 'finishing', 'kicking-power', 'physical-contact'] },
  { id: 'free-kick-taking', nameZh: '罚任意球', nameEn: 'Free-kick Taking', recommendation: 1, attributes: ['finishing', 'set-piece-taking', 'curl', 'kicking-power'] },
  { id: 'aerial', nameZh: '空中对抗', nameEn: 'Aerial', recommendation: 4, attributes: ['finishing', 'heading', 'jumping', 'physical-contact'] },
  { id: 'passing', nameZh: '传球', nameEn: 'Passing', recommendation: 2, attributes: ['low-pass', 'lofted-pass', 'curl', 'kicking-power'] },
  { id: 'ball-carrying', nameZh: '带球', nameEn: 'Ball-carrying', recommendation: 5, attributes: ['dribbling', 'tight-possession', 'speed', 'balance'] },
  { id: 'technique', nameZh: '技术', nameEn: 'Technique', recommendation: 3, attributes: ['ball-control', 'dribbling', 'tight-possession', 'low-pass'] },
  { id: 'defending', nameZh: '防守', nameEn: 'Defending', recommendation: 4, attributes: ['defensive-awareness', 'tackling', 'acceleration', 'jumping'] },
  { id: 'duelling', nameZh: '1对1', nameEn: 'Duelling', recommendation: 3, attributes: ['defensive-awareness', 'tackling', 'speed', 'stamina'] },
  { id: 'agility', nameZh: '敏捷', nameEn: 'Agility', recommendation: 5, attributes: ['speed', 'acceleration', 'balance', 'stamina'] },
  { id: 'physicality', nameZh: '身体素质', nameEn: 'Physicality', recommendation: 3, attributes: ['jumping', 'physical-contact', 'balance', 'stamina'] },
  { id: 'goalkeeping', nameZh: '守门', nameEn: 'Goalkeeping', recommendation: 4, attributes: ['gk-awareness', 'gk-catching', 'gk-parrying', 'gk-reflexes'] },
  { id: 'strikers-instinct', nameZh: '射手本能', nameEn: "Striker's Instinct", recommendation: 5, attributes: ['attacking-awareness', 'ball-control', 'finishing', 'acceleration'] },
  { id: 'shutdown', nameZh: '一夫当关', nameEn: 'Shutdown', recommendation: 4, attributes: ['defensive-awareness', 'tackling', 'defensive-engagement', 'speed'] },
  { id: 'hard-worker', nameZh: '防守铁人', nameEn: 'Hard Worker', recommendation: 4, attributes: ['aggression', 'acceleration', 'physical-contact', 'stamina'] },
  { id: 'saving', nameZh: '固若金汤', nameEn: 'Saving', recommendation: 5, attributes: ['gk-awareness', 'gk-parrying', 'gk-reflexes', 'gk-reach'] },
  { id: 'crossing', nameZh: '传球大师', nameEn: 'Crossing', recommendation: 4, attributes: ['lofted-pass', 'curl', 'speed', 'stamina'] },
  { id: 'fantasista', nameZh: '球场幻想家', nameEn: 'Fantasista', recommendation: 4, attributes: ['ball-control', 'dribbling', 'finishing', 'balance'] },
  { id: 'regista', nameZh: '指挥官', nameEn: 'Regista', recommendation: 1, attributes: ['tight-possession', 'low-pass', 'defensive-awareness', 'tackling'] },
  { id: 'rebuilding', nameZh: '后场组织', nameEn: 'Rebuilding', recommendation: 1, attributes: ['low-pass', 'defensive-awareness', 'aggression', 'defensive-engagement'] },
  { id: 'accuracy', nameZh: '精准', nameEn: 'Accuracy', recommendation: 2, attributes: ['low-pass', 'lofted-pass', 'finishing', 'kicking-power'] },
  { id: 'offence-creator', nameZh: '进攻发动机', nameEn: 'Offence Creator', recommendation: 1, attributes: ['attacking-awareness', 'ball-control', 'low-pass', 'kicking-power'] },
  { id: 'ball-protection', nameZh: '护球', nameEn: 'Ball Protection', recommendation: 2, attributes: ['ball-control', 'tight-possession', 'physical-contact', 'balance'] },
  { id: 'balancer', nameZh: '攻守兼备', nameEn: 'Balancer', recommendation: 1, attributes: ['attacking-awareness', 'defensive-awareness', 'acceleration', 'stamina'] },
  { id: 'counter', nameZh: '反击', nameEn: 'Counter', recommendation: 1, attributes: ['low-pass', 'tackling', 'defensive-engagement', 'physical-contact'] },
  { id: 'aerial-block', nameZh: '空中防守', nameEn: 'Aerial Block', recommendation: 2, attributes: ['heading', 'defensive-awareness', 'jumping', 'physical-contact'] },
  { id: 'breakthrough', nameZh: '突破', nameEn: 'Breakthrough', recommendation: 4, attributes: ['dribbling', 'speed', 'kicking-power', 'physical-contact'] },
  { id: 'strength', nameZh: '强壮', nameEn: 'Strength', recommendation: 3, attributes: ['speed', 'kicking-power', 'jumping', 'physical-contact'] },
  { id: 'off-the-ball', nameZh: '无球跑位', nameEn: 'Off the Ball', recommendation: 5, attributes: ['attacking-awareness', 'speed', 'acceleration', 'stamina'] },
  { id: 'stealing', nameZh: '抢断', nameEn: 'Stealing', recommendation: 5, attributes: ['tackling', 'aggression', 'acceleration', 'physical-contact'] },
] as const satisfies ReadonlyArray<{
  id: string;
  nameZh: string;
  nameEn: string;
  recommendation: BoosterRecommendation;
  attributes: readonly AttributeId[];
}>;

export const boosterPositions = ['CF', 'SS', 'RWF/LWF', 'AMF', 'RMF/LMF', 'CMF', 'DMF', 'RB/LB', 'CB', 'GK'] as const;

export type BoosterPosition = (typeof boosterPositions)[number];
export type BoosterId = (typeof boosters)[number]['id'];

export const boosterIdsByPosition = {
  CF: ['shooting', 'ball-carrying', 'agility', 'strikers-instinct', 'off-the-ball', 'aerial', 'fantasista', 'breakthrough', 'technique', 'physicality', 'strength', 'passing', 'accuracy', 'free-kick-taking', 'offence-creator'],
  SS: ['shooting', 'ball-carrying', 'agility', 'strikers-instinct', 'off-the-ball', 'aerial', 'fantasista', 'breakthrough', 'technique', 'physicality', 'passing', 'accuracy', 'ball-protection', 'free-kick-taking', 'offence-creator'],
  'RWF/LWF': ['shooting', 'ball-carrying', 'agility', 'strikers-instinct', 'off-the-ball', 'hard-worker', 'crossing', 'fantasista', 'breakthrough', 'technique', 'physicality', 'strength', 'passing', 'ball-protection', 'free-kick-taking', 'offence-creator'],
  AMF: ['shooting', 'ball-carrying', 'agility', 'strikers-instinct', 'hard-worker', 'crossing', 'fantasista', 'breakthrough', 'technique', 'physicality', 'strength', 'passing', 'ball-protection', 'free-kick-taking', 'offence-creator'],
  'RMF/LMF': ['shooting', 'ball-carrying', 'agility', 'strikers-instinct', 'off-the-ball', 'hard-worker', 'crossing', 'fantasista', 'breakthrough', 'technique', 'physicality', 'strength', 'passing', 'free-kick-taking', 'offence-creator', 'balancer'],
  CMF: ['shooting', 'ball-carrying', 'agility', 'strikers-instinct', 'stealing', 'shutdown', 'hard-worker', 'fantasista', 'technique', 'physicality', 'passing', 'regista', 'rebuilding', 'counter'],
  DMF: ['agility', 'strikers-instinct', 'stealing', 'defending', 'shutdown', 'hard-worker', 'technique', 'duelling', 'physicality', 'passing', 'ball-protection', 'aerial-block', 'regista', 'rebuilding', 'counter'],
  'RB/LB': ['ball-carrying', 'agility', 'stealing', 'defending', 'shutdown', 'hard-worker', 'crossing', 'breakthrough', 'technique', 'duelling', 'physicality', 'strength', 'aerial-block', 'rebuilding', 'counter'],
  CB: ['shooting', 'agility', 'stealing', 'aerial', 'shutdown', 'hard-worker', 'duelling', 'physicality', 'strength', 'passing', 'ball-protection', 'aerial-block', 'rebuilding', 'counter'],
  GK: ['saving', 'aerial', 'goalkeeping', 'physicality', 'strength', 'passing', 'ball-protection', 'aerial-block'],
} as const satisfies Record<BoosterPosition, readonly BoosterId[]>;
