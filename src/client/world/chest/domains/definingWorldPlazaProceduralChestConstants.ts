/**
 * Declarative tuning for procedural locked world chests.
 *
 * @module components/world/chest/domains/definingWorldPlazaProceduralChestConstants
 */

import type { DefiningWorldPlazaChestLootPoolId } from '@/components/world/chest/domains/definingWorldPlazaChestLootPoolRegistry';

/** Sparse placement: roughly one candidate tile per this many land tiles. */
export const DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_TILE_MODULUS = 220;

/** Seed salt for procedural chest placement gate. */
export const DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_PLACEMENT_SEED_SALT = 881;

/** Seed salt for key-source assignment per chest tile. */
export const DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_KEY_SOURCE_SEED_SALT = 882;

/** Seed salt for chest facing roll. */
export const DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_FACING_SEED_SALT = 883;

/** Seed salt for chest variant roll. */
export const DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_VARIANT_SEED_SALT = 884;

/** Loot pool granted when a locked chest is unlocked/opened. */
export const DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_LOOT_POOL_ID: DefiningWorldPlazaChestLootPoolId =
  'starter-forage';

/**
 * Chance [0, 1] to drop a universal chest key from an active source
 * (wildlife kill, shrub pick, long-grass search).
 */
export const DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_KEY_DROP_CHANCE = 0.03;

/** Tile radius around the player used to materialize procedural chest instances. */
export const DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_SYNC_RADIUS_TILES = 48;
