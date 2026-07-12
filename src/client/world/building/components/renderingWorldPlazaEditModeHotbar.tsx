'use client';

/**
 * Unified bottom-center edit hotbar for build + claim (session-filtered tool slots).
 *
 * @module components/world/building/components/renderingWorldPlazaEditModeHotbar
 */

import { RenderingWorldPlazaBlockPalette } from '@/components/world/building/components/renderingWorldPlazaBlockPalette';
import { RenderingWorldPlazaBuildModeCutFootprintSelector } from '@/components/world/building/components/renderingWorldPlazaBuildModeCutFootprintSelector';
import { RenderingWorldPlazaBuildModeLayerSelector } from '@/components/world/building/components/renderingWorldPlazaBuildModeLayerSelector';
import { RenderingWorldPlazaBuildModePresetBlockTypeSelector } from '@/components/world/building/components/renderingWorldPlazaBuildModePresetBlockTypeSelector';
import { RenderingWorldPlazaClaimModeCoordsPanel } from '@/components/world/building/components/renderingWorldPlazaClaimModeCoordsPanel';
import { RenderingWorldPlazaClaimModePlotList } from '@/components/world/building/components/renderingWorldPlazaClaimModePlotList';
import { RenderingWorldPlazaClaimModeSavedCoordsList } from '@/components/world/building/components/renderingWorldPlazaClaimModeSavedCoordsList';
import { RenderingWorldPlazaClaimModeTemporaryTilesList } from '@/components/world/building/components/renderingWorldPlazaClaimModeTemporaryTilesList';
import { RenderingWorldPlazaHudModeToolBoard } from '@/components/world/building/components/renderingWorldPlazaHudModeToolBoard';
import { countingWorldBuildingOwnerTemporaryTileClaims } from '@/components/world/building/domains/countingWorldBuildingOwnerTemporaryTileClaims';
import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import type { DefiningWorldBuildingCutGridAxisCellCount } from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingPlotBounds } from '@/components/world/building/domains/definingWorldBuildingPlotBounds';
import type { DefiningWorldBuildingPlotOwnerLimits } from '@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import {
  STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_POPOVER_PANEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_POPOVER_TITLE_CLASS_NAME,
  STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_STACK_CLASS_NAME,
} from '@/components/world/building/domains/definingWorldPlazaBuildModeFunctionHotbarConstants';
import {
  DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID,
  DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID,
  LABELING_WORLD_PLAZA_EDIT_MODE_FUNCTION_HOTBAR,
  LABELING_WORLD_PLAZA_EDIT_MODE_FUNCTION_POPOVER_TITLE,
  listingWorldPlazaEditModeFunctionsForSession,
  type DefiningWorldPlazaEditModeFunctionId,
} from '@/components/world/building/domains/definingWorldPlazaEditModeFunctionRegistry';
import { DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID } from '@/components/world/building/domains/definingWorldPlazaHudModeToolBoardConstants';
import type { DefiningWorldBuildingPlotRegistryOwnerGroup } from '@/components/world/building/domains/groupingWorldBuildingPlotRegistryEntriesByOwner';
import {
  checkingWorldPlazaEditModeFunctionSessionIsBuild,
  resolvingWorldPlazaEditModeFunctionSessionMode,
} from '@/components/world/building/domains/resolvingWorldPlazaEditModeFunctionSessionMode';
import { ProvidingWorldPlazaViewportHudScale } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import type { DefiningWorldPlazaSavedCoords } from '@/components/world/domains/definingWorldPlazaSavedCoords';
import { resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles } from '@/components/world/domains/resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles';
import { usingWorldPlazaAnchoredPopoverViewportShiftX } from '@/components/world/hooks/usingWorldPlazaAnchoredPopoverViewportShiftX';
import { STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryHotbarDeviceScale } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarDeviceScale';
import type { WorldPlotVisitRequestOutgoingListMember } from '@/components/world/plotVisit/domains/definingWorldPlotVisitRequest';
import { cn } from '@/lib/utils';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from 'react';

