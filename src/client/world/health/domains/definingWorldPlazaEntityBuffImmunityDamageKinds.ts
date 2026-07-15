import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** HP floor while death immunity is active. */
export const DEFINING_WORLD_PLAZA_ENTITY_DEATH_IMMUNITY_MINIMUM_HEALTH = 1;

/** Poison DoT damage kinds blocked by poison immunity. */
export const DEFINING_WORLD_PLAZA_ENTITY_POISON_IMMUNITY_DAMAGE_KINDS = [
  'toxic',
  'venomous',
  'lethal',
] as const satisfies readonly DefiningWorldPlazaEntityDamageKind[];

/** Bleed DoT damage kinds blocked by bleed immunity. */
export const DEFINING_WORLD_PLAZA_ENTITY_BLEED_IMMUNITY_DAMAGE_KINDS = [
  'bleeding',
  'hemorrhaging',
  'exsanguinating',
] as const satisfies readonly DefiningWorldPlazaEntityDamageKind[];

/** Fated (delayed) damage kind blocked by fated immunity. */
export const DEFINING_WORLD_PLAZA_ENTITY_FATED_IMMUNITY_DAMAGE_KINDS = [
  'potential_damage',
] as const satisfies readonly DefiningWorldPlazaEntityDamageKind[];

/**
 * Whether every kind in a group is present on the immunities list.
 */
export function checkingWorldPlazaEntityDamageKindImmunityGroupIsActive(
  damageKindImmunities: readonly DefiningWorldPlazaEntityDamageKind[],
  kinds: readonly DefiningWorldPlazaEntityDamageKind[]
): boolean {
  if (damageKindImmunities.length === 0) {
    return false;
  }

  return kinds.every((kind) => damageKindImmunities.includes(kind));
}

/**
 * Adds or removes a damage-kind immunity group (toggle).
 */
export function togglingWorldPlazaEntityDamageKindImmunityGroup(
  damageKindImmunities: readonly DefiningWorldPlazaEntityDamageKind[],
  kinds: readonly DefiningWorldPlazaEntityDamageKind[]
): readonly DefiningWorldPlazaEntityDamageKind[] {
  const isActive = checkingWorldPlazaEntityDamageKindImmunityGroupIsActive(
    damageKindImmunities,
    kinds
  );

  if (isActive) {
    const kindSet = new Set<DefiningWorldPlazaEntityDamageKind>(kinds);
    return damageKindImmunities.filter((kind) => !kindSet.has(kind));
  }

  const next = [...damageKindImmunities];

  for (const kind of kinds) {
    if (!next.includes(kind)) {
      next.push(kind);
    }
  }

  return next;
}
