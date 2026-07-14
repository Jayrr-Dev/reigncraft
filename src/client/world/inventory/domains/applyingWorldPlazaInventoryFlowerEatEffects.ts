import { checkingWorldPlazaEntityConfusionBuffIsActive } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { checkingWorldPlazaEntityDiseaseIsSymptomatic } from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { applyingWorldPlazaEntityHealthPoisonStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPoisonStack';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import { computingWorldPlazaEntityHealthRolledExpectedAmount } from '@/components/world/health/domains/computingWorldPlazaEntityHealthRolledExpectedAmount';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import { DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO } from '@/components/world/health/domains/definingWorldPlazaEntityHealAmplifierConstants';
import { creatingWorldPlazaEntityHealthDamageRollPresetModifierId } from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { downgradingWorldPlazaEntityHealthBleedOneTier } from '@/components/world/health/domains/downgradingWorldPlazaEntityHealthBleedOneTier';
import {
  addingWorldPlazaEntityHealthDamageRollModifier,
  addingWorldPlazaEntityHealthOutgoingHealAmplifier,
  addingWorldPlazaEntityHealthSleepEffect,
  addingWorldPlazaEntityHealthTemporaryMax,
  addingWorldPlazaEntityHealthTimedTemperatureModifier,
  healingWorldPlazaEntityHealthWithAmplifiers,
  removingWorldPlazaEntityHealthConfusionEffect,
  removingWorldPlazaEntityHealthMovementModifier,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityDiseaseWorldEpochMs } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseWorldEpochMs';
import { creatingWorldPlazaEntityHealthTimedTemperatureModifier } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthEffectiveTemperatureResistance';
import { shorteningWorldPlazaEntityDiseaseRemainingDuration } from '@/components/world/health/domains/shorteningWorldPlazaEntityDiseaseRemainingDuration';
import {
  type DefiningWorldPlazaFlowerEatEffectKind,
  resolvingWorldPlazaFlowerEatEffectKind,
} from '@/components/world/inventory/domains/definingWorldPlazaFlowerEatEffectRegistry';
import {
  DEFINING_WORLD_PLAZA_FLOWER_ARNICA_BRACED_DURATION_MS,
  DEFINING_WORLD_PLAZA_FLOWER_BELLADONNA_POISON_DURATION_MS,
  DEFINING_WORLD_PLAZA_FLOWER_BELLADONNA_POISON_OF_MAX,
  DEFINING_WORLD_PLAZA_FLOWER_CALENDULA_HEAL_OF_MAX,
  DEFINING_WORLD_PLAZA_FLOWER_CALENDULA_MENDING_DURATION_MS,
  DEFINING_WORLD_PLAZA_FLOWER_CHAMOMILE_SLEEP_HEAL_OF_MAX,
  DEFINING_WORLD_PLAZA_FLOWER_CHAMOMILE_SLEEP_MS,
  DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_HEAL_OF_MAX,
  DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_SUCCESS_CHANCE,
  DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_TEMP_MAX_BASE_EV,
  DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_TEMP_MAX_MS,
  DEFINING_WORLD_PLAZA_FLOWER_INFECTION_RESIST_CHANCE_MULTIPLIER,
  DEFINING_WORLD_PLAZA_FLOWER_INFECTION_RESIST_MS,
  DEFINING_WORLD_PLAZA_FLOWER_ROSE_COLD_RESISTANCE,
  DEFINING_WORLD_PLAZA_FLOWER_ROSE_COLD_RESIST_MS,
  DEFINING_WORLD_PLAZA_FLOWER_TIMED_TOLERANCE_CELSIUS,
  DEFINING_WORLD_PLAZA_FLOWER_TIMED_TOLERANCE_MS,
  DEFINING_WORLD_PLAZA_FLOWER_VALERIAN_SLEEP_MS,
  DEFINING_WORLD_PLAZA_FLOWER_VALERIAN_SLEEP_REGEN_MULTIPLIER,
  DEFINING_WORLD_PLAZA_FLOWER_YARROW_FALLBACK_HEAL_OF_MAX,
} from '@/components/world/inventory/domains/definingWorldPlazaFlowerEatEffectTunables';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';

const DEFINING_WORLD_PLAZA_FLOWER_FOOD_SICKNESS_DEBUFF_ID =
  'food-sickness-debuff' as const;
const DEFINING_WORLD_PLAZA_FLOWER_CONFUSION_DEBUFF_ID =
  'confusion-debuff' as const;
const DEFINING_WORLD_PLAZA_FLOWER_DISEASE_NAUSEA_SLOW_DEBUFF_ID =
  'disease-nausea-slow-debuff' as const;

function applyingFlowerTimedBracedBuff(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  const descriptor = resolvingWorldPlazaEntityBuffDescriptor('braced-buff');

  if (!descriptor || descriptor.effect.kind !== 'damage_roll_modifiers') {
    return state;
  }

  let nextState = state;

  for (const [
    modifierIndex,
    modifier,
  ] of descriptor.effect.modifiers.entries()) {
    nextState = addingWorldPlazaEntityHealthDamageRollModifier(nextState, {
      id: creatingWorldPlazaEntityHealthDamageRollPresetModifierId(
        descriptor.id,
        modifierIndex
      ),
      kind: modifier.kind,
      value: modifier.value,
      expiresAtMs:
        nowMs + DEFINING_WORLD_PLAZA_FLOWER_ARNICA_BRACED_DURATION_MS,
    });
  }

  return nextState;
}

export type ApplyingWorldPlazaInventoryFlowerEatEffectsParams = {
  readonly speciesId: WorldFlowerSpeciesId;
  readonly healthState: DefiningWorldPlazaEntityHealthState;
  readonly nowMs: number;
  readonly worldEpochMs?: number;
  readonly foxgloveRoll?: number;
};

export type ApplyingWorldPlazaInventoryFlowerEatEffectsResult = {
  readonly nextHealthState: DefiningWorldPlazaEntityHealthState;
};

function applyingFlowerTimedColdTolerance(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number,
  speciesId: WorldFlowerSpeciesId
): DefiningWorldPlazaEntityHealthState {
  return addingWorldPlazaEntityHealthTimedTemperatureModifier(
    state,
    creatingWorldPlazaEntityHealthTimedTemperatureModifier(
      `flower-cold-tolerance:${speciesId}`,
      {
        heatComfortBonusCelsius: 0,
        coldComfortBonusCelsius:
          DEFINING_WORLD_PLAZA_FLOWER_TIMED_TOLERANCE_CELSIUS,
        heatResistance: 0,
        coldResistance: 0,
        diseaseContractionChanceMultiplier: 1,
        expiresAtMs: nowMs + DEFINING_WORLD_PLAZA_FLOWER_TIMED_TOLERANCE_MS,
      }
    )
  );
}

function applyingFlowerTimedHeatTolerance(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number,
  speciesId: WorldFlowerSpeciesId
): DefiningWorldPlazaEntityHealthState {
  return addingWorldPlazaEntityHealthTimedTemperatureModifier(
    state,
    creatingWorldPlazaEntityHealthTimedTemperatureModifier(
      `flower-heat-tolerance:${speciesId}`,
      {
        heatComfortBonusCelsius:
          DEFINING_WORLD_PLAZA_FLOWER_TIMED_TOLERANCE_CELSIUS,
        coldComfortBonusCelsius: 0,
        heatResistance: 0,
        coldResistance: 0,
        diseaseContractionChanceMultiplier: 1,
        expiresAtMs: nowMs + DEFINING_WORLD_PLAZA_FLOWER_TIMED_TOLERANCE_MS,
      }
    )
  );
}

function applyingFlowerTimedColdResistance(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number,
  speciesId: WorldFlowerSpeciesId
): DefiningWorldPlazaEntityHealthState {
  return addingWorldPlazaEntityHealthTimedTemperatureModifier(
    state,
    creatingWorldPlazaEntityHealthTimedTemperatureModifier(
      `flower-cold-resistance:${speciesId}`,
      {
        heatComfortBonusCelsius: 0,
        coldComfortBonusCelsius: 0,
        heatResistance: 0,
        coldResistance: DEFINING_WORLD_PLAZA_FLOWER_ROSE_COLD_RESISTANCE,
        diseaseContractionChanceMultiplier: 1,
        expiresAtMs: nowMs + DEFINING_WORLD_PLAZA_FLOWER_ROSE_COLD_RESIST_MS,
      }
    )
  );
}

function applyingFlowerInfectionResist(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number,
  speciesId: WorldFlowerSpeciesId
): DefiningWorldPlazaEntityHealthState {
  return addingWorldPlazaEntityHealthTimedTemperatureModifier(
    state,
    creatingWorldPlazaEntityHealthTimedTemperatureModifier(
      `flower-infection-resist:${speciesId}`,
      {
        heatComfortBonusCelsius: 0,
        coldComfortBonusCelsius: 0,
        heatResistance: 0,
        coldResistance: 0,
        diseaseContractionChanceMultiplier:
          DEFINING_WORLD_PLAZA_FLOWER_INFECTION_RESIST_CHANCE_MULTIPLIER,
        expiresAtMs: nowMs + DEFINING_WORLD_PLAZA_FLOWER_INFECTION_RESIST_MS,
      }
    )
  );
}

function applyingFlowerEatEffectKind(
  effectKind: DefiningWorldPlazaFlowerEatEffectKind,
  params: ApplyingWorldPlazaInventoryFlowerEatEffectsParams
): DefiningWorldPlazaEntityHealthState {
  const {
    speciesId,
    nowMs,
    worldEpochMs = resolvingWorldPlazaEntityDiseaseWorldEpochMs(),
    foxgloveRoll = Math.random(),
  } = params;
  let state = params.healthState;
  const effectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
    state,
    nowMs
  );

  switch (effectKind) {
    case 'bleedDowngradeOrHeal': {
      const beforeBleedCount = state.bleedEffects.filter(
        (effect) => effect.remainingBleedDamage > 0
      ).length;
      state = downgradingWorldPlazaEntityHealthBleedOneTier(state, nowMs);
      const afterBleedCount = state.bleedEffects.filter(
        (effect) => effect.remainingBleedDamage > 0
      ).length;

      if (beforeBleedCount === afterBleedCount) {
        state = healingWorldPlazaEntityHealthWithAmplifiers({
          receiverState: state,
          baseHealAmount:
            effectiveMax *
            DEFINING_WORLD_PLAZA_FLOWER_YARROW_FALLBACK_HEAL_OF_MAX,
          nowMs,
        }).state;
      }

      return state;
    }
    case 'healAndMending': {
      state = healingWorldPlazaEntityHealthWithAmplifiers({
        receiverState: state,
        baseHealAmount:
          effectiveMax * DEFINING_WORLD_PLAZA_FLOWER_CALENDULA_HEAL_OF_MAX,
        nowMs,
      }).state;
      return addingWorldPlazaEntityHealthOutgoingHealAmplifier(state, {
        id: 'mending-buff',
        ratio: DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO,
        expiresAtMs:
          nowMs + DEFINING_WORLD_PLAZA_FLOWER_CALENDULA_MENDING_DURATION_MS,
      });
    }
    case 'chamomile': {
      if (
        checkingWorldPlazaEntityConfusionBuffIsActive(
          state,
          DEFINING_WORLD_PLAZA_FLOWER_CONFUSION_DEBUFF_ID,
          nowMs
        )
      ) {
        return removingWorldPlazaEntityHealthConfusionEffect(
          state,
          DEFINING_WORLD_PLAZA_FLOWER_CONFUSION_DEBUFF_ID
        );
      }

      return addingWorldPlazaEntityHealthSleepEffect(state, {
        id: `flower-chamomile-sleep:${nowMs}`,
        appliedAtMs: nowMs,
        expiresAtMs: nowMs + DEFINING_WORLD_PLAZA_FLOWER_CHAMOMILE_SLEEP_MS,
        wakeBonusDamage: 0,
        canWakeFromDamage: true,
        passiveHealPercentOfMaxTotal:
          DEFINING_WORLD_PLAZA_FLOWER_CHAMOMILE_SLEEP_HEAL_OF_MAX,
      });
    }
    case 'clearSicknessDebuffs': {
      state = removingWorldPlazaEntityHealthMovementModifier(
        state,
        DEFINING_WORLD_PLAZA_FLOWER_FOOD_SICKNESS_DEBUFF_ID
      );
      return removingWorldPlazaEntityHealthMovementModifier(
        state,
        DEFINING_WORLD_PLAZA_FLOWER_DISEASE_NAUSEA_SLOW_DEBUFF_ID
      );
    }
    case 'shortenDiseaseOrInfectionResist': {
      if (
        checkingWorldPlazaEntityDiseaseIsSymptomatic(state, worldEpochMs) ||
        state.diseaseEffects.some((effect) => effect.expiresAtMs > worldEpochMs)
      ) {
        return shorteningWorldPlazaEntityDiseaseRemainingDuration(
          state,
          worldEpochMs
        );
      }

      return applyingFlowerInfectionResist(state, nowMs, speciesId);
    }
    case 'timedColdTolerance':
      return applyingFlowerTimedColdTolerance(state, nowMs, speciesId);
    case 'timedColdResistance':
      return applyingFlowerTimedColdResistance(state, nowMs, speciesId);
    case 'timedHeatTolerance':
      return applyingFlowerTimedHeatTolerance(state, nowMs, speciesId);
    case 'braced':
      return applyingFlowerTimedBracedBuff(state, nowMs);
    case 'valerianSleepRegen':
      return addingWorldPlazaEntityHealthSleepEffect(state, {
        id: `flower-valerian-sleep:${nowMs}`,
        appliedAtMs: nowMs,
        expiresAtMs: nowMs + DEFINING_WORLD_PLAZA_FLOWER_VALERIAN_SLEEP_MS,
        wakeBonusDamage: 0,
        canWakeFromDamage: true,
        regenMultiplier:
          DEFINING_WORLD_PLAZA_FLOWER_VALERIAN_SLEEP_REGEN_MULTIPLIER,
      });
    case 'foxgloveGamble': {
      if (foxgloveRoll < DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_SUCCESS_CHANCE) {
        state = healingWorldPlazaEntityHealthWithAmplifiers({
          receiverState: state,
          baseHealAmount:
            effectiveMax * DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_HEAL_OF_MAX,
          nowMs,
        }).state;
        const rollResult = computingWorldPlazaEntityHealthRolledExpectedAmount({
          state,
          baseExpectedAmount:
            DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_TEMP_MAX_BASE_EV,
          attackerModifiers: [],
          nowMs,
        });
        return addingWorldPlazaEntityHealthTemporaryMax(
          state,
          rollResult.rolledDamage,
          DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_TEMP_MAX_MS,
          nowMs,
          'temp-max-health-buff'
        );
      }

      return applyingWorldPlazaEntityHealthPoisonStack(
        state,
        'lethal',
        effectiveMax,
        nowMs
      );
    }
    case 'belladonnaPoison':
      return applyingWorldPlazaEntityHealthPoisonStack(
        state,
        'venomous',
        effectiveMax * DEFINING_WORLD_PLAZA_FLOWER_BELLADONNA_POISON_OF_MAX,
        nowMs,
        undefined,
        DEFINING_WORLD_PLAZA_FLOWER_BELLADONNA_POISON_DURATION_MS
      );
    default:
      return state;
  }
}

/**
 * Applies flower-specific eat effects from the declarative registry.
 */
export function applyingWorldPlazaInventoryFlowerEatEffects(
  params: ApplyingWorldPlazaInventoryFlowerEatEffectsParams
): ApplyingWorldPlazaInventoryFlowerEatEffectsResult {
  const effectKind = resolvingWorldPlazaFlowerEatEffectKind(params.speciesId);

  if (!effectKind) {
    return { nextHealthState: params.healthState };
  }

  return {
    nextHealthState: applyingFlowerEatEffectKind(effectKind, params),
  };
}
