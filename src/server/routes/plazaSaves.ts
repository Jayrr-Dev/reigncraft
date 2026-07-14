import { redis } from '@devvit/web/server';
import { Hono } from 'hono';
import {
  checkingPlazaSaveSlotIndex,
  PLAZA_SINGLE_PLAYER_SAVE_SLOT_COUNT,
  type PlazaSaveSlotIndex,
} from '../../shared/plazaGameSession';
import type {
  PlazaSinglePlayerSaveBestiaryDiscovery,
  PlazaSinglePlayerSaveLastPosition,
  PlazaSinglePlayerSavePersistedDiseaseEffect,
  PlazaSinglePlayerSavePetRoster,
  PlazaSinglePlayerSavePlayerConditions,
  PlazaSinglePlayerSavesListResponse,
  PlazaSinglePlayerSaveSlotPersistedData,
  PlazaSinglePlayerSaveSlotResponse,
  PlazaSinglePlayerSaveSlotSaveResponse,
  PlazaSinglePlayerSaveSlotSummary,
  PlazaSinglePlayerSaveSlotUpdateRequest,
} from '../../shared/plazaSinglePlayerSavesDevvit';
import { parsingPlazaSinglePlayerSavePetRoster } from '../../shared/parsingPlazaSinglePlayerSavePetRoster';
import type { WorldInventoryDevvitPersistedState } from '../../shared/worldInventoryDevvit';
import { buildingPlazaSaveSlotsRedisKey } from '../domains/buildingPlazaSaveSlotRedisKeys';
import { clearingPlazaSinglePlayerSaveSlotWorldPersistence } from '../domains/clearingPlazaSinglePlayerSaveSlotWorldPersistence';
import { resolvingDevvitRedditUserId } from '../domains/resolvingDevvitRedditUserId';

function parsingSaveSlotIndex(rawValue: string): PlazaSaveSlotIndex | null {
  const parsed = Number.parseInt(rawValue, 10);

  if (!checkingPlazaSaveSlotIndex(parsed)) {
    return null;
  }

  return parsed;
}

function checkingSaveLastPosition(
  value: unknown
): value is PlazaSinglePlayerSaveLastPosition {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<PlazaSinglePlayerSaveLastPosition>;

  return (
    typeof candidate.x === 'number' &&
    Number.isFinite(candidate.x) &&
    typeof candidate.y === 'number' &&
    Number.isFinite(candidate.y) &&
    typeof candidate.layer === 'number' &&
    Number.isFinite(candidate.layer) &&
    typeof candidate.updatedAtMs === 'number' &&
    Number.isFinite(candidate.updatedAtMs)
  );
}

function parsingPersistedInventoryState(
  value: unknown
): WorldInventoryDevvitPersistedState | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<WorldInventoryDevvitPersistedState>;

  if (
    typeof candidate.capacity !== 'number' ||
    !Array.isArray(candidate.slots)
  ) {
    return null;
  }

  return {
    capacity: candidate.capacity,
    slots: candidate.slots,
  };
}

function parsingPersistedDiseaseEffect(
  value: unknown
): PlazaSinglePlayerSavePersistedDiseaseEffect | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate =
    value as Partial<PlazaSinglePlayerSavePersistedDiseaseEffect>;

  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.diseaseId !== 'string' ||
    typeof candidate.contractedAtMs !== 'number' ||
    !Number.isFinite(candidate.contractedAtMs) ||
    typeof candidate.symptomsStartAtMs !== 'number' ||
    !Number.isFinite(candidate.symptomsStartAtMs) ||
    typeof candidate.expiresAtMs !== 'number' ||
    !Number.isFinite(candidate.expiresAtMs) ||
    !Array.isArray(candidate.pendingGrants)
  ) {
    return null;
  }

  const pendingGrants = candidate.pendingGrants
    .map((pendingGrant) => {
      if (!pendingGrant || typeof pendingGrant !== 'object') {
        return null;
      }

      const grantCandidate = pendingGrant as Partial<{
        grantIndex: number;
        fireAtMs: number;
      }>;

      if (
        typeof grantCandidate.grantIndex !== 'number' ||
        !Number.isFinite(grantCandidate.grantIndex) ||
        typeof grantCandidate.fireAtMs !== 'number' ||
        !Number.isFinite(grantCandidate.fireAtMs)
      ) {
        return null;
      }

      return {
        grantIndex: grantCandidate.grantIndex,
        fireAtMs: grantCandidate.fireAtMs,
      };
    })
    .filter(
      (
        pendingGrant
      ): pendingGrant is PlazaSinglePlayerSavePersistedDiseaseEffect['pendingGrants'][number] =>
        pendingGrant !== null
    );

  return {
    id: candidate.id,
    diseaseId: candidate.diseaseId,
    contractedAtMs: candidate.contractedAtMs,
    symptomsStartAtMs: candidate.symptomsStartAtMs,
    expiresAtMs: candidate.expiresAtMs,
    symptomStrengthMultiplier:
      typeof candidate.symptomStrengthMultiplier === 'number' &&
      Number.isFinite(candidate.symptomStrengthMultiplier)
        ? candidate.symptomStrengthMultiplier
        : undefined,
    durationMultiplier:
      typeof candidate.durationMultiplier === 'number' &&
      Number.isFinite(candidate.durationMultiplier)
        ? candidate.durationMultiplier
        : undefined,
    pendingGrants,
  };
}

