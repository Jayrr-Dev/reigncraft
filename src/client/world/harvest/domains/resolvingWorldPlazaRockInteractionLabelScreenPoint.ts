import { computingWorldPlazaTileCenterScreenAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaTileCenterScreenAnchorFromGridPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';
import { resolvingWorldPlazaColumnRockCollisionCenterGridPointFromMetadata } from '@/components/world/domains/resolvingWorldPlazaColumnRockCollisionRadiusGridFromMetadata';
import type { DefiningWorldPlazaColumnRockMetadata } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex';

/** Lift above the boulder footprint for the interaction popover anchor (world-local px). */
export const RESOLVING_WORLD_PLAZA_ROCK_INTERACTION_LABEL_OFFSET_ABOVE_FOOTPRINT_PX = 28;

/**
 * Maps a column rock to viewport coordinates for its mine popover.
 */
export function resolvingWorldPlazaRockInteractionLabelScreenPoint(
  metadata: DefiningWorldPlazaColumnRockMetadata,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number
): {
  readonly x: number;
  readonly y: number;
} {
  const footprintCenter =
    resolvingWorldPlazaColumnRockCollisionCenterGridPointFromMetadata(metadata);
  const tileAnchor = computingWorldPlazaTileCenterScreenAnchorFromGridPoint({
    x: footprintCenter.x,
    y: footprintCenter.y,
    layer: metadata.surfaceWorldLayer,
  });
  const viewportPoint =
    projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
      {
        x: tileAnchor.centerXPx,
        y: tileAnchor.centerYPx,
      },
      cameraOffset,
      cameraWorldZoom
    );

  return {
    x: viewportPoint.x,
    y:
      viewportPoint.y -
      RESOLVING_WORLD_PLAZA_ROCK_INTERACTION_LABEL_OFFSET_ABOVE_FOOTPRINT_PX *
        cameraWorldZoom,
  };
}
