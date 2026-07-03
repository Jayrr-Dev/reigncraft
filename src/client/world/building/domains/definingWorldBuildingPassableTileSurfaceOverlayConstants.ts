/**
 * Passable tile (0H) surface overlay metadata and storage constants.
 *
 * Surface overlays sit on the top face of an extruded block at the same world
 * layer without replacing the column underneath.
 *
 * @module components/world/building/domains/definingWorldBuildingPassableTileSurfaceOverlayConstants
 */

/** Metadata flag persisted on passable tiles that overlay an extruded top face. */
export const DEFINING_WORLD_BUILDING_PASSABLE_TILE_SURFACE_OVERLAY_METADATA_KEY =
  "passableTileSurfaceOverlay" as const;

/** Suffix appended to tile layer keys for surface overlay rows. */
export const DEFINING_WORLD_BUILDING_PASSABLE_TILE_SURFACE_OVERLAY_KEY_SUFFIX =
  "surface-overlay" as const;
