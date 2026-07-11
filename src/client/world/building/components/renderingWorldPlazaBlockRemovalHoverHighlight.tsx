'use client';

import { DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX } from '@/components/world/building/domains/definingWorldBuildingBuildModeConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { drawingWorldBuildingPlacedBlockHoverHighlightOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingPlacedBlocksOnGraphics';
import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { useApplication } from '@pixi/react';
import type { Graphics } from 'pixi.js';
import { useCallback, useRef } from 'react';

export interface RenderingWorldPlazaBlockRemovalHoverHighlightProps {
  isVisible: boolean;
  hoveredRemovableBlockRef: React.RefObject<DefiningWorldBuildingPlacedBlock | null>;
}

/**
 * Warm overlay highlight over the placed block under the build mode cursor.
 *
 * Active while build mode has no placement selection, signalling which block a
 * primary click would target for removal.
 */
export function RenderingWorldPlazaBlockRemovalHoverHighlight({
  isVisible,
  hoveredRemovableBlockRef,
}: RenderingWorldPlazaBlockRemovalHoverHighlightProps): React.JSX.Element | null {
  const highlightGraphicsRef = useRef<Graphics | null>(null);
  const applicationContext = useApplication();

  const initializingHighlightGraphics = useCallback(
    (graphics: Graphics): void => {
      highlightGraphicsRef.current = graphics;
      graphics.visible = isVisible;
    },
    [isVisible]
  );

  usingWorldPlazaSafeTick(() => {
    const graphics = highlightGraphicsRef.current;

    if (
      !graphics ||
      !isVisible ||
      !checkingWorldPlazaPixiApplicationIsReady(applicationContext)
    ) {
      return;
    }

    graphics.clear();

    const hoveredRemovableBlock = hoveredRemovableBlockRef.current;

    if (!hoveredRemovableBlock) {
      return;
    }

    graphics.zIndex = DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX;

    drawingWorldBuildingPlacedBlockHoverHighlightOnGraphics(
      graphics,
      hoveredRemovableBlock
    );
  }, 'tick:block-removal-hover');

  if (!isVisible) {
    return null;
  }

  return (
    <pixiGraphics
      draw={initializingHighlightGraphics}
      eventMode="none"
      zIndex={DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX}
    />
  );
}
