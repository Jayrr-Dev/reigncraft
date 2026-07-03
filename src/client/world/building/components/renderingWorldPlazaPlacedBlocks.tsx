"use client";

import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering } from "@/components/world/building/domains/checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering";
import { drawingWorldBuildingPlacedBlockColumnOnGraphics } from "@/components/world/building/domains/drawingWorldBuildingPlacedBlocksOnGraphics";
import {
  formattingWorldBuildingPlacedBlocksTileColumnKey,
  groupingWorldBuildingPlacedBlocksByTileColumn,
} from "@/components/world/building/domains/groupingWorldBuildingPlacedBlocksByTileColumn";
import { resolvingWorldBuildingPlacedBlockColumnEntityZIndex } from "@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnEntityZIndex";
import { resolvingWorldBuildingPlacedBlockTopWorldLayer } from "@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand";
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from "@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants";
import {
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore,
  usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
} from "@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags";
import type { Graphics } from "pixi.js";
import { useMemo } from "react";

export interface RenderingWorldPlazaPlacedBlocksProps {
  placedBlocks: DefiningWorldBuildingPlacedBlock[];
  /** When below 1, entire columns render semi-transparent (claim mode). */
  blockColumnAlpha?: number;
}

/**
 * Renders persisted player-placed blocks as one depth-sorted graphics per tile
 * column, so avatars sort correctly in front of or behind each stack.
 */
export function RenderingWorldPlazaPlacedBlocks({
  placedBlocks,
  blockColumnAlpha = 1,
}: RenderingWorldPlazaPlacedBlocksProps): React.JSX.Element | null {
  const renderLayerFlags = usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
  const placedBlocksWithoutProceduralTrees = useMemo(
    () =>
      placedBlocks.filter(
        (block) => !checkingWorldBuildingPlacedBlockUsesProceduralTreeRendering(block),
      ),
    [placedBlocks],
  );
  const tileColumns = useMemo(
    () => groupingWorldBuildingPlacedBlocksByTileColumn(placedBlocksWithoutProceduralTrees),
    [placedBlocksWithoutProceduralTrees],
  );

  if (
    !checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.PLACED_BLOCKS,
      renderLayerFlags,
    )
  ) {
    return null;
  }

  return (
    <>
      {tileColumns.map((tileColumn) => {
        const tileColumnKey = formattingWorldBuildingPlacedBlocksTileColumnKey(
          tileColumn.tileX,
          tileColumn.tileY,
        );
        const tileColumnTopWorldLayer = tileColumn.blocks.reduce(
          (highestWorldLayer, block) =>
            Math.max(
              highestWorldLayer,
              resolvingWorldBuildingPlacedBlockTopWorldLayer(block),
            ),
          0,
        );
        const tileColumnZIndex = resolvingWorldBuildingPlacedBlockColumnEntityZIndex(
          tileColumn.tileX,
          tileColumn.tileY,
          tileColumnTopWorldLayer,
        );

        return (
          <pixiGraphics
            key={tileColumnKey}
            eventMode="none"
            alpha={blockColumnAlpha}
            zIndex={tileColumnZIndex}
            draw={(graphics: Graphics) => {
              graphics.clear();
              drawingWorldBuildingPlacedBlockColumnOnGraphics(
                graphics,
                tileColumn,
              );
            }}
          />
        );
      })}
    </>
  );
}
