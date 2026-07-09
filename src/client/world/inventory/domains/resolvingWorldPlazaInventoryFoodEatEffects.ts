import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import {
  applyingWorldPlazaEntityDisease,
  checkingWorldPlazaEntityDiseaseIsSymptomatic,
} from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { resolvingWorldPlazaEntityDiseaseContractionChance } from '@/components/world/health/domains/checkingWorldPlazaEntityImmuneSystem';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { addingWorldPlazaEntityHealthDamageOverTime } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityDiseaseWorldEpochMs } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseWorldEpochMs';
import type { DefiningWorldPlazaInventoryFoodDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
import { DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { resolvingWildlifeAggroDeerMeatCookedResidualDiseaseChance } from '@/components/world/wildlife/domains/resolvingWildlifeAggroDeerMeatCookedResidualDiseaseChance';

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

  const effectiveDiseaseChance = rawDiseaseId
    ? resolvingWorldPlazaEntityDiseaseContractionChance(
        healthState,
        rawDiseaseChance
      )
    : 0;

  if (rawDiseaseId && sicknessRoll < effectiveDiseaseChance) {
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
  foodItemMetadata,
}: {
  foodDefinition: DefiningWorldPlazaInventoryFoodDefinition;
  healthState: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  sicknessRoll: number;
  wellFedRoll: number;
  foodItemMetadata?: Readonly<Record<string, unknown>>;
}): {
  nextHealthState: DefiningWorldPlazaEntityHealthState;
  didRollDisease: boolean;
  didRollWellFedBuff: boolean;
} {
  let nextHealthState = healthState;
  let didRollDisease = false;
  let didRollWellFedBuff = false;

  const residualDiseaseId = foodDefinition.cookedResidualDiseaseId;
  const residualDiseaseChance =
    resolvingWildlifeAggroDeerMeatCookedResidualDiseaseChance(
      foodDefinition.cookedResidualDiseaseChance ?? 0,
      foodItemMetadata
    );

  const effectiveResidualChance = residualDiseaseId
    ? resolvingWorldPlazaEntityDiseaseContractionChance(
        healthState,
        residualDiseaseChance
      )
    : 0;

  if (residualDiseaseId && sicknessRoll < effectiveResidualChance) {
    nextHealthState = applyingWorldPlazaEntityDisease(
      nextHealthState,
      residualDiseaseId as DefiningWorldPlazaEntityDiseaseId,
      nowMs
    );
    didRollDisease = true;
  }

  const wellFedBuffIds =
    foodDefinition.cookedWellFedBuffIds ??
    (foodDefinition.cookedWellFedBuffId
      ? [foodDefinition.cookedWellFedBuffId]
      : []);
  const wellFedChance = foodDefinition.cookedWellFedChance ?? 0;

  if (wellFedBuffIds.length > 0 && wellFedRoll < wellFedChance) {
    for (const wellFedBuffId of wellFedBuffIds) {
      nextHealthState = applyingWorldPlazaEntityBuff(
        nextHealthState,
        wellFedBuffId,
        nowMs
      );
    }
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
  foodItemMetadata,
}: {
  foodDefinition: DefiningWorldPlazaInventoryFoodDefinition;
  healthState: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  sicknessRoll: number;
  wellFedRoll?: number;
  foodItemMetadata?: Readonly<Record<string, unknown>>;
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
      foodItemMetadata,
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
