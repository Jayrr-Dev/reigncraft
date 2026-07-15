/**
 * Maps combat power into a player-facing level label.
 *
 * @module components/world/spritcore/domains/computingWorldPlazaSpritcoreDisplayLevel
 */

import { computingWorldPlazaSpritcoreCombatPower } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreCombatPower';

/**
 * Derives a display level from combat power.
 * Level = max(1, floor(P)) where P = (H / BASE_HP) × (DPS / BASE_DPS).
 * Starting Girl (1000 HP, 100 atk, 1 APS) is level 1.
 */
export function computingWorldPlazaSpritcoreDisplayLevel(
  health: number,
  damage: number,
  attackSpeed: number
): number {
  const combatPower = computingWorldPlazaSpritcoreCombatPower(
    health,
    damage,
    attackSpeed
  );

  return Math.max(1, Math.floor(combatPower));
}
