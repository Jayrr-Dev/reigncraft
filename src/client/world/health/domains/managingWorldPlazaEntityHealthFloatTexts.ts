import { computingWorldPlazaEntityHealthDamageFloatLifetimeMs } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamageFloatVisualScale';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_TEXT_LIFETIME_MS,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_BLOCKED_COOLDOWN_MS,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_LIFETIME_MS,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_MAX_COUNT,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_MIN_AMOUNT,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextConstants';
import type {
  DefiningWorldPlazaEntityHealthFloatText,
  DefiningWorldPlazaEntityHealthFloatTextKind,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';
import type {
  DefiningWorldPlazaDamageOutcomeTier,
  DefiningWorldPlazaEntityDamageKind,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { isWorldPlazaEntityHealthFloatDamageKind } from '@/components/world/health/domains/formattingWorldPlazaEntityHealthFloatTextLabel';

let managingWorldPlazaEntityHealthFloatTextNextId = 0;

export type ManagingWorldPlazaEntityHealthFloatTextEnqueueParams = {
  floats: readonly DefiningWorldPlazaEntityHealthFloatText[];
  kind: DefiningWorldPlazaEntityHealthFloatTextKind;
  amount: number;
  damageKind?: DefiningWorldPlazaEntityDamageKind | null;
  itemTypeId?: string | null;
  outcomeTier?: DefiningWorldPlazaDamageOutcomeTier | null;
  deviationScore?: number | null;
  nowMs: number;
  lastBlockedFloatAtMs?: number;
};

export type ManagingWorldPlazaEntityHealthFloatTextEnqueueResult = {
  floats: DefiningWorldPlazaEntityHealthFloatText[];
  lastBlockedFloatAtMs: number;
};

function creatingWorldPlazaEntityHealthFloatTextId(): string {
  managingWorldPlazaEntityHealthFloatTextNextId += 1;
  return `health-float-${managingWorldPlazaEntityHealthFloatTextNextId}`;
}

function resolvingWorldPlazaEntityHealthFloatTextLifetimeMs(
  floatText: Pick<
    DefiningWorldPlazaEntityHealthFloatText,
    'kind' | 'deviationScore'
  >
): number {
  if (isWorldPlazaEntityHealthFloatDamageKind(floatText.kind)) {
    const scaledLifetime =
      computingWorldPlazaEntityHealthDamageFloatLifetimeMs(floatText);

    if (scaledLifetime > 0) {
      return scaledLifetime;
    }

    return DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_TEXT_LIFETIME_MS;
  }

  return DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_LIFETIME_MS;
}

/**
 * Drops expired floats and appends a new combat number when it is meaningful.
 */
export function enqueueingWorldPlazaEntityHealthFloatText({
  floats,
  kind,
  amount,
  damageKind = null,
  itemTypeId = null,
  outcomeTier = null,
  deviationScore = null,
  nowMs,
  lastBlockedFloatAtMs = 0,
}: ManagingWorldPlazaEntityHealthFloatTextEnqueueParams): ManagingWorldPlazaEntityHealthFloatTextEnqueueResult {
  const activeFloats = floats.filter(
    (floatText) =>
      nowMs - floatText.createdAtMs <
      resolvingWorldPlazaEntityHealthFloatTextLifetimeMs(floatText)
  );

  if (
    kind !== 'blocked' &&
    kind !== 'miss' &&
    kind !== 'health_scale' &&
    kind !== 'shield_absorb' &&
    kind !== 'damage_softened' &&
    kind !== 'damage_dodged' &&
    kind !== 'damage_roll_blocked' &&
    amount < DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_MIN_AMOUNT
  ) {
    return {
      floats: activeFloats,
      lastBlockedFloatAtMs,
    };
  }

  if (
    kind === 'blocked' &&
    nowMs - lastBlockedFloatAtMs <
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_BLOCKED_COOLDOWN_MS
  ) {
    return {
      floats: activeFloats,
      lastBlockedFloatAtMs,
    };
  }

  if (
    kind === 'item_gain' &&
    (itemTypeId === null || itemTypeId.length === 0)
  ) {
    return {
      floats: activeFloats,
      lastBlockedFloatAtMs,
    };
  }

  const nextFloat: DefiningWorldPlazaEntityHealthFloatText = {
    id: creatingWorldPlazaEntityHealthFloatTextId(),
    kind,
    amount,
    damageKind,
    itemTypeId: kind === 'item_gain' ? itemTypeId : null,
    outcomeTier,
    deviationScore,
    createdAtMs: nowMs,
    stackIndex: 0,
  };

  const stackedFloats = [nextFloat, ...activeFloats]
    .slice(0, DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_MAX_COUNT)
    .map((floatText, stackIndex) => ({
      ...floatText,
      stackIndex,
    }));

  return {
    floats: stackedFloats,
    lastBlockedFloatAtMs: kind === 'blocked' ? nowMs : lastBlockedFloatAtMs,
  };
}

/**
 * Removes combat floats that have finished animating.
 */
export function pruningWorldPlazaEntityHealthFloatTexts(
  floats: readonly DefiningWorldPlazaEntityHealthFloatText[],
  nowMs: number
): DefiningWorldPlazaEntityHealthFloatText[] {
  return floats.filter(
    (floatText) =>
      nowMs - floatText.createdAtMs <
      resolvingWorldPlazaEntityHealthFloatTextLifetimeMs(floatText)
  );
}
