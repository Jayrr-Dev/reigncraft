'use client';

import type { CommunityMemberProfileStatusKind } from '@/components/community/domains/definingCommunityMemberProfileStatus';
import { RenderingWorldPlazaGameplayHudExplanationPopover } from '@/components/world/components/renderingWorldPlazaGameplayHudExplanationPopover';
import { RenderingWorldPlazaPlayerNameLabelRowWithProfilePopover } from '@/components/world/components/renderingWorldPlazaPlayerNameLabelRowWithProfilePopover';
import { RenderingWorldPlazaStaminaBarTrack } from '@/components/world/components/renderingWorldPlazaStaminaBar';
import {
  applyingWorldPlazaCameraZoomedDomOverlayPositionToElement,
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
  computingWorldPlazaCameraZoomedDomOverlayScreenSpaceCounterScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaRemotePlayer } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  checkingWorldPlazaDomOverlayFrameShouldUpdate,
  subscribingWorldPlazaDomOverlayFrame,
} from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { RenderingWorldPlazaEntityHealthBuffIconRow } from '@/components/world/health/components/renderingWorldPlazaEntityHealthBuffIcons';
import {
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_CRITICAL_RATIO,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_EMPTY_TRACK_COLOR,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_LOW_RATIO,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_WIDTH_PX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_CARD_CLIP_EDGE_INSET_PX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_CARD_GAP_ABOVE_ICONS_PX,
  DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_CARD_GAP_BELOW_ICONS_PX,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthBarConstants';
import type { DefiningWorldPlazaEntityActiveBuffHudEntry } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import { computingWorldPlazaEntityBuffHudRemainingSeconds } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';
import {
  computingWorldPlazaEntityHealthBarSegmentCount,
  computingWorldPlazaEntityHealthBarSegmentDividerBackgroundImage,
} from '@/components/world/health/domains/listingWorldPlazaEntityHealthBarSegmentLineRatios';
import { resolvingWorldPlazaEntityHealthBarScreenPoint } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthBarScreenPoint';
import {
  resolvingWorldPlazaEntityHealthBuffCardVerticalPlacement,
  type ResolvingWorldPlazaEntityHealthBuffCardVerticalPlacement,
} from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthBuffCardVerticalPlacement';
import { resolvingWorldPlazaOverflowClipTopPx } from '@/components/world/health/domains/resolvingWorldPlazaOverflowClipTopPx';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';
import { usingWorldPlazaGameplayHudControlledPopoverDismiss } from '@/components/world/hooks/usingWorldPlazaGameplayHudPopoverOpenState';
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

const RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_FOOTER_COUNTDOWN_REFRESH_MS = 250;

const RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BAR_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BAR_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-10 select-none contain-layout contain-style' as const;

const RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BAR_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

const RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BAR_TRACK_CLASS_NAME =
  'relative overflow-hidden rounded-[2px] border border-black/90 shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]' as const;

const RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BAR_SHIELD_OVERLAY_CLASS_NAME =
  'absolute inset-y-0 z-[1] bg-gradient-to-r from-sky-400/90 to-sky-300/95' as const;

type RenderingWorldPlazaEntityHealthBarOverlayMotionSnapshot = {
  cameraX: number;
  cameraY: number;
  zoomKey: number;
  localX: number;
  localY: number;
};

export type RenderingWorldPlazaEntityHealthBarEntry = {
  userId: string;
  anchorGridX: number;
  anchorGridY: number;
  currentHealth: number;
  effectiveMaxHealth: number;
  shieldPoints: number;
  isInvincible: boolean;
  isDamageFlashing?: boolean;
  displayName?: string | null;
  avatarUrl?: string | null;
  profileStatusKind?: CommunityMemberProfileStatusKind | null;
};

export type RenderingWorldPlazaEntityHealthBarLocalStaminaHud = {
  staminaRatio: number;
  isRunning: boolean;
  isDepleted: boolean;
};

export interface RenderingWorldPlazaEntityHealthBarsProps {
  healthBarEntries: readonly RenderingWorldPlazaEntityHealthBarEntry[];
  localUserId: string;
  localHudSnapshot: UsingWorldPlazaPlayerHealthHudSnapshot;
  localStaminaHud?: RenderingWorldPlazaEntityHealthBarLocalStaminaHud | null;
  /** When false, hides the health track but can still show stamina. */
  isHealthTrackVisible?: boolean;
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

function resolvingHealthBarFillStyle(healthRatio: number): {
  backgroundColor: string;
  boxShadow: string;
} {
  if (healthRatio <= DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_CRITICAL_RATIO) {
    return {
      backgroundColor: '#8f1010',
      boxShadow: 'inset 0 1px 0 rgba(255,120,120,0.35)',
    };
  }

  if (healthRatio <= DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_LOW_RATIO) {
    return {
      backgroundColor: '#c45c12',
      boxShadow: 'inset 0 1px 0 rgba(255,190,120,0.35)',
    };
  }

  return {
    backgroundColor: '#1f9b3f',
    boxShadow: 'inset 0 1px 0 rgba(180,255,200,0.35)',
  };
}

function checkingWorldPlazaEntityHealthBarOverlayMotionActive(
  previous: RenderingWorldPlazaEntityHealthBarOverlayMotionSnapshot | null,
  next: RenderingWorldPlazaEntityHealthBarOverlayMotionSnapshot
): boolean {
  if (previous === null) {
    return true;
  }

  return (
    previous.cameraX !== next.cameraX ||
    previous.cameraY !== next.cameraY ||
    previous.zoomKey !== next.zoomKey ||
    previous.localX !== next.localX ||
    previous.localY !== next.localY
  );
}

function computingWorldPlazaEntityHealthBarOverlayMotionSnapshot(
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number,
  localPosition: DefiningWorldPlazaWorldPoint | null | undefined
): RenderingWorldPlazaEntityHealthBarOverlayMotionSnapshot {
  return {
    cameraX: Math.round(cameraOffset.x),
    cameraY: Math.round(cameraOffset.y),
    zoomKey: Math.round(cameraWorldZoom * 1000),
    localX: localPosition ? Math.round(localPosition.x * 100) : 0,
    localY: localPosition ? Math.round(localPosition.y * 100) : 0,
  };
}

function areWorldPlazaEntityHealthBarEntriesEqual(
  previous: readonly RenderingWorldPlazaEntityHealthBarEntry[],
  next: readonly RenderingWorldPlazaEntityHealthBarEntry[]
): boolean {
  if (previous === next) {
    return true;
  }

  if (previous.length !== next.length) {
    return false;
  }

  for (let index = 0; index < previous.length; index += 1) {
    const left = previous[index];
    const right = next[index];

    if (
      left.userId !== right.userId ||
      left.anchorGridX !== right.anchorGridX ||
      left.anchorGridY !== right.anchorGridY ||
      left.currentHealth !== right.currentHealth ||
      left.effectiveMaxHealth !== right.effectiveMaxHealth ||
      left.shieldPoints !== right.shieldPoints ||
      left.isInvincible !== right.isInvincible ||
      left.isDamageFlashing !== right.isDamageFlashing ||
      left.displayName !== right.displayName ||
      left.avatarUrl !== right.avatarUrl ||
      left.profileStatusKind !== right.profileStatusKind
    ) {
      return false;
    }
  }

  return true;
}

function areWorldPlazaEntityHealthBarActiveBuffsEqual(
  previous: readonly DefiningWorldPlazaEntityActiveBuffHudEntry[],
  next: readonly DefiningWorldPlazaEntityActiveBuffHudEntry[]
): boolean {
  if (previous === next) {
    return true;
  }

  if (previous.length !== next.length) {
    return false;
  }

  for (let index = 0; index < previous.length; index += 1) {
    const left = previous[index];
    const right = next[index];

    if (
      left.id !== right.id ||
      left.expiresAtMs !== right.expiresAtMs ||
      left.label !== right.label ||
      left.description !== right.description ||
      left.severityLabel !== right.severityLabel ||
      (left.detailLines?.join('\0') ?? '') !==
        (right.detailLines?.join('\0') ?? '')
    ) {
      return false;
    }
  }

  return true;
}

function areWorldPlazaEntityHealthBarsPropsEqual(
  previous: RenderingWorldPlazaEntityHealthBarsProps,
  next: RenderingWorldPlazaEntityHealthBarsProps
): boolean {
  if (
    previous.localUserId !== next.localUserId ||
    previous.isHealthTrackVisible !== next.isHealthTrackVisible ||
    previous.playerPositionRef !== next.playerPositionRef ||
    previous.remotePlayerRegistryRef !== next.remotePlayerRegistryRef ||
    previous.playerRenderPositionRegistryRef !==
      next.playerRenderPositionRegistryRef ||
    previous.cameraOffsetRef !== next.cameraOffsetRef ||
    previous.cameraWorldZoomRef !== next.cameraWorldZoomRef ||
    previous.remotePlayers !== next.remotePlayers
  ) {
    return false;
  }

  const previousStamina = previous.localStaminaHud ?? null;
  const nextStamina = next.localStaminaHud ?? null;

  if (previousStamina !== nextStamina) {
    if (previousStamina === null || nextStamina === null) {
      return false;
    }

    if (
      previousStamina.staminaRatio !== nextStamina.staminaRatio ||
      previousStamina.isRunning !== nextStamina.isRunning ||
      previousStamina.isDepleted !== nextStamina.isDepleted
    ) {
      return false;
    }
  }

  const previousHud = previous.localHudSnapshot;
  const nextHud = next.localHudSnapshot;

  if (
    previousHud.currentHealth !== nextHud.currentHealth ||
    previousHud.effectiveMaxHealth !== nextHud.effectiveMaxHealth ||
    previousHud.shieldPoints !== nextHud.shieldPoints ||
    previousHud.isInvincible !== nextHud.isInvincible ||
    previousHud.isDamageFlashing !== nextHud.isDamageFlashing ||
    !areWorldPlazaEntityHealthBarActiveBuffsEqual(
      previousHud.activeBuffs,
      nextHud.activeBuffs
    )
  ) {
    return false;
  }

  return areWorldPlazaEntityHealthBarEntriesEqual(
    previous.healthBarEntries,
    next.healthBarEntries
  );
}

const RenderingWorldPlazaEntityHealthBarSegmentGrid = memo(
  function RenderingWorldPlazaEntityHealthBarSegmentGrid({
    segmentCount,
  }: {
    segmentCount: number;
  }): React.JSX.Element {
    const backgroundImage =
      computingWorldPlazaEntityHealthBarSegmentDividerBackgroundImage(
        segmentCount
      );

    if (backgroundImage === null) {
      return <></>;
    }

    return (
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ backgroundImage }}
      />
    );
  }
);

