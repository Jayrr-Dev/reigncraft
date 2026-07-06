'use client';

import type { WorldPlazaCodexSectionId } from '@/components/world/domains/definingWorldPlazaCodexConstants';
import { useCallback, useState } from 'react';

/** Result from {@link usingWorldPlazaCodexPanelVisibleState}. */
export type UsingWorldPlazaCodexPanelVisibleStateResult = {
  activeCodexSection: WorldPlazaCodexSectionId | null;
  openingCodexSection: (section: WorldPlazaCodexSectionId) => void;
  closingCodexSection: () => void;
};

/**
 * Tracks which codex section overlay is open in the plaza.
 */
export function usingWorldPlazaCodexPanelVisibleState(): UsingWorldPlazaCodexPanelVisibleStateResult {
  const [activeCodexSection, setActiveCodexSection] =
    useState<WorldPlazaCodexSectionId | null>(null);

  const openingCodexSection = useCallback(
    (section: WorldPlazaCodexSectionId): void => {
      setActiveCodexSection(section);
    },
    []
  );

  const closingCodexSection = useCallback((): void => {
    setActiveCodexSection(null);
  }, []);

  return {
    activeCodexSection,
    openingCodexSection,
    closingCodexSection,
  };
}
