'use client';

/**
 * Circular bite-cooldown ring drawn around a ground food glyph while wildlife eats.
 *
 * @module components/world/inventory/components/renderingWorldPlazaGroundItemWildlifeEatRing
 */

import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import {
  computingWorldPlazaTimedInteractionProgressRingLayout,
  computingWorldPlazaTimedInteractionProgressRingStrokeDashoffset,
} from '@/components/world/interaction/domains/computingWorldPlazaTimedInteractionProgressRingLayout';
import {
  DEFINING_WORLD_PLAZA_GROUND_ITEM_WILDLIFE_EAT_RING_SIZE_PX,
  DEFINING_WORLD_PLAZA_GROUND_ITEM_WILDLIFE_EAT_RING_STROKE_PX,
} from '@/components/world/inventory/domains/definingWorldPlazaGroundItemConstants';
import { memo, useLayoutEffect, useMemo, useRef, type RefObject } from 'react';

export type RenderingWorldPlazaGroundItemWildlifeEatRingProps = {
  readonly isActive: boolean;
  readonly progressRatioRef: RefObject<number>;
  readonly viewportHudScale?: number;
};

/**
 * SVG progress ring sized to wrap a ground item glyph.
 *
 * Progress animates through direct SVG updates to avoid per-frame React re-renders.
 */
export const RenderingWorldPlazaGroundItemWildlifeEatRing = memo(
  function RenderingWorldPlazaGroundItemWildlifeEatRing({
    isActive,
    progressRatioRef,
    viewportHudScale = 1,
  }: RenderingWorldPlazaGroundItemWildlifeEatRingProps): React.JSX.Element | null {
    const progressCircleRef = useRef<SVGCircleElement | null>(null);

    const ringLayout = useMemo(() => {
      const ringSizePx = computingWorldPlazaViewportHudScaledPx(
        DEFINING_WORLD_PLAZA_GROUND_ITEM_WILDLIFE_EAT_RING_SIZE_PX,
        viewportHudScale
      );
      const ringStrokePx = Math.max(
        1.5,
        computingWorldPlazaViewportHudScaledPx(
          DEFINING_WORLD_PLAZA_GROUND_ITEM_WILDLIFE_EAT_RING_STROKE_PX,
          viewportHudScale
        )
      );

      return {
        ...computingWorldPlazaTimedInteractionProgressRingLayout(
          ringSizePx,
          ringStrokePx
        ),
        ringStrokePx,
      };
    }, [viewportHudScale]);

    useLayoutEffect(() => {
      if (!isActive) {
        return;
      }

      const progressCircle = progressCircleRef.current;
      const ringCircumferencePx = ringLayout.ringCircumferencePx;

      if (progressCircle) {
        progressCircle.style.strokeDasharray = `${ringCircumferencePx}`;
      }

      let animationFrameId = 0;

      const updatingRing = (): void => {
        const progressRatio = progressRatioRef.current ?? 0;
        const strokeDashoffset =
          computingWorldPlazaTimedInteractionProgressRingStrokeDashoffset(
            ringCircumferencePx,
            progressRatio
          );

        if (progressCircle) {
          progressCircle.style.strokeDashoffset = `${strokeDashoffset}`;
        }

        animationFrameId = window.requestAnimationFrame(updatingRing);
      };

      animationFrameId = window.requestAnimationFrame(updatingRing);

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }, [isActive, progressRatioRef, ringLayout.ringCircumferencePx]);

    if (!isActive) {
      return null;
    }

    return (
      <svg
        className="world-plaza-ground-item-wildlife-eat-ring pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        width={ringLayout.ringSizePx}
        height={ringLayout.ringSizePx}
        viewBox={`0 0 ${ringLayout.ringSizePx} ${ringLayout.ringSizePx}`}
        aria-hidden="true"
      >
        <circle
          className="world-plaza-timed-interaction-progress-ring-track"
          cx={ringLayout.ringCenterPx}
          cy={ringLayout.ringCenterPx}
          r={ringLayout.ringRadiusPx}
          fill="none"
          strokeWidth={ringLayout.ringStrokePx}
        />
        <circle
          ref={progressCircleRef}
          className="world-plaza-timed-interaction-progress-ring-progress"
          cx={ringLayout.ringCenterPx}
          cy={ringLayout.ringCenterPx}
          r={ringLayout.ringRadiusPx}
          fill="none"
          strokeWidth={ringLayout.ringStrokePx}
          transform={`rotate(-90 ${ringLayout.ringCenterPx} ${ringLayout.ringCenterPx})`}
        />
      </svg>
    );
  }
);
