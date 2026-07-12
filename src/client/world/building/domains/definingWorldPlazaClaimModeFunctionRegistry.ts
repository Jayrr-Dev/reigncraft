/**
 * Shared claim-mode copy used by edit-mode popover panels.
 *
 * @module components/world/building/domains/definingWorldPlazaClaimModeFunctionRegistry
 */

/** Coords panel hint before the player starts map placement. */
export const LABELING_WORLD_PLAZA_CLAIM_MODE_COORDS_HOVER_HINT =
  'Click Save Coords, then pick a tile on the map' as const;

/** Coords panel hint while map placement is armed. */
export const LABELING_WORLD_PLAZA_CLAIM_MODE_COORDS_PLACEMENT_HINT =
  'Click a tile on the map to save its coordinates' as const;

/** Save Coords button while placement is armed. */
export const LABELING_WORLD_PLAZA_CLAIM_MODE_COORDS_CANCEL_PLACEMENT =
  'Cancel' as const;
