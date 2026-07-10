/**
 * Tuning for the wildlife texture warm-up that runs during world boot.
 *
 * Boot no longer preloads every registered species: decoding ~50 species
 * (6+ sheets each) in parallel exhausts memory on mobile browsers and the
 * tab is killed near the 66% mark. Boot only warms the species the player
 * can actually meet at spawn; everything else loads lazily the first time
 * an instance appears (see `renderingWildlifeLayer.tsx`).
 *
 * @module components/world/wildlife/domains/definingWildlifeBootTexturePreloadConstants
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Biomes whose spawn-table species get warmed during boot. Players spawn in
 * the plains clearing, so its roster covers the first minutes of play.
 */
export const DEFINING_WILDLIFE_BOOT_PRELOAD_BIOME_KINDS: readonly DefiningWorldPlazaBiomeKind[] =
  ['plains'];

/**
 * How many species load their sheets at once during boot. Mirrors the
 * Firelands texture concurrency cap: full parallel loads spike decode
 * memory and trip Devvit webview gateway timeouts.
 */
export const DEFINING_WILDLIFE_BOOT_PRELOAD_SPECIES_CONCURRENCY = 3;
