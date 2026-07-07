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

export type UsingWorldPlazaGameplayHudControlledPopoverDismissOptions = {
  /** Extra selectors treated as inside the popover (e.g. portaled menus). */
  readonly additionalInsideSelectors?: readonly string[];
};

function checkingWorldPlazaGameplayHudPopoverPointerTargetIsInside(
  target: EventTarget | null,
  container: HTMLElement | null,
  additionalInsideSelectors: readonly string[]
): boolean {
  if (!(target instanceof Node)) {
    return false;
  }

  if (container?.contains(target)) {
    return true;
  }

  if (!(target instanceof Element)) {
    return false;
  }

  return additionalInsideSelectors.some((selector) =>
    Boolean(target.closest(selector))
  );
}

/**
 * Dismisses a controlled gameplay HUD popover on outside pointer down or Escape.
 */
export function usingWorldPlazaGameplayHudControlledPopoverDismiss(
  containerRef: RefObject<HTMLElement | null>,
  isPopoverOpen: boolean,
  onRequestClose: () => void,
  options?: UsingWorldPlazaGameplayHudControlledPopoverDismissOptions
): void {
  const additionalInsideSelectors = options?.additionalInsideSelectors ?? [];

  useEffect(() => {
    if (!isPopoverOpen) {
      return;
    }

    const dismissingPopoverOnPointerDown = (event: PointerEvent): void => {
      if (
        checkingWorldPlazaGameplayHudPopoverPointerTargetIsInside(
          event.target,
          containerRef.current,
          additionalInsideSelectors
        )
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
  }, [additionalInsideSelectors, containerRef, isPopoverOpen, onRequestClose]);
}
