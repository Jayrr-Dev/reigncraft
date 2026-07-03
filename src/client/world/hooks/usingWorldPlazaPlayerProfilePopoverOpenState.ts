"use client";

import { DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaPlayerProfileModalConstants";
import { useEffect, useState, type RefObject } from "react";

/** Result from {@link usingWorldPlazaPlayerProfilePopoverOpenState}. */
export interface UsingWorldPlazaPlayerProfilePopoverOpenStateResult {
  /** Whether the profile card is visible. */
  isPopoverOpen: boolean;
  /** Opens or closes the profile card. */
  settingPopoverOpen: (isOpen: boolean) => void;
  /** Toggles the profile card. */
  togglingPopoverOpen: () => void;
}

/**
 * Local open state for a plaza profile popover with outside-click and Escape dismiss.
 *
 * @param containerRef - Row wrapper that contains the trigger and profile card.
 */
export function usingWorldPlazaPlayerProfilePopoverOpenState(
  containerRef: RefObject<HTMLElement | null>,
): UsingWorldPlazaPlayerProfilePopoverOpenStateResult {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (!isPopoverOpen) {
      return;
    }

    const dismissingPopoverOnPointerDown = (event: PointerEvent): void => {
      const container = containerRef.current;
      const target = event.target;

      if (!container || !(target instanceof Node) || container.contains(target)) {
        return;
      }

      if (
        target instanceof Element &&
        target.closest(`[${DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_DATA_ATTRIBUTE}]`)
      ) {
        return;
      }

      setIsPopoverOpen(false);
    };

    const dismissingPopoverOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") {
        return;
      }

      setIsPopoverOpen(false);
    };

    document.addEventListener("pointerdown", dismissingPopoverOnPointerDown);
    document.addEventListener("keydown", dismissingPopoverOnEscape);

    return () => {
      document.removeEventListener("pointerdown", dismissingPopoverOnPointerDown);
      document.removeEventListener("keydown", dismissingPopoverOnEscape);
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
