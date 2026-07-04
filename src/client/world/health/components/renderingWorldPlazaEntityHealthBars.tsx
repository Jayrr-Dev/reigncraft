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
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_CRITICAL_RATIO,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_LOW_RATIO,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_WIDTH_PX,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthBarConstants';
import { resolvingWorldPlazaEntityHealthBarScreenPoint } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthBarScreenPoint';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';
import { useLayoutEffect, useRef } from 'react';

const RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BAR_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BAR_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-10 will-change-transform select-none' as const;

const RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BAR_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

export type RenderingWorldPlazaEntityHealthBarEntry = {
  userId: string;
  anchorGridX: number;
  anchorGridY: number;
  currentHealth: number;
  effectiveMaxHealth: number;
  shieldPoints: number;
  isInvincible: boolean;
  isDamageFlashing?: boolean;
};

export interface RenderingWorldPlazaEntityHealthBarsProps {
  healthBarEntries: readonly RenderingWorldPlazaEntityHealthBarEntry[];
  localUserId: string;
  localHudSnapshot: UsingWorldPlazaPlayerHealthHudSnapshot;
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

function resolvingHealthBarFillClass(healthRatio: number): string {
  if (healthRatio <= DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_CRITICAL_RATIO) {
    return 'bg-gradient-to-r from-rose-500 to-red-600';
  }

  if (healthRatio <= DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_LOW_RATIO) {
    return 'bg-gradient-to-r from-amber-400 to-orange-500';
  }

  return 'bg-gradient-to-r from-emerald-400 to-lime-500';
}

function shouldShowHealthBar(
  entry: RenderingWorldPlazaEntityHealthBarEntry
): boolean {
  const healthRatio =
    entry.effectiveMaxHealth > 0
      ? entry.currentHealth / entry.effectiveMaxHealth
      : 0;

  return (
    entry.shieldPoints > 0 ||
    healthRatio < 0.999 ||
    entry.isInvincible ||
    entry.isDamageFlashing === true
  );
}

function RenderingWorldPlazaEntityHealthBarVisual({
  entry,
  scaleStyle,
}: {
  entry: RenderingWorldPlazaEntityHealthBarEntry;
  scaleStyle: ReturnType<
    typeof computingWorldPlazaCameraZoomedDomOverlayScaleStyle
  >;
}): React.JSX.Element | null {
  if (!shouldShowHealthBar(entry)) {
    return null;
  }

  const healthRatio = Math.min(
    1,
    Math.max(
      0,
      entry.effectiveMaxHealth > 0
        ? entry.currentHealth / entry.effectiveMaxHealth
        : 0
    )
  );
  const shieldRatio =
    entry.effectiveMaxHealth > 0
      ? Math.min(1, entry.shieldPoints / entry.effectiveMaxHealth)
      : 0;
  const fillClass = resolvingHealthBarFillClass(healthRatio);

  return (
    <div
      className="pointer-events-none flex -translate-x-1/2 flex-col items-center"
      style={scaleStyle}
    >
      <div
        className={`relative overflow-hidden rounded-full border border-black/50 bg-black/70 ${
          entry.isInvincible ? 'animate-pulse' : ''
        } ${entry.isDamageFlashing ? 'brightness-125' : ''}`}
        style={{
          width: `${DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_WIDTH_PX}px`,
          height: `${DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_HEIGHT_PX}px`,
        }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-sky-300/80"
          style={{ width: `${Math.round(shieldRatio * 100)}%` }}
        />
        <div
          className={`absolute inset-y-0 left-0 ${fillClass}`}
          style={{ width: `${Math.round(healthRatio * 100)}%` }}
        />
      </div>
    </div>
  );
}

/**
 * World-anchored health bars rendered just below player name labels.
 */
export function RenderingWorldPlazaEntityHealthBars({
  healthBarEntries,
  localUserId,
  localHudSnapshot,
  playerPositionRef,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  remotePlayers,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaEntityHealthBarsProps): React.JSX.Element {
  const healthBarEntriesRef = useRef(healthBarEntries);
  const localUserIdRef = useRef(localUserId);
  const localHudSnapshotRef = useRef(localHudSnapshot);
  const remotePlayersRef = useRef(remotePlayers);
  const barElementByUserIdRef = useRef<Map<string, HTMLDivElement>>(new Map());

  healthBarEntriesRef.current = healthBarEntries;
  localUserIdRef.current = localUserId;
  localHudSnapshotRef.current = localHudSnapshot;
  remotePlayersRef.current = remotePlayers;

  useLayoutEffect(() => {
    if (healthBarEntries.length === 0) {
      return;
    }

    let isActive = true;

    const updatingBarPositions = (): void => {
      if (!isActive) {
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;

      for (const entry of healthBarEntriesRef.current) {
        const barElement = barElementByUserIdRef.current.get(entry.userId);

        if (!barElement) {
          continue;
        }

        const screenPoint = resolvingWorldPlazaEntityHealthBarScreenPoint({
          userId: entry.userId,
          anchorGridX: entry.anchorGridX,
          anchorGridY: entry.anchorGridY,
          localUserId: localUserIdRef.current,
          playerPositionRef,
          remotePlayerRegistryRef,
          playerRenderPositionRegistryRef,
          remotePlayers: remotePlayersRef.current,
          cameraOffset,
          cameraWorldZoom,
        });

        barElement.style.transform =
          computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
            screenPoint.x,
            screenPoint.y
          );
        applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
          barElement.firstElementChild as HTMLElement | null,
          cameraWorldZoom
        );
      }
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        updatingBarPositions();
      }
    );

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
    };
  }, [
    cameraOffsetRef,
    cameraWorldZoomRef,
    healthBarEntries.length,
    playerPositionRef,
    playerRenderPositionRegistryRef,
    remotePlayerRegistryRef,
  ]);

  if (healthBarEntries.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {healthBarEntries.map((entry) => {
        const resolvedEntry =
          entry.userId === localUserId
            ? {
                ...entry,
                currentHealth: localHudSnapshot.currentHealth,
                effectiveMaxHealth: localHudSnapshot.effectiveMaxHealth,
                shieldPoints: localHudSnapshot.shieldPoints,
                isInvincible: localHudSnapshot.isInvincible,
                isDamageFlashing: localHudSnapshot.isDamageFlashing,
              }
            : entry;

        return (
          <div
            key={entry.userId}
            ref={(element) => {
              if (element) {
                barElementByUserIdRef.current.set(entry.userId, element);
                return;
              }

              barElementByUserIdRef.current.delete(entry.userId);
            }}
            className={
              RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BAR_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BAR_HIDDEN_TRANSFORM,
            }}
          >
            <RenderingWorldPlazaEntityHealthBarVisual
              entry={resolvedEntry}
              scaleStyle={
                RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BAR_INITIAL_SCALE_STYLE
              }
            />
          </div>
        );
      })}
    </div>
  );
}
