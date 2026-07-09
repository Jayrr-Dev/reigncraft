import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Dev-panel biome teleport search + button catalog.
 *
 * @module components/world/domains/definingWorldPlazaBiomeDevTeleportConstants
 */

/** Max Chebyshev radius scanned from the search origin. */
export const DEFINING_WORLD_PLAZA_BIOME_DEV_TELEPORT_SEARCH_RADIUS_TILES = 2800;

/** Step size while scanning rings for a matching biome tile. */
export const DEFINING_WORLD_PLAZA_BIOME_DEV_TELEPORT_SEARCH_STEP_TILES = 16;

/** One biome teleport button in the world-state dev panel. */
export type DefiningWorldPlazaBiomeDevTeleportOption = {
  kind: DefiningWorldPlazaBiomeKind;
  label: string;
};

/**
 * Ordered biome teleport targets for the dev panel.
 *
 * Firelands keeps its volcano-aware finder; other kinds use nearest walkable tile.
 */
export const DEFINING_WORLD_PLAZA_BIOME_DEV_TELEPORT_OPTIONS: readonly DefiningWorldPlazaBiomeDevTeleportOption[] =
  (
    [
      'plains',
      'forest',
      'flower_forest',
      'jungle',
      'desert',
      'snowy_plains',
      'swamp',
      'savanna',
      'badlands',
      'beach',
      'ocean',
      'rocky',
      'firelands',
    ] as const satisfies readonly DefiningWorldPlazaBiomeKind[]
  ).map((kind) => ({
    kind,
    label: `Teleport to ${DEFINING_WORLD_PLAZA_BIOME_CATALOG[kind].displayName}`,
  }));
