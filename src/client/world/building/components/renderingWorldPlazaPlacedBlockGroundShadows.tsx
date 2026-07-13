'use client';

import {
  applyingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics,
  clearingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics,
} from '@/components/world/building/domains/applyingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_ALPHA } from '@/components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowConstants';
import {
  drawingWorldBuildingPlacedBlockGroundShadowCastLayerOnGraphics,
  drawingWorldBuildingPlacedBlockGroundShadowContactLayerOnGraphics,
} from '@/components/world/building/domains/drawingWorldBuildingPlacedBlockGroundShadowLayerOnGraphics';
import {
  formattingWorldBuildingPlacedBlocksTileColumnKey,
  groupingWorldBuildingPlacedBlocksByTileColumn,
  type GroupingWorldBuildingPlacedBlocksTileColumn,
} from '@/components/world/building/domains/groupingWorldBuildingPlacedBlocksByTileColumn';
import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import { computingWorldDepthSortKey } from '@/components/world/depth';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import {
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore,
  usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
} from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags';
import type { Graphics } from 'pixi.js';
import { memo, useCallback, useMemo } from 'react';

/**
 * Renders block shadows with blur only on the cast away from the object.
 *
 * Each tile column sorts on the floor layer by grid depth so shadows interleave
 * correctly with grass chunks and avatars.
 *
 * @module components/world/building/components/renderingWorldPlazaPlacedBlockGroundShadows
 */

export interface RenderingWorldPlazaPlacedBlockGroundShadowsProps {
  placedBlocks: DefiningWorldBuildingPlacedBlock[];
  /** Multiplier applied to the default ground shadow opacity. */
  shadowAlphaScale?: number;
}

type RenderingWorldPlazaPlacedBlockTileColumnGroundShadowsProps = {
  readonly tileColumn: GroupingWorldBuildingPlacedBlocksTileColumn;
  readonly shadowAlpha: number;
  readonly drawsBlur: boolean;
};

/**
 * Stable signature for one column's shadow geometry. Used to keep `draw` identity
 * stable across unrelated plaza re-renders (Craft tab, HUD, etc.).
 */
function formattingWorldBuildingPlacedBlockGroundShadowColumnContentKey(
  blocks: readonly DefiningWorldBuildingPlacedBlock[]
): string {
  return blocks
    .map(
      (block) =>
        `${block.blockId}:${block.definitionId}:${block.worldLayer}:${block.blockHeight}`
    )
    .join('|');
}

/**
 * One tile-column shadow pair. Memoized so HUD mode switches do not rebuild
 * Graphics geometry (inline `draw` re-runs clear every parent render otherwise).
 */
const RenderingWorldPlazaPlacedBlockTileColumnGroundShadows = memo(
  function RenderingWorldPlazaPlacedBlockTileColumnGroundShadows({
    tileColumn,
    shadowAlpha,
    drawsBlur,
  }: RenderingWorldPlazaPlacedBlockTileColumnGroundShadowsProps): React.JSX.Element {
    const columnBlocks = tileColumn.blocks;
    const columnContentKey =
      formattingWorldBuildingPlacedBlockGroundShadowColumnContentKey(
        columnBlocks
      );
    const floorSortKey = computingWorldDepthSortKey({
      x: tileColumn.tileX,
      y: tileColumn.tileY,
    });

    const drawingCastLayer = useCallback(
      (graphics: Graphics) => {
        // Never toggle cacheAsTexture here — disableRenderGroup mid-draw corrupts Batcher.
        graphics.clear();

        if (drawsBlur) {
          applyingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics(
            graphics
          );
        } else {
          clearingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics(
            graphics
          );
        }

        drawingWorldBuildingPlacedBlockGroundShadowCastLayerOnGraphics({
          graphics,
          placedBlocks: [...columnBlocks],
        });
      },
      [columnBlocks, columnContentKey, drawsBlur]
    );

    const drawingContactLayer = useCallback(
      (graphics: Graphics) => {
        graphics.clear();
        clearingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics(graphics);
        drawingWorldBuildingPlacedBlockGroundShadowContactLayerOnGraphics({
          graphics,
          placedBlocks: [...columnBlocks],
        });
      },
      [columnBlocks, columnContentKey]
    );

    return (
      <pixiContainer zIndex={floorSortKey} eventMode="none">
        <pixiGraphics alpha={shadowAlpha} draw={drawingCastLayer} />
        <pixiGraphics alpha={shadowAlpha} draw={drawingContactLayer} />
      </pixiContainer>
    );
  }
);

export function RenderingWorldPlazaPlacedBlockGroundShadows({
  placedBlocks,
  shadowAlphaScale = 1,
}: RenderingWorldPlazaPlacedBlockGroundShadowsProps): React.JSX.Element | null {
  const renderLayerFlags =
    usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
  const performanceProfile = usingWorldPlazaPerformanceProfile();
  const sunState = usingWorldPlazaDayNightSunState();
  const shadowAlpha =
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_ALPHA *
    shadowAlphaScale *
    sunState.shadowAlphaScale;
  const tileColumns = useMemo(
    () => groupingWorldBuildingPlacedBlocksByTileColumn(placedBlocks),
    [placedBlocks]
  );

  if (
    !checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.PLACED_BLOCKS,
      renderLayerFlags
    )
  ) {
    return null;
  }

  return (
    <>
      {tileColumns.map((tileColumn) => {
        const tileColumnKey = formattingWorldBuildingPlacedBlocksTileColumnKey(
          tileColumn.tileX,
          tileColumn.tileY
        );

        return (
          <RenderingWorldPlazaPlacedBlockTileColumnGroundShadows
            key={tileColumnKey}
            tileColumn={tileColumn}
            shadowAlpha={shadowAlpha}
            drawsBlur={performanceProfile.drawsPlacedBlockShadowBlur}
          />
        );
      })}
    </>
  );
}
