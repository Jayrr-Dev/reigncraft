'use client';

import { Icon } from '@/components/ui/icon';
import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaRemotePlayer } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import {
  DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_OFFSET_ABOVE_AVATAR_PX,
  DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_SIZE_PX,
} from '@/components/world/harvest/domains/definingWorldPlazaTreeChopProgressConstants';
import type { UsingWorldPlazaTreeChopProgressSnapshot } from '@/components/world/harvest/hooks/usingWorldPlazaTreeChopProgress';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_OFFSET_ABOVE_AVATAR_PX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextConstants';
import { resolvingWorldPlazaEntityHealthFloatTextScreenPoint } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthFloatTextScreenPoint';
import { useLayoutEffect, useRef } from 'react';

const RENDERING_WORLD_PLAZA_TREE_CHOP_PROGRESS_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_TREE_CHOP_PROGRESS_WRAPPER_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-20 will-change-transform select-none' as const;

const RENDERING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_STROKE_PX = 3;

export type RenderingWorldPlazaTreeChopProgressIndicatorProps = {
  readonly localUserId: string;
  readonly snapshot: UsingWorldPlazaTreeChopProgressSnapshot;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly remotePlayerRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >;
  readonly playerRenderPositionRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
  readonly remotePlayers: readonly DefiningWorldPlazaRemotePlayer[];
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
};

/**
 * Depleting axe progress ring shown above the local player while chopping.
 */
export function RenderingWorldPlazaTreeChopProgressIndicator({
  localUserId,
  snapshot,
  playerPositionRef,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  remotePlayers,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaTreeChopProgressIndicatorProps): React.JSX.Element | null {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<SVGCircleElement | null>(null);
  const snapshotRef = useRef(snapshot);
  const remotePlayersRef = useRef(remotePlayers);

  snapshotRef.current = snapshot;
  remotePlayersRef.current = remotePlayers;

  const isVisible =
    snapshot.isActive || snapshot.isCancelling || snapshot.progressRatio > 0;

  useLayoutEffect(() => {
    if (!isVisible) {
      return;
    }

    let isActive = true;
    const ringSizePx = DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_SIZE_PX;
    const ringRadiusPx =
      (ringSizePx - RENDERING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_STROKE_PX) /
      2;
    const ringCircumferencePx = 2 * Math.PI * ringRadiusPx;

    const updatingIndicator = (): void => {
      if (!isActive) {
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;
      const wrapperElement = wrapperRef.current;
      const ringElement = ringRef.current;
      const currentSnapshot = snapshotRef.current;

      if (!cameraOffset || !wrapperElement) {
        return;
      }

      const screenPoint = resolvingWorldPlazaEntityHealthFloatTextScreenPoint({
        userId: localUserId,
        anchorGridX: playerPositionRef.current?.x ?? 0,
        anchorGridY: playerPositionRef.current?.y ?? 0,
        localUserId,
        playerPositionRef,
        remotePlayerRegistryRef,
        playerRenderPositionRegistryRef,
        remotePlayers: remotePlayersRef.current,
        cameraOffset,
        cameraWorldZoom,
        stackIndex: 0,
      });

      const offsetAboveAvatarPx =
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_OFFSET_ABOVE_AVATAR_PX +
        DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_OFFSET_ABOVE_AVATAR_PX;

      wrapperElement.style.transform =
        computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
          screenPoint.x,
          screenPoint.y - offsetAboveAvatarPx
        );
      wrapperElement.style.opacity = currentSnapshot.isCancelling ? '0' : '1';

      if (ringElement) {
        const remainingRatio = 1 - currentSnapshot.progressRatio;
        ringElement.style.strokeDasharray = `${ringCircumferencePx}`;
        ringElement.style.strokeDashoffset = `${ringCircumferencePx * (1 - remainingRatio)}`;
      }

      applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
        wrapperElement,
        cameraWorldZoom
      );
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        updatingIndicator();
      }
    );

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
    };
  }, [
    cameraOffsetRef,
    cameraWorldZoomRef,
    isVisible,
    localUserId,
    playerPositionRef,
    playerRenderPositionRegistryRef,
    remotePlayerRegistryRef,
  ]);

  if (!isVisible) {
    return null;
  }

  const ringSizePx = DEFINING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_SIZE_PX;
  const ringRadiusPx =
    (ringSizePx - RENDERING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_STROKE_PX) / 2;
  const ringCenterPx = ringSizePx / 2;
  const milestoneClassName = snapshot.milestonePulse
    ? `world-plaza-tree-chop-progress-pulse world-plaza-tree-chop-progress-pulse--${snapshot.milestonePulse}`
    : '';

  return (
    <div
      ref={wrapperRef}
      className={RENDERING_WORLD_PLAZA_TREE_CHOP_PROGRESS_WRAPPER_CLASS_NAME}
      style={{
        transform: RENDERING_WORLD_PLAZA_TREE_CHOP_PROGRESS_HIDDEN_TRANSFORM,
        transition: 'opacity 180ms ease-out',
      }}
      aria-hidden="true"
    >
      <div
        key={snapshot.pulseGeneration}
        className={`world-plaza-tree-chop-progress-indicator ${milestoneClassName}`}
        style={{
          width: `${ringSizePx}px`,
          height: `${ringSizePx}px`,
        }}
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
            strokeWidth={
              RENDERING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_STROKE_PX
            }
          />
          <circle
            ref={ringRef}
            className="world-plaza-tree-chop-progress-ring-progress"
            cx={ringCenterPx}
            cy={ringCenterPx}
            r={ringRadiusPx}
            fill="none"
            strokeWidth={
              RENDERING_WORLD_PLAZA_TREE_CHOP_PROGRESS_RING_STROKE_PX
            }
            transform={`rotate(-90 ${ringCenterPx} ${ringCenterPx})`}
          />
        </svg>
        <Icon
          icon="game-icons:wood-axe"
          className="world-plaza-tree-chop-progress-icon"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
