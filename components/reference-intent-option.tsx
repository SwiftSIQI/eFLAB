import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

type ReferenceIntentOptionProps<Intent extends string> = {
  readonly intent: Intent;
  readonly selectedIntent: Intent;
  readonly title: string;
  readonly description: string;
  readonly radioName: string;
  readonly onSelect: (intent: Intent) => void;
  readonly expanded?: boolean;
  readonly detailId?: string;
  readonly onToggle?: (intent: Intent) => void;
  readonly children?: ReactNode;
};

export function ReferenceIntentOption<Intent extends string>({
  intent,
  selectedIntent,
  title,
  description,
  radioName,
  onSelect,
  expanded = false,
  detailId,
  onToggle,
  children,
}: ReferenceIntentOptionProps<Intent>) {
  const selected = selectedIntent === intent;
  const expandable = Boolean(onToggle && detailId);

  return (
    <div
      className={`reference-intent-option${selected ? ' is-selected' : ''}${expanded ? ' is-expanded' : ''}`}
    >
      <label className="reference-intent-summary">
        <input
          type="radio"
          name={radioName}
          value={intent}
          checked={selected}
          aria-label={title}
          onChange={() => onSelect(intent)}
        />
        <span className="reference-intent-radio" aria-hidden="true" />
        <span className="reference-intent-copy">
          <strong>{title}</strong>
          <small>{description}</small>
        </span>
      </label>
      {expandable && (
        <button
          type="button"
          className="reference-intent-expand"
          aria-label={
            expanded ? `收起${title}的使用说明` : `展开${title}的使用说明`
          }
          aria-expanded={expanded}
          aria-controls={detailId}
          onClick={() => onToggle?.(intent)}
        >
          <span>{expanded ? '收起使用说明' : '查看使用说明'}</span>
          <ChevronDown aria-hidden="true" />
        </button>
      )}
      {expanded && children}
    </div>
  );
}
