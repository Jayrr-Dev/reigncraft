"use client";

/**
 * Lucide drop-arrow marker for inventory ground placement.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryDropArrowOverlay
 */

import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import { computingWorldPlazaViewportHudScaledPx } from "@/components/world/domains/computingWorldPlazaViewportHudScale";
import {
  DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ARROW_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ARROW_BOB_AMPLITUDE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ARROW_BOB_PERIOD_MS,
  STYLING_WORLD_PLAZA_INVENTORY_DROP_ARROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_DROP_ARROW_ROOT_CLASS_NAME,
} from "@/components/world/inventory/domains/definingWorldPlazaInventoryDropConstants";
import type { DefiningWorldPlazaInventoryDropPreviewTile } from "@/components/world/inventory/domains/definingWorldPlazaInventoryDropPlacement";
import { resolvingWorldPlazaInventoryDropMarkerScreenPoint } from "@/components/world/inventory/domains/resolvingWorldPlazaInventoryDropMarkerScreenPoint";
import { ArrowDown } from "lucide-react";
import { useLayoutEffect, useMemo, useRef } from "react";

/** Off-screen default before the first animation frame positions the marker. */
const RENDERING_WORLD_PLAZA_INVENTORY_DROP_ARROW_HIDDEN_TRANSFORM =
  "translate(-9999px, -9999px)" as const;

/** Props for {@link RenderingWorldPlazaInventoryDropArrowOverlay}. */
export interface RenderingWorldPlazaInventoryDropArrowOverlayProps {
  /** Tile to mark for the current drag or pending drop. */
  readonly dropMarkerTileRef: React.RefObject<DefiningWorldPlazaInventoryDropPreviewTile | null>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly viewportHudScale?: number;
}

/**
 * DOM overlay with a bouncing Lucide down arrow at the inventory drop tile.
 */
export function RenderingWorldPlazaInventoryDropArrowOverlay({
  dropMarkerTileRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  viewportHudScale = 1,
}: RenderingWorldPlazaInventoryDropArrowOverlayProps): React.JSX.Element {
  const markerRootRef = useRef<HTMLDivElement | null>(null);

  const arrowSizePx = useMemo(
    () =>
      computingWorldPlazaViewportHudScaledPx(
        DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ARROW_BASE_PX,
        viewportHudScale,
      ),
    [viewportHudScale],
  );

  useLayoutEffect(() => {
    let animationFrameId = 0;
    let isActive = true;

    const updatingDropArrowMarker = (): void => {
      if (!isActive) {
        return;
      }

      const markerRoot = markerRootRef.current;
      const markerTile = dropMarkerTileRef.current;

      if (!markerRoot) {
        animationFrameId = window.requestAnimationFrame(updatingDropArrowMarker);
        return;
      }

      if (!markerTile) {
        markerRoot.style.transform =
          RENDERING_WORLD_PLAZA_INVENTORY_DROP_ARROW_HIDDEN_TRANSFORM;
        animationFrameId = window.requestAnimationFrame(updatingDropArrowMarker);
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        animationFrameId = window.requestAnimationFrame(updatingDropArrowMarker);
        return;
      }

      const bobPhase =
        (Date.now() % DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ARROW_BOB_PERIOD_MS) /
        DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ARROW_BOB_PERIOD_MS;
      const bobOffsetPx =
        Math.sin(bobPhase * Math.PI * 2) *
        DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ARROW_BOB_AMPLITUDE_PX *
        cameraWorldZoom;

      const screenPoint = resolvingWorldPlazaInventoryDropMarkerScreenPoint(
        markerTile.tileX,
        markerTile.tileY,
        cameraOffset,
        cameraWorldZoom,
        bobOffsetPx,
      );

      markerRoot.style.transform = `translate(${screenPoint.x}px, ${screenPoint.y}px) translate(-50%, -50%)`;
      animationFrameId = window.requestAnimationFrame(updatingDropArrowMarker);
    };

    animationFrameId = window.requestAnimationFrame(updatingDropArrowMarker);

    return () => {
      isActive = false;
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [cameraOffsetRef, cameraWorldZoomRef, dropMarkerTileRef]);

  return (
    <div
      ref={markerRootRef}
      aria-hidden
      className={STYLING_WORLD_PLAZA_INVENTORY_DROP_ARROW_ROOT_CLASS_NAME}
      style={{
        transform: RENDERING_WORLD_PLAZA_INVENTORY_DROP_ARROW_HIDDEN_TRANSFORM,
      }}
    >
      <ArrowDown
        className={STYLING_WORLD_PLAZA_INVENTORY_DROP_ARROW_CLASS_NAME}
        style={{
          width: arrowSizePx,
          height: arrowSizePx,
        }}
        strokeWidth={2.75}
      />
    </div>
  );
}
