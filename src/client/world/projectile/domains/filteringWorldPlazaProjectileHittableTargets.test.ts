import type { DefiningWorldPlazaProjectileTarget } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import { filteringWorldPlazaProjectileHittableTargets } from '@/components/world/projectile/domains/filteringWorldPlazaProjectileHittableTargets';
import { describe, expect, it } from 'vitest';

const targets: readonly DefiningWorldPlazaProjectileTarget[] = [
  {
    targetId: 'local-player',
    point: { x: 0, y: 0 },
    collisionRadiusGrid: 0.3,
    jumpArcOffsetPx: 0,
  },
  {
    targetId: 'wolf-1',
    point: { x: 5, y: 0 },
    collisionRadiusGrid: 0.4,
    jumpArcOffsetPx: 0,
  },
];

describe('filteringWorldPlazaProjectileHittableTargets', () => {
  it('keeps all targets when spawner is null (wildlife / unowned)', () => {
    expect(filteringWorldPlazaProjectileHittableTargets(targets, null)).toEqual(
      targets
    );
  });

  it('excludes the spawner so player shots cannot hit self', () => {
    expect(
      filteringWorldPlazaProjectileHittableTargets(targets, 'local-player')
    ).toEqual([targets[1]]);
  });
});
