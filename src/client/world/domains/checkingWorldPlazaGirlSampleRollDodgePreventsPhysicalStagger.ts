import { checkingWorldPlazaGirlSampleRollDodgeMitigatesDamageKind } from '@/components/world/domains/checkingWorldPlazaGirlSampleRollDodgeMitigatesDamageKind';
import { checkingWorldPlazaGirlSampleRollDodgeWindowIsActive } from '@/components/world/domains/checkingWorldPlazaGirlSampleRollDodgeWindowIsActive';
import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * True when an active roll dodge should suppress physical hit stagger.
 */
export function checkingWorldPlazaGirlSampleRollDodgePreventsPhysicalStagger({
  rollDodgeProgress,
  damageKind,
}: {
  rollDodgeProgress: number;
  damageKind: DefiningWorldPlazaEntityDamageKind;
}): boolean {
  return (
    checkingWorldPlazaGirlSampleRollDodgeWindowIsActive(rollDodgeProgress) &&
    checkingWorldPlazaGirlSampleRollDodgeMitigatesDamageKind(damageKind)
  );
}
