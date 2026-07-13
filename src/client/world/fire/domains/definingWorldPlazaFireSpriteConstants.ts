import { DEFINING_PUBLIC_SPRITE_ASSET_EXTENSION } from '@/components/world/domains/definingPublicSpriteAssetExtension';
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
 * Builds a browser-safe public URL from path segments with spaces or symbols.
 */
function encodingWorldPlazaFireSpritePublicAssetPath(
  segments: readonly string[]
): string {
  return `/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`;
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
  const sheetName = `Group ${group} - ${tier}`;

  return encodingWorldPlazaFireSpritePublicAssetPath([
    'fire',
    'sprites',
    'vfx',
    'fire-flame',
    sheetName,
    `${sheetName}${DEFINING_PUBLIC_SPRITE_ASSET_EXTENSION}`,
  ]);
}

/**
 * Public URL for a light smoke sprite sheet.
 *
 * @param tier - Intensity tier 1..5.
 */
export function resolvingWorldPlazaFireSmokeSheetUrl(
  tier: DefiningWorldPlazaFireIntensityTier
): string {
  const sheetName = `Smoke Light - ${tier}`;

  return encodingWorldPlazaFireSpritePublicAssetPath([
    'fire',
    'sprites',
    'vfx',
    'fire-smoke',
    sheetName,
    `${sheetName}${DEFINING_PUBLIC_SPRITE_ASSET_EXTENSION}`,
  ]);
}

/**
 * Authored flame frame heights (px). Tiers 3 and 5 ship smaller sheets than
 * the 32×48 baseline, so display scale must compensate or mid/high fuel looks
 * weaker than low fuel.
 */
export const DEFINING_WORLD_PLAZA_FIRE_FLAME_NATIVE_FRAME_HEIGHT_PX_BY_TIER: Record<
  DefiningWorldPlazaFireIntensityTier,
  number
> = {
  1: 48,
  2: 48,
  3: 32,
  4: 48,
  5: 32,
};

/** Baseline frame height used when compensating undersized flame sheets. */
export const DEFINING_WORLD_PLAZA_FIRE_FLAME_REFERENCE_FRAME_HEIGHT_PX = 48;

/**
 * Display scale for a flame tier in isometric world-local pixels.
 *
 * Includes a height-compensation factor so undersized authored sheets (tier 3
 * and 5) still grow with fuel instead of visually shrinking.
 *
 * @param tier - Intensity tier 1..5.
 */
export function resolvingWorldPlazaFireFlameDisplayScaleForTier(
  tier: DefiningWorldPlazaFireIntensityTier
): number {
  const intensityScale = 0.85 + tier * 0.14;
  const nativeFrameHeightPx =
    DEFINING_WORLD_PLAZA_FIRE_FLAME_NATIVE_FRAME_HEIGHT_PX_BY_TIER[tier];
  const frameSizeCompensation =
    DEFINING_WORLD_PLAZA_FIRE_FLAME_REFERENCE_FRAME_HEIGHT_PX /
    nativeFrameHeightPx;

  return intensityScale * frameSizeCompensation;
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
