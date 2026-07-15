'use client';

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  syncingWorldPlazaVisibleSurvivalShelterUtilityLayer,
  type SyncingWorldPlazaSurvivalShelterSpriteState,
} from '@/components/world/building/domains/syncingWorldPlazaVisibleSurvivalShelterUtilityLayer';
import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { useApplication } from '@pixi/react';
import { Container, Sprite } from 'pixi.js';
import { useEffect, useRef } from 'react';

export type RenderingWorldPlazaSurvivalShelterUtilityLayerProps = {
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly placementPreviewBlock?: DefiningWorldBuildingPlacedBlock | null;
  readonly entityLayerRef: React.RefObject<Container | null>;
};

export function RenderingWorldPlazaSurvivalShelterUtilityLayer({
  placedBlocks,
  placementPreviewBlock = null,
  entityLayerRef,
}: RenderingWorldPlazaSurvivalShelterUtilityLayerProps): null {
  const applicationContext = useApplication();
  const stateRef = useRef<SyncingWorldPlazaSurvivalShelterSpriteState>({
    spriteByBlockId: new Map(),
  });
  const placedBlocksRef = useRef(placedBlocks);
  placedBlocksRef.current = placedBlocks;
  const placementPreviewBlockRef = useRef(placementPreviewBlock);
  placementPreviewBlockRef.current = placementPreviewBlock;

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

    const syncResult = syncingWorldPlazaVisibleSurvivalShelterUtilityLayer({
      placedBlocks: placedBlocksRef.current,
      placementPreviewBlock: placementPreviewBlockRef.current,
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
  }, 'tick:survival-shelter-utility-sprites');

  return null;
}
