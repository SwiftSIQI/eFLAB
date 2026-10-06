import type { ReactNode } from 'react';

import { ReferenceSectionHeading } from './reference-section-heading';

type ReferenceStat = {
  readonly label: string;
  readonly value: ReactNode;
};

type ReferencePageIntroProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly stats: readonly ReferenceStat[];
  readonly className?: string;
  readonly children?: ReactNode;
};

export function ReferencePageIntro({
  eyebrow,
  title,
  description,
  stats,
  className = '',
  children,
}: ReferencePageIntroProps) {
  return (
    <header
      className={`reference-intro reference-intro-layout ${className}`.trim()}
    >
      <ReferenceSectionHeading
        className="reference-hero-copy"
        eyebrow={eyebrow}
        title={title}
        description={description}
        level="h1"
      />
      <div className="reference-stats" aria-label={`${title}概览`}>
        {stats.map((stat) => (
          <span key={stat.label}>
            <strong>{stat.value}</strong>
            {stat.label}
          </span>
        ))}
      </div>
      {children}
    </header>
  );
}
