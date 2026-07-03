/**
 * Tuning constants for per-tree procedural variation (shape and color noise).
 *
 * Centralizing the jitter ranges keeps the look adjustable without touching the
 * drawing code, and keeps the silhouettes inside the depth-sort and occlusion
 * footprints defined in {@link definingWorldPlazaTreeConstants}.
 *
 * @module components/world/domains/definingWorldPlazaTreeVariationConstants
 */

/** Maximum +/- whole-canopy brightness shift applied to foliage colors. */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_BRIGHTNESS_JITTER = 0.1;

/** Maximum +/- per-channel shift applied to foliage colors. */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_CHANNEL_JITTER = 0.06;

/** Maximum +/- brightness shift applied to trunk colors. */
export const DEFINING_WORLD_PLAZA_TREE_TRUNK_BRIGHTNESS_JITTER = 0.12;

/** Maximum +/- per-channel shift applied to trunk colors. */
export const DEFINING_WORLD_PLAZA_TREE_TRUNK_CHANNEL_JITTER = 0.04;

/** Maximum +/- per-tree trunk thickness variation. */
export const DEFINING_WORLD_PLAZA_TREE_TRUNK_WIDTH_JITTER = 0.22;

/** Trunk top width as a fraction of its base width (gives a tapered look). */
export const DEFINING_WORLD_PLAZA_TREE_TRUNK_TAPER_TOP_FRACTION = 0.78;

/** Brightness multiplier for the shadowed (left) trunk face. */
export const DEFINING_WORLD_PLAZA_TREE_TRUNK_SHADOW_DARKEN = 0.68;

/** Brightness multiplier for the lit (right) trunk highlight. */
export const DEFINING_WORLD_PLAZA_TREE_TRUNK_HIGHLIGHT_LIGHTEN = 1.32;

/** Right edge of the shadowed trunk band (fraction of width, runs from 0). */
export const DEFINING_WORLD_PLAZA_TREE_TRUNK_SHADOW_BAND_START = 0.4;

/** Left edge of the lit trunk highlight band (fraction of width). */
export const DEFINING_WORLD_PLAZA_TREE_TRUNK_HIGHLIGHT_BAND_START = 0.72;

/** Right edge of the lit trunk highlight band (fraction of width). */
export const DEFINING_WORLD_PLAZA_TREE_TRUNK_HIGHLIGHT_BAND_END = 0.92;

/** Downward shift of the shade pass as a fraction of the crown radius. */
export const DEFINING_WORLD_PLAZA_TREE_CANOPY_SHADE_DROP_FRACTION = 0.22;

/** Fewest satellite lobes on a broadleaf (oak / blossom) crown. */
export const DEFINING_WORLD_PLAZA_TREE_BROADLEAF_LOBE_MIN = 5;

/** Most satellite lobes on a broadleaf crown. */
export const DEFINING_WORLD_PLAZA_TREE_BROADLEAF_LOBE_MAX = 8;

/** Broadleaf satellite horizontal reach (fraction of crown radius). */
export const DEFINING_WORLD_PLAZA_TREE_BROADLEAF_HORIZONTAL_SPREAD = 0.62;

/** Broadleaf satellite upward reach (fraction of crown radius). */
export const DEFINING_WORLD_PLAZA_TREE_BROADLEAF_UPWARD_SPREAD = 0.6;

/** Broadleaf satellite downward reach (fraction of crown radius). */
export const DEFINING_WORLD_PLAZA_TREE_BROADLEAF_DOWNWARD_SPREAD = 0.2;

/** Broadleaf lobe minimum radius (fraction of crown radius). */
export const DEFINING_WORLD_PLAZA_TREE_BROADLEAF_LOBE_MIN_RADIUS_FRACTION = 0.55;

/** Broadleaf lobe maximum radius (fraction of crown radius). */
export const DEFINING_WORLD_PLAZA_TREE_BROADLEAF_LOBE_MAX_RADIUS_FRACTION = 0.85;

/** Fewest highlight accent lobes painted on a broadleaf crown. */
export const DEFINING_WORLD_PLAZA_TREE_BROADLEAF_ACCENT_LOBE_MIN = 1;

/** Most highlight accent lobes painted on a broadleaf crown. */
export const DEFINING_WORLD_PLAZA_TREE_BROADLEAF_ACCENT_LOBE_MAX = 3;

/** Fewest blossom specks scattered over a blossom crown. */
export const DEFINING_WORLD_PLAZA_TREE_BLOSSOM_SPECK_MIN = 4;

/** Most blossom specks scattered over a blossom crown. */
export const DEFINING_WORLD_PLAZA_TREE_BLOSSOM_SPECK_MAX = 8;

