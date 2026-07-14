/**
 * Resolves wildlife facing from movement or combat intent.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeInstanceFacingDirection
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirection';
import { resolvingWorldPlazaGirlSampleWalkDirectionTowardGridPoint } from '@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirectionTowardGridPoint';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';

function checkingWildlifeFacingHasMovementDelta(
  movedX: number,
  movedY: number
): boolean {
  return (
    Math.hypot(movedX, movedY) >
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON
  );
}

function resolvingWildlifeIntentLookAtPoint(
  intent: DefiningWildlifeBehaviorIntent
): DefiningWorldPlazaWorldPoint | null {
  if (intent.mode === 'stalk' && intent.facingPoint !== undefined) {
    return intent.facingPoint;
  }

  if (
    intent.mode === 'flee' ||
    intent.mode === 'chase' ||
    intent.mode === 'attack' ||
    intent.mode === 'stalk' ||
    intent.mode === 'followGuardian' ||
    intent.mode === 'seekPackmate' ||
    intent.mode === 'followPlayer' ||
    intent.mode === 'territoryWarn' ||
    intent.mode === 'forageChase' ||
    intent.mode === 'forageEat'
  ) {
    return intent.targetPoint ?? null;
  }

  return null;
}

/**
 * Chase and attack facing tracks the target while standing still so collision
 * push-back does not flip the sprite away from prey or the player.
 *
 * While the body is actually moving, facing follows movement so retreat and
 * shadow-wander legs do not play walk/run clips backwards.
 *
 * Pouncer retreat is the exception: the animal faces prey while playing the
 * dedicated runBackwards clip.
 */
export function resolvingWildlifeInstanceFacingDirection(
  position: DefiningWorldPlazaWorldPoint,
  intent: DefiningWildlifeBehaviorIntent,
  movedX: number,
  movedY: number,
  fallbackDirection: DefiningWorldPlazaGirlSampleWalkDirection,
  options?: {
    preferFacingPointWhileMoving?: boolean;
  }
): DefiningWorldPlazaGirlSampleWalkDirection {
  const lookAtPoint = resolvingWildlifeIntentLookAtPoint(intent);

  if (
    options?.preferFacingPointWhileMoving &&
    lookAtPoint &&
    checkingWildlifeFacingHasMovementDelta(movedX, movedY)
  ) {
    return resolvingWorldPlazaGirlSampleWalkDirectionTowardGridPoint(
      position,
      lookAtPoint,
      fallbackDirection
    );
  }

  if (checkingWildlifeFacingHasMovementDelta(movedX, movedY)) {
    return resolvingWorldPlazaGirlSampleWalkDirection(
      movedX,
      movedY,
      fallbackDirection
    );
  }

  if (lookAtPoint) {
    return resolvingWorldPlazaGirlSampleWalkDirectionTowardGridPoint(
      position,
      lookAtPoint,
      fallbackDirection
    );
  }

  return resolvingWorldPlazaGirlSampleWalkDirection(
    movedX,
    movedY,
    fallbackDirection
  );
}
