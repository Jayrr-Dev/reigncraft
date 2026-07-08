import { DEFINING_WILDLIFE_NAME_TAG_VISIBLE_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { updatingWildlifeNameTagsOverlayRef } from '@/components/world/wildlife/domains/updatingWildlifeNameTagsOverlayRef';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

function creatingTestWildlifeInstance(
  overrides: Partial<DefiningWildlifeInstance> & Pick<DefiningWildlifeInstance, 'instanceId'>
): DefiningWildlifeInstance {
  return {
    instanceId: overrides.instanceId,
    speciesId: overrides.speciesId ?? 'deer',
    anchorId: overrides.anchorId ?? overrides.instanceId,
    aggressionLevel: overrides.aggressionLevel ?? 'normal',
    sleepScheduleSample: overrides.sleepScheduleSample ?? 0,
    sizeScaleSample: overrides.sizeScaleSample ?? 0,
    customDisplayName: overrides.customDisplayName ?? null,
    spawnAnchor: overrides.spawnAnchor ?? { x: 10, y: 10, layer: 0 },
    position: overrides.position ?? { x: 10, y: 10, layer: 0 },
    facingDirection: overrides.facingDirection ?? 'Down',
    healthState: overrides.healthState ?? {
      baseMaxHealth: 20,
      currentHealth: 20,
      floatingTexts: [],
      activeBuffs: [],
      activeDebuffs: [],
      lastDamageTakenAtMs: null,
      regenBlockedUntilMs: null,
    },
    hungerState: overrides.hungerState ?? {
      hungerRatio: 1,
      driveLevel: 'sated',
      lastFedAtMs: null,
    },
    staminaState: overrides.staminaState ?? {
      staminaRatio: 1,
      isExhausted: false,
    },
    aiState: overrides.aiState ?? {
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
      fleeTargetPoint: null,
      startledUntilMs: null,
      chargeWindupStartedAtMs: null,
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
      isSleeping: false,
      hasSleepBeenDisturbed: false,
    },
    aggroState: overrides.aggroState ?? {
      threats: [],
      activeTargetId: null,
      lastDamagedAtMs: null,
    },
    floatingTexts: overrides.floatingTexts ?? [],
    speechState: overrides.speechState ?? {
      activeBubble: null,
      lastEmittedAtMs: null,
      lastContextKey: null,
    },
    environmentalDamageLastTickAtMs:
      overrides.environmentalDamageLastTickAtMs ?? null,
    isDead: overrides.isDead ?? false,
    diedAtMs: overrides.diedAtMs ?? null,
    hasDroppedLoot: overrides.hasDroppedLoot ?? false,
  };
}

describe('updatingWildlifeNameTagsOverlayRef', () => {
  it('culls animals beyond the visible radius', () => {
    const outRef: ReturnType<typeof updatingWildlifeNameTagsOverlayRef> extends never
      ? never
      : Parameters<typeof updatingWildlifeNameTagsOverlayRef>[0]['outRef'] = [];
    const labelCache = new Map();

    updatingWildlifeNameTagsOverlayRef({
      outRef,
      instances: [
        creatingTestWildlifeInstance({
          instanceId: 'near-deer',
          position: { x: 10.5, y: 10, layer: 0 },
        }),
        creatingTestWildlifeInstance({
          instanceId: 'far-deer',
          position: {
            x: 10 + DEFINING_WILDLIFE_NAME_TAG_VISIBLE_RADIUS_GRID + 2,
            y: 10,
            layer: 0,
          },
        }),
      ],
      playerPosition: { x: 10, y: 10, layer: 0 },
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
    const instance = creatingTestWildlifeInstance({
      instanceId: 'moving-deer',
      position: { x: 10, y: 10, layer: 0 },
    });

    const firstUpdate = updatingWildlifeNameTagsOverlayRef({
      outRef,
      instances: [instance],
      playerPosition: { x: 10, y: 10, layer: 0 },
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
  });
});
