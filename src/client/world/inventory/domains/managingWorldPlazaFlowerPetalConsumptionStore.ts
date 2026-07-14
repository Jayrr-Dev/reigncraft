/**
 * Session store for raw-flower eat timestamps and Petal Sickness lockout.
 *
 * @module components/world/inventory/domains/managingWorldPlazaFlowerPetalConsumptionStore
 */

import {
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_BASE_CHANCE,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_CHANCE_CAP,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_CHANCE_PER_EXTRA_PETAL,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_COOLDOWN_MS,
  DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_MIN_PETALS,
} from '@/components/world/inventory/domains/definingWorldPlazaFlowerPetalSicknessConstants';

type ManagingWorldPlazaFlowerPetalConsumptionState = {
  eatEpochMs: number[];
  /** Wall epoch until which a fresh Petal Sickness contract is blocked. */
  lockoutUntilEpochMs: number;
};

const managingWorldPlazaFlowerPetalConsumptionState: ManagingWorldPlazaFlowerPetalConsumptionState =
  {
    eatEpochMs: [],
    lockoutUntilEpochMs: 0,
  };

function pruningWorldPlazaFlowerPetalConsumptionEats(
  worldEpochMs: number
): number[] {
  const windowStartMs =
    worldEpochMs - DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_COOLDOWN_MS;

  return managingWorldPlazaFlowerPetalConsumptionState.eatEpochMs.filter(
    (eatEpochMs) => eatEpochMs >= windowStartMs
  );
}

function resolvingWorldPlazaFlowerPetalSicknessChance(
  petalCountInWindow: number
): number {
  if (
    petalCountInWindow < DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_MIN_PETALS
  ) {
    return 0;
  }

  const petalsPastThreshold =
    petalCountInWindow - DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_MIN_PETALS;

  return Math.min(
    DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_CHANCE_CAP,
    DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_BASE_CHANCE +
      petalsPastThreshold *
        DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_CHANCE_PER_EXTRA_PETAL
  );
}

/** Records one raw flower chew and returns the escalated Petal Sickness chance. */
export function recordingWorldPlazaFlowerPetalConsumption(
  worldEpochMs: number
): {
  readonly petalCountInWindow: number;
  readonly petalSicknessChance: number;
} {
  const pruned = pruningWorldPlazaFlowerPetalConsumptionEats(worldEpochMs);
  pruned.push(worldEpochMs);
  managingWorldPlazaFlowerPetalConsumptionState.eatEpochMs = pruned;

  const petalCountInWindow = pruned.length;

  return {
    petalCountInWindow,
    petalSicknessChance:
      resolvingWorldPlazaFlowerPetalSicknessChance(petalCountInWindow),
  };
}

/** True when a new Petal Sickness contract is blocked by the 1-day post-clear lockout. */
export function checkingWorldPlazaFlowerPetalSicknessIsLockedOut(
  worldEpochMs: number
): boolean {
  return (
    worldEpochMs <
    managingWorldPlazaFlowerPetalConsumptionState.lockoutUntilEpochMs
  );
}

/**
 * Extends lockout so Petal Sickness cannot re-contract until 1 in-game day
 * after the stacked debuff ends.
 */
export function extendingWorldPlazaFlowerPetalSicknessLockout(
  debuffExpiresAtEpochMs: number
): void {
  managingWorldPlazaFlowerPetalConsumptionState.lockoutUntilEpochMs = Math.max(
    managingWorldPlazaFlowerPetalConsumptionState.lockoutUntilEpochMs,
    debuffExpiresAtEpochMs +
      DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_COOLDOWN_MS
  );
}

/**
 * Test helper: seeds the rolling window with `count` prior eats ending at
 * `worldEpochMs` so the next record reaches threshold quickly.
 */
export function seedingWorldPlazaFlowerPetalConsumptionForTests(
  worldEpochMs: number,
  count: number
): void {
  managingWorldPlazaFlowerPetalConsumptionState.eatEpochMs = Array.from(
    { length: Math.max(0, count) },
    (_, index) => worldEpochMs - (count - index)
  );
}

/** Test helper: clears session petal consumption + lockout. */
export function resettingWorldPlazaFlowerPetalConsumptionStoreForTests(): void {
  managingWorldPlazaFlowerPetalConsumptionState.eatEpochMs = [];
  managingWorldPlazaFlowerPetalConsumptionState.lockoutUntilEpochMs = 0;
}
