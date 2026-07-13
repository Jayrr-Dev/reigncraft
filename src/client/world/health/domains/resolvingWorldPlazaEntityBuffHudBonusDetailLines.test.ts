import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import { resolvingWorldPlazaEntityBuffHudBonusDetailLines } from '@/components/world/health/domains/resolvingWorldPlazaEntityBuffHudBonusDetailLines';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaEntityBuffHudBonusDetailLines', () => {
  it('formats Comfort Food stamina regen bonus', () => {
    const descriptor = resolvingWorldPlazaEntityBuffDescriptor(
      'well-fed-comfort-buff'
    );
    if (descriptor === null) {
      throw new Error('expected well-fed-comfort-buff descriptor');
    }

    expect(
      resolvingWorldPlazaEntityBuffHudBonusDetailLines(descriptor.effect)
    ).toEqual(['Stamina regen ×1.2']);
  });

  it('formats Fleet Footed move speed bonus', () => {
    const descriptor = resolvingWorldPlazaEntityBuffDescriptor(
      'well-fed-fleet-buff'
    );
    if (descriptor === null) {
      throw new Error('expected well-fed-fleet-buff descriptor');
    }

    expect(
      resolvingWorldPlazaEntityBuffHudBonusDetailLines(descriptor.effect)
    ).toEqual(['Move speed ×1.2']);
  });

  it('formats Hearty Meal temporary max HP bonus', () => {
    const descriptor = resolvingWorldPlazaEntityBuffDescriptor(
      'well-fed-hearty-buff'
    );
    if (descriptor === null) {
      throw new Error('expected well-fed-hearty-buff descriptor');
    }

    expect(
      resolvingWorldPlazaEntityBuffHudBonusDetailLines(descriptor.effect)
    ).toEqual(['+80 temp max HP']);
  });

  it('formats Omega Skew roll modifiers as separate lines', () => {
    const descriptor = resolvingWorldPlazaEntityBuffDescriptor(
      'well-fed-omega-skew-buff'
    );
    if (descriptor === null) {
      throw new Error('expected well-fed-omega-skew-buff descriptor');
    }

    expect(
      resolvingWorldPlazaEntityBuffHudBonusDetailLines(descriptor.effect)
    ).toEqual(['Luck +0.5', 'Crit bias +1']);
  });
});
