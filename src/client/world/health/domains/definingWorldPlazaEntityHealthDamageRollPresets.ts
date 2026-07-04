import type { DefiningWorldPlazaEntityHealthDamageRollModifierKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type DefiningWorldPlazaEntityHealthDamageRollPresetModifier = {
  kind: DefiningWorldPlazaEntityHealthDamageRollModifierKind;
  value: number;
};

export type DefiningWorldPlazaEntityHealthDamageRollPresetCategory =
  | 'armor'
  | 'defensive_buff'
  | 'offensive_buff'
  | 'consistency'
  | 'chaotic';

export type DefiningWorldPlazaEntityHealthDamageRollPresetSide =
  | 'defender'
  | 'attacker';

export type DefiningWorldPlazaEntityHealthDamageRollPreset = {
  id: string;
  label: string;
  category: DefiningWorldPlazaEntityHealthDamageRollPresetCategory;
  side: DefiningWorldPlazaEntityHealthDamageRollPresetSide;
  description: string;
  modifiers: DefiningWorldPlazaEntityHealthDamageRollPresetModifier[];
};

/** One SD shift per tier-bias point when resolving rolls. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_TIER_BIAS_SD_SHIFT = 1;

/** Named armour and buff presets for the statistical damage engine. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS: DefiningWorldPlazaEntityHealthDamageRollPreset[] =
  [
    {
      id: 'iron-armor',
      label: 'Iron Armour',
      category: 'armor',
      side: 'defender',
      description: '-20% incoming expected damage',
      modifiers: [{ kind: 'expected', value: 0.8 }],
    },
    {
      id: 'heavy-armor',
      label: 'Heavy Armour',
      category: 'armor',
      side: 'defender',
      description: '-30% incoming expected damage',
      modifiers: [{ kind: 'expected', value: 0.7 }],
    },
    {
      id: 'tower-shield',
      label: 'Tower Shield',
      category: 'armor',
      side: 'defender',
      description: '+1 block tier shift',
      modifiers: [{ kind: 'block_bias', value: 1 }],
    },
    {
      id: 'light-boots',
      label: 'Light Boots',
      category: 'armor',
      side: 'defender',
      description: '+1 dodge tier shift',
      modifiers: [{ kind: 'dodge_bias', value: 1 }],
    },
    {
      id: 'stabilizing-armor',
      label: 'Stabilizing Armour',
      category: 'armor',
      side: 'defender',
      description: '-30% incoming enemy variance',
      modifiers: [{ kind: 'stability', value: 0.7 }],
    },
    {
      id: 'risk-armor',
      label: 'Risk Armour',
      category: 'armor',
      side: 'defender',
      description: '+30% incoming variance',
      modifiers: [{ kind: 'variance', value: 1.3 }],
    },
    {
      id: 'defense-buff',
      label: 'Defense Buff',
      category: 'defensive_buff',
      side: 'defender',
      description: '-20% incoming expected damage',
      modifiers: [{ kind: 'expected', value: 0.8 }],
    },
    {
      id: 'evasion-buff',
      label: 'Evasion Buff',
      category: 'defensive_buff',
      side: 'defender',
      description: '+1 dodge tier shift',
      modifiers: [{ kind: 'dodge_bias', value: 1 }],
    },
    {
      id: 'guard-buff',
      label: 'Guard Buff',
      category: 'defensive_buff',
      side: 'defender',
      description: '+1 block tier shift',
      modifiers: [{ kind: 'block_bias', value: 1 }],
    },
    {
      id: 'fortify-buff',
      label: 'Fortify Buff',
      category: 'defensive_buff',
      side: 'defender',
      description: 'Skews enemy rolls toward blocked outcomes',
      modifiers: [
        { kind: 'luck', value: -0.5 },
        { kind: 'block_bias', value: 1 },
      ],
    },
    {
      id: 'stabilize-buff',
      label: 'Stabilize',
      category: 'defensive_buff',
      side: 'defender',
      description: '-50% incoming randomness',
      modifiers: [{ kind: 'stability', value: 0.5 }],
    },
    {
      id: 'power-buff',
      label: 'Power Buff',
      category: 'offensive_buff',
      side: 'attacker',
      description: '+20% expected damage',
      modifiers: [{ kind: 'expected', value: 1.2 }],
    },
    {
      id: 'rage-buff',
      label: 'Rage Buff',
      category: 'offensive_buff',
      side: 'attacker',
      description: '+30% damage variance',
      modifiers: [{ kind: 'variance', value: 1.3 }],
    },
    {
      id: 'assassin-buff',
      label: 'Assassin Buff',
      category: 'offensive_buff',
      side: 'attacker',
      description: 'Skews rolls toward critical outcomes',
      modifiers: [
        { kind: 'luck', value: 0.5 },
        { kind: 'critical_bias', value: 1 },
      ],
    },
    {
      id: 'precision-buff',
      label: 'Precision Buff',
      category: 'offensive_buff',
      side: 'attacker',
      description: 'Skews rolls away from low outcomes',
      modifiers: [{ kind: 'luck', value: 0.5 }],
    },
    {
      id: 'true-strike-buff',
      label: 'True Strike',
      category: 'offensive_buff',
      side: 'attacker',
      description: 'Always hits the expected damage value',
      modifiers: [{ kind: 'lock_in', value: 1 }],
    },
    {
      id: 'lock-in-buff',
      label: 'Lock-In',
      category: 'offensive_buff',
      side: 'attacker',
      description: 'Forces damage to the expected value',
      modifiers: [{ kind: 'lock_in', value: 1 }],
    },
    {
      id: 'focus-buff',
      label: 'Focus',
      category: 'consistency',
      side: 'attacker',
      description: 'Reduces low-roll chance and variance',
      modifiers: [
        { kind: 'luck', value: 0.5 },
        { kind: 'stability', value: 0.75 },
      ],
    },
    {
      id: 'controlled-output-buff',
      label: 'Controlled Output',
      category: 'consistency',
      side: 'attacker',
      description: 'Highly consistent damage near expected',
      modifiers: [
        { kind: 'stability', value: 0.35 },
        { kind: 'luck', value: 0.35 },
      ],
    },
    {
      id: 'all-or-nothing-buff',
      label: 'All-or-Nothing',
      category: 'chaotic',
      side: 'attacker',
      description: 'High extreme outcomes, low normal hits',
      modifiers: [
        { kind: 'chaotic', value: 1 },
        { kind: 'variance', value: 1.4 },
      ],
    },
  ];

export function creatingWorldPlazaEntityHealthDamageRollPresetModifierId(
  presetId: string,
  modifierIndex: number
): string {
  return `${presetId}:${modifierIndex}`;
}

export function checkingWorldPlazaEntityHealthDamageRollPresetIsActive(
  presetId: string,
  modifierIds: readonly string[]
): boolean {
  return modifierIds.some((modifierId) =>
    modifierId.startsWith(`${presetId}:`)
  );
}

export function listingWorldPlazaEntityHealthDamageRollPresetsByCategory(
  category: DefiningWorldPlazaEntityHealthDamageRollPresetCategory
): DefiningWorldPlazaEntityHealthDamageRollPreset[] {
  return DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_ROLL_PRESETS.filter(
    (preset) => preset.category === category
  );
}
