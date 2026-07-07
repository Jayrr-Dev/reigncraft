import { resolvingWorldPlazaGirlSampleRollDodgeActiveBuffHudEntry } from '@/components/world/domains/resolvingWorldPlazaGirlSampleRollDodgeActiveBuffHudEntry';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaGirlSampleRollDodgeActiveBuffHudEntry', () => {
  it('returns null when the avatar is not rolling', () => {
    expect(
      resolvingWorldPlazaGirlSampleRollDodgeActiveBuffHudEntry({
        isRolling: false,
      })
    ).toBeNull();
  });

  it('lists roll dodge with scaled physical mitigation copy', () => {
    expect(
      resolvingWorldPlazaGirlSampleRollDodgeActiveBuffHudEntry({
        isRolling: true,
      })
    ).toEqual({
      id: 'girl-sample-roll-dodge',
      label: 'Roll Dodge',
      description:
        '75-95% physical damage reduction while rolling (peaks mid-dodge). No stagger.',
      polarity: 'buff',
      icon: 'ph:person-simple-run',
      expiresAtMs: null,
    });
  });
});
