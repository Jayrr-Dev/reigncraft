/**
 * Registers the Buff1 character-switch one-shot clip.
 *
 * @module components/world/animation/domains/registeringWorldPlazaAvatarCharacterSwitchEffectAnimationClip
 */

import { buildingWorldPlazaAnimationClipFromFrameList } from '@/components/world/animation/domains/buildingWorldPlazaAnimationClipFromFrameList';
import { DEFINING_WORLD_PLAZA_ANIMATION_CLIP_AVATAR_CHARACTER_SWITCH_EFFECT } from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { registeringWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_FPS } from '@/components/world/domains/definingWorldPlazaAvatarCharacterSwitchEffectConstants';
import { peekingWorldPlazaAvatarCharacterSwitchEffectFrameTextures } from '@/components/world/domains/loadingWorldPlazaAvatarCharacterSwitchEffectTextures';

let didRegisterCharacterSwitchEffectClip = false;

/**
 * Idempotently registers `avatar-character-switch-effect` after frames load.
 */
export function registeringWorldPlazaAvatarCharacterSwitchEffectAnimationClip(): void {
  if (didRegisterCharacterSwitchEffectClip) {
    return;
  }

  if (!peekingWorldPlazaAvatarCharacterSwitchEffectFrameTextures()) {
    return;
  }

  didRegisterCharacterSwitchEffectClip = true;

  registeringWorldPlazaAnimationClip(
    buildingWorldPlazaAnimationClipFromFrameList({
      clipId:
        DEFINING_WORLD_PLAZA_ANIMATION_CLIP_AVATAR_CHARACTER_SWITCH_EFFECT,
      resolveFrames: () =>
        peekingWorldPlazaAvatarCharacterSwitchEffectFrameTextures(),
      fps: DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_SWITCH_EFFECT_FPS,
      playbackMode: 'once',
    })
  );
}

/**
 * Resets registration (tests only).
 */
export function resettingWorldPlazaAvatarCharacterSwitchEffectAnimationClipForTests(): void {
  didRegisterCharacterSwitchEffectClip = false;
}
