'use client';

/**
 * Drag-hover paging for inventory storage arrows.
 *
 * @module components/world/inventory/hooks/usingWorldPlazaInventoryStoragePageDragHover
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_DRAG_HOVER_DELAY_MS,
  DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_DRAG_HOVER_REPEAT_MS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  parsingWorldPlazaInventoryStoragePageArrowDirection,
  type DefiningWorldPlazaInventoryStoragePageArrowDirection,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryPageArrowDndIds';
import type { DragOverEvent } from '@dnd-kit/core';
import { useCallback, useEffect, useRef } from 'react';

export type UsingWorldPlazaInventoryStoragePageDragHoverInput = {
  readonly storagePageIndex: number;
  readonly storagePageCount: number;
  readonly onStoragePageIndexChange: (nextPageIndex: number) => void;
};

export type UsingWorldPlazaInventoryStoragePageDragHoverResult = {
  readonly onDragOver: (event: DragOverEvent) => void;
  readonly clearingDragHoverPaging: () => void;
};

/**
 * Pages storage when a dragged item hovers the up/down arrows.
 */
export function usingWorldPlazaInventoryStoragePageDragHover({
  storagePageIndex,
  storagePageCount,
  onStoragePageIndexChange,
}: UsingWorldPlazaInventoryStoragePageDragHoverInput): UsingWorldPlazaInventoryStoragePageDragHoverResult {
  const storagePageIndexRef = useRef(storagePageIndex);
  storagePageIndexRef.current = storagePageIndex;

  const storagePageCountRef = useRef(storagePageCount);
  storagePageCountRef.current = storagePageCount;

  const onStoragePageIndexChangeRef = useRef(onStoragePageIndexChange);
  onStoragePageIndexChangeRef.current = onStoragePageIndexChange;

  const hoverDirectionRef =
    useRef<DefiningWorldPlazaInventoryStoragePageArrowDirection | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  const clearingDragHoverPaging = useCallback((): void => {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    hoverDirectionRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      clearingDragHoverPaging();
    };
  }, [clearingDragHoverPaging]);

  const schedulingPageStep = useCallback(
    (
      direction: DefiningWorldPlazaInventoryStoragePageArrowDirection,
      delayMs: number
    ): void => {
      if (hoverTimeoutRef.current !== null) {
        window.clearTimeout(hoverTimeoutRef.current);
      }

      hoverTimeoutRef.current = window.setTimeout(() => {
        hoverTimeoutRef.current = null;

        if (hoverDirectionRef.current !== direction) {
          return;
        }

        const currentPage = storagePageIndexRef.current;
        const nextPage = direction === 'up' ? currentPage - 1 : currentPage + 1;

        if (nextPage < 0 || nextPage >= storagePageCountRef.current) {
          clearingDragHoverPaging();
          return;
        }

        onStoragePageIndexChangeRef.current(nextPage);
        schedulingPageStep(
          direction,
          DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_DRAG_HOVER_REPEAT_MS
        );
      }, delayMs);
    },
    [clearingDragHoverPaging]
  );

  const onDragOver = useCallback(
    (event: DragOverEvent): void => {
      const overId = event.over ? String(event.over.id) : null;
      const direction =
        overId !== null
          ? parsingWorldPlazaInventoryStoragePageArrowDirection(overId)
          : null;

      if (!direction) {
        clearingDragHoverPaging();
        return;
      }

      if (hoverDirectionRef.current === direction) {
        return;
      }

      clearingDragHoverPaging();
      hoverDirectionRef.current = direction;
      schedulingPageStep(
        direction,
        DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_DRAG_HOVER_DELAY_MS
      );
    },
    [clearingDragHoverPaging, schedulingPageStep]
  );

  return {
    onDragOver,
    clearingDragHoverPaging,
  };
}
