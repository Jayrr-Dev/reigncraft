import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_NAME_TAG_VISIBLE_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { updatingWildlifeNameTagsOverlayRef } from '@/components/world/wildlife/domains/updatingWildlifeNameTagsOverlayRef';
import { describe, expect, it } from 'vitest';

function buildingTestWildlifeInstance(
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:0:0:0',
    speciesId: 'deer',
    anchorId: 'wildlife:0:0:0',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 10, y: 10, layer: 0 },
    position: { x: 10, y: 10, layer: 0 },
    facingDirection: 'Down',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 0.85,
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
      fleeTargetPoint: null,
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
      isSleeping: false,
      hasSleepBeenDisturbed: false,
      hasPlayerSleepBumpContact: false,
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
    ...overrides,
  };
}

describe('updatingWildlifeNameTagsOverlayRef', () => {
  it('culls animals beyond the visible radius', () => {
    const outRef: Parameters<
      typeof updatingWildlifeNameTagsOverlayRef
    >[0]['outRef'] = [];
    const labelCache = new Map();

    updatingWildlifeNameTagsOverlayRef({
      outRef,
      instances: [
        buildingTestWildlifeInstance({
          instanceId: 'near-deer',
          position: { x: 10.5, y: 10, layer: 0 },
        }),
        buildingTestWildlifeInstance({
          instanceId: 'far-deer',
          position: {
            x: 10 + DEFINING_WILDLIFE_NAME_TAG_VISIBLE_RADIUS_GRID + 2,
            y: 10,
            layer: 0,
          },
        }),
      ],
      playerPosition: { x: 10, y: 10, layer: 0 },
      playerFacingDirection: 'Down',
      playerUserId: 'player-1',
      nowMs: 10_000,
      hoveredInstanceId: null,
      wildlifeDamagedPlayerAtMsByInstanceId: new Map(),
      placedBlocks: [],
      placedBlocksByTile: undefined,
      labelCache,
      resolveSpecies: resolvingWildlifeSpeciesDefinition,
    });

    expect(outRef).toHaveLength(1);
    expect(outRef[0]?.instanceId).toBe('near-deer');
  });

  it('updates positions in place without remount churn', () => {
    const outRef: Parameters<
      typeof updatingWildlifeNameTagsOverlayRef
    >[0]['outRef'] = [];
    const labelCache = new Map();
    const instance = buildingTestWildlifeInstance({
      instanceId: 'moving-deer',
      position: { x: 10, y: 10, layer: 0 },
    });

    const firstUpdate = updatingWildlifeNameTagsOverlayRef({
      outRef,
      instances: [instance],
      playerPosition: { x: 10, y: 10, layer: 0 },
      playerFacingDirection: 'Down',
      playerUserId: 'player-1',
      nowMs: 10_000,
      hoveredInstanceId: null,
      wildlifeDamagedPlayerAtMsByInstanceId: new Map(),
      placedBlocks: [],
      placedBlocksByTile: undefined,
      labelCache,
      resolveSpecies: resolvingWildlifeSpeciesDefinition,
    });
    const firstEntry = outRef[0];

    instance.position = { x: 11, y: 10.5, layer: 0 };

    const secondUpdate = updatingWildlifeNameTagsOverlayRef({
      outRef,
      instances: [instance],
      playerPosition: { x: 10, y: 10, layer: 0 },
      playerFacingDirection: 'Down',
      playerUserId: 'player-1',
      nowMs: 10_500,
      hoveredInstanceId: null,
      wildlifeDamagedPlayerAtMsByInstanceId: new Map(),
      placedBlocks: [],
      placedBlocksByTile: undefined,
      labelCache,
      resolveSpecies: resolvingWildlifeSpeciesDefinition,
    });

    expect(firstUpdate.didMountSetChange).toBe(true);
    expect(secondUpdate.didMountSetChange).toBe(false);
    expect(outRef[0]).toBe(firstEntry);
    expect(outRef[0]?.gridX).toBe(11);
    expect(outRef[0]?.gridY).toBe(10.5);
    expect(outRef[0]?.frameHeightPx).toBe(64);
  });
});
