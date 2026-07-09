import { resolvingWorldPlazaEntityDamageKindTemperatureExposure } from '@/components/world/health/domains/definingWorldPlazaEntityDamageKindRegistry';
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

function clampingWorldPlazaTemperatureWeaknessFraction(
  weakness: number
): number {
  return Math.min(1, Math.max(0, weakness));
}

/**
 * Returns the damage multiplier after heat/cold resistance, weakness, and immunity.
 *
 * Formula: `(1 - resistance) * (1 + weakness)`. Immunity hard-blocks (0).
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
    resolvingWorldPlazaEntityDamageKindTemperatureExposure(damageKind);

  if (!resolvedExposureKind) {
    return 1;
  }

  if (resolvedExposureKind === 'heat') {
    if (resistance.isHeatImmune) {
      return 0;
    }

    const resistFraction = clampingWorldPlazaTemperatureResistanceFraction(
      resistance.heatResistance
    );
    const weaknessFraction = clampingWorldPlazaTemperatureWeaknessFraction(
      resistance.heatWeakness
    );

    return (1 - resistFraction) * (1 + weaknessFraction);
  }

  if (resistance.isColdImmune) {
    return 0;
  }

  const resistFraction = clampingWorldPlazaTemperatureResistanceFraction(
    resistance.coldResistance
  );
  const weaknessFraction = clampingWorldPlazaTemperatureWeaknessFraction(
    resistance.coldWeakness
  );

  return (1 - resistFraction) * (1 + weaknessFraction);
}

/**
 * Applies temperature resistance and weakness to a raw environmental DoT rate.
 */
export function applyingWorldPlazaEntityTemperatureResistanceToDamagePerSecond(
  damagePerSecond: number,
  exposureKind: DefiningWorldPlazaTemperatureExposureKind,
  resistance: DefiningWorldPlazaEntityTemperatureResistance
): number {
  return applyingWorldPlazaEntityTemperatureResistanceToEnvironmentalDamageRates(
    {
      damagePerSecond,
      maxHealthPercentPerSecond: 0,
      exposureKind,
      resistance,
    }
  ).damagePerSecond;
}

export type ApplyingWorldPlazaEntityTemperatureResistanceToEnvironmentalDamageRatesParams =
  {
    damagePerSecond: number;
    maxHealthPercentPerSecond: number;
    exposureKind: DefiningWorldPlazaTemperatureExposureKind;
    resistance: DefiningWorldPlazaEntityTemperatureResistance;
  };

/**
 * Applies temperature resistance and weakness to flat and percent environmental DoT rates.
 */
export function applyingWorldPlazaEntityTemperatureResistanceToEnvironmentalDamageRates({
  damagePerSecond,
  maxHealthPercentPerSecond,
  exposureKind,
  resistance,
}: ApplyingWorldPlazaEntityTemperatureResistanceToEnvironmentalDamageRatesParams): {
  damagePerSecond: number;
  maxHealthPercentPerSecond: number;
} {
  const damageKind =
    exposureKind === 'heat' ? 'environmental_heat' : 'environmental_cold';

  const multiplier = resolvingWorldPlazaEntityTemperatureResistanceMultiplier({
    exposureKind,
    damageKind,
    resistance,
  });

  return {
    damagePerSecond: Math.max(0, damagePerSecond * multiplier),
    maxHealthPercentPerSecond: Math.max(
      0,
      maxHealthPercentPerSecond * multiplier
    ),
  };
}
