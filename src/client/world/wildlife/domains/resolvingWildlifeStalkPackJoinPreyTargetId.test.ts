import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeStalkPackJoinPreyTargetId } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackJoinPreyTargetId';
import { describe, expect, it } from 'vitest';

const resolveSpecies = (speciesId: string) =>
  DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null;

describe('resolvingWildlifeStalkPackJoinPreyTargetId', () => {
  it('lets followers inherit the alpha stalk lock over a different active target', () => {
    const alpha = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:1',
      anchorId: 'wildlife:4:7:1',
      sizeScaleSample: 1.4,
      packAlphaInstanceId: 'wildlife:4:7:1',
      position: { x: 4, y: 7, layer: 1 },
      aggroState: {
        threats: [{ targetId: 'sheep-1', threat: 3, lastUpdatedAtMs: 1 }],
        activeTargetId: 'sheep-1',
        lastDamagedAtMs: null,
        stalkLockedPreyTargetId: 'sheep-1',
        stalkingPreySinceMs: 1_000,
      },
    });
    const follower = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:0',
      anchorId: 'wildlife:4:7:0',
      sizeScaleSample: -0.4,
      packAlphaInstanceId: 'wildlife:4:7:1',
      position: { x: 5, y: 7, layer: 1 },
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkLockedPreyTargetId: 'player-1',
      },
    });

    expect(
      resolvingWildlifeStalkPackJoinPreyTargetId({
        instance: follower,
        nearbyInstances: [alpha],
        resolveSpecies,
      })
    ).toBe('sheep-1');
  });

  it('shares prey across nearby wolves from different spawn tiles', () => {
    const alpha = creatingWildlifeTestInstance({
      instanceId: 'wildlife:dev:alpha',
      anchorId: 'wildlife:dev:alpha',
      sizeScaleSample: 1.5,
      packAlphaInstanceId: 'wildlife:dev:alpha',
      position: { x: 4, y: 7, layer: 1 },
      aggroState: {
        threats: [{ targetId: 'sheep-1', threat: 3, lastUpdatedAtMs: 1 }],
        activeTargetId: 'sheep-1',
        lastDamagedAtMs: null,
        stalkLockedPreyTargetId: 'sheep-1',
      },
    });
    const follower = creatingWildlifeTestInstance({
      instanceId: 'wildlife:dev:follower',
      anchorId: 'wildlife:dev:follower',
      sizeScaleSample: -0.2,
      packAlphaInstanceId: 'wildlife:dev:alpha',
      position: { x: 6, y: 7, layer: 1 },
      aggroState: {
        threats: [],
        activeTargetId: null,
        lastDamagedAtMs: null,
        stalkLockedPreyTargetId: null,
      },
    });

    expect(
      resolvingWildlifeStalkPackJoinPreyTargetId({
        instance: follower,
        nearbyInstances: [alpha],
        resolveSpecies,
      })
    ).toBe('sheep-1');
  });

  it('does not invent a prey lock for the alpha itself', () => {
    const alpha = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:1',
      anchorId: 'wildlife:4:7:1',
      sizeScaleSample: 1.4,
      packAlphaInstanceId: 'wildlife:4:7:1',
      aggroState: {
        threats: [{ targetId: 'sheep-1', threat: 3, lastUpdatedAtMs: 1 }],
        activeTargetId: 'sheep-1',
        lastDamagedAtMs: null,
        stalkLockedPreyTargetId: 'sheep-1',
      },
    });

    expect(
      resolvingWildlifeStalkPackJoinPreyTargetId({
        instance: alpha,
        nearbyInstances: [],
        resolveSpecies,
      })
    ).toBeNull();
  });
});
