"use client";

import type { DefiningWorldBuildingPlot } from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import { drawingWorldBuildingPlotClaimFlatTileOnGraphics } from "@/components/world/building/domains/drawingWorldBuildingPlotClaimFlatTileOnGraphics";
import { listingWorldBuildingClaimModeOverlayTileDraws } from "@/components/world/building/domains/listingWorldBuildingClaimModeOverlayTileDraws";
import { formattingWorldBuildingPlotListCacheKey } from "@/components/world/building/domains/formattingWorldBuildingPlotListCacheKey";
import {
  resolvingWorldBuildingClaimModePlotOverlayFloorZIndex,
  resolvingWorldBuildingClaimModePlotOverlayZIndex,
  type ResolvingWorldBuildingClaimModePlotOverlayRenderLayer,
} from "@/components/world/building/domains/resolvingWorldBuildingClaimModePlotOverlayZIndex";
import { checkingWorldPlazaPixiApplicationIsReady } from "@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady";
import { useApplication, useTick } from "@pixi/react";
import type { Graphics } from "pixi.js";
import { useCallback, useMemo, useRef } from "react";

export interface RenderingWorldPlazaClaimModePlotOwnershipOverlayProps {
  isVisible: boolean;
  overlayPlots: readonly DefiningWorldBuildingPlot[];
  localUserId: string | null;
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits;
  renderLayer: ResolvingWorldBuildingClaimModePlotOverlayRenderLayer;
}

/**
 * Draws claim-mode tiles on the floor or entity layer with per-tile depth sorting.
 */
export function RenderingWorldPlazaClaimModePlotOwnershipOverlay({
  isVisible,
  overlayPlots,
  localUserId,
  plotOwnerLimits,
  renderLayer,
}: RenderingWorldPlazaClaimModePlotOwnershipOverlayProps): React.JSX.Element | null {
  const floorClaimGraphicsRef = useRef<Graphics | null>(null);
  const lastFloorDrawKeyRef = useRef("");
  const applicationContext = useApplication();

  const overlayTileDraws = useMemo(() => {
    return listingWorldBuildingClaimModeOverlayTileDraws(
      overlayPlots,
      localUserId,
      plotOwnerLimits,
    ).filter((overlayTileDraw) => overlayTileDraw.renderLayer === renderLayer);
  }, [localUserId, overlayPlots, plotOwnerLimits, renderLayer]);

  const floorDrawKey = useMemo(() => {
    if (renderLayer !== "floor") {
      return "";
    }

    return overlayTileDraws
      .map(
        (overlayTileDraw) =>
          `${overlayTileDraw.tileKey}:${overlayTileDraw.fillColor}:${overlayTileDraw.fillAlpha}:${overlayTileDraw.strokeColor ?? ""}`,
      )
      .join("|");
  }, [overlayTileDraws, renderLayer]);

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

    const plotDrawKey = `${localUserId ?? "anon"}:${formattingWorldBuildingPlotListCacheKey(overlayPlots)}:${floorDrawKey}`;

    if (plotDrawKey === lastFloorDrawKeyRef.current) {
      return;
    }

    lastFloorDrawKeyRef.current = plotDrawKey;
    graphics.clear();

    const sortedFloorTileDraws = [...overlayTileDraws].sort(
      (tileDrawA, tileDrawB) => {
        const depthSortKeyA =
          tileDrawA.tilePosition.tileX + tileDrawA.tilePosition.tileY;
        const depthSortKeyB =
          tileDrawB.tilePosition.tileX + tileDrawB.tilePosition.tileY;

        return depthSortKeyB - depthSortKeyA;
      },
    );

    for (const overlayTileDraw of sortedFloorTileDraws) {
      drawingWorldBuildingPlotClaimFlatTileOnGraphics({
        graphics,
        tileX: overlayTileDraw.tilePosition.tileX,
        tileY: overlayTileDraw.tilePosition.tileY,
        fillColor: overlayTileDraw.fillColor,
        fillAlpha: overlayTileDraw.fillAlpha,
        strokeColor: overlayTileDraw.strokeColor,
        renderLayer: "floor",
      });
    }
  });

  if (!isVisible || overlayTileDraws.length === 0) {
    return null;
  }

  if (renderLayer === "floor") {
    return (
      <pixiGraphics draw={initializingFloorClaimGraphics} eventMode="none" />
    );
  }

  return (
    <>
      {overlayTileDraws.map((overlayTileDraw) => (
        <pixiGraphics
          key={`${renderLayer}:${overlayTileDraw.tileKey}`}
          eventMode="none"
          zIndex={resolvingWorldBuildingClaimModePlotOverlayZIndex(
            overlayTileDraw.tilePosition,
            renderLayer,
          )}
          draw={(graphics: Graphics) => {
            graphics.clear();
            drawingWorldBuildingPlotClaimFlatTileOnGraphics({
              graphics,
              tileX: overlayTileDraw.tilePosition.tileX,
              tileY: overlayTileDraw.tilePosition.tileY,
              fillColor: overlayTileDraw.fillColor,
              fillAlpha: overlayTileDraw.fillAlpha,
              strokeColor: overlayTileDraw.strokeColor,
              renderLayer,
            });
          }}
        />
      ))}
    </>
  );
}
