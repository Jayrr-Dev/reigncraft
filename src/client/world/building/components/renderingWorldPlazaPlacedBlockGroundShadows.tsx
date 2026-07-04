"use client";

import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import {
  applyingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics,
  clearingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics,
} from "@/components/world/building/domains/applyingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics";
import { DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_ALPHA } from "@/components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowConstants";
import {
  drawingWorldBuildingPlacedBlockGroundShadowCastLayerOnGraphics,
  drawingWorldBuildingPlacedBlockGroundShadowContactLayerOnGraphics,
} from "@/components/world/building/domains/drawingWorldBuildingPlacedBlockGroundShadowLayerOnGraphics";
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from "@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants";
import { usingWorldPlazaDayNightSunState } from "@/components/world/hooks/usingWorldPlazaDayNightSunState";
import {
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore,
  usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
} from "@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags";
import type { Graphics } from "pixi.js";

/**
 * Renders block shadows with blur only on the cast away from the object.
 *
 * Cast tongues are blurred. The footprint under the block is drawn on top
 * without blur so the contact edge stays dark.
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
  // Re-renders when the sun bucket advances so the cast direction, length,
  // and strength track the day/night cycle.
  const sunState = usingWorldPlazaDayNightSunState();
  const shadowAlpha =
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_ALPHA *
    shadowAlphaScale *
    sunState.shadowAlphaScale;

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
      <pixiGraphics
        eventMode="none"
        alpha={shadowAlpha}
        draw={(graphics: Graphics) => {
          graphics.clear();
          applyingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics(graphics);
          drawingWorldBuildingPlacedBlockGroundShadowCastLayerOnGraphics({
            graphics,
            placedBlocks,
          });
        }}
      />
      <pixiGraphics
        eventMode="none"
        alpha={shadowAlpha}
        draw={(graphics: Graphics) => {
          graphics.clear();
          clearingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics(graphics);
          drawingWorldBuildingPlacedBlockGroundShadowContactLayerOnGraphics({
            graphics,
            placedBlocks,
          });
        }}
      />
    </>
  );
}
