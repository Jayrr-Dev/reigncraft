import { describe, expect, it } from 'vitest';
import { computingWorldPlazaEaseInCubic } from '@/components/world/domains/computingWorldPlazaEasing';
import { resolvingWorldPlazaCyrobornScalePulseMultiplier } from '@/components/world/domains/resolvingWorldPlazaCyrobornScalePulseMultiplier';

describe('resolvingWorldPlazaCyrobornScalePulseMultiplier', () => {
  it('returns rest scale for non-cyroborn skins', () => {
    expect(
      resolvingWorldPlazaCyrobornScalePulseMultiplier({
        skinId: 'girl-sample',
        jumpProgress: 0.5,
        attackProgress: 0.5,
        deathProgress: 0.5,
      })
    ).toEqual({ scaleMultiplier: 1, hideBody: false });
  });

  it('shrinks mid-jump and returns to rest at ends', () => {
    const start = resolvingWorldPlazaCyrobornScalePulseMultiplier({
      skinId: 'cyroborn',
      jumpProgress: 0,
      attackProgress: null,
      deathProgress: null,
    });
    const mid = resolvingWorldPlazaCyrobornScalePulseMultiplier({
      skinId: 'cyroborn',
      jumpProgress: 0.5,
      attackProgress: null,
      deathProgress: null,
    });
    const end = resolvingWorldPlazaCyrobornScalePulseMultiplier({
      skinId: 'cyroborn',
      jumpProgress: 1,
      attackProgress: null,
      deathProgress: null,
    });

    expect(start.scaleMultiplier).toBeCloseTo(1, 5);
    expect(mid.scaleMultiplier).toBeLessThan(1);
    expect(end.scaleMultiplier).toBeCloseTo(1, 5);
  });

  it('grows mid-attack then settles', () => {
    const start = resolvingWorldPlazaCyrobornScalePulseMultiplier({
      skinId: 'cyroborn',
      jumpProgress: null,
      attackProgress: 0,
      deathProgress: null,
    });
    const mid = resolvingWorldPlazaCyrobornScalePulseMultiplier({
      skinId: 'cyroborn',
      jumpProgress: null,
      attackProgress: 0.5,
      deathProgress: null,
    });
    const end = resolvingWorldPlazaCyrobornScalePulseMultiplier({
      skinId: 'cyroborn',
      jumpProgress: null,
      attackProgress: 1,
      deathProgress: null,
    });

    expect(start.scaleMultiplier).toBeCloseTo(1, 5);
    expect(mid.scaleMultiplier).toBeGreaterThan(1);
    expect(end.scaleMultiplier).toBeCloseTo(1, 5);
  });

  it('implodes to nothing on death with ease-in cubic', () => {
    const start = resolvingWorldPlazaCyrobornScalePulseMultiplier({
      skinId: 'cyroborn',
      jumpProgress: 0.5,
      attackProgress: 0.5,
      deathProgress: 0,
    });
    const mid = resolvingWorldPlazaCyrobornScalePulseMultiplier({
      skinId: 'cyroborn',
      jumpProgress: null,
      attackProgress: null,
      deathProgress: 0.5,
    });
    const end = resolvingWorldPlazaCyrobornScalePulseMultiplier({
      skinId: 'cyroborn',
      jumpProgress: null,
      attackProgress: null,
      deathProgress: 1,
    });

    expect(start.scaleMultiplier).toBeCloseTo(1, 5);
    expect(start.hideBody).toBe(false);
    // Ease-in: half progress still above 0.5 scale (slow start).
    expect(mid.scaleMultiplier).toBeCloseTo(1 - computingWorldPlazaEaseInCubic(0.5), 5);
    expect(mid.scaleMultiplier).toBeGreaterThan(0.5);
    expect(end.scaleMultiplier).toBe(0);
    expect(end.hideBody).toBe(true);
  });
});
