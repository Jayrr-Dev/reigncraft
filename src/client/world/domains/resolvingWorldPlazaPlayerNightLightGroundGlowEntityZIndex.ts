import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET } from "@/components/world/domains/definingWorldPlazaAvatarGroundShadowConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import {
  resolvingWorldPlazaAvatarBodyEntityZIndex,
  resolvingWorldPlazaAvatarGroundShadowEntityZIndex,
} from "@/components/world/domains/resolvingWorldPlazaAvatarGroundShadowEntityZIndex";

/**
 * Entity-layer depth sort key for the local player torch pool.
 *
 * Mirrors avatar shadow sorting: stay below the body, and clamp under nearby
 * column rocks, trees, and placed blocks the ellipse can overlap.
 *
 * @param gridPoint - Player grid position (floats allowed).
 * @param placedBlocks - Placed blocks near the footprint.
 */
export function resolvingWorldPlazaPlayerNightLightGroundGlowEntityZIndex(
  gridPoint: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
): number {
  const bodySyncedZIndex =
    resolvingWorldPlazaAvatarBodyEntityZIndex(gridPoint, placedBlocks) +
    DEFINING_WORLD_PLAZA_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET;

  return Math.min(
    bodySyncedZIndex,
    resolvingWorldPlazaAvatarGroundShadowEntityZIndex(gridPoint, placedBlocks),
  );
}
