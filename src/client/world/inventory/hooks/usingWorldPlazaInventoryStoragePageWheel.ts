'use client';

/**
 * Mouse-wheel paging for the inventory items row.
 *
 * @module components/world/inventory/hooks/usingWorldPlazaInventoryStoragePageWheel
 */

import { DEFINING_WORLD_PLAZA_INVENTORY_PAGE_WHEEL_COOLDOWN_MS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { resolvingWorldPlazaInventoryStoragePageIndexFromWheelDeltaY } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStoragePage';
import type * as React from 'react';
import { useCallback, useRef } from 'react';

export type UsingWorldPlazaInventoryStoragePageWheelInput = {
  readonly storagePageIndex: number;
  readonly storagePageCount: number;
  readonly onStoragePageIndexChange: (nextPageIndex: number) => void;
};

/**
 * Returns an onWheel handler that pages storage while hovering the items bar.
 */
export function usingWorldPlazaInventoryStoragePageWheel({
  storagePageIndex,
  storagePageCount,
  onStoragePageIndexChange,
}: UsingWorldPlazaInventoryStoragePageWheelInput): (
  event: React.WheelEvent<HTMLElement>
) => void {
  const storagePageIndexRef = useRef(storagePageIndex);
  storagePageIndexRef.current = storagePageIndex;

  const storagePageCountRef = useRef(storagePageCount);
  storagePageCountRef.current = storagePageCount;

  const onStoragePageIndexChangeRef = useRef(onStoragePageIndexChange);
  onStoragePageIndexChangeRef.current = onStoragePageIndexChange;

  const lastPageChangeAtMsRef = useRef(0);

  return useCallback((event: React.WheelEvent<HTMLElement>): void => {
    if (event.deltaY === 0) {
      return;
    }

    const nowMs = performance.now();

    if (
      nowMs - lastPageChangeAtMsRef.current <
      DEFINING_WORLD_PLAZA_INVENTORY_PAGE_WHEEL_COOLDOWN_MS
    ) {
      event.preventDefault();
      return;
    }

    const nextPageIndex =
      resolvingWorldPlazaInventoryStoragePageIndexFromWheelDeltaY(
        storagePageIndexRef.current,
        storagePageCountRef.current,
        event.deltaY
      );

    event.preventDefault();

    if (nextPageIndex === storagePageIndexRef.current) {
      return;
    }

    lastPageChangeAtMsRef.current = nowMs;
    onStoragePageIndexChangeRef.current(nextPageIndex);
  }, []);
}
