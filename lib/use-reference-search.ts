import { useMemo, useState } from 'react';

import { normalizeSearchText } from './utils';

export function useReferenceSearch(initialValue = '') {
  const [query, setQuery] = useState(initialValue);
  const keyword = useMemo(() => normalizeSearchText(query), [query]);

  return {
    query,
    keyword,
    setQuery,
    clearQuery: () => setQuery(''),
  };
}
