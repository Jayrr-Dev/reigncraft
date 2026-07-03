import { blendingWorldPlazaRgbColors } from "@/components/world/domains/blendingWorldPlazaRgbColors";
import {
  DEFINING_WORLD_PLAZA_MINI_MAP_BOULDER_SHORT_FILL_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_BOULDER_TALL_FILL_COLOR,
} from "@/components/world/domains/definingWorldPlazaMiniMapConstants";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MAX_SURFACE_WORLD_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MEDIUM_SURFACE_WORLD_LAYER,
} from "@/components/world/domains/definingWorldPlazaTerrainRockConstants";
import { formattingWorldPlazaPixiColorToCssHex } from "@/components/world/domains/formattingWorldPlazaPixiColorToCssHex";

/**
 * Minimap fill colors for procedural column rocks scaled by boulder height.
 *
 * @module components/world/domains/resolvingWorldPlazaMiniMapBoulderFillColorFromSurfaceWorldLayer
 */

/**
 * Returns a CSS hex fill for one column-rock tile on the minimap.
 *
 * Taller boulders read darker so height and footprint size are both visible.
 *
 * @param surfaceWorldLayer - Absolute top world layer of the boulder.
 */
export function resolvingWorldPlazaMiniMapBoulderFillColorFromSurfaceWorldLayer(
  surfaceWorldLayer: number,
): string {
  const layerSpan =
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MAX_SURFACE_WORLD_LAYER -
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MEDIUM_SURFACE_WORLD_LAYER;

  if (layerSpan <= 0) {
    return formattingWorldPlazaPixiColorToCssHex(
      DEFINING_WORLD_PLAZA_MINI_MAP_BOULDER_SHORT_FILL_COLOR,
    );
  }

  const clampedLayer = Math.min(
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MAX_SURFACE_WORLD_LAYER,
    Math.max(
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MEDIUM_SURFACE_WORLD_LAYER,
      surfaceWorldLayer,
    ),
  );
  const heightUnit =
    (clampedLayer - DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MEDIUM_SURFACE_WORLD_LAYER) /
    layerSpan;
  const blendedColor = blendingWorldPlazaRgbColors(
    DEFINING_WORLD_PLAZA_MINI_MAP_BOULDER_SHORT_FILL_COLOR,
    DEFINING_WORLD_PLAZA_MINI_MAP_BOULDER_TALL_FILL_COLOR,
    heightUnit,
  );

  return formattingWorldPlazaPixiColorToCssHex(blendedColor);
}
