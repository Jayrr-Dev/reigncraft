import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { advancingWildlifeAggroTick } from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import { advancingWildlifeStalkAggroTick } from '@/components/world/wildlife/domains/advancingWildlifeStalkAggroTick';
import { advancingWildlifeStalkPhaseTick } from '@/components/world/wildlife/domains/advancingWildlifeStalkPhaseTick';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_STALK_AGGRO_TIMEOUT_MS } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import { describe, expect, it } from 'vitest';

const resolveSpecies = (speciesId: string) =>
  DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null;

describe('advancingWildlifeStalkAggroTick', () => {
  it('joins followers when the spawn-pack alpha is stalking nearby', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const alpha = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:1',
      anchorId: 'wildlife:4:7:1',
      sizeScaleSample: 1.2,
      position: { x: 10, y: 10, layer: 1 },
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: 1000,
      },
    });
    const follower = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:0',
      anchorId: 'wildlife:4:7:0',
      sizeScaleSample: -0.5,
      position: { x: 11, y: 10, layer: 1 },
    });

    const nextAggro = advancingWildlifeStalkAggroTick({
      instance: follower,
      species,
      nearbyInstances: [alpha],
      playerPosition: { x: 12, y: 10, layer: 1 },
      playerUserId: 'player-1',
      playerHealthRatio: 1,
      playerStaminaRatio: 1,
      playerStaminaIsDepleted: false,
      playerStillDurationMs: 0,
      deltaSeconds: 1,
      nowMs: 2000,
      resolveSpecies,
      aggroState: follower.aggroState,
    }).aggroState;

    expect(nextAggro.threats[0]?.targetId).toBe('player-1');
    expect(nextAggro.threats[0]?.threat ?? 0).toBeGreaterThan(0);
  });

  it('does not join a non-alpha packmate stalking from another spawn group', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const otherPackLeader = creatingWildlifeTestInstance({
      instanceId: 'wildlife:8:7:1',
      anchorId: 'wildlife:8:7:1',
      position: { x: 10, y: 10, layer: 1 },
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: 1000,
      },
    });
    const follower = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:0',
      anchorId: 'wildlife:4:7:0',
      position: { x: 11, y: 10, layer: 1 },
    });

    const nextAggro = advancingWildlifeStalkAggroTick({
      instance: follower,
      species,
      nearbyInstances: [otherPackLeader],
      playerPosition: { x: 12, y: 10, layer: 1 },
      playerUserId: 'player-1',
      playerHealthRatio: 1,
      playerStaminaRatio: 1,
      playerStaminaIsDepleted: false,
      playerStillDurationMs: 0,
      deltaSeconds: 1,
      nowMs: 2000,
      resolveSpecies,
      aggroState: follower.aggroState,
    }).aggroState;

    expect(nextAggro.threats).toHaveLength(0);
  });

  it('syncs follower stalk timers to the alpha', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const alpha = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:1',
      anchorId: 'wildlife:4:7:1',
      sizeScaleSample: 1.2,
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: 500,
      },
    });
    const follower = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:0',
      anchorId: 'wildlife:4:7:0',
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: null,
      },
    });

    const nextAggro = advancingWildlifeStalkAggroTick({
      instance: follower,
      species,
      nearbyInstances: [alpha],
      playerPosition: { x: 12, y: 10, layer: 1 },
      playerUserId: 'player-1',
      playerHealthRatio: 1,
      playerStaminaRatio: 1,
      playerStaminaIsDepleted: false,
      playerStillDurationMs: 0,
      deltaSeconds: 0,
      nowMs: 2_000,
      resolveSpecies,
      aggroState: follower.aggroState,
    }).aggroState;

    expect(nextAggro.stalkingPreySinceMs).toBe(500);
  });

  it('drops player stalk aggro after two minutes without a kill trigger', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = creatingWildlifeTestInstance({
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: 0,
        stalkPhase: 'shadowing',
      },
    });

    const stalkResult = advancingWildlifeStalkAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 5, y: 5, layer: 1 },
      playerUserId: 'player-1',
      playerHealthRatio: 1,
      playerStaminaRatio: 1,
      playerStaminaIsDepleted: false,
      playerStillDurationMs: 0,
      deltaSeconds: 0,
      nowMs: DEFINING_WILDLIFE_STALK_AGGRO_TIMEOUT_MS + 1,
      resolveSpecies,
      aggroState: instance.aggroState,
    });

    const nextAggro = advancingWildlifeStalkPhaseTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 5, y: 5, layer: 1 },
      playerUserId: 'player-1',
      playerHealthRatio: 1,
      playerStaminaRatio: 1,
      playerStaminaIsDepleted: false,
      playerStillDurationMs: 0,
      nowMs: DEFINING_WILDLIFE_STALK_AGGRO_TIMEOUT_MS + 1,
      aggroState: stalkResult.aggroState,
      tickEvents: stalkResult.events,
      resolveSpecies,
    });

    expect(stalkResult.events).toContain('STALK_TIMEOUT_2MIN');
    expect(nextAggro.activeTargetId).toBeNull();
    expect(nextAggro.stalkingPreySinceMs).toBeNull();
    expect(nextAggro.stalkPhase).toBe('idle');
  });

  it('keeps stalk aggro when the player drops below half health', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = creatingWildlifeTestInstance({
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: 0,
        stalkPhase: 'shadowing',
      },
    });

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 5, y: 5, layer: 1 },
      playerUserId: 'player-1',
      playerHealthRatio: 0.4,
      playerStaminaRatio: 1,
      playerStaminaIsDepleted: false,
      playerStillDurationMs: 0,
      deltaSeconds: 0,
      nowMs: DEFINING_WILDLIFE_STALK_AGGRO_TIMEOUT_MS + 1,
    });

    expect(nextAggro.activeTargetId).toBe('player-1');
    expect(nextAggro.stalkingPreySinceMs).toBe(0);
  });
});
