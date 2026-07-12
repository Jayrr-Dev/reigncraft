/**
 * Per-skin avatar character definitions for the local plaza player.
 *
 * Each definition bundles everything the avatar tick needs that differs between
 * skins: the texture loader, its TanStack Query key, the motion sheet layouts,
 * per-motion frame rates, and rendering tuning (anchor, scale, default facing).
 *
 * Movement physics (jump distance, arc height, jump/fall timing) stay shared
 * across skins, so only presentation varies when switching the local avatar.
 *
 * @module components/world/domains/definingWorldPlazaAvatarCharacterDefinition
 */

import {
  DEFINING_WORLD_PLAZA_AVATAR_SKIN,
  DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT,
  type DefiningWorldPlazaAvatarSkinId,
} from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import {
  DEFINING_WORLD_PLAZA_FOX_PEACH_ANCHOR_X_NORMALIZED,
  DEFINING_WORLD_PLAZA_FOX_PEACH_ANCHOR_Y_NORMALIZED,
  DEFINING_WORLD_PLAZA_FOX_PEACH_CHARACTER_TEXTURES_QUERY_KEY,
  DEFINING_WORLD_PLAZA_FOX_PEACH_DEFAULT_DIRECTION,
  DEFINING_WORLD_PLAZA_FOX_PEACH_FALL_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_FOX_PEACH_FALL_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_FOX_PEACH_FALL_SPRITE_DIRECTION,
  DEFINING_WORLD_PLAZA_FOX_PEACH_IDLE_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_FOX_PEACH_IDLE_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_FOX_PEACH_JUMP_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_FOX_PEACH_JUMP_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_FOX_PEACH_RUN_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_FOX_PEACH_RUN_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_FOX_PEACH_SPRITE_SCALE,
  DEFINING_WORLD_PLAZA_FOX_PEACH_WALK_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_FOX_PEACH_WALK_MOTION_SHEET_LAYOUT,
  computingWorldPlazaFoxPeachFootOffsetBelowGridAnchorPx,
} from '@/components/world/domains/definingWorldPlazaFoxPeachSpriteConstants';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_SPRITE_DIRECTION,
} from '@/components/world/domains/definingWorldPlazaGirlSampleFallConstants';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_MOTION_SHEET_LAYOUT,
} from '@/components/world/domains/definingWorldPlazaGirlSampleIdleConstants';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_MOTION_SHEET_LAYOUT,
} from '@/components/world/domains/definingWorldPlazaGirlSampleJumpConstants';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_CHARACTER_TEXTURES_QUERY_KEY,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_X_NORMALIZED,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_Y_NORMALIZED,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_MOTION_SHEET_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_SPRITE_SCALE,
  computingWorldPlazaGirlSampleFootOffsetBelowGridAnchorPx,
  type DefiningWorldPlazaGirlSampleMotionSheetLayout,
  type DefiningWorldPlazaGirlSampleWalkDirection,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { loadingWorldPlazaFoxPeachCharacterTextures } from '@/components/world/domains/loadingWorldPlazaFoxPeachCharacterTextures';
import type { DefiningWorldPlazaGirlSampleCharacterTextures } from '@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures';
import { loadingWorldPlazaGirlSampleCharacterTextures } from '@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures';
import { resolvingWorldPlazaAnimalAvatarCharacterDefinitionFromRegistry } from '@/components/world/domains/resolvingWorldPlazaAnimalAvatarCharacterDefinitionFromRegistry';

/** Gameplay-affecting stats for one selectable avatar skin. */
export interface DefiningWorldPlazaAvatarCharacterGameplayStats {
  /** Multiplies baseline hunger drain (1 = average metabolism). */
  readonly hungerDrainMultiplier: number;
}

