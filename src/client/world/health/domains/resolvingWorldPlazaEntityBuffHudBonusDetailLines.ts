import type {
  DefiningWorldPlazaEntityBuffEffect,
  DefiningWorldPlazaEntityBuffRollModifier,
} from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';

type DefiningWorldPlazaEntityBuffHudMovementModifierKind = Extract<
  DefiningWorldPlazaEntityBuffEffect,
  { kind: 'movement_modifier' }
>['modifierKind'];

const DEFINING_WORLD_PLAZA_ENTITY_BUFF_HUD_MOVEMENT_BONUS_LABEL: Record<
  DefiningWorldPlazaEntityBuffHudMovementModifierKind,
  string
> = {
  speed: 'Move speed',
  walk_speed: 'Walk speed',
  jump_distance: 'Jump distance',
  jump_arc: 'Jump arc',
  jump_layer_reach: 'Jump layer reach',
  stamina_drain: 'Stamina drain',
  stamina_regen: 'Stamina regen',
  stamina_jump_cost: 'Jump stamina cost',
  stamina_max: 'Max stamina',
  attack_speed: 'Attack speed',
};

function formattingWorldPlazaEntityBuffHudMultiplierLabel(
  multiplier: number
): string {
  return `${Math.round(multiplier * 100) / 100}`;
}

function formattingWorldPlazaEntityBuffHudSignedValueLabel(
  value: number
): string {
  const rounded = Math.round(value * 100) / 100;
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

function formattingWorldPlazaEntityBuffHudDamageRollBonusLine(
  modifier: DefiningWorldPlazaEntityBuffRollModifier,
  side: 'attacker' | 'defender'
): string {
  switch (modifier.kind) {
    case 'expected':
      return side === 'attacker'
        ? `Attack EV ×${formattingWorldPlazaEntityBuffHudMultiplierLabel(modifier.value)}`
        : `Incoming EV ×${formattingWorldPlazaEntityBuffHudMultiplierLabel(modifier.value)}`;
    case 'variance':
      return `Variance ×${formattingWorldPlazaEntityBuffHudMultiplierLabel(modifier.value)}`;
    case 'stability':
      return `Stability ×${formattingWorldPlazaEntityBuffHudMultiplierLabel(modifier.value)}`;
    case 'luck':
      return `Luck ${formattingWorldPlazaEntityBuffHudSignedValueLabel(modifier.value)}`;
    case 'block_bias':
      return `Block bias ${formattingWorldPlazaEntityBuffHudSignedValueLabel(modifier.value)}`;
    case 'dodge_bias':
      return `Dodge bias ${formattingWorldPlazaEntityBuffHudSignedValueLabel(modifier.value)}`;
    case 'critical_bias':
      return `Crit bias ${formattingWorldPlazaEntityBuffHudSignedValueLabel(modifier.value)}`;
    case 'lock_in':
      return 'Lock-in rolls';
    case 'chaotic':
      return 'Chaotic rolls';
    case 'forced_tier':
      return 'Forced roll tier';
  }
}

/**
 * Compact HUD bonus lines derived from a buff effect (e.g. "Stamina regen ×1.2").
 */
export function resolvingWorldPlazaEntityBuffHudBonusDetailLines(
  effect: DefiningWorldPlazaEntityBuffEffect
): readonly string[] {
  switch (effect.kind) {
    case 'movement_modifier': {
      const lines = [
        `${DEFINING_WORLD_PLAZA_ENTITY_BUFF_HUD_MOVEMENT_BONUS_LABEL[effect.modifierKind]} ×${formattingWorldPlazaEntityBuffHudMultiplierLabel(effect.multiplier)}`,
      ];

      for (const companion of effect.companionModifiers ?? []) {
        lines.push(
          `${DEFINING_WORLD_PLAZA_ENTITY_BUFF_HUD_MOVEMENT_BONUS_LABEL[companion.modifierKind]} ×${formattingWorldPlazaEntityBuffHudMultiplierLabel(companion.multiplier)}`
        );
      }

      return lines;
    }
    case 'incoming_damage_multiplier':
      return [
        `Incoming damage ×${formattingWorldPlazaEntityBuffHudMultiplierLabel(effect.multiplier)}`,
      ];
    case 'incoming_heal_amplifier':
      return [
        `Incoming heal ×${formattingWorldPlazaEntityBuffHudMultiplierLabel(effect.ratio)}`,
      ];
    case 'outgoing_heal_amplifier':
      return [
        `Outgoing heal ×${formattingWorldPlazaEntityBuffHudMultiplierLabel(effect.ratio)}`,
      ];
    case 'temporary_max_health':
      return [`+${Math.round(effect.baseExpectedAmount)} temp max HP`];
    case 'max_health_scale':
      return [
        `Max HP ×${formattingWorldPlazaEntityBuffHudMultiplierLabel(effect.multiplier)}`,
      ];
    case 'physical_damage_lifesteal':
      return [`Heal ${Math.round(effect.ratio * 100)}% physical dealt`];
    case 'incoming_physical_damage_heal':
      return [`Heal ${Math.round(effect.ratio * 100)}% physical taken`];
    case 'damage_roll_modifiers':
      return effect.modifiers.map((modifier) =>
        formattingWorldPlazaEntityBuffHudDamageRollBonusLine(
          modifier,
          effect.side
        )
      );
    case 'heat_resistance':
      return [
        `Heat resistance ${formattingWorldPlazaEntityBuffHudSignedValueLabel(effect.amount)}`,
      ];
    case 'cold_resistance':
      return [
        `Cold resistance ${formattingWorldPlazaEntityBuffHudSignedValueLabel(effect.amount)}`,
      ];
    case 'heat_weakness':
      return [
        `Heat weakness ${formattingWorldPlazaEntityBuffHudSignedValueLabel(effect.amount)}`,
      ];
    case 'cold_weakness':
      return [
        `Cold weakness ${formattingWorldPlazaEntityBuffHudSignedValueLabel(effect.amount)}`,
      ];
    case 'heat_tolerance':
      return [
        `Heat tolerance ${formattingWorldPlazaEntityBuffHudSignedValueLabel(effect.amountCelsius)}°C`,
      ];
    case 'cold_tolerance':
      return [
        `Cold tolerance ${formattingWorldPlazaEntityBuffHudSignedValueLabel(effect.amountCelsius)}°C`,
      ];
    case 'toggle_heat_immunity':
      return ['Heat immunity'];
    case 'toggle_cold_immunity':
      return ['Cold immunity'];
    case 'invincibility_toggle':
      return ['Invincible'];
    case 'heal_block':
      return ['Healing blocked'];
    case 'movement_confusion':
      return ['Confused movement'];
    case 'incapacitate_sleep':
      return ['Asleep'];
    case 'incapacitate_stun':
      return ['Stunned'];
    case 'lucky_while_held':
      return [
        'Disease chance halved',
        'Safer damage rolls',
        'Stronger damage dealt',
        'Better rare finds',
      ];
  }
}
