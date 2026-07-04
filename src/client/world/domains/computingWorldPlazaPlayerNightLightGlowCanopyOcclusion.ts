import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { computingWorldPlazaTreeCanopyPlayerOcclusionStrength } from "@/components/world/domains/checkingWorldPlazaPlayerUnderTreeCanopy";
import { DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS } from "@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from "@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds";

/** Extra tiles scanned beyond the shadow footprint so wide torch pools react to nearby crowns. */
const COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_CANOPY_SCAN_TILE_PADDING = 2;

/**
 * Returns the strongest canopy fade strength affecting the player (0..1).
 *
 * Matches the tree canopy under-player fade so torch light does not bleed
 * through semi-transparent foliage.
 *
 * @param playerPosition - Player position in grid space.
 * @param placedBlocks - Placed blocks near the player.
 */
export function computingWorldPlazaPlayerNightLightMaxCanopyOcclusionStrength(
  playerPosition: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
): number {
  const centerTileX = Math.floor(playerPosition.x);
  const centerTileY = Math.floor(playerPosition.y);
  const scanRadius =
    DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_FOOTPRINT_TILE_RADIUS +
    COMPUTING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_CANOPY_SCAN_TILE_PADDING;
  let maxOcclusionStrength = 0;

  for (let tileOffsetY = -scanRadius; tileOffsetY <= scanRadius; tileOffsetY += 1) {
    for (let tileOffsetX = -scanRadius; tileOffsetX <= scanRadius; tileOffsetX += 1) {
      const tree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
        centerTileX + tileOffsetX,
        centerTileY + tileOffsetY,
        placedBlocks,
      );

      if (!tree) {
        continue;
      }

      maxOcclusionStrength = Math.max(
        maxOcclusionStrength,
        computingWorldPlazaTreeCanopyPlayerOcclusionStrength(playerPosition, tree),
      );
    }
  }

  return maxOcclusionStrength;
}

/**
 * Scales torch glow brightness down when the player stands under tree crowns.
 *
 * @param glowBrightness - Base torch brightness from the night cycle.
 * @param playerPosition - Player position in grid space.
 * @param placedBlocks - Placed blocks near the player.
 */
export function computingWorldPlazaPlayerNightLightGlowBrightnessAfterCanopyOcclusion(
  glowBrightness: number,
  playerPosition: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
): number {
  const canopyOcclusionStrength =
    computingWorldPlazaPlayerNightLightMaxCanopyOcclusionStrength(
      playerPosition,
      placedBlocks,
    );
  const glowVisibility = 1 - canopyOcclusionStrength;

  return glowBrightness * glowVisibility * glowVisibility;
}
