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
  readonly totalSpritcoreInvested: number;
};

/** Upgrade lanes available in the Spritcore panel. */
export type WorldPlazaSpritcoreUpgradeLaneId =
  | 'health'
  | 'damage'
  | 'attackSpeed';

export const WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES: WorldPlazaSpritcoreUpgradeBonuses =
  {
    bonusMaxHealth: 0,
    bonusAttackPower: 0,
    bonusAttackSpeed: 0,
    totalSpritcoreInvested: 0,
  };
