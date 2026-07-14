import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import { creatingWildlifeSpawnHealthState } from '@/components/world/wildlife/domains/creatingWildlifeSpawnHealthState';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeCoolerAreaFleeDirection } from '@/components/world/wildlife/domains/resolvingWildlifeCoolerAreaFleeDirection';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint',
  () => ({
    checkingWildlifeHazardAtPoint: vi.fn(() => 'safe'),
  })
);

const tileTemperatureMock = vi.hoisted(() =>
  vi.fn(
    ({ tileX, tileY }: { tileX: number; tileY: number }) =>
      tileX >= 5 ? 20 : 50
  )
);

vi.mock(
  '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex',
  () => ({
    resolvingWorldPlazaEnvironmentalTemperatureAtTileIndex: (
      params: { tileX: number; tileY: number }
    ) => tileTemperatureMock(params),
  })
);

describe('resolvingWildlifeCoolerAreaFleeDirection', () => {
  beforeEach(() => {
    vi.mocked(checkingWildlifeHazardAtPoint).mockReturnValue('safe');
    tileTemperatureMock.mockImplementation(
      ({ tileX }: { tileX: number; tileY: number }) => (tileX >= 5 ? 20 : 50)
    );
  });

  it('points toward cooler walkable tiles', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep;
    const healthState = creatingWildlifeSpawnHealthState(
      species.vitals.baseMaxHealth,
      null,
      species
    );

    const result = resolvingWildlifeCoolerAreaFleeDirection({
      position: { x: 1.5, y: 1.5, layer: 1 },
      instance: { healthState },
      species,
      hazardSampling: { placedBlocks: [], isDaytime: true },
      currentTemperatureCelsius: 50,
    });

    expect(result).not.toBeNull();
    expect(result!.direction.x).toBeGreaterThan(0);
    expect(result!.temperatureCelsius).toBeLessThan(50);
  });

  it('returns null when no cooler safe tile exists', () => {
    tileTemperatureMock.mockReturnValue(50);
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep;
    const healthState = creatingWildlifeSpawnHealthState(
      species.vitals.baseMaxHealth,
      null,
      species
    );

    const result = resolvingWildlifeCoolerAreaFleeDirection({
      position: { x: 1.5, y: 1.5, layer: 1 },
      instance: { healthState },
      species,
      hazardSampling: { placedBlocks: [], isDaytime: true },
      currentTemperatureCelsius: 50,
    });

    expect(result).toBeNull();
  });
});
