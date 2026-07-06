'use client';

/**
 * Renders live wildlife instances and advances simulation inside Pixi Application.
 *
 * @module components/world/wildlife/components/renderingWildlifeLayer
 */

import { RenderingWorldPlazaDeclarativeAnimatedSprite } from '@/components/world/animation/components/renderingWorldPlazaDeclarativeAnimatedSprite';
import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET } from '@/components/world/depth';
import { resolvingWorldDepthAvatarBodySortKey } from '@/components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { updatingWorldPlazaAvatarGroundShadowGraphics } from '@/components/world/domains/drawingWorldPlazaAvatarGroundShadowOnGraphics';
import {
  advancingWildlifeSimulationTick,
  applyingWildlifeInstanceDamage,
} from '@/components/world/wildlife/domains/advancingWildlifeSimulationTick';
import {
  computingWildlifeGroundShadowFootOffsetBelowGridAnchorPx,
  computingWildlifeGroundShadowSizeScale,
} from '@/components/world/wildlife/domains/computingWildlifeGroundShadowLayout';
import type { DefiningWildlifeSimulationTickConfig } from '@/components/world/wildlife/domains/definingWildlifeSimulationTickConfig';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeMotionClipKind } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetLayout';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { electingWildlifeSimulationLeaderUserId } from '@/components/world/wildlife/domains/electingWildlifeSimulationLeaderUserId';
import { loadingWildlifeSpeciesTextures } from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { listingWildlifeInstances } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  ensuringWildlifeAnimationClipsRegistered,
  formattingWildlifeAnimationClipId,
} from '@/components/world/wildlife/domains/registeringWildlifeAnimationClips';
import { resolvingWildlifeInstanceSizeScale } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { computingWildlifeJumpArcLiftPx } from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
import { resolvingWildlifeInstanceStandingLayerAtPoint } from '@/components/world/wildlife/domains/syncingWildlifeInstanceStandingLayer';
import { useTick } from '@pixi/react';
import type { Graphics } from 'pixi.js';
import { memo, useRef, useState } from 'react';

export type RenderingWildlifeLayerProps = {
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>;
  tickConfigRef: React.RefObject<DefiningWildlifeSimulationTickConfig>;
};

const RENDERING_WILDLIFE_BAR_WIDTH_PX = 34;
const RENDERING_WILDLIFE_BAR_HEIGHT_PX = 4;
const RENDERING_WILDLIFE_STAMINA_BAR_HEIGHT_PX = 2.5;
const RENDERING_WILDLIFE_BAR_LIFT_PX = 30;

/** Player HP bar thresholds reused for animals (green / orange / red). */
function resolvingWildlifeBarFillColor(healthRatio: number): number {
  if (healthRatio <= 0.25) {
    return 0x8f1010;
  }

  if (healthRatio <= 0.5) {
    return 0xc45c12;
  }

  return 0x1f9b3f;
}

function drawingWildlifeVitalsBars(
  graphics: Graphics,
  healthRatio: number,
  staminaRatio: number
): void {
  graphics.clear();

  const barLeft = -RENDERING_WILDLIFE_BAR_WIDTH_PX / 2;

  graphics
    .rect(
      barLeft,
      0,
      RENDERING_WILDLIFE_BAR_WIDTH_PX,
      RENDERING_WILDLIFE_BAR_HEIGHT_PX
    )
    .fill({ color: 0x1a140f, alpha: 0.9 });

  if (healthRatio > 0) {
    graphics
      .rect(
        barLeft,
        0,
        RENDERING_WILDLIFE_BAR_WIDTH_PX * healthRatio,
        RENDERING_WILDLIFE_BAR_HEIGHT_PX
      )
      .fill({ color: resolvingWildlifeBarFillColor(healthRatio) });
  }

  const staminaTop = RENDERING_WILDLIFE_BAR_HEIGHT_PX + 1;

  graphics
    .rect(
      barLeft,
      staminaTop,
      RENDERING_WILDLIFE_BAR_WIDTH_PX,
      RENDERING_WILDLIFE_STAMINA_BAR_HEIGHT_PX
    )
    .fill({ color: 0x1a140f, alpha: 0.9 });

  if (staminaRatio > 0) {
    graphics
      .rect(
        barLeft,
        staminaTop,
        RENDERING_WILDLIFE_BAR_WIDTH_PX * staminaRatio,
        RENDERING_WILDLIFE_STAMINA_BAR_HEIGHT_PX
      )
      .fill({ color: 0xd9a521 });
  }
}

