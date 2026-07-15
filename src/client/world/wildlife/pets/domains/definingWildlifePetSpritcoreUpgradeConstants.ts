/**
 * Declarative Spritcore power-up steps and copy for bonded companions.
 *
 * Pricing reuses the player diminishing-return curve with each pet's natural
 * (pre-upgrade) HP / DPS as the baseline so small companions stay affordable.
 *
 * @module components/world/wildlife/pets/domains/definingWildlifePetSpritcoreUpgradeConstants
 */

import type { WorldPlazaSpritcoreUpgradeLaneId } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';

/** Fraction of natural max HP gained per health purchase. */
export const DEFINING_WILDLIFE_PET_SPRITCORE_HEALTH_UPGRADE_FRACTION = 0.1;

/** Fraction of natural attack EV gained per damage purchase. */
export const DEFINING_WILDLIFE_PET_SPRITCORE_DAMAGE_UPGRADE_FRACTION = 0.1;

/** Attack speed gained per companion Spritcore speed purchase (nominal APS). */
export const DEFINING_WILDLIFE_PET_SPRITCORE_ATTACK_SPEED_UPGRADE_STEP = 0.05;

/**
 * Max attack speed purchasable for companions (matches player Spritcore cap).
 */
export const DEFINING_WILDLIFE_PET_SPRITCORE_MAX_ATTACK_SPEED = 3;

/**
 * Curve ceiling multiplier vs natural baseline (player uses 100× base HP/DPS).
 */
export const DEFINING_WILDLIFE_PET_SPRITCORE_CURVE_MAX_MULTIPLIER = 100;

/** Section heading above companion Spritcore power-up rows. */
export const LABELING_WILDLIFE_PET_SPRITCORE_UPGRADE_SECTION = 'Power up' as const;

/** Empty-balance / cannot-afford toast. */
export const LABELING_WILDLIFE_PET_SPRITCORE_UPGRADE_NOT_ENOUGH =
  'Not enough Spritcore.' as const;

/** Cap toast for attack-speed lane. */
export const LABELING_WILDLIFE_PET_SPRITCORE_UPGRADE_CAPPED =
  'Attack speed is already capped.' as const;

/** Generic failure toast when spend or apply fails. */
export const LABELING_WILDLIFE_PET_SPRITCORE_UPGRADE_FAILED =
  'Could not power up companion.' as const;

/** Buy button label. */
export const LABELING_WILDLIFE_PET_SPRITCORE_UPGRADE_BUY = 'Buy' as const;

/** Capped button label. */
export const LABELING_WILDLIFE_PET_SPRITCORE_UPGRADE_CAPPED_BUTTON =
  'Capped' as const;

/** Declarative lane rows for the companion power-up UI. */
export const DEFINING_WILDLIFE_PET_SPRITCORE_UPGRADE_LANE_REGISTRY: readonly {
  readonly laneId: WorldPlazaSpritcoreUpgradeLaneId;
  readonly label: string;
  readonly iconId: string;
}[] = [
  { laneId: 'health', label: 'Health', iconId: 'mdi:heart-plus' },
  { laneId: 'damage', label: 'Damage', iconId: 'mdi:sword-cross' },
  { laneId: 'attackSpeed', label: 'Attack speed', iconId: 'mdi:speedometer' },
];
