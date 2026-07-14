/**
 * Keeps one nearby living NPC selected for overhead action badges.
 *
 * @module components/world/npc/hooks/usingNpcProximitySelection
 */

'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { DEFINING_NPC_PLAYER_INTERACT_REACH_GRID } from '@/components/world/npc/domains/definingNpcActionConstants';
import {
  clearingNpcProximityPending,
  readingNpcProximityPending,
  settingNpcProximityPending,
  subscribingNpcProximityPending,
  type ManagingNpcProximityPending,
} from '@/components/world/npc/domains/managingNpcProximityPendingStore';
import {
  listingNpcInstances,
  type ManagingNpcInstanceStore,
} from '@/components/world/npc/domains/managingNpcInstanceStore';
import { useEffect, useSyncExternalStore } from 'react';

export type UsingNpcProximitySelectionParams = {
  readonly npcStoreRef: React.RefObject<ManagingNpcInstanceStore>;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly enabled?: boolean;
};

export function usingNpcProximitySelection({
  npcStoreRef,
  playerPositionRef,
  enabled = true,
}: UsingNpcProximitySelectionParams): ManagingNpcProximityPending | null {
  const pending = useSyncExternalStore(
    subscribingNpcProximityPending,
    readingNpcProximityPending,
    readingNpcProximityPending
  );

  useEffect(() => {
    if (!enabled) {
      clearingNpcProximityPending();

      return;
    }

    const reachSq =
      DEFINING_NPC_PLAYER_INTERACT_REACH_GRID *
      DEFINING_NPC_PLAYER_INTERACT_REACH_GRID;

    return subscribingWorldPlazaDomOverlayFrame(() => {
      const playerPosition = playerPositionRef.current;
      const store = npcStoreRef.current;
      let nearest: ManagingNpcProximityPending | null = null;
      let nearestDistSq = Number.POSITIVE_INFINITY;

      for (const instance of listingNpcInstances(store)) {
        if (instance.isDead) {
          continue;
        }

        const dx = instance.position.x - playerPosition.x;
        const dy = instance.position.y - playerPosition.y;
        const distSq = dx * dx + dy * dy;

        if (distSq > reachSq || distSq >= nearestDistSq) {
          continue;
        }

        nearestDistSq = distSq;
        nearest = {
          npcId: instance.npcId,
          displayName: instance.displayName,
        };
      }

      const current = readingNpcProximityPending();

      if (nearest === null) {
        if (current !== null) {
          clearingNpcProximityPending();
        }

        return;
      }

      if (current?.npcId !== nearest.npcId) {
        settingNpcProximityPending(nearest);
      }
    });
  }, [enabled, npcStoreRef, playerPositionRef]);

  return pending;
}
