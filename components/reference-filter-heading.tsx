import type { ReactNode } from 'react';

type ReferenceFilterHeadingProps = {
  readonly title: string;
  readonly headingId?: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly className?: string;
};

export function ReferenceFilterHeading({
  title,
  headingId,
  description,
  action,
  className = '',
}: ReferenceFilterHeadingProps) {
  return (
    <div className={`position-filter-heading ${className}`.trim()}>
      <div>
        <h2 id={headingId}>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
