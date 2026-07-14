'use client';

import { checkingWorldBuildingPlacementPreviewUsesClaimTile } from '@/components/world/building/domains/checkingWorldBuildingPlacementPreviewUsesClaimTile';
import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX } from '@/components/world/building/domains/definingWorldBuildingBuildModeConstants';
import {
  DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
  type DefiningWorldBuildingCutGridAxisCellCount,
} from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
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
  /** True only in claim mode. Ground-layer build previews must not use claim tiles. */
  isClaimModePreview: boolean;
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
 *
 * Blacksmith utility sprites are drawn by {@link RenderingWorldPlazaBlacksmithUtilityLayer}
 * from a synthetic preview block; this graphics layer keeps the validity wash.
 */
export function RenderingWorldPlazaBlockPlacementPreview({
  isVisible,
  isClaimModePreview,
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

    // Claim mode alone owns the blue claimable tile wash. Ground-layer build
    // placement also uses layer 1, so never infer claim preview from world layer.
    if (
      checkingWorldBuildingPlacementPreviewUsesClaimTile({
        isClaimModeActive: isClaimModePreview,
        previewWorldLayer,
      })
    ) {
      graphics.zIndex =
        resolvingWorldBuildingClaimModePlotOverlayEntityZIndex(
          previewTilePosition
        );
      drawingWorldBuildingPlotClaimPreviewOnGraphics(
        graphics,
        previewTilePosition.tileX,
        previewTilePosition.tileY,
        isPreviewValid
      );
      return;
    }

    // Build ghosts must remain visible above plot ownership tiles, terrain,
    // blocks, and avatars. Claim previews retain their depth-sorted layer.
    graphics.zIndex = DEFINING_WORLD_BUILDING_PLACEMENT_PREVIEW_Z_INDEX;

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
