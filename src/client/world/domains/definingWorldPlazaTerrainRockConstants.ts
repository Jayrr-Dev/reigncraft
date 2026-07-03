import { clampingWorldBuildingWorldLayer } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX,
  DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX,
} from "@/components/world/domains/definingWorldPlazaTerrainObstacleConstants";

/**
 * Procedural terrain rock column constants (mega-boulders up to H16).
 *
 * Medium and large stones render as extruded isometric boulders on the entity
 * layer. Height and footprint span are seeded per spacing anchor so boulders can
 * grow up to 16 world layers tall and cover up to a 6x6 tile area.
 *
 * @module components/world/domains/definingWorldPlazaTerrainRockConstants
 */

/** Absolute world layer cap for medium jump-over rocks (minimum column height). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MEDIUM_SURFACE_WORLD_LAYER = 4;

/** Absolute world layer cap for large blocking boulders (legacy minimum). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_LARGE_SURFACE_WORLD_LAYER = 5;

/** Maximum absolute world layer for seeded mega-boulders. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MAX_SURFACE_WORLD_LAYER = 16;

/** Minimum seeded height span for medium-tier column rocks (layers 4 through 8). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MEDIUM_TIER_SURFACE_LAYER_SPAN = 5;

/** Minimum seeded height for large-tier column rocks before the random span. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_LARGE_TIER_MIN_SURFACE_WORLD_LAYER = 8;

/** Maximum footprint width or height in tiles for one mega-boulder. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MAX_FOOTPRINT_TILE_SPAN = 6;

/** Minimum footprint width or height in tiles for one mega-boulder. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_FOOTPRINT_TILE_SPAN = 1;

/** Seed salt selecting the column rock height within its tier range. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SEED_SALT_HEIGHT = 401;

/** Seed salt selecting the column rock footprint width in tiles. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SEED_SALT_FOOTPRINT_WIDTH = 409;

/** Seed salt selecting the column rock footprint height in tiles. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SEED_SALT_FOOTPRINT_HEIGHT = 417;

/** Horizontal visual scale applied per footprint tile width. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_FOOTPRINT_VISUAL_WIDTH_SCALE_PER_TILE = 0.52;

/** Vertical visual scale applied per footprint tile height. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_FOOTPRINT_VISUAL_HEIGHT_SCALE_PER_TILE = 0.48;

/**
 * Surface layer treated as the footprint reference (scale 1.0). Medium rocks
 * keep their tuned footprint; taller boulders scale up proportionally so a
 * higher-layer rock reads as both taller and wider.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_FOOTPRINT_REFERENCE_SURFACE_WORLD_LAYER =
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MEDIUM_SURFACE_WORLD_LAYER;

/** Footprint growth applied per world layer above the reference layer. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_FOOTPRINT_SCALE_PER_SURFACE_LAYER = 0.22;

/** Lower bound on the footprint scale so low layers never collapse to nothing. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_FOOTPRINT_MIN_SCALE = 0.6;

/** Upper bound on height-driven widening so tall mega-boulders stay readable. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_FOOTPRINT_MAX_HEIGHT_SCALE = 1.75;

/** Stone size tier index that begins column rock rendering. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_SIZE_TIER_INDEX =
  DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX;

/** Number of deterministic boulder shape variants. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SHAPE_VARIANT_COUNT = 4;

/** Seed salt selecting the boulder shape variant. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SEED_SALT_SHAPE = 313;

/** Top cap stroke opacity for rock columns. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_STROKE_ALPHA = 0.88;

/** Top cap stroke width in pixels. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_STROKE_WIDTH_PX = 1.1;

/** Side face fill alpha for rock columns. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SIDE_FILL_ALPHA = 1;

/** Top face fill alpha for rock columns. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_TOP_FILL_ALPHA = 1;

/**
 * Fraction of the chunk height that the rounded dome peak rises above the top
 * diamond center, giving boulders a domed (not flat-topped) silhouette.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_PEAK_RAISE_SCALE = 0.55;

/** Peak horizontal offset as a fraction of the chunk half-width (asymmetry). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_PEAK_OFFSET_SCALE = 0.16;

/** Per-vertex silhouette jitter as a fraction of the chunk half-extent. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_VERTEX_JITTER_SCALE = 0.1;

/** Brightness boost applied to the lit top facet of a boulder. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_TOP_FACET_BRIGHTNESS = 0.13;

/** Brightness boost applied to the small specular crown near the peak. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_CROWN_FACET_BRIGHTNESS = 0.22;

/** Darkening applied to the shaded base facet of a boulder. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_BASE_FACET_BRIGHTNESS =
  -0.2;

/** Cartoon silhouette outline stroke width in pixels. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_OUTLINE_WIDTH_PX = 1.5;

/** Cartoon silhouette outline stroke alpha. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_OUTLINE_ALPHA = 0.85;

/** Internal crack seam stroke width in pixels. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_CRACK_WIDTH_PX = 1;

/** Internal crack seam stroke alpha (subtle chiseled texture). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_CRACK_ALPHA = 0.24;

/** Default build budget for new rock columns per sync call. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_DEFAULT_BUILD_BUDGET = 12;

/**
 * Spacing cell width and height for extruded column rocks (one boulder per cell).
 *
 * A 6x6 grid fits the maximum footprint without overlapping neighboring anchors.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_CELL_TILES = 6;

/** Anchor column within each column-rock spacing cell (0-based). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_ANCHOR_TILE_X = 0;

/** Anchor row within each column-rock spacing cell (0-based). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SPACING_ANCHOR_TILE_Y = 0;

/**
 * Grid Chebyshev radius around a column rock where floor grass must not draw.
 * Keeps neighboring tile diamonds from bleeding through the boulder footprint.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_FLOOR_OCCLUSION_TILE_RADIUS =
  1 as const;

/** Cardinal and diagonal offsets for {@link DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_FLOOR_OCCLUSION_TILE_RADIUS}. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_ONE_BLOCK_NEIGHBOR_OFFSETS: readonly Readonly<{
  readonly tileOffsetX: number;
  readonly tileOffsetY: number;
}>[] = [
  { tileOffsetX: -1, tileOffsetY: -1 },
  { tileOffsetX: 0, tileOffsetY: -1 },
  { tileOffsetX: 1, tileOffsetY: -1 },
  { tileOffsetX: -1, tileOffsetY: 0 },
  { tileOffsetX: 1, tileOffsetY: 0 },
  { tileOffsetX: -1, tileOffsetY: 1 },
  { tileOffsetX: 0, tileOffsetY: 1 },
  { tileOffsetX: 1, tileOffsetY: 1 },
];

/**
 * Extra depth bias applied above a column rock when the avatar stands on its cap.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_AVATAR_STANDING_DEPTH_BIAS = 1;

/**
 * Entity-layer depth bias so boulders sort above avatar shadows and floor bleed.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_ENTITY_DEPTH_BIAS = 5;

/**
 * How far forward (0 = rear anchor, 1 = front footprint corner) the entity
 * depth sort key sits along the mega-boulder footprint. Tuned between the rear
 * anchor and front corner so avatars behind the rock are hidden while avatars
 * clearly in front still render on top.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_ENTITY_SORT_FORWARD_FRACTION = 0.5;

/** Screen-space lift applied to every column rock anchor (negative is up). */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SCREEN_OFFSET_Y_PX = -5;

