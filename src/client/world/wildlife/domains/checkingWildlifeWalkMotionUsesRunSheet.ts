/**
 * Whether a species walk clip is loaded from a Run sheet fallback.
 *
 * @module components/world/wildlife/domains/checkingWildlifeWalkMotionUsesRunSheet
 */

import { DEFINING_WILDLIFE_SPECIES_MOTION_SHEET_FILE_NAME_OVERRIDES } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * True when walk prefers a Run_* / Fast-walk sheet (no usable Walk art, or
 * broken Walk). Gallop / fast-gait frames need a higher body-speed reference
 * than normal walk fps.
 */
export function checkingWildlifeWalkMotionUsesRunSheet(
  speciesId: DefiningWildlifeSpeciesId
): boolean {
  const walkFileNames =
    DEFINING_WILDLIFE_SPECIES_MOTION_SHEET_FILE_NAME_OVERRIDES[speciesId]?.walk;

  if (!walkFileNames || walkFileNames.length === 0) {
    return false;
  }

  const preferredFileName = walkFileNames[0] ?? '';

  return /run|fast\s*walk/i.test(preferredFileName);
}
