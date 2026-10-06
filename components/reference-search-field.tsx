import { Search, X } from 'lucide-react';
import type { ChangeEvent } from 'react';

import { Input } from '@/components/ui/input';

type ReferenceSearchFieldProps = {
  readonly value: string;
  readonly onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly onClear: () => void;
  readonly label: string;
  readonly placeholder: string;
  readonly className?: string;
};

export function ReferenceSearchField({
  value,
  onChange,
  onClear,
  label,
  placeholder,
  className = '',
}: ReferenceSearchFieldProps) {
  return (
    <label className={`search-box ${className}`.trim()}>
      <span className="sr-only">{label}</span>
      <Search aria-hidden="true" />
      <Input value={value} onChange={onChange} placeholder={placeholder} />
      {value && (
        <button type="button" onClick={onClear} aria-label={`清除${label}`}>
          <X aria-hidden="true" />
        </button>
      )}
    </label>
  );
}
