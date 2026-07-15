/**
 * Pixi layer: fixed world chest props as static sprites.
 *
 * @module components/world/chest/components/renderingWorldPlazaChestLayer
 */

'use client';

import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { DEFINING_WORLD_PLAZA_CHEST_DISPLAY_SCALE } from '@/components/world/chest/domains/definingWorldPlazaChestConstants';
import type { DefiningWorldPlazaChestInstance } from '@/components/world/chest/domains/definingWorldPlazaChestTypes';
import { DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_SYNC_RADIUS_TILES } from '@/components/world/chest/domains/definingWorldPlazaProceduralChestConstants';
import { formattingWorldPlazaChestSpriteUrl } from '@/components/world/chest/domains/formattingWorldPlazaChestSpriteUrl';
import {
  listingWorldPlazaChestInstances,
  readingWorldPlazaChestInstanceStore,
  subscribingWorldPlazaChestInstanceStore,
  type ManagingWorldPlazaChestInstanceStore,
} from '@/components/world/chest/domains/managingWorldPlazaChestInstanceStore';
import { syncingWorldPlazaProceduralChestsInBounds } from '@/components/world/chest/domains/syncingWorldPlazaProceduralChestsInBounds';
import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX } from '@/components/world/domains/definingWorldPlazaIsometricTileLayoutConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { peekingWorldPlazaChestSpriteTextureForUrlFromManifest } from '@/components/world/engine/registeringWorldPlazaTextureAssetManifest';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import type { Texture } from 'pixi.js';
import { useSyncExternalStore } from 'react';

export type RenderingWorldPlazaChestLayerProps = {
  readonly chestStoreRef?: React.RefObject<ManagingWorldPlazaChestInstanceStore>;
  readonly playerPositionRef?: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly localPersistenceOwnerId?: string | null;
};

function readingWorldPlazaChestLayerSnapshot(
  store: ManagingWorldPlazaChestInstanceStore
): string {
  return listingWorldPlazaChestInstances(store)
    .map(
      (entry) =>
        `${entry.chestId}:${entry.state}:${entry.facing}:${entry.variant}`
    )
    .join('|');
}

function RenderingWorldPlazaChestSprite({
  instance,
}: {
  readonly instance: DefiningWorldPlazaChestInstance;
}): React.JSX.Element | null {
  const spriteUrl = formattingWorldPlazaChestSpriteUrl(
    instance.variant,
    instance.facing,
    instance.state
  );
  const texture: Texture | null =
    peekingWorldPlazaChestSpriteTextureForUrlFromManifest(spriteUrl);

  if (!texture) {
    return null;
  }

  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(
    instance.position
  );
  const standingLayer = resolvingWorldPlazaPlayerWorldLayer(instance.position);
  const layerOffsetY =
    computingWorldBuildingWorldLayerScreenOffsetPx(standingLayer);
  const displayScale =
    instance.displayScale || DEFINING_WORLD_PLAZA_CHEST_DISPLAY_SCALE;
  const targetWidth =
    DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_WIDTH_PX * displayScale;
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
 * Renders hand-placed plaza chests. Gated by the Chests generation feature.
 */
export function RenderingWorldPlazaChestLayer({
  chestStoreRef,
  playerPositionRef,
  localPersistenceOwnerId = null,
}: RenderingWorldPlazaChestLayerProps): React.JSX.Element | null {
  const enabled = checkingWorldPlazaGenerationFeatureEnabled(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.CHESTS
  );
  const playerPositionRefForSync = playerPositionRef;
  const persistenceOwnerIdForSync = localPersistenceOwnerId;

  usingWorldPlazaSafeTick(
    () => {
      if (!enabled || !playerPositionRefForSync?.current) {
        return;
      }

      const playerPosition = playerPositionRefForSync.current;
      const centerTileX = Math.floor(playerPosition.x);
      const centerTileY = Math.floor(playerPosition.y);
      const radius = DEFINING_WORLD_PLAZA_PROCEDURAL_CHEST_SYNC_RADIUS_TILES;

      syncingWorldPlazaProceduralChestsInBounds(
        {
          minTileX: centerTileX - radius,
          maxTileX: centerTileX + radius,
          minTileY: centerTileY - radius,
          maxTileY: centerTileY + radius,
        },
        persistenceOwnerIdForSync,
        chestStoreRef?.current ?? readingWorldPlazaChestInstanceStore()
      );
    },
    'tick:procedural-chests',
    enabled
  );

  const storeRevision = useSyncExternalStore(
    subscribingWorldPlazaChestInstanceStore,
    () =>
      readingWorldPlazaChestLayerSnapshot(
        chestStoreRef?.current ?? readingWorldPlazaChestInstanceStore()
      ),
    () => ''
  );

  if (!enabled) {
    return null;
  }

  void storeRevision;

  const instances = listingWorldPlazaChestInstances(
    chestStoreRef?.current ?? readingWorldPlazaChestInstanceStore()
  );

  if (instances.length === 0) {
    return null;
  }

  return (
    <>
      {instances.map((instance) => (
        <RenderingWorldPlazaChestSprite
          key={instance.chestId}
          instance={instance}
        />
      ))}
    </>
  );
}
