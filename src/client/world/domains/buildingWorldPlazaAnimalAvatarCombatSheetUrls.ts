/**
 * Builds candidate combat sheet URLs for animal playable avatar skins.
 *
 * @module components/world/domains/buildingWorldPlazaAnimalAvatarCombatSheetUrls
 */

import { resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId } from '@/components/world/domains/resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId';
import {
  buildingWildlifeMotionSheetUrls,
  DEFINING_WILDLIFE_ASSET_BASE_URL,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';

export type BuildingWorldPlazaAnimalAvatarCombatSheetMotion = 'melee' | 'roll';

/**
 * Candidate public URLs for one animal combat strip, best match first.
 */
export function buildingWorldPlazaAnimalAvatarCombatSheetUrls(
  spriteFolder: string,
  motion: BuildingWorldPlazaAnimalAvatarCombatSheetMotion
): readonly string[] {
  const wildlifeSpeciesId =
    resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId(spriteFolder);
  const encodedFolder = spriteFolder
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  const assetBaseUrl = `${DEFINING_WILDLIFE_ASSET_BASE_URL}/${encodedFolder}`;

  if (wildlifeSpeciesId === 'hyena') {
    if (motion === 'melee') {
      return [
        `${assetBaseUrl}/Hyena Attacking_Shadowless.webp`,
        `${assetBaseUrl}/Hyena Jump attack_Shadowless.webp`,
        ...buildingWildlifeMotionSheetUrls(
          spriteFolder,
          'attack',
          wildlifeSpeciesId
        ),
      ];
    }

    return [
      `${assetBaseUrl}/Hyena Jump attack_Shadowless.webp`,
      `${assetBaseUrl}/Hyena Attacking_Shadowless.webp`,
      `${assetBaseUrl}/Attack3_Shadowless.webp`,
      `${assetBaseUrl}/Attack2_Shadowless.webp`,
      `${assetBaseUrl}/Attack1_Shadowless.webp`,
    ];
  }

  if (motion === 'melee') {
    return buildingWildlifeMotionSheetUrls(
      spriteFolder,
      'attack',
      wildlifeSpeciesId
    );
  }

  return [
    `${assetBaseUrl}/Attack3_Shadowless.webp`,
    `${assetBaseUrl}/Attack2_Shadowless.webp`,
    `${assetBaseUrl}/Attack1_Shadowless.webp`,
    ...buildingWildlifeMotionSheetUrls(
      spriteFolder,
      'attack',
      wildlifeSpeciesId
    ),
  ];
}
