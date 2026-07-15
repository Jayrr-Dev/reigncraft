import { computingWorldPlazaSpritcoreCombatPower } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreCombatPower';
import { computingWorldPlazaSpritcoreDisplayLevel } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreDisplayLevel';
import {
  computingWorldPlazaSpritcoreEquivalentValue,
  computingWorldPlazaSpritcoreStatFromEquivalentValue,
} from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreEquivalentValue';
import {
  computingWorldPlazaSpritcoreMonsterCombatValue,
  computingWorldPlazaSpritcoreMonsterDrop,
} from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreMonsterDrop';
import {
  computingWorldPlazaSpritcoreHealthUpgradePrice,
  computingWorldPlazaSpritcoreOffensiveUpgradePrice,
} from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreUpgradePrice';
import {
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_DPS,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_HP,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_DPS,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_HP,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';
import { resolvingWorldPlazaSpritcoreMonsterAttacksPerSecond } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreMonsterAttacksPerSecond';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaSpritcoreEquivalentValue', () => {
  it('round-trips health through the inverse curve', () => {
    const spiritcoreValue = computingWorldPlazaSpritcoreEquivalentValue(
      20_000,
      DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_HP,
      DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_HP
    );

    expect(spiritcoreValue).toBeCloseTo(11_875, 5);
    expect(
      computingWorldPlazaSpritcoreStatFromEquivalentValue(
        spiritcoreValue,
        DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_HP,
        DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_HP
      )
    ).toBeCloseTo(20_000, 5);
  });

  it('prices 10,000 HP to 20,000 HP at 6,875 SC', () => {
    const price = computingWorldPlazaSpritcoreHealthUpgradePrice(
      10_000,
      10_000
    );

    expect(price).toBeCloseTo(6_875, 5);
  });
});

describe('computingWorldPlazaSpritcoreOffensiveUpgradePrice', () => {
  it('prices combined damage and speed through multiplied DPS', () => {
    const combinedPrice = computingWorldPlazaSpritcoreOffensiveUpgradePrice(
      300,
      1,
      10,
      0.05
    );
    const damageOnlyPrice = computingWorldPlazaSpritcoreOffensiveUpgradePrice(
      300,
      1,
      10,
      0
    );
    const speedOnlyPrice = computingWorldPlazaSpritcoreOffensiveUpgradePrice(
      300,
      1,
      0,
      0.05
    );

    expect(combinedPrice).toBeGreaterThan(damageOnlyPrice);
    expect(combinedPrice).toBeGreaterThan(speedOnlyPrice);
    expect(combinedPrice).not.toBe(damageOnlyPrice + speedOnlyPrice);
  });
});

describe('computingWorldPlazaSpritcoreCombatPower', () => {
  it('returns 1 for the starting character and 40 for the doc monster example', () => {
    expect(computingWorldPlazaSpritcoreCombatPower(1_000, 300, 1)).toBeCloseTo(
      1,
      5
    );
    expect(computingWorldPlazaSpritcoreCombatPower(5_000, 500, 2)).toBeCloseTo(
      16.666666666666668,
      5
    );
    expect(computingWorldPlazaSpritcoreCombatPower(20_000, 300, 1)).toBeCloseTo(
      20,
      5
    );
  });
});

describe('computingWorldPlazaSpritcoreDisplayLevel', () => {
  it('maps combat power to max(1, floor(P))', () => {
    expect(computingWorldPlazaSpritcoreDisplayLevel(1_000, 300, 1)).toBe(1);
    expect(computingWorldPlazaSpritcoreDisplayLevel(20_000, 300, 1)).toBe(20);
    expect(computingWorldPlazaSpritcoreDisplayLevel(5_000, 500, 2)).toBe(16);
    expect(computingWorldPlazaSpritcoreDisplayLevel(500, 150, 1)).toBe(1);
  });
});

describe('resolvingWorldPlazaSpritcoreWildlifeDrop', () => {
  it('drops 80 SC for the calibrated baseline monster profile', () => {
    const drop = computingWorldPlazaSpritcoreMonsterCombatValue(1_000, 300, 1);

    expect(drop).toBeCloseTo(1_600, 5);
    expect(Math.round(drop * 0.05)).toBe(80);
  });

  it('matches scaled wildlife vitals at the x10 combat scale', () => {
    const chickenDrop = computingWorldPlazaSpritcoreMonsterDrop(
      150,
      10,
      resolvingWorldPlazaSpritcoreMonsterAttacksPerSecond(1_000)
    );
    const greyWolfDrop = computingWorldPlazaSpritcoreMonsterDrop(
      450,
      140,
      resolvingWorldPlazaSpritcoreMonsterAttacksPerSecond(900)
    );
    const grizzlyDrop = computingWorldPlazaSpritcoreMonsterDrop(
      2_800,
      520,
      resolvingWorldPlazaSpritcoreMonsterAttacksPerSecond(1_500)
    );

    expect(chickenDrop).toBe(7);
    expect(greyWolfDrop).toBe(33);
    expect(grizzlyDrop).toBe(144);
  });

  it('uses the global attack-speed scale for wildlife APS', () => {
    const attacksPerSecond =
      resolvingWorldPlazaSpritcoreMonsterAttacksPerSecond(1_000);

    expect(attacksPerSecond).toBeCloseTo(0.7, 5);
  });
});

describe('computingWorldPlazaSpritcoreEquivalentValue caps', () => {
  it('returns 0 at base and infinity at max', () => {
    expect(
      computingWorldPlazaSpritcoreEquivalentValue(
        DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_DPS,
        DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_DPS,
        DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_DPS
      )
    ).toBe(0);
    expect(
      computingWorldPlazaSpritcoreEquivalentValue(
        DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_DPS,
        DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_DPS,
        DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_DPS
      )
    ).toBe(Number.POSITIVE_INFINITY);
  });
});
