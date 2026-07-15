/**
 * @vitest-environment node
 */

import { WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';
import { computingWildlifeInstanceDefenseMitigatedDamage } from '@/components/world/wildlife/domains/computingWildlifeInstanceDefenseMitigatedDamage';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { applyingWildlifePetSpritcoreUpgradePurchase } from '@/components/world/wildlife/pets/domains/applyingWildlifePetSpritcoreUpgradePurchase';
import {
  computingWildlifePetSpritcoreDefenseMaximum,
  computingWildlifePetSpritcoreMoveSpeedMaximum,
  computingWildlifePetSpritcoreUpgradeSteps,
} from '@/components/world/wildlife/pets/domains/computingWildlifePetSpritcoreUpgradeSteps';
import { resolvingWildlifePetSpritcoreUpgradeOffers } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetSpritcoreUpgradeOffers';
import { describe, expect, it } from 'vitest';
import { parsingPlazaSinglePlayerSavePetRecord } from '../../../../../shared/parsingPlazaSinglePlayerSavePetRoster';

describe('computingWildlifePetSpritcoreUpgradeSteps', () => {
  it('floors tiny species at +1 and uses 10% of larger natural stats', () => {
    expect(computingWildlifePetSpritcoreUpgradeSteps(8, 1)).toEqual({
      healthStep: 1,
      damageStep: 1,
      attackSpeedStep: 0.05,
      defenseStep: 0,
      moveSpeedStep: 0.05,
    });
    expect(computingWildlifePetSpritcoreUpgradeSteps(100, 20, 14)).toEqual({
      healthStep: 10,
      damageStep: 2,
      attackSpeedStep: 0.05,
      defenseStep: 1,
      moveSpeedStep: 0.05,
    });
  });
});

describe('computingWildlifePetSpritcoreDefenseMaximum', () => {
  it('caps Defense at 5× natural with at least one step headroom', () => {
    expect(computingWildlifePetSpritcoreDefenseMaximum(10, 1)).toBe(50);
    expect(computingWildlifePetSpritcoreDefenseMaximum(0, 1)).toBe(0);
  });
});

describe('computingWildlifePetSpritcoreMoveSpeedMaximum', () => {
  it('caps run speed at 2× natural or 8 grid/s, whichever is lower', () => {
    expect(computingWildlifePetSpritcoreMoveSpeedMaximum(3)).toBe(6);
    expect(computingWildlifePetSpritcoreMoveSpeedMaximum(5)).toBe(8);
  });
});

describe('computingWildlifeInstanceDefenseMitigatedDamage', () => {
  it('leaves zero-defense hits unchanged', () => {
    expect(computingWildlifeInstanceDefenseMitigatedDamage(100, 0)).toBe(100);
  });

  it('halves damage at Defense 50 and softens high Defense further', () => {
    expect(computingWildlifeInstanceDefenseMitigatedDamage(100, 50)).toBe(50);
    expect(
      computingWildlifeInstanceDefenseMitigatedDamage(100, 70)
    ).toBeCloseTo(41.666, 2);
  });
});

describe('resolvingWildlifePetSpritcoreUpgradeOffers', () => {
  it('prices the first health step above zero for a small companion', () => {
    const offers = resolvingWildlifePetSpritcoreUpgradeOffers({
      bonuses: WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
      naturalMaxHealth: 50,
      naturalAttackPower: 10,
      naturalAttackSpeed: 1,
      naturalDefense: 6,
      naturalRunSpeed: 3.5,
    });

    expect(offers.health.step).toBe(5);
    expect(offers.health.currentValue).toBe(50);
    expect(offers.health.nextValue).toBe(55);
    expect(offers.health.price).toBeGreaterThan(0);
    expect(offers.damage.step).toBe(1);
    expect(offers.attackSpeed.isCapped).toBe(false);
    expect(offers.defense.step).toBe(1);
    expect(offers.defense.isCapped).toBe(false);
    expect(offers.moveSpeed.step).toBe(0.05);
    expect(offers.moveSpeed.isCapped).toBe(false);
  });

  it('caps defense when species natural Defense is zero', () => {
    const offers = resolvingWildlifePetSpritcoreUpgradeOffers({
      bonuses: WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
      naturalMaxHealth: 20,
      naturalAttackPower: 4,
      naturalAttackSpeed: 1,
      naturalDefense: 0,
      naturalRunSpeed: 2,
    });

    expect(offers.defense.isCapped).toBe(true);
    expect(offers.defense.price).toBe(0);
  });
});

describe('applyingWildlifePetSpritcoreUpgradePurchase', () => {
  it('applies a health purchase onto bond bonuses and live HP', () => {
    const instance = creatingWildlifeTestInstance({
      instanceId: 'wildlife:pet:upgrade',
      speciesId: 'shepherd-dog',
      petBond: {
        petId: 'pet-upgrade',
        ownerUserId: 'player-1',
        loyalty: 500,
        command: 'follow',
        learnedSkillIds: [],
        equippedSkillId: null,
        soulsaveConsumed: false,
        weaponItem: null,
        armorItem: null,
        isPersistent: true,
        spritcoreUpgrades: WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
      },
    });
    const naturalMaxHealth = instance.healthState.baseMaxHealth;
    const offers = resolvingWildlifePetSpritcoreUpgradeOffers({
      bonuses: WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
      naturalMaxHealth,
      naturalAttackPower: 10,
      naturalAttackSpeed: 1,
      naturalDefense: 4,
      naturalRunSpeed: 3,
    });
    const beforeHealth = instance.healthState.currentHealth;
    const result = applyingWildlifePetSpritcoreUpgradePurchase({
      instance,
      laneId: 'health',
      price: Math.ceil(offers.health.price),
      naturalMaxHealth,
      naturalAttackPower: 10,
      naturalAttackSpeed: 1,
      naturalDefense: 4,
      naturalRunSpeed: 3,
    });

    expect(result.status).toBe('applied');

    if (result.status !== 'applied') {
      return;
    }

    expect(result.bonuses.bonusMaxHealth).toBe(offers.health.step);
    expect(result.instance.healthState.baseMaxHealth).toBe(
      naturalMaxHealth + offers.health.step
    );
    expect(result.instance.healthState.currentHealth).toBe(
      beforeHealth + offers.health.step
    );
    expect(result.instance.petBond?.spritcoreUpgrades?.bonusMaxHealth).toBe(
      offers.health.step
    );
  });

  it('applies a defense purchase onto bond bonuses', () => {
    const instance = creatingWildlifeTestInstance({
      instanceId: 'wildlife:pet:defense',
      speciesId: 'shepherd-dog',
      petBond: {
        petId: 'pet-defense',
        ownerUserId: 'player-1',
        loyalty: 500,
        command: 'follow',
        learnedSkillIds: [],
        equippedSkillId: null,
        soulsaveConsumed: false,
        weaponItem: null,
        armorItem: null,
        isPersistent: true,
        spritcoreUpgrades: WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
      },
    });
    const offers = resolvingWildlifePetSpritcoreUpgradeOffers({
      bonuses: WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
      naturalMaxHealth: 100,
      naturalAttackPower: 10,
      naturalAttackSpeed: 1,
      naturalDefense: 10,
      naturalRunSpeed: 3,
    });
    const result = applyingWildlifePetSpritcoreUpgradePurchase({
      instance,
      laneId: 'defense',
      price: Math.ceil(offers.defense.price),
      naturalMaxHealth: 100,
      naturalAttackPower: 10,
      naturalAttackSpeed: 1,
      naturalDefense: 10,
      naturalRunSpeed: 3,
    });

    expect(result.status).toBe('applied');

    if (result.status !== 'applied') {
      return;
    }

    expect(result.bonuses.bonusDefense).toBe(offers.defense.step);
  });
});

describe('parsingPlazaSinglePlayerSavePetSpritcoreUpgrades', () => {
  it('defaults missing defense and move-speed bonuses to zero', () => {
    const parsed = parsingPlazaSinglePlayerSavePetRecord({
      petId: 'pet-1',
      speciesId: 'boar',
      loyalty: 100,
      isActive: false,
      command: 'follow',
      healthCurrent: 50,
      hungerRatio: 1,
      staminaRatio: 1,
      sizeScaleSample: 0,
      aggressionLevel: 'normal',
      weaponItem: null,
      armorItem: null,
      learnedSkillIds: [],
      equippedSkillId: null,
      soulsaveConsumed: false,
      hasNeglectedBadge: false,
      isNeglectHunting: false,
      spritcoreUpgrades: {
        bonusMaxHealth: 5,
        bonusAttackPower: 2,
        bonusAttackSpeed: 0.1,
        totalSpritcoreInvested: 40,
      },
      lastKnownX: null,
      lastKnownY: null,
      lastKnownLayer: null,
      deathCauseKind: null,
      acquiredAtMs: 1,
      updatedAtMs: 2,
    });

    expect(parsed?.spritcoreUpgrades).toEqual({
      bonusMaxHealth: 5,
      bonusAttackPower: 2,
      bonusAttackSpeed: 0.1,
      bonusDefense: 0,
      bonusMoveSpeed: 0,
      totalSpritcoreInvested: 40,
    });
  });
});
