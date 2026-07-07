'use client';

/**
 * Wildlife simulation store and damage wiring (tick runs inside Pixi Application).
 *
 * @module components/world/wildlife/hooks/usingWildlifeSimulation
 */

import { applyingWildlifeInstanceDamage } from '@/components/world/wildlife/domains/advancingWildlifeSimulationTick';
import type { DefiningWildlifeSimulationTickConfig } from '@/components/world/wildlife/domains/definingWildlifeSimulationTickConfig';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { electingWildlifeSimulationLeaderUserId } from '@/components/world/wildlife/domains/electingWildlifeSimulationLeaderUserId';
import {
  creatingWildlifeInstanceStore,
  listingWildlifeInstances,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { useCallback, useRef } from 'react';

export type UsingWildlifeSimulationParams =
  DefiningWildlifeSimulationTickConfig;

export type UsingWildlifeSimulationResult = {
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>;
  tickConfigRef: React.RefObject<DefiningWildlifeSimulationTickConfig>;
  applyWildlifeDamageRef: React.RefObject<
    ((
      instanceId: string,
      damageAmount: number,
      projectileArchetypeId?: string
    ) => void) | null
  >;
};

export function usingWildlifeSimulation(
  params: UsingWildlifeSimulationParams
): UsingWildlifeSimulationResult {
  const wildlifeStoreRef = useRef<ManagingWildlifeInstanceStore>(
    creatingWildlifeInstanceStore()
  );
  const tickConfigRef = useRef(params);
  tickConfigRef.current = params;

  const applyWildlifeDamageRef = useRef<
    ((
      instanceId: string,
      damageAmount: number,
      projectileArchetypeId?: string
    ) => void) | null
  >(null);

  const applyingDamage = useCallback(
    (
      instanceId: string,
      damageAmount: number,
      projectileArchetypeId?: string
    ) => {
      const { localUserId, remoteUserIds, pendingWildlifeDamageEventsRef, meatDropContextRef, playerPositionRef } =
        tickConfigRef.current;

      if (!localUserId) {
        return;
      }

      const leaderUserId = electingWildlifeSimulationLeaderUserId(
        localUserId,
        remoteUserIds
      );

      if (leaderUserId !== localUserId) {
        pendingWildlifeDamageEventsRef?.current?.push({
          instanceId,
          damageAmount,
          attackerUserId: localUserId,
          atMs: Date.now(),
          ...(projectileArchetypeId
            ? { projectileArchetypeId }
            : {}),
        });
        return;
      }

      applyingWildlifeInstanceDamage(
        wildlifeStoreRef.current,
        instanceId,
        damageAmount,
        localUserId,
        resolvingWildlifeSpeciesDefinition,
        Date.now(),
        (() => {
          const playerPosition = playerPositionRef.current;
          const baseContext = meatDropContextRef?.current;

          if (!playerPosition || !baseContext) {
            return null;
          }

          return { ...baseContext, playerPosition };
        })(),
        projectileArchetypeId ?? null
      );
    },
    []
  );

  applyWildlifeDamageRef.current = applyingDamage;

  return {
    wildlifeStoreRef,
    tickConfigRef,
    applyWildlifeDamageRef,
  };
}

export function listingWildlifeInstancesFromStore(
  store: ManagingWildlifeInstanceStore
) {
  return listingWildlifeInstances(store);
}
