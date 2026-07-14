/**
 * localStorage persistence for player-placed caltrops.
 *
 * @module components/world/trap/domains/managingWorldPlazaLocalCaltrops
 */

import { DEFINING_WORLD_PLAZA_CALTROP_LOCAL_STORAGE_KEY_PREFIX } from '@/components/world/trap/domains/definingWorldPlazaCaltropConstants';
import type {
  DefiningWorldPlazaCaltropInstance,
  DefiningWorldPlazaCaltropPlacement,
} from '@/components/world/trap/domains/definingWorldPlazaCaltropTypes';
import {
  hydratingWorldPlazaCaltropInstanceStore,
  listingWorldPlazaCaltropInstances,
} from '@/components/world/trap/domains/managingWorldPlazaCaltropInstanceStore';

type PersistedCaltropRecord = {
  readonly trapId: string;
  readonly worldX: number;
  readonly worldY: number;
  readonly ownerId: string | null;
};

function formattingWorldPlazaCaltropLocalStorageKey(ownerId: string): string {
  return `${DEFINING_WORLD_PLAZA_CALTROP_LOCAL_STORAGE_KEY_PREFIX}:${ownerId}`;
}

function parsingPersistedCaltropRecord(
  value: unknown
): PersistedCaltropRecord | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Partial<PersistedCaltropRecord>;

  if (
    typeof record.trapId !== 'string' ||
    typeof record.worldX !== 'number' ||
    typeof record.worldY !== 'number'
  ) {
    return null;
  }

  return {
    trapId: record.trapId,
    worldX: record.worldX,
    worldY: record.worldY,
    ownerId: typeof record.ownerId === 'string' ? record.ownerId : null,
  };
}

function convertingPlacementToInstance(
  placement: DefiningWorldPlazaCaltropPlacement
): DefiningWorldPlazaCaltropInstance {
  return {
    trapId: placement.trapId,
    position: { x: placement.worldX, y: placement.worldY },
    ownerId: placement.ownerId,
  };
}

/** Loads persisted caltrops for an owner into the instance store. */
export function hydratingWorldPlazaLocalCaltrops(
  ownerId: string
): readonly DefiningWorldPlazaCaltropInstance[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(
      formattingWorldPlazaCaltropLocalStorageKey(ownerId)
    );

    if (!raw) {
      hydratingWorldPlazaCaltropInstanceStore([]);
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      hydratingWorldPlazaCaltropInstanceStore([]);
      return [];
    }

    const instances = parsed
      .map(parsingPersistedCaltropRecord)
      .filter((entry): entry is PersistedCaltropRecord => entry !== null)
      .map((entry) =>
        convertingPlacementToInstance({
          trapId: entry.trapId,
          worldX: entry.worldX,
          worldY: entry.worldY,
          ownerId: entry.ownerId ?? ownerId,
        })
      );

    hydratingWorldPlazaCaltropInstanceStore(instances);
    return instances;
  } catch {
    hydratingWorldPlazaCaltropInstanceStore([]);
    return [];
  }
}

/** Writes current store contents for an owner. */
export function persistingWorldPlazaLocalCaltrops(ownerId: string): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  const payload: PersistedCaltropRecord[] = listingWorldPlazaCaltropInstances()
    .filter(
      (instance) =>
        instance.ownerId === ownerId || instance.ownerId === null
    )
    .map((instance) => ({
      trapId: instance.trapId,
      worldX: instance.position.x,
      worldY: instance.position.y,
      ownerId: instance.ownerId ?? ownerId,
    }));

  try {
    localStorage.setItem(
      formattingWorldPlazaCaltropLocalStorageKey(ownerId),
      JSON.stringify(payload)
    );
  } catch {
    // Quota / private mode — ignore.
  }
}
