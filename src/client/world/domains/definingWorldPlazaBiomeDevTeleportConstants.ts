import {
  DEFINING_WORLD_PLAZA_BIOME_CATALOG,
  scalingWorldPlazaBiomeWorldFeatureSpanTiles,
} from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';

/**
 * Dev-panel biome teleport search + button catalog.
 *
 * @module components/world/domains/definingWorldPlazaBiomeDevTeleportConstants
 */

/** Max Chebyshev radius scanned from the search origin. */
export const DEFINING_WORLD_PLAZA_BIOME_DEV_TELEPORT_SEARCH_RADIUS_TILES = 2800;

/** Step size while scanning rings for a matching biome tile. */
export const DEFINING_WORLD_PLAZA_BIOME_DEV_TELEPORT_SEARCH_STEP_TILES = 16;

/**
 * Extra Chebyshev band past the Firelands spawn clearing.
 *
 * Must stay outside {@link DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_GRID}
 * or the Firelands teleport finder never sees a valid tile.
 */
export const DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_BAND_TILES =
  scalingWorldPlazaBiomeWorldFeatureSpanTiles(700);

/** Max Chebyshev radius for Firelands volcano/centrality teleport search. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_RADIUS_TILES =
  DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_GRID +
  DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_SEARCH_BAND_TILES;

/** Padding beyond the spawn clearing before Firelands teleport candidates count. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_MIN_RADIUS_PADDING_TILES = 16;

/** Step while scanning rings for a high-centrality Firelands fallback. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_CENTRALITY_SEARCH_STEP_TILES = 8;

/** Tile offsets tried around a volcano anchor before falling back. */
export const DEFINING_WORLD_PLAZA_FIRELANDS_DEV_TELEPORT_VOLCANO_OFFSETS: readonly {
  readonly tileX: number;
  readonly tileY: number;
}[] = [
  { tileX: 5, tileY: 0 },
  { tileX: -5, tileY: 0 },
  { tileX: 0, tileY: 5 },
  { tileX: 0, tileY: -5 },
  { tileX: 4, tileY: 4 },
  { tileX: -4, tileY: 4 },
];

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
