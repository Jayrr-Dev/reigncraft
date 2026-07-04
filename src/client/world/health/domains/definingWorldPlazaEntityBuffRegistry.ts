import type { DefiningWorldPlazaEntityBuffCategoryId } from '@/components/world/health/domains/definingWorldPlazaEntityBuffCategoryRegistry';
import type { DefiningWorldPlazaEntityHealthDamageRollModifierKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Short-term positive or negative stat adjustments. */
export type DefiningWorldPlazaEntityBuffPolarity = 'buff' | 'debuff';

/** How long the effect lasts once applied. */
export type DefiningWorldPlazaEntityBuffDurationKind =
  | 'toggle'
  | 'timed'
  | 'instant';

export type DefiningWorldPlazaEntityBuffRollSide = 'defender' | 'attacker';

export type DefiningWorldPlazaEntityBuffRollModifier = {
  kind: DefiningWorldPlazaEntityHealthDamageRollModifierKind;
  value: number;
};

export type DefiningWorldPlazaEntityBuffEffect =
  | {
      kind: 'damage_roll_modifiers';
      side: DefiningWorldPlazaEntityBuffRollSide;
      modifiers: readonly DefiningWorldPlazaEntityBuffRollModifier[];
    }
  | {
      kind: 'incoming_damage_multiplier';
      multiplier: number;
    }
  | {
      kind: 'temporary_max_health';
      baseExpectedAmount: number;
    }
  | {
      kind: 'max_health_scale';
      multiplier: number;
    }
  | {
      kind: 'heat_resistance';
      amount: number;
    }
  | {
      kind: 'cold_resistance';
      amount: number;
    }
  | {
      kind: 'toggle_heat_immunity';
    }
  | {
      kind: 'toggle_cold_immunity';
    }
  | {
      kind: 'invincibility_toggle';
    };

/** Declarative short-term buff or debuff definition. */
export type DefiningWorldPlazaEntityBuffDescriptor = {
  id: string;
  label: string;
  description: string;
  polarity: DefiningWorldPlazaEntityBuffPolarity;
  category: DefiningWorldPlazaEntityBuffCategoryId;
  durationKind: DefiningWorldPlazaEntityBuffDurationKind;
  /** Used when {@link durationKind} is `timed`. */
  durationMs: number | null;
  effect: DefiningWorldPlazaEntityBuffEffect;
};

/** Single source of truth for temporary buffs and debuffs. */
export const DEFINING_WORLD_PLAZA_ENTITY_BUFF_REGISTRY: Record<
  string,
  DefiningWorldPlazaEntityBuffDescriptor
> = Object.fromEntries(
  [
    {
      id: 'iron-armor',
      label: 'Iron Armour',
      description: '-20% incoming expected damage',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [{ kind: 'expected', value: 0.8 }],
      },
    },
    {
      id: 'heavy-armor',
      label: 'Heavy Armour',
      description: '-30% incoming expected damage',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [{ kind: 'expected', value: 0.7 }],
      },
    },
    {
      id: 'tower-shield',
      label: 'Tower Shield',
      description: '+1 block tier shift',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [{ kind: 'block_bias', value: 1 }],
      },
    },
    {
      id: 'light-boots',
      label: 'Light Boots',
      description: '+1 dodge tier shift',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [{ kind: 'dodge_bias', value: 1 }],
      },
    },
    {
      id: 'stabilizing-armor',
      label: 'Stabilizing Armour',
      description: '-30% incoming enemy variance',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [{ kind: 'stability', value: 0.7 }],
      },
    },
    {
      id: 'risk-armor',
      label: 'Risk Armour',
      description: '+30% incoming variance',
      polarity: 'debuff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [{ kind: 'variance', value: 1.3 }],
      },
    },
    {
      id: 'defense-buff',
      label: 'Defense Buff',
      description: '-20% incoming expected damage',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [{ kind: 'expected', value: 0.8 }],
      },
    },
    {
      id: 'evasion-buff',
      label: 'Evasion Buff',
      description: '+1 dodge tier shift',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [{ kind: 'dodge_bias', value: 1 }],
      },
    },
    {
      id: 'guard-buff',
      label: 'Guard Buff',
      description: '+1 block tier shift',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [{ kind: 'block_bias', value: 1 }],
      },
    },
    {
      id: 'fortify-buff',
      label: 'Fortify Buff',
      description: 'Skews enemy rolls toward blocked outcomes',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [
          { kind: 'luck', value: -0.5 },
          { kind: 'block_bias', value: 1 },
        ],
      },
    },
    {
      id: 'stabilize-buff',
      label: 'Stabilize',
      description: '-50% incoming randomness',
      polarity: 'buff',
      category: 'utility',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [{ kind: 'stability', value: 0.5 }],
      },
    },
    {
      id: 'half-damage-buff',
      label: 'Half Damage',
      description: 'Take 50% damage for 30 seconds',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'timed',
      durationMs: 30_000,
      effect: {
        kind: 'incoming_damage_multiplier',
        multiplier: 0.5,
      },
    },
    {
      id: 'power-buff',
      label: 'Power Buff',
      description: '+20% expected damage',
      polarity: 'buff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'attacker',
        modifiers: [{ kind: 'expected', value: 1.2 }],
      },
    },
    {
      id: 'rage-buff',
      label: 'Rage Buff',
      description: '+30% damage variance',
      polarity: 'buff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'attacker',
        modifiers: [{ kind: 'variance', value: 1.3 }],
      },
    },
    {
      id: 'assassin-buff',
      label: 'Assassin Buff',
      description: 'Skews rolls toward critical outcomes',
      polarity: 'buff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'attacker',
        modifiers: [
          { kind: 'luck', value: 0.5 },
          { kind: 'critical_bias', value: 1 },
        ],
      },
    },
    {
      id: 'precision-buff',
      label: 'Precision Buff',
      description: 'Skews rolls away from low outcomes',
      polarity: 'buff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'attacker',
        modifiers: [{ kind: 'luck', value: 0.5 }],
      },
    },
    {
      id: 'true-strike-buff',
      label: 'True Strike',
      description: 'Always hits the expected damage value',
      polarity: 'buff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'attacker',
        modifiers: [{ kind: 'lock_in', value: 1 }],
      },
    },
    {
      id: 'lock-in-buff',
      label: 'Lock-In',
      description: 'Forces damage to the expected value',
      polarity: 'buff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'attacker',
        modifiers: [{ kind: 'lock_in', value: 1 }],
      },
    },
    {
      id: 'focus-buff',
      label: 'Focus',
      description: 'Reduces low-roll chance and variance',
      polarity: 'buff',
      category: 'utility',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'attacker',
        modifiers: [
          { kind: 'luck', value: 0.5 },
          { kind: 'stability', value: 0.75 },
        ],
      },
    },
    {
      id: 'controlled-output-buff',
      label: 'Controlled Output',
      description: 'Highly consistent damage near expected',
      polarity: 'buff',
      category: 'utility',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'attacker',
        modifiers: [
          { kind: 'stability', value: 0.35 },
          { kind: 'luck', value: 0.35 },
        ],
      },
    },
    {
      id: 'all-or-nothing-buff',
      label: 'All-or-Nothing',
      description: 'High extreme outcomes, low normal hits',
      polarity: 'buff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'attacker',
        modifiers: [
          { kind: 'chaotic', value: 1 },
          { kind: 'variance', value: 1.4 },
        ],
      },
    },
    {
      id: 'temp-max-health-buff',
      label: '+50 Temp HP EV',
      description: 'Rolled temporary max health for 30 seconds',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 30_000,
      effect: {
        kind: 'temporary_max_health',
        baseExpectedAmount: 50,
      },
    },
    {
      id: 'double-max-health-buff',
      label: 'Double Max HP',
      description: 'Doubles effective max health scale',
      polarity: 'buff',
      category: 'character',
      durationKind: 'instant',
      durationMs: null,
      effect: {
        kind: 'max_health_scale',
        multiplier: 2,
      },
    },
    {
      id: 'halve-max-health-buff',
      label: 'Halve Max HP',
      description: 'Halves effective max health scale',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'instant',
      durationMs: null,
      effect: {
        kind: 'max_health_scale',
        multiplier: 0.5,
      },
    },
    {
      id: 'heat-resistance-buff',
      label: '+25% Heat Resist',
      description: 'Increases heat resistance by 25%',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'instant',
      durationMs: null,
      effect: {
        kind: 'heat_resistance',
        amount: 0.25,
      },
    },
    {
      id: 'cold-resistance-buff',
      label: '+25% Cold Resist',
      description: 'Increases cold resistance by 25%',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'instant',
      durationMs: null,
      effect: {
        kind: 'cold_resistance',
        amount: 0.25,
      },
    },
    {
      id: 'heat-immunity-buff',
      label: 'Toggle Heat Immunity',
      description: 'Toggles heat damage immunity',
      polarity: 'buff',
      category: 'utility',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'toggle_heat_immunity',
      },
    },
    {
      id: 'cold-immunity-buff',
      label: 'Toggle Cold Immunity',
      description: 'Toggles cold damage immunity',
      polarity: 'buff',
      category: 'utility',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'toggle_cold_immunity',
      },
    },
    {
      id: 'invincibility-buff',
      label: 'Invincibility',
      description: 'Toggles invincibility',
      polarity: 'buff',
      category: 'utility',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'invincibility_toggle',
      },
    },
  ].map((descriptor) => [descriptor.id, descriptor])
) as Record<string, DefiningWorldPlazaEntityBuffDescriptor>;

