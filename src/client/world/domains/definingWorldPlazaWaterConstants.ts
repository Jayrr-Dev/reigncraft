/**
 * Procedural lake, river, and stream constants for the plaza world.
 *
 * @module components/world/domains/definingWorldPlazaWaterConstants
 */

/** Maximum patch-noise threshold; values above this never spawn surface water. */
export const DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_MAX = 0.95;

/**
 * Extra patch-noise required per unit of biome {@link DefiningWorldPlazaBiomeDefinition.temperature}.
 *
 * Hot biomes need wetter noise peaks before any surface water appears.
 */
export const DEFINING_WORLD_PLAZA_WATER_TEMPERATURE_PATCH_NOISE_PENALTY = 0.24;
/** Deep still lake tone used for minimap, floor bed, and depth lerping. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_FILL_COLOR = 0x0e3d5c;

/** Translucent lake surface tint; darker and more opaque than flowing water. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SURFACE_LAYER_COLOR = 0x0f3450;

/** Lake surface opacity; higher blocks grass bleed for a deep, still read. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SURFACE_LAYER_ALPHA = 0.78;

/** Shore-distance in blocks treated as shallow, lighter lake water. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHALLOW_DEPTH_MAX_BLOCKS = 2;

/** Shallow lake surface opacity at the deep end of the shallow band. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHALLOW_SURFACE_LAYER_ALPHA = 0.66;

/** Shallow lake surface opacity at the shore edge; lower reads lighter. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHALLOW_SURFACE_LAYER_ALPHA_MIN = 0.6;

/** Soft white highlight mixed into the shore-adjacent lake surface tint. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_EDGE_SURFACE_HIGHLIGHT_COLOR = 0xf8fcff;

/** How much shore-edge highlight tints the first shallow band surface. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_EDGE_SURFACE_HIGHLIGHT_MIX = 0.22;

/** Climate temperature at or below this freezes surface water on a tile. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_CLIMATE_TEMPERATURE_MAX = 0.3;

/** Frozen water bed tone used for minimap and floor diamond base. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_FILL_COLOR = 0x4a8fb8;

/** Darker ice slab tone mixed into frozen bed mottling. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_FILL_DARK_COLOR = 0x3a7599;

/** Lighter ice slab tone mixed into frozen bed mottling. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_FILL_LIGHT_COLOR = 0x6eb0d4;

/** Frequency for frozen bed slab mottling noise. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_BED_MOTTLE_FREQUENCY = 1 / 6;

/** Seed for frozen bed slab mottling noise. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_BED_MOTTLE_SEED = 9341;

/** Peak blend toward dark or light slab colors at mottle extremes. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_BED_MOTTLE_MAX_BLEND = 0.42;

/** Translucent frozen surface tint; saturated icy blue with no flow read. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_SURFACE_LAYER_COLOR = 0x5aaccc;

/** Brighter frozen surface tint for quantized per-tile slab highlights. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_SURFACE_LAYER_HIGHLIGHT_COLOR = 0x7ec4e4;

/** Frozen surface opacity; lets bed slab variation read through the ice. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_SURFACE_LAYER_ALPHA = 0.78;

/** Seeded unit above which a frozen tile draws crack lines. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_TILE_THRESHOLD = 0.38;

/** Hairline crack stroke color on frozen ice. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_LINE_COLOR = 0xf2faff;

/** Peak alpha for one frozen crack line stroke. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_LINE_ALPHA = 0.58;

/** Stroke width for frozen crack lines (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_LINE_WIDTH_PX = 0.85;

/** Max crack segments drawn on one frozen tile. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_LINE_COUNT_MAX = 2;

/** Half-length of one crack segment along its axis (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_CRACK_HALF_LENGTH_PX = 7;

/** Seeded unit above which a frozen tile draws a static surface glint dot. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_SHINE_TILE_THRESHOLD = 0.86;

/** Static glint dot color on frozen ice. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_SHINE_COLOR = 0xe8f8ff;

/** Alpha for one static frozen glint dot. */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_SHINE_ALPHA = 0.38;

