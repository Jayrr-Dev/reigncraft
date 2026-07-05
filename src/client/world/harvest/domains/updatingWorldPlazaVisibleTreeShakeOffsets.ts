import { formattingWorldPlazaTreeDrawCacheKey } from '@/components/world/domains/formattingWorldPlazaTreeDrawCacheKey';
import type { SyncingWorldPlazaVisibleTreeCanopyLayerEntry } from '@/components/world/domains/syncingWorldPlazaVisibleTreeCanopyLayer';
import { computingWorldPlazaTreeShakeOffsetPx } from '@/components/world/harvest/domains/managingWorldPlazaTreeShakeRegistry';
import type { Graphics } from 'pixi.js';

/**
 * Applies per-frame horizontal shake offsets to visible tree trunks and canopies.
 */
export function updatingWorldPlazaVisibleTreeShakeOffsets(
  trunkGraphicsByKey: ReadonlyMap<string, Graphics>,
  canopyEntriesByKey: ReadonlyMap<
    string,
    SyncingWorldPlazaVisibleTreeCanopyLayerEntry
  >,
  nowMs: number
): void {
  for (const entry of canopyEntriesByKey.values()) {
    const cacheKey = formattingWorldPlazaTreeDrawCacheKey(entry.tree);
    const shakeOffsetPx = computingWorldPlazaTreeShakeOffsetPx(
      entry.tree.tileX,
      entry.tree.tileY,
      nowMs
    );
    const trunkGraphics = trunkGraphicsByKey.get(cacheKey);

    if (trunkGraphics) {
      trunkGraphics.position.x = shakeOffsetPx;
    }

    entry.container.position.x = shakeOffsetPx;
  }
}
