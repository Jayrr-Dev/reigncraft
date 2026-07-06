import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { checkingWildlifeShouldTerritoryWarn } from '@/components/world/wildlife/domains/checkingWildlifeTerritoryIntrusion';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

function buildingTerritoryBlackboard(
  overrides: Partial<DefiningWildlifeBehaviorBlackboard> = {}
): DefiningWildlifeBehaviorBlackboard {
  const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.boar;

  return {
    instance: {
      instanceId: 'wildlife:1:1:0',
      speciesId: 'boar',
      anchorId: 'wildlife:1:1:0',
      aggressionLevel: 'normal',
      spawnAnchor: { x: 5, y: 5, layer: 1 },
      position: { x: 5, y: 5, layer: 1 },
      facingDirection: 'Down',
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      hungerState: {
        hungerRatio: 0.9,
        driveLevel: 'sated',
        lastFedAtMs: null,
      },
      staminaState: {
        staminaRatio: 1,
        isExhausted: false,
      },
      aiState: {
        intent: { mode: 'idle' },
        facingDirection: 'Down',
        motionClip: 'idle',
        isMoving: false,
        lastThinkAtMs: 0,
        wanderTarget: null,
        steeringCache: null,
        lastAttackAtMs: null,
        jumpState: null,
        lastJumpEndedAtMs: null,
        startledUntilMs: null,
        chargeWindupStartedAtMs: null,
        fleeTargetPoint: null,
      },
      aggroState: {
        threats: [],
        activeTargetId: null,
        lastDamagedAtMs: null,
      },
      isDead: false,
      diedAtMs: null,
      hasDroppedLoot: false,
      floatingTexts: [],

      speechState: {

        activeBubble: null,

        lastEmittedAtMs: null,

        lastContextKey: null,

      },
      environmentalDamageLastTickAtMs: null,
    },
    species,
    nearbyInstances: [],
    playerPosition: { x: 8, y: 5, layer: 1 },
    playerUserId: 'player-1',
    isPlayerRunning: false,
    isPlayerJumping: false,
    nowMs: 1000,
    selectedPreyInstanceId: null,
    selectedGroundFoodItemId: null,
    resolveSpecies: (speciesId) =>
      DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
    ...overrides,
  };
}

describe('checkingWildlifeTerritoryIntrusion', () => {
  it('warns when the player is inside the anchor territory and close to the boar', () => {
    expect(
      checkingWildlifeShouldTerritoryWarn(buildingTerritoryBlackboard())
    ).toBe(true);
  });

  it('does not warn when the player is outside the anchor territory', () => {
    const blackboard = buildingTerritoryBlackboard({
      playerPosition: { x: 20, y: 5, layer: 1 },
    });

    expect(checkingWildlifeShouldTerritoryWarn(blackboard)).toBe(false);
  });

  it('does not warn tame spawns', () => {
    const base = buildingTerritoryBlackboard();
    const blackboard = buildingTerritoryBlackboard({
      instance: {
        ...base.instance,
        aggressionLevel: 'tame',
      },
    });

    expect(checkingWildlifeShouldTerritoryWarn(blackboard)).toBe(false);
  });
});
