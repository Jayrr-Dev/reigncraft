import { describe, expect, it } from 'vitest';

import { rollingWildlifeWolfHowlSummon } from '@/components/world/wildlife/domains/applyingWildlifeWolfHowlPackAttraction';
import {
  DEFINING_WILDLIFE_WOLF_HOWL_ATTRACT_RADIUS_GRID,
  DEFINING_WILDLIFE_WOLF_HOWL_SUMMON_DURATION_MS,
} from '@/components/world/wildlife/domains/definingWildlifeWolfVocalizationConstants';
import {
  creatingWildlifeTestAiState,
  creatingWildlifeTestInstance,
} from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';

const HOWL_EVENT = {
  howlerInstanceId: 'wildlife:howler',
  point: { x: 10, y: 10, layer: 1 },
};

describe('rollingWildlifeWolfHowlSummon', () => {
  it('sets a summon on a nearby idle wolf when the roll passes', () => {
    const wolf = creatingWildlifeTestInstance({
      instanceId: 'wildlife:listener',
      position: { x: 14, y: 10, layer: 1 },
    });

    const result = rollingWildlifeWolfHowlSummon({
      instance: wolf,
      event: HOWL_EVENT,
      nowMs: 1_000,
      random: () => 0,
    });

    expect(result.aiState.howlSummon).toEqual({
      targetPoint: HOWL_EVENT.point,
      howlerInstanceId: 'wildlife:howler',
      untilMs: 1_000 + DEFINING_WILDLIFE_WOLF_HOWL_SUMMON_DURATION_MS,
    });
  });

  it('does not summon when the roll fails', () => {
    const wolf = creatingWildlifeTestInstance({
      instanceId: 'wildlife:listener',
      position: { x: 14, y: 10, layer: 1 },
    });

    const result = rollingWildlifeWolfHowlSummon({
      instance: wolf,
      event: HOWL_EVENT,
      nowMs: 1_000,
      random: () => 0.999,
    });

    expect(result.aiState.howlSummon ?? null).toBeNull();
  });

  it('ignores wolves outside the attract radius', () => {
    const wolf = creatingWildlifeTestInstance({
      instanceId: 'wildlife:listener',
      position: {
        x: 10 + DEFINING_WILDLIFE_WOLF_HOWL_ATTRACT_RADIUS_GRID + 1,
        y: 10,
        layer: 1,
      },
    });

    const result = rollingWildlifeWolfHowlSummon({
      instance: wolf,
      event: HOWL_EVENT,
      nowMs: 1_000,
      random: () => 0,
    });

    expect(result).toBe(wolf);
  });

  it('ignores the howler itself, non-wolves, and wolves in combat', () => {
    const howler = creatingWildlifeTestInstance({
      instanceId: 'wildlife:howler',
      position: { x: 10, y: 10, layer: 1 },
    });
    const sheep = creatingWildlifeTestInstance({
      instanceId: 'wildlife:sheep',
      speciesId: 'sheep',
      position: { x: 12, y: 10, layer: 1 },
    });
    const fighter = creatingWildlifeTestInstance({
      instanceId: 'wildlife:fighter',
      position: { x: 12, y: 10, layer: 1 },
      aggroState: {
        threats: [],
        activeTargetId: 'player:1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: null,
        stalkAttackingPreySinceMs: null,
        stalkPhase: 'idle',
        stalkPhaseEnteredAtMs: null,
        pendingStalkEvents: [],
      },
    });

    for (const instance of [howler, sheep, fighter]) {
      const result = rollingWildlifeWolfHowlSummon({
        instance,
        event: HOWL_EVENT,
        nowMs: 1_000,
        random: () => 0,
      });

      expect(result).toBe(instance);
    }
  });

  it('does not overwrite an active summon', () => {
    const wolf = creatingWildlifeTestInstance({
      instanceId: 'wildlife:listener',
      position: { x: 14, y: 10, layer: 1 },
      aiState: creatingWildlifeTestAiState({
        howlSummon: {
          targetPoint: { x: 0, y: 0, layer: 1 },
          howlerInstanceId: 'wildlife:other',
          untilMs: 50_000,
        },
      }),
    });

    const result = rollingWildlifeWolfHowlSummon({
      instance: wolf,
      event: HOWL_EVENT,
      nowMs: 1_000,
      random: () => 0,
    });

    expect(result).toBe(wolf);
  });
});
