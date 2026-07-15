/**
 * Persisted Spritcore upgrade bonuses purchased by the player.
 *
 * @module components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes
 */

/** Purchased stat bonuses from Spiritcore upgrades. */
export type WorldPlazaSpritcoreUpgradeBonuses = {
  readonly bonusMaxHealth: number;
  readonly bonusAttackPower: number;
  readonly bonusAttackSpeed: number;
  readonly bonusDefense: number;
  readonly bonusMoveSpeed: number;
  readonly totalSpritcoreInvested: number;
};

/** Upgrade lanes available in the player Spritcore panel. */
export type WorldPlazaSpritcoreUpgradeLaneId =
  | 'health'
  | 'damage'
  | 'attackSpeed';

/** Upgrade lanes available in the companion Spritcore power-up UI. */
export type WildlifePetSpritcoreUpgradeLaneId =
  | WorldPlazaSpritcoreUpgradeLaneId
  | 'defense'
  | 'moveSpeed';

export const WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES: WorldPlazaSpritcoreUpgradeBonuses =
  {
    bonusMaxHealth: 0,
    bonusAttackPower: 0,
    bonusAttackSpeed: 0,
    bonusDefense: 0,
    bonusMoveSpeed: 0,
    totalSpritcoreInvested: 0,
  };
