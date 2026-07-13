import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { checkingWildlifePackHunterMayInitiatePreyStalk } from '@/components/world/wildlife/domains/checkingWildlifePackHunterMayInitiatePreyStalk';
import { checkingWildlifeStalkPackmateMayAttackPrey } from '@/components/world/wildlife/domains/checkingWildlifeStalkPackmateMayAttackPrey';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

const resolveSpecies = (speciesId: string) =>
  DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null;

const preyPosition = { x: 10, y: 10, layer: 1 };

function buildingPackWolf(
  packIndex: number,
  sizeScaleSample: number,
  overrides: Parameters<typeof creatingWildlifeTestInstance>[0] = {}
) {
  const instanceId = `wildlife:4:7:${packIndex}`;

  return creatingWildlifeTestInstance({
    instanceId,
    anchorId: instanceId,
    sizeScaleSample,
    position: { x: 4 + packIndex, y: 10, layer: 1 },
    ...overrides,
  });
}

describe('checkingWildlifePackHunterMayInitiatePreyStalk', () => {
  it('allows only the alpha to start stalking on sight', () => {
    const alpha = buildingPackWolf(1, 1.2);
    const follower = buildingPackWolf(0, -0.5);

    expect(
      checkingWildlifePackHunterMayInitiatePreyStalk({
        instance: alpha,
        nearbyInstances: [follower],
        resolveSpecies,
      })
    ).toBe(true);
    expect(
      checkingWildlifePackHunterMayInitiatePreyStalk({
        instance: follower,
        nearbyInstances: [alpha],
        resolveSpecies,
      })
    ).toBe(false);
  });
});

describe('checkingWildlifeStalkPackmateMayAttackPrey', () => {
  it('blocks followers until the alpha rushes the prey', () => {
    const alpha = buildingPackWolf(1, 1.2, {
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        intent: {
          mode: 'stalk',
          targetInstanceId: 'prey-1',
          targetPoint: { x: 8, y: 10, layer: 1 },
        },
        hasUsedBluffCharge: false,
        bluffChargePlayerExitedTerritory: false,
        bluffReturnPoint: null,
        docileFollowUntilMs: null,
        docileLastReactAtMs: null,
      },
    });
    const follower = buildingPackWolf(0, -0.5);

    expect(
      checkingWildlifeStalkPackmateMayAttackPrey({
        instance: alpha,
        nearbyInstances: [follower],
        prey: {
          targetId: 'prey-1',
          position: preyPosition,
          healthRatio: 1,
          staminaRatio: 1,
          staminaIsDepleted: false,
          stillDurationMs: 0,
        },
        resolveSpecies,
      })
    ).toBe(true);
    expect(
      checkingWildlifeStalkPackmateMayAttackPrey({
        instance: follower,
        nearbyInstances: [alpha],
        prey: {
          targetId: 'prey-1',
          position: preyPosition,
          healthRatio: 1,
          staminaRatio: 1,
          staminaIsDepleted: false,
          stillDurationMs: 0,
        },
        resolveSpecies,
      })
    ).toBe(false);
  });

  it('lets followers attack once the alpha closes on the prey', () => {
    const alpha = buildingPackWolf(1, 1.2, {
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        intent: {
          mode: 'chase',
          targetInstanceId: 'prey-1',
          targetPoint: preyPosition,
        },
        hasUsedBluffCharge: false,
        bluffChargePlayerExitedTerritory: false,
        bluffReturnPoint: null,
        docileFollowUntilMs: null,
        docileLastReactAtMs: null,
      },
    });
    const follower = buildingPackWolf(0, -0.5);

    expect(
      checkingWildlifeStalkPackmateMayAttackPrey({
        instance: follower,
        nearbyInstances: [alpha],
        prey: {
          targetId: 'prey-1',
          position: preyPosition,
          healthRatio: 1,
          staminaRatio: 1,
          staminaIsDepleted: false,
          stillDurationMs: 0,
        },
        resolveSpecies,
      })
    ).toBe(true);
  });
});
