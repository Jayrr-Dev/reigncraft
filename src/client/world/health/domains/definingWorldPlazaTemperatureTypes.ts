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
  readonly damagePerSecond: number;
};

/** Player/NPC resistance to temperature damage. */
export type DefiningWorldPlazaEntityTemperatureResistance = {
  /** Fraction of heat damage prevented (0 = none, 1 = full resist). */
  readonly heatResistance: number;
  /** Fraction of cold damage prevented (0 = none, 1 = full resist). */
  readonly coldResistance: number;
  readonly isHeatImmune: boolean;
  readonly isColdImmune: boolean;
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