/** Fewest hanging strands on a willow crown. */
export const DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_MIN = 3;

/** Most hanging strands on a willow crown. */
export const DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_MAX = 6;

/** Maximum +/- horizontal jitter of a willow strand (fraction of crown half-width). */
export const DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_OFFSET_JITTER = 0.16;

/** Minimum willow strand length multiplier. */
export const DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_LENGTH_MIN = 0.7;

/** Maximum willow strand length multiplier. */
export const DEFINING_WORLD_PLAZA_TREE_WILLOW_STRAND_LENGTH_MAX = 1.35;

/** Maximum +/- ellipse radius jitter for willow / acacia crowns. */
export const DEFINING_WORLD_PLAZA_TREE_ELLIPSE_RADIUS_JITTER = 0.12;

/** Maximum +/- horizontal sway of the acacia highlight cluster (fraction of half-width). */
export const DEFINING_WORLD_PLAZA_TREE_ACACIA_HIGHLIGHT_SWAY = 0.3;

/** Fewest tiers on a spruce crown. */
export const DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_MIN = 3;

/** Most tiers on a spruce crown. */
export const DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_MAX = 5;

/** Maximum +/- per-tier half-width jitter on a spruce crown. */
export const DEFINING_WORLD_PLAZA_TREE_SPRUCE_TIER_WIDTH_JITTER = 0.14;

/** Maximum +/- snow-cap size jitter on a spruce tier. */
export const DEFINING_WORLD_PLAZA_TREE_SPRUCE_SNOW_JITTER = 0.25;

/** Fewest satellite lobes on a birch crown. */
export const DEFINING_WORLD_PLAZA_TREE_BIRCH_LOBE_MIN = 4;

/** Most satellite lobes on a birch crown. */
export const DEFINING_WORLD_PLAZA_TREE_BIRCH_LOBE_MAX = 6;

/** Birch satellite horizontal reach (fraction of crown radius). */
export const DEFINING_WORLD_PLAZA_TREE_BIRCH_HORIZONTAL_SPREAD = 0.48;

/** Birch satellite upward reach (fraction of crown radius). */
export const DEFINING_WORLD_PLAZA_TREE_BIRCH_UPWARD_SPREAD = 0.72;

/** Birch satellite downward reach (fraction of crown radius). */
export const DEFINING_WORLD_PLAZA_TREE_BIRCH_DOWNWARD_SPREAD = 0.16;

/** Birch lobe minimum radius (fraction of crown radius). */
export const DEFINING_WORLD_PLAZA_TREE_BIRCH_LOBE_MIN_RADIUS_FRACTION = 0.5;

/** Birch lobe maximum radius (fraction of crown radius). */
export const DEFINING_WORLD_PLAZA_TREE_BIRCH_LOBE_MAX_RADIUS_FRACTION = 0.78;

/** Fewest tiers on a pine crown. */
export const DEFINING_WORLD_PLAZA_TREE_PINE_TIER_MIN = 4;

/** Most tiers on a pine crown. */
export const DEFINING_WORLD_PLAZA_TREE_PINE_TIER_MAX = 6;

/** Maximum +/- per-tier half-width jitter on a pine crown. */
export const DEFINING_WORLD_PLAZA_TREE_PINE_TIER_WIDTH_JITTER = 0.12;

/** Fewest fronds on a palm crown. */
export const DEFINING_WORLD_PLAZA_TREE_PALM_FROND_MIN = 6;

/** Most fronds on a palm crown. */
export const DEFINING_WORLD_PLAZA_TREE_PALM_FROND_MAX = 9;

/** Minimum palm frond length multiplier. */
export const DEFINING_WORLD_PLAZA_TREE_PALM_FROND_LENGTH_MIN = 0.82;

/** Maximum palm frond length multiplier. */
export const DEFINING_WORLD_PLAZA_TREE_PALM_FROND_LENGTH_MAX = 1.12;

/** Fewest main branches on a deadwood crown. */
export const DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_MIN = 4;

/** Most main branches on a deadwood crown. */
export const DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_MAX = 7;

/** Minimum deadwood branch length multiplier. */
export const DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_LENGTH_MIN = 0.55;

/** Maximum deadwood branch length multiplier. */
export const DEFINING_WORLD_PLAZA_TREE_DEADWOOD_BRANCH_LENGTH_MAX = 1.05;

/** Fewest arms on a cactus. */
export const DEFINING_WORLD_PLAZA_TREE_CACTUS_ARM_MIN = 0;

/** Most arms on a cactus. */
export const DEFINING_WORLD_PLAZA_TREE_CACTUS_ARM_MAX = 2;
