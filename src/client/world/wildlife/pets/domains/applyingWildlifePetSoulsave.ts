/**
 * Intercepts fatal damage on a Bonded pet with a one-time soulsave revive.
 *
 * @module components/world/wildlife/pets/domains/applyingWildlifePetSoulsave
 */

import { revivingWorldPlazaEntityHealthToFull } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { checkingWildlifePetHasCapability } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';

/** Offset from the owner where a soulsaved pet reappears (grid units). */
const DEFINING_WILDLIFE_PET_SOULSAVE_REVIVE_OFFSET_GRID = 1.5;

export type ApplyingWildlifePetSoulsaveParams = {
  /** Instance after fatal damage has been applied (isDead, or HP ≤ 0). */
  instance: DefiningWildlifeInstance;
  ownerPosition?: DefiningWorldPlazaWorldPoint | null;
  nowMs: number;
};

export type ApplyingWildlifePetSoulsaveResult =
  | { intercepted: true; instance: DefiningWildlifeInstance }
  | { intercepted: false };

/**
 * Bonded (max loyalty) companions revive to full HP the first time they
 * would die, then spend their one-time soulsave. Call right after applying
 * fatal damage; when intercepted, replace the dead instance with the result.
 */
export function applyingWildlifePetSoulsave({
  instance,
  ownerPosition = null,
  nowMs,
}: ApplyingWildlifePetSoulsaveParams): ApplyingWildlifePetSoulsaveResult {
  const petBond = instance.petBond;
  const isFatal = instance.isDead || instance.healthState.currentHealth <= 0;

  if (!petBond || !isFatal || petBond.soulsaveConsumed) {
    return { intercepted: false };
  }

  if (!checkingWildlifePetHasCapability(petBond.loyalty, 'soulsave')) {
    return { intercepted: false };
  }

  const revivedPosition = ownerPosition
    ? {
        x: ownerPosition.x + DEFINING_WILDLIFE_PET_SOULSAVE_REVIVE_OFFSET_GRID,
        y: ownerPosition.y + DEFINING_WILDLIFE_PET_SOULSAVE_REVIVE_OFFSET_GRID,
        layer: ownerPosition.layer,
      }
    : instance.position;

  return {
    intercepted: true,
    instance: {
      ...instance,
      isDead: false,
      diedAtMs: null,
      position: revivedPosition,
      healthState: revivingWorldPlazaEntityHealthToFull(
        instance.healthState,
        nowMs
      ),
      petBond: { ...petBond, soulsaveConsumed: true },
    },
  };
}
