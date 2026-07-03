"use client";

import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import {
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_FILL_COLOR,
  DEFINING_WORLD_BUILDING_PLOT_CLAIM_TOP_FILL_ALPHA,
} from "@/components/world/building/domains/definingWorldBuildingPlotClaimConstants";
import {
  drawingWorldBuildingPlotClaimFlatTileOnGraphics,
  resolvingWorldBuildingPlotClaimOverlayRenderLayer,
} from "@/components/world/building/domains/drawingWorldBuildingPlotClaimFlatTileOnGraphics";
import {
  resolvingWorldBuildingClaimModePlotOverlayFloorZIndex,
  resolvingWorldBuildingClaimModePlotOverlayZIndex,
  type ResolvingWorldBuildingClaimModePlotOverlayRenderLayer,
} from "@/components/world/building/domains/resolvingWorldBuildingClaimModePlotOverlayZIndex";
import { checkingWorldPlazaPixiApplicationIsReady } from "@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady";
import { useApplication, useTick } from "@pixi/react";
import type { Graphics } from "pixi.js";
import { useCallback, useMemo, useRef } from "react";

export interface RenderingWorldPlazaPlotBoundariesProps {
  isVisible: boolean;
  ownedPlots: readonly DefiningWorldBuildingPlot[];
  renderLayer: ResolvingWorldBuildingClaimModePlotOverlayRenderLayer;
}

interface RenderingWorldPlazaPlotBoundaryTileDraw {
  tileX: number;
  tileY: number;
  tileKey: string;
}

/**
 * Lists owned plot tiles that belong to the requested render layer.
 *
 * Tiles on (or bordering) raised terrain promote to the entity layer so the
 * marker can extrude up the cliff face, matching claim-mode overlays. Flat
 * ground tiles stay on the floor layer.
 *
 * @param ownedPlots - Owned build plots in the viewport.
 * @param renderLayer - Floor or entity layer target.
 */
function listingWorldPlazaPlotBoundaryTileDraws(
  ownedPlots: readonly DefiningWorldBuildingPlot[],
  renderLayer: ResolvingWorldBuildingClaimModePlotOverlayRenderLayer,
): RenderingWorldPlazaPlotBoundaryTileDraw[] {
  const tileDraws: RenderingWorldPlazaPlotBoundaryTileDraw[] = [];

  for (const plot of ownedPlots) {
    for (
      let tileY = plot.bounds.minTileY;
      tileY <= plot.bounds.maxTileY;
      tileY += 1
    ) {
      for (
        let tileX = plot.bounds.minTileX;
        tileX <= plot.bounds.maxTileX;
        tileX += 1
      ) {
        if (
          resolvingWorldBuildingPlotClaimOverlayRenderLayer(tileX, tileY) !==
          renderLayer
        ) {
          continue;
        }

        tileDraws.push({ tileX, tileY, tileKey: `${tileX},${tileY}` });
      }
    }
  }

  return tileDraws;
}

/**
 * Draws owned plot claim tiles with per-tile depth sorting in build mode.
 *
 * Mirrors the claim-mode overlay: flat ground tiles batch onto the floor layer,
 * while tiles on raised terrain render individually on the entity layer so cliff
 * faces never clip the marker.
 */
export function RenderingWorldPlazaPlotBoundaries({
  isVisible,
  ownedPlots,
  renderLayer,
}: RenderingWorldPlazaPlotBoundariesProps): React.JSX.Element | null {
  const floorClaimGraphicsRef = useRef<Graphics | null>(null);
  const lastFloorDrawKeyRef = useRef("");
  const applicationContext = useApplication();

  const plotBoundaryTileDraws = useMemo(() => {
    return listingWorldPlazaPlotBoundaryTileDraws(ownedPlots, renderLayer);
  }, [ownedPlots, renderLayer]);

  const floorDrawKey = useMemo(() => {
    if (renderLayer !== "floor") {
      return "";
    }

    return plotBoundaryTileDraws
      .map((tileDraw) => tileDraw.tileKey)
      .join("|");
  }, [plotBoundaryTileDraws, renderLayer]);

  const initializingFloorClaimGraphics = useCallback(
    (graphics: Graphics): void => {
      floorClaimGraphicsRef.current = graphics;
      graphics.visible = isVisible;
      graphics.zIndex = resolvingWorldBuildingClaimModePlotOverlayFloorZIndex({
        tileX: 0,
        tileY: 0,
      });
      lastFloorDrawKeyRef.current = "";
    },
    [isVisible],
  );

  useTick(() => {
    if (renderLayer !== "floor") {
      return;
    }

    const graphics = floorClaimGraphicsRef.current;

    if (
      !graphics ||
      !isVisible ||
      !checkingWorldPlazaPixiApplicationIsReady(applicationContext)
    ) {
      return;
    }

    if (floorDrawKey === lastFloorDrawKeyRef.current) {
      return;
    }

    lastFloorDrawKeyRef.current = floorDrawKey;
    graphics.clear();

    const sortedFloorTileDraws = [...plotBoundaryTileDraws].sort(
      (tileDrawA, tileDrawB) =>
        tileDrawB.tileX + tileDrawB.tileY - (tileDrawA.tileX + tileDrawA.tileY),
    );

    for (const tileDraw of sortedFloorTileDraws) {
      drawingWorldBuildingPlotClaimFlatTileOnGraphics({
        graphics,
        tileX: tileDraw.tileX,
        tileY: tileDraw.tileY,
        fillColor: DEFINING_WORLD_BUILDING_PLOT_CLAIM_FILL_COLOR,
        fillAlpha: DEFINING_WORLD_BUILDING_PLOT_CLAIM_TOP_FILL_ALPHA,
        renderLayer: "floor",
      });
    }
  });

  if (!isVisible || plotBoundaryTileDraws.length === 0) {
    return null;
  }

  if (renderLayer === "floor") {
    return (
      <pixiGraphics draw={initializingFloorClaimGraphics} eventMode="none" />
    );
  }

  return (
    <>
      {plotBoundaryTileDraws.map((tileDraw) => (
        <pixiGraphics
          key={`${renderLayer}:${tileDraw.tileKey}`}
          eventMode="none"
          zIndex={resolvingWorldBuildingClaimModePlotOverlayZIndex(
            { tileX: tileDraw.tileX, tileY: tileDraw.tileY },
            renderLayer,
          )}
          draw={(graphics: Graphics) => {
            graphics.clear();
            drawingWorldBuildingPlotClaimFlatTileOnGraphics({
              graphics,
              tileX: tileDraw.tileX,
              tileY: tileDraw.tileY,
              fillColor: DEFINING_WORLD_BUILDING_PLOT_CLAIM_FILL_COLOR,
              fillAlpha: DEFINING_WORLD_BUILDING_PLOT_CLAIM_TOP_FILL_ALPHA,
              renderLayer,
            });
          }}
        />
      ))}
    </>
  );
}
