"use client";

import { applyingWorldBuildingBuildDraftPlotUnclaim } from "@/components/world/building/domains/applyingWorldBuildingBuildDraftPlotUnclaim";
import { applyingWorldBuildingBuildModeBlockHeightSelection } from "@/components/world/building/domains/applyingWorldBuildingBuildModeBlockHeightSelection";
import { applyingWorldBuildingBuildDraftBlockPlacement } from "@/components/world/building/domains/applyingWorldBuildingBuildDraftBlockPlacement";
import { applyingWorldBuildingBuildDraftBlockRemoval } from "@/components/world/building/domains/applyingWorldBuildingBuildDraftBlockRemoval";
import { applyingWorldBuildingBuildDraftStarterPlotProvision } from "@/components/world/building/domains/applyingWorldBuildingBuildDraftStarterPlotProvision";
import { applyingWorldBuildingBuildDraftTemporaryPlotProvision } from "@/components/world/building/domains/applyingWorldBuildingBuildDraftTemporaryPlotProvision";
import { checkingWorldBuildingTemporaryTileClaimableForOwner } from "@/components/world/building/domains/checkingWorldBuildingTemporaryTileClaimableForOwner";
import { checkingWorldBuildingTileClaimableForOwner } from "@/components/world/building/domains/checkingWorldBuildingTileClaimableForOwner";
import type { DefiningWorldBuildingBlockDefinitionId } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import {
  DEFINING_WORLD_BUILDING_DEFAULT_BLOCK_DEFINITION_ID,
  resolvingWorldBuildingBlockDefinition,
} from "@/components/world/building/domains/definingWorldBuildingBlockRegistry";
import { checkingWorldBuildingBlockUsesTileColumnExtrusion } from "@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics";
import {
  DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
  normalizingWorldBuildingCutFootprintMask,
  normalizingWorldBuildingCutGridAxisCellCount,
  resolvingWorldBuildingCutFootprintFullMask,
  type DefiningWorldBuildingCutGridAxisCellCount,
} from "@/components/world/building/domains/definingWorldBuildingCutFootprintConstants";
import {
  checkingWorldBuildingBuildDraftPlotIdIsLocal,
  checkingWorldBuildingBuildDraftHasOwnedPlot,
  checkingWorldBuildingBuildDraftHasUnsavedChanges,
  creatingEmptyWorldBuildingBuildDraftState,
  initializingWorldBuildingBuildDraftFromServerPlots,
  mergingWorldBuildingViewportPlotsWithBuildDraft,
  type DefiningWorldBuildingBuildDraftState,
} from "@/components/world/building/domains/definingWorldBuildingBuildDraft";
import {
  checkingWorldBuildingPlotCanPlaceBlockAtTilePosition,
  findingWorldBuildingPlotBlockAtTilePosition,
  findingWorldBuildingPlotContainingTilePosition,
  findingWorldBuildingPlotRemovableBlockAtTileLayerPosition,
  type DefiningWorldBuildingPlot,
} from "@/components/world/building/domains/definingWorldBuildingPlot";
import {
  decrementingWorldBuildingWorldLayer,
  incrementingWorldBuildingWorldLayer,
} from "@/components/world/building/domains/formattingWorldBuildingWorldLayerSummary";
import { resolvingWorldBuildingMinimumWorldLayerForBlockHeight } from "@/components/world/building/domains/resolvingWorldBuildingMinimumWorldLayerForBlockHeight";
import { resolvingWorldBuildingHoverPlacementWorldLayer } from "@/components/world/building/domains/resolvingWorldBuildingHoverPlacementWorldLayer";
import { resolvingWorldBuildingBuildModeTilePopoverMode } from "@/components/world/building/domains/resolvingWorldBuildingBuildModeTilePopoverMode";
import type { DefiningWorldBuildingBuildModeTilePopoverMode } from "@/components/world/building/domains/resolvingWorldBuildingBuildModeTilePopoverMode";
import { listingWorldBuildingPlacedBlocksFromPlots } from "@/components/world/building/domains/listingWorldBuildingPlacedBlocksFromPlots";
import {
  resolvingWorldBuildingPlacedBlockWorldLayer,
  type DefiningWorldBuildingPlacedBlock,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { clearingWorldBuildingDevPlacedObjects } from "@/components/world/building/repositories/clearingWorldBuildingDevPlacedObjects";
import { persistingWorldBuildingBuildDraft } from "@/components/world/building/repositories/persistingWorldBuildingBuildDraft";
import { removingWorldBuildingPlotPersistence } from "@/components/world/building/repositories/persistingWorldBuildingPlacedBlock";
import {
  DEFINING_WORLD_BUILDING_BUILD_MODE_TOGGLE_KEY,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_TOGGLE_KEY,
} from "@/components/world/building/domains/definingWorldBuildingPlotConstants";
import {
  DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD,
  DEFINING_WORLD_BUILDING_EDIT_MODE_CLAIM,
  DEFINING_WORLD_BUILDING_EDIT_MODE_OFF,
  type DefiningWorldBuildingEditMode,
} from "@/components/world/building/domains/definingWorldBuildingEditMode";
import { DEFINING_WORLD_BUILDING_PLOT_CLAIM_WORLD_LAYER } from "@/components/world/building/domains/definingWorldBuildingPlotClaimConstants";
import {
  checkingWorldBuildingBlockPlacementExtrusionFitsTopLayer,
} from "@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand";
import {
  DEFINING_WORLD_BUILDING_BUILD_MODE_WORLD_LAYER_DECREASE_KEY,
  DEFINING_WORLD_BUILDING_BUILD_MODE_WORLD_LAYER_INCREASE_KEY,
} from "@/components/world/building/domains/definingWorldBuildingBuildModeConstants";
import {
  checkingWorldBuildingPresetBlockTypeAvailableAtLayer,
  cyclingWorldBuildingPresetBlockTypeBlockHeight,
  DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_CYCLE_KEY,
  resolvingWorldBuildingPresetBlockTypeFromBlockHeight,
} from "@/components/world/building/domains/definingWorldBuildingPresetBlockTypes";
import {
  checkingWorldBuildingBlockHeightIsTowerRelative,
  clampingWorldBuildingBlockHeight,
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
  resolvingWorldBuildingEffectiveBlockHeight,
} from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";
import { DEFINING_WORLD_PLAZA_SIDEBAR_PANEL_DISMISS_KEY } from "@/components/world/domains/definingWorldPlazaSidebarPanelConstants";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import { resolvingWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/resolvingWorldBuildingPlotOwnerLimits";
import type { RefetchingWorldBuildingPlotsResult } from "@/components/world/building/hooks/usingWorldPlazaPlacedBlocksQuery";
import { useCallback, useEffect, useMemo, useState } from "react";

/** Result from {@link usingWorldPlazaBuildMode}. */
export interface UsingWorldPlazaBuildModeResult {
  editMode: DefiningWorldBuildingEditMode;
  isEditSessionActive: boolean;
  isBlockBuildModeActive: boolean;
  isBuildModeActive: boolean;
  isClaimModeActive: boolean;
  selectedDefinitionId: DefiningWorldBuildingBlockDefinitionId | null;
  isPresetBlockTypeSelected: boolean;
  isBuildPlacementSelectionActive: boolean;
  selectedWorldLayer: number;
  selectedBlockHeight: number;
  selectedCutFootprintMask: number;
  selectedCutGridAxisCellCount: DefiningWorldBuildingCutGridAxisCellCount;
  previewCutFootprintMask: number;
  previewCutGridAxisCellCount: DefiningWorldBuildingCutGridAxisCellCount;
  hoveredRemovableBlock: DefiningWorldBuildingPlacedBlock | null;
  hoverTilePosition: DefiningWorldBuildingTilePosition | null;
  selectedTilePosition: DefiningWorldBuildingTilePosition | null;
  previewTilePosition: DefiningWorldBuildingTilePosition | null;
  isBuildTilePopoverOpen: boolean;
  buildTilePopoverMode: DefiningWorldBuildingBuildModeTilePopoverMode;
  buildErrorMessage: string | null;
  canPlaceAtHoverTile: boolean;
  canPlaceAtPreviewTile: boolean;
  canClaimAtPreviewTile: boolean;
  canClaimTemporaryAtPreviewTile: boolean;
  canClaimTemporaryAtSelectedTile: boolean;
  isPreviewTileValid: boolean;
  previewWorldLayer: number;
  previewBlockHeight: number;
  canPlaceAtSelectedTile: boolean;
  canRemoveAtSelectedTile: boolean;
  hasUnsavedBuildChanges: boolean;
  hasOwnedPlotForBuilding: boolean;
  isSavingBuildDraft: boolean;
  isClearingAllDevPlacedObjects: boolean;
  isDiscardBuildDraftDialogOpen: boolean;
  activeViewportPlots: DefiningWorldBuildingPlot[];
  activeOwnedPlots: DefiningWorldBuildingPlot[];
  activePlacedBlocks: DefiningWorldBuildingPlacedBlock[];
  togglingBuildMode: () => void;
  togglingClaimMode: () => void;
  cancelingBuildDraftDiscard: () => void;
  confirmingBuildDraftDiscard: () => void;
  selectingBlockDefinition: (definitionId: DefiningWorldBuildingBlockDefinitionId) => void;
  selectingWorldLayer: (worldLayer: number) => void;
  selectingBlockHeight: (blockHeight: number) => void;
  selectingCutFootprintMask: (cutFootprintMask: number) => void;
  selectingCutGridAxisCellCount: (
    axisCellCount: DefiningWorldBuildingCutGridAxisCellCount,
  ) => void;
  updatingHoverTilePosition: (
    tilePosition: DefiningWorldBuildingTilePosition | null,
  ) => void;
  selectingBuildModeTileAtViewport: (
    tilePosition: DefiningWorldBuildingTilePosition | null,
  ) => void;
  closingBuildModeTilePopover: () => void;
  claimingPlotAtSelectedTile: () => void;
  claimingTemporaryPlotAtSelectedTile: () => void;
  removingTemporaryPlotAtTile: (
    tilePosition: DefiningWorldBuildingTilePosition,
  ) => Promise<void>;
  placingBlockAtSelectedTile: () => void;
  removingBlockAtSelectedTile: () => void;
  unclaimingPlotAtSelectedTile: () => void;
  savingBuildDraft: () => Promise<void>;
  clearingAllDevPlacedObjects: () => Promise<void>;
}

/** Params for {@link usingWorldPlazaBuildMode}. */
export interface UsingWorldPlazaBuildModeParams {
  isEnabled: boolean;
  onlineUserId: string | null;
  plots: DefiningWorldBuildingPlot[];
  ownedPlots: DefiningWorldBuildingPlot[];
  plotOwnerLimits?: DefiningWorldBuildingPlotOwnerLimits | null;
  refetchingPlots: () => Promise<RefetchingWorldBuildingPlotsResult>;
}

/**
 * Owns build mode UI state, local draft edits, and save-to-server mutations.
 *
 * @param params - Enable flag, auth user, and loaded plot aggregates.
 */
export function usingWorldPlazaBuildMode({
  isEnabled,
  onlineUserId,
  plots,
  ownedPlots,
  plotOwnerLimits,
  refetchingPlots,
}: UsingWorldPlazaBuildModeParams): UsingWorldPlazaBuildModeResult {
  const resolvedPlotOwnerLimits = useMemo(
    () => resolvingWorldBuildingPlotOwnerLimits(plotOwnerLimits),
    [plotOwnerLimits],
  );
  const [editMode, setEditMode] = useState<DefiningWorldBuildingEditMode>(
    DEFINING_WORLD_BUILDING_EDIT_MODE_OFF,
  );
  const isEditSessionActive = editMode !== DEFINING_WORLD_BUILDING_EDIT_MODE_OFF;
  const isBlockBuildModeActive = editMode === DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD;
  const isBuildModeActive = isEditSessionActive;
  const isClaimModeActive = editMode === DEFINING_WORLD_BUILDING_EDIT_MODE_CLAIM;
  const [buildDraft, setBuildDraft] =
    useState<DefiningWorldBuildingBuildDraftState | null>(null);
  const [selectedDefinitionId, setSelectedDefinitionId] = useState<
    DefiningWorldBuildingBlockDefinitionId | null
  >(DEFINING_WORLD_BUILDING_DEFAULT_BLOCK_DEFINITION_ID);
  const [hoverTilePosition, setHoverTilePosition] =
    useState<DefiningWorldBuildingTilePosition | null>(null);
  const [selectedTilePosition, setSelectedTilePosition] =
    useState<DefiningWorldBuildingTilePosition | null>(null);
  const [isBuildTilePopoverOpen, setIsBuildTilePopoverOpen] = useState(false);
  const [buildErrorMessage, setBuildErrorMessage] = useState<string | null>(
    null,
  );
  const [selectedWorldLayer, setSelectedWorldLayer] = useState<number>(() =>
    resolvingWorldBuildingMinimumWorldLayerForBlockHeight(
      DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
    ),
  );
  const [selectedBlockHeight, setSelectedBlockHeight] = useState<number>(
    DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
  );
  const [selectedCutFootprintMask, setSelectedCutFootprintMask] =
    useState<number>(
      resolvingWorldBuildingCutFootprintFullMask(
        DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
      ),
    );
  const [selectedCutGridAxisCellCount, setSelectedCutGridAxisCellCount] =
    useState<DefiningWorldBuildingCutGridAxisCellCount>(
      DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
    );
  const [isPresetBlockTypeSelected, setIsPresetBlockTypeSelected] =
    useState<boolean>(true);
  const [isSavingBuildDraft, setIsSavingBuildDraft] = useState(false);
  const [isClearingAllDevPlacedObjects, setIsClearingAllDevPlacedObjects] =
    useState(false);
  const [isDiscardBuildDraftDialogOpen, setIsDiscardBuildDraftDialogOpen] =
    useState(false);

  const exitingBuildMode = useCallback((): void => {
    setEditMode(DEFINING_WORLD_BUILDING_EDIT_MODE_OFF);
    setBuildErrorMessage(null);
    setIsDiscardBuildDraftDialogOpen(false);
    setSelectedTilePosition(null);
    setIsBuildTilePopoverOpen(false);
  }, []);

  const closingBuildModeTilePopover = useCallback((): void => {
    setIsBuildTilePopoverOpen(false);
    setSelectedTilePosition(null);
  }, []);

  const activeViewportPlots = useMemo(() => {
    if (!isEditSessionActive || !buildDraft || !onlineUserId) {
      return plots;
    }

    return mergingWorldBuildingViewportPlotsWithBuildDraft(
      plots,
      buildDraft,
      onlineUserId,
    );
  }, [buildDraft, isEditSessionActive, onlineUserId, plots]);

  const activePlacedBlocks = useMemo(
    () => listingWorldBuildingPlacedBlocksFromPlots(activeViewportPlots),
    [activeViewportPlots],
  );

  const activeOwnedPlots = useMemo(() => {
    if (!isEditSessionActive || !buildDraft || !onlineUserId) {
      return ownedPlots;
    }

    const draftOwnedPlots = buildDraft.workingPlots.filter(
      (plot) => plot.ownerId === onlineUserId,
    );

    return draftOwnedPlots.length > 0 ? draftOwnedPlots : ownedPlots;
  }, [buildDraft, isEditSessionActive, onlineUserId, ownedPlots]);

  const hasUnsavedBuildChanges =
    checkingWorldBuildingBuildDraftHasUnsavedChanges(buildDraft);

  const hasOwnedPlotForBuilding = useMemo(() => {
    if (isEditSessionActive && buildDraft && onlineUserId) {
      return checkingWorldBuildingBuildDraftHasOwnedPlot(buildDraft, onlineUserId);
    }

    return ownedPlots.length > 0;
  }, [buildDraft, isEditSessionActive, onlineUserId, ownedPlots]);

  const switchingEditMode = useCallback(
    (targetMode: Exclude<DefiningWorldBuildingEditMode, "off">): void => {
      if (editMode === targetMode) {
        if (checkingWorldBuildingBuildDraftHasUnsavedChanges(buildDraft)) {
          setIsDiscardBuildDraftDialogOpen(true);
          return;
        }

        exitingBuildMode();
        return;
      }

      setEditMode(targetMode);
      setBuildErrorMessage(null);
      setSelectedTilePosition(null);
      setIsBuildTilePopoverOpen(false);
    },
    [buildDraft, editMode, exitingBuildMode],
  );

  const togglingBuildMode = useCallback((): void => {
    switchingEditMode(DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD);
  }, [switchingEditMode]);

  const togglingClaimMode = useCallback((): void => {
    switchingEditMode(DEFINING_WORLD_BUILDING_EDIT_MODE_CLAIM);
  }, [switchingEditMode]);

  const cancelingBuildDraftDiscard = useCallback((): void => {
    setIsDiscardBuildDraftDialogOpen(false);
  }, []);

  const confirmingBuildDraftDiscard = useCallback((): void => {
    exitingBuildMode();
  }, [exitingBuildMode]);

  const selectingBlockDefinition = useCallback(
    (definitionId: DefiningWorldBuildingBlockDefinitionId): void => {
      setSelectedDefinitionId((currentDefinitionId) =>
        currentDefinitionId === definitionId ? null : definitionId,
      );
      setBuildErrorMessage(null);
    },
    [],
  );

  const selectingWorldLayer = useCallback((worldLayer: number): void => {
    setSelectedWorldLayer(worldLayer);
    setSelectedBlockHeight((currentBlockHeight) => {
      if (checkingWorldBuildingBlockHeightIsTowerRelative(currentBlockHeight)) {
        return currentBlockHeight;
      }

      const clampedBlockHeight = clampingWorldBuildingBlockHeight(
        currentBlockHeight,
        worldLayer,
      );
      const matchingPreset = resolvingWorldBuildingPresetBlockTypeFromBlockHeight(
        clampedBlockHeight,
        worldLayer,
      );

      if (
        matchingPreset.blockHeight === clampedBlockHeight &&
        checkingWorldBuildingPresetBlockTypeAvailableAtLayer(
          matchingPreset,
          worldLayer,
        )
      ) {
        return clampedBlockHeight;
      }

      if (
        checkingWorldBuildingPresetBlockTypeAvailableAtLayer(
          matchingPreset,
          worldLayer,
        )
      ) {
        return matchingPreset.blockHeight;
      }

      return clampingWorldBuildingBlockHeight(
        DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
        worldLayer,
      );
    });
    setBuildErrorMessage(null);
  }, []);

  const selectingBlockHeight = useCallback(
    (blockHeight: number): void => {
      const requestedPresetBlockType =
        resolvingWorldBuildingPresetBlockTypeFromBlockHeight(
          blockHeight,
          selectedWorldLayer,
        );
      const currentPresetBlockType =
        resolvingWorldBuildingPresetBlockTypeFromBlockHeight(
          selectedBlockHeight,
          selectedWorldLayer,
        );

      if (
        isPresetBlockTypeSelected &&
        requestedPresetBlockType.id === currentPresetBlockType.id
      ) {
        setIsPresetBlockTypeSelected(false);
        setBuildErrorMessage(null);
        return;
      }

      const selectionResult = applyingWorldBuildingBuildModeBlockHeightSelection({
        requestedBlockHeight: blockHeight,
        selectedWorldLayer,
      });

      setIsPresetBlockTypeSelected(true);
      setSelectedWorldLayer(selectionResult.selectedWorldLayer);
      setSelectedBlockHeight(selectionResult.selectedBlockHeight);
      setBuildErrorMessage(null);
    },
    [isPresetBlockTypeSelected, selectedBlockHeight, selectedWorldLayer],
  );

  const isBuildPlacementSelectionActive =
    selectedDefinitionId !== null && isPresetBlockTypeSelected;

  const hoveredRemovableBlock = useMemo(() => {
    if (
      !isBlockBuildModeActive ||
      isBuildPlacementSelectionActive ||
      !onlineUserId ||
      !hoverTilePosition
    ) {
      return null;
    }

    const plot = findingWorldBuildingPlotContainingTilePosition(
      activeViewportPlots,
      hoverTilePosition,
    );

    if (!plot || plot.ownerId !== onlineUserId) {
      return null;
    }

    return findingWorldBuildingPlotBlockAtTilePosition(plot, hoverTilePosition);
  }, [
    activeViewportPlots,
    hoverTilePosition,
    isBlockBuildModeActive,
    isBuildPlacementSelectionActive,
    onlineUserId,
  ]);

  const selectingCutFootprintMask = useCallback(
    (cutFootprintMask: number): void => {
      setSelectedCutFootprintMask(
        normalizingWorldBuildingCutFootprintMask(
          cutFootprintMask,
          selectedCutGridAxisCellCount,
        ),
      );
      setBuildErrorMessage(null);
    },
    [selectedCutGridAxisCellCount],
  );

  const selectingCutGridAxisCellCount = useCallback(
    (axisCellCount: DefiningWorldBuildingCutGridAxisCellCount): void => {
      const normalizedAxisCellCount =
        normalizingWorldBuildingCutGridAxisCellCount(axisCellCount);

      setSelectedCutGridAxisCellCount(normalizedAxisCellCount);
      setSelectedCutFootprintMask(
        resolvingWorldBuildingCutFootprintFullMask(normalizedAxisCellCount),
      );
      setBuildErrorMessage(null);
    },
    [],
  );

  const selectedDefinitionUsesCutFootprint = useMemo(() => {
    if (!selectedDefinitionId) {
      return false;
    }

    const definition =
      resolvingWorldBuildingBlockDefinition(selectedDefinitionId);

    return definition
      ? checkingWorldBuildingBlockUsesTileColumnExtrusion(definition)
      : false;
  }, [selectedDefinitionId]);

  const effectiveSelectedCutFootprintMask = selectedDefinitionUsesCutFootprint
    ? selectedCutFootprintMask
    : DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK;
  const effectiveSelectedCutGridAxisCellCount = selectedDefinitionUsesCutFootprint
    ? selectedCutGridAxisCellCount
    : DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT;

  const updatingHoverTilePosition = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition | null): void => {
      setHoverTilePosition(tilePosition);
    },
    [],
  );

  const previewTilePosition = isBuildTilePopoverOpen
    ? selectedTilePosition
    : hoverTilePosition;

  const buildTilePopoverMode = useMemo(
    () =>
      resolvingWorldBuildingBuildModeTilePopoverMode(
        activeViewportPlots,
        selectedTilePosition,
        onlineUserId,
        editMode,
        resolvedPlotOwnerLimits,
      ),
    [
      activeViewportPlots,
      editMode,
      onlineUserId,
      resolvedPlotOwnerLimits,
      selectedTilePosition,
    ],
  );

  const resolvingPlacementWorldLayerForTile = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition | null): number => {
      return resolvingWorldBuildingHoverPlacementWorldLayer({
        tilePosition,
        selectedWorldLayer,
        selectedBlockHeight,
        placedBlocks: activePlacedBlocks,
      });
    },
    [activePlacedBlocks, selectedBlockHeight, selectedWorldLayer],
  );

  const checkingCanPlaceAtTile = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition | null): boolean => {
      if (
        !onlineUserId ||
        !tilePosition ||
        !isBuildPlacementSelectionActive ||
        !selectedDefinitionId
      ) {
        return false;
      }

      const plot = findingWorldBuildingPlotContainingTilePosition(
        activeViewportPlots,
        tilePosition,
      );

      if (!plot) {
        return false;
      }

      const placementWorldLayer =
        resolvingPlacementWorldLayerForTile(tilePosition);
      const placementBlockHeight = resolvingWorldBuildingEffectiveBlockHeight(
        selectedBlockHeight,
        selectedWorldLayer,
      );

      return checkingWorldBuildingPlotCanPlaceBlockAtTilePosition(
        plot,
        tilePosition,
        onlineUserId,
        placementWorldLayer,
        placementBlockHeight,
        effectiveSelectedCutFootprintMask,
      );
    },
    [
      activeViewportPlots,
      effectiveSelectedCutFootprintMask,
      effectiveSelectedCutGridAxisCellCount,
      isBuildPlacementSelectionActive,
      onlineUserId,
      resolvingPlacementWorldLayerForTile,
      selectedBlockHeight,
      selectedDefinitionId,
      selectedWorldLayer,
    ],
  );

  const canPlaceAtHoverTile = checkingCanPlaceAtTile(hoverTilePosition);
  const canPlaceAtPreviewTile = checkingCanPlaceAtTile(previewTilePosition);
  const canPlaceAtSelectedTile = checkingCanPlaceAtTile(selectedTilePosition);

  const canClaimAtPreviewTile = useMemo(() => {
    if (!onlineUserId || !previewTilePosition) {
      return false;
    }

    return checkingWorldBuildingTileClaimableForOwner(
      activeViewportPlots,
      previewTilePosition,
      onlineUserId,
      resolvedPlotOwnerLimits,
    );
  }, [activeViewportPlots, onlineUserId, previewTilePosition, resolvedPlotOwnerLimits]);

  const canClaimTemporaryAtPreviewTile = useMemo(() => {
    if (!onlineUserId || !previewTilePosition) {
      return false;
    }

    return checkingWorldBuildingTemporaryTileClaimableForOwner(
      activeViewportPlots,
      previewTilePosition,
      onlineUserId,
      resolvedPlotOwnerLimits,
    );
  }, [activeViewportPlots, onlineUserId, previewTilePosition, resolvedPlotOwnerLimits]);

  const canClaimTemporaryAtSelectedTile = useMemo(() => {
    if (!onlineUserId || !selectedTilePosition) {
      return false;
    }

    return checkingWorldBuildingTemporaryTileClaimableForOwner(
      activeViewportPlots,
      selectedTilePosition,
      onlineUserId,
      resolvedPlotOwnerLimits,
    );
  }, [
    activeViewportPlots,
    onlineUserId,
    resolvedPlotOwnerLimits,
    selectedTilePosition,
  ]);

  const previewWorldLayer = useMemo(() => {
    if (isClaimModeActive) {
      return DEFINING_WORLD_BUILDING_PLOT_CLAIM_WORLD_LAYER;
    }

    return resolvingPlacementWorldLayerForTile(previewTilePosition);
  }, [isClaimModeActive, previewTilePosition, resolvingPlacementWorldLayerForTile]);

  const previewBlockHeight = useMemo(() => {
    if (isClaimModeActive) {
      return DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT;
    }

    return resolvingWorldBuildingEffectiveBlockHeight(
      selectedBlockHeight,
      selectedWorldLayer,
    );
  }, [isClaimModeActive, selectedBlockHeight, selectedWorldLayer]);

  const isPreviewTileValid = useMemo(() => {
    if (!previewTilePosition) {
      return false;
    }

    if (isClaimModeActive) {
      return canClaimAtPreviewTile || canClaimTemporaryAtPreviewTile;
    }

    if (!isBuildPlacementSelectionActive) {
      return false;
    }

    if (
      !checkingWorldBuildingBlockPlacementExtrusionFitsTopLayer(
        previewWorldLayer,
        previewBlockHeight,
      )
    ) {
      return false;
    }

    return checkingCanPlaceAtTile(previewTilePosition);
  }, [
    canClaimAtPreviewTile,
    canClaimTemporaryAtPreviewTile,
    checkingCanPlaceAtTile,
    isBuildPlacementSelectionActive,
    isClaimModeActive,
    previewBlockHeight,
    previewTilePosition,
    previewWorldLayer,
  ]);

  const resolvingRemovalWorldLayerForTile = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition | null): number | null => {
      if (!onlineUserId || !tilePosition) {
        return null;
      }

      const plot = findingWorldBuildingPlotContainingTilePosition(
        activeViewportPlots,
        tilePosition,
      );

      if (!plot || plot.ownerId !== onlineUserId) {
        return null;
      }

      const topBlock = findingWorldBuildingPlotBlockAtTilePosition(
        plot,
        tilePosition,
      );

      if (!topBlock) {
        return null;
      }

      const removalWorldLayer =
        resolvingWorldBuildingPlacedBlockWorldLayer(topBlock);

      return findingWorldBuildingPlotRemovableBlockAtTileLayerPosition(
        plot,
        tilePosition,
        removalWorldLayer,
      )
        ? removalWorldLayer
        : null;
    },
    [activeViewportPlots, onlineUserId],
  );

  const canRemoveAtSelectedTile = useMemo(
    () => resolvingRemovalWorldLayerForTile(selectedTilePosition) !== null,
    [resolvingRemovalWorldLayerForTile, selectedTilePosition],
  );

  const selectingBuildModeTileAtViewport = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition | null): void => {
      if (!tilePosition) {
        setBuildErrorMessage("Pick a tile to build on.");
        return;
      }

      setSelectedTilePosition(tilePosition);
      setIsBuildTilePopoverOpen(true);
      setBuildErrorMessage(null);
    },
    [],
  );

  const provisioningStarterPlotAtTile = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition): void => {
      if (!onlineUserId || !buildDraft) {
        return;
      }

      setHoverTilePosition(tilePosition);

      const provisionResult = applyingWorldBuildingBuildDraftStarterPlotProvision(
        {
          draft: buildDraft,
          viewportPlots: plots,
          ownerUserId: onlineUserId,
          tilePosition,
          plotOwnerLimits: resolvedPlotOwnerLimits,
        },
      );

      if ("errorMessage" in provisionResult) {
        setBuildErrorMessage(provisionResult.errorMessage);
        return;
      }

      setBuildDraft(provisionResult.draft);
      setBuildErrorMessage(null);
    },
    [buildDraft, onlineUserId, plots, resolvedPlotOwnerLimits],
  );

  const placingBlockAtTile = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition): void => {
      if (
        !onlineUserId ||
        !buildDraft ||
        !selectedDefinitionId ||
        !isBuildPlacementSelectionActive
      ) {
        return;
      }

      setHoverTilePosition(tilePosition);

      const placementWorldLayer =
        resolvingPlacementWorldLayerForTile(tilePosition);
      const placementBlockHeight = resolvingWorldBuildingEffectiveBlockHeight(
        selectedBlockHeight,
        selectedWorldLayer,
      );

      const placementResult = applyingWorldBuildingBuildDraftBlockPlacement({
        draft: buildDraft,
        viewportPlots: plots,
        definitionId: selectedDefinitionId,
        tilePosition,
        worldLayer: placementWorldLayer,
        blockHeight: placementBlockHeight,
        cutFootprintMask: effectiveSelectedCutFootprintMask,
        cutGridAxisCellCount: effectiveSelectedCutGridAxisCellCount,
        actorUserId: onlineUserId,
        blockId: crypto.randomUUID(),
        placedAt: new Date().toISOString(),
      });

      if ("errorMessage" in placementResult) {
        setBuildErrorMessage(placementResult.errorMessage);
        return;
      }

      setBuildDraft(placementResult.draft);
      setBuildErrorMessage(null);
    },
    [
      buildDraft,
      effectiveSelectedCutFootprintMask,
      effectiveSelectedCutGridAxisCellCount,
      isBuildPlacementSelectionActive,
      onlineUserId,
      plots,
      resolvingPlacementWorldLayerForTile,
      selectedDefinitionId,
      selectedBlockHeight,
      selectedWorldLayer,
    ],
  );

  const removingBlockAtTile = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition): void => {
      if (!onlineUserId || !buildDraft) {
        return;
      }

      const removalWorldLayer =
        resolvingRemovalWorldLayerForTile(tilePosition);

      if (removalWorldLayer === null) {
        setBuildErrorMessage("There is no block on that tile to remove.");
        return;
      }

      const removalResult = applyingWorldBuildingBuildDraftBlockRemoval({
        draft: buildDraft,
        viewportPlots: plots,
        tilePosition,
        worldLayer: removalWorldLayer,
        actorUserId: onlineUserId,
      });

      if ("errorMessage" in removalResult) {
        setBuildErrorMessage(removalResult.errorMessage);
        return;
      }

      setBuildDraft(removalResult.draft);
      setBuildErrorMessage(null);
    },
    [buildDraft, onlineUserId, plots, resolvingRemovalWorldLayerForTile],
  );

  const placingBlockAtSelectedTile = useCallback((): void => {
    if (!selectedTilePosition) {
      return;
    }

    placingBlockAtTile(selectedTilePosition);
  }, [placingBlockAtTile, selectedTilePosition]);

  const removingBlockAtSelectedTile = useCallback((): void => {
    if (!selectedTilePosition) {
      return;
    }

    removingBlockAtTile(selectedTilePosition);
  }, [removingBlockAtTile, selectedTilePosition]);

  const claimingTemporaryPlotAtSelectedTile = useCallback((): void => {
    if (!onlineUserId || !buildDraft || !selectedTilePosition) {
      return;
    }

    setHoverTilePosition(selectedTilePosition);

    const provisionResult = applyingWorldBuildingBuildDraftTemporaryPlotProvision(
      {
        draft: buildDraft,
        viewportPlots: plots,
        ownerUserId: onlineUserId,
        tilePosition: selectedTilePosition,
        plotOwnerLimits: resolvedPlotOwnerLimits,
      },
    );

    if ("errorMessage" in provisionResult) {
      setBuildErrorMessage(provisionResult.errorMessage);
      return;
    }

    setBuildDraft(provisionResult.draft);
    setBuildErrorMessage(null);
  }, [
    buildDraft,
    onlineUserId,
    plots,
    resolvedPlotOwnerLimits,
    selectedTilePosition,
  ]);

  const removingTemporaryPlotAtTile = useCallback(
    async (tilePosition: DefiningWorldBuildingTilePosition): Promise<void> => {
      if (!onlineUserId || !buildDraft) {
        return;
      }

      const effectivePlots = mergingWorldBuildingViewportPlotsWithBuildDraft(
        plots,
        buildDraft,
        onlineUserId,
      );
      const plot = findingWorldBuildingPlotContainingTilePosition(
        effectivePlots,
        tilePosition,
      );

      if (!plot || plot.ownerId !== onlineUserId || !plot.isTemporary) {
        setBuildErrorMessage("You can only remove your own temporary tiles.");
        return;
      }

      const isLocalPlot = checkingWorldBuildingBuildDraftPlotIdIsLocal(plot.plotId);
      const unclaimResult = applyingWorldBuildingBuildDraftPlotUnclaim({
        draft: buildDraft,
        viewportPlots: plots,
        tilePosition,
        actorUserId: onlineUserId,
      });

      if ("errorMessage" in unclaimResult) {
        setBuildErrorMessage(unclaimResult.errorMessage);
        return;
      }

      setBuildDraft(unclaimResult.draft);
      setBuildErrorMessage(null);

      if (!isLocalPlot) {
        try {
          await removingWorldBuildingPlotPersistence(plot.plotId);
          const freshPlots = await refetchingPlots();
          setBuildDraft(
            initializingWorldBuildingBuildDraftFromServerPlots(
              freshPlots.plots,
              freshPlots.ownedPlots,
              onlineUserId,
            ),
          );
        } catch (error) {
          setBuildErrorMessage(
            error instanceof Error
              ? error.message
              : "Could not remove temporary tile.",
          );
        }
      }
    },
    [buildDraft, onlineUserId, plots, refetchingPlots],
  );

  const claimingPlotAtSelectedTile = useCallback((): void => {
    if (!selectedTilePosition) {
      return;
    }

    provisioningStarterPlotAtTile(selectedTilePosition);
  }, [provisioningStarterPlotAtTile, selectedTilePosition]);

  const unclaimingPlotAtSelectedTile = useCallback((): void => {
    if (!onlineUserId || !buildDraft || !selectedTilePosition) {
      return;
    }

    const unclaimResult = applyingWorldBuildingBuildDraftPlotUnclaim({
      draft: buildDraft,
      viewportPlots: plots,
      tilePosition: selectedTilePosition,
      actorUserId: onlineUserId,
    });

    if ("errorMessage" in unclaimResult) {
      setBuildErrorMessage(unclaimResult.errorMessage);
      return;
    }

    setBuildDraft(unclaimResult.draft);
    setBuildErrorMessage(null);
    closingBuildModeTilePopover();
  }, [
    buildDraft,
    closingBuildModeTilePopover,
    onlineUserId,
    plots,
    selectedTilePosition,
  ]);

  const savingBuildDraft = useCallback(async (): Promise<void> => {
    if (!onlineUserId || !buildDraft || !hasUnsavedBuildChanges) {
      return;
    }

    setIsSavingBuildDraft(true);

    try {
      await persistingWorldBuildingBuildDraft(buildDraft, onlineUserId);
      const freshPlots = await refetchingPlots();
      setBuildDraft(
        initializingWorldBuildingBuildDraftFromServerPlots(
          freshPlots.plots,
          freshPlots.ownedPlots,
          onlineUserId,
        ),
      );
      setBuildErrorMessage(null);
    } catch (error) {
      setBuildErrorMessage(
        error instanceof Error ? error.message : "Could not save build changes.",
      );
    } finally {
      setIsSavingBuildDraft(false);
    }
  }, [buildDraft, hasUnsavedBuildChanges, onlineUserId, refetchingPlots]);

  const clearingAllDevPlacedObjects = useCallback(async (): Promise<void> => {
    setIsClearingAllDevPlacedObjects(true);

    try {
      await clearingWorldBuildingDevPlacedObjects();
      await refetchingPlots();

      if (isEditSessionActive) {
        setBuildDraft(creatingEmptyWorldBuildingBuildDraftState());
      }

      setBuildErrorMessage(null);
      setIsDiscardBuildDraftDialogOpen(false);
    } catch (error) {
      setBuildErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not clear world building plots and blocks.",
      );
    } finally {
      setIsClearingAllDevPlacedObjects(false);
    }
  }, [isEditSessionActive, refetchingPlots]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handlingBuildModeKeyDown = (event: KeyboardEvent): void => {
      const activeElement = document.activeElement;
      const isTypingInField =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement;

      if (isTypingInField) {
        return;
      }

      if (event.key === DEFINING_WORLD_PLAZA_SIDEBAR_PANEL_DISMISS_KEY) {
        if (isBuildTilePopoverOpen) {
          event.preventDefault();
          closingBuildModeTilePopover();
          return;
        }

        if (editMode === DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD) {
          event.preventDefault();
          togglingBuildMode();
          return;
        }

        if (editMode === DEFINING_WORLD_BUILDING_EDIT_MODE_CLAIM) {
          event.preventDefault();
          togglingClaimMode();
          return;
        }
      }

      if (event.key.toLowerCase() === DEFINING_WORLD_BUILDING_BUILD_MODE_TOGGLE_KEY) {
        event.preventDefault();
        togglingBuildMode();
        return;
      }

      if (event.key.toLowerCase() === DEFINING_WORLD_BUILDING_CLAIM_MODE_TOGGLE_KEY) {
        event.preventDefault();
        togglingClaimMode();
        return;
      }

      if (editMode !== DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD) {
        return;
      }

      if (event.key === DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_CYCLE_KEY) {
        event.preventDefault();
        selectingBlockHeight(
          cyclingWorldBuildingPresetBlockTypeBlockHeight(
            selectedBlockHeight,
            event.shiftKey ? -1 : 1,
          ),
        );
        return;
      }

      const normalizedKey = event.key.toLowerCase();

      if (
        normalizedKey === DEFINING_WORLD_BUILDING_BUILD_MODE_WORLD_LAYER_DECREASE_KEY
      ) {
        event.preventDefault();
        selectingWorldLayer(
          decrementingWorldBuildingWorldLayer(selectedWorldLayer),
        );
        return;
      }

      if (
        normalizedKey === DEFINING_WORLD_BUILDING_BUILD_MODE_WORLD_LAYER_INCREASE_KEY
      ) {
        event.preventDefault();
        selectingWorldLayer(
          incrementingWorldBuildingWorldLayer(selectedWorldLayer),
        );
        return;
      }
    };

    window.addEventListener("keydown", handlingBuildModeKeyDown);

    return () => {
      window.removeEventListener("keydown", handlingBuildModeKeyDown);
    };
  }, [
    closingBuildModeTilePopover,
    editMode,
    isBuildTilePopoverOpen,
    isEnabled,
    selectedBlockHeight,
    selectedWorldLayer,
    selectingBlockHeight,
    selectingWorldLayer,
    togglingBuildMode,
    togglingClaimMode,
  ]);

  useEffect(() => {
    if (!isBuildTilePopoverOpen) {
      return;
    }

    const closingBuildModeTilePopoverOnOutsidePointerDown = (
      event: PointerEvent,
    ): void => {
      const eventTarget = event.target;

      if (
        eventTarget instanceof HTMLElement &&
        eventTarget.closest(`[${DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE}]`)
      ) {
        return;
      }

      closingBuildModeTilePopover();
    };

    document.addEventListener(
      "pointerdown",
      closingBuildModeTilePopoverOnOutsidePointerDown,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        closingBuildModeTilePopoverOnOutsidePointerDown,
      );
    };
  }, [closingBuildModeTilePopover, isBuildTilePopoverOpen]);

  useEffect(() => {
    if (!isEditSessionActive) {
      setHoverTilePosition(null);
      setSelectedTilePosition(null);
      setIsBuildTilePopoverOpen(false);
      setBuildDraft(null);
      return;
    }

    if (!onlineUserId) {
      setBuildDraft(null);
      return;
    }

    setBuildDraft((currentDraft) => {
      if (
        currentDraft &&
        checkingWorldBuildingBuildDraftHasUnsavedChanges(currentDraft)
      ) {
        return currentDraft;
      }

      return initializingWorldBuildingBuildDraftFromServerPlots(
        plots,
        ownedPlots,
        onlineUserId,
      );
    });
  }, [isEditSessionActive, onlineUserId, ownedPlots, plots]);

  return {
    editMode,
    isEditSessionActive,
    isBlockBuildModeActive,
    isBuildModeActive,
    isClaimModeActive,
    selectedDefinitionId,
    isPresetBlockTypeSelected,
    isBuildPlacementSelectionActive,
    selectedWorldLayer,
    selectedBlockHeight,
    selectedCutFootprintMask,
    selectedCutGridAxisCellCount,
    previewCutFootprintMask: effectiveSelectedCutFootprintMask,
    previewCutGridAxisCellCount: effectiveSelectedCutGridAxisCellCount,
    hoveredRemovableBlock,
    hoverTilePosition,
    selectedTilePosition,
    previewTilePosition,
    isBuildTilePopoverOpen,
    buildTilePopoverMode,
    buildErrorMessage,
    canPlaceAtHoverTile,
    canPlaceAtPreviewTile,
    canClaimAtPreviewTile,
    canClaimTemporaryAtPreviewTile,
    canClaimTemporaryAtSelectedTile,
    isPreviewTileValid,
    previewWorldLayer,
    previewBlockHeight,
    canPlaceAtSelectedTile,
    canRemoveAtSelectedTile,
    hasUnsavedBuildChanges,
    hasOwnedPlotForBuilding,
    isSavingBuildDraft,
    isClearingAllDevPlacedObjects,
    isDiscardBuildDraftDialogOpen,
    activeViewportPlots,
    activeOwnedPlots,
    activePlacedBlocks,
    togglingBuildMode,
    togglingClaimMode,
    cancelingBuildDraftDiscard,
    confirmingBuildDraftDiscard,
    selectingBlockDefinition,
    selectingWorldLayer,
    selectingBlockHeight,
    selectingCutFootprintMask,
    selectingCutGridAxisCellCount,
    updatingHoverTilePosition,
    selectingBuildModeTileAtViewport,
    closingBuildModeTilePopover,
    claimingPlotAtSelectedTile,
    claimingTemporaryPlotAtSelectedTile,
    removingTemporaryPlotAtTile,
    placingBlockAtSelectedTile,
    removingBlockAtSelectedTile,
    unclaimingPlotAtSelectedTile,
    savingBuildDraft,
    clearingAllDevPlacedObjects,
  };
}

/** Data attribute marker for build mode UI controls. */
export const USING_WORLD_PLAZA_BUILD_MODE_UI_DATA_ATTRIBUTE =
  DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE;
