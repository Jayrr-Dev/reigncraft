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

const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_HUSKY: DefiningWorldPlazaCharacterEngineDefinition =
  {
    characterId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY,
    displayName: 'Husky',
    presentation: { skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY },
    size: { sizeScale: 1.05 },
    locomotion: {
      ...DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_DEFAULT_LOCOMOTION,
      runSpeedGridPerSecond: 3.2,
    },
    vitals: { baseMaxHealth: 950 },
    stats: {
      attackPower: 300,
      attackSpeed: 1,
      defense: 6,
      hungerDrainMultiplier: 1.15,
    },
    scaling: {
      level: 1,
      healthPerLevel: 45,
      attackPerLevel: 2,
      defensePerLevel: 1,
    },
    immunities: ['cold'],
    startingStatusEffectIds: [],
    skillIds: ['minor-heal', 'swift-stride'],
  };

const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GOLDEN_RETRIEVER: DefiningWorldPlazaCharacterEngineDefinition =
  {
    characterId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.GOLDEN_RETRIEVER,
    displayName: 'Golden Retriever',
    presentation: {
      skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.GOLDEN_RETRIEVER,
    },
    size: { sizeScale: 1.05 },
    locomotion: { ...DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_DEFAULT_LOCOMOTION },
    vitals: { baseMaxHealth: 1000 },
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

const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GRIZZLY: DefiningWorldPlazaCharacterEngineDefinition =
  {
    characterId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY,
    displayName: 'Grizzly',
    presentation: { skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY },
    size: { sizeScale: 1.25 },
    locomotion: {
      allowedMotionKinds: ['idle', 'walk', 'run', 'jump'],
      walkSpeedGridPerSecond: 1.8,
      runSpeedGridPerSecond: 2.6,
      jumpDistanceScale: 0.9,
    },
    vitals: { baseMaxHealth: 1400, healthRegenPerSecond: 2.5 },
    stats: {
      attackPower: 300,
      attackSpeed: 0.85,
      defense: 10,
      hungerDrainMultiplier: 1.3,
    },
    scaling: {
      level: 1,
      healthPerLevel: 80,
      attackPerLevel: 3,
      defensePerLevel: 2,
    },
    immunities: ['bleed'],
    startingStatusEffectIds: [],
    skillIds: ['minor-heal', 'heat-ward'],
  };

const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_PINGUIN: DefiningWorldPlazaCharacterEngineDefinition =
  {
    characterId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.PINGUIN,
    displayName: 'Penguin',
    presentation: { skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.PINGUIN },
    size: { sizeScale: 0.9 },
    locomotion: {
      allowedMotionKinds: ['idle', 'walk', 'run', 'jump'],
      walkSpeedGridPerSecond: 1.6,
      runSpeedGridPerSecond: 2.2,
    },
    vitals: { baseMaxHealth: 850 },
    stats: {
      attackPower: 300,
      attackSpeed: 1.1,
      defense: 4,
      hungerDrainMultiplier: 0.85,
    },
    scaling: {
      level: 1,
      healthPerLevel: 40,
      attackPerLevel: 1,
      defensePerLevel: 1,
    },
    immunities: ['cold'],
    startingStatusEffectIds: [],
    skillIds: ['minor-heal', 'swift-stride'],
  };

const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_CAT_ORANGE: DefiningWorldPlazaCharacterEngineDefinition =
  {
    characterId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.CAT_ORANGE,
    displayName: 'Orange Cat',
    presentation: { skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.CAT_ORANGE },
    size: { sizeScale: 0.92 },
    locomotion: {
      allowedMotionKinds: ['idle', 'walk', 'run', 'jump'],
      runSpeedGridPerSecond: 3.5,
    },
    vitals: { baseMaxHealth: 880 },
    stats: {
      attackPower: 300,
      attackSpeed: 1.15,
      defense: 3,
      hungerDrainMultiplier: 0.9,
    },
    scaling: {
      level: 1,
      healthPerLevel: 42,
      attackPerLevel: 2,
      defensePerLevel: 1,
    },
    immunities: [],
    startingStatusEffectIds: [],
    skillIds: ['minor-heal', 'swift-stride'],
  };

/** Hand-tuned character definitions keyed by character id. */
const DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_HAND_TUNED_DEFINITIONS: Record<
  string,
  DefiningWorldPlazaCharacterEngineDefinition
> = {
  [DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE]:
    DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GIRL_SAMPLE,
  [DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY]:
    DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_HUSKY,
  [DEFINING_WORLD_PLAZA_AVATAR_SKIN.GOLDEN_RETRIEVER]:
    DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GOLDEN_RETRIEVER,
  [DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY]:
    DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_GRIZZLY,
  [DEFINING_WORLD_PLAZA_AVATAR_SKIN.PINGUIN]:
    DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_PINGUIN,
  [DEFINING_WORLD_PLAZA_AVATAR_SKIN.CAT_ORANGE]:
    DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_CAT_ORANGE,
};

/**
 * Stable engine defs for every playable animal skin.
 * Hand-tuned rows win over the shared default factory.
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
  ...DEFINING_WORLD_PLAZA_CHARACTER_ENGINE_HAND_TUNED_DEFINITIONS,
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
