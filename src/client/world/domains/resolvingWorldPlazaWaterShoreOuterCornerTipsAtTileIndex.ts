import {
  DEFINING_WORLD_PLAZA_WATER_SHORE_OUTER_CORNER_TIP_REGISTRY,
  type DefiningWorldPlazaWaterShoreOuterCornerTipDefinition,
} from '@/components/world/domains/definingWorldPlazaWaterShoreOuterCornerTipRegistry';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';

/**
 * Resolves land diamond tips that poke into adjacent water at outer corners.
 *
 * @module components/world/domains/resolvingWorldPlazaWaterShoreOuterCornerTipsAtTileIndex
 */

/** One resolved outer corner tip on a dry land tile. */
export type ResolvingWorldPlazaWaterShoreOuterCornerTip = {
  readonly landTileX: number;
  readonly landTileY: number;
  readonly tip: DefiningWorldPlazaWaterShoreOuterCornerTipDefinition;
  /** Water tile used for surface tint (first water neighbor). */
  readonly waterTileX: number;
  readonly waterTileY: number;
};

/**
 * Lists outer land-corner tips on one dry tile that need water surface cover.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaWaterShoreOuterCornerTipsAtTileIndex(
  tileX: number,
  tileY: number
): readonly ResolvingWorldPlazaWaterShoreOuterCornerTip[] {
  if (resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return [];
  }

  const tips: ResolvingWorldPlazaWaterShoreOuterCornerTip[] = [];

  for (const tip of DEFINING_WORLD_PLAZA_WATER_SHORE_OUTER_CORNER_TIP_REGISTRY) {
    const waterA = resolvingWorldPlazaWaterAtTileIndex(
      tileX + tip.waterDeltaA.deltaX,
      tileY + tip.waterDeltaA.deltaY
    );
    const waterB = resolvingWorldPlazaWaterAtTileIndex(
      tileX + tip.waterDeltaB.deltaX,
      tileY + tip.waterDeltaB.deltaY
    );

    if (!waterA || !waterB) {
      continue;
    }

    tips.push({
      landTileX: tileX,
      landTileY: tileY,
      tip,
      waterTileX: tileX + tip.waterDeltaA.deltaX,
      waterTileY: tileY + tip.waterDeltaA.deltaY,
    });
  }

  return tips;
}
