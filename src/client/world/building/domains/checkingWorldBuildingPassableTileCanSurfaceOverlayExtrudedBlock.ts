import { resolvingWorldBuildingPlacedBlockTopWorldLayer } from "@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand";
import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import {
  resolvingWorldBuildingPlacedBlockBlockHeight,
  resolvingWorldBuildingPlacedBlockWorldLayer,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { checkingWorldBuildingPlacedBlockIsPassableTile } from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";
import { checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay } from "@/components/world/building/domains/checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay";

/**
 * Validates passable tile surface overlays on extruded block top faces.
 *
 * @module components/world/building/domains/checkingWorldBuildingPassableTileCanSurfaceOverlayExtrudedBlock
 */

/**
 * Returns true when an extruded block can receive a passable tile overlay on its
 * top face at the requested layer.
 *
 * @param extrudedBlock - Existing column block at the target layer key.
 * @param worldLayer - Placement layer for the passable tile overlay.
 */
export function checkingWorldBuildingPassableTileCanSurfaceOverlayExtrudedBlock(
  extrudedBlock: DefiningWorldBuildingPlacedBlock,
  worldLayer: number,
): boolean {
  if (
    checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay(extrudedBlock)
  ) {
    return false;
  }

  const blockHeight = resolvingWorldBuildingPlacedBlockBlockHeight(extrudedBlock);

  if (checkingWorldBuildingPlacedBlockIsPassableTile(blockHeight)) {
    return false;
  }

  const anchorWorldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(extrudedBlock);
  const topWorldLayer =
    resolvingWorldBuildingPlacedBlockTopWorldLayer(extrudedBlock);

  return (
    worldLayer === topWorldLayer && anchorWorldLayer === topWorldLayer
  );
}