/** Radius of one static frozen glint dot (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_FROZEN_SHINE_DOT_RADIUS_PX = 1.6;

/** Wide river tone used for minimap and depth lerping. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_FILL_COLOR = 0x2f84a8;

/** Thin stream tone used for minimap and depth lerping. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_FILL_COLOR = 0x52b0cf;

/** Pond bed tone; lighter and greener than a lake so ponds read shallower. */
export const DEFINING_WORLD_PLAZA_WATER_POND_FILL_COLOR = 0x357a78;

/** Translucent pond surface tint; less blue and less opaque than a lake. */
export const DEFINING_WORLD_PLAZA_WATER_POND_SURFACE_LAYER_COLOR = 0x4a8f8a;

/** Pond surface opacity; lower than a lake so the bed reads lighter. */
export const DEFINING_WORLD_PLAZA_WATER_POND_SURFACE_LAYER_ALPHA = 0.52;

/** Swamp pond bed tone; murky green-brown matching the swamp biome. */
export const DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_FILL_COLOR = 0x35472f;

/** Translucent swamp pond surface tint; murky olive over the bed. */
export const DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_SURFACE_LAYER_COLOR = 0x3c4a30;

/** Swamp pond surface opacity; high so the water reads thick and murky. */
export const DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_SURFACE_LAYER_ALPHA = 0.66;

/** Animated flow streak length for streams (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_LENGTH_PX = 9;

/** Animated flow streak stroke width (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_WIDTH_PX = 1.1;

/** Animated flow streak color. */
export const DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_COLOR = 0xdaf3fb;

/** Animated flow streak peak opacity; kept faint for a subtle drift. */
export const DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_ALPHA = 0.22;

/** Flow animation period for one stream streak travel cycle (milliseconds). */
export const DEFINING_WORLD_PLAZA_WATER_FLOW_PERIOD_MS = 2400;

/** Slower flow period for rivers; higher means calmer downstream motion. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_FLOW_PERIOD_MS = 1400;

/** Streaks animated per flowing tile; one keeps rivers and streams calm and cheap. */
export const DEFINING_WORLD_PLAZA_WATER_FLOW_STREAK_COUNT = 1;

/** Uniform translucent surface tint drawn as one merged fill over the bed. */
export const DEFINING_WORLD_PLAZA_WATER_SURFACE_LAYER_COLOR = 0x2b8cb3;

/** Surface tint opacity; lower lets more of the textured ground read through. */
export const DEFINING_WORLD_PLAZA_WATER_SURFACE_LAYER_ALPHA = 0.55;

/**
 * Z-index for the water surface overlay inside the floor layer.
 *
 * Floor chunks sort by (originX + originY), so the overlay needs a value larger
 * than any reachable chunk sum to stay above the textured ground.
 */
export const DEFINING_WORLD_PLAZA_WATER_SURFACE_LAYER_Z_INDEX = 1_000_000_000;

/** Z-index for the shimmer overlay; sits just above the water surface. */
export const DEFINING_WORLD_PLAZA_WATER_SHIMMER_LAYER_Z_INDEX =
  DEFINING_WORLD_PLAZA_WATER_SURFACE_LAYER_Z_INDEX + 1;

/** Sandy brown shore foam along river and stream land-facing edges. */
export const DEFINING_WORLD_PLAZA_WATER_SHORE_FOAM_COLOR = 0x8f7658;

/** Animated shimmer highlight on water tiles. */
export const DEFINING_WORLD_PLAZA_WATER_HIGHLIGHT_COLOR = 0xe8f8ff;

/** Alpha for river and stream shore foam lines. */
export const DEFINING_WORLD_PLAZA_WATER_SHORE_FOAM_ALPHA = 0.72;

