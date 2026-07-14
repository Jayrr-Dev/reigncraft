import { COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';

/** Pathology study points awarded per completed in-game hour of infection. */
export const DEFINING_WORLD_PLAZA_PATHOLOGY_STUDY_POINTS_PER_INFECTION_HOUR =
  1 as const;

export type ComputingWorldPlazaPathologyInfectionStudyHoursParams = {
  contractedAtMs: number;
  expiresAtMs: number;
  worldEpochMs: number;
};

/**
 * Whole in-game hours the player has carried one disease instance so far.
 *
 * Caps at expiry so recovered illnesses stop accruing. Incubation counts.
 */
export function computingWorldPlazaPathologyInfectionStudyHoursElapsed({
  contractedAtMs,
  expiresAtMs,
  worldEpochMs,
}: ComputingWorldPlazaPathologyInfectionStudyHoursParams): number {
  const endMs = Math.min(worldEpochMs, expiresAtMs);
  const elapsedMs = Math.max(0, endMs - contractedAtMs);

  return Math.floor(elapsedMs / COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS);
}

/**
 * Hours still owed as Pathology study credits for this infection instance.
 */
export function computingWorldPlazaPathologyInfectionStudyHoursToCredit({
  contractedAtMs,
  expiresAtMs,
  worldEpochMs,
  pathologyStudyHoursCredited,
}: ComputingWorldPlazaPathologyInfectionStudyHoursParams & {
  pathologyStudyHoursCredited: number;
}): number {
  const eligibleHours = computingWorldPlazaPathologyInfectionStudyHoursElapsed({
    contractedAtMs,
    expiresAtMs,
    worldEpochMs,
  });
  const alreadyCredited = Number.isFinite(pathologyStudyHoursCredited)
    ? Math.max(0, Math.floor(pathologyStudyHoursCredited))
    : 0;

  return Math.max(0, eligibleHours - alreadyCredited);
}