/** Scrollable shell for denser plots + coords popover. */
const RENDERING_WORLD_PLAZA_EDIT_MODE_SCROLL_POPOVER_BODY_CLASS_NAME =
  'flex max-h-[min(50vh,22rem)] min-w-[14rem] flex-col gap-2 overflow-y-auto' as const;

/** Stacked section gap inside combined popovers. */
const RENDERING_WORLD_PLAZA_EDIT_MODE_COMBINED_SECTION_CLASS_NAME =
  'flex flex-col gap-2' as const;

export interface RenderingWorldPlazaEditModeHotbarProps {
  isVisible: boolean;
  /** When true, skips the outer bottom-center anchor (parent stack owns it). */
  isEmbeddedInHudToolbarStack?: boolean;
  isBuildModeActive: boolean;
  isClaimModeActive: boolean;
  onActivateBuildMode: () => void;
  onActivateClaimMode: () => void;
  selectedDefinitionId: DefiningWorldBuildingBlockDefinitionId | null;
  selectedWorldLayer: number;
  selectedBlockHeight: number;
  isPresetBlockTypeSelected: boolean;
  selectedCutFootprintMask: number;
  selectedCutGridAxisCellCount: DefiningWorldBuildingCutGridAxisCellCount;
  localOwnedPlotCount: number;
  localTileClaimCount: number;
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits;
  hoverTilePosition: DefiningWorldBuildingTilePosition | null;
  isSavingCoords: boolean;
  canSaveMoreCoords: boolean;
  onSaveCoordsAtHoverTile: () => void;
  ownerGroups: DefiningWorldBuildingPlotRegistryOwnerGroup[];
  activeViewportPlots: readonly DefiningWorldBuildingPlot[];
  localUserId: string;
  isPlotRegistryLoading: boolean;
  onTeleportToPlotBounds?: (bounds: DefiningWorldBuildingPlotBounds) => void;
  onRequestingFriendPlotVisit?: (
    hostUserId: string,
    hostDisplayName: string,
    bounds: DefiningWorldBuildingPlotBounds
  ) => void;
  onTeleportingToApprovedFriendPlot?: (
    bounds: DefiningWorldBuildingPlotBounds,
    requestId: string
  ) => void;
  outgoingVisitRequests?: readonly WorldPlotVisitRequestOutgoingListMember[];
  isRequestingFriendPlotVisit?: boolean;
  onRemoveTemporaryPlotAtTile: (
    tilePosition: DefiningWorldBuildingTilePosition
  ) => void;
  isRemovingTemporaryPlot?: boolean;
  savedCoordsList: readonly DefiningWorldPlazaSavedCoords[];
  trackedSavedCoordsId: string | null;
  onToggleSavedCoordsTracking: (savedCoordsId: string) => void;
  onDeleteSavedCoords: (savedCoordsId: string) => void;
  isDeletingSavedCoords?: boolean;
  viewportHudScale?: number;
  isMobile?: boolean;
  isFullscreen?: boolean;
  onSelectDefinition: (
    definitionId: DefiningWorldBuildingBlockDefinitionId
  ) => void;
  onSelectWorldLayer: (worldLayer: number) => void;
  onSelectBlockHeight: (blockHeight: number) => void;
  onSelectCutFootprintMask: (cutFootprintMask: number) => void;
  onSelectCutGridAxisCellCount: (
    axisCellCount: DefiningWorldBuildingCutGridAxisCellCount
  ) => void;
}

/**
 * Renders the body for one open unified edit-mode function popover.
 */
