import { buildingWorldPlazaAnimationClipFromFrameList } from '@/components/world/animation/domains/buildingWorldPlazaAnimationClipFromFrameList';
import {
  formattingWorldPlazaFireFlameClipId,
  formattingWorldPlazaFireSmokeClipId,
} from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { registeringWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import {
  DEFINING_WORLD_PLAZA_FIRE_FLAME_ANIMATION_SPEED,
  DEFINING_WORLD_PLAZA_FIRE_FLAME_GROUP_CAMPFIRE,
  DEFINING_WORLD_PLAZA_FIRE_FLAME_GROUP_SPREADING,
  DEFINING_WORLD_PLAZA_FIRE_SMOKE_ANIMATION_SPEED,
  type DefiningWorldPlazaFireIntensityTier,
} from '@/components/world/fire/domains/definingWorldPlazaFireSpriteConstants';
import {
  peekingWorldPlazaFireFlameFrameTextures,
  peekingWorldPlazaFireSmokeFrameTextures,
} from '@/components/world/fire/domains/loadingWorldPlazaFireSpriteTextures';

/**
 * Registers every fire flame and smoke clip after sprite sheets preload.
 *
 * @module components/world/animation/domains/registeringWorldPlazaFireAnimationClips
 */

const REGISTERING_WORLD_PLAZA_FIRE_ANIMATION_FLAME_GROUPS = [
  DEFINING_WORLD_PLAZA_FIRE_FLAME_GROUP_CAMPFIRE,
  DEFINING_WORLD_PLAZA_FIRE_FLAME_GROUP_SPREADING,
] as const;

const REGISTERING_WORLD_PLAZA_FIRE_ANIMATION_TIERS: DefiningWorldPlazaFireIntensityTier[] =
  [1, 2, 3, 4, 5];

/** Pixi AnimatedSprite speed 0.18 ≈ 10.8 fps at 60 Hz ticker baseline. */
const REGISTERING_WORLD_PLAZA_FIRE_FLAME_ANIMATION_FPS =
  DEFINING_WORLD_PLAZA_FIRE_FLAME_ANIMATION_SPEED * 60;

const REGISTERING_WORLD_PLAZA_FIRE_SMOKE_ANIMATION_FPS =
  DEFINING_WORLD_PLAZA_FIRE_SMOKE_ANIMATION_SPEED * 60;

let didRegisterFireAnimationClips = false;

/**
 * Idempotently registers `fire-flame-{group}-{tier}` and `fire-smoke-{tier}` clips.
 */
export function registeringWorldPlazaFireAnimationClips(): void {
  if (didRegisterFireAnimationClips) {
    return;
  }

  didRegisterFireAnimationClips = true;

  for (const flameGroup of REGISTERING_WORLD_PLAZA_FIRE_ANIMATION_FLAME_GROUPS) {
    for (const tier of REGISTERING_WORLD_PLAZA_FIRE_ANIMATION_TIERS) {
      registeringWorldPlazaAnimationClip(
        buildingWorldPlazaAnimationClipFromFrameList({
          clipId: formattingWorldPlazaFireFlameClipId(flameGroup, tier),
          resolveFrames: () =>
            peekingWorldPlazaFireFlameFrameTextures(flameGroup, tier),
          fps: REGISTERING_WORLD_PLAZA_FIRE_FLAME_ANIMATION_FPS,
          playbackMode: 'loop',
          randomizePhase: true,
        })
      );
    }
  }

  for (const tier of REGISTERING_WORLD_PLAZA_FIRE_ANIMATION_TIERS) {
    registeringWorldPlazaAnimationClip(
      buildingWorldPlazaAnimationClipFromFrameList({
        clipId: formattingWorldPlazaFireSmokeClipId(tier),
        resolveFrames: () => peekingWorldPlazaFireSmokeFrameTextures(tier),
        fps: REGISTERING_WORLD_PLAZA_FIRE_SMOKE_ANIMATION_FPS,
        playbackMode: 'loop',
        randomizePhase: true,
      })
    );
  }
}

/**
 * Resets fire clip registration (tests only).
 */
export function resettingWorldPlazaFireAnimationClipsForTests(): void {
  didRegisterFireAnimationClips = false;
}
