import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import type { DefiningWorldPlazaFireIntensityTier } from '@/components/world/fire/domains/definingWorldPlazaFireSpriteConstants';

/** Built-in clip id for procedural lava floor tiles. */
export const DEFINING_WORLD_PLAZA_ANIMATION_CLIP_LAVA_TILE = 'lava-tile';

/** Built-in clip id prefix for avatar directional motion clips. */
export const DEFINING_WORLD_PLAZA_ANIMATION_CLIP_AVATAR_MOTION_PREFIX =
  'avatar-motion-';

/** Clip id prefix for campfire/spreading flame strips. */
export const DEFINING_WORLD_PLAZA_ANIMATION_CLIP_FIRE_FLAME_PREFIX =
  'fire-flame-';

/** Clip id prefix for fire smoke strips. */
export const DEFINING_WORLD_PLAZA_ANIMATION_CLIP_FIRE_SMOKE_PREFIX =
  'fire-smoke-';

/** One-shot Buff1 pillar when the local player switches avatar skins. */
export const DEFINING_WORLD_PLAZA_ANIMATION_CLIP_AVATAR_CHARACTER_SWITCH_EFFECT =
  'avatar-character-switch-effect';

/** Avatar locomotion and GirlSample combat clip suffixes registered per skin. */
export type DefiningWorldPlazaAvatarMotionClipSuffix =
  | 'walk'
  | 'run'
  | 'jump'
  | 'idle'
  | 'fall'
  | 'roll'
  | 'melee'
  | 'damaged'
  | 'death'
  | 'push'
  | 'boost'
  | 'block';

/**
 * Builds a registered avatar motion clip id (`avatar-motion-husky-walk`).
 */
export function formattingWorldPlazaAvatarMotionClipId(
  skinId: DefiningWorldPlazaAvatarSkinId,
  motionSuffix: DefiningWorldPlazaAvatarMotionClipSuffix
): string {
  return `${DEFINING_WORLD_PLAZA_ANIMATION_CLIP_AVATAR_MOTION_PREFIX}${skinId}-${motionSuffix}`;
}

/**
 * Builds a fire flame clip id (`fire-flame-5-3`).
 */
export function formattingWorldPlazaFireFlameClipId(
  flameGroup: number,
  tier: DefiningWorldPlazaFireIntensityTier
): string {
  return `${DEFINING_WORLD_PLAZA_ANIMATION_CLIP_FIRE_FLAME_PREFIX}${flameGroup}-${tier}`;
}

/**
 * Builds a fire smoke clip id (`fire-smoke-3`).
 */
export function formattingWorldPlazaFireSmokeClipId(
  tier: DefiningWorldPlazaFireIntensityTier
): string {
  return `${DEFINING_WORLD_PLAZA_ANIMATION_CLIP_FIRE_SMOKE_PREFIX}${tier}`;
}
