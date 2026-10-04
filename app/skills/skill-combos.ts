// 此文件由 csv/player_skill_combo.csv 自动生成，请勿直接编辑。
export const skillComboGroups = [
  { id: "大丸子", label: "大丸子", skillIds: [2,3,10] },
  { id: "射门三件套", label: "射门三件套", skillIds: [16,22,27] },
  { id: "射门四件套", label: "射门四件套", skillIds: [16,22,25,27] },
  { id: "搓射套", label: "搓射套", skillIds: [10,16,22,27] },
  { id: "传球三件套", label: "传球三件套", skillIds: [30,31,33] },
  { id: "挑传直塞套", label: "挑传直塞套", skillIds: [32,41] },
  { id: "防守核心技能组", label: "防守核心技能组", skillIds: [51,53,54,55] },
  { id: "逆足精度低", label: "逆足精度低", skillIds: [35] },
] as const;

export type SkillComboId = (typeof skillComboGroups)[number]['id'];
