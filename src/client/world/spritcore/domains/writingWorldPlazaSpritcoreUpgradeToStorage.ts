/**
 * Persists Spritcore upgrade bonuses to localStorage.
 *
 * @module components/world/spritcore/domains/writingWorldPlazaSpritcoreUpgradeToStorage
 */

import { resolvingWorldPlazaSpritcoreUpgradeStorageKey } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';
import type { WorldPlazaSpritcoreUpgradeBonuses } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';

/**
 * Writes purchased Spritcore bonuses for one session owner.
 */
export function writingWorldPlazaSpritcoreUpgradeToStorage(
  storageOwnerId: string | null,
  bonuses: WorldPlazaSpritcoreUpgradeBonuses
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaSpritcoreUpgradeStorageKey(storageOwnerId),
    JSON.stringify({
      bonusMaxHealth:
        bonuses.bonusMaxHealth > 0 ? bonuses.bonusMaxHealth : undefined,
      bonusAttackPower:
        bonuses.bonusAttackPower > 0 ? bonuses.bonusAttackPower : undefined,
      bonusAttackSpeed:
        bonuses.bonusAttackSpeed > 0 ? bonuses.bonusAttackSpeed : undefined,
      totalSpritcoreInvested:
        bonuses.totalSpritcoreInvested > 0
          ? bonuses.totalSpritcoreInvested
          : undefined,
    })
  );
}
