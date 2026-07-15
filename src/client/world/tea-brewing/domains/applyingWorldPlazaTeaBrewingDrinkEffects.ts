/**
 * Applies always-hit brew metadata effects when drinking a cup of tea.
 *
 * @module components/world/tea-brewing/domains/applyingWorldPlazaTeaBrewingDrinkEffects
 */

import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import { DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO } from '@/components/world/health/domains/definingWorldPlazaEntityHealAmplifierConstants';
import { creatingWorldPlazaEntityHealthDamageRollPresetModifierId } from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  addingWorldPlazaEntityHealthDamageOverTime,
  addingWorldPlazaEntityHealthDamageRollModifier,
  addingWorldPlazaEntityHealthIncomingDamageModifier,
  addingWorldPlazaEntityHealthMovementModifier,
  addingWorldPlazaEntityHealthOutgoingHealAmplifier,
  addingWorldPlazaEntityHealthSleepEffect,
  addingWorldPlazaEntityHealthTimedTemperatureModifier,
  healingWorldPlazaEntityHealthWithAmplifiers,
  removingWorldPlazaEntityHealthConfusionEffect,
  removingWorldPlazaEntityHealthMovementModifier,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityDiseaseWorldEpochMs } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseWorldEpochMs';
import { creatingWorldPlazaEntityHealthTimedTemperatureModifier } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthEffectiveTemperatureResistance';
import { shorteningWorldPlazaEntityDiseaseRemainingDuration } from '@/components/world/health/domains/shorteningWorldPlazaEntityDiseaseRemainingDuration';
import type {
  DefiningWorldPlazaTeaBrewingConcentrationBonus,
  DefiningWorldPlazaTeaBrewingMetadata,
  DefiningWorldPlazaTeaBrewingResolvedEffect,
  DefiningWorldPlazaTeaBrewingScalableEffect,
} from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingTypes';

const DEFINING_WORLD_PLAZA_TEA_FOOD_SICKNESS_DEBUFF_ID =
  'food-sickness-debuff' as const;
const DEFINING_WORLD_PLAZA_TEA_PETAL_SICKNESS_DEBUFF_ID =
  'petal-sickness-debuff' as const;
const DEFINING_WORLD_PLAZA_TEA_PETAL_SICKNESS_STAMINA_DEBUFF_ID =
  'petal-sickness-stamina-debuff' as const;
const DEFINING_WORLD_PLAZA_TEA_DISEASE_NAUSEA_SLOW_DEBUFF_ID =
  'disease-nausea-slow-debuff' as const;

function applyingScalableEffect(
  state: DefiningWorldPlazaEntityHealthState,
  effectId: string,
  effect: DefiningWorldPlazaTeaBrewingScalableEffect,
  potency: number,
  durationMs: number,
  nowMs: number,
  worldEpochMs: number
): DefiningWorldPlazaEntityHealthState {
  const effectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
    state,
    nowMs
  );
  const scaledPotency = Math.max(0, potency);

  switch (effect.kind) {
    case 'heal_of_max': {
      let nextState = healingWorldPlazaEntityHealthWithAmplifiers({
        receiverState: state,
        baseHealAmount: effectiveMax * effect.baseOfMax * scaledPotency,
        nowMs,
      }).state;

      if (durationMs > 0) {
        nextState = addingWorldPlazaEntityHealthOutgoingHealAmplifier(
          nextState,
          {
            id: `tea-mending:${effectId}`,
            ratio: DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO,
            expiresAtMs: nowMs + durationMs,
          }
        );
      }

      return nextState;
    }
    case 'movement_modifier': {
      return addingWorldPlazaEntityHealthMovementModifier(state, {
        id: `tea-move:${effectId}:${effect.modifierKind}`,
        kind: effect.modifierKind,
        multiplier: 1 + effect.baseMultiplierDelta * scaledPotency,
        expiresAtMs: nowMs + Math.max(durationMs, 1_000),
      });
    }
    case 'temperature_tolerance': {
      return addingWorldPlazaEntityHealthTimedTemperatureModifier(
        state,
        creatingWorldPlazaEntityHealthTimedTemperatureModifier(
          `tea-temp-tolerance:${effectId}`,
          {
            heatComfortBonusCelsius:
              effect.band === 'heat' ? effect.baseCelsius * scaledPotency : 0,
            coldComfortBonusCelsius:
              effect.band === 'cold' ? effect.baseCelsius * scaledPotency : 0,
            heatResistance: 0,
            coldResistance: 0,
            diseaseContractionChanceMultiplier: 1,
            expiresAtMs: nowMs + Math.max(durationMs, 1_000),
          }
        )
      );
    }
    case 'temperature_resistance': {
      return addingWorldPlazaEntityHealthTimedTemperatureModifier(
        state,
        creatingWorldPlazaEntityHealthTimedTemperatureModifier(
          `tea-temp-resist:${effectId}`,
          {
            heatComfortBonusCelsius: 0,
            coldComfortBonusCelsius: 0,
            heatResistance:
              effect.band === 'heat'
                ? effect.baseResistance * scaledPotency
                : 0,
            coldResistance:
              effect.band === 'cold'
                ? effect.baseResistance * scaledPotency
                : 0,
            diseaseContractionChanceMultiplier: 1,
            expiresAtMs: nowMs + Math.max(durationMs, 1_000),
          }
        )
      );
    }
    case 'braced': {
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
            `tea-braced:${effectId}`,
            modifierIndex
          ),
          kind: modifier.kind,
          value: modifier.value,
          expiresAtMs: nowMs + Math.max(durationMs, 1_000),
        });
      }

      return nextState;
    }
    case 'sleep': {
      return addingWorldPlazaEntityHealthSleepEffect(state, {
        id: `tea-sleep:${effectId}:${nowMs}`,
        appliedAtMs: nowMs,
        expiresAtMs:
          nowMs + Math.max(effect.baseDurationMs * scaledPotency, durationMs),
        wakeBonusDamage: 0,
        canWakeFromDamage: effect.canWakeFromDamage,
        passiveHealPercentOfMaxTotal: effect.baseHealOfMax * scaledPotency,
        ...(effect.regenMultiplier !== undefined
          ? { regenMultiplier: effect.regenMultiplier }
          : {}),
      });
    }
    case 'poison_of_max': {
      const totalDamage = effectiveMax * effect.baseOfMax * scaledPotency;
      const poisonDurationMs = Math.max(
        effect.baseDurationMs * scaledPotency,
        1_000
      );
      const damagePerSecond = totalDamage / (poisonDurationMs / 1000);

      return addingWorldPlazaEntityHealthDamageOverTime(
        state,
        'toxic',
        damagePerSecond,
        poisonDurationMs,
        nowMs
      );
    }
    case 'clear_sickness': {
      let nextState = removingWorldPlazaEntityHealthMovementModifier(
        state,
        DEFINING_WORLD_PLAZA_TEA_FOOD_SICKNESS_DEBUFF_ID
      );
      nextState = removingWorldPlazaEntityHealthMovementModifier(
        nextState,
        DEFINING_WORLD_PLAZA_TEA_DISEASE_NAUSEA_SLOW_DEBUFF_ID
      );
      nextState = removingWorldPlazaEntityHealthConfusionEffect(
        nextState,
        DEFINING_WORLD_PLAZA_TEA_PETAL_SICKNESS_DEBUFF_ID
      );
      return removingWorldPlazaEntityHealthMovementModifier(
        nextState,
        DEFINING_WORLD_PLAZA_TEA_PETAL_SICKNESS_STAMINA_DEBUFF_ID
      );
    }
    case 'infection_resist': {
      return addingWorldPlazaEntityHealthTimedTemperatureModifier(
        state,
        creatingWorldPlazaEntityHealthTimedTemperatureModifier(
          `tea-infection-resist:${effectId}`,
          {
            heatComfortBonusCelsius: 0,
            coldComfortBonusCelsius: 0,
            heatResistance: 0,
            coldResistance: 0,
            diseaseContractionChanceMultiplier: Math.max(
              0,
              effect.chanceMultiplier
            ),
            expiresAtMs: nowMs + Math.max(durationMs, 1_000),
          }
        )
      );
    }
    case 'incoming_damage_multiplier': {
      const scaledMultiplier = Math.max(
        0,
        1 - (1 - effect.baseMultiplier) * scaledPotency
      );

      return addingWorldPlazaEntityHealthIncomingDamageModifier(state, {
        id: `tea-incoming-dmg:${effectId}`,
        multiplier: scaledMultiplier,
        damageKinds: effect.damageKinds,
        expiresAtMs: nowMs + Math.max(durationMs, 1_000),
      });
    }
    default:
      return state;
  }
}

