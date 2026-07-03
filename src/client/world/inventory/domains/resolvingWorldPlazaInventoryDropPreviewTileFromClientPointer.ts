import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { DEFINING_WORLD_PLAZA_UI_SELECTOR } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import type { DefiningWorldPlazaCameraOffset } from "@/components/world/domains/definingWorldPlazaCameraOffset";
import type { DefiningWorldPlazaPixiViewportSize } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";
import { checkingWorldPlazaInventoryDropTileIsValid } from "@/components/world/inventory/domains/checkingWorldPlazaInventoryDropTileIsValid";
import type { DefiningWorldPlazaInventoryDropPreviewTile } from "@/components/world/inventory/domains/definingWorldPlazaInventoryDropPlacement";
import { projectingWorldPlazaViewportClientPointToGridTile } from "@/components/world/inventory/domains/projectingWorldPlazaViewportClientPointToGridTile";

/** Params for {@link resolvingWorldPlazaInventoryDropPreviewTileFromClientPointer}. */
export interface ResolvingWorldPlazaInventoryDropPreviewTileFromClientPointerParams {
  readonly clientX: number;
  readonly clientY: number;
  readonly viewportFrameBounds: DOMRect;
  readonly viewportSize: DefiningWorldPlazaPixiViewportSize;
  readonly cameraOffset: DefiningWorldPlazaCameraOffset;
  readonly cameraWorldZoom: number;
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  /** When true, skip HUD chrome so release coordinates still resolve. */
  readonly ignorePlazaUiChrome?: boolean;
}

/**
 * Projects a client pointer position into an inventory drop preview tile.
 *
 * @param params - Pointer, viewport, camera, and collision context.
 */
export function resolvingWorldPlazaInventoryDropPreviewTileFromClientPointer(
  params: ResolvingWorldPlazaInventoryDropPreviewTileFromClientPointerParams,
): DefiningWorldPlazaInventoryDropPreviewTile | null {
  if (
    !params.ignorePlazaUiChrome &&
    typeof document !== "undefined"
  ) {
    const elementUnderPointer = document.elementFromPoint(
      params.clientX,
      params.clientY,
    );

    if (
      elementUnderPointer instanceof Element &&
      elementUnderPointer.closest(DEFINING_WORLD_PLAZA_UI_SELECTOR)
    ) {
      return null;
    }
  }

  const gridPoint = projectingWorldPlazaViewportClientPointToGridTile(
    params.clientX,
    params.clientY,
    params.viewportFrameBounds,
    params.viewportSize,
    params.cameraOffset,
    params.cameraWorldZoom,
  );

  if (!gridPoint) {
    return null;
  }

  const tileX = Math.floor(gridPoint.x);
  const tileY = Math.floor(gridPoint.y);

  return {
    tileX,
    tileY,
    isValid: checkingWorldPlazaInventoryDropTileIsValid(
      tileX,
      tileY,
      params.placedBlocks,
    ),
  };
}
