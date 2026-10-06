type ReferenceRatingOptionsProps<Level extends number> = {
  readonly levels: readonly Level[];
  readonly maxLevel: number;
  readonly selectedLevel: Level | null;
  readonly onSelect: (level: Level | null) => void;
};

export function ReferenceRatingOptions<Level extends number>({
  levels,
  maxLevel,
  selectedLevel,
  onSelect,
}: ReferenceRatingOptionsProps<Level>) {
  return (
    <div className="recommendation-options">
      {levels.map((level) => {
        const selected = selectedLevel === level;
        return (
          <button
            key={level}
            type="button"
            className={selected ? 'is-selected' : ''}
            onClick={() => onSelect(selected ? null : level)}
            aria-pressed={selected}
          >
            <span aria-label={`${level} 颗星`}>
              {'★'.repeat(level)}
              <i>{'★'.repeat(Math.max(maxLevel - level, 0))}</i>
            </span>
          </button>
        );
      })}
    </div>
  );
}
