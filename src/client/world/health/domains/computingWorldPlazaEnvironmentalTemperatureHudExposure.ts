import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import {
  buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius,
  computingWorldPlazaEnvironmentalTemperatureTotalDamagePerSecond,
} from '@/components/world/health/domains/computingWorldPlazaTemperatureDamagePerSecond';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type {
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEntityTemperatureResistance } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import { mappingWorldPlazaEnvironmentalHazardKindToDamageKind } from '@/components/world/health/domains/mappingWorldPlazaEnvironmentalHazardKindToDamageKind';
import { applyingWorldPlazaEntityTemperatureResistanceToEnvironmentalDamageRates } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureResistanceMultiplier';

export type ComputingWorldPlazaEnvironmentalTemperatureHudExposure = {
  damageKind: DefiningWorldPlazaEntityDamageKind;
  damagePerSecond: number;
};

/**
 * Resolves the live resisted heat/cold/lava DoT rate for the status HUD.
 */
export function computingWorldPlazaEnvironmentalTemperatureHudExposure(
  celsius: number | null,
  temperatureResistance: DefiningWorldPlazaEntityTemperatureResistance,
  healthState?: DefiningWorldPlazaEntityHealthState,
  nowMs = 0
): ComputingWorldPlazaEnvironmentalTemperatureHudExposure | null {
  if (celsius === null) {
    return null;
  }

  const hazard = buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius(
    celsius,
    temperatureResistance
  );

  if (!hazard) {
    return null;
  }

  const exposureKind = hazard.kind === 'cold' ? 'cold' : 'heat';
  const resistedRates =
    applyingWorldPlazaEntityTemperatureResistanceToEnvironmentalDamageRates({
      damagePerSecond: hazard.damagePerSecond,
      maxHealthPercentPerSecond: hazard.maxHealthPercentPerSecond,
      exposureKind,
      resistance: temperatureResistance,
    });

  const effectiveMaxHealth = healthState
    ? computingWorldPlazaEntityHealthEffectiveMax(healthState, nowMs)
    : DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX;
  const totalDamagePerSecond =
    computingWorldPlazaEnvironmentalTemperatureTotalDamagePerSecond(
      resistedRates.damagePerSecond,
      resistedRates.maxHealthPercentPerSecond,
      effectiveMaxHealth
    );

  if (totalDamagePerSecond <= 0) {
    return null;
  }

  return {
    damageKind: mappingWorldPlazaEnvironmentalHazardKindToDamageKind(
      hazard.kind
    ),
    damagePerSecond: totalDamagePerSecond,
  };
}
