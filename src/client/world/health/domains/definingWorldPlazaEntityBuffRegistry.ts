import type { DefiningWorldPlazaEntityBuffCategoryId } from '@/components/world/health/domains/definingWorldPlazaEntityBuffCategoryRegistry';
import { DEFINING_WORLD_PLAZA_CONFUSION_DEFAULT_INTENSITY } from '@/components/world/health/domains/definingWorldPlazaEntityConfusionConstants';
import { DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO } from '@/components/world/health/domains/definingWorldPlazaEntityDamageToHealConstants';
import { DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO } from '@/components/world/health/domains/definingWorldPlazaEntityHealAmplifierConstants';
import type { DefiningWorldPlazaEntityHealthDamageRollModifierKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  DEFINING_WORLD_PLAZA_DEEP_SLEEP_DEFAULT_DURATION_MS,
  DEFINING_WORLD_PLAZA_SLEEP_DEFAULT_DURATION_MS,
  DEFINING_WORLD_PLAZA_SLEEP_WAKE_BONUS_DAMAGE,
} from '@/components/world/health/domains/definingWorldPlazaEntitySleepConstants';
import { DEFINING_WORLD_PLAZA_STUN_DEFAULT_DURATION_MS } from '@/components/world/health/domains/definingWorldPlazaEntityStunConstants';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COLD_TOLERANCE_BONUS_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_HEAT_TOLERANCE_BONUS_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import { encodingWorldPlazaEntityHealthDamageRollForcedTierValue } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollForcedTier';

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
      kind: 'lucky_while_held';
    }
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
      kind: 'physical_damage_lifesteal';
      ratio: number;
    }
  | {
      kind: 'incoming_physical_damage_heal';
      ratio: number;
    }
  | {
      kind: 'incoming_heal_amplifier';
      ratio: number;
    }
  | {
      kind: 'outgoing_heal_amplifier';
      ratio: number;
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
      kind: 'heat_weakness';
      amount: number;
    }
  | {
      kind: 'cold_weakness';
      amount: number;
    }
  | {
      kind: 'heat_tolerance';
      /** Extra °C added to comfort high while active. */
      amountCelsius: number;
    }
  | {
      kind: 'cold_tolerance';
      /** Extra °C subtracted from comfort low while active. */
      amountCelsius: number;
    }
  | {
      kind: 'toggle_heat_immunity';
    }
  | {
      kind: 'toggle_cold_immunity';
    }
  | {
      kind: 'invincibility_toggle';
    }
  | {
      kind: 'movement_modifier';
      modifierKind:
        | 'speed'
        | 'walk_speed'
        | 'jump_distance'
        | 'jump_arc'
        | 'jump_layer_reach'
        | 'stamina_drain'
        | 'stamina_regen'
        | 'stamina_jump_cost'
        | 'stamina_max'
        | 'attack_speed';
      multiplier: number;
      companionModifiers?: readonly {
        modifierKind:
          | 'speed'
          | 'walk_speed'
          | 'jump_distance'
          | 'jump_arc'
          | 'jump_layer_reach'
          | 'stamina_drain'
          | 'stamina_regen'
          | 'stamina_jump_cost'
          | 'stamina_max'
          | 'attack_speed';
        multiplier: number;
      }[];
    }
  | {
      kind: 'movement_confusion';
      intensity: number;
    }
  | {
      kind: 'incapacitate_sleep';
      wakeBonusDamage: number;
      /**
       * When false, damage cannot wake the sleeper until the timer ends.
       * Defaults to true (normal sleep).
       */
      canWakeFromDamage?: boolean;
    }
  | {
      kind: 'incapacitate_stun';
    }
  | {
      /** Blocks all healing while the buff is active. */
      kind: 'heal_block';
    };

/** Player actions blocked while a buff is active. */
export type DefiningWorldPlazaEntityBuffActionLock = 'jump' | 'roll' | 'sprint';

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
  /** Blocks jump, roll, or sprint while active. */
  actionLocks?: readonly DefiningWorldPlazaEntityBuffActionLock[];
  /** When true, only the parent disease icon shows in the HUD row. */
  hideFromHud?: boolean;
};