/** Stroke width of river and stream shore foam lines (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_SHORE_FOAM_LINE_WIDTH_PX = 2.4;

/** Soft white foam along lake land-facing tile edges. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_FOAM_COLOR = 0xf5fafc;

/** Alpha for lake shore foam lines. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_FOAM_ALPHA = 0.64;

/** Stroke width of lake shore foam lines (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHORE_FOAM_LINE_WIDTH_PX = 2.8;

/** Shimmer ellipse horizontal radius (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_SHIMMER_RADIUS_X_PX = 9;

/** Shimmer ellipse vertical radius (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_SHIMMER_RADIUS_Y_PX = 3.2;

/** Shimmer highlight alpha peak. */
export const DEFINING_WORLD_PLAZA_WATER_SHIMMER_ALPHA_MAX = 0.22;

/** Shimmer animation period (milliseconds). */
export const DEFINING_WORLD_PLAZA_WATER_SHIMMER_PERIOD_MS = 2400;

/** Frames between shimmer overlay redraws. */
export const DEFINING_WORLD_PLAZA_WATER_SHIMMER_UPDATE_INTERVAL_FRAMES = 3;

/** Lake ripple stroke color; soft cyan ring on still water. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_COLOR = 0xbfe6f5;

/** Peak opacity for one expanding lake ripple ring (kept faint and natural). */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_ALPHA_MAX = 0.12;

/** Milliseconds for one lake ripple expand-and-fade cycle. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_PERIOD_MS = 7600;

/**
 * Seeded unit above which a lake tile may spawn ripples.
 *
 * High threshold keeps ripples sparse and scattered rather than tiled.
 */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_TILE_THRESHOLD = 0.93;

/** Horizontal radius of a lake ripple ring (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_RADIUS_X_PX = 5;

/** Vertical radius of a lake ripple ring (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_RADIUS_Y_PX = 2;

/** Stroke width for lake ripple rings (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_STROKE_WIDTH_PX = 0.8;

/** How far a ripple ring expands across its cycle (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_RIPPLE_EXPAND_PX = 7;

/** Lake shine highlight color. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_COLOR = 0xeafcff;

/** Minimum lake shine alpha at the trough of the pulse. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_ALPHA_MIN = 0.02;

/** Peak lake shine alpha (subtle glint). */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_ALPHA_MAX = 0.12;

/** Milliseconds for one lake shine pulse cycle. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_PERIOD_MS = 6400;

/**
 * Seeded unit above which a lake tile may spawn shine.
 *
 * High threshold scatters glints sparsely across open water.
 */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_TILE_THRESHOLD = 0.8;

/** Lake shine ellipse horizontal radius (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_RADIUS_X_PX = 7;

/** Lake shine ellipse vertical radius (pixels). */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_SHINE_RADIUS_Y_PX = 2;

/** @deprecated Use {@link DEFINING_WORLD_PLAZA_WATER_SHIMMER_RADIUS_Y_PX}. */
export const DEFINING_WORLD_PLAZA_WATER_HIGHLIGHT_DOT_RADIUS_PX = 2.2;

/** Seed for broad wet-region patches that can host lakes and rivers. */
export const DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_SEED = 7201;

/** Frequency for broad wet-region patches. */
export const DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_FREQUENCY = 1 / 46;

/** Octaves for wet-region patch noise. */
export const DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_OCTAVES = 4;

/**
 * Stream channel noise. Lower frequency than the original trickle field so
 * connected stream runs span dozens of tiles instead of breaking into 1-tile
 * puddles. A second branch field crosses the main channel for forks.
 */
export const DEFINING_WORLD_PLAZA_WATER_CHANNEL_NOISE_SEED = 9203;

/** Frequency for primary stream channels; lower means longer continuous runs. */
export const DEFINING_WORLD_PLAZA_WATER_CHANNEL_NOISE_FREQUENCY = 1 / 52;

/** Octaves for primary stream channel noise. */
export const DEFINING_WORLD_PLAZA_WATER_CHANNEL_NOISE_OCTAVES = 2;

