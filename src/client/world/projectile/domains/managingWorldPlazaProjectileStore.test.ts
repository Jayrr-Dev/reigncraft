import {
  creatingWorldPlazaProjectileStore,
  spawningWorldPlazaProjectile,
} from '@/components/world/projectile/domains/managingWorldPlazaProjectileStore';
import { describe, expect, it } from 'vitest';

describe('managingWorldPlazaProjectileStore', () => {
  it('dedupes projectile spawns by id', () => {
    const store = creatingWorldPlazaProjectileStore();
    const firstId = spawningWorldPlazaProjectile(store, {
      projectileId: 'shared-id',
      archetypeId: 'arrow-straight',
      origin: { x: 0, y: 0, layer: 1 },
      direction: { x: 1, y: 0 },
    });
    const secondId = spawningWorldPlazaProjectile(store, {
      projectileId: 'shared-id',
      archetypeId: 'arrow-straight',
      origin: { x: 2, y: 2, layer: 1 },
      direction: { x: -1, y: 0 },
    });

    expect(firstId).toBe('shared-id');
    expect(secondId).toBeNull();
    expect(store.instances).toHaveLength(1);
    expect(store.instances[0]?.position.x).toBe(0);
  });
});
