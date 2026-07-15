/**
 * Spiritcore upgrade pricing from the diminishing-return curves.
 *
 * @module components/world/spritcore/domains/computingWorldPlazaSpritcoreUpgradePrice
 */

import { computingWorldPlazaSpritcoreEquivalentValue } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreEquivalentValue';
import {
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_DPS,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_HP,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_DEFENSE_MOVE_SPEED_K,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_DPS,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_HP,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';

function computingWorldPlazaSpritcoreUpgradeDeltaPrice(
  beforeValue: number,
  afterValue: number,
  baseValue: number,
  maximumValue: number,
  k?: number
): number {
  if (afterValue <= beforeValue) {
    return 0;
  }

  return Math.max(
    0,
    computingWorldPlazaSpritcoreEquivalentValue(
      afterValue,
      baseValue,
      maximumValue,
      k
    ) -
      computingWorldPlazaSpritcoreEquivalentValue(
        beforeValue,
        baseValue,
        maximumValue,
        k
      )
  );
}

/** Prices a health upgrade from current max HP and a flat bonus. */
export function computingWorldPlazaSpritcoreHealthUpgradePrice(
  currentHealth: number,
  healthBonus: number
): number {
  return computingWorldPlazaSpritcoreUpgradeDeltaPrice(
    currentHealth,
    currentHealth + healthBonus,
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_HP,
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_HP
  );
}

/** Prices an offense upgrade via DPS before and after (never additive damage + speed). */
export function computingWorldPlazaSpritcoreOffensiveUpgradePrice(
  damage: number,
  attackSpeed: number,
  damageBonus: number,
  attackSpeedBonus: number
): number {
  const oldDps = damage * attackSpeed;
  const newDps = (damage + damageBonus) * (attackSpeed + attackSpeedBonus);

  return computingWorldPlazaSpritcoreUpgradeDeltaPrice(
    oldDps,
    newDps,
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_DPS,
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_DPS
  );
}

/** Prices a defense upgrade from current Defense toward the hard cap. */
export function computingWorldPlazaSpritcoreDefenseUpgradePrice(
  naturalDefense: number,
  currentDefense: number,
  defenseStep: number,
  defenseMaximum: number
): number {
  return computingWorldPlazaSpritcoreUpgradeDeltaPrice(
    currentDefense,
    currentDefense + defenseStep,
    naturalDefense,
    defenseMaximum,
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_DEFENSE_MOVE_SPEED_K
  );
}

/** Prices a move-speed upgrade from current run speed toward the hard cap. */
export function computingWorldPlazaSpritcoreMoveSpeedUpgradePrice(
  naturalRunSpeed: number,
  currentRunSpeed: number,
  moveSpeedStep: number,
  moveSpeedMaximum: number
): number {
  return computingWorldPlazaSpritcoreUpgradeDeltaPrice(
    currentRunSpeed,
    currentRunSpeed + moveSpeedStep,
    naturalRunSpeed,
    moveSpeedMaximum,
    DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_DEFENSE_MOVE_SPEED_K
  );
}

/** Prices a mixed item as health price + offense price. */
export function computingWorldPlazaSpritcoreMixedItemUpgradePrice(input: {
  readonly currentHealth: number;
  readonly healthBonus: number;
  readonly damage: number;
  readonly attackSpeed: number;
  readonly damageBonus: number;
  readonly attackSpeedBonus: number;
}): number {
  return (
    computingWorldPlazaSpritcoreHealthUpgradePrice(
      input.currentHealth,
      input.healthBonus
    ) +
    computingWorldPlazaSpritcoreOffensiveUpgradePrice(
      input.damage,
      input.attackSpeed,
      input.damageBonus,
      input.attackSpeedBonus
    )
  );
}