/** Presentation bundle for one selectable avatar skin. */
export interface DefiningWorldPlazaAvatarCharacterDefinition {
  readonly skinId: DefiningWorldPlazaAvatarSkinId;
  readonly gameplayStats: DefiningWorldPlazaAvatarCharacterGameplayStats;
  readonly loadTextures: () => Promise<DefiningWorldPlazaGirlSampleCharacterTextures>;
  readonly texturesQueryKey: readonly unknown[];
  readonly walkSheetLayout: DefiningWorldPlazaGirlSampleMotionSheetLayout;
  readonly runSheetLayout: DefiningWorldPlazaGirlSampleMotionSheetLayout;
  readonly jumpSheetLayout: DefiningWorldPlazaGirlSampleMotionSheetLayout;
  readonly idleSheetLayout: DefiningWorldPlazaGirlSampleMotionSheetLayout;
  readonly fallSheetLayout: DefiningWorldPlazaGirlSampleMotionSheetLayout;
  readonly walkAnimationFps: number;
  readonly runAnimationFps: number;
  readonly jumpAnimationFps: number;
  readonly idleAnimationFps: number;
  readonly fallAnimationFps: number;
  readonly fallSpriteDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly anchorXNormalized: number;
  readonly anchorYNormalized: number;
  readonly spriteScale: number;
  /** Distance from grid anchor to painted feet for ground shadow placement. */
  readonly footOffsetBelowGridAnchorPx?: number;
  readonly defaultDirection: DefiningWorldPlazaGirlSampleWalkDirection;
}

/** GirlSample skin: the original 8-direction plaza test avatar. */
const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_CHARACTER_DEFINITION: DefiningWorldPlazaAvatarCharacterDefinition =
  {
    skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE,
    gameplayStats: { hungerDrainMultiplier: 1.0 },
    loadTextures: loadingWorldPlazaGirlSampleCharacterTextures,
    texturesQueryKey:
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_CHARACTER_TEXTURES_QUERY_KEY,
    walkSheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_MOTION_SHEET_LAYOUT,
    runSheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_MOTION_SHEET_LAYOUT,
    jumpSheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_MOTION_SHEET_LAYOUT,
    idleSheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_MOTION_SHEET_LAYOUT,
    fallSheetLayout: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_MOTION_SHEET_LAYOUT,
    walkAnimationFps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANIMATION_FPS,
    runAnimationFps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_ANIMATION_FPS,
    jumpAnimationFps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_ANIMATION_FPS,
    idleAnimationFps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_IDLE_ANIMATION_FPS,
    fallAnimationFps: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_ANIMATION_FPS,
    fallSpriteDirection: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_SPRITE_DIRECTION,
    anchorXNormalized:
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_X_NORMALIZED,
    anchorYNormalized:
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_Y_NORMALIZED,
    spriteScale: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_SPRITE_SCALE,
    defaultDirection: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_DEFAULT_DIRECTION,
  };

/** Fox Peach skin: per-direction walk and idle strips, 256 px frames. */
const DEFINING_WORLD_PLAZA_FOX_PEACH_CHARACTER_DEFINITION: DefiningWorldPlazaAvatarCharacterDefinition =
  {
    skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.FOX_PEACH,
    gameplayStats: { hungerDrainMultiplier: 1.0 },
    loadTextures: loadingWorldPlazaFoxPeachCharacterTextures,
    texturesQueryKey:
      DEFINING_WORLD_PLAZA_FOX_PEACH_CHARACTER_TEXTURES_QUERY_KEY,
    walkSheetLayout: DEFINING_WORLD_PLAZA_FOX_PEACH_WALK_MOTION_SHEET_LAYOUT,
    runSheetLayout: DEFINING_WORLD_PLAZA_FOX_PEACH_RUN_MOTION_SHEET_LAYOUT,
    jumpSheetLayout: DEFINING_WORLD_PLAZA_FOX_PEACH_JUMP_MOTION_SHEET_LAYOUT,
    idleSheetLayout: DEFINING_WORLD_PLAZA_FOX_PEACH_IDLE_MOTION_SHEET_LAYOUT,
    fallSheetLayout: DEFINING_WORLD_PLAZA_FOX_PEACH_FALL_MOTION_SHEET_LAYOUT,
    walkAnimationFps: DEFINING_WORLD_PLAZA_FOX_PEACH_WALK_ANIMATION_FPS,
    runAnimationFps: DEFINING_WORLD_PLAZA_FOX_PEACH_RUN_ANIMATION_FPS,
    jumpAnimationFps: DEFINING_WORLD_PLAZA_FOX_PEACH_JUMP_ANIMATION_FPS,
    idleAnimationFps: DEFINING_WORLD_PLAZA_FOX_PEACH_IDLE_ANIMATION_FPS,
    fallAnimationFps: DEFINING_WORLD_PLAZA_FOX_PEACH_FALL_ANIMATION_FPS,
    fallSpriteDirection: DEFINING_WORLD_PLAZA_FOX_PEACH_FALL_SPRITE_DIRECTION,
    anchorXNormalized: DEFINING_WORLD_PLAZA_FOX_PEACH_ANCHOR_X_NORMALIZED,
    anchorYNormalized: DEFINING_WORLD_PLAZA_FOX_PEACH_ANCHOR_Y_NORMALIZED,
    spriteScale: DEFINING_WORLD_PLAZA_FOX_PEACH_SPRITE_SCALE,
    footOffsetBelowGridAnchorPx:
      computingWorldPlazaFoxPeachFootOffsetBelowGridAnchorPx(),
    defaultDirection: DEFINING_WORLD_PLAZA_FOX_PEACH_DEFAULT_DIRECTION,
  };

