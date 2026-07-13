import {
  checkingWorldBuildingBlockHeightIsTowerRelative,
  clampingWorldBuildingBlockHeight,
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TOWER_RELATIVE,
} from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";
import { resolvingWorldBuildingMinimumWorldLayerForBlockHeight } from "@/components/world/building/domains/resolvingWorldBuildingMinimumWorldLayerForBlockHeight";
import { clampingWorldBuildingWorldLayer } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";

/**
 * Applies build-mode block height selection with automatic layer bumping.
 *
 * @module components/world/building/domains/applyingWorldBuildingBuildModeBlockHeightSelection
 */

/** Input for {@link applyingWorldBuildingBuildModeBlockHeightSelection}. */
export interface ApplyingWorldBuildingBuildModeBlockHeightSelectionInput {
  readonly requestedBlockHeight: number;
  readonly selectedWorldLayer: number;
}

/** Result from {@link applyingWorldBuildingBuildModeBlockHeightSelection}. */
export interface ApplyingWorldBuildingBuildModeBlockHeightSelectionResult {
  readonly selectedWorldLayer: number;
  readonly selectedBlockHeight: number;
}

/**
 * Applies build-mode block height selection and snaps the placement layer to each
 * preset's default anchor (slab 1, half 2, full 4, tile ground). Tower keeps
 * the current layer because its height follows L.
 *
 * @param input - Requested preset height and the current sidebar layer.
 */
export function applyingWorldBuildingBuildModeBlockHeightSelection(
  input: ApplyingWorldBuildingBuildModeBlockHeightSelectionInput,
): ApplyingWorldBuildingBuildModeBlockHeightSelectionResult {
  if (
    checkingWorldBuildingBlockHeightIsTowerRelative(input.requestedBlockHeight)
  ) {
    return {
      selectedWorldLayer: clampingWorldBuildingWorldLayer(
        input.selectedWorldLayer,
      ),
      selectedBlockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TOWER_RELATIVE,
    };
  }

  const selectedWorldLayer = resolvingWorldBuildingMinimumWorldLayerForBlockHeight(
    input.requestedBlockHeight,
  );
  const selectedBlockHeight = clampingWorldBuildingBlockHeight(
    input.requestedBlockHeight,
    selectedWorldLayer,
  );

  return {
    selectedWorldLayer,
    selectedBlockHeight,
  };
}