/** Default boulder chunk half-width scale used for collision sizing. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_BASE_CHUNK_HALF_WIDTH_SCALE = 1;

/** Default boulder chunk half-height scale used for collision sizing. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_BASE_CHUNK_HALF_HEIGHT_SCALE = 1;

/** Padding added around the visual boulder radius for circular collision. */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_RADIUS_PADDING_GRID = 0.06;

/**
 * Extra half-extent scale added to the column-rock base diamond collider.
 *
 * Kept at zero so the debug outline and gameplay footprint match the drawn
 * boulder base; the player footprint radius already provides contact margin.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_BASE_DIAMOND_COLLISION_PADDING_SCALE = 0;

/**
 * Tile Chebyshev radius scanned around the avatar for mega-boulder diamond checks.
 *
 * Must cover the widest footprint plus one tile of player reach so movement
 * clamping tests the player position against the diamond, not footprint tile
 * centers one cell inside the rock.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_SEARCH_TILE_RADIUS =
  Math.ceil(
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MAX_FOOTPRINT_TILE_SPAN / 2,
  ) + 1;

/**
 * Vertical half-extent multiplier for column-rock collision.
 *
 * Kept at 1 so the collision diamond matches the renderer's full base facet
 * diamond (the rock's ground contact). Halving it shifted the collider to the
 * south half of the base, blocking empty footprint tiles south of the boulder.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_BASE_DIAMOND_COLLISION_HEIGHT_SCALE = 1;

/**
 * Screen-south center shift for the collision diamond, in height-scale fractions.
 *
 * Kept at 0 so the collider stays centered on the footprint center exactly where
 * the renderer grounds the boulder base facet.
 */
export const DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_BASE_DIAMOND_COLLISION_CENTER_SOUTH_OFFSET_HEIGHT_FRACTION = 0;

/** One scaled chunk within a multi-part boulder shape. */
export interface DefiningWorldPlazaTerrainRockChunkSpec {
  /** Screen-space offset from the tile ground center X. */
  readonly offsetScreenX: number;
  /** Screen-space offset from the tile ground center Y. */
  readonly offsetScreenY: number;
  /** Horizontal diamond half-extent scale relative to a full tile. */
  readonly halfWidthScale: number;
  /** Vertical diamond half-extent scale relative to a full tile. */
  readonly halfHeightScale: number;
  /** Absolute bottom world layer (inclusive). */
  readonly bottomWorldLayer: number;
  /** Absolute top world layer (inclusive). */
  readonly topWorldLayer: number;
}

