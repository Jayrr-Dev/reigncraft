/**
 * Builds avatar character definitions from the animal playable skin registry.
 *
 * @module components/world/domains/resolvingWorldPlazaAnimalAvatarCharacterDefinitionFromRegistry
 */

import {
  DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_FALL_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_IDLE_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_JUMP_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_RUN_ANIMATION_FPS,
  DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_WALK_ANIMATION_FPS,
  resolvingWorldPlazaAnimalPlayableAvatarSkinRow,
  type DefiningWorldPlazaAnimalPlayableAvatarSkinRow,
} from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import type { DefiningWorldPlazaAvatarCharacterDefinition } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';
import { loadingWorldPlazaAnimalAvatarCharacterTextures } from '@/components/world/domains/loadingWorldPlazaAnimalAvatarCharacterTextures';
import { definingWildlifeMotionSheetLayout } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';

function buildingWorldPlazaAnimalAvatarCharacterTexturesQueryKey(
  skinRow: DefiningWorldPlazaAnimalPlayableAvatarSkinRow
): readonly unknown[] {
  return [
    'world-plaza',
    skinRow.skinId,
    'character-textures',
    'animal-playable-registry',
    skinRow.frameHeightPx,
    skinRow.jumpSource,
  ] as const;
}

/**
 * Resolves one animal playable skin into a full avatar character definition.
 */
export function resolvingWorldPlazaAnimalAvatarCharacterDefinitionFromRegistry(
  skinId: string
): DefiningWorldPlazaAvatarCharacterDefinition | null {
  const skinRow = resolvingWorldPlazaAnimalPlayableAvatarSkinRow(skinId);

  if (!skinRow) {
    return null;
  }

  const motionSheetLayout = definingWildlifeMotionSheetLayout(
    skinRow.frameHeightPx,
    skinRow.frameHeightPx
  );

  return {
    skinId,
    gameplayStats: { hungerDrainMultiplier: skinRow.hungerDrainMultiplier },
    loadTextures: () => loadingWorldPlazaAnimalAvatarCharacterTextures(skinId),
    texturesQueryKey:
      buildingWorldPlazaAnimalAvatarCharacterTexturesQueryKey(skinRow),
    walkSheetLayout: motionSheetLayout,
    runSheetLayout: motionSheetLayout,
    jumpSheetLayout: motionSheetLayout,
    idleSheetLayout: motionSheetLayout,
    fallSheetLayout: motionSheetLayout,
    walkAnimationFps: DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_WALK_ANIMATION_FPS,
    runAnimationFps: DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_RUN_ANIMATION_FPS,
    jumpAnimationFps: DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_JUMP_ANIMATION_FPS,
    idleAnimationFps: DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_IDLE_ANIMATION_FPS,
    fallAnimationFps: DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_FALL_ANIMATION_FPS,
    fallSpriteDirection: skinRow.fallSpriteDirection,
    anchorXNormalized: skinRow.anchorXNormalized,
    anchorYNormalized: skinRow.anchorYNormalized,
    spriteScale: skinRow.spriteScale,
    footOffsetBelowGridAnchorPx: skinRow.footOffsetBelowGridAnchorPx,
    defaultDirection: skinRow.defaultDirection,
  };
}
