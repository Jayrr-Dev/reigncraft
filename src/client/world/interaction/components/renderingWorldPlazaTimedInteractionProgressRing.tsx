'use client';

import { Icon } from '@/components/ui/icon';
import {
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_ICON_SIZE_PX,
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_SIZE_PX,
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_STROKE_PX,
} from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressConstants';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';

export type RenderingWorldPlazaTimedInteractionProgressRingProps = {
  readonly snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
};

/**
 * Minimal depleting ring with an optional center icon beside a world interaction label.
 */
export function RenderingWorldPlazaTimedInteractionProgressRing({
  snapshot,
}: RenderingWorldPlazaTimedInteractionProgressRingProps): React.JSX.Element | null {
  const isVisible =
    snapshot.isActive || snapshot.isCancelling || snapshot.progressRatio > 0;

  if (!isVisible) {
    return null;
  }

  const ringSizePx =
    DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_SIZE_PX;
  const ringRadiusPx =
    (ringSizePx -
      DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_STROKE_PX) /
    2;
  const ringCenterPx = ringSizePx / 2;
  const ringCircumferencePx = 2 * Math.PI * ringRadiusPx;
  const remainingRatio = 1 - snapshot.progressRatio;
  const milestoneClassName = snapshot.milestonePulse
    ? `world-plaza-timed-interaction-progress-pulse world-plaza-timed-interaction-progress-pulse--${snapshot.milestonePulse}`
    : '';

  return (
    <div
      key={snapshot.pulseGeneration}
      className={`world-plaza-timed-interaction-progress-indicator ${milestoneClassName}`}
      style={{
        width: `${ringSizePx}px`,
        height: `${ringSizePx}px`,
        opacity: snapshot.isCancelling ? 0 : 1,
        transition: 'opacity 180ms ease-out',
      }}
      aria-hidden="true"
    >
      <svg
        className="world-plaza-timed-interaction-progress-ring"
        width={ringSizePx}
        height={ringSizePx}
        viewBox={`0 0 ${ringSizePx} ${ringSizePx}`}
        aria-hidden="true"
      >
        <circle
          className="world-plaza-timed-interaction-progress-ring-track"
          cx={ringCenterPx}
          cy={ringCenterPx}
          r={ringRadiusPx}
          fill="none"
          strokeWidth={
            DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_STROKE_PX
          }
        />
        <circle
          className="world-plaza-timed-interaction-progress-ring-progress"
          cx={ringCenterPx}
          cy={ringCenterPx}
          r={ringRadiusPx}
          fill="none"
          strokeWidth={
            DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_RING_STROKE_PX
          }
          strokeDasharray={`${ringCircumferencePx}`}
          strokeDashoffset={`${ringCircumferencePx * (1 - remainingRatio)}`}
          transform={`rotate(-90 ${ringCenterPx} ${ringCenterPx})`}
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
