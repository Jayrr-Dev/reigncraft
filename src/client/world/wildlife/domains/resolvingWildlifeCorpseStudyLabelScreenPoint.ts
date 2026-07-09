import { computingWorldPlazaTileCenterScreenAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaTileCenterScreenAnchorFromGridPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';

/** Lift above the corpse foot for the Study popover (world-local px). */
export const RESOLVING_WILDLIFE_CORPSE_STUDY_LABEL_OFFSET_ABOVE_FOOT_PX = 36;

/**
 * Maps a corpse world point to viewport coordinates for its Study popover.
 */
export function resolvingWildlifeCorpseStudyLabelScreenPoint(
  position: DefiningWorldPlazaWorldPoint,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number
): {
  readonly x: number;
  readonly y: number;
} {
  const tileAnchor = computingWorldPlazaTileCenterScreenAnchorFromGridPoint({
    x: position.x,
    y: position.y,
    layer: position.layer ?? 1,
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
      RESOLVING_WILDLIFE_CORPSE_STUDY_LABEL_OFFSET_ABOVE_FOOT_PX *
        cameraWorldZoom,
  };
}
