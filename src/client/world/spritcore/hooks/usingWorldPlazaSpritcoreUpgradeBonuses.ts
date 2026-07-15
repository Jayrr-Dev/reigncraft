'use client';

/**
 * React hook for purchased Spritcore upgrade bonuses.
 *
 * @module components/world/spritcore/hooks/usingWorldPlazaSpritcoreUpgradeBonuses
 */

import type { WorldPlazaSpritcoreUpgradeBonuses } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';
import {
  gettingWorldPlazaSpritcoreUpgradeSnapshot,
  subscribingWorldPlazaSpritcoreUpgrade,
} from '@/components/world/spritcore/domains/managingWorldPlazaSpritcoreUpgradeStore';
import { useSyncExternalStore } from 'react';

/**
 * Subscribes to the local Spritcore upgrade bonus store.
 */
export function usingWorldPlazaSpritcoreUpgradeBonuses(): WorldPlazaSpritcoreUpgradeBonuses {
  return useSyncExternalStore(
    subscribingWorldPlazaSpritcoreUpgrade,
    gettingWorldPlazaSpritcoreUpgradeSnapshot,
    gettingWorldPlazaSpritcoreUpgradeSnapshot
  );
}
