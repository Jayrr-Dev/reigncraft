/**
 * Builds a star-audio preload manifest for one playable animal skin's vocals.
 *
 * @module components/world/domains/buildingWorldPlazaAnimalAvatarSpeciesSfxStarAudioManifest
 */

import { checkingWorldPlazaAnimalAvatarUsesWerewolfSfx } from '@/components/world/domains/checkingWorldPlazaAnimalAvatarUsesWerewolfSfx';
import { resolvingWorldPlazaAnimalPlayableAvatarSpeciesSfxSpeciesId } from '@/components/world/domains/resolvingWorldPlazaAnimalPlayableAvatarWildlifeSpeciesId';
import { buildingWildlifeSpeciesSfxStarAudioManifestFromClipIds } from '@/components/world/wildlife/domains/buildingWildlifeFarmAnimalStarAudioManifest';
import { buildingWildlifeOmegaWolfStarAudioManifest } from '@/components/world/wildlife/domains/buildingWildlifeOmegaWolfStarAudioManifest';
import { listingWildlifeSpeciesSfxClipIdsForSpecies } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSfxClipId';
import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';

/**
 * Vocal clips for the selected animal playable skin, or an empty manifest.
 */
export function buildingWorldPlazaAnimalAvatarSpeciesSfxStarAudioManifest(
  skinId: string
): Manifest {
  const speciesId =
    resolvingWorldPlazaAnimalPlayableAvatarSpeciesSfxSpeciesId(skinId);

  if (!speciesId) {
    return {};
  }

  if (checkingWorldPlazaAnimalAvatarUsesWerewolfSfx(speciesId)) {
    return buildingWildlifeOmegaWolfStarAudioManifest();
  }

  return buildingWildlifeSpeciesSfxStarAudioManifestFromClipIds(
    listingWildlifeSpeciesSfxClipIdsForSpecies(speciesId)
  );
}
