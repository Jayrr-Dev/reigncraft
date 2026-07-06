/**
 * Kingpin founder test inventory seed for world plaza manual QA.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryKingpinTestSeed
 */

import { CODING_ABOUT_PAGE_FOUNDER_TYPOLOGIST_USERNAME } from "@/components/site/domains/definingAboutPageFounderTypologistUsername";
import type { DefiningWorldPlazaInventoryDemoSeedItem } from "@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes";
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from "@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds";

/** Bump to re-apply the Kingpin test load after inventory changes. */
export const DEFINING_WORLD_PLAZA_INVENTORY_KINGPIN_TEST_SEED_VERSION = 2 as const;

/** localStorage key prefix for the applied Kingpin seed version. */
export const DEFINING_WORLD_PLAZA_INVENTORY_KINGPIN_TEST_SEED_STORAGE_KEY_PREFIX =
  "world-plaza-inventory-kingpin-seed-version" as const;

/** Generous hotbar load for drop, pickup, and stack testing. */
export const DEFINING_WORLD_PLAZA_INVENTORY_KINGPIN_TEST_SEED_ITEMS: readonly DefiningWorldPlazaInventoryDemoSeedItem[] =
  [
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
      quantity: 64,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
      quantity: 48,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_TOOL,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
      quantity: 1,
    },
    {
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SATCHEL,
      quantity: 1,
    },
  ] as const;

/**
 * Resolves the localStorage key that tracks the Kingpin seed version.
 *
 * @param userId - Authenticated user id
 */
export function resolvingWorldPlazaInventoryKingpinTestSeedStorageKey(
  userId: string,
): string {
  return `${DEFINING_WORLD_PLAZA_INVENTORY_KINGPIN_TEST_SEED_STORAGE_KEY_PREFIX}:${userId}`;
}

/**
 * Returns true when the signed-in username matches the founder handle.
 *
 * @param username - Public username from {@code auth_user}
 */
export function checkingWorldPlazaInventoryUserIsKingpin(
  username: string | null | undefined,
): boolean {
  const trimmedUsername = username?.trim();

  if (!trimmedUsername) {
    return false;
  }

  return (
    trimmedUsername.toLowerCase() ===
    CODING_ABOUT_PAGE_FOUNDER_TYPOLOGIST_USERNAME.toLowerCase()
  );
}

/**
 * Reads the last applied Kingpin seed version from localStorage.
 *
 * @param userId - Authenticated user id
 */
export function readingWorldPlazaInventoryKingpinTestSeedVersion(
  userId: string,
): number {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const rawValue = window.localStorage.getItem(
      resolvingWorldPlazaInventoryKingpinTestSeedStorageKey(userId),
    );
    const parsedVersion = Number(rawValue);

    return Number.isFinite(parsedVersion) && parsedVersion >= 0
      ? parsedVersion
      : 0;
  } catch {
    return 0;
  }
}

/**
 * Persists the applied Kingpin seed version to localStorage.
 *
 * @param userId - Authenticated user id
 * @param seedVersion - Version that was just applied
 */
export function writingWorldPlazaInventoryKingpinTestSeedVersion(
  userId: string,
  seedVersion: number,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      resolvingWorldPlazaInventoryKingpinTestSeedStorageKey(userId),
      String(seedVersion),
    );
  } catch {
    // Quota exceeded or private browsing; fail silently
  }
}
