/**
 * Reads persisted Spritcore upgrade bonuses from localStorage.
 *
 * @module components/world/spritcore/domains/readingWorldPlazaSpritcoreUpgradeFromStorage
 */

import { DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { resolvingWorldPlazaSpritcoreUpgradeStorageKey } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';
import {
  WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
  type WorldPlazaSpritcoreUpgradeBonuses,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';
import { writingWorldPlazaSpritcoreUpgradeToStorage } from '@/components/world/spritcore/domains/writingWorldPlazaSpritcoreUpgradeToStorage';

function readingWorldPlazaSpritcoreUpgradeNonNegativeNumber(
  value: unknown
): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : 0;
}

function parsingWorldPlazaSpritcoreUpgradeBonuses(
  raw: string
): WorldPlazaSpritcoreUpgradeBonuses | null {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const record = parsed as Record<string, unknown>;

    return {
      bonusMaxHealth: readingWorldPlazaSpritcoreUpgradeNonNegativeNumber(
        record.bonusMaxHealth
      ),
      bonusAttackPower: readingWorldPlazaSpritcoreUpgradeNonNegativeNumber(
        record.bonusAttackPower
      ),
      bonusAttackSpeed: readingWorldPlazaSpritcoreUpgradeNonNegativeNumber(
        record.bonusAttackSpeed
      ),
      bonusDefense: readingWorldPlazaSpritcoreUpgradeNonNegativeNumber(
        record.bonusDefense
      ),
      bonusMoveSpeed: readingWorldPlazaSpritcoreUpgradeNonNegativeNumber(
        record.bonusMoveSpeed
      ),
      totalSpritcoreInvested:
        readingWorldPlazaSpritcoreUpgradeNonNegativeNumber(
          record.totalSpritcoreInvested
        ),
    };
  } catch {
    return null;
  }
}

/**
 * Hydrates Spritcore upgrade bonuses for one session owner + avatar form.
 *
 * Legacy owner-only saves migrate onto the default Girl form once.
 */
export function readingWorldPlazaSpritcoreUpgradeFromStorage(
  storageOwnerId: string | null,
  avatarSkinId: string | null = null
): WorldPlazaSpritcoreUpgradeBonuses {
  if (typeof window === 'undefined') {
    return WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES;
  }

  const scopedRaw = localStorage.getItem(
    resolvingWorldPlazaSpritcoreUpgradeStorageKey(storageOwnerId, avatarSkinId)
  );

  if (scopedRaw) {
    return (
      parsingWorldPlazaSpritcoreUpgradeBonuses(scopedRaw) ??
      WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES
    );
  }

  const shouldMigrateLegacyOwnerSave =
    Boolean(storageOwnerId) &&
    (avatarSkinId === null ||
      avatarSkinId === DEFINING_WORLD_PLAZA_AVATAR_SKIN_DEFAULT);

  if (!shouldMigrateLegacyOwnerSave) {
    return WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES;
  }

  const legacyRaw = localStorage.getItem(
    resolvingWorldPlazaSpritcoreUpgradeStorageKey(storageOwnerId)
  );

  if (!legacyRaw) {
    return WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES;
  }

  const legacyBonuses = parsingWorldPlazaSpritcoreUpgradeBonuses(legacyRaw);

  if (!legacyBonuses) {
    return WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES;
  }

  if (avatarSkinId) {
    writingWorldPlazaSpritcoreUpgradeToStorage(
      storageOwnerId,
      legacyBonuses,
      avatarSkinId
    );
  }

  return legacyBonuses;
}