/**
 * Returns the legacy minimum absolute world layer cap for a stone size tier.
 *
 * @param sizeTierIndex - Stone size tier index from the decoration resolver.
 */
export function resolvingWorldPlazaTerrainRockSurfaceWorldLayerFromSizeTierIndex(
  sizeTierIndex: number,
): number | null {
  if (
    sizeTierIndex >= DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX
  ) {
    return DEFINING_WORLD_PLAZA_TERRAIN_ROCK_LARGE_SURFACE_WORLD_LAYER;
  }

  if (
    sizeTierIndex >= DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX
  ) {
    return DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MEDIUM_SURFACE_WORLD_LAYER;
  }

  return null;
}

/**
 * Maps a seeded height unit to an absolute world layer for column rocks.
 *
 * Medium tiers roll 4 through 8 layers; large tiers roll 8 through 16 layers.
 *
 * @param sizeTierIndex - Stone size tier index from the decoration resolver.
 * @param heightUnit - Seeded value in [0, 1).
 */
export function resolvingWorldPlazaTerrainRockColumnSurfaceWorldLayerFromSeeds(
  sizeTierIndex: number,
  heightUnit: number,
): number | null {
  if (
    sizeTierIndex >= DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX
  ) {
    const layerSpan =
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MAX_SURFACE_WORLD_LAYER -
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_LARGE_TIER_MIN_SURFACE_WORLD_LAYER +
      1;

    return clampingWorldBuildingWorldLayer(
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_LARGE_TIER_MIN_SURFACE_WORLD_LAYER +
        Math.floor(heightUnit * layerSpan),
    );
  }

  if (
    sizeTierIndex >= DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX
  ) {
    return clampingWorldBuildingWorldLayer(
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MEDIUM_SURFACE_WORLD_LAYER +
        Math.floor(
          heightUnit *
            DEFINING_WORLD_PLAZA_TERRAIN_ROCK_MEDIUM_TIER_SURFACE_LAYER_SPAN,
        ),
    );
  }

  return null;
}

/**
 * Maps a seeded footprint unit to a tile span in [min, max].
 *
 * @param footprintUnit - Seeded value in [0, 1).
 */
export function resolvingWorldPlazaTerrainRockColumnFootprintTileSpanFromSeed(
  footprintUnit: number,
): number {
  const spanRange =
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MAX_FOOTPRINT_TILE_SPAN -
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_FOOTPRINT_TILE_SPAN;

  return (
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_FOOTPRINT_TILE_SPAN +
    Math.floor(footprintUnit * (spanRange + 1))
  );
}

/**
 * Returns true when a stone decoration should render as an extruded column rock.
 *
 * @param sizeTierIndex - Stone size tier index from the decoration resolver.
 */
export function checkingWorldPlazaStoneDecorationUsesColumnRockRendering(
  sizeTierIndex: number,
): boolean {
  return (
    sizeTierIndex >=
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_SIZE_TIER_INDEX
  );
}

/**
 * Shifts a rock chunk so its base rests on the tile terrain surface.
 *
 * Preserves chunk height in world layers so boulders on hills stay the same
 * size relative to flat ground instead of burying inside the terrain column.
 *
 * @param chunkSpec - Absolute-layer chunk placement from a shape variant.
 * @param terrainSurfaceLayer - Walkable terrain surface layer at the tile.
 */
export function aligningWorldPlazaTerrainRockChunkSpecToSurfaceLayer(
  chunkSpec: DefiningWorldPlazaTerrainRockChunkSpec,
  terrainSurfaceLayer: number,
): DefiningWorldPlazaTerrainRockChunkSpec {
  const rockHeightLayers = chunkSpec.topWorldLayer - chunkSpec.bottomWorldLayer;
  const alignedBottomWorldLayer = Math.max(
    chunkSpec.bottomWorldLayer,
    terrainSurfaceLayer,
  );

  return {
    ...chunkSpec,
    bottomWorldLayer: alignedBottomWorldLayer,
    topWorldLayer: clampingWorldBuildingWorldLayer(
      alignedBottomWorldLayer + rockHeightLayers,
    ),
  };
}

/**
 * Returns a footprint multiplier so taller boulders are proportionally wider.
 *
 * The boulder height already scales with its surface layer via the chunk layer
 * span; this scales the horizontal footprint to match so size tracks layer.
 *
 * @param surfaceWorldLayer - Absolute top world layer of the boulder.
 */
