import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeSleepWakeStartleIntent } from '@/components/world/wildlife/domains/resolvingWildlifeSleepWakeStartleIntent';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex',
  () => ({
    resolvingWorldPlazaEnvironmentalHazardAtTileIndex: vi.fn(() => null),
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

const DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING = {
  placedBlocks: [],
  isDaytime: true,
} as const;

describe('resolvingWildlifeSleepWakeStartleIntent', () => {
  it('makes passive diurnal livestock flee when startled awake', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.cow;
    const result = resolvingWildlifeSleepWakeStartleIntent({
      position: { x: 1, y: 1, layer: 1 },
      playerPosition: { x: 1.2, y: 1.1, layer: 1 },
      playerUserId: 'player-1',
      species,
      temperamentId: species.temperamentId,
      aggressionLevel: 'normal',
      hazardSampling: DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING,
      nowMs: 1000,
    });

    expect(result.intent.mode).toBe('flee');
    expect(result.startledUntilMs).toBeGreaterThan(1000);
  });

  it('makes predators attack when startled awake without flee lock', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.lion;
    const result = resolvingWildlifeSleepWakeStartleIntent({
      position: { x: 4, y: 4, layer: 1 },
      playerPosition: { x: 4.2, y: 4.1, layer: 1 },
      playerUserId: 'player-1',
      species,
      temperamentId: species.temperamentId,
      aggressionLevel: 'normal',
      hazardSampling: DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING,
      nowMs: 2000,
    });

    expect(result.intent.mode).toBe('attack');
    if (result.intent.mode === 'attack') {
      expect(result.intent.targetInstanceId).toBe('player-1');
    }
    expect(result.startledUntilMs).toBeNull();
  });
});