/** Maximum distance from 0.5 in primary stream noise. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_CHANNEL_BAND_MAX = 0.024;

/**
 * Half-width of a stream ribbon in tiles, measured along the noise gradient.
 * Gradient normalization keeps streams thin trickles even where the noise field
 * is flat, so they never spread into pond- or lake-like blobs.
 */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_CHANNEL_HALF_WIDTH_TILES = 0.85;

/** Half-width of a branch stream ribbon in tiles (thinner fork). */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_BRANCH_CHANNEL_HALF_WIDTH_TILES = 0.7;

/** Half-width of a connector stream ribbon in tiles (links nearby runs). */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_CONNECTOR_CHANNEL_HALF_WIDTH_TILES = 0.7;

/** Hard cap on stream ribbon half-width in tiles; blocks any blob fan-out. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_CHANNEL_MAX_HALF_WIDTH_TILES = 1.6;

/**
 * Minimum connected water tiles a stream must belong to. A placed stream tile is
 * dropped when its connected run is shorter than this, so streams never appear
 * as a single isolated block or a tiny two-tile puddle.
 */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_MIN_RUN_LENGTH_TILES = 4;

/** Floor added to the sampled stream noise gradient before dividing. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_CHANNEL_GRADIENT_EPSILON = 0.0008;

/** Seed for the branch stream channel that crosses the primary path. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_BRANCH_CHANNEL_NOISE_SEED = 12883;

/** Frequency for branch stream channels; mid-scale forks off the main run. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_BRANCH_CHANNEL_NOISE_FREQUENCY =
  1 / 38;

/** Octaves for branch stream channel noise. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_BRANCH_CHANNEL_NOISE_OCTAVES = 2;

/** Maximum distance from 0.5 in branch stream noise. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_BRANCH_CHANNEL_BAND_MAX = 0.02;

/** Seed for low-frequency stream connectors that link nearby trickles. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_CONNECTOR_CHANNEL_NOISE_SEED = 18917;

/** Frequency for stream connector channels; very low links separate runs. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_CONNECTOR_CHANNEL_NOISE_FREQUENCY =
  1 / 128;

/** Octaves for stream connector channel noise. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_CONNECTOR_CHANNEL_NOISE_OCTAVES = 2;

/** Maximum distance from 0.5 in stream connector noise. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_CONNECTOR_CHANNEL_BAND_MAX = 0.034;

/**
 * Range a network bridge scans along a single axis for stream cores. A dry tile
 * only becomes water when it sits between two cores on the same line (a real
 * gap to span), so bridges link runs without filling 2D blobs.
 */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_NETWORK_BRIDGE_RADIUS_BLOCKS = 3;

/** Seed for the coarse mask that decides which regions host streams. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_REGION_MASK_NOISE_SEED = 11831;

/** Frequency for the stream region mask. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_REGION_MASK_NOISE_FREQUENCY =
  1 / 72;

/** Octaves for the stream region mask. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_REGION_MASK_NOISE_OCTAVES = 2;

/** Mask value required for a stream; lower than rivers so streams appear more often. */
export const DEFINING_WORLD_PLAZA_WATER_STREAM_REGION_MASK_MIN = 0.45;

/**
 * River channel noise. Very low frequency yields long, continuous channels
 * (hundreds of blocks). Branch noise crosses the main channel for tributaries.
 */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_NOISE_SEED = 4099;

/** Frequency for primary river channels; lower means longer main stems. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_NOISE_FREQUENCY = 1 / 220;

/** Octaves for primary river channel noise. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_NOISE_OCTAVES = 2;

/** Maximum distance from 0.5 in primary river noise at average width (~3 tiles). */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_BAND_MAX = 0.071;

/** Width noise multiplier at narrow river outliers (~1-2 tiles). */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_BAND_MIN_MULTIPLIER = 0.52;

/** Width noise multiplier at wide river outliers (~4-6 tiles). */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_BAND_MAX_MULTIPLIER = 1.48;

