import { ReferenceIntentOption } from './reference-intent-option';

type ReferenceIntentDefinition<Intent extends string> = {
  readonly intent: Intent;
  readonly title: string;
  readonly description: string;
};

type ReferenceIntentGuideProps<Intent extends string> = {
  readonly titleId: string;
  readonly prompt: string;
  readonly radioName: string;
  readonly selectedIntent: Intent;
  readonly options: readonly ReferenceIntentDefinition<Intent>[];
  readonly onSelect: (intent: Intent) => void;
  readonly className?: string;
};

export function ReferenceIntentGuide<Intent extends string>({
  titleId,
  prompt,
  radioName,
  selectedIntent,
  options,
  onSelect,
  className = '',
}: ReferenceIntentGuideProps<Intent>) {
  return (
    <section
      className={`usage-guide reference-intent-guide ${className}`.trim()}
      aria-labelledby={titleId}
    >
      <div className="usage-guide-heading">
        <strong id={titleId}>我想：</strong>
        <span>{prompt}</span>
      </div>
      <div
        className="reference-intent-options"
        role="radiogroup"
        aria-labelledby={titleId}
      >
        {options.map((option) => (
          <ReferenceIntentOption
            key={option.intent}
            intent={option.intent}
            selectedIntent={selectedIntent}
            title={option.title}
            description={option.description}
            radioName={radioName}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
