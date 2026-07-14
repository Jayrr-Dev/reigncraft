import { COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { applyingWildlifePetHungerLoyaltyNeglectTick } from '@/components/world/wildlife/pets/domains/applyingWildlifePetHungerLoyaltyNeglectTick';
import { applyingWildlifePetLoyaltyGrant } from '@/components/world/wildlife/pets/domains/applyingWildlifePetLoyaltyGrant';
import { computingWildlifePetNeglectAbandonDeadlineMs } from '@/components/world/wildlife/pets/domains/computingWildlifePetNeglectAbandonDeadlineMs';
import { DEFINING_WILDLIFE_PET_HUNGER_LOYALTY_LOSS_PER_IN_GAME_HOUR } from '@/components/world/wildlife/pets/domains/definingWildlifePetHungerLoyaltyNeglectConstants';
import { DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT } from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import type { DefiningWildlifePetBondState } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { resolvingWildlifePetLoyaltyDeltaWithNeglectedBadge } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyDeltaWithNeglectedBadge';
import { describe, expect, it } from 'vitest';

function buildingPetBond(
  overrides: Partial<DefiningWildlifePetBondState> = {}
): DefiningWildlifePetBondState {
  return {
    petId: 'pet-neglect',
    ownerUserId: 'player-1',
    loyalty: 200,
    command: 'follow',
    learnedSkillIds: [],
    equippedSkillId: null,
    soulsaveConsumed: false,
    weaponItem: null,
    armorItem: null,
    isPersistent: true,
    stayPoint: null,
    hasNeglectedBadge: false,
    isNeglectHunting: false,
    neglectAbandonAtMs: null,
    hungerLoyaltyLossAccumulator: 0,
    ...overrides,
  };
}

describe('resolvingWildlifePetLoyaltyDeltaWithNeglectedBadge', () => {
  it('halves gains and worsens losses while Neglected', () => {
    expect(resolvingWildlifePetLoyaltyDeltaWithNeglectedBadge(16, true)).toBe(
      8
    );
    expect(resolvingWildlifePetLoyaltyDeltaWithNeglectedBadge(-10, true)).toBe(
      -15
    );
    expect(resolvingWildlifePetLoyaltyDeltaWithNeglectedBadge(17, false)).toBe(
      17
    );
  });
});

describe('applyingWildlifePetLoyaltyGrant neglected badge', () => {
  it('applies Neglected multipliers on grant and loss', () => {
    const gain = applyingWildlifePetLoyaltyGrant(
      100,
      DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT,
      { hasNeglectedBadge: true }
    );
    expect(gain.granted).toBe(
      Math.round(DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT * 0.5)
    );

    const loss = applyingWildlifePetLoyaltyGrant(100, -10, {
      hasNeglectedBadge: true,
    });
    expect(loss.granted).toBe(-15);
    expect(loss.loyalty).toBe(85);
  });
});

describe('computingWildlifePetNeglectAbandonDeadlineMs', () => {
  it('rolls between 3 and 6 in-game hours', () => {
    const nowMs = 10_000;
    const minDeadline = computingWildlifePetNeglectAbandonDeadlineMs(nowMs, 0);
    const maxDeadline = computingWildlifePetNeglectAbandonDeadlineMs(nowMs, 1);

    expect(minDeadline - nowMs).toBe(3 * COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS);
    expect(maxDeadline - nowMs).toBe(6 * COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS);
  });
});

describe('applyingWildlifePetHungerLoyaltyNeglectTick', () => {
  it('drains loyalty faster at higher hunger drives', () => {
    const oneInGameHourSeconds = COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS / 1000;

    const peckish = applyingWildlifePetHungerLoyaltyNeglectTick({
      instance: creatingWildlifeTestInstance({
        hungerState: {
          hungerRatio: 0.6,
          driveLevel: 'peckish',
          lastFedAtMs: 0,
        },
        petBond: buildingPetBond({ loyalty: 200 }),
      }),
      ownerUserId: 'player-1',
      deltaSeconds: oneInGameHourSeconds,
      nowMs: 1_000,
    });
    expect(peckish.loyaltyLost).toBe(
      DEFINING_WILDLIFE_PET_HUNGER_LOYALTY_LOSS_PER_IN_GAME_HOUR.peckish
    );
    expect(peckish.instance.petBond?.loyalty).toBe(
      200 - DEFINING_WILDLIFE_PET_HUNGER_LOYALTY_LOSS_PER_IN_GAME_HOUR.peckish
    );

    const starving = applyingWildlifePetHungerLoyaltyNeglectTick({
      instance: creatingWildlifeTestInstance({
        hungerState: {
          hungerRatio: 0.05,
          driveLevel: 'starving',
          lastFedAtMs: 0,
        },
        petBond: buildingPetBond({ loyalty: 200 }),
      }),
      ownerUserId: 'player-1',
      deltaSeconds: oneInGameHourSeconds,
      nowMs: 1_000,
    });
    expect(starving.loyaltyLost).toBe(
      DEFINING_WILDLIFE_PET_HUNGER_LOYALTY_LOSS_PER_IN_GAME_HOUR.starving
    );
  });

  it('abandons after the hungry deadline and stamps Neglected', () => {
    const result = applyingWildlifePetHungerLoyaltyNeglectTick({
      instance: creatingWildlifeTestInstance({
        hungerState: {
          hungerRatio: 0.2,
          driveLevel: 'hungry',
          lastFedAtMs: 0,
        },
        petBond: buildingPetBond({
          loyalty: 200,
          neglectAbandonAtMs: 5_000,
        }),
        aiState: {
          ...creatingWildlifeTestInstance().aiState,
          intent: {
            mode: 'followPlayer',
            targetInstanceId: 'player-1',
            targetPoint: { x: 1, y: 1, layer: 1 },
          },
          docileFollowUntilMs: 99_000,
        },
      }),
      ownerUserId: 'player-1',
      deltaSeconds: 1,
      nowMs: 5_000,
      abandonUnitSample: 0,
    });

    expect(result.didAbandonForFood).toBe(true);
    expect(result.instance.petBond?.hasNeglectedBadge).toBe(true);
    expect(result.instance.petBond?.isNeglectHunting).toBe(true);
    expect(result.instance.aiState.intent.mode).toBe('idle');
    expect(result.instance.aiState.docileFollowUntilMs).toBeNull();
  });

  it('worsens hunger loyalty loss while Neglected', () => {
    const oneInGameHourSeconds = COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS / 1000;
    const result = applyingWildlifePetHungerLoyaltyNeglectTick({
      instance: creatingWildlifeTestInstance({
        hungerState: {
          hungerRatio: 0.2,
          driveLevel: 'hungry',
          lastFedAtMs: 0,
        },
        petBond: buildingPetBond({
          loyalty: 200,
          hasNeglectedBadge: true,
          neglectAbandonAtMs: 1_000_000,
        }),
      }),
      ownerUserId: 'player-1',
      deltaSeconds: oneInGameHourSeconds,
      nowMs: 1_000,
    });

    const baseLoss =
      DEFINING_WILDLIFE_PET_HUNGER_LOYALTY_LOSS_PER_IN_GAME_HOUR.hungry;
    expect(result.loyaltyLost).toBe(Math.round(baseLoss * 1.5));
  });

  it('clears hunting when hunger recovers above hungry', () => {
    const result = applyingWildlifePetHungerLoyaltyNeglectTick({
      instance: creatingWildlifeTestInstance({
        hungerState: {
          hungerRatio: 0.9,
          driveLevel: 'sated',
          lastFedAtMs: 0,
        },
        petBond: buildingPetBond({
          hasNeglectedBadge: true,
          isNeglectHunting: true,
          neglectAbandonAtMs: 9_000,
        }),
      }),
      ownerUserId: 'player-1',
      deltaSeconds: 1,
      nowMs: 1_000,
    });

    expect(result.instance.petBond?.isNeglectHunting).toBe(false);
    expect(result.instance.petBond?.neglectAbandonAtMs).toBeNull();
    expect(result.instance.petBond?.hasNeglectedBadge).toBe(true);
  });
});
