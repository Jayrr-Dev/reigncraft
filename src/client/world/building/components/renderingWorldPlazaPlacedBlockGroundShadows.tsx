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
} from '@/components/world/building/domains/groupingWorldBuildingPlacedBlocksByTileColumn';
import { computingWorldDepthSortKey } from '@/components/world/depth';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import {
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore,
  usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
} from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags';
import type { Graphics } from 'pixi.js';

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

export function RenderingWorldPlazaPlacedBlockGroundShadows({
  placedBlocks,
  shadowAlphaScale = 1,
}: RenderingWorldPlazaPlacedBlockGroundShadowsProps): React.JSX.Element | null {
  const renderLayerFlags =
    usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
  const sunState = usingWorldPlazaDayNightSunState();
  const shadowAlpha =
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_ALPHA *
    shadowAlphaScale *
    sunState.shadowAlphaScale;
  const tileColumns = groupingWorldBuildingPlacedBlocksByTileColumn(placedBlocks);

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
        const columnBlocks = tileColumn.blocks;
        const floorSortKey = computingWorldDepthSortKey({
          x: tileColumn.tileX,
          y: tileColumn.tileY,
        });

        return (
          <pixiContainer key={tileColumnKey} zIndex={floorSortKey} eventMode="none">
            <pixiGraphics
              alpha={shadowAlpha}
              draw={(graphics: Graphics) => {
                graphics.cacheAsTexture(false);
                graphics.clear();
                applyingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics(
                  graphics
                );
                drawingWorldBuildingPlacedBlockGroundShadowCastLayerOnGraphics({
                  graphics,
                  placedBlocks: [...columnBlocks],
                });
                graphics.cacheAsTexture(true);
              }}
            />
            <pixiGraphics
              alpha={shadowAlpha}
              draw={(graphics: Graphics) => {
                graphics.clear();
                clearingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics(
                  graphics
                );
                drawingWorldBuildingPlacedBlockGroundShadowContactLayerOnGraphics(
                  {
                    graphics,
                    placedBlocks: [...columnBlocks],
                  }
                );
              }}
            />
          </pixiContainer>
        );
      })}
    </>
  );
}
