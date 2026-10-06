import type { ReactNode } from 'react';

import { ReferenceSectionHeading } from './reference-section-heading';

type ReferenceResultsHeadingProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly count: ReactNode;
  readonly className?: string;
};

export function ReferenceResultsHeading({
  eyebrow,
  title,
  count,
  className = '',
}: ReferenceResultsHeadingProps) {
  return (
    <div
      className={`reference-result-heading ${className}`.trim()}
      aria-live="polite"
    >
      <ReferenceSectionHeading eyebrow={eyebrow} title={title} level="h2" />
      {count}
    </div>
  );
}