function parsingPersistedPlayerConditions(
  value: unknown
): PlazaSinglePlayerSavePlayerConditions | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<PlazaSinglePlayerSavePlayerConditions>;

  if (!Array.isArray(candidate.diseaseEffects)) {
    return null;
  }

  const diseaseEffects = candidate.diseaseEffects
    .map((diseaseEffect) => parsingPersistedDiseaseEffect(diseaseEffect))
    .filter(
      (
        diseaseEffect
      ): diseaseEffect is PlazaSinglePlayerSavePersistedDiseaseEffect =>
        diseaseEffect !== null
    );
  const immuneSystemFactor =
    typeof candidate.immuneSystemFactor === 'number' &&
    Number.isFinite(candidate.immuneSystemFactor)
      ? candidate.immuneSystemFactor
      : undefined;
  const diseaseImmunityIds = Array.isArray(candidate.diseaseImmunityIds)
    ? candidate.diseaseImmunityIds.filter(
        (diseaseId): diseaseId is string => typeof diseaseId === 'string'
      )
    : undefined;
  const currentHealth =
    typeof candidate.currentHealth === 'number' &&
    Number.isFinite(candidate.currentHealth)
      ? Math.max(0, candidate.currentHealth)
      : undefined;
  const hungerRatio =
    typeof candidate.hungerRatio === 'number' &&
    Number.isFinite(candidate.hungerRatio)
      ? Math.min(1, Math.max(0, candidate.hungerRatio))
      : undefined;

  if (
    diseaseEffects.length === 0 &&
    (immuneSystemFactor ?? 0) <= 0 &&
    (diseaseImmunityIds?.length ?? 0) === 0 &&
    currentHealth === undefined &&
    hungerRatio === undefined
  ) {
    return null;
  }

  return {
    diseaseEffects,
    immuneSystemFactor,
    diseaseImmunityIds,
    currentHealth,
    hungerRatio,
  };
}

/**
 * Parses attached cookbook recipe page ids from save JSON.
 * Unknown / non-string values are dropped. Empty → null.
 */
function parsingAttachedRecipeIds(value: unknown): readonly string[] | null {
  return parsingSortedStringIdList(value);
}

/**
 * Parses a sorted, deduped list of non-empty strings. Empty → null.
 */
function parsingSortedStringIdList(value: unknown): readonly string[] | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const ids = [
    ...new Set(
      value.filter(
        (id): id is string => typeof id === 'string' && id.length > 0
      )
    ),
  ].sort();

  return ids.length > 0 ? ids : null;
}

/**
 * Parses bestiary discovery progress from save JSON. Empty → null.
 */
