/**
 * Environmental hazard kinds and resolved hazard samples.
 *
 * @module components/world/health/domains/definingWorldPlazaEnvironmentalHazardTypes
 */

export type DefiningWorldPlazaEnvironmentalHazardKind =
  | 'lava'
  | 'heat'
  | 'cold';

export type DefiningWorldPlazaEnvironmentalHazard = {
  kind: DefiningWorldPlazaEnvironmentalHazardKind;
  damagePerSecond: number;
  /** Effective local temperature in degrees Celsius. */
  temperatureCelsius: number;
};
