import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { resolvingWorldBuildingPlacedBlockWorldLayer } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { computingWorldPlazaTileCenterScreenAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaTileCenterScreenAnchorFromGridPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';
import { resolvingWorldPlazaCampfireFlameFootOffsetFromFootAnchorPx } from '@/components/world/fire/domains/drawingWorldPlazaCampfireOnGraphics';

/** Lift above the campfire flame foot for the interaction popover anchor (world-local px). */
export const RESOLVING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_OFFSET_ABOVE_FLAME_FOOT_PX = 20;

/**
 * Maps a campfire block to viewport coordinates for its interaction popover.
 *
 * Uses the same tile anchor and flame-foot offset as the fire layer sprites.
 */
export function resolvingWorldPlazaCampfireInteractionLabelScreenPoint(
  block: DefiningWorldBuildingPlacedBlock,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number
): {
  x: number;
  y: number;
} {
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
  const tileAnchor = computingWorldPlazaTileCenterScreenAnchorFromGridPoint({
    x: block.tilePosition.tileX,
    y: block.tilePosition.tileY,
    layer: worldLayer,
  });
  const flameFootOffsetPx =
    resolvingWorldPlazaCampfireFlameFootOffsetFromFootAnchorPx();
  const viewportPoint =
    projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
      {
        x: tileAnchor.centerXPx,
        y: tileAnchor.centerYPx + flameFootOffsetPx,
      },
      cameraOffset,
      cameraWorldZoom
    );

  return {
    x: viewportPoint.x,
    y:
      viewportPoint.y -
      RESOLVING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_OFFSET_ABOVE_FLAME_FOOT_PX *
        cameraWorldZoom,
  };
}
