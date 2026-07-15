import { formattingWorldPlazaProfilePanelAttackValueParts } from '@/components/world/domains/formattingWorldPlazaProfilePanelAttackValueParts';
import { describe, expect, it } from 'vitest';

describe('formattingWorldPlazaProfilePanelAttackValueParts', () => {
  it('returns base only when unarmed', () => {
    expect(formattingWorldPlazaProfilePanelAttackValueParts(100, 100)).toEqual({
      baseText: '100',
      bonusText: null,
      bonusTone: null,
    });
  });

  it('returns positive bonus for equipped weapon', () => {
    expect(formattingWorldPlazaProfilePanelAttackValueParts(100, 110)).toEqual({
      baseText: '100',
      bonusText: '+10',
      bonusTone: 'positive',
    });
  });

  it('returns negative bonus when weapon reduces EV', () => {
    expect(formattingWorldPlazaProfilePanelAttackValueParts(100, 90)).toEqual({
      baseText: '100',
      bonusText: '-10',
      bonusTone: 'negative',
    });
  });
});
