/**
 * True when a species uses procedural glow-orb presentation instead of sprites.
 *
 * @module components/world/wildlife/domains/checkingWildlifeSpeciesUsesGlowOrbPresentation
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

export function checkingWildlifeSpeciesUsesGlowOrbPresentation(
  species: Pick<DefiningWildlifeSpeciesDefinition, 'presentationKind'>
): boolean {
  return species.presentationKind === 'glowOrb';
}
