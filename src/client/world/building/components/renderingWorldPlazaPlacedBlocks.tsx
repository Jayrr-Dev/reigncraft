'use client';

import { checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering } from '@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering';
import { resolvingWorldBuildingPlacedBlockTopWorldLayer } from '@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { drawingWorldBuildingPlacedBlockColumnOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingPlacedBlocksOnGraphics';
import {
  formattingWorldBuildingPlacedBlocksTileColumnKey,
  groupingWorldBuildingPlacedBlocksByTileColumn,
  type GroupingWorldBuildingPlacedBlocksTileColumn,
} from '@/components/world/building/domains/groupingWorldBuildingPlacedBlocksByTileColumn';
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex';
import { checkingWorldBuildingBlockDefinitionIdIsBlacksmithUtility } from '@/components/world/building/domains/syncingWorldPlazaVisibleBlacksmithUtilityLayer';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import {
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore,
  usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
} from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags';
import type { Graphics } from 'pixi.js';
import { memo, useCallback, useMemo } from 'react';

export interface RenderingWorldPlazaPlacedBlocksProps {
  placedBlocks: DefiningWorldBuildingPlacedBlock[];
  /** When below 1, entire columns render semi-transparent (claim mode). */
  blockColumnAlpha?: number;
}

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
  blockColumnAlpha = 1,
}: RenderingWorldPlazaPlacedBlocksProps): React.JSX.Element | null {
  const renderLayerFlags =
    usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
  const placedBlocksWithoutSpriteLayers = useMemo(
    () =>
      placedBlocks.filter(
        (block) =>
          !checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering(block) &&
          !checkingWorldBuildingBlockDefinitionIdIsBlacksmithUtility(
            block.definitionId
          )
      ),
    [placedBlocks]
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