/** Special-pack character definitions keyed by skin id. */
const DEFINING_WORLD_PLAZA_SPECIAL_AVATAR_CHARACTER_DEFINITIONS: Readonly<
  Record<string, DefiningWorldPlazaAvatarCharacterDefinition>
> = {
  [DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE]:
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_CHARACTER_DEFINITION,
  [DEFINING_WORLD_PLAZA_AVATAR_SKIN.FOX_PEACH]:
    DEFINING_WORLD_PLAZA_FOX_PEACH_CHARACTER_DEFINITION,
};

/**
 * Resolves the character definition for a selected skin id.
 *
 * @param skinId - Currently selected avatar skin id.
 */
export function resolvingWorldPlazaAvatarCharacterDefinition(
  skinId: DefiningWorldPlazaAvatarSkinId
): DefiningWorldPlazaAvatarCharacterDefinition {
  const specialDefinition =
    DEFINING_WORLD_PLAZA_SPECIAL_AVATAR_CHARACTER_DEFINITIONS[skinId];

  if (specialDefinition) {
    return specialDefinition;
  }

  const registryDefinition =
    resolvingWorldPlazaAnimalAvatarCharacterDefinitionFromRegistry(skinId);

  if (registryDefinition) {
    return registryDefinition;
  }

  return DEFINING_WORLD_PLAZA_SPECIAL_AVATAR_CHARACTER_DEFINITIONS[
    DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT
  ];
}

/**
 * Resolves the sheet layout backing one registered motion clip suffix.
 *
 * @param characterDefinition - Active avatar presentation bundle.
 * @param clipSuffix - Registered motion clip suffix (walk, run, jump, idle, fall).
 */
export function resolvingWorldPlazaAvatarMotionSheetLayoutForClipSuffix(
  characterDefinition: DefiningWorldPlazaAvatarCharacterDefinition,
  clipSuffix: 'walk' | 'run' | 'jump' | 'idle' | 'fall'
): DefiningWorldPlazaGirlSampleMotionSheetLayout {
  const sheetLayoutsByClipSuffix = {
    walk: characterDefinition.walkSheetLayout,
    run: characterDefinition.runSheetLayout,
    jump: characterDefinition.jumpSheetLayout,
    idle: characterDefinition.idleSheetLayout,
    fall: characterDefinition.fallSheetLayout,
  } as const;

  return sheetLayoutsByClipSuffix[clipSuffix];
}

/**
 * Resolves painted-foot offset below the grid anchor for one avatar skin.
 *
 * @param characterDefinition - Active avatar presentation bundle.
 */
export function resolvingWorldPlazaAvatarFootOffsetBelowGridAnchorPx(
  characterDefinition: DefiningWorldPlazaAvatarCharacterDefinition
): number {
  return (
    characterDefinition.footOffsetBelowGridAnchorPx ??
    computingWorldPlazaGirlSampleFootOffsetBelowGridAnchorPx()
  );
}
