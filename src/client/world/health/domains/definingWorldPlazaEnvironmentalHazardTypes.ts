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
  /** Fraction of effective max health lost per second (scales with temperature). */
  maxHealthPercentPerSecond: number;
  /** Effective local temperature in degrees Celsius. */
  temperatureCelsius: number;
};
