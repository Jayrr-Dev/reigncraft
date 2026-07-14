/**
 * Hunger loyalty decay, neglect-abandon hunt, and Neglected badge stamping.
 *
 * @module components/world/wildlife/pets/domains/applyingWildlifePetHungerLoyaltyNeglectTick
 */

import { COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { applyingWildlifePetLoyaltyGrant } from '@/components/world/wildlife/pets/domains/applyingWildlifePetLoyaltyGrant';
import { checkingWildlifePetNeglectAbandonDrive } from '@/components/world/wildlife/pets/domains/checkingWildlifePetNeglectAbandonDrive';
import { computingWildlifePetNeglectAbandonDeadlineMs } from '@/components/world/wildlife/pets/domains/computingWildlifePetNeglectAbandonDeadlineMs';
import { DEFINING_WILDLIFE_PET_HUNGER_LOYALTY_LOSS_PER_IN_GAME_HOUR } from '@/components/world/wildlife/pets/domains/definingWildlifePetHungerLoyaltyNeglectConstants';
import type { DefiningWildlifePetBondState } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';

export type ApplyingWildlifePetHungerLoyaltyNeglectTickParams = {
  instance: DefiningWildlifeInstance;
  ownerUserId: string | null;
  deltaSeconds: number;
  nowMs: number;
  /** Optional `[0, 1)` roll for deterministic abandon deadline tests. */
  abandonUnitSample?: number;
};

export type ApplyingWildlifePetHungerLoyaltyNeglectTickResult = {
  instance: DefiningWildlifeInstance;
  /** True the tick neglect abandon first stamped the Neglected badge + hunt. */
  didAbandonForFood: boolean;
  /** Whole loyalty points removed this tick after Neglected scaling. */
  loyaltyLost: number;
};

function resolvingWildlifePetHungerLoyaltyLossAccumulator(
  petBond: DefiningWildlifePetBondState
): number {
  const accumulator = petBond.hungerLoyaltyLossAccumulator ?? 0;

  if (!Number.isFinite(accumulator) || accumulator < 0) {
    return 0;
  }

  return accumulator;
}

/**
 * Continuous hunger → loyalty drain for the owner's bonded companion, plus
 * neglect abandon after 3–6 in-game hours at hungry/starving. Persistent pets
 * that abandon stamp Neglected and stop obeying follow commands to forage.
 */
export function applyingWildlifePetHungerLoyaltyNeglectTick({
  instance,
  ownerUserId,
  deltaSeconds,
  nowMs,
  abandonUnitSample,
}: ApplyingWildlifePetHungerLoyaltyNeglectTickParams): ApplyingWildlifePetHungerLoyaltyNeglectTickResult {
  const petBond = instance.petBond;

  if (
    !petBond ||
    instance.isDead ||
    !ownerUserId ||
    petBond.ownerUserId !== ownerUserId ||
    !Number.isFinite(deltaSeconds) ||
    deltaSeconds <= 0
  ) {
    return { instance, didAbandonForFood: false, loyaltyLost: 0 };
  }

  const driveLevel = instance.hungerState.driveLevel;
  const isAbandonHungry = checkingWildlifePetNeglectAbandonDrive(driveLevel);
  let nextBond: DefiningWildlifePetBondState = { ...petBond };
  let didAbandonForFood = false;

  // Continuous loyalty drain scales with hunger drive (peckish → starving).
  const lossPerInGameHour =
    DEFINING_WILDLIFE_PET_HUNGER_LOYALTY_LOSS_PER_IN_GAME_HOUR[driveLevel];
  let loyaltyLost = 0;

  if (lossPerInGameHour > 0) {
    const inGameHoursElapsed =
      (deltaSeconds * 1000) / COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS;
    const accumulator =
      resolvingWildlifePetHungerLoyaltyLossAccumulator(nextBond) +
      lossPerInGameHour * inGameHoursElapsed;
    const wholeLoss = Math.floor(accumulator);

    nextBond = {
      ...nextBond,
      hungerLoyaltyLossAccumulator: accumulator - wholeLoss,
    };

    if (wholeLoss > 0) {
      const loyaltyResult = applyingWildlifePetLoyaltyGrant(
        nextBond.loyalty,
        -wholeLoss,
        { hasNeglectedBadge: nextBond.hasNeglectedBadge === true }
      );
      loyaltyLost = Math.max(0, -loyaltyResult.granted);
      nextBond = {
        ...nextBond,
        loyalty: loyaltyResult.loyalty,
      };
    }
  }

  if (isAbandonHungry) {
    if (
      nextBond.neglectAbandonAtMs == null ||
      !Number.isFinite(nextBond.neglectAbandonAtMs)
    ) {
      nextBond = {
        ...nextBond,
        neglectAbandonAtMs: computingWildlifePetNeglectAbandonDeadlineMs(
          nowMs,
          abandonUnitSample ?? Math.random()
        ),
      };
    }

    const shouldAbandon =
      nextBond.isPersistent &&
      nextBond.isNeglectHunting !== true &&
      nextBond.neglectAbandonAtMs != null &&
      nowMs >= nextBond.neglectAbandonAtMs;

    if (shouldAbandon) {
      didAbandonForFood = true;
      nextBond = {
        ...nextBond,
        hasNeglectedBadge: true,
        isNeglectHunting: true,
        // Clear so a later hunger recovery + relapse rolls a fresh window.
        neglectAbandonAtMs: null,
      };
    }
  } else {
    // Left hungry/starving: stop the leave clock and allow command follow again.
    nextBond = {
      ...nextBond,
      neglectAbandonAtMs: null,
      isNeglectHunting: false,
    };
  }

  const bondUnchanged =
    nextBond.loyalty === petBond.loyalty &&
    (nextBond.hasNeglectedBadge === true) ===
      (petBond.hasNeglectedBadge === true) &&
    (nextBond.isNeglectHunting === true) ===
      (petBond.isNeglectHunting === true) &&
    (nextBond.neglectAbandonAtMs ?? null) ===
      (petBond.neglectAbandonAtMs ?? null) &&
    resolvingWildlifePetHungerLoyaltyLossAccumulator(nextBond) ===
      resolvingWildlifePetHungerLoyaltyLossAccumulator(petBond);

  if (bondUnchanged && !didAbandonForFood) {
    return { instance, didAbandonForFood: false, loyaltyLost: 0 };
  }

  if (!didAbandonForFood) {
    return {
      instance: {
        ...instance,
        petBond: nextBond,
      },
      didAbandonForFood: false,
      loyaltyLost,
    };
  }

  // Leave the owner trail so the species BT can forage / hunt for food.
  return {
    instance: {
      ...instance,
      petBond: nextBond,
      aiState: {
        ...instance.aiState,
        intent: { mode: 'idle' },
        docileFollowUntilMs: null,
        steeringCache: null,
      },
    },
    didAbandonForFood: true,
    loyaltyLost,
  };
}
