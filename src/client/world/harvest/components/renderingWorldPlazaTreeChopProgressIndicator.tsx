'use client';

import {
  DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_SIZE_PX,
  DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_STROKE_PX,
} from '@/components/world/harvest/domains/definingWorldPlazaTreeChopProgressConstants';
import type { UsingWorldPlazaTreeChopProgressSnapshot } from '@/components/world/harvest/hooks/usingWorldPlazaTreeChopProgress';

export type RenderingWorldPlazaTreeChopProgressRingProps = {
  readonly snapshot: UsingWorldPlazaTreeChopProgressSnapshot;
};

/**
 * Minimal depleting ring shown beside the Chop label while chopping.
 */
export function RenderingWorldPlazaTreeChopProgressRing({
  snapshot,
}: RenderingWorldPlazaTreeChopProgressRingProps): React.JSX.Element | null {
  const isVisible =
    snapshot.isActive || snapshot.isCancelling || snapshot.progressRatio > 0;

  if (!isVisible) {
    return null;
  }

  const ringSizePx = DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_SIZE_PX;
  const ringRadiusPx =
    (ringSizePx - DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_STROKE_PX) / 2;
  const ringCenterPx = ringSizePx / 2;
  const ringCircumferencePx = 2 * Math.PI * ringRadiusPx;
  const remainingRatio = 1 - snapshot.progressRatio;
  const milestoneClassName = snapshot.milestonePulse
    ? `world-plaza-tree-chop-progress-pulse world-plaza-tree-chop-progress-pulse--${snapshot.milestonePulse}`
    : '';

  return (
    <div
      key={snapshot.pulseGeneration}
      className={`world-plaza-tree-chop-progress-indicator ${milestoneClassName}`}
      style={{
        width: `${ringSizePx}px`,
        height: `${ringSizePx}px`,
        opacity: snapshot.isCancelling ? 0 : 1,
        transition: 'opacity 180ms ease-out',
      }}
      aria-hidden="true"
    >
      <svg
        className="world-plaza-tree-chop-progress-ring"
        width={ringSizePx}
        height={ringSizePx}
        viewBox={`0 0 ${ringSizePx} ${ringSizePx}`}
        aria-hidden="true"
      >
        <circle
          className="world-plaza-tree-chop-progress-ring-track"
          cx={ringCenterPx}
          cy={ringCenterPx}
          r={ringRadiusPx}
          fill="none"
          strokeWidth={DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_STROKE_PX}
        />
        <circle
          className="world-plaza-tree-chop-progress-ring-progress"
          cx={ringCenterPx}
          cy={ringCenterPx}
          r={ringRadiusPx}
          fill="none"
          strokeWidth={DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_STROKE_PX}
          strokeDasharray={`${ringCircumferencePx}`}
          strokeDashoffset={`${ringCircumferencePx * (1 - remainingRatio)}`}
          transform={`rotate(-90 ${ringCenterPx} ${ringCenterPx})`}
        />
      </svg>
    </div>
  );
}
