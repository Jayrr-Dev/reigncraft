/**
 * Pixi layer: player-placed caltrops as static sprite-sheet frames.
 *
 * @module components/world/trap/components/renderingWorldPlazaCaltropLayer
 */

'use client';

import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX } from '@/components/world/domains/definingWorldPlazaIsometricTileLayoutConstants';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { peekingWorldPlazaCaltropSpriteTextureForFrameFromManifest } from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import {
  DEFINING_WORLD_PLAZA_CALTROP_DISPLAY_SCALE,
  DEFINING_WORLD_PLAZA_CALTROP_FRAME_INDEX,
} from '@/components/world/trap/domains/definingWorldPlazaCaltropConstants';
import type { DefiningWorldPlazaCaltropInstance } from '@/components/world/trap/domains/definingWorldPlazaCaltropTypes';
import {
  listingWorldPlazaCaltropInstances,
  readingWorldPlazaCaltropInstanceStore,
  subscribingWorldPlazaCaltropInstanceStore,
  type ManagingWorldPlazaCaltropInstanceStore,
} from '@/components/world/trap/domains/managingWorldPlazaCaltropInstanceStore';
import { useSyncExternalStore } from 'react';
import type { Texture } from 'pixi.js';

export type RenderingWorldPlazaCaltropLayerProps = {
  readonly trapStoreRef?: React.RefObject<ManagingWorldPlazaCaltropInstanceStore>;
};

function readingWorldPlazaCaltropLayerSnapshot(
  store: ManagingWorldPlazaCaltropInstanceStore
): string {
  return listingWorldPlazaCaltropInstances(store)
    .map((entry) => entry.trapId)
    .join('|');
}

function RenderingWorldPlazaCaltropSprite({
  instance,
}: {
  readonly instance: DefiningWorldPlazaCaltropInstance;
}): React.JSX.Element | null {
  const texture: Texture | null =
    peekingWorldPlazaCaltropSpriteTextureForFrameFromManifest(
      DEFINING_WORLD_PLAZA_CALTROP_FRAME_INDEX.ARMED
    );

  if (!texture) {
    return null;
  }

  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(
    instance.position
  );
  const standingLayer = resolvingWorldPlazaPlayerWorldLayer(instance.position);
  const layerOffsetY =
    computingWorldBuildingWorldLayerScreenOffsetPx(standingLayer);
  const displayScale = DEFINING_WORLD_PLAZA_CALTROP_DISPLAY_SCALE;
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
 * Renders placed caltrops. Gated by the Traps generation feature.
 */
export function RenderingWorldPlazaCaltropLayer({
  trapStoreRef,
}: RenderingWorldPlazaCaltropLayerProps): React.JSX.Element | null {
  const enabled = checkingWorldPlazaGenerationFeatureEnabled(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TRAPS
  );
  const storeRevision = useSyncExternalStore(
    subscribingWorldPlazaCaltropInstanceStore,
    () =>
      readingWorldPlazaCaltropLayerSnapshot(
        trapStoreRef?.current ?? readingWorldPlazaCaltropInstanceStore()
      ),
    () => ''
  );

  if (!enabled) {
    return null;
  }

  void storeRevision;

  const instances = listingWorldPlazaCaltropInstances(
    trapStoreRef?.current ?? readingWorldPlazaCaltropInstanceStore()
  );

  if (instances.length === 0) {
    return null;
  }

  return (
    <>
      {instances.map((instance) => (
        <RenderingWorldPlazaCaltropSprite
          key={instance.trapId}
          instance={instance}
        />
      ))}
    </>
  );
}