function parsingBestiaryDiscovery(
  value: unknown
): PlazaSinglePlayerSaveBestiaryDiscovery | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const candidate = value as Partial<PlazaSinglePlayerSaveBestiaryDiscovery> & {
    killCountsBySpeciesId?: unknown;
  };
  const sightedSpeciesIds =
    parsingSortedStringIdList(candidate.sightedSpeciesIds) ?? [];
  const studyCountsBySpeciesId: Record<string, number> = {};

  const applyingStudyCountRecord = (rawCounts: unknown): void => {
    if (
      !rawCounts ||
      typeof rawCounts !== 'object' ||
      Array.isArray(rawCounts)
    ) {
      return;
    }

    for (const [speciesId, rawCount] of Object.entries(rawCounts)) {
      if (typeof speciesId !== 'string' || speciesId.length === 0) {
        continue;
      }

      if (typeof rawCount !== 'number' || !Number.isFinite(rawCount)) {
        continue;
      }

      const studyCount = Math.max(0, Math.floor(rawCount));

      if (studyCount <= 0) {
        continue;
      }

      studyCountsBySpeciesId[speciesId] = Math.max(
        studyCountsBySpeciesId[speciesId] ?? 0,
        studyCount
      );
    }
  };

  applyingStudyCountRecord(candidate.studyCountsBySpeciesId);
  // Legacy Redis payloads used killCounts before Study renamed the field.
  applyingStudyCountRecord(candidate.killCountsBySpeciesId);

  const sortedStudyCounts = Object.fromEntries(
    Object.entries(studyCountsBySpeciesId).sort(([left], [right]) =>
      left.localeCompare(right)
    )
  );

  if (
    sightedSpeciesIds.length === 0 &&
    Object.keys(sortedStudyCounts).length === 0
  ) {
    return null;
  }

  return {
    sightedSpeciesIds,
    studyCountsBySpeciesId: sortedStudyCounts,
  };
}

/**
 * Parses named realm ids (`latticeX:latticeY`). Empty → null.
 */
function parsingDiscoveredNamedRealmIds(
  value: unknown
): readonly string[] | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const realmIds = [
    ...new Set(
      value.filter(
        (realmId): realmId is string =>
          typeof realmId === 'string' &&
          realmId.length > 0 &&
          realmId.includes(':')
      )
    ),
  ].sort();

  return realmIds.length > 0 ? realmIds : null;
}

/**
 * Parses a persisted pet roster from save JSON. Malformed pet rows are
 * dropped; an empty roster (no pets) normalizes to null.
 */
function parsingPersistedPetRoster(
  value: unknown
): PlazaSinglePlayerSavePetRoster | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const { roster } = parsingPlazaSinglePlayerSavePetRoster(value);

  return roster.pets.length > 0 ? roster : null;
}

function checkingSaveSlotHasPersistedData(
  data: Pick<
    PlazaSinglePlayerSaveSlotPersistedData,
    | 'lastPosition'
    | 'inventory'
    | 'playerConditions'
    | 'attachedRecipeIds'
    | 'bestiaryDiscovery'
    | 'exploredBiomeKinds'
    | 'discoveredNamedRealmIds'
    | 'petRoster'
  >
): boolean {
  return Boolean(
    data.lastPosition ||
    data.inventory ||
    data.playerConditions ||
    (data.attachedRecipeIds && data.attachedRecipeIds.length > 0) ||
    data.bestiaryDiscovery ||
    (data.exploredBiomeKinds && data.exploredBiomeKinds.length > 0) ||
    (data.discoveredNamedRealmIds && data.discoveredNamedRealmIds.length > 0) ||
    (data.petRoster && data.petRoster.pets.length > 0)
  );
}

function parsingPersistedSaveSlotData(
  rawValue: string
): PlazaSinglePlayerSaveSlotPersistedData | null {
  try {
    const parsed = JSON.parse(
      rawValue
    ) as Partial<PlazaSinglePlayerSaveSlotPersistedData>;

    const lastPosition =
      parsed.lastPosition === null || parsed.lastPosition === undefined
        ? null
        : checkingSaveLastPosition(parsed.lastPosition)
          ? parsed.lastPosition
          : null;
    const inventory =
      parsed.inventory === null || parsed.inventory === undefined
        ? null
        : parsingPersistedInventoryState(parsed.inventory);
    const playerConditions =
      parsed.playerConditions === null || parsed.playerConditions === undefined
        ? null
        : parsingPersistedPlayerConditions(parsed.playerConditions);
    const attachedRecipeIds = parsingAttachedRecipeIds(
      parsed.attachedRecipeIds
    );
    const bestiaryDiscovery = parsingBestiaryDiscovery(
      parsed.bestiaryDiscovery
    );
    const exploredBiomeKinds = parsingSortedStringIdList(
      parsed.exploredBiomeKinds
    );
    const discoveredNamedRealmIds = parsingDiscoveredNamedRealmIds(
      parsed.discoveredNamedRealmIds
    );
    const petRoster = parsingPersistedPetRoster(parsed.petRoster);
    const updatedAtMs =
      typeof parsed.updatedAtMs === 'number' &&
      Number.isFinite(parsed.updatedAtMs)
        ? parsed.updatedAtMs
        : Math.max(lastPosition?.updatedAtMs ?? 0, 0);

    const persistedData = {
      lastPosition,
      inventory,
      playerConditions,
      attachedRecipeIds,
      bestiaryDiscovery,
      exploredBiomeKinds,
      discoveredNamedRealmIds,
      petRoster,
      updatedAtMs,
    };

    if (!checkingSaveSlotHasPersistedData(persistedData)) {
      return null;
    }

    return persistedData;
  } catch {
    return null;
  }
}

