/**
 * Safe-terrain seeking: reusable bias toward nearby jumpable gaps
 * (rivers / tall cliffs) so jump-capable animals can put obstacles
 * between themselves and a threat.
 *
 * @module components/world/wildlife/domains/definingWildlifeSafeTerrainSeekingConstants
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Fleet jumpers that seek rivers and cliffs when fleeing.
 * Ostrich is fleet but grounded (`canJump: false`) and is excluded.
 */
export const DEFINING_WILDLIFE_SAFE_TERRAIN_SEEKING_SPECIES: ReadonlySet<DefiningWildlifeSpeciesId> =
  new Set(['deer', 'stag', 'antilope', 'oryx', 'zebra']);

/** How far (grid) to scan for a jumpable gap when seeking safe terrain. */
export const DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_SCAN_RADIUS_GRID = 8;

/** Number of bearings sampled around the animal when seeking a gap. */
export const DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_DIRECTION_COUNT = 16;

/** Forward sample step while scanning a bearing for a gap. */
export const DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_SCAN_STEP_GRID = 0.5;

/**
 * Minimum alignment (dot product) between away-from-threat and gap heading.
 * Gaps behind the threat are ignored so animals do not run toward the hunter.
 */
export const DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_THREAT_ALIGNMENT_MIN = 0.15;

/**
 * Blend weight for the gap heading into the preferred flee direction.
 * 0 = ignore gaps; 1 = fully replace the base heading.
 */
export const DEFINING_WILDLIFE_SAFE_TERRAIN_SEEK_DIRECTION_BLEND_WEIGHT = 0.55;
