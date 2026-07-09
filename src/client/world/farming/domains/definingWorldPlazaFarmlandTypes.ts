/**
 * Farmland tile growth phases.
 *
 * @module components/world/farming/domains/definingWorldPlazaFarmlandTypes
 */

export const DEFINING_WORLD_PLAZA_FARMLAND_PHASES = [
  'tilled',
  'planted',
  'growing',
  'mature',
] as const;

export type DefiningWorldPlazaFarmlandPhase =
  (typeof DEFINING_WORLD_PLAZA_FARMLAND_PHASES)[number];

export type DefiningWorldPlazaFarmlandTileState = {
  readonly phase: DefiningWorldPlazaFarmlandPhase;
  readonly cropId: string;
  /** Wall-clock ms when the current phase started. */
  readonly phaseStartedAtMs: number;
};