/**
 * Returns one buff descriptor by id.
 */
export function resolvingWorldPlazaEntityBuffDescriptor(
  buffId: string
): DefiningWorldPlazaEntityBuffDescriptor | null {
  return DEFINING_WORLD_PLAZA_ENTITY_BUFF_REGISTRY[buffId] ?? null;
}

/**
 * Lists all registered buff descriptors.
 */
export function listingWorldPlazaEntityBuffDescriptors(): DefiningWorldPlazaEntityBuffDescriptor[] {
  return Object.values(DEFINING_WORLD_PLAZA_ENTITY_BUFF_REGISTRY);
}

/**
 * Lists buffs in one category.
 */
export function listingWorldPlazaEntityBuffsByCategory(
  category: DefiningWorldPlazaEntityBuffCategoryId
): DefiningWorldPlazaEntityBuffDescriptor[] {
  return listingWorldPlazaEntityBuffDescriptors().filter(
    (descriptor) => descriptor.category === category
  );
}

/**
 * Lists toggle buffs that use the damage roll modifier pipeline.
 */
export function listingWorldPlazaEntityDamageRollBuffDescriptors(): DefiningWorldPlazaEntityBuffDescriptor[] {
  return listingWorldPlazaEntityBuffDescriptors().filter(
    (descriptor) => descriptor.effect.kind === 'damage_roll_modifiers'
  );
}
