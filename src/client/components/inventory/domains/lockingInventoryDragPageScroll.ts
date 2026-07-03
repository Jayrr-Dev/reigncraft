/** Tracks nested drag scroll locks (supports multiple concurrent drags). */
let LOCKING_INVENTORY_DRAG_PAGE_SCROLL_COUNT = 0;

/** Saved body overflow before lock. */
let LOCKING_INVENTORY_DRAG_PAGE_SCROLL_BODY_OVERFLOW = "";

/** Saved html overflow before lock. */
let LOCKING_INVENTORY_DRAG_PAGE_SCROLL_HTML_OVERFLOW = "";

/**
 * Prevents page scroll while an inventory item is being dragged.
 * Safe to call multiple times; unlock once per lock.
 */
export function lockingInventoryDragPageScroll(): void {
  if (typeof document === "undefined") {
    return;
  }

  if (LOCKING_INVENTORY_DRAG_PAGE_SCROLL_COUNT === 0) {
    LOCKING_INVENTORY_DRAG_PAGE_SCROLL_BODY_OVERFLOW =
      document.body.style.overflow;
    LOCKING_INVENTORY_DRAG_PAGE_SCROLL_HTML_OVERFLOW =
      document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }

  LOCKING_INVENTORY_DRAG_PAGE_SCROLL_COUNT += 1;
}

/**
 * Restores page scroll after an inventory drag ends or is cancelled.
 */
export function unlockingInventoryDragPageScroll(): void {
  if (typeof document === "undefined") {
    return;
  }

  if (LOCKING_INVENTORY_DRAG_PAGE_SCROLL_COUNT <= 0) {
    return;
  }

  LOCKING_INVENTORY_DRAG_PAGE_SCROLL_COUNT -= 1;

  if (LOCKING_INVENTORY_DRAG_PAGE_SCROLL_COUNT === 0) {
    document.body.style.overflow =
      LOCKING_INVENTORY_DRAG_PAGE_SCROLL_BODY_OVERFLOW;
    document.documentElement.style.overflow =
      LOCKING_INVENTORY_DRAG_PAGE_SCROLL_HTML_OVERFLOW;
  }
}
