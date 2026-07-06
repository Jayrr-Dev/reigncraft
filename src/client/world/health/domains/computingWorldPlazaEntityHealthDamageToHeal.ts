import { DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_MAX_RATIO } from '@/components/world/health/domains/definingWorldPlazaEntityDamageToHealConstants';
import type {
  DefiningWorldPlazaEntityHealthAppliedDamage,
  DefiningWorldPlazaEntityHealthIncomingDamageHealModifier,
  DefiningWorldPlazaEntityHealthPhysicalDamageLifestealModifier,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

type DefiningWorldPlazaEntityHealthDamageToHealModifier = {
  ratio: number;
  expiresAtMs: number | null;
};

function filteringWorldPlazaActiveDamageToHealModifiers<
  TModifier extends DefiningWorldPlazaEntityHealthDamageToHealModifier,
>(modifiers: readonly TModifier[], nowMs: number): TModifier[] {
  return modifiers.filter(
    (modifier) => modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs
  );
}

/**
 * Sums active damage-to-heal ratios, capped at 100%.
 */
export function resolvingWorldPlazaEntityHealthDamageToHealRatio(
  modifiers: readonly DefiningWorldPlazaEntityHealthDamageToHealModifier[],
  nowMs: number
): number {
  const activeRatio = filteringWorldPlazaActiveDamageToHealModifiers(
    modifiers,
    nowMs
  ).reduce((sum, modifier) => sum + modifier.ratio, 0);

  return Math.min(
    DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_MAX_RATIO,
    Math.max(0, activeRatio)
  );
}

/**
 * Physical hit amount used as the basis for Siphoning and Absorb healing.
 */
export function computingWorldPlazaEntityHealthPhysicalDamageToHealBasis(
  appliedDamage: DefiningWorldPlazaEntityHealthAppliedDamage
): number {
  if (appliedDamage.wasBlocked) {
    return 0;
  }

  return appliedDamage.healthDamage + appliedDamage.absorbedByShield;
}

/**
 * Converts a physical hit amount and ratio into a heal amount.
 */
export function computingWorldPlazaEntityHealthDamageToHealAmount(
  damageBasis: number,
  ratio: number
): number {
  if (damageBasis <= 0 || ratio <= 0) {
    return 0;
  }

  return (
    damageBasis *
    Math.min(DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_MAX_RATIO, ratio)
  );
}

export type ComputingWorldPlazaEntityHealthDamageToHealResult = {
  siphonHealAmount: number;
  absorbHealAmount: number;
  totalHealAmount: number;
};

/**
 * Resolves Siphoning and Absorb healing from one physical damage application.
 */
export function computingWorldPlazaEntityHealthDamageToHeal({
  appliedDamage,
  physicalDamageLifestealModifiers,
  incomingDamageHealModifiers,
  nowMs,
}: {
  appliedDamage: DefiningWorldPlazaEntityHealthAppliedDamage;
  physicalDamageLifestealModifiers: readonly DefiningWorldPlazaEntityHealthPhysicalDamageLifestealModifier[];
  incomingDamageHealModifiers: readonly DefiningWorldPlazaEntityHealthIncomingDamageHealModifier[];
  nowMs: number;
}): ComputingWorldPlazaEntityHealthDamageToHealResult {
  const damageBasis =
    computingWorldPlazaEntityHealthPhysicalDamageToHealBasis(appliedDamage);

  const siphonHealAmount = computingWorldPlazaEntityHealthDamageToHealAmount(
    damageBasis,
    resolvingWorldPlazaEntityHealthDamageToHealRatio(
      physicalDamageLifestealModifiers,
      nowMs
    )
  );
  const absorbHealAmount = computingWorldPlazaEntityHealthDamageToHealAmount(
    damageBasis,
    resolvingWorldPlazaEntityHealthDamageToHealRatio(
      incomingDamageHealModifiers,
      nowMs
    )
  );

  return {
    siphonHealAmount,
    absorbHealAmount,
    totalHealAmount: siphonHealAmount + absorbHealAmount,
  };
}
