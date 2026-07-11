/**
 * Maps grid velocity to a Spirited beta facing frame (0..7).
 *
 * @module components/world/beta/spirited/domains/resolvingSpiritedSpritesBetaFacingFrame
 */

import { DEFINING_SPIRITED_SPRITES_BETA_FACING_FRAME_BY_WALK_DIRECTION } from '@/components/world/beta/spirited/domains/definingSpiritedSpritesBetaWalkConstants';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { resolvingWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirection';

const DEFINING_SPIRITED_SPRITES_BETA_WALK_DIRECTION_BY_FACING_FRAME: Record<
  number,
  DefiningWorldPlazaGirlSampleWalkDirection
> = {
  0: 'Right',
  1: 'DownRight',
  2: 'Down',
  3: 'DownLeft',
  4: 'Left',
  5: 'UpLeft',
  6: 'Up',
  7: 'UpRight',
};

/**
 * Picks the directional pose frame for a grid-space move delta.
 */
export function resolvingSpiritedSpritesBetaFacingFrameFromGridDelta(
  deltaX: number,
  deltaY: number,
  fallbackFrame: number
): number {
  const fallbackDirection =
    DEFINING_SPIRITED_SPRITES_BETA_WALK_DIRECTION_BY_FACING_FRAME[
      ((fallbackFrame % 8) + 8) % 8
    ] ?? 'Right';

  const walkDirection = resolvingWorldPlazaGirlSampleWalkDirection(
    deltaX,
    deltaY,
    fallbackDirection
  );

  return DEFINING_SPIRITED_SPRITES_BETA_FACING_FRAME_BY_WALK_DIRECTION[
    walkDirection
  ];
}
