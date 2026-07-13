'use client';

import { applyingWorldBuildingBuildDraftBlockPlacement } from '@/components/world/building/domains/applyingWorldBuildingBuildDraftBlockPlacement';
import { applyingWorldBuildingBuildDraftBlockRemoval } from '@/components/world/building/domains/applyingWorldBuildingBuildDraftBlockRemoval';
import { applyingWorldBuildingBuildDraftPlotUnclaim } from '@/components/world/building/domains/applyingWorldBuildingBuildDraftPlotUnclaim';
import { applyingWorldBuildingBuildDraftStarterPlotProvision } from '@/components/world/building/domains/applyingWorldBuildingBuildDraftStarterPlotProvision';
import { applyingWorldBuildingBuildDraftTemporaryPlotProvision } from '@/components/world/building/domains/applyingWorldBuildingBuildDraftTemporaryPlotProvision';
import { applyingWorldBuildingBuildModeBlockHeightSelection } from '@/components/world/building/domains/applyingWorldBuildingBuildModeBlockHeightSelection';
import { checkingWorldBuildingSessionBlockCanPlaceAtTilePosition } from '@/components/world/building/domains/checkingWorldBuildingSessionBlockCanPlaceAtTilePosition';
import {
  checkingWorldBuildingTemporaryTileClaimableForOwner,
  resolvingWorldBuildingTemporaryTileClaimRejectionMessage,
} from '@/components/world/building/domains/checkingWorldBuildingTemporaryTileClaimableForOwner';
import {
  checkingWorldBuildingTileClaimableForOwner,
  resolvingWorldBuildingTileClaimRejectionMessage,
} from '@/components/world/building/domains/checkingWorldBuildingTileClaimableForOwner';
import { checkingWorldBuildingBlockPlacementExtrusionFitsTopLayer } from '@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand';
import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import {
  checkingWorldBuildingBlockHeightIsTowerRelative,
  clampingWorldBuildingBlockHeight,
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
  resolvingWorldBuildingEffectiveBlockHeight,
} from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import {
  checkingWorldBuildingBlockDefinitionAllowsSessionPlacementOutsideClaim,
  DEFINING_WORLD_BUILDING_DEFAULT_BLOCK_DEFINITION_ID,
  resolvingWorldBuildingBlockDefinition,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  checkingWorldBuildingBuildDraftHasOwnedPlot,
  checkingWorldBuildingBuildDraftHasUnsavedChanges,
  checkingWorldBuildingBuildDraftPlotIdIsLocal,
  creatingEmptyWorldBuildingBuildDraftState,
  initializingWorldBuildingBuildDraftFromServerPlots,
  mergingWorldBuildingViewportPlotsWithBuildDraft,
  type DefiningWorldBuildingBuildDraftState,
} from '@/components/world/building/domains/definingWorldBuildingBuildDraft';
import {
  DEFINING_WORLD_BUILDING_BUILD_MODE_WORLD_LAYER_DECREASE_KEY,
  DEFINING_WORLD_BUILDING_BUILD_MODE_WORLD_LAYER_INCREASE_KEY,
} from '@/components/world/building/domains/definingWorldBuildingBuildModeConstants';
import {
  DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
  normalizingWorldBuildingCutFootprintMask,
  normalizingWorldBuildingCutGridAxisCellCount,
  resolvingWorldBuildingCutFootprintFullMask,
  type DefiningWorldBuildingCutGridAxisCellCount,
} from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import {
  DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD,
  DEFINING_WORLD_BUILDING_EDIT_MODE_CLAIM,
  DEFINING_WORLD_BUILDING_EDIT_MODE_OFF,
  type DefiningWorldBuildingEditMode,
  type DefiningWorldBuildingEditPaintAction,
} from '@/components/world/building/domains/definingWorldBuildingEditMode';
import {
  resolvingWorldBuildingPlacedBlockWorldLayer,
  type DefiningWorldBuildingPlacedBlock,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  checkingWorldBuildingPlotCanPlaceBlockAtTilePosition,
  findingWorldBuildingPlotBlockAtTilePosition,
  findingWorldBuildingPlotContainingTilePosition,
  findingWorldBuildingPlotRemovableBlockAtTileLayerPosition,
  type DefiningWorldBuildingPlot,
} from '@/components/world/building/domains/definingWorldBuildingPlot';
import { DEFINING_WORLD_BUILDING_PLOT_CLAIM_WORLD_LAYER } from '@/components/world/building/domains/definingWorldBuildingPlotClaimConstants';
import {
  DEFINING_WORLD_BUILDING_BUILD_MODE_TOGGLE_KEY,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_TOGGLE_KEY,
} from '@/components/world/building/domains/definingWorldBuildingPlotConstants';
import type { DefiningWorldBuildingPlotOwnerLimits } from '@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits';
import {
  checkingWorldBuildingPresetBlockTypeAvailableAtLayer,
  cyclingWorldBuildingPresetBlockTypeBlockHeight,
  DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_CYCLE_KEY,
  resolvingWorldBuildingPresetBlockTypeFromBlockHeight,
} from '@/components/world/building/domains/definingWorldBuildingPresetBlockTypes';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { DEFINING_WORLD_PLAZA_EDIT_MODE_AUTO_SAVE_DEBOUNCE_MS } from '@/components/world/building/domains/definingWorldPlazaEditModeHotbarConstants';
import { DEFINING_WORLD_TEMPORARY_PLOT_FEATURE_ENABLED } from '@/components/world/building/domains/definingWorldTemporaryPlotFeatureFlag';
import { checkingWorldBuildingBlockUsesTileColumnExtrusion } from '@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics';
import {
  decrementingWorldBuildingWorldLayer,
  incrementingWorldBuildingWorldLayer,
} from '@/components/world/building/domains/formattingWorldBuildingWorldLayerSummary';
import { listingWorldBuildingPlacedBlocksFromPlots } from '@/components/world/building/domains/listingWorldBuildingPlacedBlocksFromPlots';
import type { DefiningWorldBuildingBuildModeTilePopoverMode } from '@/components/world/building/domains/resolvingWorldBuildingBuildModeTilePopoverMode';
import { resolvingWorldBuildingBuildModeTilePopoverMode } from '@/components/world/building/domains/resolvingWorldBuildingBuildModeTilePopoverMode';
import { resolvingWorldBuildingEditPaintActionAtTile } from '@/components/world/building/domains/resolvingWorldBuildingEditPaintActionAtTile';
import { resolvingWorldBuildingHoverPlacementWorldLayer } from '@/components/world/building/domains/resolvingWorldBuildingHoverPlacementWorldLayer';
import { resolvingWorldBuildingMinimumWorldLayerForBlockHeight } from '@/components/world/building/domains/resolvingWorldBuildingMinimumWorldLayerForBlockHeight';
import { resolvingWorldBuildingPlotOwnerLimits } from '@/components/world/building/domains/resolvingWorldBuildingPlotOwnerLimits';
import type { RefetchingWorldBuildingPlotsResult } from '@/components/world/building/hooks/usingWorldPlazaPlacedBlocksQuery';
import { clearingWorldBuildingDevPlacedObjects } from '@/components/world/building/repositories/clearingWorldBuildingDevPlacedObjects';
import { persistingWorldBuildingBuildDraft } from '@/components/world/building/repositories/persistingWorldBuildingBuildDraft';
import { removingWorldBuildingPlotPersistence } from '@/components/world/building/repositories/persistingWorldBuildingPlacedBlock';
import { persistingWorldBuildingSessionBlock } from '@/components/world/building/repositories/persistingWorldBuildingSessionBlock';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_SIDEBAR_PANEL_DISMISS_KEY } from '@/components/world/domains/definingWorldPlazaSidebarPanelConstants';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from 'react';

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
  togglingEditSession: () => void;
  activatingEditMode: (
    targetMode: Exclude<DefiningWorldBuildingEditMode, 'off'>
  ) => void;
  activatingBuildMode: () => void;
  activatingClaimMode: () => void;
  cancelingBuildDraftDiscard: () => void;
  confirmingBuildDraftDiscard: () => void;
  selectingBlockDefinition: (
    definitionId: DefiningWorldBuildingBlockDefinitionId
  ) => void;
  enteringBuildPlacementForBlockDefinition: (
    definitionId: DefiningWorldBuildingBlockDefinitionId,
    blockHeight: number
  ) => void;
  selectingWorldLayer: (worldLayer: number) => void;
  selectingBlockHeight: (blockHeight: number) => void;
  selectingCutFootprintMask: (cutFootprintMask: number) => void;
  selectingCutGridAxisCellCount: (
    axisCellCount: DefiningWorldBuildingCutGridAxisCellCount
  ) => void;
  updatingHoverTilePosition: (
    tilePosition: DefiningWorldBuildingTilePosition | null
  ) => void;
  selectingBuildModeTileAtViewport: (
    tilePosition: DefiningWorldBuildingTilePosition | null
  ) => void;
  actingOnEditModeTileAtViewport: (
    tilePosition: DefiningWorldBuildingTilePosition | null
  ) => void;
  resolvingEditPaintActionAtTile: (
    tilePosition: DefiningWorldBuildingTilePosition
  ) => DefiningWorldBuildingEditPaintAction | null;
  paintingEditModeTileAtViewport: (
    tilePosition: DefiningWorldBuildingTilePosition,
    paintAction: DefiningWorldBuildingEditPaintAction
  ) => void;
  removingBlockAtTile: (
    tilePosition: DefiningWorldBuildingTilePosition
  ) => void;
  closingBuildModeTilePopover: () => void;
  claimingPlotAtSelectedTile: () => void;
  claimingTemporaryPlotAtSelectedTile: () => void;
  removingTemporaryPlotAtTile: (
    tilePosition: DefiningWorldBuildingTilePosition
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
  onSuccessfulBlockPlacementRef?: MutableRefObject<
    | ((
        tilePosition: DefiningWorldBuildingTilePosition,
        placedBlockId: string,
        isSessionPlacement?: boolean
      ) => void)
    | null
  >;
  onBlockRemovedRef?: MutableRefObject<
    ((removedBlock: DefiningWorldBuildingPlacedBlock) => void) | null
  >;
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
  onSuccessfulBlockPlacementRef,
  onBlockRemovedRef,
}: UsingWorldPlazaBuildModeParams): UsingWorldPlazaBuildModeResult {
  const resolvedPlotOwnerLimits = useMemo(
    () => resolvingWorldBuildingPlotOwnerLimits(plotOwnerLimits),
    [plotOwnerLimits]
  );
  const [editMode, setEditMode] = useState<DefiningWorldBuildingEditMode>(
    DEFINING_WORLD_BUILDING_EDIT_MODE_OFF
  );
  const isEditSessionActive =
    editMode !== DEFINING_WORLD_BUILDING_EDIT_MODE_OFF;
  const isBlockBuildModeActive =
    editMode === DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD;
  const isBuildModeActive = isEditSessionActive;
  const isClaimModeActive =
    editMode === DEFINING_WORLD_BUILDING_EDIT_MODE_CLAIM;
  const [buildDraft, setBuildDraftState] =
    useState<DefiningWorldBuildingBuildDraftState | null>(null);
  /**
   * Synchronous mirror of `buildDraft`. Craft placement calls
   * `togglingEditSession` in the same turn as `setState`, so flush/save must
   * read the post-placement draft here, not the stale React closure.
   */
  const buildDraftRef = useRef<DefiningWorldBuildingBuildDraftState | null>(
    null
  );
  const assigningBuildDraft = useCallback(
    (
      nextDraft:
        | DefiningWorldBuildingBuildDraftState
        | null
        | ((
            currentDraft: DefiningWorldBuildingBuildDraftState | null
          ) => DefiningWorldBuildingBuildDraftState | null)
    ): void => {
      if (typeof nextDraft === 'function') {
        setBuildDraftState((currentDraft) => {
          const resolvedDraft = nextDraft(currentDraft);
          buildDraftRef.current = resolvedDraft;
          return resolvedDraft;
        });
        return;
      }

      buildDraftRef.current = nextDraft;
      setBuildDraftState(nextDraft);
    },
    []
  );
  const [selectedDefinitionId, setSelectedDefinitionId] =
    useState<DefiningWorldBuildingBlockDefinitionId | null>(
      DEFINING_WORLD_BUILDING_DEFAULT_BLOCK_DEFINITION_ID
    );
  const [hoverTilePosition, setHoverTilePosition] =
    useState<DefiningWorldBuildingTilePosition | null>(null);
  const [selectedTilePosition, setSelectedTilePosition] =
    useState<DefiningWorldBuildingTilePosition | null>(null);
  const [isBuildTilePopoverOpen, setIsBuildTilePopoverOpen] = useState(false);
  const [buildErrorMessage, setBuildErrorMessage] = useState<string | null>(
    null
  );
  const [selectedWorldLayer, setSelectedWorldLayer] = useState<number>(() =>
    resolvingWorldBuildingMinimumWorldLayerForBlockHeight(
      DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT
    )
  );
  const [selectedBlockHeight, setSelectedBlockHeight] = useState<number>(
    DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT
  );
  const [selectedCutFootprintMask, setSelectedCutFootprintMask] =
    useState<number>(
      resolvingWorldBuildingCutFootprintFullMask(
        DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT
      )
    );
  const [selectedCutGridAxisCellCount, setSelectedCutGridAxisCellCount] =
    useState<DefiningWorldBuildingCutGridAxisCellCount>(
      DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT
    );
  const [isPresetBlockTypeSelected, setIsPresetBlockTypeSelected] =
    useState<boolean>(true);
  const [isSavingBuildDraft, setIsSavingBuildDraft] = useState(false);
  const [isClearingAllDevPlacedObjects, setIsClearingAllDevPlacedObjects] =
    useState(false);
  const [isDiscardBuildDraftDialogOpen, setIsDiscardBuildDraftDialogOpen] =
    useState(false);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingBuildDraftRef = useRef(false);

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
      onlineUserId
    );
  }, [buildDraft, isEditSessionActive, onlineUserId, plots]);

  const activePlacedBlocks = useMemo(() => {
    const fromPlots =
      listingWorldBuildingPlacedBlocksFromPlots(activeViewportPlots);
    const localSessionBlocks = buildDraft?.sessionBlocks ?? [];
    const blocksById = new Map(
      fromPlots.map((block) => [block.blockId, block] as const)
    );

    for (const block of localSessionBlocks) {
      blocksById.set(block.blockId, block);
    }

    return Array.from(blocksById.values());
  }, [activeViewportPlots, buildDraft?.sessionBlocks]);

  const activeOwnedPlots = useMemo(() => {
    if (!isEditSessionActive || !buildDraft || !onlineUserId) {
      return ownedPlots;
    }

    return buildDraft.workingPlots.filter(
      (plot) => plot.ownerId === onlineUserId
    );
  }, [buildDraft, isEditSessionActive, onlineUserId, ownedPlots]);

  const hasUnsavedBuildChanges =
    checkingWorldBuildingBuildDraftHasUnsavedChanges(buildDraft);

  const hasOwnedPlotForBuilding = useMemo(() => {
    if (isEditSessionActive && buildDraft && onlineUserId) {
      return checkingWorldBuildingBuildDraftHasOwnedPlot(
        buildDraft,
        onlineUserId
      );
    }

    return ownedPlots.length > 0;
  }, [buildDraft, isEditSessionActive, onlineUserId, ownedPlots]);

  const cancelingBuildDraftDiscard = useCallback((): void => {
    setIsDiscardBuildDraftDialogOpen(false);
  }, []);

  const confirmingBuildDraftDiscard = useCallback((): void => {
    exitingBuildMode();
  }, [exitingBuildMode]);

  const selectingBlockDefinition = useCallback(
    (definitionId: DefiningWorldBuildingBlockDefinitionId): void => {
      setSelectedDefinitionId((currentDefinitionId) =>
        currentDefinitionId === definitionId ? null : definitionId
      );
      setBuildErrorMessage(null);
    },
    []
  );

  const enteringBuildPlacementForBlockDefinition = useCallback(
    (
      definitionId: DefiningWorldBuildingBlockDefinitionId,
      blockHeight: number
    ): void => {
      setSelectedDefinitionId(definitionId);

      const selectionResult =
        applyingWorldBuildingBuildModeBlockHeightSelection({
          requestedBlockHeight: blockHeight,
          selectedWorldLayer,
        });

      setIsPresetBlockTypeSelected(true);
      setSelectedWorldLayer(selectionResult.selectedWorldLayer);
      setSelectedBlockHeight(selectionResult.selectedBlockHeight);
      setBuildErrorMessage(null);
    },
    [selectedWorldLayer]
  );

  const selectingWorldLayer = useCallback((worldLayer: number): void => {
    setSelectedWorldLayer(worldLayer);
    setSelectedBlockHeight((currentBlockHeight) => {
      if (checkingWorldBuildingBlockHeightIsTowerRelative(currentBlockHeight)) {
        return currentBlockHeight;
      }

      const clampedBlockHeight = clampingWorldBuildingBlockHeight(
        currentBlockHeight,
        worldLayer
      );
      const matchingPreset =
        resolvingWorldBuildingPresetBlockTypeFromBlockHeight(
          clampedBlockHeight,
          worldLayer
        );

      if (
        matchingPreset.blockHeight === clampedBlockHeight &&
        checkingWorldBuildingPresetBlockTypeAvailableAtLayer(
          matchingPreset,
          worldLayer
        )
      ) {
        return clampedBlockHeight;
      }

      if (
        checkingWorldBuildingPresetBlockTypeAvailableAtLayer(
          matchingPreset,
          worldLayer
        )
      ) {
        return matchingPreset.blockHeight;
      }

      return clampingWorldBuildingBlockHeight(
        DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT,
        worldLayer
      );
    });
    setBuildErrorMessage(null);
  }, []);

  const selectingBlockHeight = useCallback(
    (blockHeight: number): void => {
      const requestedPresetBlockType =
        resolvingWorldBuildingPresetBlockTypeFromBlockHeight(
          blockHeight,
          selectedWorldLayer
        );
      const currentPresetBlockType =
        resolvingWorldBuildingPresetBlockTypeFromBlockHeight(
          selectedBlockHeight,
          selectedWorldLayer
        );

      if (
        isPresetBlockTypeSelected &&
        requestedPresetBlockType.id === currentPresetBlockType.id
      ) {
        setIsPresetBlockTypeSelected(false);
        setBuildErrorMessage(null);
        return;
      }

      const selectionResult =
        applyingWorldBuildingBuildModeBlockHeightSelection({
          requestedBlockHeight: blockHeight,
          selectedWorldLayer,
        });

      setIsPresetBlockTypeSelected(true);
      setSelectedWorldLayer(selectionResult.selectedWorldLayer);
      setSelectedBlockHeight(selectionResult.selectedBlockHeight);
      setBuildErrorMessage(null);
    },
    [isPresetBlockTypeSelected, selectedBlockHeight, selectedWorldLayer]
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
      hoverTilePosition
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
          selectedCutGridAxisCellCount
        )
      );
      setBuildErrorMessage(null);
    },
    [selectedCutGridAxisCellCount]
  );

  const selectingCutGridAxisCellCount = useCallback(
    (axisCellCount: DefiningWorldBuildingCutGridAxisCellCount): void => {
      const normalizedAxisCellCount =
        normalizingWorldBuildingCutGridAxisCellCount(axisCellCount);

      setSelectedCutGridAxisCellCount(normalizedAxisCellCount);
      setSelectedCutFootprintMask(
        resolvingWorldBuildingCutFootprintFullMask(normalizedAxisCellCount)
      );
      setBuildErrorMessage(null);
    },
    []
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
  const effectiveSelectedCutGridAxisCellCount =
    selectedDefinitionUsesCutFootprint
      ? selectedCutGridAxisCellCount
      : DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT;

  const updatingHoverTilePosition = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition | null): void => {
      setHoverTilePosition(tilePosition);
    },
    []
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
        resolvedPlotOwnerLimits
      ),
    [
      activeViewportPlots,
      editMode,
      onlineUserId,
      resolvedPlotOwnerLimits,
      selectedTilePosition,
    ]
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
    [activePlacedBlocks, selectedBlockHeight, selectedWorldLayer]
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
        tilePosition
      );
      const placementWorldLayer =
        resolvingPlacementWorldLayerForTile(tilePosition);
      const placementBlockHeight = resolvingWorldBuildingEffectiveBlockHeight(
        selectedBlockHeight,
        selectedWorldLayer
      );

      if (plot) {
        return checkingWorldBuildingPlotCanPlaceBlockAtTilePosition(
          plot,
          tilePosition,
          onlineUserId,
          placementWorldLayer,
          placementBlockHeight,
          effectiveSelectedCutFootprintMask
        );
      }

      if (
        checkingWorldBuildingBlockDefinitionAllowsSessionPlacementOutsideClaim(
          selectedDefinitionId
        )
      ) {
        return checkingWorldBuildingSessionBlockCanPlaceAtTilePosition(
          activeViewportPlots,
          activePlacedBlocks,
          tilePosition,
          selectedDefinitionId,
          placementWorldLayer,
          placementBlockHeight,
          effectiveSelectedCutFootprintMask
        );
      }

      return false;
    },
    [
      activePlacedBlocks,
      activeViewportPlots,
      effectiveSelectedCutFootprintMask,
      isBuildPlacementSelectionActive,
      onlineUserId,
      resolvingPlacementWorldLayerForTile,
      selectedBlockHeight,
      selectedDefinitionId,
      selectedWorldLayer,
    ]
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
      resolvedPlotOwnerLimits
    );
  }, [
    activeViewportPlots,
    onlineUserId,
    previewTilePosition,
    resolvedPlotOwnerLimits,
  ]);

  const canClaimTemporaryAtPreviewTile = useMemo(() => {
    if (!onlineUserId || !previewTilePosition) {
      return false;
    }

    return checkingWorldBuildingTemporaryTileClaimableForOwner(
      activeViewportPlots,
      previewTilePosition,
      onlineUserId,
      resolvedPlotOwnerLimits
    );
  }, [
    activeViewportPlots,
    onlineUserId,
    previewTilePosition,
    resolvedPlotOwnerLimits,
  ]);

  const canClaimTemporaryAtSelectedTile = useMemo(() => {
    if (!onlineUserId || !selectedTilePosition) {
      return false;
    }

    return checkingWorldBuildingTemporaryTileClaimableForOwner(
      activeViewportPlots,
      selectedTilePosition,
      onlineUserId,
      resolvedPlotOwnerLimits
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
  }, [
    isClaimModeActive,
    previewTilePosition,
    resolvingPlacementWorldLayerForTile,
  ]);

  const previewBlockHeight = useMemo(() => {
    if (isClaimModeActive) {
      return DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT;
    }

    return resolvingWorldBuildingEffectiveBlockHeight(
      selectedBlockHeight,
      selectedWorldLayer
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
        previewBlockHeight
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
        tilePosition
      );

      if (!plot || plot.ownerId !== onlineUserId) {
        return null;
      }

      const topBlock = findingWorldBuildingPlotBlockAtTilePosition(
        plot,
        tilePosition
      );

      if (!topBlock) {
        return null;
      }

      const removalWorldLayer =
        resolvingWorldBuildingPlacedBlockWorldLayer(topBlock);

      return findingWorldBuildingPlotRemovableBlockAtTileLayerPosition(
        plot,
        tilePosition,
        removalWorldLayer
      )
        ? removalWorldLayer
        : null;
    },
    [activeViewportPlots, onlineUserId]
  );

  const canRemoveAtSelectedTile = useMemo(
    () => resolvingRemovalWorldLayerForTile(selectedTilePosition) !== null,
    [resolvingRemovalWorldLayerForTile, selectedTilePosition]
  );

  const selectingBuildModeTileAtViewport = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition | null): void => {
      if (!tilePosition) {
        setBuildErrorMessage('Pick a tile to build on.');
        return;
      }

      setSelectedTilePosition(tilePosition);
      setIsBuildTilePopoverOpen(true);
      setBuildErrorMessage(null);
    },
    []
  );

  const placingBlockAtTile = useCallback(
    async (tilePosition: DefiningWorldBuildingTilePosition): Promise<void> => {
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
        selectedWorldLayer
      );

      const blockId = crypto.randomUUID();
      const placedAt = new Date().toISOString();

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
        blockId,
        placedAt,
      });

      if ('errorMessage' in placementResult) {
        setBuildErrorMessage(placementResult.errorMessage);
        return;
      }

      assigningBuildDraft(placementResult.draft);
      setBuildErrorMessage(null);

      // Session builds are not "unsaved draft" changes. Craft success exits edit
      // mode in the same turn, which clears the draft. Persist + refetch must
      // finish first or the campfire vanishes when the scene drops back to
      // server `placedBlocks`.
      if (placementResult.isSessionPlacement) {
        const placedSessionBlock = placementResult.draft.sessionBlocks.find(
          (block) => block.blockId === blockId
        );

        if (placedSessionBlock) {
          try {
            await persistingWorldBuildingSessionBlock(placedSessionBlock);
            await refetchingPlots();
          } catch (error) {
            assigningBuildDraft({
              ...placementResult.draft,
              sessionBlocks: placementResult.draft.sessionBlocks.filter(
                (block) => block.blockId !== blockId
              ),
            });
            setBuildErrorMessage(
              error instanceof Error
                ? error.message
                : 'Could not place temporary build.'
            );
            return;
          }
        }
      }

      onSuccessfulBlockPlacementRef?.current?.(
        tilePosition,
        blockId,
        placementResult.isSessionPlacement
      );
    },
    [
      assigningBuildDraft,
      buildDraft,
      effectiveSelectedCutFootprintMask,
      effectiveSelectedCutGridAxisCellCount,
      isBuildPlacementSelectionActive,
      onSuccessfulBlockPlacementRef,
      onlineUserId,
      plots,
      refetchingPlots,
      resolvingPlacementWorldLayerForTile,
      selectedDefinitionId,
      selectedBlockHeight,
      selectedWorldLayer,
    ]
  );

  const removingBlockAtTile = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition): void => {
      if (!onlineUserId || !buildDraft) {
        return;
      }

      const removalWorldLayer = resolvingRemovalWorldLayerForTile(tilePosition);

      if (removalWorldLayer === null) {
        setBuildErrorMessage('There is no block on that tile to remove.');
        return;
      }

      const plot = findingWorldBuildingPlotContainingTilePosition(
        activeViewportPlots,
        tilePosition
      );
      const removedBlock =
        plot === null
          ? null
          : findingWorldBuildingPlotRemovableBlockAtTileLayerPosition(
              plot,
              tilePosition,
              removalWorldLayer
            );

      const removalResult = applyingWorldBuildingBuildDraftBlockRemoval({
        draft: buildDraft,
        viewportPlots: plots,
        tilePosition,
        worldLayer: removalWorldLayer,
        actorUserId: onlineUserId,
      });

      if ('errorMessage' in removalResult) {
        setBuildErrorMessage(removalResult.errorMessage);
        return;
      }

      assigningBuildDraft(removalResult.draft);
      setBuildErrorMessage(null);

      if (removedBlock) {
        onBlockRemovedRef?.current?.(removedBlock);
      }
    },
    [
      activeViewportPlots,
      assigningBuildDraft,
      buildDraft,
      onBlockRemovedRef,
      onlineUserId,
      plots,
      resolvingRemovalWorldLayerForTile,
    ]
  );

  const placingBlockAtSelectedTile = useCallback((): void => {
    if (!selectedTilePosition) {
      return;
    }

    void placingBlockAtTile(selectedTilePosition);
  }, [placingBlockAtTile, selectedTilePosition]);

  const removingBlockAtSelectedTile = useCallback((): void => {
    if (!selectedTilePosition) {
      return;
    }

    removingBlockAtTile(selectedTilePosition);
  }, [removingBlockAtTile, selectedTilePosition]);

  const claimingTemporaryPlotAtSelectedTile = useCallback((): void => {
    if (!DEFINING_WORLD_TEMPORARY_PLOT_FEATURE_ENABLED) {
      return;
    }

    if (!onlineUserId || !buildDraft || !selectedTilePosition) {
      return;
    }

    setHoverTilePosition(selectedTilePosition);

    const provisionResult =
      applyingWorldBuildingBuildDraftTemporaryPlotProvision({
        draft: buildDraft,
        viewportPlots: plots,
        ownerUserId: onlineUserId,
        tilePosition: selectedTilePosition,
        plotOwnerLimits: resolvedPlotOwnerLimits,
      });

    if ('errorMessage' in provisionResult) {
      setBuildErrorMessage(provisionResult.errorMessage);
      return;
    }

    assigningBuildDraft(provisionResult.draft);
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
        onlineUserId
      );
      const plot = findingWorldBuildingPlotContainingTilePosition(
        effectivePlots,
        tilePosition
      );

      if (!plot || plot.ownerId !== onlineUserId || !plot.isTemporary) {
        setBuildErrorMessage('You can only remove your own temporary tiles.');
        return;
      }

      const isLocalPlot = checkingWorldBuildingBuildDraftPlotIdIsLocal(
        plot.plotId
      );
      const unclaimResult = applyingWorldBuildingBuildDraftPlotUnclaim({
        draft: buildDraft,
        viewportPlots: plots,
        tilePosition,
        actorUserId: onlineUserId,
      });

      if ('errorMessage' in unclaimResult) {
        setBuildErrorMessage(unclaimResult.errorMessage);
        return;
      }

      assigningBuildDraft(unclaimResult.draft);
      setBuildErrorMessage(null);

      if (!isLocalPlot) {
        try {
          await removingWorldBuildingPlotPersistence(plot.plotId);
          const freshPlots = await refetchingPlots();
          assigningBuildDraft(
            initializingWorldBuildingBuildDraftFromServerPlots(
              freshPlots.plots,
              freshPlots.ownedPlots,
              onlineUserId
            )
          );
        } catch (error) {
          setBuildErrorMessage(
            error instanceof Error
              ? error.message
              : 'Could not remove temporary tile.'
          );
        }
      }
    },
    [buildDraft, onlineUserId, plots, refetchingPlots]
  );

  const unclaimingPlotAtTile = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition): void => {
      if (!onlineUserId || !buildDraft) {
        return;
      }

      const unclaimResult = applyingWorldBuildingBuildDraftPlotUnclaim({
        draft: buildDraft,
        viewportPlots: plots,
        tilePosition,
        actorUserId: onlineUserId,
      });

      if ('errorMessage' in unclaimResult) {
        setBuildErrorMessage(unclaimResult.errorMessage);
        return;
      }

      assigningBuildDraft(unclaimResult.draft);
      setBuildErrorMessage(null);
    },
    [buildDraft, onlineUserId, plots]
  );

  const claimingPlotAtTile = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition): void => {
      if (!onlineUserId || !buildDraft) {
        return;
      }

      setHoverTilePosition(tilePosition);

      const existingPlot = findingWorldBuildingPlotContainingTilePosition(
        activeViewportPlots,
        tilePosition
      );

      if (existingPlot?.ownerId === onlineUserId) {
        unclaimingPlotAtTile(tilePosition);
        return;
      }

      const starterPlotProvisionInput = {
        draft: buildDraft,
        viewportPlots: plots,
        ownerUserId: onlineUserId,
        tilePosition,
        plotOwnerLimits: resolvedPlotOwnerLimits,
      };

      const isNormalClaimable = checkingWorldBuildingTileClaimableForOwner(
        activeViewportPlots,
        tilePosition,
        onlineUserId,
        resolvedPlotOwnerLimits
      );

      if (isNormalClaimable) {
        const starterPlotProvisionResult =
          applyingWorldBuildingBuildDraftStarterPlotProvision(
            starterPlotProvisionInput
          );

        if (!('errorMessage' in starterPlotProvisionResult)) {
          assigningBuildDraft(starterPlotProvisionResult.draft);
          setBuildErrorMessage(null);
          return;
        }
      }

      const isTemporaryClaimable =
        checkingWorldBuildingTemporaryTileClaimableForOwner(
          activeViewportPlots,
          tilePosition,
          onlineUserId,
          resolvedPlotOwnerLimits
        );

      if (isTemporaryClaimable) {
        const temporaryPlotProvisionResult =
          applyingWorldBuildingBuildDraftTemporaryPlotProvision(
            starterPlotProvisionInput
          );

        if ('errorMessage' in temporaryPlotProvisionResult) {
          setBuildErrorMessage(temporaryPlotProvisionResult.errorMessage);
          return;
        }

        assigningBuildDraft(temporaryPlotProvisionResult.draft);
        setBuildErrorMessage(null);
        return;
      }

      setBuildErrorMessage(
        isNormalClaimable || !DEFINING_WORLD_TEMPORARY_PLOT_FEATURE_ENABLED
          ? resolvingWorldBuildingTileClaimRejectionMessage(
              activeViewportPlots,
              tilePosition,
              onlineUserId,
              resolvedPlotOwnerLimits
            )
          : resolvingWorldBuildingTemporaryTileClaimRejectionMessage(
              activeViewportPlots,
              tilePosition,
              onlineUserId,
              resolvedPlotOwnerLimits
            )
      );
    },
    [
      activeViewportPlots,
      buildDraft,
      onlineUserId,
      plots,
      resolvedPlotOwnerLimits,
      unclaimingPlotAtTile,
    ]
  );

  const claimingPlotAtSelectedTile = useCallback((): void => {
    if (!selectedTilePosition) {
      return;
    }

    claimingPlotAtTile(selectedTilePosition);
  }, [claimingPlotAtTile, selectedTilePosition]);

  const unclaimingPlotAtSelectedTile = useCallback((): void => {
    if (!selectedTilePosition) {
      return;
    }

    unclaimingPlotAtTile(selectedTilePosition);
    closingBuildModeTilePopover();
  }, [closingBuildModeTilePopover, selectedTilePosition, unclaimingPlotAtTile]);

  const savingBuildDraft = useCallback(async (): Promise<void> => {
    const draftToPersist = buildDraftRef.current;

    if (
      !onlineUserId ||
      !draftToPersist ||
      !checkingWorldBuildingBuildDraftHasUnsavedChanges(draftToPersist)
    ) {
      return;
    }

    setIsSavingBuildDraft(true);

    try {
      await persistingWorldBuildingBuildDraft(draftToPersist, onlineUserId);
      const freshPlots = await refetchingPlots();
      assigningBuildDraft(
        initializingWorldBuildingBuildDraftFromServerPlots(
          freshPlots.plots,
          freshPlots.ownedPlots,
          onlineUserId
        )
      );
      setBuildErrorMessage(null);
    } catch (error) {
      setBuildErrorMessage(
        error instanceof Error ? error.message : 'Could not save build changes.'
      );
    } finally {
      setIsSavingBuildDraft(false);
    }
  }, [assigningBuildDraft, onlineUserId, refetchingPlots]);

  isSavingBuildDraftRef.current = isSavingBuildDraft;

  const flushingBuildDraftBeforeExiting =
    useCallback(async (): Promise<void> => {
      if (
        checkingWorldBuildingBuildDraftHasUnsavedChanges(buildDraftRef.current)
      ) {
        await savingBuildDraft();
      }

      exitingBuildMode();
    }, [exitingBuildMode, savingBuildDraft]);

  const switchingEditMode = useCallback(
    (targetMode: Exclude<DefiningWorldBuildingEditMode, 'off'>): void => {
      if (editMode === targetMode) {
        void flushingBuildDraftBeforeExiting();
        return;
      }

      setEditMode(targetMode);
      setBuildErrorMessage(null);
      setSelectedTilePosition(null);
      setIsBuildTilePopoverOpen(false);
    },
    [editMode, flushingBuildDraftBeforeExiting]
  );

  const togglingBuildMode = useCallback((): void => {
    switchingEditMode(DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD);
  }, [switchingEditMode]);

  const togglingClaimMode = useCallback((): void => {
    switchingEditMode(DEFINING_WORLD_BUILDING_EDIT_MODE_CLAIM);
  }, [switchingEditMode]);

  /** Top action bar: enter Build, or exit whichever edit mode is active. */
  const togglingEditSession = useCallback((): void => {
    if (editMode !== DEFINING_WORLD_BUILDING_EDIT_MODE_OFF) {
      void flushingBuildDraftBeforeExiting();
      return;
    }

    setEditMode(DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD);
    setBuildErrorMessage(null);
    setSelectedTilePosition(null);
    setIsBuildTilePopoverOpen(false);
  }, [editMode, flushingBuildDraftBeforeExiting]);

  /** Hotbar Build/Claim chips: switch modes without exiting on re-click. */
  const activatingEditMode = useCallback(
    (targetMode: Exclude<DefiningWorldBuildingEditMode, 'off'>): void => {
      if (editMode === targetMode) {
        return;
      }

      setEditMode(targetMode);
      setBuildErrorMessage(null);
      setSelectedTilePosition(null);
      setIsBuildTilePopoverOpen(false);
    },
    [editMode]
  );

  const activatingBuildMode = useCallback((): void => {
    activatingEditMode(DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD);
  }, [activatingEditMode]);

  const activatingClaimMode = useCallback((): void => {
    activatingEditMode(DEFINING_WORLD_BUILDING_EDIT_MODE_CLAIM);
  }, [activatingEditMode]);

  const actingOnEditModeTileAtViewport = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition | null): void => {
      if (!tilePosition || !onlineUserId) {
        setBuildErrorMessage(
          editMode === DEFINING_WORLD_BUILDING_EDIT_MODE_CLAIM
            ? 'Pick a tile to claim.'
            : 'Pick a tile to build on.'
        );
        return;
      }

      setHoverTilePosition(tilePosition);
      setBuildErrorMessage(null);

      if (editMode === DEFINING_WORLD_BUILDING_EDIT_MODE_CLAIM) {
        claimingPlotAtTile(tilePosition);
        return;
      }

      if (editMode === DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD) {
        if (
          isBuildPlacementSelectionActive &&
          checkingCanPlaceAtTile(tilePosition)
        ) {
          void placingBlockAtTile(tilePosition);
          return;
        }

        if (resolvingRemovalWorldLayerForTile(tilePosition) !== null) {
          removingBlockAtTile(tilePosition);
        }
      }
    },
    [
      claimingPlotAtTile,
      checkingCanPlaceAtTile,
      editMode,
      isBuildPlacementSelectionActive,
      onlineUserId,
      placingBlockAtTile,
      removingBlockAtTile,
      resolvingRemovalWorldLayerForTile,
    ]
  );

  const resolvingEditPaintActionAtTile = useCallback(
    (
      tilePosition: DefiningWorldBuildingTilePosition
    ): DefiningWorldBuildingEditPaintAction | null => {
      if (!onlineUserId) {
        return null;
      }

      return resolvingWorldBuildingEditPaintActionAtTile({
        editMode,
        tilePosition,
        activeViewportPlots,
        ownerUserId: onlineUserId,
        isBuildPlacementSelectionActive,
        canPlaceAtTile: checkingCanPlaceAtTile(tilePosition),
        canRemoveAtTile:
          resolvingRemovalWorldLayerForTile(tilePosition) !== null,
      });
    },
    [
      activeViewportPlots,
      checkingCanPlaceAtTile,
      editMode,
      isBuildPlacementSelectionActive,
      onlineUserId,
      resolvingRemovalWorldLayerForTile,
    ]
  );

  const paintingEditModeTileAtViewport = useCallback(
    (
      tilePosition: DefiningWorldBuildingTilePosition,
      paintAction: DefiningWorldBuildingEditPaintAction
    ): void => {
      if (!onlineUserId) {
        return;
      }

      setHoverTilePosition(tilePosition);
      setBuildErrorMessage(null);

      if (paintAction === 'claim') {
        const existingPlot = findingWorldBuildingPlotContainingTilePosition(
          activeViewportPlots,
          tilePosition
        );
        if (existingPlot?.ownerId === onlineUserId) {
          return;
        }
        claimingPlotAtTile(tilePosition);
        return;
      }

      if (paintAction === 'unclaim') {
        const existingPlot = findingWorldBuildingPlotContainingTilePosition(
          activeViewportPlots,
          tilePosition
        );
        if (existingPlot?.ownerId !== onlineUserId) {
          return;
        }
        unclaimingPlotAtTile(tilePosition);
        return;
      }

      if (paintAction === 'place') {
        if (
          isBuildPlacementSelectionActive &&
          checkingCanPlaceAtTile(tilePosition)
        ) {
          void placingBlockAtTile(tilePosition);
        }
        return;
      }

      if (paintAction === 'remove') {
        if (resolvingRemovalWorldLayerForTile(tilePosition) !== null) {
          removingBlockAtTile(tilePosition);
        }
      }
    },
    [
      activeViewportPlots,
      claimingPlotAtTile,
      checkingCanPlaceAtTile,
      isBuildPlacementSelectionActive,
      onlineUserId,
      placingBlockAtTile,
      removingBlockAtTile,
      resolvingRemovalWorldLayerForTile,
      unclaimingPlotAtTile,
    ]
  );

  const clearingAllDevPlacedObjects = useCallback(async (): Promise<void> => {
    setIsClearingAllDevPlacedObjects(true);

    try {
      await clearingWorldBuildingDevPlacedObjects();
      await refetchingPlots();

      if (isEditSessionActive) {
        assigningBuildDraft(creatingEmptyWorldBuildingBuildDraftState());
      }

      setBuildErrorMessage(null);
      setIsDiscardBuildDraftDialogOpen(false);
    } catch (error) {
      setBuildErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not clear world building plots and blocks.'
      );
    } finally {
      setIsClearingAllDevPlacedObjects(false);
    }
  }, [isEditSessionActive, refetchingPlots]);

  useEffect(() => {
    if (!isEditSessionActive || !hasUnsavedBuildChanges) {
      return;
    }

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      void savingBuildDraft();
    }, DEFINING_WORLD_PLAZA_EDIT_MODE_AUTO_SAVE_DEBOUNCE_MS);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [
    buildDraft,
    hasUnsavedBuildChanges,
    isEditSessionActive,
    savingBuildDraft,
  ]);

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

      if (
        event.key.toLowerCase() ===
        DEFINING_WORLD_BUILDING_BUILD_MODE_TOGGLE_KEY
      ) {
        event.preventDefault();
        togglingBuildMode();
        return;
      }

      if (
        event.key.toLowerCase() ===
        DEFINING_WORLD_BUILDING_CLAIM_MODE_TOGGLE_KEY
      ) {
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
            event.shiftKey ? -1 : 1
          )
        );
        return;
      }

      const normalizedKey = event.key.toLowerCase();

      if (
        normalizedKey ===
        DEFINING_WORLD_BUILDING_BUILD_MODE_WORLD_LAYER_DECREASE_KEY
      ) {
        event.preventDefault();
        selectingWorldLayer(
          decrementingWorldBuildingWorldLayer(selectedWorldLayer)
        );
        return;
      }

      if (
        normalizedKey ===
        DEFINING_WORLD_BUILDING_BUILD_MODE_WORLD_LAYER_INCREASE_KEY
      ) {
        event.preventDefault();
        selectingWorldLayer(
          incrementingWorldBuildingWorldLayer(selectedWorldLayer)
        );
        return;
      }
    };

    window.addEventListener('keydown', handlingBuildModeKeyDown);

    return () => {
      window.removeEventListener('keydown', handlingBuildModeKeyDown);
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
      event: PointerEvent
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
      'pointerdown',
      closingBuildModeTilePopoverOnOutsidePointerDown
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        closingBuildModeTilePopoverOnOutsidePointerDown
      );
    };
  }, [closingBuildModeTilePopover, isBuildTilePopoverOpen]);

  useEffect(() => {
    if (!isEditSessionActive) {
      setHoverTilePosition(null);
      setSelectedTilePosition(null);
      setIsBuildTilePopoverOpen(false);
      assigningBuildDraft(null);
      return;
    }

    if (!onlineUserId) {
      assigningBuildDraft(null);
      return;
    }

    assigningBuildDraft((currentDraft) => {
      if (
        currentDraft &&
        checkingWorldBuildingBuildDraftHasUnsavedChanges(currentDraft)
      ) {
        return currentDraft;
      }

      return initializingWorldBuildingBuildDraftFromServerPlots(
        plots,
        ownedPlots,
        onlineUserId
      );
    });
  }, [
    assigningBuildDraft,
    isEditSessionActive,
    onlineUserId,
    ownedPlots,
    plots,
  ]);

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
    togglingEditSession,
    activatingEditMode,
    activatingBuildMode,
    activatingClaimMode,
    cancelingBuildDraftDiscard,
    confirmingBuildDraftDiscard,
    selectingBlockDefinition,
    enteringBuildPlacementForBlockDefinition,
    selectingWorldLayer,
    selectingBlockHeight,
    selectingCutFootprintMask,
    selectingCutGridAxisCellCount,
    updatingHoverTilePosition,
    selectingBuildModeTileAtViewport,
    actingOnEditModeTileAtViewport,
    resolvingEditPaintActionAtTile,
    paintingEditModeTileAtViewport,
    removingBlockAtTile,
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
