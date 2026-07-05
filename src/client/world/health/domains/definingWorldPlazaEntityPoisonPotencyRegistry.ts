import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { MappingWorldPlazaEntityHealthFloatTextIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityHealthFloatTextIcon';

/** Poison potency tier controlling pool size and drain duration. */
export type DefiningWorldPlazaEntityPoisonPotency =
  | 'toxic'
  | 'venomous'
  | 'lethal';

export type DefiningWorldPlazaEntityPoisonPotencyDescriptor = {
  potency: DefiningWorldPlazaEntityPoisonPotency;
  damageKind: DefiningWorldPlazaEntityDamageKind;
  label: string;
  description: string;
  durationMs: number;
  healthPercentExpected: number;
  floatIcon: MappingWorldPlazaEntityHealthFloatTextIconName;
  floatClassNameOverride: string;
  hudIconColorClassName: string;
  hudIconBorderClassName: string;
  deathScreenTitle: string;
};

export const DEFINING_WORLD_PLAZA_ENTITY_POISON_POTENCY_REGISTRY: Record<
  DefiningWorldPlazaEntityPoisonPotency,
  DefiningWorldPlazaEntityPoisonPotencyDescriptor
> = {
  toxic: {
    potency: 'toxic',
    damageKind: 'toxic',
    label: 'Toxic',
    description:
      'Stacks additively on repeat hits. Flat hit plus 10% max HP over 1 minute.',
    durationMs: 60 * 1000,
    healthPercentExpected: 0.1,
    floatIcon: 'mdi:biohazard',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-toxic text-green-400',
    hudIconColorClassName: 'text-green-400',
    hudIconBorderClassName: 'border-green-500/60 bg-green-950/85',
    deathScreenTitle: 'YOU WERE POISONED',
  },
  venomous: {
    potency: 'venomous',
    damageKind: 'venomous',
    label: 'Venomous',
    description:
      'Stacks additively on repeat hits. Flat hit plus 20% max HP over 30 seconds.',
    durationMs: 30 * 1000,
    healthPercentExpected: 0.2,
    floatIcon: 'game-icons:scythe',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-venomous text-green-500',
    hudIconColorClassName: 'text-green-500',
    hudIconBorderClassName: 'border-green-600/65 bg-green-950/90',
    deathScreenTitle: 'VENOM KILLED YOU',
  },
  lethal: {
    potency: 'lethal',
    damageKind: 'lethal',
    label: 'Lethal',
    description:
      'Maximum poison tier. Flat hit plus 50% max HP over 10 seconds. Most damage lands at the end.',
    durationMs: 10 * 1000,
    healthPercentExpected: 0.5,
    floatIcon: 'game-icons:death-skull',
    floatClassNameOverride:
      'plaza-combat-float-damage plaza-combat-float-lethal-poison text-green-700',
    hudIconColorClassName: 'text-green-700',
    hudIconBorderClassName: 'border-green-800/75 bg-green-950/95',
    deathScreenTitle: 'LETHAL POISON',
  },
};

export function resolvingWorldPlazaEntityPoisonPotencyDescriptor(
  potency: DefiningWorldPlazaEntityPoisonPotency
): DefiningWorldPlazaEntityPoisonPotencyDescriptor {
  return DEFINING_WORLD_PLAZA_ENTITY_POISON_POTENCY_REGISTRY[potency];
}

export function mappingWorldPlazaEntityPoisonPotencyToDamageKind(
  potency: DefiningWorldPlazaEntityPoisonPotency
): DefiningWorldPlazaEntityDamageKind {
  return DEFINING_WORLD_PLAZA_ENTITY_POISON_POTENCY_REGISTRY[potency]
    .damageKind;
}
