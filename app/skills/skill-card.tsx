import Image from 'next/image';

import {
  getDisplayedPositionLevel,
  positionRecommendationLabels,
} from '@/lib/skill-recommendation';
import {
  type PlayerSkill,
  skillCategories,
  type SkillPosition,
  type SkillPositionRecommendation,
  type SkillRecommendationPlanId,
} from './data';

type SkillCardProps = {
  readonly skill: PlayerSkill;
  readonly selectedPlan: SkillRecommendationPlanId | null;
  readonly selectedPosition: SkillPosition | null;
  readonly selectedProfile: string | null;
  readonly selectedPositionRecommendation: SkillPositionRecommendation | null;
};

export function SkillCard({
  skill,
  selectedPlan,
  selectedPosition,
  selectedProfile,
  selectedPositionRecommendation,
}: SkillCardProps) {
  const displayedPositionLevel =
    selectedPlan !== null && selectedPosition !== null
      ? getDisplayedPositionLevel(
          skill,
          selectedPlan,
          selectedPosition,
          selectedProfile,
          selectedPositionRecommendation,
        )
      : 0;
  const displayedPositionLabel =
    positionRecommendationLabels[
      displayedPositionLevel as SkillPositionRecommendation
    ] ?? '暂无适配';

  return (
    <details className="reference-result-card skill-card">
      <summary>
        <span className="skill-number">
          {String(skill.id).padStart(2, '0')}
        </span>
        <span className="skill-title">
          <strong>{skill.nameZh}</strong>
          <span>{skill.nameEn}</span>
        </span>
        <span className="skill-meta">
          <span className="skill-category-tags" aria-label="技能分类">
            {skill.categories.map((id) => (
              <span key={id} className="skill-category-tag">
                {skillCategories.find((item) => item.id === id)?.label}
              </span>
            ))}
          </span>
          {(skill.researchZh || skill.researchEn) && (
            <span className="skill-research-tag">技能深度解析</span>
          )}
          {selectedPosition !== null && selectedPlan !== null && (
            <span
              className="skill-position-fit"
              aria-label={`${selectedPosition} 位置适配 ${selectedProfile && selectedProfile !== '通用' ? `${selectedProfile} ` : ''}${displayedPositionLabel}`}
            >
              {selectedPosition}{' '}
              {selectedProfile && selectedProfile !== '通用'
                ? `${selectedProfile} `
                : ''}
              {displayedPositionLabel}
            </span>
          )}
          <span
            className={`skill-recommendation${skill.recommendation === null ? ' is-unrated' : ''}`}
            aria-label={
              skill.recommendation === null
                ? '暂无技巧价值评级'
                : `技巧价值 ${skill.recommendation} 颗星`
            }
          >
            <strong>
              {skill.recommendation === null
                ? '暂无评级'
                : `技能价值 ${skill.recommendation} 星`}
            </strong>
          </span>
        </span>
        <span
          className="skill-expand"
          aria-hidden="true"
        >
          ＋
        </span>
      </summary>
      <div className="skill-detail">
        <Image
          className="skill-image"
          src={skill.image}
          alt={`${skill.nameZh}技巧示意图`}
          width={567}
          height={319}
          loading="lazy"
          decoding="async"
        />
        <div className="skill-detail-copy">
          <p>{skill.description}</p>
          <p lang="en" className="skill-description-en">
            {skill.descriptionEn}
          </p>
          {skill.researchZh && (
            <section className="skill-research" aria-label="三方研究">
              <div className="skill-research-heading">
                <strong>三方研究</strong>
                <span>THIRD-PARTY RESEARCH</span>
              </div>
              <p className="skill-research-copy">{skill.researchZh}</p>
              {skill.researchEn && (
                <p
                  lang="en"
                  className="skill-research-copy skill-research-copy-en"
                >
                  {skill.researchEn}
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </details>
  );
}
