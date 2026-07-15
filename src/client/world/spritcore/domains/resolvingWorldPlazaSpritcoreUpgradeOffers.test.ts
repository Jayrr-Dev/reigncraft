/**
 * @vitest-environment node
 */

import { computingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/computingWorldPlazaCharacterEngineDerivedStats';
import { resolvingWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/registeringWorldPlazaCharacterEngineDefinitions';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import {
  computingWorldPlazaSpritcoreDefenseUpgradePrice,
  computingWorldPlazaSpritcoreMoveSpeedUpgradePrice,
} from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreUpgradePrice';
import {
  computingWorldPlazaSpritcoreDefenseMaximum,
  computingWorldPlazaSpritcoreMoveSpeedMaximum,
  computingWorldPlazaSpritcoreUpgradeSteps,
} from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreUpgradeSteps';
import { WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';
import {
  applyingWorldPlazaSpritcoreUpgradePurchase,
  gettingWorldPlazaSpritcoreUpgradeSnapshot,
  resettingWorldPlazaSpritcoreUpgradeStoreForTests,
} from '@/components/world/spritcore/domains/managingWorldPlazaSpritcoreUpgradeStore';
import { resolvingWorldPlazaSpritcoreUpgradeOffers } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreUpgradeOffers';
import { computingWildlifeInstanceDefenseMitigatedDamage } from '@/components/world/wildlife/domains/computingWildlifeInstanceDefenseMitigatedDamage';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaSpritcoreUpgradeSteps', () => {
  it('uses 10% defense steps and fixed move-speed steps for Girl baseline', () => {
    expect(computingWorldPlazaSpritcoreUpgradeSteps(5)).toEqual({
      defenseStep: 1,
      moveSpeedStep: 0.05,
    });
    expect(computingWorldPlazaSpritcoreDefenseMaximum(5, 1)).toBe(25);
    expect(computingWorldPlazaSpritcoreMoveSpeedMaximum(3)).toBe(6);
  });
});

describe('resolvingWorldPlazaSpritcoreUpgradeOffers', () => {
  it('exposes defense and move-speed offers for the Girl baseline', () => {
    const girl = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
    const natural = computingWorldPlazaCharacterEngineDerivedStats(
      girl,
      WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES
    );
    const offers = resolvingWorldPlazaSpritcoreUpgradeOffers({
      bonuses: WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
      effectiveMaxHealth: natural.effectiveMaxHealth,
      attackPower: natural.attackPower,
      nominalAttackSpeed: girl.stats.attackSpeed,
      naturalDefense: natural.defense,
      naturalRunSpeed: natural.runSpeedGridPerSecond,
    });

    expect(offers.defense.currentValue).toBe(5);
    expect(offers.defense.nextValue).toBe(6);
    expect(offers.defense.price).toBeGreaterThan(10);
    expect(offers.defense.price).toBeLessThan(120);
    expect(offers.moveSpeed.currentValue).toBeCloseTo(3, 5);
    expect(offers.moveSpeed.price).toBeGreaterThan(5);
    expect(offers.moveSpeed.price).toBeLessThan(80);
    expect(offers.moveSpeed.isCapped).toBe(false);
  });

  it('caps defense offers when natural Defense is zero', () => {
    const offers = resolvingWorldPlazaSpritcoreUpgradeOffers({
      bonuses: WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
      effectiveMaxHealth: 1000,
      attackPower: 300,
      nominalAttackSpeed: 1,
      naturalDefense: 0,
      naturalRunSpeed: 3,
    });

    expect(offers.defense.isCapped).toBe(true);
    expect(offers.defense.price).toBe(0);
  });
});

describe('applyingWorldPlazaSpritcoreUpgradePurchase', () => {
  it('applies defense and move-speed purchases', () => {
    resettingWorldPlazaSpritcoreUpgradeStoreForTests();
    const context = {
      nominalAttackSpeed: 1,
      naturalDefense: 5,
      naturalRunSpeed: 3,
    };
    const offers = resolvingWorldPlazaSpritcoreUpgradeOffers({
      bonuses: WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
      effectiveMaxHealth: 1000,
      attackPower: 300,
      nominalAttackSpeed: 1,
      naturalDefense: 5,
      naturalRunSpeed: 3,
    });

    expect(
      applyingWorldPlazaSpritcoreUpgradePurchase(
        'defense',
        Math.ceil(offers.defense.price),
        context
      )
    ).toBe('applied');
    expect(gettingWorldPlazaSpritcoreUpgradeSnapshot().bonusDefense).toBe(1);

    expect(
      applyingWorldPlazaSpritcoreUpgradePurchase(
        'moveSpeed',
        Math.ceil(offers.moveSpeed.price),
        context
      )
    ).toBe('applied');
    expect(gettingWorldPlazaSpritcoreUpgradeSnapshot().bonusMoveSpeed).toBe(
      0.05
    );
  });
});

describe('computingWorldPlazaCharacterEngineDerivedStats', () => {
  it('applies Spritcore defense and move-speed bonuses', () => {
    const girl = resolvingWorldPlazaCharacterEngineDefinition(
      DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
    );
    const derived = computingWorldPlazaCharacterEngineDerivedStats(girl, {
      ...WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
      bonusDefense: 5,
      bonusMoveSpeed: 0.5,
    });

    expect(derived.defense).toBe(10);
    expect(derived.runSpeedGridPerSecond).toBeCloseTo(3.5, 5);
    expect(derived.walkSpeedGridPerSecond).toBeCloseTo(2.333, 2);
  });
});

describe('computingWorldPlazaSpritcoreDefenseUpgradePrice', () => {
  it('prices defense toward the hard cap', () => {
    const steps = computingWorldPlazaSpritcoreUpgradeSteps(5);
    const maximum = computingWorldPlazaSpritcoreDefenseMaximum(
      5,
      steps.defenseStep
    );
    const price = computingWorldPlazaSpritcoreDefenseUpgradePrice(
      5,
      5,
      steps.defenseStep,
      maximum
    );

    expect(price).toBeGreaterThan(0);
  });

  it('prices move speed toward the hard cap', () => {
    const steps = computingWorldPlazaSpritcoreUpgradeSteps(5);
    const maximum = computingWorldPlazaSpritcoreMoveSpeedMaximum(3);
    const price = computingWorldPlazaSpritcoreMoveSpeedUpgradePrice(
      3,
      3,
      steps.moveSpeedStep,
      maximum
    );

    expect(price).toBeGreaterThan(0);
  });
});

describe('computingWildlifeInstanceDefenseMitigatedDamage', () => {
  it('halves physical damage at Defense 50 for player mitigation reuse', () => {
    expect(computingWildlifeInstanceDefenseMitigatedDamage(100, 50)).toBe(50);
    expect(
      computingWildlifeInstanceDefenseMitigatedDamage(100, 25)
    ).toBeCloseTo(66.666, 2);
  });
});