function RenderingWorldPlazaEditModeFunctionPopoverBody({
  functionId,
  selectedDefinitionId,
  selectedWorldLayer,
  selectedBlockHeight,
  isPresetBlockTypeSelected,
  selectedCutFootprintMask,
  selectedCutGridAxisCellCount,
  plotOwnerLimits,
  hoverTilePosition,
  isSavingCoords,
  canSaveMoreCoords,
  onSaveCoordsAtHoverTile,
  ownerGroups,
  activeViewportPlots,
  localUserId,
  isPlotRegistryLoading,
  onTeleportToPlotBounds,
  onRequestingFriendPlotVisit,
  onTeleportingToApprovedFriendPlot,
  outgoingVisitRequests = [],
  isRequestingFriendPlotVisit = false,
  onRemoveTemporaryPlotAtTile,
  isRemovingTemporaryPlot = false,
  savedCoordsList,
  trackedSavedCoordsId,
  onToggleSavedCoordsTracking,
  onDeleteSavedCoords,
  isDeletingSavedCoords = false,
  onSelectDefinition,
  onSelectWorldLayer,
  onSelectBlockHeight,
  onSelectCutFootprintMask,
  onSelectCutGridAxisCellCount,
}: {
  functionId: DefiningWorldPlazaEditModeFunctionId;
} & Omit<
  RenderingWorldPlazaEditModeHotbarProps,
  | 'isVisible'
  | 'isEmbeddedInHudToolbarStack'
  | 'viewportHudScale'
  | 'isMobile'
  | 'isFullscreen'
  | 'localOwnedPlotCount'
  | 'localTileClaimCount'
  | 'isBuildModeActive'
  | 'isClaimModeActive'
  | 'onActivateBuildMode'
  | 'onActivateClaimMode'
>): React.JSX.Element {
  const localTemporaryTileClaimCount =
    countingWorldBuildingOwnerTemporaryTileClaims(
      activeViewportPlots,
      localUserId
    );

  switch (functionId) {
    case DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.MATERIALS:
      return (
        <RenderingWorldPlazaBlockPalette
          selectedDefinitionId={selectedDefinitionId}
          onSelectDefinition={onSelectDefinition}
        />
      );
    case DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CUT:
      return (
        <RenderingWorldPlazaBuildModeCutFootprintSelector
          selectedCutGridAxisCellCount={selectedCutGridAxisCellCount}
          selectedCutFootprintMask={selectedCutFootprintMask}
          onChangeCutGridAxisCellCount={onSelectCutGridAxisCellCount}
          onChangeCutFootprintMask={onSelectCutFootprintMask}
        />
      );
    case DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.BLOCKS:
      return (
        <div
          className={
            RENDERING_WORLD_PLAZA_EDIT_MODE_COMBINED_SECTION_CLASS_NAME
          }
        >
          <RenderingWorldPlazaBuildModeLayerSelector
            selectedWorldLayer={selectedWorldLayer}
            onSelectWorldLayer={onSelectWorldLayer}
          />
          <RenderingWorldPlazaBuildModePresetBlockTypeSelector
            selectedWorldLayer={selectedWorldLayer}
            selectedBlockHeight={selectedBlockHeight}
            isPresetBlockTypeSelected={isPresetBlockTypeSelected}
            onSelectBlockHeight={onSelectBlockHeight}
          />
        </div>
      );
    case DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLOTS:
      return (
        <div
          className={
            RENDERING_WORLD_PLAZA_EDIT_MODE_SCROLL_POPOVER_BODY_CLASS_NAME
          }
        >
          <RenderingWorldPlazaClaimModePlotList
            ownerGroups={ownerGroups}
            isLoading={isPlotRegistryLoading}
            onTeleportToPlotBounds={onTeleportToPlotBounds}
            onRequestingFriendPlotVisit={onRequestingFriendPlotVisit}
            onTeleportingToApprovedFriendPlot={
              onTeleportingToApprovedFriendPlot
            }
            outgoingVisitRequests={outgoingVisitRequests}
            isRequestingFriendPlotVisit={isRequestingFriendPlotVisit}
          />
          <RenderingWorldPlazaClaimModeTemporaryTilesList
            activeViewportPlots={activeViewportPlots}
            localUserId={localUserId}
            temporaryTileClaimCount={localTemporaryTileClaimCount}
            plotOwnerLimits={plotOwnerLimits}
            onRemoveTemporaryPlotAtTile={onRemoveTemporaryPlotAtTile}
            isRemovingTemporaryPlot={isRemovingTemporaryPlot}
          />
          <RenderingWorldPlazaClaimModeCoordsPanel
            hoverTilePosition={hoverTilePosition}
            isSavingCoords={isSavingCoords}
            canSaveMoreCoords={canSaveMoreCoords}
            onSaveCoordsAtHoverTile={onSaveCoordsAtHoverTile}
          />
          <RenderingWorldPlazaClaimModeSavedCoordsList
            savedCoordsList={savedCoordsList}
            trackedSavedCoordsId={trackedSavedCoordsId}
            onToggleSavedCoordsTracking={onToggleSavedCoordsTracking}
            onDeleteSavedCoords={onDeleteSavedCoords}
            isDeletingSavedCoords={isDeletingSavedCoords}
          />
        </div>
      );
  }
}

