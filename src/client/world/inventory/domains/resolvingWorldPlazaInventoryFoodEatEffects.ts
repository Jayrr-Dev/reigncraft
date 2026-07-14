import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import {
  applyingWorldPlazaEntityDisease,
  checkingWorldPlazaEntityDiseaseIsSymptomatic,
} from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { resolvingWorldPlazaEntityDiseaseContractionChance } from '@/components/world/health/domains/checkingWorldPlazaEntityImmuneSystem';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  addingWorldPlazaEntityHealthDamageOverTime,
  healingWorldPlazaEntityHealthWithAmplifiers,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityDiseaseWorldEpochMs } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseWorldEpochMs';
import { applyingWorldPlazaInventoryFlowerEatEffects } from '@/components/world/inventory/domains/applyingWorldPlazaInventoryFlowerEatEffects';
import { parsingWorldPlazaFlowerSpeciesIdFromItemTypeId } from '@/components/world/inventory/domains/definingWorldPlazaFlowerEatEffectRegistry';
import { resolvingWorldPlazaInventoryFoodHealAmount } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealAmount';
import type { DefiningWorldPlazaInventoryFoodDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
import { resolvingWorldPlazaPlayerHeldLuckyFoodBuffChanceMultiplier } from '@/components/world/inventory/domains/resolvingWorldPlazaPlayerHeldLuckyFoodBuffChanceMultiplier';
import { DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { resolvingWildlifeAggroDeerMeatCookedResidualDiseaseChance } from '@/components/world/wildlife/domains/resolvingWildlifeAggroDeerMeatCookedResidualDiseaseChance';

export const DEFINING_WORLD_PLAZA_FOOD_SICKNESS_DEBUFF_ID =
  'food-sickness-debuff' as const;

export type ResolvingWorldPlazaInventoryFoodEatEffectsResult = {
  readonly effectiveHungerRestoreRatio: number;
  readonly healthHealAmount: number;
  readonly nextHealthState: DefiningWorldPlazaEntityHealthState;
  readonly didRollSickness: boolean;
  readonly didRollDisease: boolean;
  readonly didRollWellFedBuff: boolean;
};

function applyingWorldPlazaInventoryRawMeatEatEffects({
  foodDefinition,
  healthState,
  worldEpochMs,
  simulationNowMs,
  sicknessRoll,
}: {
  foodDefinition: DefiningWorldPlazaInventoryFoodDefinition;
  healthState: DefiningWorldPlazaEntityHealthState;
  worldEpochMs: number;
  simulationNowMs: number;
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
      worldEpochMs,
      Math.random,
      {
        symptomStrengthScale: foodDefinition.rawSymptomIntensity ?? 1,
        durationScaleFromMeat: foodDefinition.rawDurationIntensity ?? 1,
      },
      simulationNowMs
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
      simulationNowMs
    );
  }

  return { nextHealthState, didRollDisease };
}

function applyingWorldPlazaInventoryCookedMeatEatEffects({
  foodDefinition,
  healthState,
  worldEpochMs,
  simulationNowMs,
  sicknessRoll,
  wellFedRoll,
  foodItemMetadata,
}: {
  foodDefinition: DefiningWorldPlazaInventoryFoodDefinition;
  healthState: DefiningWorldPlazaEntityHealthState;
  worldEpochMs: number;
  simulationNowMs: number;
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
      worldEpochMs,
      Math.random,
      {},
      simulationNowMs
    );
    didRollDisease = true;
  }

  const wellFedBuffIds =
    foodDefinition.cookedWellFedBuffIds ??
    (foodDefinition.cookedWellFedBuffId
      ? [foodDefinition.cookedWellFedBuffId]
      : []);
  const wellFedChance = Math.min(
    1,
    (foodDefinition.cookedWellFedChance ?? 0) *
      resolvingWorldPlazaPlayerHeldLuckyFoodBuffChanceMultiplier()
  );

  if (wellFedBuffIds.length > 0 && wellFedRoll < wellFedChance) {
    for (const wellFedBuffId of wellFedBuffIds) {
      nextHealthState = applyingWorldPlazaEntityBuff(
        nextHealthState,
        wellFedBuffId,
        simulationNowMs
      );
    }
    didRollWellFedBuff = true;
  }

  return { nextHealthState, didRollDisease, didRollWellFedBuff };
}

/**
 * Resolves hunger restore and health side effects when eating one food item.
 *
 * @param nowMs - Simulation / frame clock for buffs, poison DoT, and disease
 *   grant effect stamps (`performance.now()` in play).
 * @param worldEpochMs - Wall clock for disease incubation scheduling. Defaults
 *   to `nowMs` so unit tests can share one timeline.
 */
