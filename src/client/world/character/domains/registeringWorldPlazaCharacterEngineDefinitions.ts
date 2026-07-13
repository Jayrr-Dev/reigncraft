/**
 * Default locomotion profile for standard player avatars.
 */
const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_DEFAULT_LOCOMOTION = {
  allowedMotionKinds: [
    'idle',
    'walk',
    'run',
    'jump',
  ] as const satisfies readonly DefiningWorldPlazaAvatarMotionKind[],
};

/**
 * Registry of declarative character definitions for plaza avatars.
 *
 * @module components/world/character/domains/registeringWorldPlazaCharacterEngineDefinitions
 */

import type { DefiningWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import { DEFINING_WORLD_PLAZA_CHARACTER_DEFAULT_MASS_KG } from '@/components/world/character/domains/definingWorldPlazaCharacterWeightDisplayConstants';
import { buildingWorldPlazaDefaultAnimalCharacterEngineDefinition } from '@/components/world/domains/buildingWorldPlazaDefaultAnimalCharacterEngineDefinition';
import { DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_AVATAR_SKIN_BY_ID } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import type { DefiningWorldPlazaAvatarMotionKind } from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';

const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GIRL_SAMPLE: DefiningWorldPlazaCharacterEngineDefinition =
  {
    characterId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE,
    displayName: 'Girl',
    presentation: { skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE },
    size: { sizeScale: 1 },
    locomotion: { ...DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_DEFAULT_LOCOMOTION },
    vitals: { baseMaxHealth: 1000 },
    massKg: DEFINING_WORLD_PLAZA_CHARACTER_DEFAULT_MASS_KG,
    stats: {
      attackPower: 300,
      attackSpeed: 1,
      defense: 5,
      hungerDrainMultiplier: 1,
    },
    scaling: {
      level: 1,
      healthPerLevel: 50,
      attackPerLevel: 2,
      defensePerLevel: 1,
    },
    immunities: [],
    startingStatusEffectIds: [],
    skillIds: ['minor-heal', 'swift-stride'],
  };

/**
 * Stable engine defs for every playable animal skin.
 * Animals inherit wildlife vitals via the default factory; Girl is hand-tuned.
 * Must stay referentially stable: player health reseeds when this object identity changes.
 */
export const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_DEFINITIONS: Record<
  string,
  DefiningWorldPlazaCharacterEngineDefinition
> = {
  ...Object.fromEntries(
    Object.values(DEFINING_WORLD_PLAZA_ANIMAL_PLAYABLE_AVATAR_SKIN_BY_ID).map(
      (skinRow) => [
        skinRow.skinId,
        buildingWorldPlazaDefaultAnimalCharacterEngineDefinition(skinRow),
      ]
    )
  ),
  [DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE]:
    DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GIRL_SAMPLE,
};

/**
 * Resolves a character definition by id, falling back to girl-sample.
 */
export function resolvingWorldPlazaCharacterEngineDefinition(
  characterId: string
): DefiningWorldPlazaCharacterEngineDefinition {
  return (
    DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_DEFINITIONS[characterId] ??
    DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GIRL_SAMPLE
  );
}

/**
 * Resolves the character engine definition for a selected avatar skin id.
 */
export function resolvingWorldPlazaCharacterEngineDefinitionForSkinId(
  skinId: string
): DefiningWorldPlazaCharacterEngineDefinition {
  return resolvingWorldPlazaCharacterEngineDefinition(skinId);
}
