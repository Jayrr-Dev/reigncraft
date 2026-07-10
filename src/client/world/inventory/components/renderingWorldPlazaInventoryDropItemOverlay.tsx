'use client';

/**
 * Item-icon marker for inventory ground placement.
 *
 * @module components/world/inventory/components/renderingWorldPlazaInventoryDropItemOverlay
 */

import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ICON_BASE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ICON_BOB_AMPLITUDE_PX,
  DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ICON_BOB_PERIOD_MS,
  STYLING_WORLD_PLAZA_INVENTORY_DROP_ICON_GLYPH_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_DROP_ICON_ROOT_CLASS_NAME,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryDropConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import type { DefiningWorldPlazaInventoryDropPreviewTile } from '@/components/world/inventory/domains/definingWorldPlazaInventoryDropPlacement';
import { STYLING_WORLD_PLAZA_GROUND_ITEM_GLYPH_OUTLINE_CLASS_NAME } from '@/components/world/inventory/domains/definingWorldPlazaGroundItemConstants';
import { resolvingWorldPlazaInventoryDropMarkerScreenPoint } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryDropMarkerScreenPoint';
import { cn } from '@/lib/utils';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

/** Off-screen default before the first animation frame positions the marker. */
const RENDERING_WORLD_PLAZA_INVENTORY_DROP_ITEM_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

/** Props for {@link RenderingWorldPlazaInventoryDropItemOverlay}. */
export interface RenderingWorldPlazaInventoryDropItemOverlayProps {
  /** Tile to mark for the current drag or pending drop. */
  readonly dropMarkerTileRef: React.RefObject<DefiningWorldPlazaInventoryDropPreviewTile | null>;
  /** Item type shown while choosing a ground drop tile. */
  readonly dropPlacementItemTypeIdRef: React.RefObject<string | null>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly viewportHudScale?: number;
}

/**
 * DOM overlay with a bouncing item glyph at the inventory drop tile.
 */
export function RenderingWorldPlazaInventoryDropItemOverlay({
  dropMarkerTileRef,
  dropPlacementItemTypeIdRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  viewportHudScale = 1,
}: RenderingWorldPlazaInventoryDropItemOverlayProps): React.JSX.Element {
  const markerRootRef = useRef<HTMLDivElement | null>(null);
  const lastItemTypeIdRef = useRef<string | null>(null);
  const [itemTypeId, setItemTypeId] = useState<string | null>(null);

  const iconSizePx = useMemo(
    () =>
      computingWorldPlazaViewportHudScaledPx(
        DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ICON_BASE_PX,
        viewportHudScale
      ),
    [viewportHudScale]
  );

  const glyphIconStyle = useMemo(
    () => ({
      width: iconSizePx,
      height: iconSizePx,
      fontSize: iconSizePx,
    }),
    [iconSizePx]
  );

  useLayoutEffect(() => {
    let animationFrameId = 0;
    let isActive = true;

    const updatingDropItemMarker = (): void => {
      if (!isActive) {
        return;
      }

      const nextItemTypeId = dropPlacementItemTypeIdRef.current;

      if (lastItemTypeIdRef.current !== nextItemTypeId) {
        lastItemTypeIdRef.current = nextItemTypeId;
        setItemTypeId(nextItemTypeId);
      }

      const markerRoot = markerRootRef.current;
      const markerTile = dropMarkerTileRef.current;

      if (!markerRoot) {
        animationFrameId = window.requestAnimationFrame(updatingDropItemMarker);
        return;
      }

      if (!markerTile || !nextItemTypeId) {
        markerRoot.style.transform =
          RENDERING_WORLD_PLAZA_INVENTORY_DROP_ITEM_HIDDEN_TRANSFORM;
        animationFrameId = window.requestAnimationFrame(updatingDropItemMarker);
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current ?? 1;

      if (!cameraOffset) {
        animationFrameId = window.requestAnimationFrame(updatingDropItemMarker);
        return;
      }

      const bobPhase =
        (Date.now() %
          DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ICON_BOB_PERIOD_MS) /
        DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ICON_BOB_PERIOD_MS;
      const bobOffsetPx =
        Math.sin(bobPhase * Math.PI * 2) *
        DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ICON_BOB_AMPLITUDE_PX *
        cameraWorldZoom;

      const screenPoint = resolvingWorldPlazaInventoryDropMarkerScreenPoint(
        markerTile.tileX,
        markerTile.tileY,
        cameraOffset,
        cameraWorldZoom,
        bobOffsetPx
      );

      markerRoot.style.transform = `translate(${screenPoint.x}px, ${screenPoint.y}px) translate(-50%, -50%)`;
      markerRoot.style.opacity = markerTile.isValid ? '1' : '0.45';
      animationFrameId = window.requestAnimationFrame(updatingDropItemMarker);
    };

    animationFrameId = window.requestAnimationFrame(updatingDropItemMarker);

    return () => {
      isActive = false;
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [
    cameraOffsetRef,
    cameraWorldZoomRef,
    dropMarkerTileRef,
    dropPlacementItemTypeIdRef,
  ]);

  return (
    <div
      ref={markerRootRef}
      aria-hidden
      className={STYLING_WORLD_PLAZA_INVENTORY_DROP_ICON_ROOT_CLASS_NAME}
      style={{
        transform: RENDERING_WORLD_PLAZA_INVENTORY_DROP_ITEM_HIDDEN_TRANSFORM,
      }}
    >
      {itemTypeId ? (
        <RenderingWorldPlazaInventoryItemGlyph
          itemTypeId={itemTypeId}
          registry={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY}
          iconClassName={cn(
            STYLING_WORLD_PLAZA_INVENTORY_DROP_ICON_GLYPH_CLASS_NAME,
            STYLING_WORLD_PLAZA_GROUND_ITEM_GLYPH_OUTLINE_CLASS_NAME
          )}
          emojiClassName={
            STYLING_WORLD_PLAZA_GROUND_ITEM_GLYPH_OUTLINE_CLASS_NAME
          }
          iconStyle={glyphIconStyle}
          emojiStyle={glyphIconStyle}
          fallbackTextStyle={glyphIconStyle}
        />
      ) : null}
    </div>
  );
}
