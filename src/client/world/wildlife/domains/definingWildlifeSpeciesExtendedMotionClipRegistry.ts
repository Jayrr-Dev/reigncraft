/**
 * Optional motion sheets beyond the shared wildlife clip set.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesExtendedMotionClipRegistry
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Extra motion clips loaded only for species that ship the sheets. */
export type DefiningWildlifeExtendedMotionClipKind =
  | 'howl'
  | 'attack2'
  | 'attack3';

/** Candidate sheet filenames per species and extended clip. */
export const DEFINING_WILDLIFE_SPECIES_EXTENDED_MOTION_CLIP_SHEETS: Partial<
  Record<
    DefiningWildlifeSpeciesId,
    Partial<Record<DefiningWildlifeExtendedMotionClipKind, readonly string[]>>
  >
> = {
  'grey-wolf': {
    howl: ['Howl_Shadowless.webp'],
    attack2: ['Attack2_Shadowless.webp'],
    attack3: ['Attack3_Shadowless.webp'],
  },
  'omega-wolf': {
    howl: ['Howl_Shadowless.webp'],
    attack2: ['Attack2_Shadowless.webp'],
    attack3: ['Attack3_Shadowless.webp'],
  },
};