function applyingResolvedEffect(
  state: DefiningWorldPlazaEntityHealthState,
  resolved: DefiningWorldPlazaTeaBrewingResolvedEffect,
  nowMs: number,
  worldEpochMs: number
): DefiningWorldPlazaEntityHealthState {
  return applyingScalableEffect(
    state,
    resolved.traitId,
    resolved.effect,
    resolved.potency,
    resolved.durationMs,
    nowMs,
    worldEpochMs
  );
}

function applyingConcentrationBonus(
  state: DefiningWorldPlazaEntityHealthState,
  bonus: DefiningWorldPlazaTeaBrewingConcentrationBonus,
  nowMs: number,
  worldEpochMs: number
): DefiningWorldPlazaEntityHealthState {
  return applyingScalableEffect(
    state,
    `bonus:${bonus.category}`,
    bonus.effect,
    1,
    bonus.durationMs,
    nowMs,
    worldEpochMs
  );
}

export type ApplyingWorldPlazaTeaBrewingDrinkEffectsResult = {
  readonly nextHealthState: DefiningWorldPlazaEntityHealthState;
  readonly appliedEffectCount: number;
};

/**
 * Applies every stored brew effect at full resolved potency (always hits).
 */
export function applyingWorldPlazaTeaBrewingDrinkEffects({
  brew,
  healthState,
  nowMs,
  worldEpochMs = nowMs,
}: {
  readonly brew: DefiningWorldPlazaTeaBrewingMetadata;
  readonly healthState: DefiningWorldPlazaEntityHealthState;
  readonly nowMs: number;
  readonly worldEpochMs?: number;
}): ApplyingWorldPlazaTeaBrewingDrinkEffectsResult {
  const resolvedWorldEpochMs =
    resolvingWorldPlazaEntityDiseaseWorldEpochMs(worldEpochMs);
  let nextHealthState = healthState;
  let appliedEffectCount = 0;

  for (const effect of brew.effects) {
    nextHealthState = applyingResolvedEffect(
      nextHealthState,
      effect,
      nowMs,
      resolvedWorldEpochMs
    );
    appliedEffectCount += 1;
  }

  if (brew.concentrationBonus) {
    nextHealthState = applyingConcentrationBonus(
      nextHealthState,
      brew.concentrationBonus,
      nowMs,
      resolvedWorldEpochMs
    );
    appliedEffectCount += 1;
  }

  // Peppermint-style clear may leave residual disease; shorten if still sick.
  if (brew.effects.some((effect) => effect.effect.kind === 'clear_sickness')) {
    nextHealthState = shorteningWorldPlazaEntityDiseaseRemainingDuration(
      nextHealthState,
      resolvedWorldEpochMs
    );
  }

  return {
    nextHealthState,
    appliedEffectCount,
  };
}
