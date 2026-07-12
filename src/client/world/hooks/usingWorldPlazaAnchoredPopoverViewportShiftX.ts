'use client';

import { computingWorldPlazaAnchoredPopoverViewportShiftX } from '@/components/world/domains/computingWorldPlazaAnchoredPopoverViewportShiftX';
import { DEFINING_WORLD_PLAZA_ANCHORED_POPOVER_VIEWPORT_EDGE_INSET_PX } from '@/components/world/domains/definingWorldPlazaAnchoredPopoverViewportConstants';
import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react';

export type UsingWorldPlazaAnchoredPopoverViewportShiftXResult = {
  readonly popoverRef: RefObject<HTMLDivElement | null>;
  readonly popoverShiftStyle: CSSProperties;
};

/**
 * Measures a `left-1/2` centered popover and shifts it horizontally so it
 * stays inside the viewport (Radix/Floating UI collision behavior).
 *
 * @param remountKey - Remeasure when identity/content that changes width changes.
 * @param edgeInsetPx - Padding inside the clip edges.
 */
export function usingWorldPlazaAnchoredPopoverViewportShiftX(
  remountKey: string | number | boolean | null | undefined,
  edgeInsetPx: number = DEFINING_WORLD_PLAZA_ANCHORED_POPOVER_VIEWPORT_EDGE_INSET_PX
): UsingWorldPlazaAnchoredPopoverViewportShiftXResult {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [shiftXPx, setShiftXPx] = useState(0);

  useLayoutEffect(() => {
    const element = popoverRef.current;
    if (element === null) {
      return;
    }

    const measuringShiftX = (): void => {
      const previousTransform = element.style.transform;
      element.style.transform = 'translateX(-50%)';
      const rect = element.getBoundingClientRect();
      element.style.transform = previousTransform;

      const nextShiftXPx = computingWorldPlazaAnchoredPopoverViewportShiftX({
        popoverLeftPx: rect.left,
        popoverRightPx: rect.right,
        clipLeftPx: 0,
        clipRightPx: window.innerWidth,
        edgeInsetPx,
      });

      setShiftXPx((currentShiftXPx) =>
        currentShiftXPx === nextShiftXPx ? currentShiftXPx : nextShiftXPx
      );
    };

    measuringShiftX();
    window.addEventListener('resize', measuringShiftX);
    return () => {
      window.removeEventListener('resize', measuringShiftX);
    };
  }, [edgeInsetPx, remountKey]);

  return {
    popoverRef,
    popoverShiftStyle: {
      transform: `translateX(calc(-50% + ${shiftXPx}px))`,
    },
  };
}
