/**
 * Species that use the three-hit wolf attack combo and howl clips.
 *
 * @module components/world/wildlife/domains/checkingWildlifeWolfComboSpecies
 */

import { checkingWildlifeOmegaWolfSpecies } from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfConstants';

/** True for grey wolf and Omega Wolf combo / howl species. */
export function checkingWildlifeWolfComboSpecies(speciesId: string): boolean {
  return (
    speciesId === 'grey-wolf' || checkingWildlifeOmegaWolfSpecies(speciesId)
  );
}
