/**
 * Resolves wildlife facing from movement or combat intent.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeInstanceFacingDirection
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirection';
import { resolvingWorldPlazaGirlSampleWalkDirectionTowardGridPoint } from '@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirectionTowardGridPoint';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Chase and attack facing tracks the target so collision push-back does not
 * flip the sprite away from prey or the player.
 */
export function resolvingWildlifeInstanceFacingDirection(
  position: DefiningWorldPlazaWorldPoint,
  intent: DefiningWildlifeBehaviorIntent,
  movedX: number,
  movedY: number,
  fallbackDirection: DefiningWorldPlazaGirlSampleWalkDirection
): DefiningWorldPlazaGirlSampleWalkDirection {
  if (intent.mode === 'stalk' && intent.facingPoint !== undefined) {
    return resolvingWorldPlazaGirlSampleWalkDirectionTowardGridPoint(
      position,
      intent.facingPoint,
      fallbackDirection
    );
  }

  if (
    (intent.mode === 'flee' ||
      intent.mode === 'chase' ||
      intent.mode === 'attack' ||
      intent.mode === 'stalk' ||
      intent.mode === 'territoryWarn' ||
      intent.mode === 'forageChase' ||
      intent.mode === 'forageEat') &&
    intent.targetPoint
  ) {
    return resolvingWorldPlazaGirlSampleWalkDirectionTowardGridPoint(
      position,
      intent.targetPoint,
      fallbackDirection
    );
  }

  return resolvingWorldPlazaGirlSampleWalkDirection(
    movedX,
    movedY,
    fallbackDirection
  );
}
