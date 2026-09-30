export const attributeCategories = [
  { id: 'attacking', label: '进攻', nameEn: 'Attacking' },
  { id: 'defending', label: '防守', nameEn: 'Defending' },
  { id: 'athleticism', label: '身体素质', nameEn: 'Athleticism' },
] as const;

export type AttributeCategory = (typeof attributeCategories)[number]['id'];

export const playerAttributes = [
  { id: 1, nameZh: '进攻意识', nameEn: 'Attacking Awareness', category: 'attacking' },
  { id: 2, nameZh: '控球', nameEn: 'Ball Control', category: 'attacking' },
  { id: 3, nameZh: '盘球', nameEn: 'Dribbling', category: 'attacking' },
  { id: 4, nameZh: '紧密控球', nameEn: 'Tight Possession', category: 'attacking' },
  { id: 5, nameZh: '地面传球', nameEn: 'Low Pass', category: 'attacking' },
  { id: 6, nameZh: '空中传球', nameEn: 'Lofted Pass', category: 'attacking' },
  { id: 7, nameZh: '射门', nameEn: 'Finishing', category: 'attacking' },
  { id: 8, nameZh: '头球', nameEn: 'Heading', category: 'attacking' },
  { id: 9, nameZh: '罚定位球', nameEn: 'Set Piece Taking', category: 'attacking' },
  { id: 10, nameZh: '弧线球', nameEn: 'Curl', category: 'attacking' },
  { id: 11, nameZh: '防守意识', nameEn: 'Defensive Awareness', category: 'defending' },
  { id: 12, nameZh: '防守参与度', nameEn: 'Defensive Engagement', category: 'defending' },
  { id: 13, nameZh: '抢球', nameEn: 'Tackling', category: 'defending' },
  { id: 14, nameZh: '积极性', nameEn: 'Aggression', category: 'defending' },
  { id: 15, nameZh: '守门员意识', nameEn: 'GK Awareness', category: 'defending' },
  { id: 16, nameZh: '守门员接球能力', nameEn: 'GK Catching', category: 'defending' },
  { id: 17, nameZh: '守门员扑救', nameEn: 'GK Parrying', category: 'defending' },
  { id: 18, nameZh: '守门员扑救反应', nameEn: 'GK Reflexes', category: 'defending' },
  { id: 19, nameZh: '守门员臂展', nameEn: 'GK Reach', category: 'defending' },
  { id: 20, nameZh: '速度', nameEn: 'Speed', category: 'athleticism' },
  { id: 21, nameZh: '加速', nameEn: 'Acceleration', category: 'athleticism' },
  { id: 22, nameZh: '脚下力量', nameEn: 'Kicking Power', category: 'athleticism' },
  { id: 23, nameZh: '跳起', nameEn: 'Jumping', category: 'athleticism' },
  { id: 24, nameZh: '身体接触', nameEn: 'Physical Contact', category: 'athleticism' },
  { id: 25, nameZh: '平衡', nameEn: 'Balance', category: 'athleticism' },
  { id: 26, nameZh: '体力', nameEn: 'Stamina', category: 'athleticism' },
] as const satisfies ReadonlyArray<{
  id: number;
  nameZh: string;
  nameEn: string;
  category: AttributeCategory;
}>;

export type AttributeId = (typeof playerAttributes)[number]['id'];

export function getAttribute(id: AttributeId) {
  return playerAttributes.find((attribute) => attribute.id === id)!;
}
