import type { AttributeId } from '../attributes/data';

export const boosters = [
  { id: 'shooting', nameZh: '攻门', nameEn: 'Shooting', attributes: ['ball-control', 'finishing', 'kicking-power', 'physical-contact'] },
  { id: 'free-kick-taking', nameZh: '罚任意球', nameEn: 'Free-kick Taking', attributes: ['finishing', 'set-piece-taking', 'curl', 'kicking-power'] },
  { id: 'aerial', nameZh: '空中对抗', nameEn: 'Aerial', attributes: ['finishing', 'heading', 'jumping', 'physical-contact'] },
  { id: 'passing', nameZh: '传球', nameEn: 'Passing', attributes: ['low-pass', 'lofted-pass', 'curl', 'kicking-power'] },
  { id: 'ball-carrying', nameZh: '带球', nameEn: 'Ball-carrying', attributes: ['dribbling', 'tight-possession', 'speed', 'balance'] },
  { id: 'technique', nameZh: '技术', nameEn: 'Technique', attributes: ['ball-control', 'dribbling', 'tight-possession', 'low-pass'] },
  { id: 'defending', nameZh: '防守', nameEn: 'Defending', attributes: ['defensive-awareness', 'tackling', 'acceleration', 'jumping'] },
  { id: 'duelling', nameZh: '1对1', nameEn: 'Duelling', attributes: ['defensive-awareness', 'tackling', 'speed', 'stamina'] },
  { id: 'agility', nameZh: '敏捷', nameEn: 'Agility', attributes: ['speed', 'acceleration', 'balance', 'stamina'] },
  { id: 'physicality', nameZh: '身体素质', nameEn: 'Physicality', attributes: ['jumping', 'physical-contact', 'balance', 'stamina'] },
  { id: 'goalkeeping', nameZh: '守门', nameEn: 'Goalkeeping', attributes: ['gk-awareness', 'gk-catching', 'gk-parrying', 'gk-reflexes'] },
  { id: 'strikers-instinct', nameZh: '射手本能', nameEn: "Striker's Instinct", attributes: ['attacking-awareness', 'ball-control', 'finishing', 'acceleration'] },
  { id: 'shutdown', nameZh: '一夫当关', nameEn: 'Shutdown', attributes: ['defensive-awareness', 'tackling', 'defensive-engagement', 'speed'] },
  { id: 'hard-worker', nameZh: '防守铁人', nameEn: 'Hard Worker', attributes: ['aggression', 'acceleration', 'physical-contact', 'stamina'] },
  { id: 'saving', nameZh: '固若金汤', nameEn: 'Saving', attributes: ['gk-awareness', 'gk-parrying', 'gk-reflexes', 'gk-reach'] },
  { id: 'crossing', nameZh: '传球大师', nameEn: 'Crossing', attributes: ['lofted-pass', 'curl', 'speed', 'stamina'] },
  { id: 'fantasista', nameZh: '球场幻想家', nameEn: 'Fantasista', attributes: ['ball-control', 'dribbling', 'finishing', 'balance'] },
  { id: 'regista', nameZh: '指挥官', nameEn: 'Regista', attributes: ['tight-possession', 'low-pass', 'defensive-awareness', 'tackling'] },
  { id: 'rebuilding', nameZh: '后场组织', nameEn: 'Rebuilding', attributes: ['low-pass', 'defensive-awareness', 'aggression', 'defensive-engagement'] },
  { id: 'accuracy', nameZh: '精准', nameEn: 'Accuracy', attributes: ['low-pass', 'lofted-pass', 'finishing', 'kicking-power'] },
  { id: 'offence-creator', nameZh: '进攻发动机', nameEn: 'Offence Creator', attributes: ['attacking-awareness', 'ball-control', 'low-pass', 'kicking-power'] },
  { id: 'ball-protection', nameZh: '护球', nameEn: 'Ball Protection', attributes: ['ball-control', 'tight-possession', 'physical-contact', 'balance'] },
  { id: 'balancer', nameZh: '攻守兼备', nameEn: 'Balancer', attributes: ['attacking-awareness', 'defensive-awareness', 'acceleration', 'stamina'] },
  { id: 'counter', nameZh: '反击', nameEn: 'Counter', attributes: ['low-pass', 'tackling', 'defensive-engagement', 'physical-contact'] },
  { id: 'aerial-block', nameZh: '空中防守', nameEn: 'Aerial Block', attributes: ['heading', 'defensive-awareness', 'jumping', 'physical-contact'] },
  { id: 'breakthrough', nameZh: '突破', nameEn: 'Breakthrough', attributes: ['dribbling', 'speed', 'kicking-power', 'physical-contact'] },
  { id: 'strength', nameZh: '强壮', nameEn: 'Strength', attributes: ['speed', 'kicking-power', 'jumping', 'physical-contact'] },
  { id: 'off-the-ball', nameZh: '无球跑位', nameEn: 'Off the Ball', attributes: ['attacking-awareness', 'speed', 'acceleration', 'stamina'] },
  { id: 'stealing', nameZh: '抢断', nameEn: 'Stealing', attributes: ['tackling', 'aggression', 'acceleration', 'physical-contact'] },
] as const satisfies ReadonlyArray<{
  id: string;
  nameZh: string;
  nameEn: string;
  attributes: readonly AttributeId[];
}>;
