import { DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaBestiaryGuideConstants';
import {
  DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS,
  DEFINING_PLAZA_CODEX_STUDY_TIER_ORDER,
  type PlazaCodexStudyTierId,
} from '@/components/home/domains/definingPlazaCodexStudyTier';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Kill count applied by dev "unlock all" (mastery / playable). */
export const DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_FULL_UNLOCK_KILL_COUNT =
  DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS.mastery;

/** Every species id in the player bestiary catalog. */
export const DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_UNLOCK_SPECIES_IDS: readonly DefiningWildlifeSpeciesId[] =
  DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES.map((entry) => entry.speciesId);

/** Quick-set kill presets for dev tier testing (excludes awareness / 0). */
export const DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_KILL_PRESETS: readonly {
  tierId: Exclude<PlazaCodexStudyTierId, 'awareness'>;
  killCount: number;
  label: string;
}[] = DEFINING_PLAZA_CODEX_STUDY_TIER_ORDER.filter(
  (tierId): tierId is Exclude<PlazaCodexStudyTierId, 'awareness'> =>
    tierId !== 'awareness'
).map((tierId) => ({
  tierId,
  killCount: DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[tierId],
  label: String(DEFINING_PLAZA_CODEX_STUDY_BASE_THRESHOLDS[tierId]),
}));