function buildingSaveSlotSummary(
  saveSlotIndex: PlazaSaveSlotIndex,
  data: PlazaSinglePlayerSaveSlotPersistedData | null
): PlazaSinglePlayerSaveSlotSummary {
  return {
    saveSlotIndex,
    hasSaveData: data !== null,
    lastPlayedAtMs: data?.updatedAtMs ?? null,
  };
}

function parsingSaveSlotUpdateBody(
  body: unknown
): PlazaSinglePlayerSaveSlotUpdateRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const payload = body as Partial<PlazaSinglePlayerSaveSlotUpdateRequest>;
  const update: PlazaSinglePlayerSaveSlotUpdateRequest = {};

  if ('lastPosition' in payload) {
    if (
      payload.lastPosition !== null &&
      !checkingSaveLastPosition(payload.lastPosition)
    ) {
      return null;
    }

    update.lastPosition = payload.lastPosition ?? null;
  }

  if ('inventory' in payload) {
    if (
      payload.inventory !== null &&
      parsingPersistedInventoryState(payload.inventory) === null
    ) {
      return null;
    }

    update.inventory = payload.inventory ?? null;
  }

  if ('playerConditions' in payload) {
    if (
      payload.playerConditions !== null &&
      parsingPersistedPlayerConditions(payload.playerConditions) === null
    ) {
      return null;
    }

    update.playerConditions = payload.playerConditions ?? null;
  }

  if ('attachedRecipeIds' in payload) {
    if (payload.attachedRecipeIds === null) {
      update.attachedRecipeIds = null;
    } else if (!Array.isArray(payload.attachedRecipeIds)) {
      return null;
    } else {
      update.attachedRecipeIds = parsingAttachedRecipeIds(
        payload.attachedRecipeIds
      );
    }
  }

  if ('bestiaryDiscovery' in payload) {
    if (payload.bestiaryDiscovery === null) {
      update.bestiaryDiscovery = null;
    } else if (
      !payload.bestiaryDiscovery ||
      typeof payload.bestiaryDiscovery !== 'object' ||
      Array.isArray(payload.bestiaryDiscovery)
    ) {
      return null;
    } else {
      update.bestiaryDiscovery = parsingBestiaryDiscovery(
        payload.bestiaryDiscovery
      );
    }
  }

  if ('exploredBiomeKinds' in payload) {
    if (payload.exploredBiomeKinds === null) {
      update.exploredBiomeKinds = null;
    } else if (!Array.isArray(payload.exploredBiomeKinds)) {
      return null;
    } else {
      update.exploredBiomeKinds = parsingSortedStringIdList(
        payload.exploredBiomeKinds
      );
    }
  }

  if ('discoveredNamedRealmIds' in payload) {
    if (payload.discoveredNamedRealmIds === null) {
      update.discoveredNamedRealmIds = null;
    } else if (!Array.isArray(payload.discoveredNamedRealmIds)) {
      return null;
    } else {
      update.discoveredNamedRealmIds = parsingDiscoveredNamedRealmIds(
        payload.discoveredNamedRealmIds
      );
    }
  }

  if ('petRoster' in payload) {
    if (payload.petRoster === null) {
      update.petRoster = null;
    } else if (
      !payload.petRoster ||
      typeof payload.petRoster !== 'object' ||
      Array.isArray(payload.petRoster)
    ) {
      return null;
    } else {
      update.petRoster = parsingPersistedPetRoster(payload.petRoster);
    }
  }

  if (
    update.lastPosition === undefined &&
    update.inventory === undefined &&
    update.playerConditions === undefined &&
    update.attachedRecipeIds === undefined &&
    update.bestiaryDiscovery === undefined &&
    update.exploredBiomeKinds === undefined &&
    update.discoveredNamedRealmIds === undefined &&
    update.petRoster === undefined
  ) {
    return null;
  }

  return update;
}

