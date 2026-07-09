import { redis } from '@devvit/web/server';
import { Hono } from 'hono';
import {
  checkingPlazaSaveSlotIndex,
  PLAZA_SINGLE_PLAYER_SAVE_SLOT_COUNT,
  type PlazaSaveSlotIndex,
} from '../../shared/plazaGameSession';
import type {
  PlazaSinglePlayerSaveLastPosition,
  PlazaSinglePlayerSavePersistedDiseaseEffect,
  PlazaSinglePlayerSavePlayerConditions,
  PlazaSinglePlayerSavesListResponse,
  PlazaSinglePlayerSaveSlotPersistedData,
  PlazaSinglePlayerSaveSlotResponse,
  PlazaSinglePlayerSaveSlotSaveResponse,
  PlazaSinglePlayerSaveSlotSummary,
  PlazaSinglePlayerSaveSlotUpdateRequest,
} from '../../shared/plazaSinglePlayerSavesDevvit';
import type { WorldInventoryDevvitPersistedState } from '../../shared/worldInventoryDevvit';
import { buildingPlazaSaveSlotsRedisKey } from '../domains/buildingPlazaSaveSlotRedisKeys';
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

  if (
    diseaseEffects.length === 0 &&
    (immuneSystemFactor ?? 0) <= 0 &&
    (diseaseImmunityIds?.length ?? 0) === 0
  ) {
    return null;
  }

  return {
    diseaseEffects,
    immuneSystemFactor,
    diseaseImmunityIds,
  };
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
    const updatedAtMs =
      typeof parsed.updatedAtMs === 'number' &&
      Number.isFinite(parsed.updatedAtMs)
        ? parsed.updatedAtMs
        : Math.max(lastPosition?.updatedAtMs ?? 0, 0);

    if (!lastPosition && !inventory && !playerConditions) {
      return null;
    }

    return {
      lastPosition,
      inventory,
      playerConditions,
      updatedAtMs,
    };
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

  if (
    update.lastPosition === undefined &&
    update.inventory === undefined &&
    update.playerConditions === undefined
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

  if (!nextLastPosition && !nextInventory && !nextPlayerConditions) {
    return null;
  }

  const updatedAtMs = Math.max(
    existing?.updatedAtMs ?? 0,
    nextLastPosition?.updatedAtMs ?? 0,
    Date.now()
  );

  return {
    lastPosition: nextLastPosition,
    inventory: nextInventory,
    playerConditions: nextPlayerConditions,
    updatedAtMs,
  };
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
  const rawExisting = await redis.hGet(savesKey, String(saveSlotIndex));
  const existing = rawExisting
    ? parsingPersistedSaveSlotData(rawExisting)
    : null;
  const merged = mergingSaveSlotData(existing, update);

  if (!merged) {
    await redis.hDel(savesKey, [String(saveSlotIndex)]);

    return c.json<PlazaSinglePlayerSaveSlotSaveResponse>({
      type: 'saved',
      saveSlotIndex,
      updatedAtMs: Date.now(),
    });
  }

  await redis.hSet(savesKey, {
    [String(saveSlotIndex)]: JSON.stringify(merged),
  });

  return c.json<PlazaSinglePlayerSaveSlotSaveResponse>({
    type: 'saved',
    saveSlotIndex,
    updatedAtMs: merged.updatedAtMs,
  });
});
