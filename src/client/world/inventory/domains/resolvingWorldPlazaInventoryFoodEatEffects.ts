import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import {
  applyingWorldPlazaEntityDisease,
  checkingWorldPlazaEntityDiseaseIsSymptomatic,
} from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { resolvingWorldPlazaEntityDiseaseWorldEpochMs } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseWorldEpochMs';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
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
  readonly didRollDisease: boolean;
  readonly didRollWellFedBuff: boolean;
};

function applyingWorldPlazaInventoryRawMeatEatEffects({
  foodDefinition,
  healthState,
  nowMs,
  sicknessRoll,
}: {
  foodDefinition: DefiningWorldPlazaInventoryFoodDefinition;
  healthState: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  sicknessRoll: number;
}): {
  nextHealthState: DefiningWorldPlazaEntityHealthState;
  didRollDisease: boolean;
} {
  let nextHealthState = healthState;
  let didRollDisease = false;

  const rawDiseaseId = foodDefinition.rawDiseaseId;
  const rawDiseaseChance = foodDefinition.rawDiseaseChance ?? 0;

  if (rawDiseaseId && sicknessRoll < rawDiseaseChance) {
    nextHealthState = applyingWorldPlazaEntityDisease(
      nextHealthState,
      rawDiseaseId as DefiningWorldPlazaEntityDiseaseId,
      nowMs
    );
    didRollDisease = true;
    return { nextHealthState, didRollDisease };
  }

  const poisonFlatEv = foodDefinition.rawPoisonFlatEv ?? 0;
  const poisonDurationMs = foodDefinition.rawPoisonDurationMs ?? 0;

  if (poisonFlatEv > 0 && poisonDurationMs > 0) {
    const damagePerSecond = poisonFlatEv / (poisonDurationMs / 1000);

    nextHealthState = addingWorldPlazaEntityHealthDamageOverTime(
      nextHealthState,
      'toxic',
      damagePerSecond,
      poisonDurationMs,
      nowMs
    );
  }

  return { nextHealthState, didRollDisease };
}

function applyingWorldPlazaInventoryCookedMeatEatEffects({
  foodDefinition,
  healthState,
  nowMs,
  sicknessRoll,
  wellFedRoll,
}: {
  foodDefinition: DefiningWorldPlazaInventoryFoodDefinition;
  healthState: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  sicknessRoll: number;
  wellFedRoll: number;
}): {
  nextHealthState: DefiningWorldPlazaEntityHealthState;
  didRollDisease: boolean;
  didRollWellFedBuff: boolean;
} {
  let nextHealthState = healthState;
  let didRollDisease = false;
  let didRollWellFedBuff = false;

  const residualDiseaseId = foodDefinition.cookedResidualDiseaseId;
  const residualDiseaseChance = foodDefinition.cookedResidualDiseaseChance ?? 0;

  if (residualDiseaseId && sicknessRoll < residualDiseaseChance) {
    nextHealthState = applyingWorldPlazaEntityDisease(
      nextHealthState,
      residualDiseaseId as DefiningWorldPlazaEntityDiseaseId,
      nowMs
    );
    didRollDisease = true;
  }

  const wellFedBuffId = foodDefinition.cookedWellFedBuffId;
  const wellFedChance = foodDefinition.cookedWellFedChance ?? 0;

  if (wellFedBuffId && wellFedRoll < wellFedChance) {
    nextHealthState = applyingWorldPlazaEntityBuff(
      nextHealthState,
      wellFedBuffId,
      nowMs
    );
    didRollWellFedBuff = true;
  }

  return { nextHealthState, didRollDisease, didRollWellFedBuff };
}

/**
 * Resolves hunger restore and health side effects when eating one food item.
 */
export function resolvingWorldPlazaInventoryFoodEatEffects({
  foodDefinition,
  healthState,
  nowMs,
  sicknessRoll,
  wellFedRoll = sicknessRoll,
}: {
  foodDefinition: DefiningWorldPlazaInventoryFoodDefinition;
  healthState: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  sicknessRoll: number;
  wellFedRoll?: number;
}): ResolvingWorldPlazaInventoryFoodEatEffectsResult {
  let nextHealthState = healthState;
  let didRollDisease = false;
  let didRollWellFedBuff = false;

  if (foodDefinition.meatKind === 'raw') {
    const rawResult = applyingWorldPlazaInventoryRawMeatEatEffects({
      foodDefinition,
      healthState: nextHealthState,
      nowMs,
      sicknessRoll,
    });
    nextHealthState = rawResult.nextHealthState;
    didRollDisease = rawResult.didRollDisease;
  }

  if (foodDefinition.meatKind === 'cooked') {
    const cookedResult = applyingWorldPlazaInventoryCookedMeatEatEffects({
      foodDefinition,
      healthState: nextHealthState,
      nowMs,
      sicknessRoll,
      wellFedRoll,
    });
    nextHealthState = cookedResult.nextHealthState;
    didRollDisease = didRollDisease || cookedResult.didRollDisease;
    didRollWellFedBuff = cookedResult.didRollWellFedBuff;
  }

  const isSick =
    didRollDisease ||
    checkingWorldPlazaEntityDiseaseIsSymptomatic(
      nextHealthState,
      resolvingWorldPlazaEntityDiseaseWorldEpochMs(nowMs)
    );

  const effectiveHungerRestoreRatio = isSick
    ? foodDefinition.hungerRestoreRatio *
      DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER
    : foodDefinition.hungerRestoreRatio;

  return {
    effectiveHungerRestoreRatio,
    nextHealthState,
    didRollSickness: isSick,
    didRollDisease,
    didRollWellFedBuff,
  };
}