function mergingSaveSlotData(
  existing: PlazaSinglePlayerSaveSlotPersistedData | null,
  update: PlazaSinglePlayerSaveSlotUpdateRequest
): PlazaSinglePlayerSaveSlotPersistedData | null {
  const nextLastPosition =
    update.lastPosition !== undefined
      ? update.lastPosition
      : (existing?.lastPosition ?? null);
  const nextInventory =
    update.inventory !== undefined
      ? update.inventory
      : (existing?.inventory ?? null);
  const nextPlayerConditions =
    update.playerConditions !== undefined
      ? update.playerConditions
      : (existing?.playerConditions ?? null);
  const nextAttachedRecipeIds =
    update.attachedRecipeIds !== undefined
      ? update.attachedRecipeIds === null
        ? null
        : (parsingAttachedRecipeIds(update.attachedRecipeIds) ?? null)
      : (existing?.attachedRecipeIds ?? null);
  const nextBestiaryDiscovery =
    update.bestiaryDiscovery !== undefined
      ? update.bestiaryDiscovery === null
        ? null
        : parsingBestiaryDiscovery(update.bestiaryDiscovery)
      : (existing?.bestiaryDiscovery ?? null);
  const nextExploredBiomeKinds =
    update.exploredBiomeKinds !== undefined
      ? update.exploredBiomeKinds === null
        ? null
        : (parsingSortedStringIdList(update.exploredBiomeKinds) ?? null)
      : (existing?.exploredBiomeKinds ?? null);
  const nextDiscoveredNamedRealmIds =
    update.discoveredNamedRealmIds !== undefined
      ? update.discoveredNamedRealmIds === null
        ? null
        : (parsingDiscoveredNamedRealmIds(update.discoveredNamedRealmIds) ??
          null)
      : (existing?.discoveredNamedRealmIds ?? null);
  const nextPetRoster =
    update.petRoster !== undefined
      ? update.petRoster === null
        ? null
        : parsingPersistedPetRoster(update.petRoster)
      : (existing?.petRoster ?? null);

  const merged = {
    lastPosition: nextLastPosition,
    inventory: nextInventory,
    playerConditions: nextPlayerConditions,
    attachedRecipeIds: nextAttachedRecipeIds,
    bestiaryDiscovery: nextBestiaryDiscovery,
    exploredBiomeKinds: nextExploredBiomeKinds,
    discoveredNamedRealmIds: nextDiscoveredNamedRealmIds,
    petRoster: nextPetRoster,
    updatedAtMs: Math.max(
      existing?.updatedAtMs ?? 0,
      nextLastPosition?.updatedAtMs ?? 0,
      Date.now()
    ),
  };

  if (!checkingSaveSlotHasPersistedData(merged)) {
    return null;
  }

  return merged;
}

const DEFINING_PLAZA_SAVE_SLOT_WRITE_MAX_ATTEMPTS = 8 as const;

/**
 * Atomically merges a partial save update into the Redis hash field for one slot.
 * Uses WATCH/MULTI so concurrent inventory + position writes cannot clobber each other.
 */
async function writingSaveSlotDataAtomically(
  savesKey: string,
  saveSlotIndex: PlazaSaveSlotIndex,
  update: PlazaSinglePlayerSaveSlotUpdateRequest
): Promise<{
  readonly merged: PlazaSinglePlayerSaveSlotPersistedData | null;
  readonly updatedAtMs: number;
}> {
  for (
    let attempt = 0;
    attempt < DEFINING_PLAZA_SAVE_SLOT_WRITE_MAX_ATTEMPTS;
    attempt += 1
  ) {
    const txn = await redis.watch(savesKey);
    const rawExisting = await redis.hGet(savesKey, String(saveSlotIndex));
    const existing = rawExisting
      ? parsingPersistedSaveSlotData(rawExisting)
      : null;
    const merged = mergingSaveSlotData(existing, update);

    await txn.multi();

    if (!merged) {
      await txn.hDel(savesKey, [String(saveSlotIndex)]);
    } else {
      await txn.hSet(savesKey, {
        [String(saveSlotIndex)]: JSON.stringify(merged),
      });
    }

    const execResult = await txn.exec();

    if (execResult !== null) {
      return {
        merged,
        updatedAtMs: merged?.updatedAtMs ?? Date.now(),
      };
    }
  }

  throw new Error('Save slot write conflict after retries.');
}

