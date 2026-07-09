import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_INSTANCE_SEPARATION_GAP_GRID } from '@/components/world/wildlife/domains/definingWildlifeCollisionConstants';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceSeparation } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSeparation';
import { describe, expect, it } from 'vitest';

function buildingSeparationInstance(
  instanceId: string,
  position: { x: number; y: number }
): DefiningWildlifeInstance {
  return {
    instanceId,
    speciesId: 'deer',
    anchorId: instanceId,
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: position.x, y: position.y, layer: 1 },
    position: { x: position.x, y: position.y, layer: 1 },
    facingDirection: 'Down',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 0.8,
      driveLevel: 'sated',
      lastFedAtMs: null,
    },
    staminaState: creatingWildlifeInitialStaminaState(),
    aiState: {
      intent: { mode: 'idle' },
      facingDirection: 'Down',
      motionClip: 'idle',
      isMoving: false,
      lastThinkAtMs: 0,
      wanderTarget: null,
      steeringCache: null,
      lastAttackAtMs: null,
      attackComboIndex: 0,
      howlingUntilMs: null,
      lastHowlAtMs: null,
      jumpState: null,
      lastJumpEndedAtMs: null,
      startledUntilMs: null,
      chargeWindupStartedAtMs: null,
      hasUsedBluffCharge: false,
      bluffChargePlayerExitedTerritory: false,
      bluffReturnPoint: null,
      fleeTargetPoint: null,
    feedingOnKillUntilMs: null,
    feedingOnKillGroundItemId: null,
    isSleeping: false,
    hasSleepBeenDisturbed: false,
    hasPlayerSleepBumpContact: false,
    docileFollowUntilMs: null,
    docileLastReactAtMs: null,
    },
    aggroState: {
      threats: [],
      activeTargetId: null,
      lastDamagedAtMs: null,
    },
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
    hasBeenStudied: false,
    floatingTexts: [],

    speechState: {

      activeBubble: null,

      lastEmittedAtMs: null,

      lastContextKey: null,

    },
    environmentalDamageLastTickAtMs: null,
  };
}

describe('resolvingWildlifeInstanceSeparation', () => {
  it('pushes two stacked deer apart to at least their combined collision radius', () => {
    const left = buildingSeparationInstance('wildlife:0:0:0', { x: 10, y: 10 });
    const right = buildingSeparationInstance('wildlife:0:0:1', {
      x: 10,
      y: 10,
    });
    const instances = new Map([
      [left.instanceId, left],
      [right.instanceId, right],
    ]);
    const deerRadius =
      DEFINING_WILDLIFE_SPECIES_REGISTRY.deer.collisionRadiusGrid;
    const minSeparation =
      deerRadius * 2 + DEFINING_WILDLIFE_INSTANCE_SEPARATION_GAP_GRID;

    resolvingWildlifeInstanceSeparation({
      instances,
      resolveSpecies: (speciesId) =>
        DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
    });

    const separatedLeft = instances.get(left.instanceId)!;
    const separatedRight = instances.get(right.instanceId)!;
    const distance = Math.hypot(
      separatedRight.position.x - separatedLeft.position.x,
      separatedRight.position.y - separatedLeft.position.y
    );

    expect(distance).toBeGreaterThanOrEqual(minSeparation - 0.0001);
  });

  it('skips dead and jumping animals', () => {
    const idle = buildingSeparationInstance('wildlife:1:0:0', { x: 4, y: 4 });
    const jumping = {
      ...buildingSeparationInstance('wildlife:1:0:1', { x: 4, y: 4 }),
      aiState: {
        ...buildingSeparationInstance('wildlife:1:0:1', { x: 4, y: 4 }).aiState,
        jumpState: {
          fromPoint: { x: 4, y: 4, layer: 1 },
          toPoint: { x: 6, y: 4, layer: 1 },
          startedAtMs: 0,
          durationMs: 400,
          progress: 0,
        },
        hasUsedBluffCharge: false,
        bluffChargePlayerExitedTerritory: false,
        bluffReturnPoint: null,
        docileFollowUntilMs: null,
        docileLastReactAtMs: null,
      },
    };
    const instances = new Map([
      [idle.instanceId, idle],
      [jumping.instanceId, jumping],
    ]);

    resolvingWildlifeInstanceSeparation({
      instances,
      resolveSpecies: (speciesId) =>
        DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
    });

    expect(instances.get(idle.instanceId)?.position).toEqual(idle.position);
    expect(instances.get(jumping.instanceId)?.position).toEqual(
      jumping.position
    );
  });
});
