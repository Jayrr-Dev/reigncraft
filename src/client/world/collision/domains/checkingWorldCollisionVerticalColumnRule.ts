import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';

/**
 * Unified vertical column wall rule for terrain, rocks, and similar columns.
 *
 * @module components/world/collision/domains/checkingWorldCollisionVerticalColumnRule
 */

/** Input for the shared column blocking decision. */
export type CheckingWorldCollisionVerticalColumnRuleInput = {
  /** Player standing world layer. */
  readonly playerLayer: number;
  /** Column top surface world layer. */
  readonly surfaceLayer: number;
  /** Whether full block collision applies this frame (false mid-jump arc). */
  readonly applyBlockCollision: boolean;
  /** True when the column is only one layer above the player (walkable stair). */
  readonly isWalkableStep: boolean;
  /** True when vertical bands do not overlap (player clears the column height). */
  readonly verticalBandsOverlap: boolean;
  /** When true, skip blocking (ledge lip walked off behind movement). */
  readonly cliffLipRelief?: boolean;
  /** Max upward layers this mover can jump onto. */
  readonly jumpLayerReachMax?: number;
};

/**
 * Returns true when a vertical column should block horizontal movement.
 *
 * Mirrors terrain elevation, column rock, and tree-canopy column semantics.
 */
export function checkingWorldCollisionVerticalColumnBlocksPlayer(
  input: CheckingWorldCollisionVerticalColumnRuleInput
): boolean {
  if (input.surfaceLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return false;
  }

  if (input.playerLayer >= input.surfaceLayer) {
    return false;
  }

  if (input.isWalkableStep) {
    return false;
  }

  if (!input.verticalBandsOverlap) {
    return false;
  }

  const jumpLayerReachMax =
    input.jumpLayerReachMax ?? DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX;

  if (input.surfaceLayer - input.playerLayer > jumpLayerReachMax) {
    return true;
  }

  if (input.cliffLipRelief) {
    return false;
  }

  return input.applyBlockCollision;
}
