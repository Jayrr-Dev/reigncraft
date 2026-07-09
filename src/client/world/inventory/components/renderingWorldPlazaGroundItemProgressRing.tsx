'use client';

/**
 * Reusable SVG progress ring centered on a ground item glyph.
 *
 * Mounted always; stays invisible until `isVisible` is true. Progress animates
 * through direct SVG updates to avoid per-frame React re-renders.
 *
 * @module components/world/inventory/components/renderingWorldPlazaGroundItemProgressRing
 */

import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import {
  computingWorldPlazaTimedInteractionProgressRingLayout,
  computingWorldPlazaTimedInteractionProgressRingStrokeDashoffset,
} from '@/components/world/interaction/domains/computingWorldPlazaTimedInteractionProgressRingLayout';
import {
  DEFINING_WORLD_PLAZA_GROUND_ITEM_PROGRESS_RING_SIZE_PX,
  DEFINING_WORLD_PLAZA_GROUND_ITEM_PROGRESS_RING_STROKE_PX,
} from '@/components/world/inventory/domains/definingWorldPlazaGroundItemConstants';
import { memo, useLayoutEffect, useMemo, useRef, type RefObject } from 'react';

export type RenderingWorldPlazaGroundItemProgressRingProps = {
  /** When false, ring stays mounted but fully transparent. */
  readonly isVisible: boolean;
  readonly progressRatioRef: RefObject<number>;
  readonly viewportHudScale?: number;
  /** Optional extra class on the SVG root. */
  readonly className?: string;
};

/**
 * Always-mounted ground-item progress ring (invisible until active).
 */
export const RenderingWorldPlazaGroundItemProgressRing = memo(
  function RenderingWorldPlazaGroundItemProgressRing({
    isVisible,
    progressRatioRef,
    viewportHudScale = 1,
    className,
  }: RenderingWorldPlazaGroundItemProgressRingProps): React.JSX.Element {
    const progressCircleRef = useRef<SVGCircleElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const ringLayout = useMemo(() => {
      const ringSizePx = computingWorldPlazaViewportHudScaledPx(
        DEFINING_WORLD_PLAZA_GROUND_ITEM_PROGRESS_RING_SIZE_PX,
        viewportHudScale
      );
      const ringStrokePx = Math.max(
        1.5,
        computingWorldPlazaViewportHudScaledPx(
          DEFINING_WORLD_PLAZA_GROUND_ITEM_PROGRESS_RING_STROKE_PX,
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
      const progressCircle = progressCircleRef.current;
      const svgElement = svgRef.current;
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

        if (svgElement) {
          svgElement.style.opacity = isVisible ? '1' : '0';
        }

        animationFrameId = window.requestAnimationFrame(updatingRing);
      };

      animationFrameId = window.requestAnimationFrame(updatingRing);

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }, [isVisible, progressRatioRef, ringLayout.ringCircumferencePx]);

    return (
      <svg
        ref={svgRef}
        className={
          className ??
          'world-plaza-ground-item-progress-ring pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        }
        width={ringLayout.ringSizePx}
        height={ringLayout.ringSizePx}
        viewBox={`0 0 ${ringLayout.ringSizePx} ${ringLayout.ringSizePx}`}
        style={{ opacity: 0 }}
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