const RenderingWorldPlazaEntityHealthBarVitals = memo(
  function RenderingWorldPlazaEntityHealthBarVitals({
    entry,
    localStaminaHud,
    isHealthTrackVisible = true,
  }: {
    entry: RenderingWorldPlazaEntityHealthBarEntry;
    localStaminaHud?: RenderingWorldPlazaEntityHealthBarLocalStaminaHud | null;
    isHealthTrackVisible?: boolean;
  }): React.JSX.Element {
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
    const shieldOnHpRatio = Math.min(shieldRatio, healthRatio);
    const shieldExtensionRatio = Math.max(
      0,
      Math.min(shieldRatio - shieldOnHpRatio, 1 - healthRatio)
    );
    const shieldVisualRatio = shieldOnHpRatio + shieldExtensionRatio;
    const shieldVisualLeft = healthRatio - shieldOnHpRatio;
    const fillStyle = resolvingHealthBarFillStyle(healthRatio);
    const hasShieldOverlay = entry.shieldPoints > 0 && shieldVisualRatio > 0;
    const segmentCount = computingWorldPlazaEntityHealthBarSegmentCount(
      entry.effectiveMaxHealth
    );

    return (
      <>
        {isHealthTrackVisible ? (
          <div
            className={`${RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BAR_TRACK_CLASS_NAME} ${
              entry.isInvincible ? 'animate-pulse' : ''
            } ${entry.isDamageFlashing ? 'brightness-125' : ''}`}
            style={{
              width: `${DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_WIDTH_PX}px`,
              height: `${DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_HEIGHT_PX}px`,
              backgroundColor:
                DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_EMPTY_TRACK_COLOR,
            }}
          >
            <div
              className="absolute inset-y-0 left-0 z-0"
              style={{
                width: `${Math.round(healthRatio * 100)}%`,
                backgroundColor: fillStyle.backgroundColor,
                boxShadow: fillStyle.boxShadow,
              }}
            />
            {hasShieldOverlay ? (
              <div
                className={
                  RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BAR_SHIELD_OVERLAY_CLASS_NAME
                }
                style={{
                  left: `${Math.round(shieldVisualLeft * 100)}%`,
                  width: `${Math.round(shieldVisualRatio * 100)}%`,
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.45), 0 0 4px rgba(56,189,248,0.35)',
                }}
              />
            ) : null}
            <RenderingWorldPlazaEntityHealthBarSegmentGrid
              segmentCount={segmentCount}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[45%] bg-white/10" />
          </div>
        ) : null}

        {localStaminaHud ? (
          <RenderingWorldPlazaStaminaBarTrack
            staminaRatio={localStaminaHud.staminaRatio}
            isRunning={localStaminaHud.isRunning}
            isDepleted={localStaminaHud.isDepleted}
          />
        ) : null}
      </>
    );
  }
);

