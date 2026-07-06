import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex',
  () => ({
    resolvingWorldPlazaEnvironmentalHazardAtTileIndex: vi.fn(
      (_tileX: number, _tileY: number) => ({
        kind: 'heat',
        damagePerSecond: 1,
        maxHealthPercentPerSecond: 0,
        temperatureCelsius: 62,
      })
    ),
  })
);

vi.mock('@/components/world/domains/checkingWorldPlazaLavaAtTileIndex', () => ({
  checkingWorldPlazaLavaAtTileIndex: vi.fn(() => false),
}));

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex: vi.fn(() => null),
  })
);

vi.mock('@/components/world/collision', () => ({
  checkingWorldCollisionBlockedAtPoint: vi.fn(() => false),
}));

describe('checkingWildlifeHazardAtPoint', () => {
  it('blocks non-immune animals from hot tiles', () => {
    const deer = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;

    expect(
      checkingWildlifeHazardAtPoint({
        point: { x: 10.5, y: 10.5, layer: 1 },
        species: deer,
        isDaytime: true,
      })
    ).toBe('blocked');
  });

  it('allows heat-immune animals through hot tiles', () => {
    const zebra = DEFINING_WILDLIFE_SPECIES_REGISTRY.zebra;

    expect(
      checkingWildlifeHazardAtPoint({
        point: { x: 10.5, y: 10.5, layer: 1 },
        species: zebra,
        isDaytime: true,
      })
    ).toBe('safe');
  });
});