export function resolvingWorldPlazaInventoryFoodEatEffects({
  foodDefinition,
  healthState,
  nowMs,
  worldEpochMs = nowMs,
  sicknessRoll,
  wellFedRoll = sicknessRoll,
  foodItemMetadata,
}: {
  foodDefinition: DefiningWorldPlazaInventoryFoodDefinition;
  healthState: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  worldEpochMs?: number;
  sicknessRoll: number;
  wellFedRoll?: number;
  foodItemMetadata?: Readonly<Record<string, unknown>>;
}): ResolvingWorldPlazaInventoryFoodEatEffectsResult {
  let nextHealthState = healthState;
  let didRollDisease = false;
  let didRollWellFedBuff = false;
  const resolvedWorldEpochMs =
    resolvingWorldPlazaEntityDiseaseWorldEpochMs(worldEpochMs);

  const flowerSpeciesId = parsingWorldPlazaFlowerSpeciesIdFromItemTypeId(
    foodDefinition.itemTypeId
  );

  if (flowerSpeciesId) {
    const flowerResult = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: flowerSpeciesId,
      healthState,
      nowMs,
      worldEpochMs: resolvedWorldEpochMs,
      preparation: 'raw',
      effectProcRoll: sicknessRoll,
      foxgloveRoll: wellFedRoll ?? Math.random(),
    });

    const isSick =
      flowerResult.didApplyPetalSickness ||
      flowerResult.didRollDisease ||
      checkingWorldPlazaEntityDiseaseIsSymptomatic(
        flowerResult.nextHealthState,
        resolvedWorldEpochMs
      );

    return {
      effectiveHungerRestoreRatio: isSick
        ? foodDefinition.hungerRestoreRatio *
          DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER
        : foodDefinition.hungerRestoreRatio,
      healthHealAmount: 0,
      nextHealthState: flowerResult.nextHealthState,
      didRollSickness: isSick,
      didRollDisease: flowerResult.didRollDisease,
      didRollWellFedBuff: false,
    };
  }

  if (foodDefinition.meatKind === 'raw') {
    const rawResult = applyingWorldPlazaInventoryRawMeatEatEffects({
      foodDefinition,
      healthState: nextHealthState,
      worldEpochMs: resolvedWorldEpochMs,
      simulationNowMs: nowMs,
      sicknessRoll,
    });
    nextHealthState = rawResult.nextHealthState;
    didRollDisease = rawResult.didRollDisease;
  }

  if (foodDefinition.meatKind === 'cooked') {
    const cookedResult = applyingWorldPlazaInventoryCookedMeatEatEffects({
      foodDefinition,
      healthState: nextHealthState,
      worldEpochMs: resolvedWorldEpochMs,
      simulationNowMs: nowMs,
      sicknessRoll,
      wellFedRoll,
      foodItemMetadata,
    });
    nextHealthState = cookedResult.nextHealthState;
    didRollDisease = didRollDisease || cookedResult.didRollDisease;
    didRollWellFedBuff = cookedResult.didRollWellFedBuff;
  } else if (
    foodDefinition.cookedWellFedBuffId ||
    (foodDefinition.cookedWellFedBuffIds?.length ?? 0) > 0
  ) {
    const forageBuffResult = applyingWorldPlazaInventoryCookedMeatEatEffects({
      foodDefinition,
      healthState: nextHealthState,
      worldEpochMs: resolvedWorldEpochMs,
      simulationNowMs: nowMs,
      sicknessRoll,
      wellFedRoll,
      foodItemMetadata,
    });
    nextHealthState = forageBuffResult.nextHealthState;
    didRollWellFedBuff = forageBuffResult.didRollWellFedBuff;
  }

  const isSick =
    didRollDisease ||
    checkingWorldPlazaEntityDiseaseIsSymptomatic(
      nextHealthState,
      resolvedWorldEpochMs
    );

  const effectiveHungerRestoreRatio = isSick
    ? foodDefinition.hungerRestoreRatio *
      DEFINING_WILDLIFE_FOOD_SICKNESS_HUNGER_MULTIPLIER
    : foodDefinition.hungerRestoreRatio;

  const healthHealAmount = resolvingWorldPlazaInventoryFoodHealAmount({
    healthHeal: foodDefinition.healthHeal,
    effectiveMaxHealth: computingWorldPlazaEntityHealthEffectiveMax(
      nextHealthState,
      nowMs
    ),
    foodItemMetadata,
  });

  if (healthHealAmount > 0) {
    nextHealthState = healingWorldPlazaEntityHealthWithAmplifiers({
      receiverState: nextHealthState,
      baseHealAmount: healthHealAmount,
      nowMs,
    }).state;
  }

  return {
    effectiveHungerRestoreRatio,
    healthHealAmount,
    nextHealthState,
    didRollSickness: isSick,
    didRollDisease,
    didRollWellFedBuff,
  };
}