export const plazaSaves = new Hono();

plazaSaves.get('/', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<PlazaSinglePlayerSavesListResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to load save slots.',
      },
      401
    );
  }

  const savesKey = buildingPlazaSaveSlotsRedisKey(userId);
  const rawSlots = await redis.hGetAll(savesKey);
  const slots: PlazaSinglePlayerSaveSlotSummary[] = [];

  for (
    let index = 1;
    index <= PLAZA_SINGLE_PLAYER_SAVE_SLOT_COUNT;
    index += 1
  ) {
    const saveSlotIndex = index as PlazaSaveSlotIndex;
    const rawValue = rawSlots[String(saveSlotIndex)];
    const parsedData = rawValue ? parsingPersistedSaveSlotData(rawValue) : null;

    slots.push(buildingSaveSlotSummary(saveSlotIndex, parsedData));
  }

  return c.json<PlazaSinglePlayerSavesListResponse>({
    type: 'saves',
    slots,
  });
});

plazaSaves.get('/:saveSlotIndex', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<PlazaSinglePlayerSaveSlotResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to load save slots.',
      },
      401
    );
  }

  const saveSlotIndex = parsingSaveSlotIndex(c.req.param('saveSlotIndex'));

  if (!saveSlotIndex) {
    return c.json<PlazaSinglePlayerSaveSlotResponse>(
      {
        type: 'error',
        message: 'Invalid save slot.',
      },
      400
    );
  }

  const savesKey = buildingPlazaSaveSlotsRedisKey(userId);
  const rawValue = await redis.hGet(savesKey, String(saveSlotIndex));
  const parsedData = rawValue ? parsingPersistedSaveSlotData(rawValue) : null;

  return c.json<PlazaSinglePlayerSaveSlotResponse>({
    type: 'save-slot',
    saveSlotIndex,
    data: parsedData,
  });
});

plazaSaves.put('/:saveSlotIndex', async (c) => {
  const userId = await resolvingDevvitRedditUserId();

  if (!userId) {
    return c.json<PlazaSinglePlayerSaveSlotSaveResponse>(
      {
        type: 'error',
        message: 'Sign in to Reddit to save progress.',
      },
      401
    );
  }

  const saveSlotIndex = parsingSaveSlotIndex(c.req.param('saveSlotIndex'));

  if (!saveSlotIndex) {
    return c.json<PlazaSinglePlayerSaveSlotSaveResponse>(
      {
        type: 'error',
        message: 'Invalid save slot.',
      },
      400
    );
  }

  const body: unknown = await c.req.json().catch(() => null);
  const update = parsingSaveSlotUpdateBody(body);

  if (!update) {
    return c.json<PlazaSinglePlayerSaveSlotSaveResponse>(
      {
        type: 'error',
        message: 'Invalid save slot payload.',
      },
      400
    );
  }

  const savesKey = buildingPlazaSaveSlotsRedisKey(userId);

  try {
    const { merged, updatedAtMs } = await writingSaveSlotDataAtomically(
      savesKey,
      saveSlotIndex,
      update
    );

    // Full slot wipe (all fields null) also clears plots / harvest / ground Redis.
    if (merged === null) {
      await clearingPlazaSinglePlayerSaveSlotWorldPersistence(
        userId,
        saveSlotIndex
      );
    }

    return c.json<PlazaSinglePlayerSaveSlotSaveResponse>({
      type: 'saved',
      saveSlotIndex,
      updatedAtMs: merged?.updatedAtMs ?? updatedAtMs,
    });
  } catch {
    return c.json<PlazaSinglePlayerSaveSlotSaveResponse>(
      {
        type: 'error',
        message: 'Could not save progress. Try again.',
      },
      409
    );
  }
});
