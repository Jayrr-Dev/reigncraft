'use client';

import { checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering } from '@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering';
import { resolvingWorldBuildingPlacedBlockTopWorldLayer } from '@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { drawingWorldBuildingPlacedBlockColumnOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingPlacedBlocksOnGraphics';
import { filteringWorldBuildingPlacedBlocksInTileBounds } from '@/components/world/building/domains/filteringWorldBuildingPlacedBlocksInTileBounds';
import {
  formattingWorldBuildingPlacedBlocksTileColumnKey,
  groupingWorldBuildingPlacedBlocksByTileColumn,
  type GroupingWorldBuildingPlacedBlocksTileColumn,
} from '@/components/world/building/domains/groupingWorldBuildingPlacedBlocksByTileColumn';
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex';
import { checkingWorldBuildingBlockDefinitionIdIsBlacksmithUtility } from '@/components/world/building/domains/syncingWorldPlazaVisibleBlacksmithUtilityLayer';
import { usingWorldPlazaPlacedBlockRenderCullBounds } from '@/components/world/building/hooks/usingWorldPlazaPlacedBlockRenderCullBounds';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore,
  usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
} from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags';
import type { Graphics } from 'pixi.js';
import { memo, useCallback, useMemo, type RefObject } from 'react';

export type RenderingWorldPlazaPlacedBlocksProps = {
  placedBlocks: DefiningWorldBuildingPlacedBlock[];
  /** Live player position for snapped column mount culling. */
  playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  /** When below 1, entire columns render semi-transparent (claim mode). */
  blockColumnAlpha?: number;
};

type RenderingWorldPlazaPlacedBlockTileColumnProps = {
  readonly tileColumn: GroupingWorldBuildingPlacedBlocksTileColumn;
  readonly blockColumnAlpha: number;
};

/**
 * Stable signature for one column's block geometry so Craft/HUD re-renders do
 * not force @pixi/react to re-run `draw` (clearing Graphics mid-scene corrupts Batcher).
 */
function formattingWorldBuildingPlacedBlockColumnContentKey(
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
 * One depth-sorted tile-column Graphics. Memoized so unrelated plaza re-renders
 * keep a stable `draw` callback identity.
 */
const RenderingWorldPlazaPlacedBlockTileColumn = memo(
  function RenderingWorldPlazaPlacedBlockTileColumn({
    tileColumn,
    blockColumnAlpha,
  }: RenderingWorldPlazaPlacedBlockTileColumnProps): React.JSX.Element {
    const columnContentKey = formattingWorldBuildingPlacedBlockColumnContentKey(
      tileColumn.blocks
    );
    const tileColumnTopWorldLayer = tileColumn.blocks.reduce(
      (highestWorldLayer, block) =>
        Math.max(
          highestWorldLayer,
          resolvingWorldBuildingPlacedBlockTopWorldLayer(block)
        ),
      0
    );
    const tileColumnZIndex =
      resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
        tileColumn.tileX,
        tileColumn.tileY,
        tileColumnTopWorldLayer
      );

    const drawingColumn = useCallback(
      (graphics: Graphics) => {
        graphics.clear();
        drawingWorldBuildingPlacedBlockColumnOnGraphics(graphics, tileColumn);
      },
      [columnContentKey, tileColumn]
    );

    return (
      <pixiGraphics
        eventMode="none"
        alpha={blockColumnAlpha}
        zIndex={tileColumnZIndex}
        draw={drawingColumn}
      />
    );
  }
);

/**
 * Renders persisted player-placed blocks as one depth-sorted graphics per tile
 * column, so avatars sort correctly in front of or behind each stack.
 */
export function RenderingWorldPlazaPlacedBlocks({
  placedBlocks,
  playerPositionRef,
  blockColumnAlpha = 1,
}: RenderingWorldPlazaPlacedBlocksProps): React.JSX.Element | null {
  const renderLayerFlags =
    usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
  const cullBounds =
    usingWorldPlazaPlacedBlockRenderCullBounds(playerPositionRef);
  const placedBlocksInCullWindow = useMemo(
    () =>
      filteringWorldBuildingPlacedBlocksInTileBounds(placedBlocks, cullBounds),
    [cullBounds, placedBlocks]
  );
  const placedBlocksWithoutSpriteLayers = useMemo(
    () =>
      placedBlocksInCullWindow.filter(
        (block) =>
          !checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering(block) &&
          !checkingWorldBuildingBlockDefinitionIdIsBlacksmithUtility(
            block.definitionId
          )
      ),
    [placedBlocksInCullWindow]
  );
  const tileColumns = useMemo(
    () =>
      groupingWorldBuildingPlacedBlocksByTileColumn(
        placedBlocksWithoutSpriteLayers
      ),
    [placedBlocksWithoutSpriteLayers]
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
          <RenderingWorldPlazaPlacedBlockTileColumn
            key={tileColumnKey}
            tileColumn={tileColumn}
            blockColumnAlpha={blockColumnAlpha}
          />
        );
      })}
    </>
  );
}
