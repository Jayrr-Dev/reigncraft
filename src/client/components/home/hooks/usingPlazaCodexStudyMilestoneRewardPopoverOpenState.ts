import { useEffect, useState, type RefObject } from 'react';

export type UsingPlazaCodexStudyMilestoneRewardPopoverOpenStateResult = {
  openMarkerId: string | null;
  togglingMarkerPopover: (markerId: string) => void;
};

/**
 * Exclusive open state for milestone chest popovers (tap/mobile + outside dismiss).
 */
export function usingPlazaCodexStudyMilestoneRewardPopoverOpenState(
  containerRef: RefObject<HTMLElement | null>
): UsingPlazaCodexStudyMilestoneRewardPopoverOpenStateResult {
  const [openMarkerId, setOpenMarkerId] = useState<string | null>(null);

  useEffect(() => {
    if (openMarkerId === null) {
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

      setOpenMarkerId(null);
    };

    const dismissingPopoverOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') {
        return;
      }

      setOpenMarkerId(null);
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
  }, [containerRef, openMarkerId]);

  return {
    openMarkerId,
    togglingMarkerPopover: (markerId: string) => {
      setOpenMarkerId((previousId) =>
        previousId === markerId ? null : markerId
      );
    },
  };
}
