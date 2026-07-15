'use client';

import { Icon } from '@/components/ui/icon';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';

import {
  DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FISHING_REEL_READY_FLASH_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FISHING_REEL_READY_YELLOW_ONCE_CLASS_NAME,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingReelOpportunityConstants';
import {
  gettingWorldPlazaFishingReelHold,
  gettingWorldPlazaFishingReelReadyFlashVisible,
} from '@/components/world/fishing/domains/managingWorldPlazaFishingReelCastState';

import {
  computingWorldPlazaTimedInteractionProgressRingLayout,
  computingWorldPlazaTimedInteractionProgressRingStrokeDashoffset,
} from '@/components/world/interaction/domains/computingWorldPlazaTimedInteractionProgressRingLayout';

import {
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_ICON_SIZE_PX,
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_STROKE_PX,
} from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressConstants';

import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';

import { memo, useId, useLayoutEffect, useRef, type RefObject } from 'react';

export type RenderingWorldPlazaFishingCastProgressRingProps = {
  readonly snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;

  readonly progressRatioRef: RefObject<number>;

  readonly reelOpportunityActiveRef: RefObject<boolean>;

  readonly onReel: () => void;

  readonly onReelHoldStart: () => void;

  readonly onReelHoldEnd: () => void;
};

const RING_LAYOUT = computingWorldPlazaTimedInteractionProgressRingLayout();

function checkingWorldPlazaFishingCastProgressRingMounted(
  snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot
): boolean {
  return (
    snapshot.isActive || snapshot.isCancelling || snapshot.progressRatio > 0
  );
}

/**

 * Fishing cast ring: red-to-green progress stroke and click-to-reel affordance.

 */

export const RenderingWorldPlazaFishingCastProgressRing = memo(
  function RenderingWorldPlazaFishingCastProgressRing({
    snapshot,

    progressRatioRef,

    reelOpportunityActiveRef,

    onReel,

    onReelHoldStart,

    onReelHoldEnd,
  }: RenderingWorldPlazaFishingCastProgressRingProps): React.JSX.Element | null {
    const wrapperRef = useRef<HTMLButtonElement | null>(null);

    const progressCircleRef = useRef<SVGCircleElement | null>(null);

    const gradientStartRef = useRef<SVGStopElement | null>(null);

    const gradientEndRef = useRef<SVGStopElement | null>(null);

    const snapshotRef = useRef(snapshot);

    const onReelRef = useRef(onReel);

    const onReelHoldStartRef = useRef(onReelHoldStart);

    const onReelHoldEndRef = useRef(onReelHoldEnd);

    const gradientId = useId().replace(/:/g, '');

    snapshotRef.current = snapshot;

    onReelRef.current = onReel;

    onReelHoldStartRef.current = onReelHoldStart;

    onReelHoldEndRef.current = onReelHoldEnd;

    const isMounted =
      checkingWorldPlazaFishingCastProgressRingMounted(snapshot);

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

        const gradientStart = gradientStartRef.current;

        const gradientEnd = gradientEndRef.current;

        if (gradientStart && gradientEnd) {
          const easedRatio = Math.min(1, Math.max(0, progressRatio));

          gradientStart.setAttribute(
            'stop-color',

            `rgb(${Math.round(239 - easedRatio * 167)}, ${Math.round(68 + easedRatio * 117)}, ${Math.round(68 + easedRatio * 22)})`
          );

          gradientEnd.setAttribute(
            'stop-color',

            `rgb(${Math.round(220 - easedRatio * 176)}, ${Math.round(38 + easedRatio * 160)}, ${Math.round(38 + easedRatio * 52)})`
          );
        }

        const wrapperElement = wrapperRef.current;

        if (wrapperElement) {
          wrapperElement.style.opacity = currentSnapshot.isCancelling
            ? '0'
            : '1';

          const isReelReady = reelOpportunityActiveRef.current;
          const isReelHeld = isReelReady && gettingWorldPlazaFishingReelHold();

          wrapperElement.classList.toggle(
            DEFINING_WORLD_PLAZA_FISHING_REEL_READY_FLASH_CLASS_NAME,
            isReelReady && !isReelHeld
          );
          wrapperElement.classList.toggle(
            DEFINING_WORLD_PLAZA_FISHING_REEL_READY_YELLOW_ONCE_CLASS_NAME,
            isReelReady &&
              !isReelHeld &&
              gettingWorldPlazaFishingReelReadyFlashVisible()
          );
          wrapperElement.classList.toggle(
            DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_CLASS_NAME,
            isReelHeld
          );
        }
      };

      updatingRing();

      const unsubscribeDomOverlayFrame =
        subscribingWorldPlazaDomOverlayFrame(updatingRing);

      return () => {
        unsubscribeDomOverlayFrame();
      };
    }, [
      isMounted,
      progressRatioRef,
      reelOpportunityActiveRef,
      snapshot.isCancelling,
    ]);

    if (!isMounted) {
      return null;
    }

    return (
      <button
        ref={wrapperRef}
        type="button"
        className={`world-plaza-fishing-cast-progress-indicator world-plaza-timed-interaction-progress-indicator ${milestoneClassName}`}
        style={{
          width: `${RING_LAYOUT.ringSizePx}px`,

          height: `${RING_LAYOUT.ringSizePx}px`,

          transition: 'opacity 180ms ease-out',
        }}
        aria-label="Reel in"
        {...{
          [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true,
        }}
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
          onReelHoldStartRef.current();
        }}
        onPointerUp={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          onReelHoldEndRef.current();
        }}
        onPointerCancel={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          onReelHoldEndRef.current();
        }}
        onLostPointerCapture={() => {
          onReelHoldEndRef.current();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onReelRef.current();
        }}
      >
        <svg
          className="world-plaza-timed-interaction-progress-ring"
          width={RING_LAYOUT.ringSizePx}
          height={RING_LAYOUT.ringSizePx}
          viewBox={`0 0 ${RING_LAYOUT.ringSizePx} ${RING_LAYOUT.ringSizePx}`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="50%" x2="100%" y2="50%">
              <stop ref={gradientStartRef} offset="0%" stopColor="#ef4444" />

              <stop ref={gradientEndRef} offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          <circle
            className="world-plaza-fishing-cast-progress-ring-track"
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
            className="world-plaza-fishing-cast-progress-ring-progress"
            cx={RING_LAYOUT.ringCenterPx}
            cy={RING_LAYOUT.ringCenterPx}
            r={RING_LAYOUT.ringRadiusPx}
            fill="none"
            stroke={`url(#${gradientId})`}
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
      </button>
    );
  }
);
