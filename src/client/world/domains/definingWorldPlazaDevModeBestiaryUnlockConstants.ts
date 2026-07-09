import { DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaBestiaryGuideConstants';
import {
  DEFINING_PLAZA_BESTIARY_STUDY_TIER_ORDER,
  DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS,
  type PlazaBestiaryStudyTierId,
} from '@/components/home/domains/definingPlazaBestiaryStudyTier';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Kill count applied by dev "unlock all". */
export const DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_FULL_UNLOCK_KILL_COUNT =
  DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS.full;

/** Every species id in the player bestiary catalog. */
export const DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_UNLOCK_SPECIES_IDS: readonly DefiningWildlifeSpeciesId[] =
  DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES.map((entry) => entry.speciesId);

/** Quick-set kill presets for dev tier testing (excludes sighted-only 0). */
export const DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_KILL_PRESETS: readonly {
  tierId: Exclude<PlazaBestiaryStudyTierId, 'sighted'>;
  killCount: number;
  label: string;
}[] = DEFINING_PLAZA_BESTIARY_STUDY_TIER_ORDER.filter(
  (tierId): tierId is Exclude<PlazaBestiaryStudyTierId, 'sighted'> =>
    tierId !== 'sighted'
).map((tierId) => ({
  tierId,
  killCount: DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS[tierId],
  label: String(DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS[tierId]),
}));
