/**
 * Local open state for NPC Talk / Shop / Quest panels.
 *
 * @module components/world/npc/hooks/usingNpcPanelState
 */

'use client';

import type {
  DefiningNpcId,
  DefiningNpcPanelKind,
} from '@/components/world/npc/domains/definingNpcTypes';
import { useCallback, useState } from 'react';

export type UsingNpcPanelStateResult = {
  readonly activeNpcId: DefiningNpcId | null;
  readonly activePanel: DefiningNpcPanelKind | null;
  readonly isPanelOpen: boolean;
  readonly openingNpcPanel: (
    npcId: DefiningNpcId,
    panel: DefiningNpcPanelKind
  ) => void;
  readonly closingNpcPanel: () => void;
};

export function usingNpcPanelState(): UsingNpcPanelStateResult {
  const [activeNpcId, setActiveNpcId] = useState<DefiningNpcId | null>(
    null
  );
  const [activePanel, setActivePanel] = useState<DefiningNpcPanelKind | null>(
    null
  );

  const openingNpcPanel = useCallback(
    (npcId: DefiningNpcId, panel: DefiningNpcPanelKind): void => {
      setActiveNpcId(npcId);
      setActivePanel(panel);
    },
    []
  );

  const closingNpcPanel = useCallback((): void => {
    setActiveNpcId(null);
    setActivePanel(null);
  }, []);

  return {
    activeNpcId,
    activePanel,
    isPanelOpen: activeNpcId !== null && activePanel !== null,
    openingNpcPanel,
    closingNpcPanel,
  };
}
