import {
  applyingWorldPlazaEntityBuff,
  checkingWorldPlazaEntityMovementBuffIsActive,
} from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { addingWorldPlazaEntityHealthDamageOverTime } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import type { DefiningWorldPlazaInventoryFoodDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
import { DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';

export const DEFINING_WORLD_PLAZA_FOOD_SICKNESS_DEBUFF_ID =
  'food-sickness-debuff' as const;

export type ResolvingWorldPlazaInventoryFoodEatEffectsResult = {
  readonly effectiveHungerRestoreRatio: number;
  readonly nextHealthState: DefiningWorldPlazaEntityHealthState;
  readonly didRollSickness: boolean;
};

/**
 * Resolves hunger restore and health side effects when eating one food item.
 */
export function resolvingWorldPlazaInventoryFoodEatEffects({
  foodDefinition,
  healthState,
  nowMs,
  sicknessRoll,
}: {
  foodDefinition: DefiningWorldPlazaInventoryFoodDefinition;
  healthState: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  sicknessRoll: number;
}): ResolvingWorldPlazaInventoryFoodEatEffectsResult {
  let nextHealthState = healthState;

  if (foodDefinition.meatKind === 'raw') {
    const poisonFlatEv = foodDefinition.rawPoisonFlatEv ?? 0;
    const poisonDurationMs = foodDefinition.rawPoisonDurationMs ?? 0;

    if (poisonFlatEv > 0 && poisonDurationMs > 0) {
      const damagePerSecond =
        poisonFlatEv / (poisonDurationMs / 1000);

      nextHealthState = addingWorldPlazaEntityHealthDamageOverTime(
        nextHealthState,
        'toxic',
        damagePerSecond,
        poisonDurationMs,
        nowMs
      );
    }

    const sicknessChance = foodDefinition.rawSicknessChance ?? 0;

    if (sicknessChance > 0 && sicknessRoll < sicknessChance) {
      nextHealthState = applyingWorldPlazaEntityBuff(
        nextHealthState,
        DEFINING_WORLD_PLAZA_FOOD_SICKNESS_DEBUFF_ID,
        nowMs
      );
    }
  }

  const isSick = checkingWorldPlazaEntityMovementBuffIsActive(
    nextHealthState,
    DEFINING_WORLD_PLAZA_FOOD_SICKNESS_DEBUFF_ID,
    nowMs
  );

  const effectiveHungerRestoreRatio = isSick
    ? foodDefinition.hungerRestoreRatio *
      DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER
    : foodDefinition.hungerRestoreRatio;

  return {
    effectiveHungerRestoreRatio,
    nextHealthState,
    didRollSickness: isSick,
  };
}
