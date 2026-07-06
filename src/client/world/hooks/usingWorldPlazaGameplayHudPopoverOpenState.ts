'use client';

import { useEffect, useState, type RefObject } from 'react';

/** Result from {@link usingWorldPlazaGameplayHudPopoverOpenState}. */
export type UsingWorldPlazaGameplayHudPopoverOpenStateResult = {
  isPopoverOpen: boolean;
  settingPopoverOpen: (isOpen: boolean) => void;
  togglingPopoverOpen: () => void;
};

/**
 * Local open state for compact gameplay HUD popovers with outside-click and Escape dismiss.
 */
export function usingWorldPlazaGameplayHudPopoverOpenState(
  containerRef: RefObject<HTMLElement | null>
): UsingWorldPlazaGameplayHudPopoverOpenStateResult {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (!isPopoverOpen) {
      return;
    }

    const dismissingPopoverOnPointerDown = (event: PointerEvent): void => {
      const container = containerRef.current;
      const target = event.target;

      if (
        !container ||
        !(target instanceof Node) ||
        container.contains(target)
      ) {
        return;
      }

      setIsPopoverOpen(false);
    };

    const dismissingPopoverOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') {
        return;
      }

      setIsPopoverOpen(false);
    };

    document.addEventListener('pointerdown', dismissingPopoverOnPointerDown);
    document.addEventListener('keydown', dismissingPopoverOnEscape);

    return () => {
      document.removeEventListener(
        'pointerdown',
        dismissingPopoverOnPointerDown
      );
      document.removeEventListener('keydown', dismissingPopoverOnEscape);
    };
  }, [containerRef, isPopoverOpen]);

  return {
    isPopoverOpen,
    settingPopoverOpen: setIsPopoverOpen,
    togglingPopoverOpen: () => {
      setIsPopoverOpen((previousIsOpen) => !previousIsOpen);
    },
  };
}

/**
 * Dismisses a controlled gameplay HUD popover on outside pointer down or Escape.
 */
export function usingWorldPlazaGameplayHudControlledPopoverDismiss(
  containerRef: RefObject<HTMLElement | null>,
  isPopoverOpen: boolean,
  onRequestClose: () => void
): void {
  useEffect(() => {
    if (!isPopoverOpen) {
      return;
    }

    const dismissingPopoverOnPointerDown = (event: PointerEvent): void => {
      const container = containerRef.current;
      const target = event.target;

      if (
        !container ||
        !(target instanceof Node) ||
        container.contains(target)
      ) {
        return;
      }

      onRequestClose();
    };

    const dismissingPopoverOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') {
        return;
      }

      onRequestClose();
    };

    document.addEventListener('pointerdown', dismissingPopoverOnPointerDown);
    document.addEventListener('keydown', dismissingPopoverOnEscape);

    return () => {
      document.removeEventListener(
        'pointerdown',
        dismissingPopoverOnPointerDown
      );
      document.removeEventListener('keydown', dismissingPopoverOnEscape);
    };
  }, [containerRef, isPopoverOpen, onRequestClose]);
}
