import type { DefiningWorldPlazaAvatarMotionClipSuffix } from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import type { DefiningWorldPlazaAvatarCharacterDefinition } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';
import type {
  DefiningWorldPlazaAvatarBlockReactionPresentationState,
  DefiningWorldPlazaAvatarDamagedPresentationState,
  DefiningWorldPlazaAvatarDeathPresentationState,
  DefiningWorldPlazaAvatarMeleePresentationState,
  DefiningWorldPlazaAvatarPushPresentationState,
  DefiningWorldPlazaAvatarRollPresentationState,
  DefiningWorldPlazaAvatarSleepPresentationState,
} from '@/components/world/domains/definingWorldPlazaAvatarCombatPresentationTypes';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_REACTION_DURATION_MS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_DURATION_MS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_DURATION_MS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DURATION_MS,
} from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { resolvingWorldPlazaAvatarClipPresentation } from '@/components/world/domains/resolvingWorldPlazaAvatarClipPresentation';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { DEFINING_WORLD_PLAZA_SLEEP_FALL_ANIMATION_FPS } from '@/components/world/health/domains/definingWorldPlazaEntitySleepConstants';

export type AdvancingWorldPlazaGirlSampleCombatPresentationParams = {
  readonly nowMs: number;
  readonly characterDefinition: DefiningWorldPlazaAvatarCharacterDefinition;
  readonly hasCombatTextures: boolean;
  readonly hasRollClipReady: boolean;
  readonly isPlayerDead: boolean;
  readonly isPlayerAsleep: boolean;
  readonly defaultDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly healthState: DefiningWorldPlazaEntityHealthState | null;
  readonly defensiveReactionUntilMs: number;
  readonly rollState: DefiningWorldPlazaAvatarRollPresentationState | null;
  readonly meleeState: DefiningWorldPlazaAvatarMeleePresentationState | null;
  readonly pushState: DefiningWorldPlazaAvatarPushPresentationState | null;
  readonly blockReactionState: DefiningWorldPlazaAvatarBlockReactionPresentationState | null;
  readonly damagedState: DefiningWorldPlazaAvatarDamagedPresentationState | null;
  readonly deathState: DefiningWorldPlazaAvatarDeathPresentationState | null;
  readonly sleepState: DefiningWorldPlazaAvatarSleepPresentationState | null;
  readonly isLocomoting: boolean;
};

export type AdvancingWorldPlazaGirlSampleCombatPresentationResult = {
  readonly motionSuffix: DefiningWorldPlazaAvatarMotionClipSuffix;
  readonly direction: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly frameIndex: number;
  readonly blocksLocomotion: boolean;
};

function resolvingCombatClipFrameIndex(
  elapsedMs: number,
  durationMs: number,
  fps: number,
  frameCount: number,
  playbackMode: 'once' | 'loop'
): number {
  if (playbackMode === 'loop') {
    return Math.floor((elapsedMs / 1000) * fps) % frameCount;
  }

  const frameIndex = Math.floor((elapsedMs / 1000) * fps);

  if (elapsedMs >= durationMs) {
    return frameCount - 1;
  }

  return Math.min(frameCount - 1, frameIndex);
}

/**
 * Picks the highest-priority GirlSample combat presentation clip for one frame.
 */
