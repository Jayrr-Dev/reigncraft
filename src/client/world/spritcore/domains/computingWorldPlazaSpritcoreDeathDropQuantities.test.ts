import { describe, expect, it } from 'vitest';

import { computingWorldPlazaSpritcoreDeathCommittedPenalty } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreDeathCommittedPenalty';
import { computingWorldPlazaSpritcoreDeathDropQuantities } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreDeathDropQuantities';

describe('computingWorldPlazaSpritcoreDeathDropQuantities', () => {
  it('spills 12% carried and 8% committed', () => {
    expect(computingWorldPlazaSpritcoreDeathDropQuantities(100, 200)).toEqual({
      carriedDropQuantity: 12,
      committedDropQuantity: 16,
      totalDropQuantity: 28,
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

    expect(result.droppedQuantity).toBe(80);
    expect(result.nextBonuses).toEqual({
      bonusMaxHealth: 920,
      bonusAttackPower: 92,
      bonusAttackSpeed: 0.46,
      bonusDefense: 0,
      bonusMoveSpeed: 0,
      totalSpritcoreInvested: 920,
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
