'use client';

import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX } from '@/components/world/building/domains/definingWorldBuildingBuildModeConstants';
import {
  DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
  type DefiningWorldBuildingCutGridAxisCellCount,
} from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import { DEFINING_WORLD_BUILDING_PLOT_CLAIM_WORLD_LAYER } from '@/components/world/building/domains/definingWorldBuildingPlotClaimConstants';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_BUILD_DEFAULT } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { drawingWorldBuildingPlacementPreviewOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingPlacedBlocksOnGraphics';
import { drawingWorldBuildingPlotClaimPreviewOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingPlotClaimTilesOnGraphics';
import { resolvingWorldBuildingClaimModePlotOverlayEntityZIndex } from '@/components/world/building/domains/resolvingWorldBuildingClaimModePlotOverlayZIndex';
import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { useApplication } from '@pixi/react';
import type { Graphics } from 'pixi.js';
import { useCallback, useRef } from 'react';

export interface RenderingWorldPlazaBlockPlacementPreviewProps {
  isVisible: boolean;
  previewTilePositionRef: React.RefObject<DefiningWorldBuildingTilePosition | null>;
  isPreviewTileValidRef: React.RefObject<boolean>;
  previewWorldLayerRef: React.RefObject<number>;
  previewBlockHeightRef: React.RefObject<number>;
  previewCutFootprintMaskRef: React.RefObject<number>;
  previewCutGridAxisCellCountRef: React.RefObject<DefiningWorldBuildingCutGridAxisCellCount>;
  previewDefinitionIdRef: React.RefObject<DefiningWorldBuildingBlockDefinitionId | null>;
}

/**
 * Ghost tile preview for build mode placement and claim selection.
 */
export function RenderingWorldPlazaBlockPlacementPreview({
  isVisible,
  previewTilePositionRef,
  isPreviewTileValidRef,
  previewWorldLayerRef,
  previewBlockHeightRef,
  previewCutFootprintMaskRef,
  previewCutGridAxisCellCountRef,
  previewDefinitionIdRef,
}: RenderingWorldPlazaBlockPlacementPreviewProps): React.JSX.Element | null {
  const previewGraphicsRef = useRef<Graphics | null>(null);
  const applicationContext = useApplication();

  const initializingPreviewGraphics = useCallback(
    (graphics: Graphics): void => {
      previewGraphicsRef.current = graphics;
      graphics.visible = isVisible;
    },
    [isVisible]
  );

  usingWorldPlazaSafeTick(() => {
    const graphics = previewGraphicsRef.current;

    if (
      !graphics ||
      !isVisible ||
      !checkingWorldPlazaPixiApplicationIsReady(applicationContext)
    ) {
      return;
    }

    graphics.clear();

    const previewTilePosition = previewTilePositionRef.current;

    if (!previewTilePosition) {
      return;
    }

    graphics.zIndex =
      resolvingWorldBuildingClaimModePlotOverlayEntityZIndex(
        previewTilePosition
      );

    const isPreviewValid = isPreviewTileValidRef.current ?? false;
    const previewWorldLayer =
      previewWorldLayerRef.current ??
      DEFINING_WORLD_BUILDING_WORLD_LAYER_BUILD_DEFAULT;
    const previewBlockHeight =
      previewBlockHeightRef.current ??
      DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT;
    const previewCutFootprintMask =
      previewCutFootprintMaskRef.current ??
      DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK;
    const previewCutGridAxisCellCount =
      previewCutGridAxisCellCountRef.current ??
      DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT;

    if (previewWorldLayer === DEFINING_WORLD_BUILDING_PLOT_CLAIM_WORLD_LAYER) {
      drawingWorldBuildingPlotClaimPreviewOnGraphics(
        graphics,
        previewTilePosition.tileX,
        previewTilePosition.tileY,
        isPreviewValid
      );
      return;
    }

    drawingWorldBuildingPlacementPreviewOnGraphics(
      graphics,
      previewTilePosition.tileX,
      previewTilePosition.tileY,
      isPreviewValid,
      previewWorldLayer,
      previewBlockHeight,
      previewCutFootprintMask,
      previewCutGridAxisCellCount,
      previewDefinitionIdRef.current
    );
  }, 'tick:block-placement-preview');

  if (!isVisible) {
    return null;
  }

  return (
    <pixiGraphics
      draw={initializingPreviewGraphics}
      eventMode="none"
      zIndex={DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX}
    />
  );
}
