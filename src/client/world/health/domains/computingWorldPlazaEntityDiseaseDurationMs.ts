import {
  computingWorldPlazaInGameDaysToRealMs,
  computingWorldPlazaInGameHoursToRealMs,
} from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import { DEFINING_WORLD_PLAZA_ENTITY_DISEASE_TIME_SCALE } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseTimeConstants';

function scalingWorldPlazaEntityDiseaseDurationMs(durationMs: number): number {
  return Math.round(
    durationMs * DEFINING_WORLD_PLAZA_ENTITY_DISEASE_TIME_SCALE
  );
}

/** Converts in-game days to real ms with the global disease time scale. */
export function computingWorldPlazaInGameDaysToDiseaseRealMs(
  days: number
): number {
  return scalingWorldPlazaEntityDiseaseDurationMs(
    computingWorldPlazaInGameDaysToRealMs(days)
  );
}

/** Converts in-game hours to real ms with the global disease time scale. */
export function computingWorldPlazaInGameHoursToDiseaseRealMs(
  hours: number
): number {
  return scalingWorldPlazaEntityDiseaseDurationMs(
    computingWorldPlazaInGameHoursToRealMs(hours)
  );
}

/** Scales an existing real-ms disease timing (e.g. poison drain from potency). */
export function scalingWorldPlazaEntityDiseaseRealMs(
  durationMs: number
): number {
  return scalingWorldPlazaEntityDiseaseDurationMs(durationMs);
}
