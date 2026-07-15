import {
  formattingWorldPlazaAvatarMotionClipId,
  type DefiningWorldPlazaAvatarMotionClipSuffix,
} from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { resolvingWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { checkingWorldPlazaAvatarUsesGlowOrbPresentation } from '@/components/world/domains/checkingWorldPlazaAvatarUsesGlowOrbPresentation';
import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_COMBAT_MOTION_CLIP_SUFFIXES } from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';
import type { DefiningWorldPlazaGirlSampleCharacterTextures } from '@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures';

/**
 * True when every GirlSample combat strip loaded and its clip is registered.
 */
export function checkingWorldPlazaGirlSampleAvatarCombatClipsReady(
  skinId: DefiningWorldPlazaAvatarSkinId,
  textures: DefiningWorldPlazaGirlSampleCharacterTextures | undefined
): boolean {
  if (
    !textures?.roll ||
    !textures.melee ||
    !textures.damaged ||
    !textures.death ||
    !textures.push ||
    !textures.boost ||
    !textures.block
  ) {
    return false;
  }

  return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_COMBAT_MOTION_CLIP_SUFFIXES.every(
    (motionSuffix) =>
      resolvingWorldPlazaAnimationClip(
        formattingWorldPlazaAvatarMotionClipId(skinId, motionSuffix)
      ) !== null
  );
}

/**
 * True when roll strips loaded and the roll clip is registered for this skin.
 */
export function checkingWorldPlazaGirlSampleAvatarRollClipReady(
  skinId: DefiningWorldPlazaAvatarSkinId,
  textures: DefiningWorldPlazaGirlSampleCharacterTextures | undefined
): boolean {
  // Procedural glow-orb skins have no Attack3 sheet; roll still lunges + casts.
  if (checkingWorldPlazaAvatarUsesGlowOrbPresentation(skinId)) {
    return true;
  }

  if (!textures?.roll) {
    return false;
  }

  return checkingWorldPlazaGirlSampleAvatarMotionClipRegistered(skinId, 'roll');
}

/**
 * True when one registered clip exists for the requested motion suffix.
 */
export function checkingWorldPlazaGirlSampleAvatarMotionClipRegistered(
  skinId: DefiningWorldPlazaAvatarSkinId,
  motionSuffix: DefiningWorldPlazaAvatarMotionClipSuffix
): boolean {
  return (
    resolvingWorldPlazaAnimationClip(
      formattingWorldPlazaAvatarMotionClipId(skinId, motionSuffix)
    ) !== null
  );
}
