/**
 * Builds candidate combat sheet URLs for animal playable avatar skins.
 *
 * @module components/world/domains/buildingWorldPlazaAnimalAvatarCombatSheetUrls
 */

import { resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId } from '@/components/world/domains/resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId';
import { DEFINING_WILDLIFE_SPECIES_EXTENDED_MOTION_CLIP_SHEETS } from '@/components/world/wildlife/domains/definingWildlifeSpeciesExtendedMotionClipRegistry';
import {
  buildingWildlifeMotionSheetUrls,
  DEFINING_WILDLIFE_ASSET_BASE_URL,
} from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type BuildingWorldPlazaAnimalAvatarCombatSheetMotion = 'melee' | 'roll';

function buildingWorldPlazaAnimalAvatarExtendedAttack3SheetUrls(
  assetBaseUrl: string,
  wildlifeSpeciesId: DefiningWildlifeSpeciesId | undefined
): readonly string[] {
  if (!wildlifeSpeciesId) {
    return [];
  }

  const attack3FileNames =
    DEFINING_WILDLIFE_SPECIES_EXTENDED_MOTION_CLIP_SHEETS[wildlifeSpeciesId]
      ?.attack3 ?? [];

  return attack3FileNames.map(
    (fileName) => `${assetBaseUrl}/${encodeURIComponent(fileName)}`
  );
}

/**
 * Candidate public URLs for one animal combat strip, best match first.
 * Roll prefers Attack3 only when the species ships that sheet (wolves).
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
      ...buildingWildlifeMotionSheetUrls(
        spriteFolder,
        'attack',
        wildlifeSpeciesId
      ),
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
    ...buildingWorldPlazaAnimalAvatarExtendedAttack3SheetUrls(
      assetBaseUrl,
      wildlifeSpeciesId
    ),
    ...buildingWildlifeMotionSheetUrls(
      spriteFolder,
      'attack',
      wildlifeSpeciesId
    ),
  ];
}