const RenderingWorldPlazaEntityHealthBarVisual = memo(
  function RenderingWorldPlazaEntityHealthBarVisual({
    entry,
    localUserId,
    scaleStyle,
    activeBuffs,
    localStaminaHud,
    isHealthTrackVisible = true,
  }: {
    entry: RenderingWorldPlazaEntityHealthBarEntry;
    localUserId: string;
    scaleStyle: ReturnType<
      typeof computingWorldPlazaCameraZoomedDomOverlayScaleStyle
    >;
    activeBuffs?: readonly DefiningWorldPlazaEntityActiveBuffHudEntry[];
    localStaminaHud?: RenderingWorldPlazaEntityHealthBarLocalStaminaHud | null;
    isHealthTrackVisible?: boolean;
  }): React.JSX.Element {
    const [openBuffId, setOpenBuffId] = useState<string | null>(null);
    const [buffCardPlacement, setBuffCardPlacement] =
      useState<ResolvingWorldPlazaEntityHealthBuffCardVerticalPlacement>(
        'above'
      );
    const hudContainerRef = useRef<HTMLDivElement>(null);
    const buffCardRef = useRef<HTMLDivElement>(null);
    const openBuff =
      activeBuffs?.find((buff) => buff.id === openBuffId) ?? null;
    const [openBuffPopoverFooter, setOpenBuffPopoverFooter] = useState<
      string | null
    >(null);
    const closingOpenBuff = useCallback(() => {
      setOpenBuffId(null);
    }, []);

    useEffect(() => {
      if (openBuff === null || openBuff.expiresAtMs === null) {
        setOpenBuffPopoverFooter(null);
        return;
      }

      const expiresAtMs = openBuff.expiresAtMs;
      const isDisease = openBuff.isDisease === true;

      const publishingFooter = (): void => {
        const remainingSeconds =
          computingWorldPlazaEntityBuffHudRemainingSeconds(
            expiresAtMs,
            performance.now(),
            { isDisease }
          );
        setOpenBuffPopoverFooter(
          remainingSeconds !== null ? `${remainingSeconds}s remaining` : null
        );
      };

      publishingFooter();
      const intervalId = window.setInterval(
        publishingFooter,
        RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_FOOTER_COUNTDOWN_REFRESH_MS
      );

      return () => {
        window.clearInterval(intervalId);
      };
    }, [openBuff?.expiresAtMs, openBuff?.isDisease, openBuffId]);

    usingWorldPlazaGameplayHudControlledPopoverDismiss(
      hudContainerRef,
      openBuffId !== null,
      closingOpenBuff
    );

    useLayoutEffect(() => {
      setBuffCardPlacement('above');
    }, [openBuffId]);

    useLayoutEffect(() => {
      if (
        openBuffId === null ||
        openBuff === null ||
        buffCardPlacement !== 'above' ||
        buffCardRef.current === null
      ) {
        return;
      }

      const nextPlacement =
        resolvingWorldPlazaEntityHealthBuffCardVerticalPlacement({
          preferredPlacement: 'above',
          popoverTopPx: buffCardRef.current.getBoundingClientRect().top,
          clipTopPx: resolvingWorldPlazaOverflowClipTopPx(buffCardRef.current),
          edgeInsetPx:
            DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_CARD_CLIP_EDGE_INSET_PX,
        });

      if (nextPlacement !== buffCardPlacement) {
        setBuffCardPlacement(nextPlacement);
      }
    }, [
      buffCardPlacement,
      openBuff,
      openBuff?.description,
      openBuff?.detailLines,
      openBuffId,
      openBuffPopoverFooter,
    ]);

    const isFullHealth =
      entry.effectiveMaxHealth > 0 &&
      entry.currentHealth / entry.effectiveMaxHealth >= 0.999 &&
      entry.shieldPoints <= 0 &&
      !entry.isInvincible &&
      entry.isDamageFlashing !== true;

    const hasNameLabel =
      entry.displayName !== null &&
      entry.displayName !== undefined &&
      entry.displayName.length > 0;

    const openBuffCard =
      openBuff === null ? null : (
        <div
          ref={buffCardRef}
          className="pointer-events-auto absolute left-1/2 z-50"
          style={{
            ...computingWorldPlazaCameraZoomedDomOverlayScreenSpaceCounterScaleStyle(
              buffCardPlacement
            ),
            ...(buffCardPlacement === 'above'
              ? {
                  bottom: '100%',
                  marginBottom: `${DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_CARD_GAP_ABOVE_ICONS_PX}px`,
                }
              : {
                  top: '100%',
                  marginTop: `${DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_CARD_GAP_BELOW_ICONS_PX}px`,
                }),
          }}
        >
          <RenderingWorldPlazaGameplayHudExplanationPopover
            title={openBuff.label}
            subtitle={
              openBuff.isDisease === true
                ? (openBuff.severityLabel ?? null)
                : null
            }
            description={openBuff.description}
            detailLines={openBuff.detailLines ?? []}
            footer={openBuffPopoverFooter}
            placement="inline"
          />
        </div>
      );

    return (
      <div ref={hudContainerRef} className="relative pointer-events-none">
        <div
          className="flex flex-col items-center gap-px"
          style={{
            ...scaleStyle,
            opacity: isFullHealth ? 0.92 : 1,
          }}
        >
          {activeBuffs !== undefined ? (
            <div className="relative flex flex-col items-center">
              {openBuffCard}
              <RenderingWorldPlazaEntityHealthBuffIconRow
                activeBuffs={activeBuffs}
                openBuffId={openBuffId}
                onOpenBuffIdChange={setOpenBuffId}
              />
            </div>
          ) : null}

          {hasNameLabel ? (
            <RenderingWorldPlazaPlayerNameLabelRowWithProfilePopover
              userId={entry.userId}
              displayName={entry.displayName ?? ''}
              profileStatusKind={entry.profileStatusKind ?? null}
              avatarUrl={entry.avatarUrl ?? null}
              opensProfilePopover={entry.userId !== localUserId}
              scaleStyle={scaleStyle}
              layout="compact"
            />
          ) : null}

          <RenderingWorldPlazaEntityHealthBarVitals
            entry={entry}
            localStaminaHud={
              entry.userId === localUserId ? localStaminaHud : null
            }
            isHealthTrackVisible={isHealthTrackVisible}
          />
        </div>
      </div>
    );
  }
);

