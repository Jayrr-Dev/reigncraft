/**
 * Resolves chance that a flower eat-effect fires for one preparation.
 *
 * Brewing can pass `preparation: 'brewed'` and/or `chanceBonus` later.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaFlowerEatEffectProcChance
 */

import {
  DEFINING_WORLD_PLAZA_FLOWER_EAT_EFFECT_PROC_CHANCE_BY_PREPARATION,
  DEFINING_WORLD_PLAZA_FLOWER_RAW_EAT_EFFECT_PROC_CHANCE,
  type DefiningWorldPlazaFlowerEatPreparationId,
} from '@/components/world/inventory/domains/definingWorldPlazaFlowerEatEffectTunables';

export type ResolvingWorldPlazaFlowerEatEffectProcChanceParams = {
  readonly preparation?: DefiningWorldPlazaFlowerEatPreparationId;
  /** Additive bonus from brew quality, gear, etc. Clamped with base into [0, 1]. */
  readonly chanceBonus?: number;
  /** Multiplier from lucky charm, etc. Applied after bonus, then clamped. */
  readonly chanceMultiplier?: number;
};

/**
 * Resolves the clamped [0, 1] chance a flower eat-effect procs.
 */
export function resolvingWorldPlazaFlowerEatEffectProcChance(
  params: ResolvingWorldPlazaFlowerEatEffectProcChanceParams = {}
): number {
  const preparation = params.preparation ?? 'raw';
  const chanceBonus = params.chanceBonus ?? 0;
  const chanceMultiplier = params.chanceMultiplier ?? 1;
  const baseChance =
    DEFINING_WORLD_PLAZA_FLOWER_EAT_EFFECT_PROC_CHANCE_BY_PREPARATION[
      preparation
    ] ?? DEFINING_WORLD_PLAZA_FLOWER_RAW_EAT_EFFECT_PROC_CHANCE;

  return Math.min(
    1,
    Math.max(0, (baseChance + chanceBonus) * chanceMultiplier)
  );
}
