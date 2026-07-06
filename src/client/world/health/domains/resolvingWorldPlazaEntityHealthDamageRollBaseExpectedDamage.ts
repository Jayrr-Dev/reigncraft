import {
  resolvingWorldPlazaEntityDamageKindDescriptor,
  type DefiningWorldPlazaEntityDamageKindExpectedDamageInput,
} from '@/components/world/health/domains/definingWorldPlazaEntityDamageKindRegistry';
import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

function computingWorldPlazaEntityHealthMaxHealthPercentExpectedDamage(
  healthPercentEv: number,
  effectiveMaxHealth: number
): number {
  return Math.max(0, healthPercentEv) * effectiveMaxHealth;
}

function resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamageFromInput(
  expectedDamageInput: DefiningWorldPlazaEntityDamageKindExpectedDamageInput,
  rawAmount: number,
  effectiveMaxHealth: number
): number {
  if (expectedDamageInput === 'max_health_percent_ev') {
    return computingWorldPlazaEntityHealthMaxHealthPercentExpectedDamage(
      rawAmount,
      effectiveMaxHealth
    );
  }

  return rawAmount;
}

/**
 * Converts caller `rawAmount` into flat EV before the statistical roll engine runs.
 */
export function resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamage({
  kind,
  rawAmount,
  effectiveMaxHealth,
}: {
  kind: DefiningWorldPlazaEntityDamageKind;
  rawAmount: number;
  effectiveMaxHealth: number;
}): number {
  const descriptor = resolvingWorldPlazaEntityDamageKindDescriptor(kind);

  return resolvingWorldPlazaEntityHealthDamageRollBaseExpectedDamageFromInput(
    descriptor.expectedDamageInput,
    rawAmount,
    effectiveMaxHealth
  );
}
