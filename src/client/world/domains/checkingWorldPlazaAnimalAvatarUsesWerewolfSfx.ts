/**
 * Which playable wolf species reuse the Werewolf pack for local avatar vocals.
 *
 * Mixkit howls stay for grey-wolf NPC wildlife; local punch/jump/roll use short
 * Werewolf attacks and snarls instead of 6–8s howl beds.
 *
 * @module components/world/domains/checkingWorldPlazaAnimalAvatarUsesWerewolfSfx
 */

import {
  DEFINING_WILDLIFE_OMEGA_WOLF_ESCORT_SPECIES_ID,
  checkingWildlifeOmegaWolfSpecies,
} from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfConstants';

/** True when local avatar should play Werewolf-pack clips for this species. */
export function checkingWorldPlazaAnimalAvatarUsesWerewolfSfx(
  speciesId: string
): boolean {
  return (
    checkingWildlifeOmegaWolfSpecies(speciesId) ||
    speciesId === DEFINING_WILDLIFE_OMEGA_WOLF_ESCORT_SPECIES_ID
  );
}