export function advancingWorldPlazaGirlSampleCombatPresentation(
  params: AdvancingWorldPlazaGirlSampleCombatPresentationParams
): AdvancingWorldPlazaGirlSampleCombatPresentationResult | null {
  if (!params.hasCombatTextures && !params.hasRollClipReady) {
    return null;
  }

  if (params.isPlayerDead && params.deathState) {
    const presentation = resolvingWorldPlazaAvatarClipPresentation(
      params.characterDefinition,
      'death'
    );
    const elapsedMs = params.nowMs - params.deathState.startedAtMs;

    return {
      motionSuffix: 'death',
      direction: params.deathState.direction,
      frameIndex: resolvingCombatClipFrameIndex(
        elapsedMs,
        Number.POSITIVE_INFINITY,
        presentation.animationFps,
        presentation.sheetLayout.frameCount,
        'once'
      ),
      blocksLocomotion: true,
    };
  }

  if (params.isPlayerAsleep && params.sleepState && params.hasCombatTextures) {
    const presentation = resolvingWorldPlazaAvatarClipPresentation(
      params.characterDefinition,
      'death'
    );
    const elapsedMs = params.nowMs - params.sleepState.startedAtMs;

    return {
      motionSuffix: 'death',
      direction: params.sleepState.direction,
      frameIndex: resolvingCombatClipFrameIndex(
        elapsedMs,
        Number.POSITIVE_INFINITY,
        DEFINING_WORLD_PLAZA_SLEEP_FALL_ANIMATION_FPS,
        presentation.sheetLayout.frameCount,
        'once'
      ),
      blocksLocomotion: true,
    };
  }

  if (params.rollState && params.hasRollClipReady) {
    const elapsedMs = params.nowMs - params.rollState.startedAtMs;

    if (elapsedMs < DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DURATION_MS) {
      const presentation = resolvingWorldPlazaAvatarClipPresentation(
        params.characterDefinition,
        'roll'
      );
      return {
        motionSuffix: 'roll',
        direction: params.rollState.direction,
        frameIndex: resolvingCombatClipFrameIndex(
          elapsedMs,
          DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DURATION_MS,
          presentation.animationFps,
          presentation.sheetLayout.frameCount,
          'once'
        ),
        blocksLocomotion: true,
      };
    }
  }

  if (params.meleeState) {
    const elapsedMs = params.nowMs - params.meleeState.startedAtMs;

    if (elapsedMs < params.meleeState.durationMs) {
      const presentation = resolvingWorldPlazaAvatarClipPresentation(
        params.characterDefinition,
        'melee'
      );

      return {
        motionSuffix: 'melee',
        direction: params.meleeState.direction,
        frameIndex: resolvingCombatClipFrameIndex(
          elapsedMs,
          params.meleeState.durationMs,
          params.meleeState.animationFps,
          presentation.sheetLayout.frameCount,
          'once'
        ),
        blocksLocomotion: true,
      };
    }
  }

  if (
    params.damagedState &&
    params.nowMs - params.damagedState.startedAtMs <
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_DURATION_MS
  ) {
    const presentation = resolvingWorldPlazaAvatarClipPresentation(
      params.characterDefinition,
      'damaged'
    );
    const elapsedMs = params.nowMs - params.damagedState.startedAtMs;

    return {
      motionSuffix: 'damaged',
      direction: params.damagedState.direction,
      frameIndex: resolvingCombatClipFrameIndex(
        elapsedMs,
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_DURATION_MS,
        presentation.animationFps,
        presentation.sheetLayout.frameCount,
        'once'
      ),
      blocksLocomotion: true,
    };
  }

  if (
    params.blockReactionState &&
    params.nowMs - params.blockReactionState.startedAtMs <
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_REACTION_DURATION_MS &&
    params.nowMs < params.defensiveReactionUntilMs
  ) {
    const presentation = resolvingWorldPlazaAvatarClipPresentation(
      params.characterDefinition,
      'block'
    );
    const elapsedMs = params.nowMs - params.blockReactionState.startedAtMs;

    return {
      motionSuffix: 'block',
      direction: params.blockReactionState.direction,
      frameIndex: resolvingCombatClipFrameIndex(
        elapsedMs,
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_REACTION_DURATION_MS,
        presentation.animationFps,
        presentation.sheetLayout.frameCount,
        'once'
      ),
      blocksLocomotion: false,
    };
  }

  if (
    params.pushState &&
    params.nowMs - params.pushState.startedAtMs <
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_DURATION_MS
  ) {
    const presentation = resolvingWorldPlazaAvatarClipPresentation(
      params.characterDefinition,
      'push'
    );
    const elapsedMs = params.nowMs - params.pushState.startedAtMs;

    return {
      motionSuffix: 'push',
      direction: params.pushState.direction,
      frameIndex: resolvingCombatClipFrameIndex(
        elapsedMs,
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_DURATION_MS,
        presentation.animationFps,
        presentation.sheetLayout.frameCount,
        'once'
      ),
      blocksLocomotion: false,
    };
  }

  return null;
}
