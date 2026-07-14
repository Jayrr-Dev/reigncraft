import {
  DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_MIN_REMAINING_MS,
  DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_MS_MIN,
  DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_RATIO_OF_BASE,
} from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingBoostConstants';

export type ComputingWorldPlazaOreSmeltingBoostedEndsAtMsParams = {
  readonly nowMs: number;
  readonly endsAtMs: number;
  readonly baseDurationMs: number;
};

/**
 * Pulls craft end time forward by a noticeable chunk of the base duration.
 * Returns the unchanged end when nothing remains to shave.
 */
export function computingWorldPlazaOreSmeltingBoostedEndsAtMs(
  params: ComputingWorldPlazaOreSmeltingBoostedEndsAtMsParams
): number {
  const remainingMs = Math.max(0, params.endsAtMs - params.nowMs);

  if (remainingMs <= DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_MIN_REMAINING_MS) {
    return params.endsAtMs;
  }

  const desiredBoostMs = Math.max(
    DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_MS_MIN,
    Math.round(
      params.baseDurationMs *
        DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_RATIO_OF_BASE
    )
  );
  const maxBoostMs =
    remainingMs - DEFINING_WORLD_PLAZA_ORE_SMELTING_BOOST_MIN_REMAINING_MS;
  const boostMs = Math.min(desiredBoostMs, maxBoostMs);

  return params.endsAtMs - boostMs;
}
