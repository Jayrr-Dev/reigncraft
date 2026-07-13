/**
 * Picks the nearest living pettable companion from proximity selection keys.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeDocilePetProximityPending
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeDocilePetIsReady } from '@/components/world/wildlife/domains/checkingWildlifeDocilePetIsReady';
import { resolvingWildlifeDocilePetKind } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsPettable';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeDocilePetInstanceIdFromSelectionKey } from '@/components/world/wildlife/domains/formattingWildlifeDocilePetSelectionKey';
import type { ManagingWildlifeDocileAttackConfirmPending } from '@/components/world/wildlife/domains/managingWildlifeDocileAttackConfirmStore';
import {
  gettingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

export type ResolvingWildlifeDocilePetProximityPendingParams = {
  readonly wildlifeStore: ManagingWildlifeInstanceStore;
  readonly selectedKeys: ReadonlySet<string>;
  readonly playerPosition: DefiningWorldPlazaWorldPoint | null;
  readonly currentPending: ManagingWildlifeDocileAttackConfirmPending | null;
  /** Keep the active Pet windup target even if proximity briefly drops. */
  readonly activePettingInstanceId: string | null;
  readonly nowMs: number;
};

/**
 * Resolves which Pet label should stay pending from proximity selection.
 * Returns null when no living pettable companion is selected nearby.
 */
export function resolvingWildlifeDocilePetProximityPending(
  params: ResolvingWildlifeDocilePetProximityPendingParams
): ManagingWildlifeDocileAttackConfirmPending | null {
  const {
    wildlifeStore,
    selectedKeys,
    playerPosition,
    currentPending,
    activePettingInstanceId,
    nowMs,
  } = params;

  if (activePettingInstanceId) {
    const activeInstance = gettingWildlifeInstance(
      wildlifeStore,
      activePettingInstanceId
    );
    const activePetKind = resolvingWildlifeDocilePetKind(
      activeInstance?.speciesId
    );

    if (activeInstance && !activeInstance.isDead && activePetKind) {
      if (
        currentPending &&
        currentPending.instanceId === activePettingInstanceId
      ) {
        return currentPending;
      }

      const species = resolvingWildlifeSpeciesDefinition(
        activeInstance.speciesId
      );

      return {
        instanceId: activeInstance.instanceId,
        speciesId: activeInstance.speciesId,
        displayName: species?.displayName ?? 'animal',
        petKind: activePetKind,
      };
    }
  }

  if (!playerPosition || selectedKeys.size === 0) {
    return null;
  }

  let nearestPending: ManagingWildlifeDocileAttackConfirmPending | null = null;
  let nearestDistanceSq = Number.POSITIVE_INFINITY;

  for (const selectionKey of selectedKeys) {
    const instanceId =
      resolvingWildlifeDocilePetInstanceIdFromSelectionKey(selectionKey);

    if (!instanceId) {
      continue;
    }

    const instance = gettingWildlifeInstance(wildlifeStore, instanceId);
    const petKind = resolvingWildlifeDocilePetKind(instance?.speciesId);

    if (
      !instance ||
      instance.isDead ||
      !petKind ||
      !checkingWildlifeDocilePetIsReady(instance, nowMs)
    ) {
      continue;
    }

    const dx = instance.position.x - playerPosition.x;
    const dy = instance.position.y - playerPosition.y;
    const distanceSq = dx * dx + dy * dy;

    if (distanceSq >= nearestDistanceSq) {
      continue;
    }

    nearestDistanceSq = distanceSq;
    const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

    nearestPending = {
      instanceId: instance.instanceId,
      speciesId: instance.speciesId,
      displayName: species?.displayName ?? 'animal',
      petKind,
    };
  }

  if (
    nearestPending &&
    currentPending &&
    currentPending.instanceId === nearestPending.instanceId &&
    currentPending.petKind === nearestPending.petKind
  ) {
    return currentPending;
  }

  return nearestPending;
}
