import type {
  PlayerSkill,
  SkillPosition,
  SkillPositionRecommendation,
  SkillRecommendationPlanId,
} from '@/app/skills/data';

export const positionRecommendationLabels = {
  3: '必备',
  2: '推荐',
  1: '可选',
} as const;

export function getHighestPositionLevel(
  values: Partial<Record<string, SkillPositionRecommendation>> | undefined,
) {
  return Math.max(
    0,
    ...Object.values(values ?? {}).filter(
      (level): level is SkillPositionRecommendation => level !== undefined,
    ),
  );
}

export function getDisplayedPositionLevel(
  skill: PlayerSkill,
  plan: SkillRecommendationPlanId,
  position: SkillPosition,
  profile: string | null,
  selectedLevel: SkillPositionRecommendation | null,
) {
  if (selectedLevel !== null) return selectedLevel;

  const values = skill.positionRecommendations[plan]?.[position];
  if (profile !== null && profile !== '通用') return values?.[profile] ?? 0;
  return getHighestPositionLevel(values);
}
