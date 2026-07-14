'use client';

/**
 * Pixi sprite layer for placed blacksmith utilities.
 *
 * @module components/world/building/components/renderingWorldPlazaBlacksmithUtilityLayer
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  syncingWorldPlazaVisibleBlacksmithUtilityLayer,
  type SyncingWorldPlazaBlacksmithUtilitySpriteState,
} from '@/components/world/building/domains/syncingWorldPlazaVisibleBlacksmithUtilityLayer';
import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { useApplication } from '@pixi/react';
import { Container, Sprite } from 'pixi.js';
import { useCallback, useRef } from 'react';

export type RenderingWorldPlazaBlacksmithUtilityLayerProps = {
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
};

/**
 * Renders anvil / clay kiln / clay stove sprites for placed craft utilities.
 */
export function RenderingWorldPlazaBlacksmithUtilityLayer({
  placedBlocks,
}: RenderingWorldPlazaBlacksmithUtilityLayerProps): React.JSX.Element | null {
  const applicationContext = useApplication();
  const containerRef = useRef<Container | null>(null);
  const stateRef = useRef<SyncingWorldPlazaBlacksmithUtilitySpriteState>({
    spriteByBlockId: new Map(),
  });
  const placedBlocksRef = useRef(placedBlocks);
  placedBlocksRef.current = placedBlocks;

  const attachingContainer = useCallback((container: Container | null): void => {
    containerRef.current = container;
  }, []);

  usingWorldPlazaSafeTick(() => {
    const container = containerRef.current;

    if (
      !container ||
      !checkingWorldPlazaPixiApplicationIsReady(applicationContext)
    ) {
      return;
    }

    const syncResult = syncingWorldPlazaVisibleBlacksmithUtilityLayer({
      placedBlocks: placedBlocksRef.current,
      state: stateRef.current,
      creatingSprite: () => {
        const sprite = new Sprite();
        sprite.eventMode = 'none';
        container.addChild(sprite);
        return sprite;
      },
      destroyingSprite: (sprite) => {
        container.removeChild(sprite);
        sprite.destroy();
      },
    });

    if (syncResult.needsChildSort) {
      container.sortableChildren = true;
      container.sortChildren();
    }
  }, 'tick:blacksmith-utility-sprites');

  return (
    <pixiContainer
      ref={attachingContainer}
      sortableChildren
      eventMode="none"
    />
  );
}
