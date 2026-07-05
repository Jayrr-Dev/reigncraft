"use client";

/**
 * Dashed black tile outline for the selected inventory drop target.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryDropTileOutlinePreview
 */

import { checkingWorldPlazaPixiApplicationIsReady } from "@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady";
import {
  computingWorldDepthSortKey,
  DEFINING_WORLD_DEPTH_INVENTORY_DROP_TILE_OUTLINE_Z_INDEX_OFFSET,
} from "@/components/world/depth";
import { drawingWorldPlazaInventoryDropTileOutlineOnGraphics } from "@/components/world/inventory/domains/drawingWorldPlazaInventoryDropTileOutlineOnGraphics";
import type { DefiningWorldPlazaInventoryDropPreviewTile } from "@/components/world/inventory/domains/definingWorldPlazaInventoryDropPlacement";
import { useApplication, useTick } from "@pixi/react";
import type { Graphics } from "pixi.js";
import { useCallback, useRef } from "react";

/** Props for {@link RenderingWorldPlazaInventoryDropTileOutlinePreview}. */
export interface RenderingWorldPlazaInventoryDropTileOutlinePreviewProps {
  /** Tile to outline for the current drag or pending drop. */
  readonly dropMarkerTileRef: React.RefObject<DefiningWorldPlazaInventoryDropPreviewTile | null>;
}

/**
 * Pixi overlay that draws a dashed black diamond on the selected drop tile.
 */
export function RenderingWorldPlazaInventoryDropTileOutlinePreview({
  dropMarkerTileRef,
}: RenderingWorldPlazaInventoryDropTileOutlinePreviewProps): React.JSX.Element {
  const outlineGraphicsRef = useRef<Graphics | null>(null);
  const applicationContext = useApplication();

  const initializingOutlineGraphics = useCallback((graphics: Graphics): void => {
    outlineGraphicsRef.current = graphics;
  }, []);

  useTick(() => {
    const graphics = outlineGraphicsRef.current;

    if (
      !graphics ||
      !checkingWorldPlazaPixiApplicationIsReady(applicationContext)
    ) {
      if (graphics) {
        graphics.clear();
      }

      return;
    }

    graphics.clear();

    const markerTile = dropMarkerTileRef.current;

    if (!markerTile) {
      return;
    }

    graphics.zIndex =
      computingWorldDepthSortKey({
        x: markerTile.tileX,
        y: markerTile.tileY,
      }) + DEFINING_WORLD_DEPTH_INVENTORY_DROP_TILE_OUTLINE_Z_INDEX_OFFSET;

    drawingWorldPlazaInventoryDropTileOutlineOnGraphics(
      graphics,
      markerTile.tileX,
      markerTile.tileY,
    );
  });

  return (
    <pixiGraphics
      draw={initializingOutlineGraphics}
      eventMode="none"
      zIndex={0}
    />
  );
}
