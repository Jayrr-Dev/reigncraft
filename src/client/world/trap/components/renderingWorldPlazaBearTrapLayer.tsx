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
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { DEFINING_WORLD_PLAZA_BEAR_TRAP_DISPLAY_SCALE } from '@/components/world/trap/domains/definingWorldPlazaBearTrapConstants';
import type { DefiningWorldPlazaBearTrapInstance } from '@/components/world/trap/domains/definingWorldPlazaBearTrapTypes';
import {
  listingWorldPlazaBearTrapInstances,
  readingWorldPlazaBearTrapInstanceStore,
  subscribingWorldPlazaBearTrapInstanceStore,
  type ManagingWorldPlazaBearTrapInstanceStore,
} from '@/components/world/trap/domains/managingWorldPlazaBearTrapInstanceStore';
import { resolvingWorldPlazaBearTrapSpriteFrame } from '@/components/world/trap/domains/resolvingWorldPlazaBearTrapSpriteFrame';
import type { Sprite, Texture } from 'pixi.js';
import { useRef, useSyncExternalStore } from 'react';

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

function computingWorldPlazaBearTrapSpriteScale(texture: Texture): number {
  const targetWidth =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX *
    DEFINING_WORLD_PLAZA_BEAR_TRAP_DISPLAY_SCALE;
  return targetWidth / Math.max(texture.width, 1);
}

function RenderingWorldPlazaBearTrapSprite({
  instance,
}: {
  readonly instance: DefiningWorldPlazaBearTrapInstance;
}): React.JSX.Element | null {
  const spriteRef = useRef<Sprite | null>(null);
  const instanceRef = useRef(instance);
  const lastFrameIndexRef = useRef(-1);

  instanceRef.current = instance;

  const initialFrameIndex = resolvingWorldPlazaBearTrapSpriteFrame(
    instance,
    performance.now()
  );
  const initialTexture: Texture | null =
    peekingWorldPlazaBearTrapSpriteTextureForFrameFromManifest(
      initialFrameIndex
    );

  usingWorldPlazaSafeTick(() => {
    const sprite = spriteRef.current;
    if (!sprite) {
      return;
    }

    const liveInstance = instanceRef.current;
    const frameIndex = resolvingWorldPlazaBearTrapSpriteFrame(
      liveInstance,
      performance.now()
    );

    if (frameIndex === lastFrameIndexRef.current) {
      return;
    }

    const texture =
      peekingWorldPlazaBearTrapSpriteTextureForFrameFromManifest(frameIndex);
    if (!texture) {
      return;
    }

    lastFrameIndexRef.current = frameIndex;
    sprite.texture = texture;
    sprite.scale.set(computingWorldPlazaBearTrapSpriteScale(texture));
  }, 'tick:bear-trap');

  if (!initialTexture) {
    return null;
  }

  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(
    instance.position
  );
  const standingLayer = resolvingWorldPlazaPlayerWorldLayer(instance.position);
  const layerOffsetY =
    computingWorldBuildingWorldLayerScreenOffsetPx(standingLayer);
  const textureScale = computingWorldPlazaBearTrapSpriteScale(initialTexture);
  const sortKey = computingWorldDepthSortKey(instance.position);

  return (
    <pixiSprite
      ref={spriteRef}
      texture={initialTexture}
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
 *
 * Snap frames advance on the Pixi tick (no React clock state).
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

  return (
    <>
      {instances.map((instance) => (
        <RenderingWorldPlazaBearTrapSprite
          key={instance.trapId}
          instance={instance}
        />
      ))}
    </>
  );
}
