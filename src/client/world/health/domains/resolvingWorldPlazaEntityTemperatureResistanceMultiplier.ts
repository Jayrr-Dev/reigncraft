import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type {
  DefiningWorldPlazaEntityTemperatureResistance,
  DefiningWorldPlazaTemperatureExposureKind,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

function clampingWorldPlazaTemperatureResistanceFraction(
  resistance: number
): number {
  return Math.min(1, Math.max(0, resistance));
}

/**
 * Returns the damage multiplier after heat/cold resistance and immunity.
 */
export function resolvingWorldPlazaEntityTemperatureResistanceMultiplier({
  exposureKind,
  damageKind,
  resistance,
}: {
  exposureKind: DefiningWorldPlazaTemperatureExposureKind | null;
  damageKind: DefiningWorldPlazaEntityDamageKind;
  resistance: DefiningWorldPlazaEntityTemperatureResistance;
}): number {
  const resolvedExposureKind =
    exposureKind ??
    (damageKind === 'environmental_heat'
      ? 'heat'
      : damageKind === 'environmental_cold'
        ? 'cold'
        : null);

  if (!resolvedExposureKind) {
    return 1;
  }

  if (resolvedExposureKind === 'heat') {
    if (resistance.isHeatImmune) {
      return 0;
    }

    return (
      1 -
      clampingWorldPlazaTemperatureResistanceFraction(resistance.heatResistance)
    );
  }

  if (resistance.isColdImmune) {
    return 0;
  }

  return (
    1 -
    clampingWorldPlazaTemperatureResistanceFraction(resistance.coldResistance)
  );
}

/**
 * Applies temperature resistance to a raw environmental DoT rate.
 */
export function applyingWorldPlazaEntityTemperatureResistanceToDamagePerSecond(
  damagePerSecond: number,
  exposureKind: DefiningWorldPlazaTemperatureExposureKind,
  resistance: DefiningWorldPlazaEntityTemperatureResistance
): number {
  const multiplier = resolvingWorldPlazaEntityTemperatureResistanceMultiplier({
    exposureKind,
    damageKind:
      exposureKind === 'heat' ? 'environmental_heat' : 'environmental_cold',
    resistance,
  });

  return Math.max(0, damagePerSecond * multiplier);
}
