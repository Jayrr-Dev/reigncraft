import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Jungle (tropical rainforest) climate band tuning.
 *
 * The jungle carves the hot end off the high-humidity band that would
 * otherwise resolve to swamp, keeping it a rare-tier biome.
 *
 * @module components/world/domains/definingWorldPlazaJungleBiomeConstants
 */

/** Stable biome kind id for the jungle biome. */
export const DEFINING_WORLD_PLAZA_JUNGLE_BIOME_KIND =
  'jungle' as const satisfies DefiningWorldPlazaBiomeKind;

/** Minimum temperature for the jungle climate band. */
export const DEFINING_WORLD_PLAZA_JUNGLE_TEMPERATURE_MIN = 0.66;

/** Minimum humidity for the jungle climate band. */
export const DEFINING_WORLD_PLAZA_JUNGLE_HUMIDITY_MIN = 0.76;
