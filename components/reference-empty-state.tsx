import { Search } from 'lucide-react';

type ReferenceEmptyStateProps = {
  readonly title: string;
  readonly description: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly className?: string;
};

export function ReferenceEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: ReferenceEmptyStateProps) {
  return (
    <div className={`empty-state ${className}`.trim()}>
      <Search aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && onAction && (
        <button type="button" className="clear-search" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
