import { describe, expect, it } from 'vitest';

import {
  creatingWildlifeTestAiState,
  creatingWildlifeTestInstance,
} from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { resolvingWildlifeWolfHowlSummonOverride } from '@/components/world/wildlife/domains/resolvingWildlifeWolfHowlSummonIntent';

const SUMMON = {
  targetPoint: { x: 30, y: 30, layer: 1 },
  howlerInstanceId: 'wildlife:howler',
  untilMs: 60_000,
};

function creatingSummonedWolf(position = { x: 10, y: 10, layer: 1 }) {
  return creatingWildlifeTestInstance({
    position,
    aiState: creatingWildlifeTestAiState({ howlSummon: SUMMON }),
  });
}

describe('resolvingWildlifeWolfHowlSummonOverride', () => {
  it('overrides passive intents with a run toward the howl point', () => {
    const result = resolvingWildlifeWolfHowlSummonOverride({
      instance: creatingSummonedWolf(),
      intent: { mode: 'wander', targetPoint: { x: 5, y: 5, layer: 1 } },
      nowMs: 1_000,
    });

    expect(result.intent).toEqual({
      mode: 'seekPackmate',
      targetInstanceId: 'wildlife:howler',
      targetPoint: SUMMON.targetPoint,
    });
    expect(result.howlSummon).toEqual(SUMMON);
  });

  it('keeps combat intents but preserves the summon', () => {
    const attackIntent = {
      mode: 'attack' as const,
      targetInstanceId: 'player:1',
      targetPoint: { x: 11, y: 10, layer: 1 },
    };
    const result = resolvingWildlifeWolfHowlSummonOverride({
      instance: creatingSummonedWolf(),
      intent: attackIntent,
      nowMs: 1_000,
    });

    expect(result.intent).toBe(attackIntent);
    expect(result.howlSummon).toEqual(SUMMON);
  });

  it('clears the summon on expiry', () => {
    const result = resolvingWildlifeWolfHowlSummonOverride({
      instance: creatingSummonedWolf(),
      intent: { mode: 'idle' },
      nowMs: 60_001,
    });

    expect(result.intent).toEqual({ mode: 'idle' });
    expect(result.howlSummon).toBeNull();
  });

  it('clears the summon on arrival', () => {
    const result = resolvingWildlifeWolfHowlSummonOverride({
      instance: creatingSummonedWolf({ x: 29, y: 30, layer: 1 }),
      intent: { mode: 'idle' },
      nowMs: 1_000,
    });

    expect(result.intent).toEqual({ mode: 'idle' });
    expect(result.howlSummon).toBeNull();
  });

  it('passes through when no summon is set', () => {
    const result = resolvingWildlifeWolfHowlSummonOverride({
      instance: creatingWildlifeTestInstance(),
      intent: { mode: 'graze' },
      nowMs: 1_000,
    });

    expect(result.intent).toEqual({ mode: 'graze' });
    expect(result.howlSummon).toBeNull();
  });
});
