import type { ReactNode } from 'react';

import { ReferenceSectionHeading } from './reference-section-heading';

type ReferencePageIntroProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly titleSuffix?: string;
  readonly description: string;
  readonly children?: ReactNode;
};

export function ReferencePageIntro({
  eyebrow,
  title,
  titleSuffix,
  description,
  children,
}: ReferencePageIntroProps) {
  return (
    <header className="reference-intro reference-intro-layout">
      <ReferenceSectionHeading
        className="reference-hero-copy"
        eyebrow={eyebrow}
        title={title}
        titleSuffix={titleSuffix}
        description={description}
        level="h1"
      />
      {children}
    </header>
  );
}
