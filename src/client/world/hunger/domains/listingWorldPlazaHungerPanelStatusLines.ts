/**
 * Builds player-facing status lines from current hunger movement effects.
 *
 * @module components/world/hunger/domains/listingWorldPlazaHungerPanelStatusLines
 */

import type { ResolvingWorldPlazaHungerMovementEffects } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerMovementEffects';

function formattingHungerMultiplierLabel(multiplier: number): string {
  return `${Math.round(multiplier * 100) / 100}`;
}

/**
 * Returns short status lines for the hunger panel (empty when no modifiers).
 *
 * @param effects - Live hunger movement/stamina effects
 */
export function listingWorldPlazaHungerPanelStatusLines(
  effects: ResolvingWorldPlazaHungerMovementEffects
): readonly string[] {
  const lines: string[] = [];

  if (effects.staminaRegenMultiplier > 1) {
    lines.push(
      `Stamina regen ×${formattingHungerMultiplierLabel(effects.staminaRegenMultiplier)}`
    );
  }

  if (effects.staminaDrainMultiplier > 1) {
    lines.push(
      `Sprint costs ×${formattingHungerMultiplierLabel(effects.staminaDrainMultiplier)} stamina`
    );
  }

  if (effects.jumpCostMultiplier > 1) {
    lines.push(
      `Jumps cost ×${formattingHungerMultiplierLabel(effects.jumpCostMultiplier)}`
    );
  }

  if (effects.speedMultiplier < 1) {
    lines.push(
      `Walk speed ×${formattingHungerMultiplierLabel(effects.speedMultiplier)}`
    );
  }

  if (effects.isSprintDisabled) {
    lines.push('Sprint locked');
  }

  if (effects.isJumpDisabled) {
    lines.push('Jump locked');
  }

  if (effects.isHealthDraining) {
    lines.push('Health draining faster over time');
  }

  return lines;
}
