import { formattingWorldPlazaProfilePanelAttackValueText } from '@/components/world/domains/formattingWorldPlazaProfilePanelAttackValueText';
import { describe, expect, it } from 'vitest';

describe('formattingWorldPlazaProfilePanelAttackValueText', () => {
  it('shows base only when unarmed', () => {
    expect(formattingWorldPlazaProfilePanelAttackValueText(100, 100)).toBe(
      '100'
    );
  });

  it('shows base + bonus for equipped weapon', () => {
    expect(formattingWorldPlazaProfilePanelAttackValueText(100, 135)).toBe(
      '100 +35'
    );
  });

  it('shows negative bonus when weapon reduces EV', () => {
    expect(formattingWorldPlazaProfilePanelAttackValueText(100, 90)).toBe(
      '100 -10'
    );
  });
});
