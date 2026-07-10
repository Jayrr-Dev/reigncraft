import { resolvingFilmcowFootstepSurfaceAtWorldPoint } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSurfaceAtWorldPoint';
import { resolvingFilmcowFootstepSurfaceKindsForWildlifePlayback } from '@/components/world/footsteps/domains/resolvingFilmcowFootstepSurfaceKindsForWildlifePlayback';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { describe, expect, it } from 'vitest';

function creatingWildlifeInstance(
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife-1',
    speciesId: 'chicken',
    position: { x: 4, y: 0 },
    facingRadians: 0,
    sizeScaleSample: 0.5,
    isDead: false,
    aiState: {
      isMoving: true,
      motionClip: 'walk',
      isSleeping: false,
      jumpState: null,
    },
    ...overrides,
  } as DefiningWildlifeInstance;
}

describe('resolvingFilmcowFootstepSurfaceKindsForWildlifePlayback', () => {
  it('includes the listener biome surface and nearby wildlife surfaces', () => {
    const listenerPoint = { x: 0, y: 0 };
    const listenerSurface =
      resolvingFilmcowFootstepSurfaceAtWorldPoint(listenerPoint);
    const surfaces = resolvingFilmcowFootstepSurfaceKindsForWildlifePlayback(
      listenerPoint,
      [
        creatingWildlifeInstance({
          position: { x: 4, y: 0 },
        }),
      ]
    );

    expect(surfaces).toContain(listenerSurface);
    expect(surfaces.length).toBeGreaterThan(0);
  });

  it('skips wildlife beyond the audible range', () => {
    const listenerPoint = { x: 0, y: 0 };
    const listenerSurface =
      resolvingFilmcowFootstepSurfaceAtWorldPoint(listenerPoint);
    const surfaces = resolvingFilmcowFootstepSurfaceKindsForWildlifePlayback(
      listenerPoint,
      [
        creatingWildlifeInstance({
          position: { x: 40, y: 0 },
        }),
      ]
    );

    expect(surfaces).toEqual([listenerSurface]);
  });
});
