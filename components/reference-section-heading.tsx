type ReferenceSectionHeadingProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description?: string;
  readonly level: 'h1' | 'h2';
  readonly className?: string;
};

export function ReferenceSectionHeading({
  eyebrow,
  title,
  description,
  level,
  className = '',
}: ReferenceSectionHeadingProps) {
  const Heading = level;

  return (
    <div className={`reference-section-heading ${className}`.trim()}>
      <p className="eyebrow">{eyebrow}</p>
      <Heading>{title}</Heading>
      {description && <p>{description}</p>}
    </div>
  );
}
