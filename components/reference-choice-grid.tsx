type ChoiceValue = string | number | boolean;

type ReferenceChoiceGridProps<Value extends ChoiceValue> = {
  readonly values: readonly Value[];
  readonly selectedValue: Value | null;
  readonly onSelect: (value: Value | null) => void;
  readonly getLabel?: (value: Value) => string;
  readonly disabled?: boolean | ((value: Value) => boolean);
  readonly className?: string;
};

export function ReferenceChoiceGrid<Value extends ChoiceValue>({
  values,
  selectedValue,
  onSelect,
  getLabel = String,
  disabled = false,
  className = '',
}: ReferenceChoiceGridProps<Value>) {
  return (
    <div className={`reference-choice-grid ${className}`.trim()}>
      {values.map((value) => {
        const selected = selectedValue === value;
        const isDisabled =
          typeof disabled === 'function' ? disabled(value) : disabled;
        return (
          <button
            key={String(value)}
            type="button"
            className={`reference-choice${selected ? ' is-selected' : ''}`}
            disabled={isDisabled}
            onClick={() => onSelect(selected ? null : value)}
            aria-pressed={selected}
          >
            {getLabel(value)}
          </button>
        );
      })}
    </div>
  );
}
