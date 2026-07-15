import { creatingWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import {
  DEFINING_WORLD_PLAZA_DEATH_RESPAWN_ORIGIN_WORLD_POINT,
  resolvingWorldPlazaNearestOwnedClaimRespawnWorldPoint,
} from '@/components/world/health/domains/resolvingWorldPlazaNearestOwnedClaimRespawnWorldPoint';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaNearestOwnedClaimRespawnWorldPoint', () => {
  it('returns origin when the player owns no claims', () => {
    const destination = resolvingWorldPlazaNearestOwnedClaimRespawnWorldPoint(
      { x: 40, y: 12, layer: 1 },
      []
    );

    expect(destination).toEqual(
      DEFINING_WORLD_PLAZA_DEATH_RESPAWN_ORIGIN_WORLD_POINT
    );
  });

  it('picks the nearer owned plot for remake', () => {
    const nearPlot = creatingWorldBuildingPlot({
      plotId: 'near',
      ownerId: 'player-1',
      bounds: {
        minTileX: 8,
        minTileY: 8,
        maxTileX: 8,
        maxTileY: 8,
      },
      createdAt: '2026-01-01T00:00:00.000Z',
    });
    const farPlot = creatingWorldBuildingPlot({
      plotId: 'far',
      ownerId: 'player-1',
      bounds: {
        minTileX: 80,
        minTileY: 80,
        maxTileX: 80,
        maxTileY: 80,
      },
      createdAt: '2026-01-01T00:00:00.000Z',
    });

    const destination = resolvingWorldPlazaNearestOwnedClaimRespawnWorldPoint(
      { x: 10, y: 10, layer: 1 },
      [farPlot, nearPlot]
    );

    // Teleport lands just outside plot bounds, still near the closer claim.
    expect(Math.abs(destination.x - 8)).toBeLessThanOrEqual(2);
    expect(Math.abs(destination.y - 8)).toBeLessThanOrEqual(2);
  });
});