type RenderingWildlifeInstanceSpriteProps = {
  instanceId: string;
  speciesId: string;
  positionX: number;
  positionY: number;
  standingLayer: number;
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  facingDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  motionClip: DefiningWildlifeMotionClipKind;
  sizeScale: number;
  healthRatio: number;
  staminaRatio: number;
  isDead: boolean;
  jumpLiftPx: number;
  jumpArcPeakPx: number;
};

const RenderingWildlifeInstanceSprite = memo(
  function RenderingWildlifeInstanceSprite({
    speciesId,
    positionX,
    positionY,
    standingLayer,
    placedBlocks,
    placedBlocksByTile,
    facingDirection,
    motionClip,
    sizeScale,
    healthRatio,
    staminaRatio,
    isDead,
    jumpLiftPx,
    jumpArcPeakPx,
  }: RenderingWildlifeInstanceSpriteProps): React.JSX.Element | null {
    const species = resolvingWildlifeSpeciesDefinition(speciesId);

    if (!species) {
      return null;
    }

    const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: positionX,
      y: positionY,
    });
    const standingLayerOffsetPx =
      computingWorldBuildingWorldLayerScreenOffsetPx(standingLayer);
    const anchoredScreenY = screenPoint.y + standingLayerOffsetPx;
    const clipId = formattingWildlifeAnimationClipId(speciesId, motionClip);
    const sortKey = resolvingWorldDepthAvatarBodySortKey(
      {
        x: positionX,
        y: positionY,
        layer: standingLayer,
      },
      {
        placedBlocks,
        placedBlocksByTile,
      }
    );
    const showsVitalsBars =
      !isDead && (healthRatio < 0.999 || staminaRatio < 0.999);
    const shadowSizeScale = computingWildlifeGroundShadowSizeScale(sizeScale);
    const shadowFootOffsetPx =
      computingWildlifeGroundShadowFootOffsetBelowGridAnchorPx(sizeScale);
    const shadowZIndex =
      sortKey +
      DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET;

    return (
      <>
        {!isDead ? (
          <pixiGraphics
            eventMode="none"
            x={screenPoint.x}
            y={anchoredScreenY}
            zIndex={shadowZIndex}
            draw={(graphics: Graphics) => {
              updatingWorldPlazaAvatarGroundShadowGraphics(
                graphics,
                -jumpLiftPx,
                jumpArcPeakPx,
                facingDirection,
                shadowFootOffsetPx,
                shadowSizeScale
              );
            }}
          />
        ) : null}
        <RenderingWorldPlazaDeclarativeAnimatedSprite
          playback={{
            clipId,
            variantKey: facingDirection,
            playing: true,
          }}
          position={{ x: screenPoint.x, y: anchoredScreenY - jumpLiftPx }}
          anchor={{ x: 0.5, y: 0.72 }}
          scale={sizeScale}
          zIndex={sortKey}
        />
        {showsVitalsBars ? (
          <pixiGraphics
            eventMode="none"
            zIndex={sortKey + 1}
            x={screenPoint.x}
            y={
              anchoredScreenY -
              jumpLiftPx -
              RENDERING_WILDLIFE_BAR_LIFT_PX * sizeScale
            }
            draw={(graphics: Graphics) => {
              drawingWildlifeVitalsBars(graphics, healthRatio, staminaRatio);
            }}
          />
        ) : null}
      </>
    );
  }
);

function checkingWhetherWildlifeRenderSnapshotsMatch(
  current: readonly DefiningWildlifeInstance[],
  next: readonly DefiningWildlifeInstance[]
): boolean {
  if (current.length !== next.length) {
    return false;
  }

  for (let index = 0; index < next.length; index += 1) {
    const nextInstance = next[index];
    const currentInstance = current[index];

    if (!nextInstance || !currentInstance) {
      return false;
    }

    if (currentInstance.instanceId !== nextInstance.instanceId) {
      return false;
    }

    if (
      currentInstance.position.x !== nextInstance.position.x ||
      currentInstance.position.y !== nextInstance.position.y ||
      currentInstance.position.layer !== nextInstance.position.layer
    ) {
      return false;
    }

    if (
      currentInstance.facingDirection !== nextInstance.facingDirection ||
      currentInstance.aiState.motionClip !== nextInstance.aiState.motionClip ||
      currentInstance.aiState.jumpState?.progress !==
        nextInstance.aiState.jumpState?.progress ||
      currentInstance.isDead !== nextInstance.isDead
    ) {
      return false;
    }

    if (
      currentInstance.healthState.currentHealth !==
        nextInstance.healthState.currentHealth ||
      currentInstance.staminaState.staminaRatio !==
        nextInstance.staminaState.staminaRatio
    ) {
      return false;
    }
  }

  return true;
}

