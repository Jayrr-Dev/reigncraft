/**
 * Declarative lane registry and copy for the player Spritcore upgrade UI
 * (Character panel Upgrade tab).
 *
 * @module components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeUiConstants
 */

import type { WorldPlazaSpritcoreUpgradeLaneId } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';

/** Balance summary chip label. */
export const LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_BALANCE =
  'Balance' as const;

/** Combat power summary chip label. */
export const LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_COMBAT_POWER =
  'Combat power' as const;

/** Buy button label. */
export const LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_BUY = 'Buy' as const;

/** Capped button label. */
export const LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_CAPPED = 'Capped' as const;

/** Toast when the player cannot afford a purchase. */
export const LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_NOT_ENOUGH =
  'Not enough Spritcore.' as const;

/** Toast when a lane is already at its cap. */
export const LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_ALREADY_CAPPED =
  'Power-up is already capped.' as const;

/** Toast when inventory spend fails. */
export const LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_SPEND_FAILED =
  'Could not spend Spritcore.' as const;

/** Toast when apply fails after spend. */
export const LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_UNAVAILABLE =
  'Upgrade unavailable.' as const;

/** Declarative player upgrade lanes shown in Character → Upgrade. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_UPGRADE_LANE_REGISTRY: readonly {
  readonly laneId: WorldPlazaSpritcoreUpgradeLaneId;
  readonly label: string;
  readonly iconId: string;
}[] = [
  { laneId: 'health', label: 'Health', iconId: 'mdi:heart-plus' },
  { laneId: 'damage', label: 'Damage', iconId: 'mdi:sword-cross' },
  { laneId: 'attackSpeed', label: 'Attack speed', iconId: 'mdi:speedometer' },
  { laneId: 'defense', label: 'Defense', iconId: 'mdi:shield-half-full' },
  { laneId: 'moveSpeed', label: 'Speed', iconId: 'mdi:run-fast' },
];
