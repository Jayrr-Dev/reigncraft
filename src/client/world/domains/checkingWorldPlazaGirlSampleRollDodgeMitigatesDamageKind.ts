import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MITIGATED_DAMAGE_KINDS } from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';
import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MITIGATED_DAMAGE_KIND_SET: ReadonlySet<DefiningWorldPlazaEntityDamageKind> =
  new Set(DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MITIGATED_DAMAGE_KINDS);

/**
 * Returns true when an active roll dodge should negate this damage kind.
 */
export function checkingWorldPlazaGirlSampleRollDodgeMitigatesDamageKind(
  kind: DefiningWorldPlazaEntityDamageKind
): boolean {
  return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MITIGATED_DAMAGE_KIND_SET.has(
    kind
  );
}
