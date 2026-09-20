export const attributeCategories = [
  { id: 'attacking', label: '进攻', nameEn: 'Attacking' },
  { id: 'defending', label: '防守', nameEn: 'Defending' },
  { id: 'athleticism', label: '身体素质', nameEn: 'Athleticism' },
] as const;

export type AttributeCategory = (typeof attributeCategories)[number]['id'];

export const playerAttributes = [
  { id: 'attacking-awareness', nameZh: '进攻意识', nameEn: 'Attacking Awareness', category: 'attacking' },
  { id: 'ball-control', nameZh: '控球', nameEn: 'Ball Control', category: 'attacking' },
  { id: 'dribbling', nameZh: '盘球', nameEn: 'Dribbling', category: 'attacking' },
  { id: 'tight-possession', nameZh: '紧密控球', nameEn: 'Tight Possession', category: 'attacking' },
  { id: 'low-pass', nameZh: '地面传球', nameEn: 'Low Pass', category: 'attacking' },
  { id: 'lofted-pass', nameZh: '空中传球', nameEn: 'Lofted Pass', category: 'attacking' },
  { id: 'finishing', nameZh: '射门', nameEn: 'Finishing', category: 'attacking' },
  { id: 'heading', nameZh: '头球', nameEn: 'Heading', category: 'attacking' },
  { id: 'set-piece-taking', nameZh: '罚定位球', nameEn: 'Set Piece Taking', category: 'attacking' },
  { id: 'curl', nameZh: '弧线球', nameEn: 'Curl', category: 'attacking' },
  { id: 'defensive-awareness', nameZh: '防守意识', nameEn: 'Defensive Awareness', category: 'defending' },
  { id: 'defensive-engagement', nameZh: '防守参与度', nameEn: 'Defensive Engagement', category: 'defending' },
  { id: 'tackling', nameZh: '抢球', nameEn: 'Tackling', category: 'defending' },
  { id: 'aggression', nameZh: '积极性', nameEn: 'Aggression', category: 'defending' },
  { id: 'gk-awareness', nameZh: '守门员意识', nameEn: 'GK Awareness', category: 'defending' },
  { id: 'gk-catching', nameZh: '守门员接球能力', nameEn: 'GK Catching', category: 'defending' },
  { id: 'gk-parrying', nameZh: '守门员扑救', nameEn: 'GK Parrying', category: 'defending' },
  { id: 'gk-reflexes', nameZh: '守门员扑救反应', nameEn: 'GK Reflexes', category: 'defending' },
  { id: 'gk-reach', nameZh: '守门员臂展', nameEn: 'GK Reach', category: 'defending' },
  { id: 'speed', nameZh: '速度', nameEn: 'Speed', category: 'athleticism' },
  { id: 'acceleration', nameZh: '加速', nameEn: 'Acceleration', category: 'athleticism' },
  { id: 'kicking-power', nameZh: '脚下力量', nameEn: 'Kicking Power', category: 'athleticism' },
  { id: 'jumping', nameZh: '跳起', nameEn: 'Jumping', category: 'athleticism' },
  { id: 'physical-contact', nameZh: '身体接触', nameEn: 'Physical Contact', category: 'athleticism' },
  { id: 'balance', nameZh: '平衡', nameEn: 'Balance', category: 'athleticism' },
  { id: 'stamina', nameZh: '体力', nameEn: 'Stamina', category: 'athleticism' },
] as const satisfies ReadonlyArray<{
  id: string;
  nameZh: string;
  nameEn: string;
  category: AttributeCategory;
}>;

export type AttributeId = (typeof playerAttributes)[number]['id'];

export function getAttribute(id: AttributeId) {
  return playerAttributes.find((attribute) => attribute.id === id)!;
}