/**
 * World-anchored health bars rendered centered above player avatars.
 */
export const RenderingWorldPlazaEntityHealthBars = memo(
  function RenderingWorldPlazaEntityHealthBars({
    healthBarEntries,
    localUserId,
    localHudSnapshot,
    localStaminaHud = null,
    isHealthTrackVisible = true,
    playerPositionRef,
    remotePlayerRegistryRef,
    playerRenderPositionRegistryRef,
    remotePlayers,
    cameraOffsetRef,
    cameraWorldZoomRef,
  }: RenderingWorldPlazaEntityHealthBarsProps): React.JSX.Element {
    const healthBarEntriesRef = useRef(healthBarEntries);
    const localUserIdRef = useRef(localUserId);
    const remotePlayersRef = useRef(remotePlayers);
    const barElementByUserIdRef = useRef<Map<string, HTMLDivElement>>(
      new Map()
    );
    const scaleElementByUserIdRef = useRef<Map<string, HTMLElement>>(new Map());
    const lastUpdateTimeMsRef = useRef(0);
    const lastMotionSnapshotRef =
      useRef<RenderingWorldPlazaEntityHealthBarOverlayMotionSnapshot | null>(
        null
      );

    healthBarEntriesRef.current = healthBarEntries;
    localUserIdRef.current = localUserId;
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
        const quantizedWorldZoom = Math.round(cameraWorldZoom * 1000) / 1000;

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

          applyingWorldPlazaCameraZoomedDomOverlayPositionToElement(
            barElement,
            screenPoint.x,
            screenPoint.y
          );

          let scaleElement = scaleElementByUserIdRef.current.get(entry.userId);

          if (!scaleElement || !barElement.contains(scaleElement)) {
            scaleElement =
              (barElement.firstElementChild
                ?.firstElementChild as HTMLElement | null) ?? undefined;

            if (scaleElement) {
              scaleElementByUserIdRef.current.set(entry.userId, scaleElement);
            } else {
              scaleElementByUserIdRef.current.delete(entry.userId);
            }
          }

          applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
            scaleElement,
            quantizedWorldZoom
          );
        }
      };

      const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
        (_deltaMs, frameTimeMs) => {
          if (!isActive) {
            return;
          }

          const cameraOffset = cameraOffsetRef.current;
          const cameraWorldZoom = cameraWorldZoomRef.current;
          const motionSnapshot =
            computingWorldPlazaEntityHealthBarOverlayMotionSnapshot(
              cameraOffset,
              cameraWorldZoom,
              playerPositionRef.current
            );
          const isOverlayMotionActive =
            checkingWorldPlazaEntityHealthBarOverlayMotionActive(
              lastMotionSnapshotRef.current,
              motionSnapshot
            );

          if (
            !checkingWorldPlazaDomOverlayFrameShouldUpdate(
              0,
              lastUpdateTimeMsRef.current,
              frameTimeMs,
              isOverlayMotionActive
            )
          ) {
            return;
          }

          lastMotionSnapshotRef.current = motionSnapshot;
          lastUpdateTimeMsRef.current = frameTimeMs;
          updatingBarPositions();
        }
      );

      return () => {
        isActive = false;
        unsubscribeDomOverlayFrame();
        scaleElementByUserIdRef.current.clear();
        lastUpdateTimeMsRef.current = 0;
        lastMotionSnapshotRef.current = null;
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
                scaleElementByUserIdRef.current.delete(entry.userId);
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
                localUserId={localUserId}
                scaleStyle={
                  RENDERING_WORLD_PLAZA_ENTITY_HEALTH_BAR_INITIAL_SCALE_STYLE
                }
                activeBuffs={
                  entry.userId === localUserId
                    ? localHudSnapshot.activeBuffs
                    : undefined
                }
                localStaminaHud={
                  entry.userId === localUserId ? localStaminaHud : null
                }
                isHealthTrackVisible={isHealthTrackVisible}
              />
            </div>
          );
        })}
      </div>
    );
  },
  areWorldPlazaEntityHealthBarsPropsEqual
);
