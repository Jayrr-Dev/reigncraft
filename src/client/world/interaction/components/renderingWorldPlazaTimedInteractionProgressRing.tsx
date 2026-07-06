'use client';

import { Icon } from '@/components/ui/icon';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import {
  computingWorldPlazaTimedInteractionProgressRingLayout,
  computingWorldPlazaTimedInteractionProgressRingStrokeDashoffset,
} from '@/components/world/interaction/domains/computingWorldPlazaTimedInteractionProgressRingLayout';
import {
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_ICON_SIZE_PX,
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_STROKE_PX,
} from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressConstants';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { memo, useLayoutEffect, useRef, type RefObject } from 'react';

export type RenderingWorldPlazaTimedInteractionProgressRingProps = {
  readonly snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
};

const RING_LAYOUT = computingWorldPlazaTimedInteractionProgressRingLayout();

function checkingWorldPlazaTimedInteractionProgressRingMounted(
  snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot
): boolean {
  return (
    snapshot.isActive || snapshot.isCancelling || snapshot.progressRatio > 0
  );
}

/**
 * Minimal depleting ring with an optional center icon beside a world interaction label.
 *
 * Progress animates through direct SVG updates to avoid per-frame React re-renders.
 */
export const RenderingWorldPlazaTimedInteractionProgressRing = memo(
  function RenderingWorldPlazaTimedInteractionProgressRing({
    snapshot,
    progressRatioRef,
  }: RenderingWorldPlazaTimedInteractionProgressRingProps): React.JSX.Element | null {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const progressCircleRef = useRef<SVGCircleElement | null>(null);
    const snapshotRef = useRef(snapshot);

    snapshotRef.current = snapshot;

    const isMounted =
      checkingWorldPlazaTimedInteractionProgressRingMounted(snapshot);
    const milestoneClassName = snapshot.milestonePulse
      ? `world-plaza-timed-interaction-progress-pulse world-plaza-timed-interaction-progress-pulse--${snapshot.milestonePulse}`
      : '';

    useLayoutEffect(() => {
      if (!isMounted) {
        return;
      }

      const progressCircle = progressCircleRef.current;
      const ringCircumferencePx = RING_LAYOUT.ringCircumferencePx;

      if (progressCircle) {
        progressCircle.style.strokeDasharray = `${ringCircumferencePx}`;
      }

      const updatingRing = (): void => {
        const currentSnapshot = snapshotRef.current;
        const progressRatio = progressRatioRef.current;
        const strokeDashoffset =
          computingWorldPlazaTimedInteractionProgressRingStrokeDashoffset(
            ringCircumferencePx,
            progressRatio
          );

        if (progressCircle) {
          progressCircle.style.strokeDashoffset = `${strokeDashoffset}`;
        }

        const wrapperElement = wrapperRef.current;

        if (wrapperElement) {
          wrapperElement.style.opacity = currentSnapshot.isCancelling
            ? '0'
            : '1';
        }
      };

      updatingRing();

      const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
        () => {
          updatingRing();
        }
      );

      return () => {
        unsubscribeDomOverlayFrame();
      };
    }, [isMounted, progressRatioRef, snapshot.isCancelling]);

    if (!isMounted) {
      return null;
    }

    return (
      <div
        ref={wrapperRef}
        className={`world-plaza-timed-interaction-progress-indicator ${milestoneClassName}`}
        style={{
          width: `${RING_LAYOUT.ringSizePx}px`,
          height: `${RING_LAYOUT.ringSizePx}px`,
          transition: 'opacity 180ms ease-out',
        }}
        aria-hidden="true"
      >
        <svg
          className="world-plaza-timed-interaction-progress-ring"
          width={RING_LAYOUT.ringSizePx}
          height={RING_LAYOUT.ringSizePx}
          viewBox={`0 0 ${RING_LAYOUT.ringSizePx} ${RING_LAYOUT.ringSizePx}`}
          aria-hidden="true"
        >
          <circle
            className="world-plaza-timed-interaction-progress-ring-track"
            cx={RING_LAYOUT.ringCenterPx}
            cy={RING_LAYOUT.ringCenterPx}
            r={RING_LAYOUT.ringRadiusPx}
            fill="none"
            strokeWidth={
              DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_STROKE_PX
            }
          />
          <circle
            ref={progressCircleRef}
            className="world-plaza-timed-interaction-progress-ring-progress"
            cx={RING_LAYOUT.ringCenterPx}
            cy={RING_LAYOUT.ringCenterPx}
            r={RING_LAYOUT.ringRadiusPx}
            fill="none"
            strokeWidth={
              DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_STROKE_PX
            }
            transform={`rotate(-90 ${RING_LAYOUT.ringCenterPx} ${RING_LAYOUT.ringCenterPx})`}
          />
        </svg>
        {snapshot.activeProgressIcon ? (
          <Icon
            icon={snapshot.activeProgressIcon}
            className="world-plaza-timed-interaction-progress-icon"
            style={{
              width: `${DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_ICON_SIZE_PX}px`,
              height: `${DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_ICON_SIZE_PX}px`,
            }}
            aria-hidden="true"
          />
        ) : null}
      </div>
    );
  }
);
