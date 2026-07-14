/**
 * localStorage persistence for player-placed bear traps.
 *
 * @module components/world/trap/domains/managingWorldPlazaLocalBearTraps
 */

import { DEFINING_WORLD_PLAZA_BEAR_TRAP_LOCAL_STORAGE_KEY_PREFIX } from '@/components/world/trap/domains/definingWorldPlazaBearTrapConstants';
import type {
  DefiningWorldPlazaBearTrapInstance,
  DefiningWorldPlazaBearTrapPlacement,
  DefiningWorldPlazaBearTrapState,
} from '@/components/world/trap/domains/definingWorldPlazaBearTrapTypes';
import {
  DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX,
} from '@/components/world/trap/domains/definingWorldPlazaBearTrapConstants';
import {
  hydratingWorldPlazaBearTrapInstanceStore,
  listingWorldPlazaBearTrapInstances,
} from '@/components/world/trap/domains/managingWorldPlazaBearTrapInstanceStore';

type PersistedBearTrapRecord = {
  readonly trapId: string;
  readonly worldX: number;
  readonly worldY: number;
  readonly state: DefiningWorldPlazaBearTrapState;
  readonly ownerId: string | null;
};

function formattingWorldPlazaBearTrapLocalStorageKey(
  ownerId: string
): string {
  return `${DEFINING_WORLD_PLAZA_BEAR_TRAP_LOCAL_STORAGE_KEY_PREFIX}:${ownerId}`;
}

function parsingPersistedBearTrapRecord(
  value: unknown
): PersistedBearTrapRecord | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Partial<PersistedBearTrapRecord>;

  if (
    typeof record.trapId !== 'string' ||
    typeof record.worldX !== 'number' ||
    typeof record.worldY !== 'number' ||
    (record.state !== 'armed' &&
      record.state !== 'sprung' &&
      record.state !== 'disarmed')
  ) {
    return null;
  }

  return {
    trapId: record.trapId,
    worldX: record.worldX,
    worldY: record.worldY,
    state: record.state,
    ownerId: typeof record.ownerId === 'string' ? record.ownerId : null,
  };
}

function convertingPlacementToInstance(
  placement: DefiningWorldPlazaBearTrapPlacement
): DefiningWorldPlazaBearTrapInstance {
  return {
    trapId: placement.trapId,
    position: { x: placement.worldX, y: placement.worldY },
    state: placement.state,
    ownerId: placement.ownerId,
    snapStartedAtMs: null,
    snapFrame:
      placement.state === 'armed'
        ? DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX.OPEN
        : DEFINING_WORLD_PLAZA_BEAR_TRAP_FRAME_INDEX.CLOSED,
  };
}

/** Loads persisted traps for an owner into the instance store. */
export function hydratingWorldPlazaLocalBearTraps(
  ownerId: string
): readonly DefiningWorldPlazaBearTrapInstance[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(
      formattingWorldPlazaBearTrapLocalStorageKey(ownerId)
    );

    if (!raw) {
      hydratingWorldPlazaBearTrapInstanceStore([]);
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      hydratingWorldPlazaBearTrapInstanceStore([]);
      return [];
    }

    const instances = parsed
      .map(parsingPersistedBearTrapRecord)
      .filter((entry): entry is PersistedBearTrapRecord => entry !== null)
      .map((entry) =>
        convertingPlacementToInstance({
          trapId: entry.trapId,
          worldX: entry.worldX,
          worldY: entry.worldY,
          state: entry.state,
          ownerId: entry.ownerId ?? ownerId,
        })
      );

    hydratingWorldPlazaBearTrapInstanceStore(instances);
    return instances;
  } catch {
    hydratingWorldPlazaBearTrapInstanceStore([]);
    return [];
  }
}

/** Writes current store contents for an owner. */
export function persistingWorldPlazaLocalBearTraps(
  ownerId: string
): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  const payload: PersistedBearTrapRecord[] = listingWorldPlazaBearTrapInstances()
    .filter(
      (instance) =>
        instance.ownerId === ownerId || instance.ownerId === null
    )
    .map((instance) => ({
      trapId: instance.trapId,
      worldX: instance.position.x,
      worldY: instance.position.y,
      state: instance.state === 'armed' ? 'armed' : instance.state,
      ownerId: instance.ownerId ?? ownerId,
    }));

  try {
    localStorage.setItem(
      formattingWorldPlazaBearTrapLocalStorageKey(ownerId),
      JSON.stringify(payload)
    );
  } catch {
    // Quota / private mode — ignore.
  }
}
