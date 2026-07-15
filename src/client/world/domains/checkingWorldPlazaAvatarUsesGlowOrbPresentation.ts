/**
 * True when a playable avatar skin renders as a procedural glow orb (fairy-style),
 * not locomotion sprite sheets.
 *
 * @module components/world/domains/checkingWorldPlazaAvatarUsesGlowOrbPresentation
 */

import { DEFINING_WILDLIFE_CYROBORN_SPECIES_ID } from '@/components/world/wildlife/domains/definingWildlifeCyrobornConstants';

/**
 * Glow-orb playable skins skip sheet texture gating and draw a Graphics body.
 */
export function checkingWorldPlazaAvatarUsesGlowOrbPresentation(
  skinId: string
): boolean {
  return skinId === DEFINING_WILDLIFE_CYROBORN_SPECIES_ID;
}
