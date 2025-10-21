'use client';

import { createContext, useContext, useMemo, useState } from 'react';

interface SelectionContextValue {
  selectedWordId: number | null;
  setSelectedWordId: (id: number | null) => void;
}

const SelectionContext = createContext<SelectionContextValue>({
  selectedWordId: null,
  setSelectedWordId: () => {},
});

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedWordId, setSelectedWordId] = useState<number | null>(null);
  const value = useMemo(() => ({ selectedWordId, setSelectedWordId }), [selectedWordId]);
  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  return useContext(SelectionContext);
}


