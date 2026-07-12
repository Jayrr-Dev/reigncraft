'use client';

/**
 * Unified bottom-center edit hotbar for build + claim (5 inventory-shaped slots).
 *
 * @module components/world/building/components/renderingWorldPlazaEditModeHotbar
 */

import { Icon } from '@/components/ui/icon';
import { RenderingWorldPlazaBlockPalette } from '@/components/world/building/components/renderingWorldPlazaBlockPalette';
import { RenderingWorldPlazaBuildModeCutFootprintSelector } from '@/components/world/building/components/renderingWorldPlazaBuildModeCutFootprintSelector';
import { RenderingWorldPlazaBuildModeLayerSelector } from '@/components/world/building/components/renderingWorldPlazaBuildModeLayerSelector';
import { RenderingWorldPlazaBuildModePresetBlockTypeSelector } from '@/components/world/building/components/renderingWorldPlazaBuildModePresetBlockTypeSelector';
import { RenderingWorldPlazaClaimModeCoordsPanel } from '@/components/world/building/components/renderingWorldPlazaClaimModeCoordsPanel';
import { RenderingWorldPlazaClaimModePlotList } from '@/components/world/building/components/renderingWorldPlazaClaimModePlotList';
import { RenderingWorldPlazaClaimModeSavedCoordsList } from '@/components/world/building/components/renderingWorldPlazaClaimModeSavedCoordsList';
import { RenderingWorldPlazaClaimModeTemporaryTilesList } from '@/components/world/building/components/renderingWorldPlazaClaimModeTemporaryTilesList';
import { countingWorldBuildingOwnerTemporaryTileClaims } from '@/components/world/building/domains/countingWorldBuildingOwnerTemporaryTileClaims';
import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import type { DefiningWorldBuildingCutGridAxisCellCount } from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingPlotBounds } from '@/components/world/building/domains/definingWorldBuildingPlotBounds';
import type { DefiningWorldBuildingPlotOwnerLimits } from '@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import {
  formattingWorldPlazaBuildModeHotbarPlotMetric,
  STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_POPOVER_PANEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_POPOVER_TITLE_CLASS_NAME,
  STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_SLOT_ANCHOR_CLASS_NAME,
  STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_FOOTER_CLASS_NAME,
  STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_HEADER_CLASS_NAME,
  STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_OUTLINE_METRIC_CLASS_NAME,
  STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_STACK_CLASS_NAME,
  STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_BUTTON_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ICON_CLASS_NAME,
  STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_SWITCHER_CLASS_NAME,
} from '@/components/world/building/domains/definingWorldPlazaBuildModeFunctionHotbarConstants';
import {
  DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID,
  DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_REGISTRY,
  DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID,
  DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_REGISTRY,
  LABELING_WORLD_PLAZA_EDIT_MODE_FUNCTION_HOTBAR,
  LABELING_WORLD_PLAZA_EDIT_MODE_FUNCTION_POPOVER_TITLE,
  LABELING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_SWITCHER,
  type DefiningWorldPlazaEditModeFunctionId,
} from '@/components/world/building/domains/definingWorldPlazaEditModeFunctionRegistry';
import type { DefiningWorldBuildingPlotRegistryOwnerGroup } from '@/components/world/building/domains/groupingWorldBuildingPlotRegistryEntriesByOwner';
import { ProvidingWorldPlazaViewportHudScale } from '@/components/world/components/providingWorldPlazaViewportHudScale';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import type { DefiningWorldPlazaSavedCoords } from '@/components/world/domains/definingWorldPlazaSavedCoords';
import { resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles } from '@/components/world/domains/resolvingWorldPlazaGameplayHudBottomCenterAnchorViewportStyles';
import {
  STYLING_WORLD_PLAZA_INVENTORY_GRID_WRAPPER_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
  STYLING_WORLD_PLAZA_INVENTORY_SLOT_EQUIPPED_CLASS,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import { resolvingWorldPlazaInventoryHotbarDeviceScale } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarDeviceScale';
import { resolvingWorldPlazaInventoryHotbarViewportStyles } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryHotbarViewportStyles';
import type { WorldPlotVisitRequestOutgoingListMember } from '@/components/world/plotVisit/domains/definingWorldPlotVisitRequest';
import { cn } from '@/lib/utils';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';

/** Scrollable shell for denser plot / saved popovers. */
const RENDERING_WORLD_PLAZA_EDIT_MODE_SCROLL_POPOVER_BODY_CLASS_NAME =
  'flex max-h-[min(50vh,22rem)] min-w-[14rem] flex-col gap-2 overflow-y-auto' as const;

/** Stacked section gap inside combined popovers. */
const RENDERING_WORLD_PLAZA_EDIT_MODE_COMBINED_SECTION_CLASS_NAME =
  'flex flex-col gap-2' as const;

export interface RenderingWorldPlazaEditModeHotbarProps {
  isVisible: boolean;
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
        </div>
      );
    case DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.SAVED:
      return (
        <div
          className={
            RENDERING_WORLD_PLAZA_EDIT_MODE_SCROLL_POPOVER_BODY_CLASS_NAME
          }
        >
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
 * Unified build/claim toolbar: 5 icon slots with popovers; Build title branding.
 */
export function RenderingWorldPlazaEditModeHotbar({
  isVisible,
  isBuildModeActive,
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

  const plotMetricLabel = formattingWorldPlazaBuildModeHotbarPlotMetric(
    localOwnedPlotCount,
    plotOwnerLimits.maxOwnedPlotCount,
    localTileClaimCount,
    plotOwnerLimits.maxTileClaimCount
  );

  const hotbarViewportHudScale = useMemo(
    () =>
      viewportHudScale *
      resolvingWorldPlazaInventoryHotbarDeviceScale(isMobile),
    [viewportHudScale, isMobile]
  );

  const viewportStyles = useMemo(
    () =>
      resolvingWorldPlazaInventoryHotbarViewportStyles(hotbarViewportHudScale),
    [hotbarViewportHudScale]
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

  const togglingFunction = useCallback(
    (functionId: DefiningWorldPlazaEditModeFunctionId): void => {
      setOpenFunctionId((current) =>
        current === functionId ? null : functionId
      );
    },
    []
  );

  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
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
      <ProvidingWorldPlazaViewportHudScale
        viewportHudScale={hotbarViewportHudScale}
      >
        <div className={STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_STACK_CLASS_NAME}>
          <div
            className={STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_HEADER_CLASS_NAME}
          >
            <div
              className={
                STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_SWITCHER_CLASS_NAME
              }
              role="group"
              aria-label={LABELING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_SWITCHER}
              onPointerDown={stoppingPlazaWalkPointerPropagation}
              onClick={stoppingPlazaWalkPointerPropagation}
            >
              {DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_REGISTRY.map(
                (sessionMode) => {
                  const isActive =
                    sessionMode.id ===
                    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD
                      ? isBuildModeActive
                      : isClaimModeActive;

                  return (
                    <button
                      key={sessionMode.id}
                      type="button"
                      aria-label={sessionMode.ariaLabel}
                      aria-pressed={isActive}
                      onClick={
                        sessionMode.id ===
                        DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD
                          ? onActivateBuildMode
                          : onActivateClaimMode
                      }
                      className={
                        isActive
                          ? STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_BUTTON_ACTIVE_CLASS_NAME
                          : STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_BUTTON_CLASS_NAME
                      }
                    >
                      <Icon
                        icon={sessionMode.iconifyIcon}
                        className={
                          STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ICON_CLASS_NAME
                        }
                        aria-hidden
                      />
                      <span>{sessionMode.label}</span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            className={cn(
              STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_CLASS_NAME,
              STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS
            )}
            style={viewportStyles.shellStyle}
            onPointerDown={stoppingPlazaWalkPointerPropagation}
            onClick={stoppingPlazaWalkPointerPropagation}
          >
            <div
              className={STYLING_WORLD_PLAZA_INVENTORY_GRID_WRAPPER_CLASS_NAME}
              style={viewportStyles.gridStyle}
            >
              {DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_REGISTRY.map(
                (functionDefinition) => {
                  const isOpen = openFunctionId === functionDefinition.id;

                  return (
                    <div
                      key={functionDefinition.id}
                      className={
                        STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_SLOT_ANCHOR_CLASS_NAME
                      }
                    >
                      {isOpen ? (
                        <div
                          {...{
                            [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true,
                          }}
                          className={
                            STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_POPOVER_PANEL_CLASS_NAME
                          }
                          role="dialog"
                          aria-label={
                            LABELING_WORLD_PLAZA_EDIT_MODE_FUNCTION_POPOVER_TITLE[
                              functionDefinition.id
                            ]
                          }
                          onPointerDown={stoppingPlazaWalkPointerPropagation}
                          onClick={stoppingPlazaWalkPointerPropagation}
                        >
                          <p
                            className={
                              STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_POPOVER_TITLE_CLASS_NAME
                            }
                          >
                            {
                              LABELING_WORLD_PLAZA_EDIT_MODE_FUNCTION_POPOVER_TITLE[
                                functionDefinition.id
                              ]
                            }
                          </p>
                          <RenderingWorldPlazaEditModeFunctionPopoverBody
                            functionId={functionDefinition.id}
                            selectedDefinitionId={selectedDefinitionId}
                            selectedWorldLayer={selectedWorldLayer}
                            selectedBlockHeight={selectedBlockHeight}
                            isPresetBlockTypeSelected={
                              isPresetBlockTypeSelected
                            }
                            selectedCutFootprintMask={selectedCutFootprintMask}
                            selectedCutGridAxisCellCount={
                              selectedCutGridAxisCellCount
                            }
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
                            onRequestingFriendPlotVisit={
                              onRequestingFriendPlotVisit
                            }
                            onTeleportingToApprovedFriendPlot={
                              onTeleportingToApprovedFriendPlot
                            }
                            outgoingVisitRequests={outgoingVisitRequests}
                            isRequestingFriendPlotVisit={
                              isRequestingFriendPlotVisit
                            }
                            onRemoveTemporaryPlotAtTile={
                              onRemoveTemporaryPlotAtTile
                            }
                            isRemovingTemporaryPlot={isRemovingTemporaryPlot}
                            savedCoordsList={savedCoordsList}
                            trackedSavedCoordsId={trackedSavedCoordsId}
                            onToggleSavedCoordsTracking={
                              onToggleSavedCoordsTracking
                            }
                            onDeleteSavedCoords={onDeleteSavedCoords}
                            isDeletingSavedCoords={isDeletingSavedCoords}
                            onSelectDefinition={onSelectDefinition}
                            onSelectWorldLayer={onSelectWorldLayer}
                            onSelectBlockHeight={onSelectBlockHeight}
                            onSelectCutFootprintMask={onSelectCutFootprintMask}
                            onSelectCutGridAxisCellCount={
                              onSelectCutGridAxisCellCount
                            }
                          />
                        </div>
                      ) : null}

                      <button
                        type="button"
                        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                        aria-label={functionDefinition.ariaLabel}
                        aria-pressed={isOpen}
                        title={functionDefinition.label}
                        onClick={() => {
                          togglingFunction(functionDefinition.id);
                        }}
                        className={cn(
                          STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS,
                          STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS,
                          isOpen &&
                            STYLING_WORLD_PLAZA_INVENTORY_SLOT_EQUIPPED_CLASS,
                          'flex items-center justify-center'
                        )}
                        style={viewportStyles.slotStyle}
                      >
                        <Icon
                          icon={functionDefinition.iconifyIcon}
                          className="shrink-0"
                          style={viewportStyles.iconStyle}
                          aria-hidden
                        />
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div
            className={STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_FOOTER_CLASS_NAME}
          >
            <p
              className={
                STYLING_WORLD_PLAZA_BUILD_MODE_HOTBAR_OUTLINE_METRIC_CLASS_NAME
              }
              aria-hidden
            >
              {plotMetricLabel}
            </p>
          </div>
        </div>
      </ProvidingWorldPlazaViewportHudScale>
    </div>
  );
}
