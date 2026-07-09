/**
 * Temperature exposure, resistance, and assignable level profiles.
 *
 * Canonical simulation values are stored in degrees Celsius. Use
 * {@link convertingWorldPlazaCelsiusToFahrenheit} for Fahrenheit display.
 *
 * @module components/world/health/domains/definingWorldPlazaTemperatureTypes
 */

/** Display unit for temperature readouts. */
export type DefiningWorldPlazaTemperatureDisplayUnit = 'celsius' | 'fahrenheit';

/** Heat or cold environmental hazard category. */
export type DefiningWorldPlazaTemperatureExposureKind = 'heat' | 'cold';

/**
 * Assignable local temperature for blocks, painted areas, or mob auras.
 *
 * Set `localTemperatureCelsius` for an absolute override, or use
 * `heatLevelCelsius` / `coldLevelCelsius` to push local temperature hotter
 * or colder than ambient (whichever is more extreme wins per tile).
 */
export type DefiningWorldPlazaEnvironmentalTemperatureLevel = {
  readonly localTemperatureCelsius?: number;
  readonly heatLevelCelsius?: number;
  readonly coldLevelCelsius?: number;
};

/** Resolved temperature sample at one world location. */
export type DefiningWorldPlazaEnvironmentalTemperatureSample = {
  readonly celsius: number;
  readonly exposureKind: DefiningWorldPlazaTemperatureExposureKind | null;
  /** Flat HP damage per second. */
  readonly damagePerSecond: number;
  /** Fraction of effective max health lost per second (scales with temperature). */
  readonly maxHealthPercentPerSecond: number;
};

/** Player/NPC resistance and weakness to temperature damage. */
export type DefiningWorldPlazaEntityTemperatureResistance = {
  /** Fraction of heat damage prevented (0 = none, 1 = full resist). */
  readonly heatResistance: number;
  /** Fraction of cold damage prevented (0 = none, 1 = full resist). */
  readonly coldResistance: number;
  /** Extra heat damage taken as a fraction (0 = none, 1 = +100%). */
  readonly heatWeakness: number;
  /** Extra cold damage taken as a fraction (0 = none, 1 = +100%). */
  readonly coldWeakness: number;
  /**
   * Extra °C added to comfort high before heat DoT starts.
   * Stacks with heat-tolerance buffs.
   */
  readonly heatComfortBonusCelsius: number;
  /**
   * Extra °C subtracted from comfort low before cold DoT starts.
   * Stacks with cold-tolerance buffs.
   */
  readonly coldComfortBonusCelsius: number;
  readonly isHeatImmune: boolean;
  readonly isColdImmune: boolean;
};

/** Effective comfort band after entity heat/cold tolerance bonuses. */
export type DefiningWorldPlazaEntityTemperatureComfortBand = {
  readonly comfortHighCelsius: number;
  readonly comfortLowCelsius: number;
};

/** Axis-aligned tile rectangle with a temperature profile. */
export type DefiningWorldPlazaTemperatureAreaProfile = {
  readonly id: string;
  readonly label: string;
  readonly minTileX: number;
  readonly minTileY: number;
  readonly maxTileX: number;
  readonly maxTileY: number;
  readonly temperature: DefiningWorldPlazaEnvironmentalTemperatureLevel;
};

/** Mob temperature aura and optional innate resistance. */
export type DefiningWorldPlazaMobTemperatureProfile = {
  readonly mobKind: string;
  readonly label: string;
  readonly aura?: DefiningWorldPlazaEnvironmentalTemperatureLevel;
  readonly resistance?: DefiningWorldPlazaEntityTemperatureResistance;
};
