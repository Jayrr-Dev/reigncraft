/**
 * Advances Spirited beta slide-walk / wander for one tick.
 *
 * @module components/world/beta/spirited/domains/advancingSpiritedSpritesBetaWalkTick
 */

import {
  DEFINING_SPIRITED_SPRITES_BETA_WALK_BOB_AMPLITUDE_PX,
  DEFINING_SPIRITED_SPRITES_BETA_WALK_BOB_HZ,
  DEFINING_SPIRITED_SPRITES_BETA_WALK_SPEED_GRID_PER_SEC,
  DEFINING_SPIRITED_SPRITES_BETA_WANDER_ARRIVE_GRID,
  DEFINING_SPIRITED_SPRITES_BETA_WANDER_RADIUS_GRID,
  DEFINING_SPIRITED_SPRITES_BETA_WANDER_RETARGET_MAX_SEC,
  DEFINING_SPIRITED_SPRITES_BETA_WANDER_RETARGET_MIN_SEC,
} from '@/components/world/beta/spirited/domains/definingSpiritedSpritesBetaWalkConstants';
import type { ManagingSpiritedSpritesBetaSpawnInstance } from '@/components/world/beta/spirited/domains/managingSpiritedSpritesBetaSpawnStore';
import { resolvingSpiritedSpritesBetaFacingFrameFromGridDelta } from '@/components/world/beta/spirited/domains/resolvingSpiritedSpritesBetaFacingFrame';

function pickingSpiritedSpritesBetaWanderTarget(
  instance: ManagingSpiritedSpritesBetaSpawnInstance,
  nowSec: number
): void {
  const angle = Math.random() * Math.PI * 2;
  const distance =
    Math.random() * DEFINING_SPIRITED_SPRITES_BETA_WANDER_RADIUS_GRID;
  instance.wanderTargetX = instance.originX + Math.cos(angle) * distance;
  instance.wanderTargetY = instance.originY + Math.sin(angle) * distance;

  const retargetSpan =
    DEFINING_SPIRITED_SPRITES_BETA_WANDER_RETARGET_MAX_SEC -
    DEFINING_SPIRITED_SPRITES_BETA_WANDER_RETARGET_MIN_SEC;
  instance.nextRetargetAtSec =
    nowSec +
    DEFINING_SPIRITED_SPRITES_BETA_WANDER_RETARGET_MIN_SEC +
    Math.random() * retargetSpan;
}

/**
 * Moves one Spirited beta instance toward its wander target and updates facing.
 *
 * @returns Screen-space bob offset in px (0 when idle).
 */
export function advancingSpiritedSpritesBetaWalkTick(
  instance: ManagingSpiritedSpritesBetaSpawnInstance,
  deltaSec: number,
  nowSec: number
): number {
  if (
    nowSec >= instance.nextRetargetAtSec ||
    (instance.wanderTargetX === instance.position.x &&
      instance.wanderTargetY === instance.position.y)
  ) {
    pickingSpiritedSpritesBetaWanderTarget(instance, nowSec);
  }

  const deltaX = instance.wanderTargetX - instance.position.x;
  const deltaY = instance.wanderTargetY - instance.position.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance <= DEFINING_SPIRITED_SPRITES_BETA_WANDER_ARRIVE_GRID) {
    pickingSpiritedSpritesBetaWanderTarget(instance, nowSec);
    instance.velocityX = 0;
    instance.velocityY = 0;
    return 0;
  }

  const step = Math.min(
    distance,
    DEFINING_SPIRITED_SPRITES_BETA_WALK_SPEED_GRID_PER_SEC * deltaSec
  );
  const invDistance = 1 / distance;
  const moveX = deltaX * invDistance * step;
  const moveY = deltaY * invDistance * step;

  instance.position.x += moveX;
  instance.position.y += moveY;
  instance.velocityX = moveX / Math.max(deltaSec, 1 / 240);
  instance.velocityY = moveY / Math.max(deltaSec, 1 / 240);
  instance.facingFrame = resolvingSpiritedSpritesBetaFacingFrameFromGridDelta(
    moveX,
    moveY,
    instance.facingFrame
  );
  instance.bobPhaseSec += deltaSec;

  return Math.round(
    Math.sin(
      instance.bobPhaseSec *
        DEFINING_SPIRITED_SPRITES_BETA_WALK_BOB_HZ *
        Math.PI *
        2
    ) * DEFINING_SPIRITED_SPRITES_BETA_WALK_BOB_AMPLITUDE_PX
  );
}
