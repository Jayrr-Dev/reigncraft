import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { findingWorldCollisionBlockerAtPoint } from '@/components/world/collision';
import type { CheckingWorldPlazaTerrainElevationColumnCollisionContext } from '@/components/world/domains/checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MIN_ATTEMPTED_GRID,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MOVEMENT_REDUCTION_EPSILON_GRID,
} from '@/components/world/domains/definingWorldPlazaTerrainCollisionBlockerHitDebugConstants';
import { recordingWorldPlazaTerrainCollisionBlockerHitDebugState } from '@/components/world/domains/recordingWorldPlazaTerrainCollisionBlockerHitDebugState';

/**
 * Records blocker-hit debug when collision shortens a movement step.
 *
 * @module components/world/domains/recordingWorldPlazaTerrainCollisionBlockerHitWhenMovementReduced
 */

/** How far past the resolved stop point to probe for the blocking surface. */
const RECORDING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_PROBE_PAST_RESOLVED_FRACTION = 0.03;

/** Options for {@link recordingWorldPlazaTerrainCollisionBlockerHitWhenMovementReduced}. */
export interface RecordingWorldPlazaTerrainCollisionBlockerHitWhenMovementReducedOptions {
  /** Whether full block collision is active. */
  applyBlockCollision: boolean;
  /** True while a jump animation is active. */
  isJumping: boolean;
  /** Player-placed blocks near the avatar. */
  placedBlocks?: DefiningWorldBuildingPlacedBlock[];
  /** Current player standing layer. */
  playerLayer?: number;
  /** Ledge lip relief context. */
  terrainColumnCollisionContext?: CheckingWorldPlazaTerrainElevationColumnCollisionContext;
}

/**
 * Records a blocker hit when a movement step was shortened by collision.
 *
 * @param from - Position before this frame's movement attempt.
 * @param desired - Uncorrected target position for this frame.
 * @param resolved - Position after collision resolution.
 * @param options - Collision context for this frame.
 */
export function recordingWorldPlazaTerrainCollisionBlockerHitWhenMovementReduced(
  from: DefiningWorldPlazaWorldPoint,
  desired: DefiningWorldPlazaWorldPoint,
  resolved: DefiningWorldPlazaWorldPoint,
  options: RecordingWorldPlazaTerrainCollisionBlockerHitWhenMovementReducedOptions
): void {
  const attemptedDelta = Math.hypot(desired.x - from.x, desired.y - from.y);

  if (
    attemptedDelta <
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MIN_ATTEMPTED_GRID
  ) {
    return;
  }

  const actualDelta = Math.hypot(resolved.x - from.x, resolved.y - from.y);

  if (
    actualDelta >=
    attemptedDelta -
      DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_MOVEMENT_REDUCTION_EPSILON_GRID
  ) {
    return;
  }

  const traveledFraction = actualDelta / attemptedDelta;
  const probeFraction = Math.min(
    1,
    traveledFraction +
      RECORDING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_PROBE_PAST_RESOLVED_FRACTION
  );
  const probePoint: DefiningWorldPlazaWorldPoint = {
    x: from.x + (desired.x - from.x) * probeFraction,
    y: from.y + (desired.y - from.y) * probeFraction,
    layer: desired.layer ?? from.layer,
  };

  const blocker = findingWorldCollisionBlockerAtPoint(probePoint, options);

  if (!blocker) {
    return;
  }

  recordingWorldPlazaTerrainCollisionBlockerHitDebugState({
    ...blocker,
    gridX: resolved.x,
    gridY: resolved.y,
  });
}
