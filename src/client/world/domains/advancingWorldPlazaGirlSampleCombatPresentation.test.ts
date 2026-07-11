import { advancingWorldPlazaGirlSampleCombatPresentation } from '@/components/world/domains/advancingWorldPlazaGirlSampleCombatPresentation';
import { resolvingWorldPlazaAvatarCharacterDefinition } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import {
  DEFINING_WORLD_PLAZA_SLEEP_FALL_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_SLEEP_HOLD_FRAME_INDEX,
} from '@/components/world/health/domains/definingWorldPlazaEntitySleepConstants';
import { describe, expect, it } from 'vitest';

const characterDefinition = resolvingWorldPlazaAvatarCharacterDefinition(
  DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
);

describe('advancingWorldPlazaGirlSampleCombatPresentation sleep', () => {
  it('holds the last opaque death frame instead of the empty fade-out cell', () => {
    const sleepStartedAtMs = 1000;
    const holdElapsedMs =
      ((DEFINING_WORLD_PLAZA_SLEEP_HOLD_FRAME_INDEX + 2) /
        DEFINING_WORLD_PLAZA_SLEEP_FALL_ANIMATION_FPS) *
      1000;

    const presentation = advancingWorldPlazaGirlSampleCombatPresentation({
      nowMs: sleepStartedAtMs + holdElapsedMs,
      characterDefinition,
      hasCombatTextures: true,
      hasRollClipReady: false,
      isPlayerDead: false,
      isPlayerAsleep: true,
      defaultDirection: 'Down',
      healthState: null,
      defensiveReactionUntilMs: 0,
      rollState: null,
      meleeState: null,
      pushState: null,
      blockReactionState: null,
      damagedState: null,
      deathState: null,
      sleepState: { direction: 'Down', startedAtMs: sleepStartedAtMs },
      isLocomoting: false,
    });

    expect(presentation).toEqual({
      motionSuffix: 'death',
      direction: 'Down',
      frameIndex: DEFINING_WORLD_PLAZA_SLEEP_HOLD_FRAME_INDEX,
      blocksLocomotion: true,
    });
  });

  it('advances through earlier death frames while falling asleep', () => {
    const sleepStartedAtMs = 1000;
    const midFallElapsedMs =
      (10 / DEFINING_WORLD_PLAZA_SLEEP_FALL_ANIMATION_FPS) * 1000;

    const presentation = advancingWorldPlazaGirlSampleCombatPresentation({
      nowMs: sleepStartedAtMs + midFallElapsedMs,
      characterDefinition,
      hasCombatTextures: true,
      hasRollClipReady: false,
      isPlayerDead: false,
      isPlayerAsleep: true,
      defaultDirection: 'Down',
      healthState: null,
      defensiveReactionUntilMs: 0,
      rollState: null,
      meleeState: null,
      pushState: null,
      blockReactionState: null,
      damagedState: null,
      deathState: null,
      sleepState: { direction: 'Right', startedAtMs: sleepStartedAtMs },
      isLocomoting: false,
    });

    expect(presentation?.frameIndex).toBe(10);
    expect(presentation?.direction).toBe('Right');
  });
});