export function RenderingWildlifeLayer({
  wildlifeStoreRef,
  tickConfigRef,
}: RenderingWildlifeLayerProps): React.JSX.Element | null {
  const [instances, setInstances] = useState<
    readonly DefiningWildlifeInstance[]
  >([]);
  const loadedSpeciesRef = useRef<Set<string>>(new Set());
  const lastTickMsRef = useRef<number | null>(null);

  useTick((ticker) => {
    const config = tickConfigRef.current;
    const store = wildlifeStoreRef.current;
    const playerPosition = config.playerPositionRef.current;
    const nowMs = ticker.lastTime;
    const placedBlocksScene = config.placedBlocksRef?.current;

    if (config.enabled && playerPosition) {
      const lastTickMs = lastTickMsRef.current ?? nowMs;
      const deltaSeconds = Math.max(0, (nowMs - lastTickMs) / 1000);
      lastTickMsRef.current = nowMs;

      const leaderUserId = electingWildlifeSimulationLeaderUserId(
        config.localUserId,
        config.remoteUserIds
      );
      const isLeader =
        !config.localUserId || leaderUserId === config.localUserId;

      if (
        isLeader &&
        config.pendingWildlifeDamageEventsRef?.current &&
        config.pendingWildlifeDamageEventsRef.current.length > 0
      ) {
        for (const event of config.pendingWildlifeDamageEventsRef.current) {
          const playerPosition = config.playerPositionRef.current;
          const meatDropContext =
            playerPosition && config.meatDropContextRef?.current
              ? {
                  ...config.meatDropContextRef.current,
                  playerPosition,
                }
              : null;

          applyingWildlifeInstanceDamage(
            store,
            event.instanceId,
            event.damageAmount,
            event.attackerUserId,
            resolvingWildlifeSpeciesDefinition,
            event.atMs,
            meatDropContext
          );
        }

        config.pendingWildlifeDamageEventsRef.current.length = 0;
      }

      const { isDaytime } = computingWorldPlazaDayNightSunState();

      const result = advancingWildlifeSimulationTick({
        store,
        center: playerPosition,
        playerPosition,
        playerUserId: config.localUserId,
        isPlayerRunning: config.isPlayerRunningRef?.current ?? false,
        isPlayerJumping: config.isPlayerJumpingRef?.current ?? false,
        resolveSpecies: resolvingWildlifeSpeciesDefinition,
        deltaSeconds,
        nowMs,
        placedBlocks: placedBlocksScene?.blocks ?? [],
        placedBlocksByTile: placedBlocksScene?.blocksByTile,
        isDaytime,
        onPlayerHitByWildlife: config.onPlayerHitByWildlife,
        isLeader,
        remoteSnapshots: config.remoteWildlifeSnapshotsRef?.current ?? [],
        meatDropContext: config.meatDropContextRef?.current
          ? {
              ...config.meatDropContextRef.current,
              playerPosition,
            }
          : null,
      });

      if (config.wildlifeSnapshotsOutRef?.current) {
        config.wildlifeSnapshotsOutRef.current.length = 0;
        config.wildlifeSnapshotsOutRef.current.push(...result.snapshots);
      }

      // Solid-body collision: nudge the player out of animal circles. The
      // avatar's own collision step runs on the same live point next frame.
      if (result.playerPushOut) {
        playerPosition.x += result.playerPushOut.x;
        playerPosition.y += result.playerPushOut.y;
      }
    }

    const nextInstances = listingWildlifeInstances(store);

    if (config.projectileTargetsOutRef?.current) {
      config.projectileTargetsOutRef.current.length = 0;

      for (const instance of nextInstances) {
        if (instance.isDead) {
          continue;
        }

        const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

        if (!species) {
          continue;
        }

        config.projectileTargetsOutRef.current.push({
          targetId: instance.instanceId,
          point: instance.position,
          collisionRadiusGrid: species.collisionRadiusGrid + 0.15,
          jumpArcOffsetPx: instance.aiState.jumpState
            ? computingWildlifeJumpArcLiftPx(
                species.jump.jumpArcPeakPx,
                instance.aiState.jumpState.progress
              )
            : 0,
        });
      }
    }

    if (config.wildlifeFloatingCombatTextsOutRef?.current) {
      config.wildlifeFloatingCombatTextsOutRef.current.length = 0;

      for (const instance of nextInstances) {
        if (instance.floatingTexts.length === 0) {
          continue;
        }

        const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

        if (!species) {
          continue;
        }

        for (const floatText of instance.floatingTexts) {
          config.wildlifeFloatingCombatTextsOutRef.current.push({
            instanceId: instance.instanceId,
            floatText,
            gridX: instance.position.x,
            gridY: instance.position.y,
            layer: resolvingWildlifeInstanceStandingLayerAtPoint(
              instance.position,
              placedBlocksScene?.blocks ?? [],
              placedBlocksScene?.blocksByTile
            ),
            sizeScale: resolvingWildlifeInstanceSizeScale(species, instance),
          });
        }
      }
    }

    if (config.wildlifeSpeechBubblesOutRef?.current) {
      config.wildlifeSpeechBubblesOutRef.current.length = 0;

      for (const instance of nextInstances) {
        const activeBubble = instance.speechState?.activeBubble;

        if (!activeBubble || activeBubble.expiresAtMs <= nowMs) {
          continue;
        }

        const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

        if (!species) {
          continue;
        }

        config.wildlifeSpeechBubblesOutRef.current.push({
          instanceId: instance.instanceId,
          message: activeBubble.message,
          gridX: instance.position.x,
          gridY: instance.position.y,
          layer: resolvingWildlifeInstanceStandingLayerAtPoint(
            instance.position,
            placedBlocksScene?.blocks ?? [],
            placedBlocksScene?.blocksByTile
          ),
          sizeScale: resolvingWildlifeInstanceSizeScale(species, instance),
          jumpArcOffsetPx: instance.aiState.jumpState
            ? computingWildlifeJumpArcLiftPx(
                species.jump.jumpArcPeakPx,
                instance.aiState.jumpState.progress
              )
            : 0,
        });
      }
    }

    if (nextInstances.length === 0 && instances.length === 0) {
      return;
    }

    for (const instance of nextInstances) {
      const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

      if (!species || loadedSpeciesRef.current.has(species.speciesId)) {
        continue;
      }

      loadedSpeciesRef.current.add(species.speciesId);
      void ensuringWildlifeAnimationClipsRegistered(
        species,
        loadingWildlifeSpeciesTextures
      );
    }

    setInstances((current) =>
      checkingWhetherWildlifeRenderSnapshotsMatch(current, nextInstances)
        ? current
        : nextInstances
    );
  });

  if (instances.length === 0) {
    return null;
  }

  const placedBlocksScene = tickConfigRef.current.placedBlocksRef?.current;

  return (
    <>
      {instances.map((instance) => {
        const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

        if (!species) {
          return null;
        }

        const healthRatio = Math.min(
          1,
          Math.max(
            0,
            instance.healthState.baseMaxHealth > 0
              ? instance.healthState.currentHealth /
                  instance.healthState.baseMaxHealth
              : 0
          )
        );

        const jumpState = instance.aiState.jumpState;
        const jumpLiftPx = jumpState
          ? computingWildlifeJumpArcLiftPx(
              species.jump.jumpArcPeakPx,
              jumpState.progress
            )
          : 0;

        return (
          <RenderingWildlifeInstanceSprite
            key={instance.instanceId}
            instanceId={instance.instanceId}
            speciesId={instance.speciesId}
            positionX={instance.position.x}
            positionY={instance.position.y}
            standingLayer={resolvingWildlifeInstanceStandingLayerAtPoint(
              instance.position,
              placedBlocksScene?.blocks ?? [],
              placedBlocksScene?.blocksByTile
            )}
            placedBlocks={placedBlocksScene?.blocks ?? []}
            placedBlocksByTile={placedBlocksScene?.blocksByTile}
            facingDirection={
              instance.facingDirection as DefiningWorldPlazaGirlSampleWalkDirection
            }
            motionClip={instance.aiState.motionClip}
            sizeScale={resolvingWildlifeInstanceSizeScale(species, instance)}
            healthRatio={healthRatio}
            staminaRatio={instance.staminaState.staminaRatio}
            isDead={instance.isDead}
            jumpLiftPx={jumpLiftPx}
            jumpArcPeakPx={species.jump.jumpArcPeakPx}
          />
        );
      })}
    </>
  );
}
