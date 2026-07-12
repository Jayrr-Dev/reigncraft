/**
 * Default character engine template for bulk animal playable avatar skins.
 *
 * @module components/world/domains/buildingWorldPlazaDefaultAnimalCharacterEngineDefinition
 */

import type { DefiningWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import type { DefiningWorldPlazaAnimalPlayableAvatarSkinRow } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';

/**
 * Maps measured frame height to avatar size scale for default animal engines.
 */
function computingWorldPlazaDefaultAnimalCharacterEngineSizeScale(
  frameHeightPx: number
): number {
  if (frameHeightPx <= 64) {
    return 0.95;
  }

  if (frameHeightPx <= 74) {
    return 1.0;
  }

  if (frameHeightPx <= 84) {
    return 1.05;
  }

  if (frameHeightPx <= 96) {
    return 1.15;
  }

  return 1.25;
}

/**
 * Builds a shared character engine definition for one animal playable skin row.
 */
export function buildingWorldPlazaDefaultAnimalCharacterEngineDefinition(
  skinRow: DefiningWorldPlazaAnimalPlayableAvatarSkinRow
): DefiningWorldPlazaCharacterEngineDefinition {
  return {
    characterId: skinRow.skinId,
    displayName: skinRow.displayName,
    presentation: { skinId: skinRow.skinId },
    size: {
      sizeScale: computingWorldPlazaDefaultAnimalCharacterEngineSizeScale(
        skinRow.frameHeightPx
      ),
    },
    locomotion: {
      allowedMotionKinds: ['idle', 'walk', 'run', 'jump'],
    },
    vitals: { baseMaxHealth: 1000 },
    stats: {
      attackPower: 300,
      attackSpeed: 1,
      defense: 5,
      hungerDrainMultiplier: skinRow.hungerDrainMultiplier,
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
}
