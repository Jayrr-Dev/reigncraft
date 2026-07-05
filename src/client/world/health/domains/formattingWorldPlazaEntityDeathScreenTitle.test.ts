import { formattingWorldPlazaEntityDeathScreenTitle } from '@/components/world/health/domains/formattingWorldPlazaEntityDeathScreenTitle';
import { describe, expect, it } from 'vitest';

describe('formattingWorldPlazaEntityDeathScreenTitle', () => {
  it('returns damage-type-specific titles', () => {
    expect(formattingWorldPlazaEntityDeathScreenTitle('physical')).toBe(
      'YOU DIED'
    );
    expect(formattingWorldPlazaEntityDeathScreenTitle('fall')).toBe('YOU FELL');
    expect(
      formattingWorldPlazaEntityDeathScreenTitle('environmental_lava')
    ).toBe('YOU BURNED');
    expect(
      formattingWorldPlazaEntityDeathScreenTitle('environmental_cold')
    ).toBe('YOU FROZE');
    expect(formattingWorldPlazaEntityDeathScreenTitle('toxic')).toBe(
      'YOU WERE POISONED'
    );
    expect(formattingWorldPlazaEntityDeathScreenTitle('venomous')).toBe(
      'VENOM KILLED YOU'
    );
    expect(formattingWorldPlazaEntityDeathScreenTitle('lethal')).toBe(
      'LETHAL POISON'
    );
    expect(formattingWorldPlazaEntityDeathScreenTitle('bleeding')).toBe(
      'YOU BLED OUT'
    );
    expect(formattingWorldPlazaEntityDeathScreenTitle('hemorrhaging')).toBe(
      'YOU HEMORRHAGED'
    );
    expect(formattingWorldPlazaEntityDeathScreenTitle('exsanguinating')).toBe(
      'YOU EXSANGUINATED'
    );
    expect(formattingWorldPlazaEntityDeathScreenTitle('potential_damage')).toBe(
      'YOU WERE BLASTED'
    );
  });

  it('falls back to YOU DIED when the killing source is unknown', () => {
    expect(formattingWorldPlazaEntityDeathScreenTitle(null)).toBe('YOU DIED');
    expect(formattingWorldPlazaEntityDeathScreenTitle(undefined)).toBe(
      'YOU DIED'
    );
  });
});
