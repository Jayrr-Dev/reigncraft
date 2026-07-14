'use client';

/**
 * Local open/close state for companion naming dialog and companion panel.
 *
 * @module components/world/wildlife/pets/hooks/usingWildlifePetModalState
 */

import type { DefiningWildlifePetRoster } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import {
  readingWildlifePetRosterSnapshot,
  subscribingWildlifePetRoster,
} from '@/components/world/wildlife/pets/domains/managingWildlifePetRosterStore';
import { useCallback, useState, useSyncExternalStore } from 'react';

export type UsingWildlifePetModalStateResult = {
  /** Wildlife instance id for the companion panel, or null when closed. */
  readonly selectedPetInstanceId: string | null;
  readonly isModalOpen: boolean;
  /** Wildlife instance id waiting for a permanent name, or null when closed. */
  readonly namingPetInstanceId: string | null;
  readonly isNameDialogOpen: boolean;
  readonly rosterSnapshot: DefiningWildlifePetRoster;
  readonly openingPetModal: (instanceId: string) => void;
  readonly closingPetModal: () => void;
  readonly openingPetNameDialog: (instanceId: string) => void;
  readonly closingPetNameDialog: () => void;
};

/** React binding for companion panel + one-shot naming dialog state. */
export function usingWildlifePetModalState(): UsingWildlifePetModalStateResult {
  const [selectedPetInstanceId, setSelectedPetInstanceId] = useState<
    string | null
  >(null);
  const [namingPetInstanceId, setNamingPetInstanceId] = useState<string | null>(
    null
  );

  const rosterSnapshot = useSyncExternalStore(
    subscribingWildlifePetRoster,
    readingWildlifePetRosterSnapshot
  );

  const openingPetModal = useCallback((instanceId: string): void => {
    setNamingPetInstanceId(null);
    setSelectedPetInstanceId(instanceId);
  }, []);

  const closingPetModal = useCallback((): void => {
    setSelectedPetInstanceId(null);
  }, []);

  const openingPetNameDialog = useCallback((instanceId: string): void => {
    setSelectedPetInstanceId(null);
    setNamingPetInstanceId(instanceId);
  }, []);

  const closingPetNameDialog = useCallback((): void => {
    setNamingPetInstanceId(null);
  }, []);

  return {
    selectedPetInstanceId,
    isModalOpen: selectedPetInstanceId !== null,
    namingPetInstanceId,
    isNameDialogOpen: namingPetInstanceId !== null,
    rosterSnapshot,
    openingPetModal,
    closingPetModal,
    openingPetNameDialog,
    closingPetNameDialog,
  };
}
