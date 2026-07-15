import {
  checkingWorldPlazaProjectileShouldSplitByTimer,
  checkingWorldPlazaProjectileShouldSplitOnImpact,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileImpactBehaviorRegistry';
import type { DefiningWorldPlazaProjectileSplitConfig } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import { describe, expect, it } from 'vitest';

const impactSplit: DefiningWorldPlazaProjectileSplitConfig = {
  splitOnImpact: true,
  count: 4,
  childArchetypeId: 'cyroborn-ice-shard-burst',
  spreadPattern: 'radial',
};

const timerSplit: DefiningWorldPlazaProjectileSplitConfig = {
  afterMs: 5_000,
  count: 5,
  childArchetypeId: 'cyroborn-ice-shard-burst',
  spreadPattern: 'radial',
};

describe('projectile split triggers', () => {
  it('splits on impact when configured and not yet split', () => {
    expect(
      checkingWorldPlazaProjectileShouldSplitOnImpact(impactSplit, true, false)
    ).toBe(true);
    expect(
      checkingWorldPlazaProjectileShouldSplitOnImpact(impactSplit, true, true)
    ).toBe(false);
    expect(
      checkingWorldPlazaProjectileShouldSplitOnImpact(timerSplit, true, false)
    ).toBe(false);
  });

  it('splits by timer only when afterMs elapsed', () => {
    expect(
      checkingWorldPlazaProjectileShouldSplitByTimer(timerSplit, 4_999, false)
    ).toBe(false);
    expect(
      checkingWorldPlazaProjectileShouldSplitByTimer(timerSplit, 5_000, false)
    ).toBe(true);
    expect(
      checkingWorldPlazaProjectileShouldSplitByTimer(impactSplit, 9_999, false)
    ).toBe(false);
  });
});
