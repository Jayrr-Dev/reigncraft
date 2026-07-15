/**
 * Declarative Spritcore leveling curve and upgrade step sizes.
 *
 * Calibrated to live combat (1000 HP, 300 atk EV @ 1 nominal APS).
 *
 * @module components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants
 */

/** Diminishing-return pivot for health and offense Spiritcore pricing. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_K = 50_000;

/** Starting player max health on the leveling curve. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_HP = 1_000;

/** Theoretical max health approached by the leveling curve. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_HP = 100_000;

/** Starting player DPS on the leveling curve (300 atk EV x 1 nominal APS). */
export const DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_DPS = 300;

/**
 * Theoretical max DPS approached by the leveling curve.
 * Preserves the live baseline HP:TTK ratio at every wealth tier.
 */
export const DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_DPS = 30_000;

/** Fraction of monster combat value granted as a Spiritcore drop. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MONSTER_DROP_RATE = 0.05;

/** HP coefficient in monster combat value (0.8 x 1000 = 800). */
export const DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MONSTER_CV_HEALTH_COEFFICIENT = 0.8;

/**
 * DPS coefficient in monster combat value.
 * Tuned so base HP and base DPS contribute equal combat value (800 each).
 */
export const DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MONSTER_CV_DPS_COEFFICIENT =
  800 / DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_BASE_DPS;

/** Max attack speed purchasable through Spritcore upgrades (nominal APS). */
export const DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_ATTACK_SPEED = 3;

/** Health gained per Spiritcore health upgrade purchase. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_HEALTH_UPGRADE_STEP = 100;

/** Damage gained per Spiritcore damage upgrade purchase. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_DAMAGE_UPGRADE_STEP = 10;

/** Attack speed gained per Spiritcore speed upgrade purchase (nominal APS). */
export const DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_ATTACK_SPEED_UPGRADE_STEP = 0.05;

/** localStorage key prefix for purchased Spritcore stat bonuses. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_UPGRADE_STORAGE_KEY_PREFIX =
  'world-plaza-spritcore-upgrade' as const;

/**
 * Resolves the localStorage key for Spritcore upgrade progress.
 *
 * Prefer `ownerId:avatarSkinId` so each transform form keeps its own spend.
 * Omitting `avatarSkinId` resolves the legacy owner-only key used for migration.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 * @param avatarSkinId - Active avatar form id when scoping per character.
 */
export function resolvingWorldPlazaSpritcoreUpgradeStorageKey(
  storageOwnerId: string | null,
  avatarSkinId?: string | null
): string {
  if (storageOwnerId && avatarSkinId) {
    return `${DEFINING_WORLD_PLAZA_SPRITCORE_UPGRADE_STORAGE_KEY_PREFIX}:${storageOwnerId}:${avatarSkinId}`;
  }

  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_SPRITCORE_UPGRADE_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_SPRITCORE_UPGRADE_STORAGE_KEY_PREFIX;
}