/**
 * Half-width of the primary river ribbon in tiles, measured along the noise
 * gradient. Gradient normalization keeps the channel this wide even where the
 * noise field is flat, so rivers stay ribbons instead of spreading into lake-
 * like blobs. Average river width is roughly twice this value.
 */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_HALF_WIDTH_TILES = 1.6;

/** Half-width of branch tributary ribbons in tiles (thinner than main stem). */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_HALF_WIDTH_TILES = 1.0;

/**
 * Hard cap on river ribbon half-width in tiles. Stops width outliers and any
 * low-gradient pockets from fanning a channel out into a blob.
 */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_MAX_HALF_WIDTH_TILES = 3;

/**
 * Floor added to the sampled noise gradient before dividing. Prevents divide-by-
 * zero and bounds the maximum ribbon width in nearly flat noise regions.
 */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_CHANNEL_GRADIENT_EPSILON = 0.0006;

/** Seed for low-frequency river width variation along each channel. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_WIDTH_NOISE_SEED = 17957;

/** Frequency for river width noise; lower yields gradual width swings. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_WIDTH_NOISE_FREQUENCY = 1 / 48;

/** Octaves for river width noise. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_WIDTH_NOISE_OCTAVES = 2;

/** Seed for branch river channels that fork off the primary path. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_NOISE_SEED = 16931;

/** Frequency for branch river channels; mid-scale tributaries. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_NOISE_FREQUENCY =
  1 / 95;

/** Octaves for branch river channel noise. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_NOISE_OCTAVES = 2;

/** Base branch channel band; tributaries read narrower than the main stem. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_BAND_MAX = 0.038;

/** Branch width multiplier at narrow tributary outliers. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_BAND_MIN_MULTIPLIER =
  0.55;

/** Branch width multiplier at wide tributary outliers. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_BRANCH_CHANNEL_BAND_MAX_MULTIPLIER =
  1.35;

/** Seed for the coarse mask that decides which regions host rivers. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_REGION_MASK_NOISE_SEED = 5077;

/** Frequency for the river region mask; low so valleys span large areas. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_REGION_MASK_NOISE_FREQUENCY =
  1 / 240;

/** Octaves for the river region mask. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_REGION_MASK_NOISE_OCTAVES = 3;

/** Mask value required for a river; lower fills broader river valleys. */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_REGION_MASK_MIN = 0.48;

/** Biome temperature above which rivers dry up (no rivers in hot deserts). */
export const DEFINING_WORLD_PLAZA_WATER_RIVER_MAX_BIOME_TEMPERATURE = 0.74;

/** Minimum patch noise before any surface water can appear in cool biomes. */
export const DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_MIN = 0.56;

/** Seed for broad lake-basin regions (large still bodies). */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_SEED = 8107;

/** Frequency for lake basins; lower values produce wider lakes. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_FREQUENCY = 1 / 96;

/** Octaves for lake-basin noise. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_OCTAVES = 3;

/** Basin noise required before a wet tile becomes part of a lake body. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_MIN = 0.58;

/**
 * Basin noise fringe below {@link DEFINING_WORLD_PLAZA_WATER_LAKE_BASIN_NOISE_MIN}.
 * Flowing water is gated inside this band so rivers do not cut through lakes.
 */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_BASIN_EXCLUSION_NOISE_MIN =
  0.535;

/** Chebyshev radius when searching for a lake body to gate flowing water. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_EXCLUSION_RADIUS_BLOCKS = 24;

/** Stride for lake cluster anchors used to pick a single inflow side. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_INFLOW_CLUSTER_STRIDE_BLOCKS = 48;

/** Salt for deterministic inflow-side selection per lake cluster. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_INFLOW_DIRECTION_SALT = 42157;

/** Shore distance where river and stream tints blend toward lake surface. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_TRANSITION_RADIUS_BLOCKS = 4;

/** Maximum surface tint mix toward lake at a river or stream mouth. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_FLOWING_WATER_TRANSITION_MAX_MIX = 0.72;

/** Maximum surface tint mix toward river at a lake inflow mouth tile. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_INFLOW_MOUTH_SURFACE_MAX_MIX = 0.38;

/**
 * Pond basin noise. Higher frequency than lakes makes small, scattered pools.
 */
