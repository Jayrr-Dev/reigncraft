'use client';

import {
  applyingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics,
  clearingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics,
} from '@/components/world/building/domains/applyingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_ALPHA } from '@/components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowConstants';
import {
  drawingWorldBuildingPlacedBlockGroundShadowCastLayerForTileColumnOnGraphics,
  drawingWorldBuildingPlacedBlockGroundShadowContactLayerForTileColumnOnGraphics,
} from '@/components/world/building/domains/drawingWorldBuildingPlacedBlockGroundShadowLayerOnGraphics';
import { filteringWorldBuildingPlacedBlocksInTileBounds } from '@/components/world/building/domains/filteringWorldBuildingPlacedBlocksInTileBounds';
import {
  formattingWorldBuildingPlacedBlocksTileColumnKey,
  groupingWorldBuildingPlacedBlocksByTileColumn,
  type GroupingWorldBuildingPlacedBlocksTileColumn,
} from '@/components/world/building/domains/groupingWorldBuildingPlacedBlocksByTileColumn';
import { usingWorldPlazaPlacedBlockRenderCullBounds } from '@/components/world/building/hooks/usingWorldPlazaPlacedBlockRenderCullBounds';
import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import { computingWorldDepthSortKey } from '@/components/world/depth';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import {
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore,
  usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
} from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags';
import type { Graphics } from 'pixi.js';
import { memo, useCallback, useMemo, type RefObject } from 'react';

/**
 * Renders block shadows with blur only on the cast away from the object.
 *
 * Each tile column sorts on the floor layer by grid depth so shadows interleave
 * correctly with grass chunks and avatars.
 *
 * @module components/world/building/components/renderingWorldPlazaPlacedBlockGroundShadows
 */

export type RenderingWorldPlazaPlacedBlockGroundShadowsProps = {
  placedBlocks: DefiningWorldBuildingPlacedBlock[];
  /** Live player position for snapped column mount culling. */
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  /** Multiplier applied to the default ground shadow opacity. */
  shadowAlphaScale?: number;
};

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
    const columnContentKey =
      formattingWorldBuildingPlacedBlockGroundShadowColumnContentKey(
        tileColumn.blocks
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

        drawingWorldBuildingPlacedBlockGroundShadowCastLayerForTileColumnOnGraphics(
          {
            graphics,
            tileColumn,
          }
        );
      },
      [columnContentKey, drawsBlur, tileColumn]
    );

    const drawingContactLayer = useCallback(
      (graphics: Graphics) => {
        graphics.clear();
        clearingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics(graphics);
        drawingWorldBuildingPlacedBlockGroundShadowContactLayerForTileColumnOnGraphics(
          {
            graphics,
            tileColumn,
          }
        );
      },
      [columnContentKey, tileColumn]
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
  playerPositionRef,
  shadowAlphaScale = 1,
}: RenderingWorldPlazaPlacedBlockGroundShadowsProps): React.JSX.Element | null {
  const renderLayerFlags =
    usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
  const performanceProfile = usingWorldPlazaPerformanceProfile();
  const sunState = usingWorldPlazaDayNightSunState();
  const cullBounds =
    usingWorldPlazaPlacedBlockRenderCullBounds(playerPositionRef);
  const shadowAlpha =
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_ALPHA *
    shadowAlphaScale *
    sunState.shadowAlphaScale;
  const placedBlocksInCullWindow = useMemo(
    () =>
      filteringWorldBuildingPlacedBlocksInTileBounds(placedBlocks, cullBounds),
    [cullBounds, placedBlocks]
  );
  const tileColumns = useMemo(
    () =>
      groupingWorldBuildingPlacedBlocksByTileColumn(placedBlocksInCullWindow),
    [placedBlocksInCullWindow]
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
