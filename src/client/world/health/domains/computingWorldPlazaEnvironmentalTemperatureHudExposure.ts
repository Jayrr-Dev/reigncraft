import { buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius } from '@/components/world/health/domains/computingWorldPlazaTemperatureDamagePerSecond';
import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEntityTemperatureResistance } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import { mappingWorldPlazaEnvironmentalHazardKindToDamageKind } from '@/components/world/health/domains/mappingWorldPlazaEnvironmentalHazardKindToDamageKind';
import { applyingWorldPlazaEntityTemperatureResistanceToDamagePerSecond } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureResistanceMultiplier';

export type ComputingWorldPlazaEnvironmentalTemperatureHudExposure = {
  damageKind: DefiningWorldPlazaEntityDamageKind;
  damagePerSecond: number;
};

/**
 * Resolves the live resisted heat/cold/lava DoT rate for the status HUD.
 */
export function computingWorldPlazaEnvironmentalTemperatureHudExposure(
  celsius: number | null,
  temperatureResistance: DefiningWorldPlazaEntityTemperatureResistance
): ComputingWorldPlazaEnvironmentalTemperatureHudExposure | null {
  if (celsius === null) {
    return null;
  }

  const hazard =
    buildingWorldPlazaEnvironmentalHazardFromTemperatureCelsius(celsius);

  if (!hazard || hazard.damagePerSecond <= 0) {
    return null;
  }

  const exposureKind = hazard.kind === 'cold' ? 'cold' : 'heat';
  const resistedDamagePerSecond =
    applyingWorldPlazaEntityTemperatureResistanceToDamagePerSecond(
      hazard.damagePerSecond,
      exposureKind,
      temperatureResistance
    );

  if (resistedDamagePerSecond <= 0) {
    return null;
  }

  return {
    damageKind: mappingWorldPlazaEnvironmentalHazardKindToDamageKind(
      hazard.kind
    ),
    damagePerSecond: resistedDamagePerSecond,
  };
}