/**
 * Slot-anchored edit-mode function popover with viewport collision shift.
 */
function RenderingWorldPlazaEditModeFunctionPopoverPanel({
  functionId,
  title,
  onPointerDown,
  onClick,
  children,
}: {
  readonly functionId: DefiningWorldPlazaEditModeFunctionId;
  readonly title: string;
  readonly onPointerDown: (event: SyntheticEvent<HTMLElement>) => void;
  readonly onClick: (event: SyntheticEvent<HTMLElement>) => void;
  readonly children: ReactNode;
}): React.JSX.Element {
  const { popoverRef, popoverShiftStyle } =
    usingWorldPlazaAnchoredPopoverViewportShiftX(functionId);

  return (
    <div
      ref={popoverRef}
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      className={
        STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_POPOVER_PANEL_CLASS_NAME
      }
      style={popoverShiftStyle}
      role="dialog"
      aria-label={title}
      onPointerDown={onPointerDown}
      onClick={onClick}
    >
      <p
        className={
          STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_POPOVER_TITLE_CLASS_NAME
        }
      >
        {title}
      </p>
      {children}
    </div>
  );
}

/**
 * Unified build/claim toolbar: session-filtered icon slots with popovers.
 */
export function RenderingWorldPlazaEditModeHotbar({
  isVisible,
  isEmbeddedInHudToolbarStack = false,
  isBuildModeActive: _isBuildModeActive,
  isClaimModeActive,
  onActivateBuildMode,
  onActivateClaimMode,
  selectedDefinitionId,
  selectedWorldLayer,
  selectedBlockHeight,
  isPresetBlockTypeSelected,
  selectedCutFootprintMask,
  selectedCutGridAxisCellCount,
  localOwnedPlotCount,
  localTileClaimCount,
  plotOwnerLimits,
  hoverTilePosition,
  isSavingCoords,
  canSaveMoreCoords,
  onSaveCoordsAtHoverTile,
  ownerGroups,
  activeViewportPlots,
  localUserId,
  isPlotRegistryLoading,
  onTeleportToPlotBounds,
  onRequestingFriendPlotVisit,
  onTeleportingToApprovedFriendPlot,
  outgoingVisitRequests = [],
  isRequestingFriendPlotVisit = false,
  onRemoveTemporaryPlotAtTile,
  isRemovingTemporaryPlot = false,
  savedCoordsList,
  trackedSavedCoordsId,
  onToggleSavedCoordsTracking,
  onDeleteSavedCoords,
  isDeletingSavedCoords = false,
  viewportHudScale = 1,
  isMobile = false,
  isFullscreen = false,
  onSelectDefinition,
  onSelectWorldLayer,
  onSelectBlockHeight,
  onSelectCutFootprintMask,
  onSelectCutGridAxisCellCount,
}: RenderingWorldPlazaEditModeHotbarProps): React.JSX.Element | null {
  const [openFunctionId, setOpenFunctionId] =
    useState<DefiningWorldPlazaEditModeFunctionId | null>(null);
  const hotbarRootRef = useRef<HTMLDivElement | null>(null);

  const hotbarViewportHudScale = useMemo(
    () =>
      viewportHudScale *
      resolvingWorldPlazaInventoryHotbarDeviceScale(isMobile),
    [viewportHudScale, isMobile]
  );

  const anchorViewportStyle = useMemo(
    () =>
      resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles(
        viewportHudScale,
        isMobile ? { isFullscreen } : undefined
      ),
    [viewportHudScale, isMobile, isFullscreen]
  );

  const closingOpenFunction = useCallback((): void => {
    setOpenFunctionId(null);
  }, []);

  const activeSessionModeId = isClaimModeActive
    ? DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM
    : DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD;

  const modeToolBoardId =
    activeSessionModeId === DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM
      ? DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.CLAIM
      : DEFINING_WORLD_PLAZA_HUD_MODE_TOOL_BOARD_ID.BUILD;

  const visibleFunctionDefinitions = useMemo(
    () => listingWorldPlazaEditModeFunctionsForSession(activeSessionModeId),
    [activeSessionModeId]
  );

  const togglingFunction = useCallback(
    (functionId: DefiningWorldPlazaEditModeFunctionId): void => {
      const nextOpenFunctionId =
        openFunctionId === functionId ? null : functionId;

      setOpenFunctionId(nextOpenFunctionId);

      if (nextOpenFunctionId === null) {
        return;
      }

      const sessionModeId =
        resolvingWorldPlazaEditModeFunctionSessionMode(nextOpenFunctionId);

      if (checkingWorldPlazaEditModeFunctionSessionIsBuild(sessionModeId)) {
        onActivateBuildMode();
        return;
      }

      onActivateClaimMode();
    },
    [onActivateBuildMode, onActivateClaimMode, openFunctionId]
  );

  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
  );

  const renderingToolPopover = useCallback(
    (toolId: DefiningWorldPlazaEditModeFunctionId): ReactNode => {
      return (
        <RenderingWorldPlazaEditModeFunctionPopoverPanel
          functionId={toolId}
          title={LABELING_WORLD_PLAZA_EDIT_MODE_FUNCTION_POPOVER_TITLE[toolId]}
          onPointerDown={stoppingPlazaWalkPointerPropagation}
          onClick={stoppingPlazaWalkPointerPropagation}
        >
          <RenderingWorldPlazaEditModeFunctionPopoverBody
            functionId={toolId}
            selectedDefinitionId={selectedDefinitionId}
            selectedWorldLayer={selectedWorldLayer}
            selectedBlockHeight={selectedBlockHeight}
            isPresetBlockTypeSelected={isPresetBlockTypeSelected}
            selectedCutFootprintMask={selectedCutFootprintMask}
            selectedCutGridAxisCellCount={selectedCutGridAxisCellCount}
            plotOwnerLimits={plotOwnerLimits}
            hoverTilePosition={hoverTilePosition}
            isSavingCoords={isSavingCoords}
            canSaveMoreCoords={canSaveMoreCoords}
            onSaveCoordsAtHoverTile={onSaveCoordsAtHoverTile}
            ownerGroups={ownerGroups}
            activeViewportPlots={activeViewportPlots}
            localUserId={localUserId}
            isPlotRegistryLoading={isPlotRegistryLoading}
            onTeleportToPlotBounds={onTeleportToPlotBounds}
            onRequestingFriendPlotVisit={onRequestingFriendPlotVisit}
            onTeleportingToApprovedFriendPlot={
              onTeleportingToApprovedFriendPlot
            }
            outgoingVisitRequests={outgoingVisitRequests}
            isRequestingFriendPlotVisit={isRequestingFriendPlotVisit}
            onRemoveTemporaryPlotAtTile={onRemoveTemporaryPlotAtTile}
            isRemovingTemporaryPlot={isRemovingTemporaryPlot}
            savedCoordsList={savedCoordsList}
            trackedSavedCoordsId={trackedSavedCoordsId}
            onToggleSavedCoordsTracking={onToggleSavedCoordsTracking}
            onDeleteSavedCoords={onDeleteSavedCoords}
            isDeletingSavedCoords={isDeletingSavedCoords}
            onSelectDefinition={onSelectDefinition}
            onSelectWorldLayer={onSelectWorldLayer}
            onSelectBlockHeight={onSelectBlockHeight}
            onSelectCutFootprintMask={onSelectCutFootprintMask}
            onSelectCutGridAxisCellCount={onSelectCutGridAxisCellCount}
          />
        </RenderingWorldPlazaEditModeFunctionPopoverPanel>
      );
    },
    [
      activeViewportPlots,
      canSaveMoreCoords,
      hoverTilePosition,
      isDeletingSavedCoords,
      isPlotRegistryLoading,
      isPresetBlockTypeSelected,
      isRemovingTemporaryPlot,
      isRequestingFriendPlotVisit,
      isSavingCoords,
      localUserId,
      onDeleteSavedCoords,
      onRemoveTemporaryPlotAtTile,
      onRequestingFriendPlotVisit,
      onSaveCoordsAtHoverTile,
      onSelectBlockHeight,
      onSelectCutFootprintMask,
      onSelectCutGridAxisCellCount,
      onSelectDefinition,
      onSelectWorldLayer,
      onTeleportToPlotBounds,
      onTeleportingToApprovedFriendPlot,
      onToggleSavedCoordsTracking,
      outgoingVisitRequests,
      ownerGroups,
      plotOwnerLimits,
      savedCoordsList,
      selectedBlockHeight,
      selectedCutFootprintMask,
      selectedCutGridAxisCellCount,
      selectedDefinitionId,
      selectedWorldLayer,
      stoppingPlazaWalkPointerPropagation,
      trackedSavedCoordsId,
    ]
  );

  useEffect(() => {
    if (!isVisible) {
      setOpenFunctionId(null);
    }
  }, [isVisible]);

  useEffect(() => {
    if (openFunctionId === null) {
      return;
    }

    const isOpenFunctionVisible = visibleFunctionDefinitions.some(
      (functionDefinition) => functionDefinition.id === openFunctionId
    );

    if (!isOpenFunctionVisible) {
      setOpenFunctionId(null);
    }
  }, [openFunctionId, visibleFunctionDefinitions]);

  useEffect(() => {
    if (openFunctionId === null) {
      return;
    }

    const handlingPointerDown = (event: PointerEvent): void => {
      const root = hotbarRootRef.current;
      if (!root || !(event.target instanceof Node)) {
        return;
      }
      if (!root.contains(event.target)) {
        closingOpenFunction();
      }
    };

    const handlingKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closingOpenFunction();
      }
    };

    window.addEventListener('pointerdown', handlingPointerDown);
    window.addEventListener('keydown', handlingKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlingPointerDown);
      window.removeEventListener('keydown', handlingKeyDown);
    };
  }, [closingOpenFunction, openFunctionId]);

  if (!isVisible) {
    return null;
  }

  const anchorClassName =
    DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.bottomCenter
      .inventoryHotbar.anchorClassName;

  const hotbarBody = (
    <ProvidingWorldPlazaViewportHudScale
      viewportHudScale={hotbarViewportHudScale}
    >
      <div className={STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_STACK_CLASS_NAME}>
        <RenderingWorldPlazaHudModeToolBoard
          boardId={modeToolBoardId}
          activeToolId={openFunctionId}
          onActivateTool={togglingFunction}
          renderingToolPopover={renderingToolPopover}
        />
      </div>
    </ProvidingWorldPlazaViewportHudScale>
  );

  if (isEmbeddedInHudToolbarStack) {
    return (
      <div
        ref={hotbarRootRef}
        aria-label={LABELING_WORLD_PLAZA_EDIT_MODE_FUNCTION_HOTBAR}
      >
        {hotbarBody}
      </div>
    );
  }

  return (
    <div
      ref={hotbarRootRef}
      className={cn(
        anchorClassName,
        STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS
      )}
      style={anchorViewportStyle}
      aria-label={LABELING_WORLD_PLAZA_EDIT_MODE_FUNCTION_HOTBAR}
    >
      {hotbarBody}
    </div>
  );
}
