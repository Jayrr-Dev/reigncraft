'use client';

/**
 * Local open/close state for the bonded companion modal, plus a reactive
 * subscription to the persisted pet roster snapshot.
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
  /** Wildlife instance id of the pet the modal is showing, or null when closed. */
  readonly selectedPetInstanceId: string | null;
  readonly isModalOpen: boolean;
  readonly rosterSnapshot: DefiningWildlifePetRoster;
  readonly openingPetModal: (instanceId: string) => void;
  readonly closingPetModal: () => void;
};

/** React binding for the pet modal's open/close state and roster snapshot. */
export function usingWildlifePetModalState(): UsingWildlifePetModalStateResult {
  const [selectedPetInstanceId, setSelectedPetInstanceId] = useState<
    string | null
  >(null);

  const rosterSnapshot = useSyncExternalStore(
    subscribingWildlifePetRoster,
    readingWildlifePetRosterSnapshot
  );

  const openingPetModal = useCallback((instanceId: string): void => {
    setSelectedPetInstanceId(instanceId);
  }, []);

  const closingPetModal = useCallback((): void => {
    setSelectedPetInstanceId(null);
  }, []);

  return {
    selectedPetInstanceId,
    isModalOpen: selectedPetInstanceId !== null,
    rosterSnapshot,
    openingPetModal,
    closingPetModal,
  };
}