export const DEFINING_WORLD_PLAZA_WATER_POND_BASIN_NOISE_SEED = 6701;

/** Frequency for pond basins; higher means smaller pools than lakes. */
export const DEFINING_WORLD_PLAZA_WATER_POND_BASIN_NOISE_FREQUENCY = 1 / 26;

/** Octaves for pond basin noise. */
export const DEFINING_WORLD_PLAZA_WATER_POND_BASIN_NOISE_OCTAVES = 3;

/** Basin noise required for a pond; high keeps ponds small and occasional. */
export const DEFINING_WORLD_PLAZA_WATER_POND_BASIN_NOISE_MIN = 0.66;

/**
 * Basin noise required for a swamp pond. Lower than a normal pond so swamp
 * pools grow bigger inside humid swamp regions.
 */
export const DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_BASIN_NOISE_MIN = 0.56;

/**
 * Chebyshev distance still water must stay inside a biome that allows the same
 * kind. Stops lakes from hugging swamp borders.
 */
export const DEFINING_WORLD_PLAZA_WATER_STILL_WATER_BIOME_BORDER_BUFFER_BLOCKS = 5;

/**
 * Larger Chebyshev buffer for swamp pools specifically. A swamp pond only spawns
 * when every tile within this radius is swamp, so murky pools sit deep inside
 * large swamps and can never appear at a fringe that borders a normal biome.
 */
export const DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_BIOME_BORDER_BUFFER_BLOCKS = 10;

/** Seed for coarse lake-only still water regions. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_REGION_MASK_NOISE_SEED = 13807;

/** Frequency for lake region mask; low frequency yields large lake zones. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_REGION_MASK_NOISE_FREQUENCY = 1 / 88;

/** Octaves for lake region mask noise. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_REGION_MASK_NOISE_OCTAVES = 3;

/** Minimum lake region mask before a lake may spawn. */
export const DEFINING_WORLD_PLAZA_WATER_LAKE_REGION_MASK_MIN = 0.54;

/** Seed for coarse pond-only still water regions. */
export const DEFINING_WORLD_PLAZA_WATER_POND_REGION_MASK_NOISE_SEED = 14891;

/** Frequency for pond region mask. */
export const DEFINING_WORLD_PLAZA_WATER_POND_REGION_MASK_NOISE_FREQUENCY = 1 / 64;

/** Octaves for pond region mask noise. */
export const DEFINING_WORLD_PLAZA_WATER_POND_REGION_MASK_NOISE_OCTAVES = 3;

/** Minimum pond region mask before a pond may spawn. */
export const DEFINING_WORLD_PLAZA_WATER_POND_REGION_MASK_MIN = 0.54;

/** Seed for coarse swamp-pond-only still water regions. */
export const DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_REGION_MASK_NOISE_SEED = 15973;

/** Frequency for swamp pond region mask. */
export const DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_REGION_MASK_NOISE_FREQUENCY =
  1 / 76;

/** Octaves for swamp pond region mask noise. */
export const DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_REGION_MASK_NOISE_OCTAVES = 3;

/** Minimum swamp pond region mask before a swamp pool may spawn. */
export const DEFINING_WORLD_PLAZA_WATER_SWAMP_POND_REGION_MASK_MIN = 0.52;

/** Spawn clearing radius around origin; keeps new players on dry land. */
export const DEFINING_WORLD_PLAZA_WATER_SPAWN_CLEARING_RADIUS_GRID = 5;

/** Squared spawn clearing radius (avoids sqrt in the hot path). */
export const DEFINING_WORLD_PLAZA_WATER_SPAWN_CLEARING_RADIUS_SQUARED =
  DEFINING_WORLD_PLAZA_WATER_SPAWN_CLEARING_RADIUS_GRID *
  DEFINING_WORLD_PLAZA_WATER_SPAWN_CLEARING_RADIUS_GRID;
