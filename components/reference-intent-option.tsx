type ReferenceIntentOptionProps<Intent extends string> = {
  readonly intent: Intent;
  readonly selectedIntent: Intent;
  readonly title: string;
  readonly description: string;
  readonly radioName: string;
  readonly onSelect: (intent: Intent) => void;
};

export function ReferenceIntentOption<Intent extends string>({
  intent,
  selectedIntent,
  title,
  description,
  radioName,
  onSelect,
}: ReferenceIntentOptionProps<Intent>) {
  const selected = selectedIntent === intent;

  return (
    <div
      className={`reference-intent-option${selected ? ' is-selected' : ''}`}
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
    </div>
  );
}
