import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  clearingWildlifeSleepBumpContact,
  resolvingWildlifeSleepBumpFromPlayerCollision,
} from '@/components/world/wildlife/domains/resolvingWildlifeSleepBumpFromPlayerCollision';
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

describe('resolvingWildlifeSleepBumpFromPlayerCollision', () => {
  const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.cow;
  const playerPosition = { x: 1.2, y: 1.1, layer: 1 };
  const pushedPosition = { x: 0.9, y: 1.0, layer: 1 };

  it('wakes and startles on a successful bump roll', () => {
    const sleeping = creatingWildlifeTestInstance({
      speciesId: 'cow',
      position: { x: 1, y: 1, layer: 1 },
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        isSleeping: true,
        motionClip: 'sleep',
        hasUsedBluffCharge: false,
        bluffChargePlayerExitedTerritory: false,
        bluffReturnPoint: null,
        docileFollowUntilMs: null,
        docileLastReactAtMs: null,
      },
    });

    const woken = resolvingWildlifeSleepBumpFromPlayerCollision({
      instance: sleeping,
      species,
      pushedPosition,
      playerPosition,
      playerUserId: 'player-1',
      hazardSampling: DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING,
      nowMs: 1000,
      roll: () => 0,
    });

    expect(woken.aiState.isSleeping).toBe(false);
    expect(woken.aiState.hasSleepBeenDisturbed).toBe(true);
    expect(woken.aiState.hasPlayerSleepBumpContact).toBe(true);
    expect(woken.aiState.intent.mode).toBe('flee');
    expect(woken.position).toEqual(pushedPosition);
  });

  it('keeps the sleeper asleep on a failed bump roll but locks contact', () => {
    const sleeping = creatingWildlifeTestInstance({
      speciesId: 'cow',
      position: { x: 1, y: 1, layer: 1 },
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        isSleeping: true,
        motionClip: 'sleep',
        hasUsedBluffCharge: false,
        bluffChargePlayerExitedTerritory: false,
        bluffReturnPoint: null,
        docileFollowUntilMs: null,
        docileLastReactAtMs: null,
      },
    });

    const stillSleeping = resolvingWildlifeSleepBumpFromPlayerCollision({
      instance: sleeping,
      species,
      pushedPosition,
      playerPosition,
      playerUserId: 'player-1',
      hazardSampling: DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING,
      nowMs: 1000,
      roll: () => 0.99,
    });

    expect(stillSleeping.aiState.isSleeping).toBe(true);
    expect(stillSleeping.aiState.hasSleepBeenDisturbed).toBe(false);
    expect(stillSleeping.aiState.hasPlayerSleepBumpContact).toBe(true);
  });

  it('does not re-roll while the same contact is active', () => {
    const roll = vi.fn(() => 0);
    const sleeping = creatingWildlifeTestInstance({
      speciesId: 'cow',
      position: { x: 1, y: 1, layer: 1 },
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        isSleeping: true,
        motionClip: 'sleep',
        hasPlayerSleepBumpContact: true,
        hasUsedBluffCharge: false,
        bluffChargePlayerExitedTerritory: false,
        bluffReturnPoint: null,
        docileFollowUntilMs: null,
        docileLastReactAtMs: null,
      },
    });

    const next = resolvingWildlifeSleepBumpFromPlayerCollision({
      instance: sleeping,
      species,
      pushedPosition,
      playerPosition,
      playerUserId: 'player-1',
      hazardSampling: DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING,
      nowMs: 1000,
      roll,
    });

    expect(roll).not.toHaveBeenCalled();
    expect(next.aiState.isSleeping).toBe(true);
    expect(next.position).toEqual(pushedPosition);
  });

  it('makes predators attack when bump-woken', () => {
    const lion = DEFINING_WILDLIFE_SPECIES_REGISTRY.lion;
    const sleeping = creatingWildlifeTestInstance({
      speciesId: 'lion',
      position: { x: 4, y: 4, layer: 1 },
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        isSleeping: true,
        motionClip: 'sleep',
        hasUsedBluffCharge: false,
        bluffChargePlayerExitedTerritory: false,
        bluffReturnPoint: null,
        docileFollowUntilMs: null,
        docileLastReactAtMs: null,
      },
    });

    const woken = resolvingWildlifeSleepBumpFromPlayerCollision({
      instance: sleeping,
      species: lion,
      pushedPosition: { x: 3.9, y: 3.9, layer: 1 },
      playerPosition: { x: 4.2, y: 4.1, layer: 1 },
      playerUserId: 'player-1',
      hazardSampling: DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING,
      nowMs: 2000,
      roll: () => 0,
    });

    expect(woken.aiState.isSleeping).toBe(false);
    expect(woken.aiState.intent.mode).toBe('attack');
    if (woken.aiState.intent.mode === 'attack') {
      expect(woken.aiState.intent.targetInstanceId).toBe('player-1');
    }
  });

  it('clears the bump-contact lock when overlap ends', () => {
    const contacted = creatingWildlifeTestInstance({
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        isSleeping: true,
        hasPlayerSleepBumpContact: true,
        hasUsedBluffCharge: false,
        bluffChargePlayerExitedTerritory: false,
        bluffReturnPoint: null,
        docileFollowUntilMs: null,
        docileLastReactAtMs: null,
      },
    });

    const cleared = clearingWildlifeSleepBumpContact(contacted);
    expect(cleared.aiState.hasPlayerSleepBumpContact).toBe(false);
  });
});
