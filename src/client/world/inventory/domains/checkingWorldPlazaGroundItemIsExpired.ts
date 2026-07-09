/**
 * Pure predicate for ground-item auto-despawn lifetime.
 *
 * @module components/world/inventory/domains/checkingWorldPlazaGroundItemIsExpired
 */

import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import { checkingWorldInventoryGroundItemIsExpired } from '../../../../shared/checkingWorldInventoryGroundItemIsExpired';

/**
 * True when a ground stack has lived past the shared despawn lifetime.
 *
 * @param groundItem - Ground stack with `spawnedAt` epoch ms.
 * @param nowMs - Clock to compare against (defaults to `Date.now()`).
 */
export function checkingWorldPlazaGroundItemIsExpired(
  groundItem: DefiningWorldPlazaGroundItem,
  nowMs: number = Date.now()
): boolean {
  return checkingWorldInventoryGroundItemIsExpired(groundItem, nowMs);
}
