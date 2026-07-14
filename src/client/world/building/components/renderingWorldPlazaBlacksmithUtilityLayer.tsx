'use client';

/**
 * Pixi sprite layer for placed blacksmith utilities.
 *
 * Sprites parent to the entity trunk layer (siblings of the avatar) so depth
 * sort keys interleave correctly. Nested containers break that interleaving.
 *
 * @module components/world/building/components/renderingWorldPlazaBlacksmithUtilityLayer
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND } from '@/components/world/building/domains/definingWorldPlazaBlacksmithUtilitySpriteConstants';
import {
  resolvingWorldPlazaBlacksmithUtilityKindForBlockDefinitionId,
  syncingWorldPlazaVisibleBlacksmithUtilityLayer,
  type SyncingWorldPlazaBlacksmithUtilitySpriteState,
} from '@/components/world/building/domains/syncingWorldPlazaVisibleBlacksmithUtilityLayer';
import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { useApplication } from '@pixi/react';
import { Container, Graphics, Sprite } from 'pixi.js';
import { useRef } from 'react';

export type RenderingWorldPlazaBlacksmithUtilityLayerProps = {
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly activeBlockIds?: ReadonlySet<string>;
  /** Craft/build ghost while placing anvil / kiln / bloomery / stove. */
  readonly placementPreviewBlock?: DefiningWorldBuildingPlacedBlock | null;
  /** Entity trunk layer; utilities must be siblings of the avatar for z-sort. */
  readonly entityLayerRef: React.RefObject<Container | null>;
};

/**
 * Renders anvil / clay kiln / clay stove sprites for placed craft utilities.
 */
export function RenderingWorldPlazaBlacksmithUtilityLayer({
  placedBlocks,
  activeBlockIds,
  placementPreviewBlock = null,
  entityLayerRef,
}: RenderingWorldPlazaBlacksmithUtilityLayerProps): null {
  const applicationContext = useApplication();
  const stateRef = useRef<SyncingWorldPlazaBlacksmithUtilitySpriteState>({
    spriteByBlockId: new Map(),
  });
  const smokeGraphicsByBlockIdRef = useRef(new Map<string, Graphics>());
  const placedBlocksRef = useRef(placedBlocks);
  placedBlocksRef.current = placedBlocks;
  const activeBlockIdsRef = useRef(activeBlockIds);
  activeBlockIdsRef.current = activeBlockIds;
  const placementPreviewBlockRef = useRef(placementPreviewBlock);
  placementPreviewBlockRef.current = placementPreviewBlock;

  usingWorldPlazaSafeTick(() => {
    const entityLayer = entityLayerRef.current;

    if (
      !entityLayer ||
      !checkingWorldPlazaPixiApplicationIsReady(applicationContext)
    ) {
      return;
    }

    const syncResult = syncingWorldPlazaVisibleBlacksmithUtilityLayer({
      placedBlocks: placedBlocksRef.current,
      placementPreviewBlock: placementPreviewBlockRef.current,
      activeBlockIds: activeBlockIdsRef.current,
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

    const liveSmokeBlockIds = new Set<string>();
    const nowMs = performance.now();

    for (const block of placedBlocksRef.current) {
      if (
        !activeBlockIdsRef.current?.has(block.blockId) ||
        resolvingWorldPlazaBlacksmithUtilityKindForBlockDefinitionId(
          block.definitionId
        ) !== DEFINING_WORLD_PLAZA_BLACKSMITH_UTILITY_KIND.BLOOMERY
      ) {
        continue;
      }

      const utilitySprite = stateRef.current.spriteByBlockId.get(block.blockId);

      if (!utilitySprite) {
        continue;
      }

      liveSmokeBlockIds.add(block.blockId);
      let smokeGraphics = smokeGraphicsByBlockIdRef.current.get(block.blockId);

      if (!smokeGraphics) {
        smokeGraphics = new Graphics();
        smokeGraphics.eventMode = 'none';
        entityLayer.addChild(smokeGraphics);
        smokeGraphicsByBlockIdRef.current.set(block.blockId, smokeGraphics);
        didMutateEntityLayerOrder = true;
      }

      smokeGraphics.clear();
      smokeGraphics.position.set(
        utilitySprite.position.x,
        utilitySprite.position.y - utilitySprite.height + 4
      );
      if (smokeGraphics.zIndex !== utilitySprite.zIndex + 0.1) {
        smokeGraphics.zIndex = utilitySprite.zIndex + 0.1;
        didMutateEntityLayerOrder = true;
      }

      for (let puffIndex = 0; puffIndex < 4; puffIndex += 1) {
        const phase = (nowMs * 0.00035 + puffIndex * 0.24) % 1;
        const radius = 2.5 + phase * 4;
        const x = Math.sin(phase * Math.PI * 2 + puffIndex) * 3;
        const y = -phase * 30;
        smokeGraphics.circle(x, y, radius).fill({
          color: 0x6f6b64,
          alpha: (1 - phase) * 0.3,
        });
      }
    }

    for (const [blockId, smokeGraphics] of smokeGraphicsByBlockIdRef.current) {
      if (liveSmokeBlockIds.has(blockId)) {
        continue;
      }

      if (smokeGraphics.parent === entityLayer) {
        entityLayer.removeChild(smokeGraphics);
      }
      smokeGraphics.destroy();
      smokeGraphicsByBlockIdRef.current.delete(blockId);
      didMutateEntityLayerOrder = true;
    }

    if (didMutateEntityLayerOrder && entityLayer.sortableChildren) {
      entityLayer.sortChildren();
    }
  }, 'tick:blacksmith-utility-sprites');

  return null;
}
