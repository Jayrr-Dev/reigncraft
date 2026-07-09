import { computingWorldPlazaInGameHoursToDiseaseRealMs } from '@/components/world/health/domains/computingWorldPlazaEntityDiseaseDurationMs';

/** Relative standard deviation for incubation rolls (mean ± spread). */ export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_INCUBATION_BELL_CURVE_SPREAD_RATIO =
  0.3 as const;

/** Relative standard deviation for symptomatic illness rolls. */
export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_DURATION_BELL_CURVE_SPREAD_RATIO =
  0.25 as const;

/** Sigmas shown in mechanics guide ranges (~95% of bell-curve outcomes). */
export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_BELL_CURVE_RANGE_SIGMAS =
  2 as const;

/** Shortest rolled incubation window. */
export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_MIN_INCUBATION_MS =
  computingWorldPlazaInGameHoursToDiseaseRealMs(1);

/** Shortest rolled symptomatic illness window. */
export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_MIN_DURATION_MS =
  computingWorldPlazaInGameHoursToDiseaseRealMs(6);
