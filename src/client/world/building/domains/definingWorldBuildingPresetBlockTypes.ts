import {
  checkingWorldBuildingBlockHeightIsTowerRelative,
  clampingWorldBuildingBlockHeight,
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_MAX,
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TOWER_RELATIVE,
} from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";

/**
 * Pre-made block shape presets for build mode placement.
 *
 * @module components/world/building/domains/definingWorldBuildingPresetBlockTypes
 */

/** Preset block shape ids exposed in build mode. */
export type DefiningWorldBuildingPresetBlockTypeId =
  | "tile"
  | "slab"
  | "half"
  | "block"
  | "tower";

/** One selectable block shape preset. */
export interface DefiningWorldBuildingPresetBlockType {
  readonly id: DefiningWorldBuildingPresetBlockTypeId;
  readonly label: string;
  readonly blockHeight: number;
  readonly buttonLabel: string;
  readonly ariaLabel: string;
}

/** Flat passable tile preset. */
export const DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_TILE =
  "tile" as const;

/** Single-layer slab preset. */
export const DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_SLAB =
  "slab" as const;

/** Two-layer half-height preset. */
export const DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_HALF =
  "half" as const;

/** Four-layer block preset. */
export const DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_BLOCK =
  "block" as const;

/** Full-layer tower preset (height follows the active world layer). */
export const DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_TOWER =
  "tower" as const;

/** Fixed icon extrusion for the tower preset button (unchanged from original 32H art). */
export const DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_TOWER_ICON_BLOCK_HEIGHT =
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_MAX;

/** Build-mode shape presets mapped to extrusion heights (H). */
export const DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPES: readonly DefiningWorldBuildingPresetBlockType[] =
  [
    {
      id: DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_TILE,
      label: "Tile",
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
      buttonLabel: "Tile",
      ariaLabel: "Tile shape",
    },
    {
      id: DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_SLAB,
      label: "Slab",
      blockHeight: 1,
      buttonLabel: "Slab",
      ariaLabel: "Slab shape",
    },
    {
      id: DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_HALF,
      label: "Half",
      blockHeight: 2,
      buttonLabel: "Half",
      ariaLabel: "Half shape",
    },
    {
      id: DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_BLOCK,
      label: "Block",
      blockHeight: 4,
      buttonLabel: "Block",
      ariaLabel: "Block shape",
    },
    {
      id: DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_TOWER,
      label: "Tower",
      blockHeight: DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TOWER_RELATIVE,
      buttonLabel: "Tower",
      ariaLabel: "Tower shape",
    },
  ];

/**
 * Returns true when a preset fits the active placement layer cap.
 *
 * @param presetBlockType - Shape preset to validate.
 * @param topWorldLayer - Active placement layer (L).
 */
export function checkingWorldBuildingPresetBlockTypeAvailableAtLayer(
  presetBlockType: DefiningWorldBuildingPresetBlockType,
  topWorldLayer: number,
): boolean {
  if (
    presetBlockType.id === DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_TOWER
  ) {
    return topWorldLayer >= 1;
  }

  return (
    clampingWorldBuildingBlockHeight(
      presetBlockType.blockHeight,
      topWorldLayer,
    ) === presetBlockType.blockHeight
  );
}

/**
 * Resolves the closest preset for the current block height selection.
 *
 * @param blockHeight - Selected extrusion height (H).
 * @param topWorldLayer - Active placement layer (L).
 */
export function resolvingWorldBuildingPresetBlockTypeFromBlockHeight(
  blockHeight: number,
  topWorldLayer: number,
): DefiningWorldBuildingPresetBlockType {
  if (checkingWorldBuildingBlockHeightIsTowerRelative(blockHeight)) {
    return (
      DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPES.find(
        (presetBlockType) =>
          presetBlockType.id ===
          DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_TOWER,
      ) ?? DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPES[0]
    );
  }

  const clampedHeight = clampingWorldBuildingBlockHeight(
    blockHeight,
    topWorldLayer,
  );
  const exactPreset = DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPES.find(
    (presetBlockType) => presetBlockType.blockHeight === clampedHeight,
  );

  if (exactPreset) {
    return exactPreset;
  }

  const fallbackPreset = [...DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPES]
    .reverse()
    .find((presetBlockType) => presetBlockType.blockHeight <= clampedHeight);

  return fallbackPreset ?? DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPES[0];
}

/** Keyboard key that cycles preset block types in build mode. */
export const DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_CYCLE_KEY =
  "Tab" as const;

/** Cycle direction for preset block type hotkeys. */
export type DefiningWorldBuildingPresetBlockTypeCycleDirection = 1 | -1;

/**
 * Returns preset block types available on the active placement layer.
 *
 * @param topWorldLayer - Active placement layer (L).
 */
export function listingWorldBuildingPresetBlockTypesAvailableAtLayer(
  topWorldLayer: number,
): DefiningWorldBuildingPresetBlockType[] {
  return DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPES.filter((presetBlockType) =>
    checkingWorldBuildingPresetBlockTypeAvailableAtLayer(
      presetBlockType,
      topWorldLayer,
    ),
  );
}

/**
 * Returns the next preset block height when cycling with Tab or Shift+Tab.
 *
 * Cycles every shape preset regardless of the active layer. Callers should run
 * {@link applyingWorldBuildingBuildModeBlockHeightSelection} so each preset
 * snaps to its default placement layer.
 *
 * @param currentBlockHeight - Current extrusion height (H).
 * @param direction - Forward (1) or backward (-1).
 */
export function cyclingWorldBuildingPresetBlockTypeBlockHeight(
  currentBlockHeight: number,
  direction: DefiningWorldBuildingPresetBlockTypeCycleDirection,
): number {
  const presetBlockTypes = DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPES;

  if (presetBlockTypes.length === 0) {
    return clampingWorldBuildingBlockHeight(currentBlockHeight);
  }

  const currentIndex = presetBlockTypes.findIndex(
    (presetBlockType) => presetBlockType.blockHeight === currentBlockHeight,
  );
  const resolvedIndex =
    currentIndex === -1
      ? direction === 1
        ? 0
        : presetBlockTypes.length - 1
      : (currentIndex + direction + presetBlockTypes.length) %
        presetBlockTypes.length;

  return presetBlockTypes[resolvedIndex].blockHeight;
}