/** Single source of truth for temporary buffs and debuffs. */
export const DEFINING_WORLD_PLAZA_ENTITY_BUFF_REGISTRY: Record<
  string,
  DefiningWorldPlazaEntityBuffDescriptor
> = Object.fromEntries(
  [
    {
      id: 'lucky-buff',
      label: 'Lucky',
      description:
        'Four-leaf clover charm. Safer rolls, sharper strikes, better finds, and better food buff odds.',
      polarity: 'buff',
      category: 'utility',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'lucky_while_held',
      },
    },
    {
      id: 'lucky-buff-defender',
      label: 'Lucky Defence',
      description: 'Skews incoming damage toward safer outcomes.',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      hideFromHud: true,
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
      id: 'lucky-buff-attacker',
      label: 'Lucky Strike',
      description: 'Skews outgoing damage toward stronger outcomes.',
      polarity: 'buff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      hideFromHud: true,
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
      id: 'quick-strikes-buff',
      label: 'Quick Strikes',
      description: '+25% attack speed for 1 minute',
      polarity: 'buff',
      category: 'combat',
      durationKind: 'timed',
      durationMs: 60_000,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'attack_speed',
        multiplier: 1.25,
      },
    },
    {
      id: 'bloodlust-buff',
      label: 'Bloodlust',
      description: '+50% attack speed for 30 seconds',
      polarity: 'buff',
      category: 'combat',
      durationKind: 'timed',
      durationMs: 30_000,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'attack_speed',
        multiplier: 1.5,
      },
    },
    {
      id: 'blinding-flurry-buff',
      label: 'Blinding Flurry',
      description: '+100% attack speed for 12 seconds',
      polarity: 'buff',
      category: 'combat',
      durationKind: 'timed',
      durationMs: 12_000,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'attack_speed',
        multiplier: 2,
      },
    },
    {
      id: 'relentless-tempo-buff',
      label: 'Relentless Tempo',
      description: '+35% attack speed until cleared',
      polarity: 'buff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'attack_speed',
        multiplier: 1.35,
      },
    },
    {
      id: 'slow-hands-debuff',
      label: 'Slow Hands',
      description: '-30% attack speed until cleared',
      polarity: 'debuff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'attack_speed',
        multiplier: 0.7,
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
      id: 'exposed-debuff',
      label: 'Exposed',
      description: 'Incoming damage always rolls Critical',
      polarity: 'debuff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [
          {
            kind: 'forced_tier',
            value:
              encodingWorldPlazaEntityHealthDamageRollForcedTierValue(
                'critical'
              ),
          },
        ],
      },
    },
    {
      id: 'vulnerable-debuff',
      label: 'Vulnerable',
      description: 'Incoming damage always rolls Lethal',
      polarity: 'debuff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [
          {
            kind: 'forced_tier',
            value:
              encodingWorldPlazaEntityHealthDamageRollForcedTierValue('lethal'),
          },
        ],
      },
    },
    {
      id: 'condemned-debuff',
      label: 'Condemned',
      description: 'Incoming damage always rolls Fatal',
      polarity: 'debuff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [
          {
            kind: 'forced_tier',
            value:
              encodingWorldPlazaEntityHealthDamageRollForcedTierValue('fatal'),
          },
        ],
      },
    },
    {
      id: 'braced-buff',
      label: 'Braced',
      description: 'Incoming damage always rolls Softened',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [
          {
            kind: 'forced_tier',
            value:
              encodingWorldPlazaEntityHealthDamageRollForcedTierValue(
                'softened'
              ),
          },
        ],
      },
    },
    {
      id: 'guarded-buff',
      label: 'Guarded',
      description: 'Incoming damage always rolls Blocked',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [
          {
            kind: 'forced_tier',
            value:
              encodingWorldPlazaEntityHealthDamageRollForcedTierValue(
                'blocked'
              ),
          },
        ],
      },
    },
    {
      id: 'ultra-instinct-buff',
      label: 'Ultra Instinct',
      description: 'Incoming damage always rolls Dodged',
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'defender',
        modifiers: [
          {
            kind: 'forced_tier',
            value:
              encodingWorldPlazaEntityHealthDamageRollForcedTierValue('dodged'),
          },
        ],
      },
    },
    {
      id: 'siphoning-buff',
      label: 'Siphoning',
      description: `Heal ${Math.round(DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO * 100)}% of physical damage you deal`,
      polarity: 'buff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'physical_damage_lifesteal',
        ratio: DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO,
      },
    },
    {
      id: 'absorb-buff',
      label: 'Absorb',
      description: `Heal ${Math.round(DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO * 100)}% of physical damage you receive`,
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'incoming_physical_damage_heal',
        ratio: DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO,
      },
    },
    {
      id: 'blessing-buff',
      label: 'Blessing',
      description: `Healing you receive is increased by ${Math.round(DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO * 100)}%`,
      polarity: 'buff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'incoming_heal_amplifier',
        ratio: DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO,
      },
    },
    {
      id: 'mending-buff',
      label: 'Mending',
      description: `Healing you give is increased by ${Math.round(DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO * 100)}%`,
      polarity: 'buff',
      category: 'combat',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'outgoing_heal_amplifier',
        ratio: DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_DEFAULT_RATIO,
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
      id: 'swift-stride-buff',
      label: 'Swift Stride',
      description: '+20% movement speed for 1 minute',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 60_000,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 1.2,
      },
    },
    {
      id: 'racing-pulse-buff',
      label: 'Racing Pulse',
      description: '+50% movement speed for 30 seconds',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 30_000,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 1.5,
      },
    },
    {
      id: 'sprint-surge-buff',
      label: 'Sprint Surge',
      description: '+100% movement speed for 10 seconds',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 10_000,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 2,
      },
    },
    {
      id: 'long-leap-buff',
      label: 'Long Leap',
      description: '+50% jump distance until cleared',
      polarity: 'buff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'jump_distance',
        multiplier: 1.5,
      },
    },
    {
      id: 'skybound-buff',
      label: 'Skybound',
      description: '+50% jump arc and reach up to 6 layers (from 4)',
      polarity: 'buff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'jump_arc',
        multiplier: 1.5,
        companionModifiers: [
          { modifierKind: 'jump_layer_reach', multiplier: 1.5 },
        ],
      },
    },
    {
      id: 'enduring-spirit-buff',
      label: 'Enduring Spirit',
      description: '50% slower stamina drain until cleared',
      polarity: 'buff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'stamina_drain',
        multiplier: 0.5,
      },
    },
    {
      id: 'second-wind-buff',
      label: 'Second Wind',
      description: '+50% stamina regen for 1 minute',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 60_000,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'stamina_regen',
        multiplier: 1.5,
      },
    },
    {
      id: 'featherweight-buff',
      label: 'Featherweight',
      description: '50% cheaper jump stamina until cleared',
      polarity: 'buff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'stamina_jump_cost',
        multiplier: 0.5,
      },
    },
    {
      id: 'lead-boots-debuff',
      label: 'Lead Boots',
      description: '-20% movement speed until cleared',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 0.8,
      },
    },
    {
      id: 'sluggish-debuff',
      label: 'Sluggish',
      description: '-50% movement speed for 30 seconds',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 30_000,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 0.5,
      },
    },
    {
      id: 'heavy-legs-debuff',
      label: 'Heavy Legs',
      description: '-30% jump distance until cleared',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'jump_distance',
        multiplier: 0.7,
      },
    },
    {
      id: 'low-hop-debuff',
      label: 'Low Hop',
      description: '-30% jump height until cleared',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'jump_arc',
        multiplier: 0.7,
      },
    },
    {
      id: 'exhausted-debuff',
      label: 'Exhausted',
      description: '50% faster stamina drain until cleared',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'stamina_drain',
        multiplier: 1.5,
      },
    },
    {
      id: 'winded-debuff',
      label: 'Winded',
      description: '50% slower stamina regen until cleared',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'stamina_regen',
        multiplier: 0.5,
      },
    },
    {
      id: 'heavy-landing-debuff',
      label: 'Heavy Landing',
      description: '50% more jump stamina cost until cleared',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'stamina_jump_cost',
        multiplier: 1.5,
      },
    },
    {
      id: 'frostbite-chilled-debuff',
      label: 'Chilly',
      description: 'Legacy tier speed descriptor for chilly stacks',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      hideFromHud: true,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 0.9,
      },
    },
    {
      id: 'frostbite-numb-debuff',
      label: 'Shivering',
      description: 'Legacy shivering tier descriptor (unused)',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      hideFromHud: true,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 0.85,
      },
    },
    {
      id: 'frostbite-frostnip-debuff',
      label: 'Freezing',
      description: 'Legacy tier speed descriptor for freezing stacks',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      hideFromHud: true,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 0.7,
      },
    },
    {
      id: 'frostbite-hypothermia-debuff',
      label: 'Hypothermia',
      description: 'Half jump distance and arc from hypothermia',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      hideFromHud: true,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 0.5,
        companionModifiers: [
          { modifierKind: 'jump_distance', multiplier: 0.5 },
          { modifierKind: 'jump_arc', multiplier: 0.5 },
        ],
      },
    },
    {
      id: 'frostbite-frostbite-debuff',
      label: 'Frostbite',
      description: 'Jump locked; linear stack speed handles movement slow',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      hideFromHud: true,
      actionLocks: ['jump'],
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 1,
      },
    },
    {
      id: 'frostbite-necrotic-debuff',
      label: 'Necrotic Frostbite',
      description: 'Cannot heal while frozen solid',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      hideFromHud: true,
      effect: {
        kind: 'heal_block',
      },
    },
    {
      id: 'frostbite-necrotic-immobilize-debuff',
      label: 'Necrotic Freeze',
      description: 'Cannot move while necrotic frostbite sleep holds',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'toggle',
      durationMs: null,
      hideFromHud: true,
      actionLocks: ['jump', 'roll', 'sprint'],
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 0,
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
      id: 'heat-tolerance-buff',
      label: 'Heat Tolerance',
      description: `Raises the heat comfort ceiling by ${DEFINING_WORLD_PLAZA_TEMPERATURE_HEAT_TOLERANCE_BONUS_CELSIUS}°C`,
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'heat_tolerance',
        amountCelsius:
          DEFINING_WORLD_PLAZA_TEMPERATURE_HEAT_TOLERANCE_BONUS_CELSIUS,
      },
    },
    {
      id: 'cold-tolerance-buff',
      label: 'Cold Tolerance',
      description: `Lowers the cold comfort floor by ${DEFINING_WORLD_PLAZA_TEMPERATURE_COLD_TOLERANCE_BONUS_CELSIUS}°C`,
      polarity: 'buff',
      category: 'defence',
      durationKind: 'toggle',
      durationMs: null,
      effect: {
        kind: 'cold_tolerance',
        amountCelsius:
          DEFINING_WORLD_PLAZA_TEMPERATURE_COLD_TOLERANCE_BONUS_CELSIUS,
      },
    },
    {
      id: 'heat-weakness-debuff',
      label: '+25% Heat Weakness',
      description: 'Increases heat damage taken by 25%',
      polarity: 'debuff',
      category: 'defence',
      durationKind: 'instant',
      durationMs: null,
      effect: {
        kind: 'heat_weakness',
        amount: 0.25,
      },
    },
    {
      id: 'cold-weakness-debuff',
      label: '+25% Cold Weakness',
      description: 'Increases cold damage taken by 25%',
      polarity: 'debuff',
      category: 'defence',
      durationKind: 'instant',
      durationMs: null,
      effect: {
        kind: 'cold_weakness',
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
    {
      id: 'food-sickness-debuff',
      label: 'Food Sickness',
      description: 'Cannot sprint. Food restores half hunger.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 60_000,
      actionLocks: ['sprint'],
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'stamina_regen',
        multiplier: 1,
      },
    },
    {
      id: 'petal-sickness-debuff',
      label: 'Petal Sickness',
      description:
        'Too many raw flowers. Footing weaves, stamina drains, and a light toxic burn follows.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 60_000,
      effect: {
        kind: 'movement_confusion',
        intensity: 40,
      },
    },
    {
      id: 'petal-sickness-stamina-debuff',
      label: 'Petal Sickness',
      description: 'Raw petals burn stamina and cut regen.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 60_000,
      hideFromHud: true,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'stamina_drain',
        multiplier: 1.5,
        companionModifiers: [
          {
            modifierKind: 'stamina_regen',
            multiplier: 0.65,
          },
        ],
      },
    },
    {
      id: 'disease-nausea-slow-debuff',
      label: 'Nausea',
      description: 'Stomach churn slows movement by 30%.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 60_000,
      hideFromHud: true,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 0.7,
      },
    },
    {
      id: 'disease-muscle-lock-debuff',
      label: 'Muscle Lock',
      description: 'Worms in the muscle. Cannot sprint or jump.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 60_000,
      hideFromHud: true,
      actionLocks: ['sprint', 'jump'],
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 0.85,
      },
    },
    {
      id: 'disease-joint-lock-debuff',
      label: 'Joint Lock',
      description: 'Fever stiffens joints. Cannot jump or roll.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 60_000,
      hideFromHud: true,
      actionLocks: ['jump', 'roll'],
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 0.8,
      },
    },
    {
      id: 'disease-roll-lock-debuff',
      label: 'Roll Lock',
      description: 'Legs too weak to dodge.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 60_000,
      hideFromHud: true,
      actionLocks: ['roll'],
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 1,
      },
    },
    {
      id: 'disease-weakness-debuff',
      label: 'Weakness',
      description: 'Fever leaves you fragile to hits.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 120_000,
      hideFromHud: true,
      effect: {
        kind: 'incoming_damage_multiplier',
        multiplier: 1.3,
      },
    },
    {
      id: 'disease-stamina-sick-debuff',
      label: 'Stamina Sick',
      description:
        'Parasites burn stamina 2x while sprinting and cut regen to half.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 120_000,
      hideFromHud: true,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'stamina_drain',
        multiplier: 2,
        companionModifiers: [
          {
            modifierKind: 'stamina_regen',
            multiplier: 0.5,
          },
        ],
      },
    },
    {
      id: 'disease-cucco-frenzy-debuff',
      label: 'Flock Frenzy',
      description:
        'The swarm panic in your veins. You move faster, but stamina burns away.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 120_000,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 1.32,
      },
    },
    {
      id: 'disease-cucco-frenzy-drain-debuff',
      label: 'Flock Frenzy',
      description: 'Adrenaline from the flock. Stamina drains much faster.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 120_000,
      hideFromHud: true,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'stamina_drain',
        multiplier: 2.15,
      },
    },
    {
      id: 'disease-cucco-wild-strikes-debuff',
      label: 'Peck Madness',
      description:
        'Your swings turn vicious and sloppy. More bite, less control.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 120_000,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'attacker',
        modifiers: [
          { kind: 'expected', value: 1.18 },
          { kind: 'variance', value: 1.35 },
        ],
      },
    },
    {
      id: 'well-fed-hearty-buff',
      label: 'Hearty Meal',
      description: 'Bear meat bulks your health for a while.',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 120_000,
      effect: {
        kind: 'temporary_max_health',
        baseExpectedAmount: 80,
      },
    },
    {
      id: 'well-fed-fleet-buff',
      label: 'Fleet Footed',
      description: 'Venison sharpens your stride.',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 90_000,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 1.2,
      },
    },
    {
      id: 'well-fed-strength-buff',
      label: 'Predator Strength',
      description: 'Big-cat meat steadies your strikes.',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 90_000,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'attacker',
        modifiers: [{ kind: 'expected', value: 1.15 }],
      },
    },
    {
      id: 'well-fed-omega-skew-buff',
      label: 'Omega Skew',
      description:
        'Pack-leader meat skews your damage rolls toward critical outcomes.',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 90_000,
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
      id: 'well-fed-omega-siphon-buff',
      label: 'Omega Siphon',
      description: `Heal ${Math.round(DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO * 100)}% of physical damage you deal.`,
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 90_000,
      effect: {
        kind: 'physical_damage_lifesteal',
        ratio: DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_TO_HEAL_DEFAULT_RATIO,
      },
    },
    {
      id: 'well-fed-endurance-buff',
      label: 'Savanna Endurance',
      description: 'Zebra stew keeps stamina flowing.',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 120_000,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'stamina_regen',
        multiplier: 1.35,
      },
    },
    {
      id: 'well-fed-toughened-buff',
      label: 'Toughened',
      description: 'Boar fat hardens you against blows.',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 90_000,
      effect: {
        kind: 'incoming_damage_multiplier',
        multiplier: 0.85,
      },
    },
    {
      id: 'well-fed-vigor-buff',
      label: 'Pasture Vigor',
      description: 'Mutton restores more than hunger.',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 90_000,
      effect: {
        kind: 'incoming_heal_amplifier',
        ratio: 1.2,
      },
    },
    {
      id: 'well-fed-comfort-buff',
      label: 'Comfort Food',
      description: 'Chicken settles the stomach and nerves.',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 60_000,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'stamina_regen',
        multiplier: 1.2,
      },
    },
    {
      id: 'well-fed-prime-buff',
      label: 'Prime Cut',
      description: 'Beef fills you with steady power.',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 100_000,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'attacker',
        modifiers: [{ kind: 'expected', value: 1.1 }],
      },
    },
    {
      id: 'well-fed-reptile-buff',
      label: 'River Hunter',
      description: 'Crocodile meat steels your guard.',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 90_000,
      effect: {
        kind: 'incoming_damage_multiplier',
        multiplier: 0.9,
      },
    },
    {
      id: 'well-fed-cucco-fury-buff',
      label: 'Cucco Fury',
      description: 'The rage of a swarm still burns in your strikes.',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 120_000,
      effect: {
        kind: 'damage_roll_modifiers',
        side: 'attacker',
        modifiers: [{ kind: 'expected', value: 1.28 }],
      },
    },
    {
      id: 'well-fed-cucco-chase-buff',
      label: 'Cucco Chase',
      description: 'Your legs remember outrunning the whole flock.',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 120_000,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'speed',
        multiplier: 1.35,
      },
    },
    {
      id: 'well-fed-cucco-vigor-buff',
      label: 'Cucco Vigor',
      description: 'Adrenaline from surviving the pecking order.',
      polarity: 'buff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 120_000,
      effect: {
        kind: 'movement_modifier',
        modifierKind: 'stamina_regen',
        multiplier: 1.55,
      },
    },
    {
      id: 'confusion-debuff',
      label: 'Confused',
      description: 'Your footing wavers; movement weaves unpredictably',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: 15_000,
      effect: {
        kind: 'movement_confusion',
        intensity: DEFINING_WORLD_PLAZA_CONFUSION_DEFAULT_INTENSITY,
      },
    },
    {
      id: 'sleep-debuff',
      label: 'Asleep',
      description:
        'Out cold. You cannot move or act until this ends or a physical hit wakes you; the waking hit adds bonus damage.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: DEFINING_WORLD_PLAZA_SLEEP_DEFAULT_DURATION_MS,
      effect: {
        kind: 'incapacitate_sleep',
        wakeBonusDamage: DEFINING_WORLD_PLAZA_SLEEP_WAKE_BONUS_DAMAGE,
      },
    },
    {
      id: 'deep-sleep-debuff',
      label: 'Deep Sleep',
      description:
        'Dead to the world. Damage cannot wake you; you stay down until the timer ends.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: DEFINING_WORLD_PLAZA_DEEP_SLEEP_DEFAULT_DURATION_MS,
      effect: {
        kind: 'incapacitate_sleep',
        wakeBonusDamage: 0,
        canWakeFromDamage: false,
      },
    },
    {
      id: 'stun-debuff',
      label: 'Stunned',
      description: 'Wobbly and dazed. Cannot move or act until the stun fades.',
      polarity: 'debuff',
      category: 'character',
      durationKind: 'timed',
      durationMs: DEFINING_WORLD_PLAZA_STUN_DEFAULT_DURATION_MS,
      effect: {
        kind: 'incapacitate_stun',
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
    (descriptor) =>
      descriptor.effect.kind === 'damage_roll_modifiers' &&
      descriptor.hideFromHud !== true
  );
}
