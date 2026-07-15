/**
 * Pure loot resolution for world chest props.
 *
 * @module components/world/chest/domains/resolvingWorldPlazaChestLootGrant
 */

import {
  DEFINING_WORLD_PLAZA_CHEST_LOOT_POOL_REGISTRY,
  type DefiningWorldPlazaChestLootPoolId,
} from '@/components/world/chest/domains/definingWorldPlazaChestLootPoolRegistry';
import type {
  DefiningWorldPlazaChestId,
  DefiningWorldPlazaChestLoot,
  DefiningWorldPlazaChestLootGrant,
  DefiningWorldPlazaChestLootPoolEntry,
} from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import { computingWorldPlazaDistanceFromOriginTiles } from '@/components/world/domains/computingWorldPlazaDistanceDangerBandFromOrigin';
import { creatingSeededRandomNumberGenerator } from '@/lib/probability/creatingSeededRandomNumberGenerator';

export type ResolvingWorldPlazaChestLootGrantContext = {
  readonly worldX: number;
  readonly worldY: number;
};

/** FNV-1a hash of chestId → uint32 seed for deterministic pool rolls. */
export function hashingWorldPlazaChestIdToSeed(
  chestId: DefiningWorldPlazaChestId
): number {
  let hash = 2166136261;

  for (let index = 0; index < chestId.length; index += 1) {
    hash ^= chestId.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function checkingWorldPlazaChestLootPoolId(
  poolId: string
): poolId is DefiningWorldPlazaChestLootPoolId {
  return Object.prototype.hasOwnProperty.call(
    DEFINING_WORLD_PLAZA_CHEST_LOOT_POOL_REGISTRY,
    poolId
  );
}

function resolvingWorldPlazaChestLootPoolEntries(
  poolId: string
): readonly DefiningWorldPlazaChestLootPoolEntry[] | null {
  if (!checkingWorldPlazaChestLootPoolId(poolId)) {
    return null;
  }

  return DEFINING_WORLD_PLAZA_CHEST_LOOT_POOL_REGISTRY[poolId];
}

function pickingWorldPlazaChestLootPoolEntry(
  entries: readonly DefiningWorldPlazaChestLootPoolEntry[],
  unitFloat: number
): DefiningWorldPlazaChestLootPoolEntry | null {
  if (entries.length === 0) {
    return null;
  }

  let totalWeight = 0;

  for (const entry of entries) {
    totalWeight += Math.max(0, entry.weight);
  }

  if (totalWeight <= 0) {
    return entries[entries.length - 1] ?? null;
  }

  let cursor = unitFloat * totalWeight;

  for (const entry of entries) {
    cursor -= Math.max(0, entry.weight);

    if (cursor < 0) {
      return entry;
    }
  }

  return entries[entries.length - 1] ?? null;
}

function filteringWorldPlazaChestLootPoolEntriesByDistance(
  entries: readonly DefiningWorldPlazaChestLootPoolEntry[],
  context: ResolvingWorldPlazaChestLootGrantContext | undefined
): readonly DefiningWorldPlazaChestLootPoolEntry[] {
  if (!context) {
    return entries.filter(
      (entry) => entry.minDistanceFromOriginTiles === undefined
    );
  }

  const distanceFromOrigin = computingWorldPlazaDistanceFromOriginTiles(
    context.worldX,
    context.worldY
  );

  return entries.filter((entry) => {
    const minDistance = entry.minDistanceFromOriginTiles;

    if (minDistance === undefined) {
      return true;
    }

    return distanceFromOrigin >= minDistance;
  });
}

/**
 * Resolves chest loot into concrete grant rows.
 * Item loot returns one row. Pool loot rolls one weighted entry seeded by chestId.
 * Distance-gated pool entries require `context` (chest world position).
 */
export function resolvingWorldPlazaChestLootGrant(
  loot: DefiningWorldPlazaChestLoot,
  chestId: DefiningWorldPlazaChestId,
  context?: ResolvingWorldPlazaChestLootGrantContext
): readonly DefiningWorldPlazaChestLootGrant[] {
  if (loot.kind === 'item') {
    if (loot.quantity <= 0) {
      return [];
    }

    return [{ itemTypeId: loot.itemTypeId, quantity: loot.quantity }];
  }

  const poolEntries = resolvingWorldPlazaChestLootPoolEntries(loot.poolId);

  if (!poolEntries) {
    return [];
  }

  const eligibleEntries = filteringWorldPlazaChestLootPoolEntriesByDistance(
    poolEntries,
    context
  );

  if (eligibleEntries.length === 0) {
    return [];
  }

  const rng = creatingSeededRandomNumberGenerator(
    hashingWorldPlazaChestIdToSeed(chestId)
  );
  const picked = pickingWorldPlazaChestLootPoolEntry(eligibleEntries, rng());

  if (!picked || picked.quantity <= 0) {
    return [];
  }

  return [{ itemTypeId: picked.itemTypeId, quantity: picked.quantity }];
}
