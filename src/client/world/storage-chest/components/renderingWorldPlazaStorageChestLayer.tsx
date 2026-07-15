'use client';

/**
 * Pixi sprite layer for craftable storage chests.
 *
 * @module components/world/storage-chest/components/renderingWorldPlazaStorageChestLayer
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import {
  syncingWorldPlazaVisibleStorageChestLayer,
  type SyncingWorldPlazaStorageChestSpriteState,
} from '@/components/world/storage-chest/domains/syncingWorldPlazaVisibleStorageChestLayer';
import { useApplication } from '@pixi/react';
import { Container, Sprite } from 'pixi.js';
import { useEffect, useRef } from 'react';

export type RenderingWorldPlazaStorageChestLayerProps = {
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly placementPreviewBlock?: DefiningWorldBuildingPlacedBlock | null;
  readonly openBlockIds?: ReadonlySet<string>;
  readonly entityLayerRef: React.RefObject<Container | null>;
};

export function RenderingWorldPlazaStorageChestLayer({
  placedBlocks,
  placementPreviewBlock = null,
  openBlockIds,
  entityLayerRef,
}: RenderingWorldPlazaStorageChestLayerProps): null {
  const applicationContext = useApplication();
  const stateRef = useRef<SyncingWorldPlazaStorageChestSpriteState>({
    spriteByBlockId: new Map(),
  });
  const placedBlocksRef = useRef(placedBlocks);
  placedBlocksRef.current = placedBlocks;
  const placementPreviewBlockRef = useRef(placementPreviewBlock);
  placementPreviewBlockRef.current = placementPreviewBlock;
  const openBlockIdsRef = useRef(openBlockIds);
  openBlockIdsRef.current = openBlockIds;

  useEffect(() => {
    const entityLayer = entityLayerRef.current;

    if (!entityLayer) {
      return;
    }

    return () => {
      for (const sprite of stateRef.current.spriteByBlockId.values()) {
        if (sprite.parent === entityLayer) {
          entityLayer.removeChild(sprite);
        }
        sprite.destroy();
      }
      stateRef.current.spriteByBlockId.clear();
    };
  }, [entityLayerRef]);

  usingWorldPlazaSafeTick(() => {
    const entityLayer = entityLayerRef.current;

    if (
      !entityLayer ||
      !checkingWorldPlazaPixiApplicationIsReady(applicationContext)
    ) {
      return;
    }

    const syncResult = syncingWorldPlazaVisibleStorageChestLayer({
      placedBlocks: placedBlocksRef.current,
      placementPreviewBlock: placementPreviewBlockRef.current,
      openBlockIds: openBlockIdsRef.current,
      state: stateRef.current,
      creatingSprite: () => {
        const sprite = new Sprite();
        sprite.eventMode = 'none';
        entityLayer.addChild(sprite);
        return sprite;
      },
      destroyingSprite: (sprite) => {
        if (sprite.parent === entityLayer) {
          entityLayer.removeChild(sprite);
        }
        sprite.destroy();
      },
    });

    let didMutateEntityLayerOrder = syncResult.needsChildSort;

    for (const sprite of stateRef.current.spriteByBlockId.values()) {
      if (sprite.parent !== entityLayer) {
        entityLayer.addChild(sprite);
        didMutateEntityLayerOrder = true;
      }
    }

    if (didMutateEntityLayerOrder && entityLayer.sortableChildren) {
      entityLayer.sortChildren();
    }
  }, 'tick:storage-chest-sprites');

  return null;
}
