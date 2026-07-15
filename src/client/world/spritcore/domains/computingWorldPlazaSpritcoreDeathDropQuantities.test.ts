import { describe, expect, it } from 'vitest';

import { computingWorldPlazaSpritcoreDeathCommittedPenalty } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreDeathCommittedPenalty';
import { computingWorldPlazaSpritcoreDeathDropQuantities } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreDeathDropQuantities';

describe('computingWorldPlazaSpritcoreDeathDropQuantities', () => {
  it('spills 20% carried and 10% committed', () => {
    expect(computingWorldPlazaSpritcoreDeathDropQuantities(100, 200)).toEqual({
      carriedDropQuantity: 20,
      committedDropQuantity: 20,
      totalDropQuantity: 40,
    });
  });

  it('floors fractional spills and ignores non-positive balances', () => {
    expect(computingWorldPlazaSpritcoreDeathDropQuantities(4, 9)).toEqual({
      carriedDropQuantity: 0,
      committedDropQuantity: 0,
      totalDropQuantity: 0,
    });
    expect(
      computingWorldPlazaSpritcoreDeathDropQuantities(-10, Number.NaN)
    ).toEqual({
      carriedDropQuantity: 0,
      committedDropQuantity: 0,
      totalDropQuantity: 0,
    });
  });
});

describe('computingWorldPlazaSpritcoreDeathCommittedPenalty', () => {
  it('scales bonuses and invested spend by the committed drop fraction', () => {
    const result = computingWorldPlazaSpritcoreDeathCommittedPenalty({
      bonusMaxHealth: 1000,
      bonusAttackPower: 100,
      bonusAttackSpeed: 0.5,
      bonusDefense: 0,
      bonusMoveSpeed: 0,
      totalSpritcoreInvested: 1000,
    });

    expect(result.droppedQuantity).toBe(100);
    expect(result.nextBonuses).toEqual({
      bonusMaxHealth: 900,
      bonusAttackPower: 90,
      bonusAttackSpeed: 0.45,
      bonusDefense: 0,
      bonusMoveSpeed: 0,
      totalSpritcoreInvested: 900,
    });
  });

  it('no-ops when invested spill floors to zero', () => {
    const bonuses = {
      bonusMaxHealth: 100,
      bonusAttackPower: 10,
      bonusAttackSpeed: 0.05,
      bonusDefense: 0,
      bonusMoveSpeed: 0,
      totalSpritcoreInvested: 9,
    };

    expect(computingWorldPlazaSpritcoreDeathCommittedPenalty(bonuses)).toEqual({
      nextBonuses: bonuses,
      droppedQuantity: 0,
    });
  });
});
