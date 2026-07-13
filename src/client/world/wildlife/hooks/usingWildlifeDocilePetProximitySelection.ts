'use client';

/**
 * Syncs Pet the Cat / Pet the Dog pending state from proximity selection keys.
 *
 * @module components/world/wildlife/hooks/usingWildlifeDocilePetProximitySelection
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import {
  clearingWildlifeDocileAttackConfirmPending,
  readingWildlifeDocileAttackConfirmPending,
  settingWildlifeDocileAttackConfirmPending,
} from '@/components/world/wildlife/domains/managingWildlifeDocileAttackConfirmStore';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeDocilePetProximityPending } from '@/components/world/wildlife/domains/resolvingWildlifeDocilePetProximityPending';
import { useLayoutEffect, type RefObject } from 'react';

export type UsingWildlifeDocilePetProximitySelectionParams = {
  readonly enabled: boolean;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  readonly wildlifeStoreRef: RefObject<ManagingWildlifeInstanceStore>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly activePettingInstanceIdRef: RefObject<string | null>;
};

/**
 * Keeps the Pet label pending while a living companion is in proximity range.
 */
export function usingWildlifeDocilePetProximitySelection({
  enabled,
  playerPositionRef,
  wildlifeStoreRef,
  selectedInteractableBlockKeysRef,
  activePettingInstanceIdRef,
}: UsingWildlifeDocilePetProximitySelectionParams): void {
  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    return subscribingWorldPlazaDomOverlayFrame(() => {
      const nextPending = resolvingWildlifeDocilePetProximityPending({
        wildlifeStore: wildlifeStoreRef.current,
        selectedKeys: selectedInteractableBlockKeysRef.current,
        playerPosition: playerPositionRef.current,
        currentPending: readingWildlifeDocileAttackConfirmPending(),
        activePettingInstanceId: activePettingInstanceIdRef.current,
        nowMs: Date.now(),
      });
      const currentPending = readingWildlifeDocileAttackConfirmPending();

      if (!nextPending) {
        if (
          currentPending &&
          activePettingInstanceIdRef.current !== currentPending.instanceId
        ) {
          clearingWildlifeDocileAttackConfirmPending();
        }
        return;
      }

      if (
        currentPending &&
        currentPending.instanceId === nextPending.instanceId &&
        currentPending.petKind === nextPending.petKind
      ) {
        return;
      }

      settingWildlifeDocileAttackConfirmPending(nextPending);
    });
  }, [
    activePettingInstanceIdRef,
    enabled,
    playerPositionRef,
    selectedInteractableBlockKeysRef,
    wildlifeStoreRef,
  ]);
}
