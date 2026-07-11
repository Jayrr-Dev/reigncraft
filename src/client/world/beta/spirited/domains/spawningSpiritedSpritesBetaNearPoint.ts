/**
 * Spawns one Spirited beta animal near a world point for visual testing.
 *
 * @module components/world/beta/spirited/domains/spawningSpiritedSpritesBetaNearPoint
 */

import {
  DEFINING_SPIRITED_SPRITES_BETA_SPAWN_OFFSET_GRID,
  resolvingSpiritedSpritesBetaAnimalDefinition,
  type DefiningSpiritedSpritesBetaAnimalId,
} from '@/components/world/beta/spirited/domains/definingSpiritedSpritesBetaCatalog';
import {
  DEFINING_SPIRITED_SPRITES_BETA_WANDER_RADIUS_GRID,
  DEFINING_SPIRITED_SPRITES_BETA_WANDER_RETARGET_MIN_SEC,
} from '@/components/world/beta/spirited/domains/definingSpiritedSpritesBetaWalkConstants';
import {
  addingSpiritedSpritesBetaSpawnInstance,
  type ManagingSpiritedSpritesBetaSpawnStore,
} from '@/components/world/beta/spirited/domains/managingSpiritedSpritesBetaSpawnStore';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

export type SpawningSpiritedSpritesBetaNearPointParams = {
  readonly store: ManagingSpiritedSpritesBetaSpawnStore;
  readonly center: DefiningWorldPlazaWorldPoint;
  readonly animalId: DefiningSpiritedSpritesBetaAnimalId;
  readonly nowMs: number;
};

/**
 * Places one Spirited beta animal a short offset in front of `center`.
 */
export function spawningSpiritedSpritesBetaNearPoint({
  store,
  center,
  animalId,
  nowMs,
}: SpawningSpiritedSpritesBetaNearPointParams): string | null {
  const definition = resolvingSpiritedSpritesBetaAnimalDefinition(animalId);
  if (!definition) {
    return null;
  }

  const instanceId = `spirited-beta-${animalId}-${nowMs}-${store.revision}`;
  const offset = DEFINING_SPIRITED_SPRITES_BETA_SPAWN_OFFSET_GRID;
  const originX = center.x + offset;
  const originY = center.y;
  const facingFrame = Math.floor(Math.random() * 8);
  const wanderAngle = Math.random() * Math.PI * 2;
  const wanderDistance =
    1.2 +
    Math.random() * (DEFINING_SPIRITED_SPRITES_BETA_WANDER_RADIUS_GRID - 1.2);

  addingSpiritedSpritesBetaSpawnInstance(store, {
    instanceId,
    animalId,
    spawnedAtMs: nowMs,
    originX,
    originY,
    position: {
      x: originX,
      y: originY,
      layer: center.layer,
    },
    facingFrame,
    velocityX: 0,
    velocityY: 0,
    wanderTargetX: originX + Math.cos(wanderAngle) * wanderDistance,
    wanderTargetY: originY + Math.sin(wanderAngle) * wanderDistance,
    nextRetargetAtSec:
      nowMs / 1000 + DEFINING_SPIRITED_SPRITES_BETA_WANDER_RETARGET_MIN_SEC,
    bobPhaseSec: Math.random() * Math.PI * 2,
  });

  return instanceId;
}
