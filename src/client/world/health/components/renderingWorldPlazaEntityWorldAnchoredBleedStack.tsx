'use client';

import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaRemotePlayer } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { RenderingWorldPlazaEntityStatusEffectHudRowBadge } from '@/components/world/health/components/renderingWorldPlazaEntityStatusEffectHudRowBadge';
import type { DefiningWorldPlazaEntityStatusEffectHudRow } from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectHudRowTypes';
import { resolvingWorldPlazaEntityWorldAnchoredBleedStackScreenPoint } from '@/components/world/health/domains/resolvingWorldPlazaEntityWorldAnchoredBleedStackScreenPoint';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const RENDERING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_BLEED_STACK_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_BLEED_STACK_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-10 will-change-transform select-none' as const;

const RENDERING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_BLEED_STACK_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

function usingWorldPlazaEntityWorldAnchoredBleedStackNowMs(
  isVisible: boolean
): number {
  const [nowMs, setNowMs] = useState(() => performance.now());

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNowMs(performance.now());
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isVisible]);

  return nowMs;
}

export interface RenderingWorldPlazaEntityWorldAnchoredBleedStackProps {
  localUserId: string;
  anchorGridX: number;
  anchorGridY: number;
  bleedRow: DefiningWorldPlazaEntityStatusEffectHudRow | null;
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  remotePlayerRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >;
  playerRenderPositionRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
  remotePlayers: readonly DefiningWorldPlazaRemotePlayer[];
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  cameraWorldZoomRef: React.RefObject<number>;
}

/**
 * Bleed stack plaque anchored above the local player's avatar head.
 */
export function RenderingWorldPlazaEntityWorldAnchoredBleedStack({
  localUserId,
  anchorGridX,
  anchorGridY,
  bleedRow,
  playerPositionRef,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  remotePlayers,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaEntityWorldAnchoredBleedStackProps): React.JSX.Element {
  const bleedRowRef = useRef(bleedRow);
  const remotePlayersRef = useRef(remotePlayers);
  const wrapperElementRef = useRef<HTMLDivElement | null>(null);
  const nowMs = usingWorldPlazaEntityWorldAnchoredBleedStackNowMs(
    bleedRow !== null
  );

  bleedRowRef.current = bleedRow;
  remotePlayersRef.current = remotePlayers;

  useLayoutEffect(() => {
    if (bleedRow === null) {
      return;
    }

    let isActive = true;

    const updatingBleedStackPosition = (): void => {
      if (!isActive || bleedRowRef.current === null) {
        return;
      }

      const wrapperElement = wrapperElementRef.current;

      if (!wrapperElement) {
        return;
      }

      const screenPoint =
        resolvingWorldPlazaEntityWorldAnchoredBleedStackScreenPoint({
          userId: localUserId,
          anchorGridX,
          anchorGridY,
          localUserId,
          playerPositionRef,
          remotePlayerRegistryRef,
          playerRenderPositionRegistryRef,
          remotePlayers: remotePlayersRef.current,
          cameraOffset: cameraOffsetRef.current,
          cameraWorldZoom: cameraWorldZoomRef.current,
        });

      wrapperElement.style.transform =
        computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
          screenPoint.x,
          screenPoint.y
        );
      applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
        wrapperElement.firstElementChild as HTMLElement | null,
        cameraWorldZoomRef.current
      );
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        updatingBleedStackPosition();
      }
    );

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
    };
  }, [
    anchorGridX,
    anchorGridY,
    bleedRow,
    cameraOffsetRef,
    cameraWorldZoomRef,
    localUserId,
    playerPositionRef,
    playerRenderPositionRegistryRef,
    remotePlayerRegistryRef,
  ]);

  if (bleedRow === null) {
    return <></>;
  }

  return (
    <div
      ref={wrapperElementRef}
      className={
        RENDERING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_BLEED_STACK_WRAPPER_CLASS_NAME
      }
      style={{
        transform:
          RENDERING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_BLEED_STACK_HIDDEN_TRANSFORM,
      }}
    >
      <div
        style={
          RENDERING_WORLD_PLAZA_ENTITY_WORLD_ANCHORED_BLEED_STACK_INITIAL_SCALE_STYLE
        }
      >
        <RenderingWorldPlazaEntityStatusEffectHudRowBadge
          row={bleedRow}
          nowMs={nowMs}
        />
      </div>
    </div>
  );
}
