import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { attemptingWildlifeMeatGroundDropOnDeath } from '@/components/world/wildlife/domains/attemptingWildlifeMeatGroundDropOnDeath';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { creatingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { describe, expect, it, vi } from 'vitest';

const droppingWildlifeMeatGroundItemMock = vi.hoisted(() => vi.fn());

vi.mock(
  '@/components/world/wildlife/domains/droppingWildlifeMeatGroundItem',
  () => ({
    droppingWildlifeMeatGroundItem: droppingWildlifeMeatGroundItemMock,
  })
);

function buildingDeadDeer(): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:deer:env',
    speciesId: 'deer',
    anchorId: 'wildlife:deer:env',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 2.5, y: 2.5, layer: 1 },
    position: { x: 2.5, y: 2.5, layer: 1 },
    facingDirection: 'Down',
    healthState: {
      ...creatingWorldPlazaEntityHealthInitialState(),
      currentHealth: 0,
    },
    hungerState: {
      hungerRatio: 0.5,
      driveLevel: 'hungry',
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
      docileFollowUntilMs: null,
      docileLastReactAtMs: null,
      isSleeping: false,
      hasSleepBeenDisturbed: false,
      hasPlayerSleepBumpContact: false,
    },
    aggroState: {
      threats: [],
      activeTargetId: null,
      lastDamagedAtMs: null,
    },
    isDead: true,
    diedAtMs: 1000,
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

describe('attemptingWildlifeMeatGroundDropOnDeath', () => {
  it('marks loot dropped and spawns meat for non-combat deaths when context exists', () => {
    droppingWildlifeMeatGroundItemMock.mockReset();
    droppingWildlifeMeatGroundItemMock.mockResolvedValue({
      outcome: 'dropped',
      groundItem: {
        id: 'ground:deer-meat',
        itemTypeId: 'world-plaza-raw-deer-meat',
        quantity: 1,
        gridX: 2,
        gridY: 2,
        layer: 1,
        spawnedAt: 1000,
      },
    });

    const store = creatingWildlifeInstanceStore();
    const instance = buildingDeadDeer();
    store.instances.set(instance.instanceId, instance);
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;

    const nextInstance = attemptingWildlifeMeatGroundDropOnDeath(
      store,
      instance,
      species,
      {
        localPersistenceOwnerId: 'local-player',
        redditUserId: null,
        saveSlotIndex: 1,
        playerPosition: { x: 3, y: 3, layer: 1 },
      }
    );

    expect(nextInstance.hasDroppedLoot).toBe(true);
    expect(store.instances.get(instance.instanceId)?.hasDroppedLoot).toBe(true);
    expect(droppingWildlifeMeatGroundItemMock).toHaveBeenCalledTimes(1);
    expect(droppingWildlifeMeatGroundItemMock).toHaveBeenCalledWith(
      expect.objectContaining({
        instance: expect.objectContaining({ hasDroppedLoot: true }),
        species,
        killContext: undefined,
      })
    );
  });

  it('skips drop when meat context is missing', () => {
    droppingWildlifeMeatGroundItemMock.mockReset();

    const store = creatingWildlifeInstanceStore();
    const instance = buildingDeadDeer();
    store.instances.set(instance.instanceId, instance);
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;

    const nextInstance = attemptingWildlifeMeatGroundDropOnDeath(
      store,
      instance,
      species,
      null
    );

    expect(nextInstance.hasDroppedLoot).toBe(false);
    expect(droppingWildlifeMeatGroundItemMock).not.toHaveBeenCalled();
  });

  it('clears hasDroppedLoot when persist fails so a later tick can retry', async () => {
    droppingWildlifeMeatGroundItemMock.mockReset();
    droppingWildlifeMeatGroundItemMock.mockResolvedValue({
      outcome: 'failed',
    });

    const store = creatingWildlifeInstanceStore();
    const instance = buildingDeadDeer();
    store.instances.set(instance.instanceId, instance);
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;

    const nextInstance = attemptingWildlifeMeatGroundDropOnDeath(
      store,
      instance,
      species,
      {
        localPersistenceOwnerId: 'local-player',
        redditUserId: null,
        saveSlotIndex: 1,
        playerPosition: { x: 3, y: 3, layer: 1 },
      }
    );

    expect(nextInstance.hasDroppedLoot).toBe(true);

    await vi.waitFor(() => {
      expect(store.instances.get(instance.instanceId)?.hasDroppedLoot).toBe(
        false
      );
    });
  });
});
