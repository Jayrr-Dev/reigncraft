/**
 * Reads persisted Spritcore upgrade bonuses from localStorage.
 *
 * @module components/world/spritcore/domains/readingWorldPlazaSpritcoreUpgradeFromStorage
 */

import { resolvingWorldPlazaSpritcoreUpgradeStorageKey } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';
import {
  WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
  type WorldPlazaSpritcoreUpgradeBonuses,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';

function readingWorldPlazaSpritcoreUpgradeNonNegativeNumber(
  value: unknown
): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : 0;
}

/**
 * Hydrates Spritcore upgrade bonuses for one session owner.
 */
export function readingWorldPlazaSpritcoreUpgradeFromStorage(
  storageOwnerId: string | null
): WorldPlazaSpritcoreUpgradeBonuses {
  if (typeof window === 'undefined') {
    return WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES;
  }

  const raw = localStorage.getItem(
    resolvingWorldPlazaSpritcoreUpgradeStorageKey(storageOwnerId)
  );

  if (!raw) {
    return WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object') {
      return WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES;
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
      totalSpritcoreInvested:
        readingWorldPlazaSpritcoreUpgradeNonNegativeNumber(
          record.totalSpritcoreInvested
        ),
    };
  } catch {
    return WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES;
  }
}
