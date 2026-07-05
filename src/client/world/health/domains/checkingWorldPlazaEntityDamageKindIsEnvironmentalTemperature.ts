import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

const CHECKING_WORLD_PLAZA_ENTITY_ENVIRONMENTAL_TEMPERATURE_DAMAGE_KINDS =
  new Set<DefiningWorldPlazaEntityDamageKind>([
    'environmental_lava',
    'environmental_heat',
    'environmental_cold',
  ]);

/**
 * Returns whether a damage kind is applied from eased environmental temperature.
 */
export function checkingWorldPlazaEntityDamageKindIsEnvironmentalTemperature(
  kind: DefiningWorldPlazaEntityDamageKind | null | undefined
): boolean {
  return (
    kind !== null &&
    kind !== undefined &&
    CHECKING_WORLD_PLAZA_ENTITY_ENVIRONMENTAL_TEMPERATURE_DAMAGE_KINDS.has(kind)
  );
}