export function resolvingWorldPlazaTerrainRockColumnFootprintScaleFromSurfaceLayer(
  surfaceWorldLayer: number,
): number {
  const layersAboveReference =
    surfaceWorldLayer -
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_FOOTPRINT_REFERENCE_SURFACE_WORLD_LAYER;

  return Math.min(
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_FOOTPRINT_MAX_HEIGHT_SCALE,
    Math.max(
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_FOOTPRINT_MIN_SCALE,
      1 +
        layersAboveReference *
          DEFINING_WORLD_PLAZA_TERRAIN_ROCK_FOOTPRINT_SCALE_PER_SURFACE_LAYER,
    ),
  );
}

/**
 * Returns visual scale multipliers from a mega-boulder footprint in tiles.
 *
 * @param footprintTileWidth - Footprint width in tiles.
 * @param footprintTileHeight - Footprint height in tiles.
 */
export function resolvingWorldPlazaTerrainRockColumnFootprintVisualScaleFromTileSpan(
  footprintTileWidth: number,
  footprintTileHeight: number,
): { readonly widthScale: number; readonly heightScale: number } {
  return {
    widthScale:
      footprintTileWidth *
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_FOOTPRINT_VISUAL_WIDTH_SCALE_PER_TILE,
    heightScale:
      footprintTileHeight *
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_FOOTPRINT_VISUAL_HEIGHT_SCALE_PER_TILE,
  };
}

/**
 * Lists chunk specs for one boulder shape variant, sized to its surface layer.
 *
 * @param shapeVariantIndex - Variant index in [0, shapeVariantCount).
 * @param topWorldLayer - Absolute top world layer.
 * @param footprintTileWidth - Footprint width in tiles (defaults to 1).
 * @param footprintTileHeight - Footprint height in tiles (defaults to 1).
 */
export function listingWorldPlazaTerrainRockChunkSpecsForShapeVariant(
  shapeVariantIndex: number,
  topWorldLayer: number,
  footprintTileWidth: number = DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_FOOTPRINT_TILE_SPAN,
  footprintTileHeight: number = DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_FOOTPRINT_TILE_SPAN,
): readonly DefiningWorldPlazaTerrainRockChunkSpec[] {
  const heightFootprintScale =
    resolvingWorldPlazaTerrainRockColumnFootprintScaleFromSurfaceLayer(
      topWorldLayer,
    );
  const tileFootprintScale =
    resolvingWorldPlazaTerrainRockColumnFootprintVisualScaleFromTileSpan(
      footprintTileWidth,
      footprintTileHeight,
    );

  return listingWorldPlazaTerrainRockBaseChunkSpecsForShapeVariant(
    shapeVariantIndex,
    topWorldLayer,
  ).map((chunkSpec) => ({
    ...chunkSpec,
    halfWidthScale:
      chunkSpec.halfWidthScale *
      heightFootprintScale *
      tileFootprintScale.widthScale,
    halfHeightScale:
      chunkSpec.halfHeightScale *
      heightFootprintScale *
      tileFootprintScale.heightScale,
  }));
}

/**
 * Lists base (unsized) chunk specs for one boulder shape variant.
 *
 * Each variant is exactly one centered chunk so a tile never reads as two rocks.
 *
 * @param shapeVariantIndex - Variant index in [0, shapeVariantCount).
 * @param topWorldLayer - Absolute top world layer (4 or 5).
 */
function listingWorldPlazaTerrainRockBaseChunkSpecsForShapeVariant(
  shapeVariantIndex: number,
  topWorldLayer: number,
): readonly DefiningWorldPlazaTerrainRockChunkSpec[] {
  const normalizedVariant =
    ((shapeVariantIndex %
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SHAPE_VARIANT_COUNT) +
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SHAPE_VARIANT_COUNT) %
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SHAPE_VARIANT_COUNT;

  switch (normalizedVariant) {
    case 1:
      return [
        {
          offsetScreenX: 0,
          offsetScreenY: 0,
          halfWidthScale: 0.58,
          halfHeightScale: 0.58,
          bottomWorldLayer: 1,
          topWorldLayer,
        },
      ];
    case 2:
      return [
        {
          offsetScreenX: 0,
          offsetScreenY: 0,
          halfWidthScale: 1.05,
          halfHeightScale: 0.88,
          bottomWorldLayer: 1,
          topWorldLayer,
        },
      ];
    case 3:
      return [
        {
          offsetScreenX: 0,
          offsetScreenY: 0,
          halfWidthScale: 0.92,
          halfHeightScale: 0.96,
          bottomWorldLayer: 1,
          topWorldLayer,
        },
      ];
    default:
      return [
        {
          offsetScreenX: 0,
          offsetScreenY: 0,
          halfWidthScale: 1,
          halfHeightScale: 1,
          bottomWorldLayer: 1,
          topWorldLayer,
        },
      ];
  }
}
