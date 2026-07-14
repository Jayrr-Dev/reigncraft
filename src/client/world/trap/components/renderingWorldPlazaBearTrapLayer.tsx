/**
 * Pixi layer: player-placed bear traps as animated sprite-sheet frames.
 *
 * @module components/world/trap/components/renderingWorldPlazaBearTrapLayer
 */

'use client';

import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX } from '@/components/world/domains/definingWorldPlazaIsometricTileLayoutConstants';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { peekingWorldPlazaBearTrapSpriteTextureForFrameFromManifest } from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import {
  DEFINING_WORLD_PLAZA_BEAR_TRAP_DISPLAY_SCALE,
  DEFINING_WORLD_PLAZA_BEAR_TRAP_SNAP_DURATION_MS,
} from '@/components/world/trap/domains/definingWorldPlazaBearTrapConstants';
import type { DefiningWorldPlazaBearTrapInstance } from '@/components/world/trap/domains/definingWorldPlazaBearTrapTypes';
import {
  listingWorldPlazaBearTrapInstances,
  readingWorldPlazaBearTrapInstanceStore,
  subscribingWorldPlazaBearTrapInstanceStore,
  type ManagingWorldPlazaBearTrapInstanceStore,
} from '@/components/world/trap/domains/managingWorldPlazaBearTrapInstanceStore';
import { resolvingWorldPlazaBearTrapSpriteFrame } from '@/components/world/trap/domains/resolvingWorldPlazaBearTrapSpriteFrame';
import { useEffect, useState, useSyncExternalStore } from 'react';
import type { Texture } from 'pixi.js';

export type RenderingWorldPlazaBearTrapLayerProps = {
  readonly trapStoreRef?: React.RefObject<ManagingWorldPlazaBearTrapInstanceStore>;
};

function readingWorldPlazaBearTrapLayerSnapshot(
  store: ManagingWorldPlazaBearTrapInstanceStore
): string {
  return listingWorldPlazaBearTrapInstances(store)
    .map(
      (entry) =>
        `${entry.trapId}:${entry.state}:${entry.snapStartedAtMs ?? 'idle'}`
    )
    .join('|');
}

function RenderingWorldPlazaBearTrapSprite({
  instance,
  nowMs,
}: {
  readonly instance: DefiningWorldPlazaBearTrapInstance;
  readonly nowMs: number;
}): React.JSX.Element | null {
  const frameIndex = resolvingWorldPlazaBearTrapSpriteFrame(instance, nowMs);
  const texture: Texture | null =
    peekingWorldPlazaBearTrapSpriteTextureForFrameFromManifest(frameIndex);

  if (!texture) {
    return null;
  }

  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(
    instance.position
  );
  const standingLayer = resolvingWorldPlazaPlayerWorldLayer(instance.position);
  const layerOffsetY =
    computingWorldBuildingWorldLayerScreenOffsetPx(standingLayer);
  const displayScale = DEFINING_WORLD_PLAZA_BEAR_TRAP_DISPLAY_SCALE;
  const targetWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX * displayScale;
  const textureScale = targetWidth / Math.max(texture.width, 1);
  const sortKey = computingWorldDepthSortKey(instance.position);

  return (
    <pixiSprite
      texture={texture}
      anchor={{ x: 0.5, y: 1 }}
      x={screenPoint.x}
      y={screenPoint.y + layerOffsetY}
      scale={textureScale}
      zIndex={sortKey}
      roundPixels
      eventMode="none"
    />
  );
}

/**
 * Renders placed bear traps. Gated by the Traps generation feature.
 */
export function RenderingWorldPlazaBearTrapLayer({
  trapStoreRef,
}: RenderingWorldPlazaBearTrapLayerProps): React.JSX.Element | null {
  const enabled = checkingWorldPlazaGenerationFeatureEnabled(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TRAPS
  );
  const storeRevision = useSyncExternalStore(
    subscribingWorldPlazaBearTrapInstanceStore,
    () =>
      readingWorldPlazaBearTrapLayerSnapshot(
        trapStoreRef?.current ?? readingWorldPlazaBearTrapInstanceStore()
      ),
    () => ''
  );
  const [nowMs, setNowMs] = useState(() => performance.now());

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let frameId = 0;
    const ticking = (frameTimeMs: number): void => {
      setNowMs(frameTimeMs);
      frameId = requestAnimationFrame(ticking);
    };

    frameId = requestAnimationFrame(ticking);
    return () => cancelAnimationFrame(frameId);
  }, [enabled, storeRevision]);

  if (!enabled) {
    return null;
  }

  void storeRevision;

  const instances = listingWorldPlazaBearTrapInstances(
    trapStoreRef?.current ?? readingWorldPlazaBearTrapInstanceStore()
  );

  if (instances.length === 0) {
    return null;
  }

  const hasActiveSnap = instances.some(
    (instance) =>
      instance.snapStartedAtMs !== null &&
      nowMs - instance.snapStartedAtMs <
        DEFINING_WORLD_PLAZA_BEAR_TRAP_SNAP_DURATION_MS
  );

  // Keep RAF only useful when snap is playing; still render idle frames.
  void hasActiveSnap;

  return (
    <>
      {instances.map((instance) => (
        <RenderingWorldPlazaBearTrapSprite
          key={instance.trapId}
          instance={instance}
          nowMs={nowMs}
        />
      ))}
    </>
  );
}
