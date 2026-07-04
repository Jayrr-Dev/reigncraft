import type { WorldFireDevvitCellKind } from '../../../../shared/worldFireDevvit';

/** Frames per fire/smoke sprite sheet (horizontal strip). */
export const DEFINING_WORLD_PLAZA_FIRE_SPRITE_FRAME_COUNT = 8;

/** Pixi AnimatedSprite playback speed for flame loops. */
export const DEFINING_WORLD_PLAZA_FIRE_FLAME_ANIMATION_SPEED = 0.18;

/** Pixi AnimatedSprite playback speed for smoke loops. */
export const DEFINING_WORLD_PLAZA_FIRE_SMOKE_ANIMATION_SPEED = 0.1;

/** Flame sprite group for campfires. */
export const DEFINING_WORLD_PLAZA_FIRE_FLAME_GROUP_CAMPFIRE = 5;

/** Flame sprite group for spreading block fires. */
export const DEFINING_WORLD_PLAZA_FIRE_FLAME_GROUP_SPREADING = 7;

/** Intensity tier (1 = ember, 5 = roaring). */
export type DefiningWorldPlazaFireIntensityTier = 1 | 2 | 3 | 4 | 5;

/**
 * Maps fuel intensity (0..1) to one of five sprite variants.
 *
 * @param intensity - Remaining fuel intensity from the fire cell.
 */
export function resolvingWorldPlazaFireIntensityTier(
  intensity: number
): DefiningWorldPlazaFireIntensityTier {
  const clamped = Math.max(0, Math.min(1, intensity));

  if (clamped < 0.2) {
    return 1;
  }

  if (clamped < 0.4) {
    return 2;
  }

  if (clamped < 0.6) {
    return 3;
  }

  if (clamped < 0.8) {
    return 4;
  }

  return 5;
}

/**
 * Resolves the flame sprite group for a fire cell kind.
 *
 * @param kind - Campfire or spreading fire.
 */
export function resolvingWorldPlazaFireFlameGroupForKind(
  kind: WorldFireDevvitCellKind
): number {
  return kind === 'spreading'
    ? DEFINING_WORLD_PLAZA_FIRE_FLAME_GROUP_SPREADING
    : DEFINING_WORLD_PLAZA_FIRE_FLAME_GROUP_CAMPFIRE;
}

/**
 * Public URL for a red flame sprite sheet.
 *
 * @param group - Flame group number (5 = campfire, 7 = spreading).
 * @param tier - Intensity tier 1..5.
 */
export function resolvingWorldPlazaFireFlameSheetUrl(
  group: number,
  tier: DefiningWorldPlazaFireIntensityTier
): string {
  return `/fire asset red/Group ${group} - ${tier}/Group ${group} - ${tier}.png`;
}

/**
 * Public URL for a light smoke sprite sheet.
 *
 * @param tier - Intensity tier 1..5.
 */
export function resolvingWorldPlazaFireSmokeSheetUrl(
  tier: DefiningWorldPlazaFireIntensityTier
): string {
  return `/fire asset smoke/Smoke Light - ${tier}/Smoke Light - ${tier}.png`;
}

/**
 * Display scale for a flame tier in isometric world-local pixels.
 *
 * @param tier - Intensity tier 1..5.
 */
export function resolvingWorldPlazaFireFlameDisplayScaleForTier(
  tier: DefiningWorldPlazaFireIntensityTier
): number {
  return 0.85 + tier * 0.14;
}

/**
 * Smoke alpha from intensity tier; hidden on the lowest tier.
 *
 * @param tier - Intensity tier 1..5.
 */
export function resolvingWorldPlazaFireSmokeAlphaForTier(
  tier: DefiningWorldPlazaFireIntensityTier
): number {
  if (tier <= 1) {
    return 0;
  }

  return Math.min(0.72, 0.18 + tier * 0.11);
}
