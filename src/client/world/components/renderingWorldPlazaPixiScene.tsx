'use client';

import type { CommunityMemberProfileStatusKind } from '@/components/community/domains/definingCommunityMemberProfileStatus';
import { RenderingUserProfileFriendPlazaNotificationModal } from '@/components/friends/components/renderingUserProfileFriendPlazaNotificationModal';
import { RenderingUserProfileFriendRequestPlazaModal } from '@/components/friends/components/renderingUserProfileFriendRequestPlazaModal';
import { usingUserProfileFriendPlazaNotifications } from '@/components/friends/hooks/usingUserProfileFriendPlazaNotifications';
import { usingUserProfileFriendRequestPlazaDialogs } from '@/components/friends/hooks/usingUserProfileFriendRequestPlazaDialogs';
import { usingUserProfileFriendRequestsPendingCount } from '@/components/friends/hooks/usingUserProfileFriendRequestsPendingCount';
import type { DefiningWorldPlazaAvatarToolAction } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
import { RenderingWorldPlazaBlockPlacementPreview } from '@/components/world/building/components/renderingWorldPlazaBlockPlacementPreview';
import { RenderingWorldPlazaBlockRemovalHoverHighlight } from '@/components/world/building/components/renderingWorldPlazaBlockRemovalHoverHighlight';
import { RenderingWorldPlazaBuildModeDiscardDialog } from '@/components/world/building/components/renderingWorldPlazaBuildModeDiscardDialog';
import { RenderingWorldPlazaBuildModeHotbar } from '@/components/world/building/components/renderingWorldPlazaBuildModeHotbar';
import { RenderingWorldPlazaClaimModeHotbar } from '@/components/world/building/components/renderingWorldPlazaClaimModeHotbar';
import { RenderingWorldPlazaClaimModePanel } from '@/components/world/building/components/renderingWorldPlazaClaimModePanel';
import { RenderingWorldPlazaClaimModePlotOwnershipOverlay } from '@/components/world/building/components/renderingWorldPlazaClaimModePlotOwnershipOverlay';
import { RenderingWorldPlazaPlacedBlockGroundShadows } from '@/components/world/building/components/renderingWorldPlazaPlacedBlockGroundShadows';
import { RenderingWorldPlazaPlacedBlocks } from '@/components/world/building/components/renderingWorldPlazaPlacedBlocks';
import { RenderingWorldPlazaPlotBoundaries } from '@/components/world/building/components/renderingWorldPlazaPlotBoundaries';
import {
  countingWorldBuildingOwnerOwnedPlotCount,
  countingWorldBuildingOwnerPlotTileClaims,
} from '@/components/world/building/domains/countingWorldBuildingOwnerPlotClaims';
import { DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK,
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_BUILDING_CLAIM_MODE_PLACED_BLOCK_ALPHA } from '@/components/world/building/domains/definingWorldBuildingClaimModeConstants';
import {
  DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
  type DefiningWorldBuildingCutGridAxisCellCount,
} from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingPlotBounds } from '@/components/world/building/domains/definingWorldBuildingPlotBounds';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { snappingWorldBuildingTilePositionFromGridPoint } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_BUILD_DEFAULT } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { mergingWorldBuildingClaimModeOverlayPlots } from '@/components/world/building/domains/mergingWorldBuildingClaimModeOverlayPlots';
import { projectingWorldBuildingTilePositionFromViewportPointer } from '@/components/world/building/domains/projectingWorldBuildingTilePositionFromViewportPointerEvent';
import { findingWorldBuildingPlacedBlockAtTileIndex } from '@/components/world/building/domains/resolvingWorldBuildingCollision';
import { usingWorldPlazaBuildMode } from '@/components/world/building/hooks/usingWorldPlazaBuildMode';
import { usingWorldPlazaClaimModePlotRegistryQuery } from '@/components/world/building/hooks/usingWorldPlazaClaimModePlotRegistryQuery';
import { usingWorldPlazaLocalhostDevEnvironment } from '@/components/world/building/hooks/usingWorldPlazaLocalhostDevEnvironment';
import { usingWorldPlazaPlacedBlocksQuery } from '@/components/world/building/hooks/usingWorldPlazaPlacedBlocksQuery';
import { usingWorldPlazaPlotOwnerLimitsQuery } from '@/components/world/building/hooks/usingWorldPlazaPlotOwnerLimitsQuery';
import { usingWorldPlazaPlotSubscription } from '@/components/world/building/hooks/usingWorldPlazaPlotSubscription';
import { usingWorldPlazaTemporaryPlotLifecycle } from '@/components/world/building/hooks/usingWorldPlazaTemporaryPlotLifecycle';
import { usingWorldPlazaCharacterEngineSkillCooldowns } from '@/components/world/character/hooks/usingWorldPlazaCharacterEngineSkillCooldowns';
import { usingWorldPlazaSelectedCharacterEngineDefinition } from '@/components/world/character/hooks/usingWorldPlazaSelectedCharacterEngineDefinition';
import { MeasuringWorldPlazaPixiRenderDiagnostics } from '@/components/world/components/measuringWorldPlazaPixiRenderDiagnostics';
import {
  ProvidingWorldPlazaPerformanceProfile,
  usingWorldPlazaPerformanceProfile,
} from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import { RenderingWorldPlazaActionBar } from '@/components/world/components/renderingWorldPlazaActionBar';
import { RenderingWorldPlazaBiomeBackdrop } from '@/components/world/components/renderingWorldPlazaBiomeBackdrop';
import { RenderingWorldPlazaBiomeMusic } from '@/components/world/components/renderingWorldPlazaBiomeMusic';
import { RenderingWorldPlazaBiomesOverlay } from '@/components/world/components/renderingWorldPlazaBiomesOverlay';
import { RenderingWorldPlazaCameraRig } from '@/components/world/components/renderingWorldPlazaCameraRig';
import { RenderingWorldPlazaClickArrowEffect } from '@/components/world/components/renderingWorldPlazaClickArrowEffect';
import { RenderingWorldPlazaCodexPlaceholderOverlay } from '@/components/world/components/renderingWorldPlazaCodexPlaceholderOverlay';
import { RenderingWorldPlazaDayNightOverlay } from '@/components/world/components/renderingWorldPlazaDayNightOverlay';
import { RenderingWorldPlazaDeclarativeTerrainSync } from '@/components/world/components/renderingWorldPlazaDeclarativeTerrainSync';
import { RenderingWorldPlazaDevModePanel } from '@/components/world/components/renderingWorldPlazaDevModePanel';
import { RenderingWorldPlazaFriendsPanel } from '@/components/world/components/renderingWorldPlazaFriendsPanel';
import { RenderingWorldPlazaFriendTrackingDirectionArrowOverlay } from '@/components/world/components/renderingWorldPlazaFriendTrackingDirectionArrowOverlay';
import { RenderingWorldPlazaGameplayHud } from '@/components/world/components/renderingWorldPlazaGameplayHud';
import { RenderingWorldPlazaGameplayHudToast } from '@/components/world/components/renderingWorldPlazaGameplayHudToast';
import { RenderingWorldPlazaGirlSampleWalkAvatar } from '@/components/world/components/renderingWorldPlazaGirlSampleWalkAvatar';
import { RenderingWorldPlazaMechanicsOverlay } from '@/components/world/components/renderingWorldPlazaMechanicsOverlay';
import { RenderingWorldPlazaMiniMapStack } from '@/components/world/components/renderingWorldPlazaMiniMapStack';
import { RenderingWorldPlazaMobileJumpButton } from '@/components/world/components/renderingWorldPlazaMobileJumpButton';
import { RenderingWorldPlazaMobileLandscapePrompt } from '@/components/world/components/renderingWorldPlazaMobileLandscapePrompt';
import type { RenderingWorldPlazaPlayerNameLabelEntry } from '@/components/world/components/renderingWorldPlazaPlayerNameLabels';
import { RenderingWorldPlazaPlayerNameLabels } from '@/components/world/components/renderingWorldPlazaPlayerNameLabels';
import { RenderingWorldPlazaPlayerNightLightGroundGlow } from '@/components/world/components/renderingWorldPlazaPlayerNightLightGroundGlow';
import { RenderingWorldPlazaPlayerTeleportFadeOverlay } from '@/components/world/components/renderingWorldPlazaPlayerTeleportFadeOverlay';
import { RenderingWorldPlazaPresenceReconnectOverlay } from '@/components/world/components/renderingWorldPlazaPresenceReconnectOverlay';
import { RenderingWorldPlazaRemotePlayers } from '@/components/world/components/renderingWorldPlazaRemotePlayers';
import { RenderingWorldPlazaRoomChatBubbles } from '@/components/world/components/renderingWorldPlazaRoomChatBubbles';
import { RenderingWorldPlazaRoomChatPanel } from '@/components/world/components/renderingWorldPlazaRoomChatPanel';
import { RenderingWorldPlazaRoomStatusHud } from '@/components/world/components/renderingWorldPlazaRoomStatusHud';
import { RenderingWorldPlazaRoomTypingIndicators } from '@/components/world/components/renderingWorldPlazaRoomTypingIndicators';
import { RenderingWorldPlazaSaveCoordsTilePopover } from '@/components/world/components/renderingWorldPlazaSaveCoordsTilePopover';
import { RenderingWorldPlazaSavedCoordsDirectionArrowOverlay } from '@/components/world/components/renderingWorldPlazaSavedCoordsDirectionArrowOverlay';
import { RenderingWorldPlazaSavedCoordsTileStarMarkers } from '@/components/world/components/renderingWorldPlazaSavedCoordsTileStarMarkers';
import { RenderingWorldPlazaStaminaBar } from '@/components/world/components/renderingWorldPlazaStaminaBar';
import { RenderingWorldPlazaTerrainCollisionDebugOverlay } from '@/components/world/components/renderingWorldPlazaTerrainCollisionDebugOverlay';
import { RenderingWorldPlazaTutorialOverlay } from '@/components/world/components/renderingWorldPlazaTutorialOverlay';
import { ReportingWorldPlazaPixiViewportDebugStatus } from '@/components/world/components/reportingWorldPlazaPixiViewportDebugStatus';
import {
  SYNCING_WORLD_PLAZA_PIXI_VIEWPORT_FRAME_CANVAS_CLASS_NAME,
  SyncingWorldPlazaPixiViewportFrameResize,
} from '@/components/world/components/syncingWorldPlazaPixiViewportFrameResize';
import {
  DEFINING_WORLD_DEPTH_RENDER_PLANE_ENTITY_AVATAR_SUB_LAYER_Z_INDEX,
  DEFINING_WORLD_DEPTH_RENDER_PLANE_ENTITY_CANOPY_SUB_LAYER_Z_INDEX,
  DEFINING_WORLD_DEPTH_RENDER_PLANE_ENTITY_EFFECTS_SUB_LAYER_Z_INDEX,
  DEFINING_WORLD_DEPTH_RENDER_PLANE_ENTITY_LAYER_Z_INDEX,
  DEFINING_WORLD_DEPTH_RENDER_PLANE_FLOOR_Z_INDEX,
} from '@/components/world/depth';
import { applyingWorldPlazaPlayerTeleportToWorldPoint } from '@/components/world/domains/applyingWorldPlazaPlayerTeleportToWorldPoint';
import {
  BUILDING_WORLD_PLAZA_PLACED_BLOCKS_SCENE_REF_EMPTY,
  buildingWorldPlazaPlacedBlocksSceneRef,
  type DefiningWorldPlazaPlacedBlocksSceneRef,
} from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import {
  computingWorldPlazaEmbeddedHostSizeStyle,
  computingWorldPlazaExpandedHostSizeStyle,
} from '@/components/world/domains/computingWorldPlazaEmbeddedHostSizeStyle';
import { computingWorldPlazaViewportRenderResolution } from '@/components/world/domains/computingWorldPlazaViewportRenderResolution';
import {
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE,
  type DefiningWorldPlazaAvatarMotionState,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import { DEFINING_WORLD_PLAZA_CAMERA_ZOOM } from '@/components/world/domains/definingWorldPlazaCameraConstants';
import { DEFINING_WORLD_PLAZA_CAMERA_OFFSET_INITIAL } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import {
  DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_PRIMARY_POINTER_BUTTON,
  DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_SECONDARY_POINTER_BUTTON,
  DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE,
} from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { WorldPlazaCodexSectionId } from '@/components/world/domains/definingWorldPlazaCodexConstants';
import { checkingWorldPlazaMovementDirectionIsActive } from '@/components/world/domains/definingWorldPlazaMovementDirection';
import type {
  DefiningWorldPlazaOnlineRoomSnapshot,
  DefiningWorldPlazaRemotePlayer,
} from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import type { UsingWorldPlazaOnlineRoomChatResult } from '@/components/world/domains/definingWorldPlazaOnlineRoomChatBindings';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaPresenceDisconnectReason } from '@/components/world/domains/definingWorldPlazaPresenceDisconnectConstants';
import {
  DEFINING_WORLD_PLAZA_SANDBOX_DEFAULT_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_SANDBOX_DEFAULT_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaSandboxConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_GAME_AREA_SELECT_NONE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_HOST_FILL_CLASS_NAME,
  DEFINING_WORLD_PLAZA_HOST_FULLSCREEN_CLASS_NAME,
  DEFINING_WORLD_PLAZA_VIEWPORT_FRAME_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaViewportFullscreenConstants';
import { findingWorldPlazaFirelandsTeleportWorldPointForDev } from '@/components/world/domains/findingWorldPlazaFirelandsTeleportWorldPointForDev';
import { settingWorldPlazaPerformanceDiagnosticsEnabled } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { parsingWorldPlazaUserProfileAvatarUrlForNetworkSync } from '@/components/world/domains/parsingWorldPlazaUserProfileAvatarUrlForNetworkSync';
import { parsingWorldPlazaUserProfileStatusKindForNetworkSync } from '@/components/world/domains/parsingWorldPlazaUserProfileStatusKindForNetworkSync';
import {
  projectingWorldPlazaViewportClientPointToGridPoint,
  projectingWorldPlazaViewportClientPointToViewportScreenPoint,
} from '@/components/world/domains/projectingWorldPlazaViewportClientPointToGridPoint';
import '@/components/world/domains/registeringWorldPixiElements';
import { resolvingWorldPlazaInitialPlayerSpawnWorldPoint } from '@/components/world/domains/resolvingWorldPlazaInitialPlayerSpawnWorldPoint';
import type { DefiningWorldPlazaPixiViewportSize } from '@/components/world/domains/resolvingWorldPlazaPixiViewportSize';
import { resolvingWorldPlazaSavedCoordsById } from '@/components/world/domains/resolvingWorldPlazaSavedCoordsListFromStorage';
import { resolvingWorldPlazaWorldPointNearPlotBoundsForTeleport } from '@/components/world/domains/resolvingWorldPlazaWorldPointNearPlotBoundsForTeleport';
import { usingWorldPlazaEquipment } from '@/components/world/equipment/hooks/usingWorldPlazaEquipment';
import { RenderingWorldPlazaCampfireInteractionLabels } from '@/components/world/fire/components/renderingWorldPlazaCampfireInteractionLabels';
import { RenderingWorldPlazaFireLayer } from '@/components/world/fire/components/renderingWorldPlazaFireLayer';
import { usingWorldPlazaCampfireInteraction } from '@/components/world/fire/hooks/usingWorldPlazaCampfireInteraction';
import { usingWorldPlazaFireCells } from '@/components/world/fire/hooks/usingWorldPlazaFireCells';
import { usingWorldPlazaFlintIgnitionAttempt } from '@/components/world/fire/hooks/usingWorldPlazaFlintIgnitionAttempt';
import { RenderingWorldPlazaTreeInteractionLabels } from '@/components/world/harvest/components/renderingWorldPlazaTreeInteractionLabels';
import { formattingWorldPlazaChoppedTreeTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { registeringWorldPlazaChoppedTreesVisualLayerLookup } from '@/components/world/harvest/domains/registeringWorldPlazaChoppedTreesVisualLayerLookup';
import { usingWorldPlazaChoppedTrees } from '@/components/world/harvest/hooks/usingWorldPlazaChoppedTrees';
import { usingWorldPlazaTreeChopInteraction } from '@/components/world/harvest/hooks/usingWorldPlazaTreeChopInteraction';
import { usingWorldPlazaTreeChopProgress } from '@/components/world/harvest/hooks/usingWorldPlazaTreeChopProgress';
import { RenderingWorldPlazaEntityDeathScreenOverlay } from '@/components/world/health/components/renderingWorldPlazaEntityDeathScreenOverlay';
import {
  RenderingWorldPlazaEntityHealthBars,
  type RenderingWorldPlazaEntityHealthBarEntry,
} from '@/components/world/health/components/renderingWorldPlazaEntityHealthBars';
import { RenderingWorldPlazaEntityHealthFloatTexts } from '@/components/world/health/components/renderingWorldPlazaEntityHealthFloatTexts';
import { RenderingWorldPlazaEntityStatusEffectStack } from '@/components/world/health/components/renderingWorldPlazaEntityStatusEffectStack';
import { DEFINING_WORLD_PLAZA_ENTITY_DEATH_AUTO_RESPAWN_MS } from '@/components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type { DefiningWorldPlazaEntityHealthSyncSnapshot } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { formattingWorldPlazaEntityDeathScreenTitle } from '@/components/world/health/domains/formattingWorldPlazaEntityDeathScreenTitle';
import { usingWorldPlazaPlayerHealth } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';
import { trackingWorldPlazaArrowKeyInput } from '@/components/world/hooks/trackingWorldPlazaArrowKeyInput';
import { trackingWorldPlazaCharacterFacingRotationInput } from '@/components/world/hooks/trackingWorldPlazaCharacterFacingRotationInput';
import { trackingWorldPlazaClickMovementTarget } from '@/components/world/hooks/trackingWorldPlazaClickMovementTarget';
import { trackingWorldPlazaJumpInput } from '@/components/world/hooks/trackingWorldPlazaJumpInput';
import { trackingWorldPlazaPresenceActivity } from '@/components/world/hooks/trackingWorldPlazaPresenceActivity';
import { trackingWorldPlazaSaveCoordsDoubleTapTileSelection } from '@/components/world/hooks/trackingWorldPlazaSaveCoordsDoubleTapTileSelection';
import { usingWorldPlazaAvatarSkinSelectorVisibleState } from '@/components/world/hooks/usingWorldPlazaAvatarSkinSelectorVisibleState';
import { usingWorldPlazaCodexPanelVisibleState } from '@/components/world/hooks/usingWorldPlazaCodexPanelVisibleState';
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import { usingWorldPlazaDevEnvironment } from '@/components/world/hooks/usingWorldPlazaDevEnvironment';
import { usingWorldPlazaDevModePanelVisibleState } from '@/components/world/hooks/usingWorldPlazaDevModePanelVisibleState';
import { usingWorldPlazaDevvitPollingRoom } from '@/components/world/hooks/usingWorldPlazaDevvitPollingRoom';
import { usingWorldPlazaDevvitPollingRoomChat } from '@/components/world/hooks/usingWorldPlazaDevvitPollingRoomChat';
import { usingWorldPlazaFeaturesDebugVisibleState } from '@/components/world/hooks/usingWorldPlazaFeaturesDebugVisibleState';
import { usingWorldPlazaFriendsPanelKeyboardShortcuts } from '@/components/world/hooks/usingWorldPlazaFriendsPanelKeyboardShortcuts';
import { usingWorldPlazaFriendsPanelVisibleState } from '@/components/world/hooks/usingWorldPlazaFriendsPanelVisibleState';
import { usingWorldPlazaFriendTrackingState } from '@/components/world/hooks/usingWorldPlazaFriendTrackingState';
import { usingWorldPlazaGameplayHudToast } from '@/components/world/hooks/usingWorldPlazaGameplayHudToast';
import { usingWorldPlazaMobileLandscapeViewport } from '@/components/world/hooks/usingWorldPlazaMobileLandscapeViewport';
import { usingWorldPlazaPerformanceDiagnosticsVisibleState } from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsVisibleState';
import { usingWorldPlazaPersistingPlayerLastPosition } from '@/components/world/hooks/usingWorldPlazaPersistingPlayerLastPosition';
import { usingWorldPlazaPlayerTeleportScreenFade } from '@/components/world/hooks/usingWorldPlazaPlayerTeleportScreenFade';
import { usingWorldPlazaRecordingExploredBiomes } from '@/components/world/hooks/usingWorldPlazaRecordingExploredBiomes';
import { usingWorldPlazaRunStamina } from '@/components/world/hooks/usingWorldPlazaRunStamina';
import { usingWorldPlazaSaveCoordsTilePopover } from '@/components/world/hooks/usingWorldPlazaSaveCoordsTilePopover';
import { usingWorldPlazaSavedCoordsQuery } from '@/components/world/hooks/usingWorldPlazaSavedCoordsQuery';
import { usingWorldPlazaSavedCoordsTrackingVisibleState } from '@/components/world/hooks/usingWorldPlazaSavedCoordsTrackingVisibleState';
import { usingWorldPlazaSelectedAvatarCharacterDefinition } from '@/components/world/hooks/usingWorldPlazaSelectedAvatarCharacterDefinition';
import { usingWorldPlazaTerrainCollisionDebugVisibleState } from '@/components/world/hooks/usingWorldPlazaTerrainCollisionDebugVisibleState';
import { usingWorldPlazaViewportFullscreenLetterbox } from '@/components/world/hooks/usingWorldPlazaViewportFullscreenLetterbox';
import { usingWorldPlazaViewportHudScale } from '@/components/world/hooks/usingWorldPlazaViewportHudScale';
import { usingWorldPlazaViewportProfileLayoutInputs } from '@/components/world/hooks/usingWorldPlazaViewportProfileLayoutInputs';
import { usingWorldPlazaPlayerHunger } from '@/components/world/hunger/hooks/usingWorldPlazaPlayerHunger';
import type { DefiningWorldPlazaInteractablePointerHitContext } from '@/components/world/interaction/domains/definingWorldPlazaInteractablePointerHitContext';
import {
  clearingWorldPlazaInteractableBlockClickSelection,
  selectingWorldPlazaInteractableBlockForClickAction,
  selectingWorldPlazaInteractableTreeForClickAction,
} from '@/components/world/interaction/domains/managingWorldPlazaInteractableBlockClickSelection';
import { trackingWorldPlazaInteractableBlockPointerInteraction } from '@/components/world/interaction/hooks/trackingWorldPlazaInteractableBlockPointerInteraction';
import { RenderingWorldPlazaGroundItems } from '@/components/world/inventory/components/renderingWorldPlazaGroundItems';
import { RenderingWorldPlazaInventoryDropArrowOverlay } from '@/components/world/inventory/components/renderingWorldPlazaInventoryDropArrowOverlay';
import { RenderingWorldPlazaInventoryDropTileOutlinePreview } from '@/components/world/inventory/components/renderingWorldPlazaInventoryDropTileOutlinePreview';
import { RenderingWorldPlazaInventoryHotbar } from '@/components/world/inventory/components/renderingWorldPlazaInventoryHotbar';
import { consumingWorldPlazaInventoryItemByType } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemByType';
import { resolvingWorldPlazaInventoryFoodDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
import { trackingWorldPlazaInventoryDropPlacement } from '@/components/world/inventory/hooks/trackingWorldPlazaInventoryDropPlacement';
import { usingWorldPlazaInventory } from '@/components/world/inventory/hooks/usingWorldPlazaInventory';
import { RenderingWorldPlazaLightingDarknessLayer } from '@/components/world/lighting/components/renderingWorldPlazaLightingDarknessLayer';
import { RenderingWorldPlazaLightSourcesGroundGlow } from '@/components/world/lighting/components/renderingWorldPlazaLightSourcesGroundGlow';
import { RenderingWorldPlotVisitApprovedPlazaModal } from '@/components/world/plotVisit/components/renderingWorldPlotVisitApprovedPlazaModal';
import { RenderingWorldPlotVisitRequestPlazaModal } from '@/components/world/plotVisit/components/renderingWorldPlotVisitRequestPlazaModal';
import { WORLD_PLOT_VISIT_REQUESTS_OUTGOING_QUERY_KEY } from '@/components/world/plotVisit/domains/definingWorldPlotVisitRequest';
import { usingWorldPlotVisitRequestApprovedPlazaDialogs } from '@/components/world/plotVisit/hooks/usingWorldPlotVisitRequestApprovedPlazaDialogs';
import { usingWorldPlotVisitRequestCreateMutation } from '@/components/world/plotVisit/hooks/usingWorldPlotVisitRequestCreateMutation';
import { usingWorldPlotVisitRequestHostPlazaDialogs } from '@/components/world/plotVisit/hooks/usingWorldPlotVisitRequestHostPlazaDialogs';
import { usingWorldPlotVisitRequestsOutgoing } from '@/components/world/plotVisit/hooks/usingWorldPlotVisitRequestsOutgoing';
import { acknowledgingWorldPlotVisitRequest } from '@/components/world/plotVisit/utils/acknowledgingWorldPlotVisitRequest';
import { RenderingWorldPlazaProjectileSimulation } from '@/components/world/projectile/components/renderingWorldPlazaProjectileSimulation';
import { RenderingWorldPlazaProjectileVisualLayer } from '@/components/world/projectile/components/renderingWorldPlazaProjectileVisualLayer';
import type {
  DefiningWorldPlazaPlayerProjectileDodgeState,
  SpawningWorldPlazaProjectileRequest,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import type { ManagingWorldPlazaProjectileStore } from '@/components/world/projectile/domains/managingWorldPlazaProjectileStore';
import { usingWorldPlazaProjectileEngine } from '@/components/world/projectile/hooks/usingWorldPlazaProjectileEngine';
import { Application } from '@pixi/react';
import { useQueryClient } from '@tanstack/react-query';
import type { Container } from 'pixi.js';
import { CullerPlugin } from 'pixi.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PLAZA_DEVVIT_ONLINE_MAX_PLAYERS } from '../../../shared/plazaDevvitOnline';
import type { PlazaSaveSlotIndex } from '../../../shared/plazaGameSession';

/** Live online room binding passed into the connected plaza scene. */
export type RenderingWorldPlazaOnlineRoomBinding = {
  roomSnapshot: DefiningWorldPlazaOnlineRoomSnapshot;
  remotePlayerRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >;
  syncingMovePositionRef: React.RefObject<(() => void) | null>;
};

/** `tabIndex` so the plaza receives keyboard focus after click. */
const DEFINING_WORLD_PLAZA_FOCUS_TAB_INDEX = 0;

/** Keeps the Pixi canvas above the biome sky backdrop. */
const DEFINING_WORLD_PLAZA_PIXI_STAGE_LAYER_CLASS_NAME =
  'relative z-10 h-full w-full';

/** Accessible label for the plaza viewport. */
const DEFINING_WORLD_PLAZA_ARIA_LABEL =
  'World Plaza. Click to walk. Double-click to run. Hold to run on mobile. Tap again while running to jump on mobile. Arrow keys or WASD to move. Hold Shift to run. Hold right-click to face the mouse. Double-click the tile under your avatar to save coordinates. Space to jump.' as const;

/** Embedded plaza host chrome (border, radius, max width). */
const DEFINING_WORLD_PLAZA_HOST_EMBEDDED_CLASS_NAME = `relative touch-none overflow-hidden rounded-xl border border-border bg-muted shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${DEFINING_WORLD_PLAZA_GAME_AREA_SELECT_NONE_CLASS_NAME}`;

/** Blocks browser page scroll when Space is used for plaza jump input. */
const DEFINING_WORLD_PLAZA_JUMP_KEY = ' ' as const;

/**
 * Pixi application extensions registered before init.
 *
 * CullerPlugin skips draw calls for off-screen prefetched terrain. The camera
 * rig applies its first transform in a layout effect so culling does not hide
 * the world before follow centers on the player.
 */
const DEFINING_WORLD_PLAZA_PIXI_APPLICATION_EXTENSIONS = [CullerPlugin];

/** Enables depth sorting between avatars on the entity layer. */
const DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_LAYER_SORTABLE_CHILDREN = true;

/** Enables depth sorting between cached floor chunks. */
const DEFINING_WORLD_PLAZA_TERRAIN_FLOOR_LAYER_SORTABLE_CHILDREN = true;

/** Keeps per-tree canopy z-index sorting within the canopy sub-layer. */
const DEFINING_WORLD_PLAZA_TERRAIN_CANOPY_LAYER_SORTABLE_CHILDREN = true;

export interface RenderingWorldPlazaPixiSceneProps {
  /** Authenticated user id; when null online sync is disabled. */
  onlineUserId: string | null;
  /** Scoped owner id for offline local persistence (save slots). */
  localPersistenceOwnerId?: string | null;
  /** Reddit user id for signed-in single-player cloud saves. */
  redditUserId?: string | null;
  /** Active single-player save slot (1–3). */
  singlePlayerSaveSlotIndex?: PlazaSaveSlotIndex | null;
  /** Label broadcast to other players in the room. */
  onlineDisplayName: string;
  /** Public profile status badge broadcast to other players in the room. */
  onlineProfileStatusKind?: CommunityMemberProfileStatusKind | null;
  /** Avatar URL broadcast to other players in the room. */
  onlineAvatarUrl?: string | null;
  /** `fill` uses the full iframe; `embedded` keeps the 16:9 frame. */
  hostLayout?: 'embedded' | 'fill';
  /** Player cap shown in the room HUD. */
  onlineMaxPlayers?: number;
  /** Selected multiplayer room shard index. */
  onlineRoomIndex?: number;
  /** Returns to the home screen when provided. */
  onExitToHome?: () => void;
}

/**
 * Isometric plaza with HTTP polling multiplayer for Reddit Devvit.
 */
export function RenderingWorldPlazaPixiScene({
  onlineUserId,
  localPersistenceOwnerId = null,
  redditUserId = null,
  singlePlayerSaveSlotIndex = null,
  onlineDisplayName,
  onlineProfileStatusKind = null,
  onlineAvatarUrl = null,
  hostLayout = 'embedded',
  onlineMaxPlayers = PLAZA_DEVVIT_ONLINE_MAX_PLAYERS,
  onlineRoomIndex = 1,
  onExitToHome,
}: RenderingWorldPlazaPixiSceneProps): React.JSX.Element {
  const playerPositionRef = useRef<DefiningWorldPlazaWorldPoint>(
    resolvingWorldPlazaInitialPlayerSpawnWorldPoint(
      onlineUserId,
      localPersistenceOwnerId
    )
  );
  const localAvatarMotionStateRef = useRef({
    ...DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE,
  });
  const healthSyncSnapshotRef =
    useRef<DefiningWorldPlazaEntityHealthSyncSnapshot>({
      healthCurrent: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
      healthEffectiveMax: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
      shieldPoints: 0,
      isInvincible: false,
    });

  const {
    isPresenceConnected,
    isPresenceReconnectOverlayVisible,
    presenceDisconnectReason,
    reconnectingPresence,
    registeringLocomotionActivityRef,
  } = trackingWorldPlazaPresenceActivity({
    isEnabled: onlineUserId !== null,
  });

  const isOnlineRoomEnabled = onlineUserId !== null && isPresenceConnected;
  const isPlazaProjectileSessionActive =
    onlineUserId !== null || localPersistenceOwnerId !== null;

  const {
    projectileStoreRef,
    localPlayerDodgeStateRef,
    spawnProjectileRef,
    pendingOnlineSpawnEventsRef,
    ingestOnlineSpawnEvents,
  } = usingWorldPlazaProjectileEngine({
    isEnabled: isPlazaProjectileSessionActive,
    localUserId: onlineUserId,
  });

  const onlineRoom = usingWorldPlazaDevvitPollingRoom({
    userId: onlineUserId,
    displayName: onlineDisplayName,
    profileStatusKind: onlineProfileStatusKind,
    avatarUrl: onlineAvatarUrl,
    enabled: isOnlineRoomEnabled,
    roomIndex: onlineRoomIndex,
    playerPositionRef,
    localAvatarMotionStateRef,
    healthSyncSnapshotRef,
    pendingProjectileSpawnEventsRef: pendingOnlineSpawnEventsRef,
    onRemoteProjectileSpawnEvents: ingestOnlineSpawnEvents,
  });

  const roomChat = usingWorldPlazaDevvitPollingRoomChat({
    userId: onlineUserId,
    displayName: onlineDisplayName,
    playerPositionRef,
    isRoomJoined: onlineRoom.roomSnapshot.isJoined,
    enabled: isOnlineRoomEnabled,
    roomIndex: onlineRoomIndex,
  });

  return (
    <ProvidingWorldPlazaPerformanceProfile>
      <RenderingWorldPlazaPixiSceneConnected
        onlineUserId={onlineUserId}
        localPersistenceOwnerId={localPersistenceOwnerId}
        redditUserId={redditUserId}
        singlePlayerSaveSlotIndex={singlePlayerSaveSlotIndex}
        onlineDisplayName={onlineDisplayName}
        onlineProfileStatusKind={onlineProfileStatusKind}
        onlineAvatarUrl={onlineAvatarUrl}
        playerPositionRef={playerPositionRef}
        localAvatarMotionStateRef={localAvatarMotionStateRef}
        healthSyncSnapshotRef={healthSyncSnapshotRef}
        projectileStoreRef={projectileStoreRef}
        localPlayerDodgeStateRef={localPlayerDodgeStateRef}
        spawnProjectileRef={spawnProjectileRef}
        isPlazaProjectileSessionActive={isPlazaProjectileSessionActive}
        hostLayout={hostLayout}
        isOnlineRoomEnabled={isOnlineRoomEnabled}
        isPresenceReconnectOverlayVisible={isPresenceReconnectOverlayVisible}
        presenceDisconnectReason={presenceDisconnectReason}
        reconnectingPresence={reconnectingPresence}
        registeringLocomotionActivityRef={registeringLocomotionActivityRef}
        onlineMaxPlayers={onlineMaxPlayers}
        onlineRoomIndex={onlineRoomIndex}
        onExitToHome={onExitToHome}
        onlineRoom={onlineRoom}
        roomChat={roomChat}
      />
    </ProvidingWorldPlazaPerformanceProfile>
  );
}

interface RenderingWorldPlazaPixiSceneConnectedProps {
  onlineUserId: string | null;
  localPersistenceOwnerId: string | null;
  redditUserId: string | null;
  singlePlayerSaveSlotIndex: PlazaSaveSlotIndex | null;
  onlineDisplayName: string;
  onlineProfileStatusKind: CommunityMemberProfileStatusKind | null;
  onlineAvatarUrl: string | null;
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  localAvatarMotionStateRef: React.RefObject<DefiningWorldPlazaAvatarMotionState>;
  healthSyncSnapshotRef: React.RefObject<DefiningWorldPlazaEntityHealthSyncSnapshot>;
  projectileStoreRef: React.RefObject<ManagingWorldPlazaProjectileStore>;
  localPlayerDodgeStateRef: React.RefObject<DefiningWorldPlazaPlayerProjectileDodgeState>;
  spawnProjectileRef: React.RefObject<
    (request: SpawningWorldPlazaProjectileRequest) => string | null
  >;
  isPlazaProjectileSessionActive: boolean;
  hostLayout: 'embedded' | 'fill';
  isOnlineRoomEnabled: boolean;
  isPresenceReconnectOverlayVisible: boolean;
  presenceDisconnectReason: DefiningWorldPlazaPresenceDisconnectReason | null;
  reconnectingPresence: () => void;
  registeringLocomotionActivityRef: React.RefObject<(() => boolean) | null>;
  onlineMaxPlayers: number;
  onlineRoomIndex: number;
  onExitToHome?: () => void;
  onlineRoom: RenderingWorldPlazaOnlineRoomBinding;
  roomChat: UsingWorldPlazaOnlineRoomChatResult;
}

/**
 * Plaza canvas and HUD for the connected online room.
 */
function RenderingWorldPlazaPixiSceneConnected({
  onlineUserId,
  localPersistenceOwnerId,
  redditUserId,
  singlePlayerSaveSlotIndex,
  onlineDisplayName,
  onlineProfileStatusKind,
  onlineAvatarUrl,
  playerPositionRef,
  localAvatarMotionStateRef,
  healthSyncSnapshotRef,
  projectileStoreRef,
  localPlayerDodgeStateRef,
  spawnProjectileRef,
  isPlazaProjectileSessionActive,
  hostLayout,
  isOnlineRoomEnabled,
  isPresenceReconnectOverlayVisible,
  presenceDisconnectReason,
  reconnectingPresence,
  registeringLocomotionActivityRef,
  onlineMaxPlayers,
  onlineRoomIndex,
  onExitToHome,
  onlineRoom,
  roomChat,
}: RenderingWorldPlazaPixiSceneConnectedProps): React.JSX.Element {
  const isSinglePlayerSession =
    onlineUserId === null && localPersistenceOwnerId !== null;
  /** Active timed tool action (chopping, ...) the local avatar is performing. */
  const localAvatarToolActionRef =
    useRef<DefiningWorldPlazaAvatarToolAction | null>(null);
  const isLocalGameplayEnabled = onlineUserId !== null || isSinglePlayerSession;
  const localPlayerProjectileTargetId = onlineUserId ?? 'local-player';
  const shouldShowLocalPlayerNameLabel =
    onlineUserId !== null || redditUserId !== null;
  const buildModeUserId = onlineUserId ?? redditUserId;
  const isBuildModeEnabled = buildModeUserId !== null;
  const localHealthEntityUserId =
    onlineUserId ?? localPersistenceOwnerId ?? 'local-player';
  const queryClient = useQueryClient();
  const performanceProfile = usingWorldPlazaPerformanceProfile();
  const hostRef = useRef<HTMLDivElement>(null);
  const viewportFrameRef = useRef<HTMLDivElement>(null);
  const cameraOffsetRef = useRef({
    ...DEFINING_WORLD_PLAZA_CAMERA_OFFSET_INITIAL,
  });
  const onWalkArrivedRef = useRef<(() => void) | null>(null);
  const onWalkStepRef = useRef<(() => void) | null>(null);
  const cancellingPendingInventoryGroundDropQueueRef = useRef<
    (() => void) | null
  >(null);
  const isChatOpenRef = useRef(false);
  const isJumpingRef = useRef(false);
  const isRunningOnIceRef = useRef(false);
  const playerRenderPositionRegistryRef = useRef<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >(new Map());
  const pixiViewportSizeRef = useRef({
    width: DEFINING_WORLD_PLAZA_SANDBOX_DEFAULT_WIDTH_PX,
    height: DEFINING_WORLD_PLAZA_SANDBOX_DEFAULT_HEIGHT_PX,
  });
  const cameraWorldZoomRef = useRef(DEFINING_WORLD_PLAZA_CAMERA_ZOOM);
  const fullscreenLogicalViewportRef =
    useRef<DefiningWorldPlazaPixiViewportSize | null>(null);

  const {
    isFullscreen,
    isFullscreenSupported,
    togglingViewportFullscreen,
    fullscreenLogicalViewport,
  } = usingWorldPlazaViewportFullscreenLetterbox({
    hostRef,
    pixiViewportSizeRef,
  });
  const { isMobile, shouldShowLandscapePrompt } =
    usingWorldPlazaMobileLandscapeViewport(
      isLocalGameplayEnabled,
      isFullscreen
    );
  const viewportHudScale = usingWorldPlazaViewportHudScale(viewportFrameRef);
  const viewportHudLayout = usingWorldPlazaViewportProfileLayoutInputs(
    isFullscreen,
    viewportHudScale
  );
  const hudIsMobile = viewportHudLayout.isMobile;
  const hudIsFullscreen = viewportHudLayout.isFullscreen;

  useEffect(() => {
    fullscreenLogicalViewportRef.current = fullscreenLogicalViewport;
  }, [fullscreenLogicalViewport]);

  const placedBlocksRef = useRef<DefiningWorldPlazaPlacedBlocksSceneRef>(
    BUILDING_WORLD_PLAZA_PLACED_BLOCKS_SCENE_REF_EMPTY
  );
  const terrainFloorLayerRef = useRef<Container | null>(null);
  const terrainTrunkLayerRef = useRef<Container | null>(null);
  const terrainCanopyLayerRef = useRef<Container | null>(null);
  const ownedPlotsRef = useRef<DefiningWorldBuildingPlot[]>([]);
  const hoverTilePositionRef = useRef<DefiningWorldBuildingTilePosition | null>(
    null
  );
  const selectedTilePositionRef =
    useRef<DefiningWorldBuildingTilePosition | null>(null);
  const previewTilePositionRef =
    useRef<DefiningWorldBuildingTilePosition | null>(null);
  const canPlaceAtPreviewTileRef = useRef(false);
  const isPreviewTileValidRef = useRef(false);
  const previewWorldLayerRef = useRef(
    DEFINING_WORLD_BUILDING_WORLD_LAYER_BUILD_DEFAULT
  );
  const previewBlockHeightRef = useRef(
    DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_BUILD_DEFAULT
  );
  const previewCutFootprintMaskRef = useRef(
    DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK
  );
  const previewCutGridAxisCellCountRef =
    useRef<DefiningWorldBuildingCutGridAxisCellCount>(
      DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT
    );
  const hoveredRemovableBlockRef =
    useRef<DefiningWorldBuildingPlacedBlock | null>(null);
  const isBuildTilePopoverOpenRef = useRef(false);
  const isSaveCoordsTilePopoverOpenRef = useRef(false);
  const saveCoordsSelectedTilePositionRef =
    useRef<DefiningWorldBuildingTilePosition | null>(null);
  const isEditSessionActiveRef = useRef(false);
  const isPlayerDeadRef = useRef(false);
  const isBlockBuildModeActiveRef = useRef(false);
  const isBuildModeActiveRef = useRef(false);
  const isClaimModeActiveRef = useRef(false);
  const isTerrainCollisionDebugVisibleRef = useRef(false);
  const selectedWorldLayerRef = useRef(
    DEFINING_WORLD_BUILDING_WORLD_LAYER_BUILD_DEFAULT
  );

  const { plots, placedBlocks, ownedPlots, refetchingPlots } =
    usingWorldPlazaPlacedBlocksQuery({
      isEnabled: isBuildModeEnabled,
      onlineUserId: buildModeUserId,
      playerPositionRef,
    });

  const isLocalhostDevEnvironment = usingWorldPlazaLocalhostDevEnvironment();
  const isDevEnvironment = usingWorldPlazaDevEnvironment();
  const { isDevModePanelOpen, togglingDevModePanel, closingDevModePanel } =
    usingWorldPlazaDevModePanelVisibleState(isDevEnvironment);
  const isDevDebugActive = isDevEnvironment && isDevModePanelOpen;

  const {
    isTerrainCollisionDebugVisible,
    togglingTerrainCollisionDebugVisible,
  } = usingWorldPlazaTerrainCollisionDebugVisibleState();

  const {
    isPerformanceDiagnosticsVisible,
    isPerformanceDiagnosticsFeatureAvailable,
    togglingPerformanceDiagnosticsVisible,
  } = usingWorldPlazaPerformanceDiagnosticsVisibleState();

  const { isAvatarSkinSelectorVisible, togglingAvatarSkinSelectorVisible } =
    usingWorldPlazaAvatarSkinSelectorVisibleState();
  const { isFeaturesDebugVisible, togglingFeaturesDebugVisible } =
    usingWorldPlazaFeaturesDebugVisibleState();

  useEffect(() => {
    if (!isPerformanceDiagnosticsFeatureAvailable) {
      return;
    }

    settingWorldPlazaPerformanceDiagnosticsEnabled(
      isDevDebugActive && isPerformanceDiagnosticsVisible
    );
  }, [
    isDevDebugActive,
    isPerformanceDiagnosticsFeatureAvailable,
    isPerformanceDiagnosticsVisible,
  ]);

  const {
    savedCoordsList,
    savingCoordsAtTilePosition,
    deletingSavedCoords,
    canSaveMoreCoords,
    isSavingCoords,
    isDeletingSavedCoords,
  } = usingWorldPlazaSavedCoordsQuery(
    isLocalGameplayEnabled,
    localPersistenceOwnerId
  );

  const {
    trackedSavedCoordsId,
    togglingSavedCoordsTracking,
    clearingSavedCoordsTracking,
  } = usingWorldPlazaSavedCoordsTrackingVisibleState();

  const trackedSavedCoords = useMemo(
    () =>
      resolvingWorldPlazaSavedCoordsById(savedCoordsList, trackedSavedCoordsId),
    [savedCoordsList, trackedSavedCoordsId]
  );

  useEffect(() => {
    if (
      trackedSavedCoordsId &&
      !savedCoordsList.some(
        (savedCoords) => savedCoords.savedCoordsId === trackedSavedCoordsId
      )
    ) {
      clearingSavedCoordsTracking();
    }
  }, [clearingSavedCoordsTracking, savedCoordsList, trackedSavedCoordsId]);

  const {
    selectedTilePosition: saveCoordsSelectedTilePosition,
    isSaveCoordsTilePopoverOpen,
    selectingSaveCoordsTileAtViewport,
    closingSaveCoordsTilePopover,
  } = usingWorldPlazaSaveCoordsTilePopover();

  const { plotOwnerLimits } = usingWorldPlazaPlotOwnerLimitsQuery({
    userId: buildModeUserId,
    isEnabled: isBuildModeEnabled,
  });

  usingWorldPlazaTemporaryPlotLifecycle({
    isEnabled: isBuildModeEnabled,
    onlineUserId: buildModeUserId,
  });

  const [isRemovingTemporaryPlot, setIsRemovingTemporaryPlot] = useState(false);

  const {
    isEditSessionActive,
    isBlockBuildModeActive,
    isBuildModeActive,
    isClaimModeActive,
    isBuildPlacementSelectionActive,
    isPresetBlockTypeSelected,
    selectedDefinitionId,
    selectedWorldLayer,
    selectedBlockHeight,
    selectedCutFootprintMask,
    selectedCutGridAxisCellCount,
    previewCutFootprintMask,
    previewCutGridAxisCellCount,
    hoveredRemovableBlock,
    hoverTilePosition,
    selectedTilePosition,
    previewTilePosition,
    isBuildTilePopoverOpen,
    buildTilePopoverMode,
    buildErrorMessage,
    canPlaceAtPreviewTile,
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
    activePlacedBlocks,
    activeOwnedPlots,
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
    actingOnEditModeTileAtViewport,
    removingBlockAtTile,
    closingBuildModeTilePopover,
    claimingPlotAtSelectedTile,
    claimingTemporaryPlotAtSelectedTile,
    canClaimTemporaryAtSelectedTile,
    removingTemporaryPlotAtTile,
    placingBlockAtSelectedTile,
    removingBlockAtSelectedTile,
    unclaimingPlotAtSelectedTile,
    savingBuildDraft,
    clearingAllDevPlacedObjects,
  } = usingWorldPlazaBuildMode({
    isEnabled: isBuildModeEnabled,
    onlineUserId: buildModeUserId,
    plots,
    ownedPlots,
    plotOwnerLimits,
    refetchingPlots,
  });

  const isProjectileEngineEnabled =
    isPlazaProjectileSessionActive &&
    isLocalGameplayEnabled &&
    !isEditSessionActive;

  const handlingRemoveTemporaryPlotAtTile = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition): void => {
      setIsRemovingTemporaryPlot(true);
      void removingTemporaryPlotAtTile(tilePosition).finally(() => {
        setIsRemovingTemporaryPlot(false);
      });
    },
    [removingTemporaryPlotAtTile]
  );

  const { handlingSaveCoordsDoubleTapPointerDown } =
    trackingWorldPlazaSaveCoordsDoubleTapTileSelection({
      isEnabled: isLocalGameplayEnabled && !isEditSessionActive,
      playerPositionRef,
      selectingSaveCoordsTileAtViewport,
    });

  const {
    ownerGroups: claimModeOwnerGroups,
    isLoading: isClaimModePlotRegistryLoading,
    queryErrorMessage: claimModePlotRegistryErrorMessage,
    refetchingRegistry: refetchingClaimModePlotRegistry,
  } = usingWorldPlazaClaimModePlotRegistryQuery({
    isEnabled: isBuildModeEnabled && isClaimModeActive,
    localUserId: buildModeUserId,
  });

  const wasSavingBuildDraftRef = useRef(false);

  useEffect(() => {
    if (
      wasSavingBuildDraftRef.current &&
      !isSavingBuildDraft &&
      isClaimModeActive
    ) {
      void refetchingClaimModePlotRegistry();
    }

    wasSavingBuildDraftRef.current = isSavingBuildDraft;
  }, [isClaimModeActive, isSavingBuildDraft, refetchingClaimModePlotRegistry]);

  const claimModeLocalOwnedPlotCount = useMemo(() => {
    if (!buildModeUserId) {
      return 0;
    }

    return countingWorldBuildingOwnerOwnedPlotCount(
      activeViewportPlots,
      buildModeUserId
    );
  }, [activeViewportPlots, buildModeUserId]);

  const claimModeLocalTileClaimCount = useMemo(() => {
    if (!buildModeUserId) {
      return 0;
    }

    return countingWorldBuildingOwnerPlotTileClaims(
      activeViewportPlots,
      buildModeUserId
    );
  }, [activeViewportPlots, buildModeUserId]);

  const claimModeOverlayPlots = useMemo(() => {
    const resolvedOwnedPlots = isEditSessionActive
      ? activeOwnedPlots
      : ownedPlots;

    return mergingWorldBuildingClaimModeOverlayPlots(
      activeViewportPlots,
      resolvedOwnedPlots,
      buildModeUserId
    );
  }, [
    activeOwnedPlots,
    activeViewportPlots,
    buildModeUserId,
    isEditSessionActive,
    ownedPlots,
  ]);

  const activeScenePlacedBlocks = isEditSessionActive
    ? activePlacedBlocks
    : placedBlocks;
  placedBlocksRef.current = buildingWorldPlazaPlacedBlocksSceneRef(
    activeScenePlacedBlocks
  );
  const buildModeOwnedPlots = isEditSessionActive
    ? activeOwnedPlots
    : ownedPlots;
  ownedPlotsRef.current = buildModeOwnedPlots;

  hoverTilePositionRef.current = hoverTilePosition;
  selectedTilePositionRef.current = selectedTilePosition;
  previewTilePositionRef.current = previewTilePosition;
  canPlaceAtPreviewTileRef.current = canPlaceAtPreviewTile;
  isPreviewTileValidRef.current = isPreviewTileValid;
  previewWorldLayerRef.current = previewWorldLayer;
  previewBlockHeightRef.current = previewBlockHeight;
  previewCutFootprintMaskRef.current = previewCutFootprintMask;
  previewCutGridAxisCellCountRef.current = previewCutGridAxisCellCount;
  hoveredRemovableBlockRef.current = hoveredRemovableBlock;
  isBuildTilePopoverOpenRef.current = isBuildTilePopoverOpen;
  isSaveCoordsTilePopoverOpenRef.current = isSaveCoordsTilePopoverOpen;
  saveCoordsSelectedTilePositionRef.current = saveCoordsSelectedTilePosition;
  isEditSessionActiveRef.current = isEditSessionActive;
  isBlockBuildModeActiveRef.current = isBlockBuildModeActive;
  isBuildModeActiveRef.current = isEditSessionActive;
  isClaimModeActiveRef.current = isClaimModeActive;
  isTerrainCollisionDebugVisibleRef.current =
    isDevDebugActive && isTerrainCollisionDebugVisible;
  selectedWorldLayerRef.current = selectedWorldLayer;

  usingWorldPlazaPlotSubscription({
    isEnabled: isBuildModeEnabled,
    refetchingPlots,
  });

  const { jumpRequestedRef } = trackingWorldPlazaJumpInput({
    isEnabled: !isEditSessionActive,
    isChatOpenRef,
    focusContainerRef: hostRef,
    isJumpingRef,
  });

  const {
    walkTargetRef,
    isWalkingRef,
    isPointerHeldRef,
    pointerHeldSinceMsRef,
    isClickRunIntentRef,
    clickArrowEffectRef,
    handlingPlazaPointerDown,
    handlingPlazaPointerMove,
    handlingPlazaPointerRelease,
    clearingWalkTarget,
    isWalkPausedByCollisionRef,
    isRunningRef,
  } = trackingWorldPlazaClickMovementTarget({
    isEnabled: !isEditSessionActive,
    viewportFrameRef,
    cameraOffsetRef,
    viewportSizeRef: pixiViewportSizeRef,
    cameraWorldZoomRef,
    playerPositionRef,
    isJumpingRef,
    jumpRequestedRef,
    cancellingPlayerNavigateIntentRef:
      cancellingPendingInventoryGroundDropQueueRef,
    isPlayerDeadRef,
  });

  const { roomSnapshot, remotePlayerRegistryRef, syncingMovePositionRef } =
    onlineRoom;

  const {
    removeItem,
    moveItem,
    updateState: updatingInventoryState,
    state: inventoryState,
  } = usingWorldPlazaInventory({
    onlineUserId,
    localPersistenceOwnerId,
    redditUserId,
    saveSlotIndex: isSinglePlayerSession ? singlePlayerSaveSlotIndex : null,
    seedDemoItems: false,
  });

  const equipment = usingWorldPlazaEquipment({ inventoryState });
  const chopPersistenceOwnerId = localPersistenceOwnerId ?? onlineUserId;
  const { choppedTreeStateByTileKey } = usingWorldPlazaChoppedTrees({
    enabled: isLocalGameplayEnabled,
    localPersistenceOwnerId,
    redditUserId,
    saveSlotIndex: isSinglePlayerSession ? singlePlayerSaveSlotIndex : null,
  });
  const choppedTreesByTileKeyRef = useRef(choppedTreeStateByTileKey);
  choppedTreesByTileKeyRef.current = choppedTreeStateByTileKey;

  useEffect(() => {
    registeringWorldPlazaChoppedTreesVisualLayerLookup((tileX, tileY) =>
      choppedTreeStateByTileKey.get(
        formattingWorldPlazaChoppedTreeTileKey(tileX, tileY)
      )
    );

    return () => {
      registeringWorldPlazaChoppedTreesVisualLayerLookup(null);
    };
  }, [choppedTreeStateByTileKey]);

  const { fireCells, burntGrassTileKeys } = usingWorldPlazaFireCells({
    enabled: isLocalGameplayEnabled,
    onlineUserId,
    localPersistenceOwnerId,
  });

  const burntGrassTileKeySet = useMemo(
    () => new Set(burntGrassTileKeys),
    [burntGrassTileKeys]
  );
  const burntGrassTileKeysRef = useRef(burntGrassTileKeySet);
  burntGrassTileKeysRef.current = burntGrassTileKeySet;

  const consumingFireInventoryItem = useCallback(
    (itemTypeId: string, quantity: number): boolean => {
      let didConsume = false;

      // Atomic update against the freshest cached state so concurrent
      // pickups/consumes from other components are never clobbered.
      updatingInventoryState((currentState) => {
        const consumeResult = consumingWorldPlazaInventoryItemByType(
          currentState,
          itemTypeId,
          quantity
        );

        if (!consumeResult.consumed) {
          return null;
        }

        didConsume = true;
        return consumeResult.nextState;
      });

      return didConsume;
    },
    [updatingInventoryState]
  );

  const isCampfireActionPendingRef = useRef(false);
  const selectedInteractableBlockKeysRef = useRef(new Set<string>());

  const { interactingWithCampfireBlock } = usingWorldPlazaCampfireInteraction({
    onlineUserId,
    localPersistenceOwnerId,
    playerPositionRef,
    fireCells,
    placedBlocks: activeScenePlacedBlocks,
    inventoryState,
    consumingInventoryItem: consumingFireInventoryItem,
  });

  const handlingCampfireBlockInteraction = useCallback(
    (block: DefiningWorldBuildingPlacedBlock): void => {
      if (isCampfireActionPendingRef.current) {
        return;
      }

      isCampfireActionPendingRef.current = true;

      void interactingWithCampfireBlock(block).finally(() => {
        isCampfireActionPendingRef.current = false;
      });
    },
    [interactingWithCampfireBlock]
  );

  const selectingCampfireForInteractionLabel = useCallback(
    (block: DefiningWorldBuildingPlacedBlock): void => {
      selectingWorldPlazaInteractableBlockForClickAction(
        selectedInteractableBlockKeysRef,
        block
      );
    },
    []
  );

  const selectingTreeForInteractionLabel = useCallback(
    (block: DefiningWorldBuildingPlacedBlock): void => {
      selectingWorldPlazaInteractableTreeForClickAction(
        selectedInteractableBlockKeysRef,
        block.tilePosition.tileX,
        block.tilePosition.tileY
      );
    },
    []
  );

  const selectingProceduralTreeForInteractionLabel = useCallback(
    (tileX: number, tileY: number): void => {
      selectingWorldPlazaInteractableTreeForClickAction(
        selectedInteractableBlockKeysRef,
        tileX,
        tileY
      );
    },
    []
  );

  const clearingInteractableBlockClickSelection = useCallback((): void => {
    clearingWorldPlazaInteractableBlockClickSelection(
      selectedInteractableBlockKeysRef
    );
  }, []);

  const { handlingInteractableBlockPointerDown } =
    trackingWorldPlazaInteractableBlockPointerInteraction({
      isEnabled: isLocalGameplayEnabled && !isEditSessionActive,
      actorUserId: buildModeUserId,
      playerPositionRef,
      placedBlocks: activeScenePlacedBlocks,
      chopPersistenceOwnerId,
      choppedTreeStateByTileKey,
      onProceduralTreePopoverSelect: selectingProceduralTreeForInteractionLabel,
      handlers: {
        [DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE]:
          selectingCampfireForInteractionLabel,
        [DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_TREE_OAK]:
          selectingTreeForInteractionLabel,
      },
    });

  const attemptingFlintIgnitionAtTile = usingWorldPlazaFlintIgnitionAttempt({
    onlineUserId,
    localPersistenceOwnerId,
    playerPositionRef,
    inventoryState,
    placedBlocks: activeScenePlacedBlocks,
    consumingInventoryItem: consumingFireInventoryItem,
  });

  const { snapshot: gameplayHudToastSnapshot, showingGameplayHudToast } =
    usingWorldPlazaGameplayHudToast();

  const { validatingTreeChopStart, completingTreeChopLayer } =
    usingWorldPlazaTreeChopInteraction({
      localPersistenceOwnerId,
      redditUserId,
      saveSlotIndex: isSinglePlayerSession ? singlePlayerSaveSlotIndex : null,
      choppedTreeStateByTileKey,
      playerPositionRef,
      showingGameplayHudToast,
    });

  const completingTreeChopLayerRef = useRef(completingTreeChopLayer);
  completingTreeChopLayerRef.current = completingTreeChopLayer;

  const handlingTreeChopComplete = useCallback(
    (entry: Parameters<typeof completingTreeChopLayer>[0]): void => {
      void completingTreeChopLayerRef.current(entry);
    },
    []
  );

  const {
    snapshot: treeChopProgressSnapshot,
    progressRatioRef: treeChopProgressRatioRef,
    startingTreeChop,
  } = usingWorldPlazaTreeChopProgress({
    playerPositionRef,
    selectedInteractableBlockKeysRef,
    avatarToolActionRef: localAvatarToolActionRef,
    onChopComplete: handlingTreeChopComplete,
  });

  const handlingTreeChopInteraction = useCallback(
    (entry: Parameters<typeof validatingTreeChopStart>[0]): void => {
      if (!validatingTreeChopStart(entry)) {
        return;
      }

      const didStart = startingTreeChop(entry);

      if (!didStart) {
        showingGameplayHudToast('Already chopping a tree.');
      }
    },
    [showingGameplayHudToast, startingTreeChop, validatingTreeChopStart]
  );

  const inventoryDropPlacement = trackingWorldPlazaInventoryDropPlacement({
    viewportFrameRef,
    cameraOffsetRef,
    viewportSizeRef: pixiViewportSizeRef,
    cameraWorldZoomRef,
    playerPositionRef,
    walkTargetRef,
    isWalkingRef,
    placedBlocksRef,
    syncingMovePositionRef,
    localPersistenceOwnerId,
    redditUserId,
    saveSlotIndex: isSinglePlayerSession ? singlePlayerSaveSlotIndex : null,
    removeItem,
    moveItem,
  });

  cancellingPendingInventoryGroundDropQueueRef.current =
    inventoryDropPlacement.cancellingPendingInventoryGroundDropQueue;

  const { directionRef: keyboardDirectionRef, isRunKeyHeldRef } =
    trackingWorldPlazaArrowKeyInput({
      isEnabled: !isEditSessionActive,
      focusContainerRef: hostRef,
      isChatOpenRef,
      isClaimModeActiveRef,
      isPlayerDeadRef,
      cancellingPlayerMovementIntentRef:
        cancellingPendingInventoryGroundDropQueueRef,
    });

  const dayNightSunState = usingWorldPlazaDayNightSunState();
  const respawnWorldPoint = useMemo(
    () =>
      resolvingWorldPlazaInitialPlayerSpawnWorldPoint(
        onlineUserId,
        localPersistenceOwnerId
      ),
    [localPersistenceOwnerId, onlineUserId]
  );
  const onFallLandedRef = useRef<((layerDelta: number) => void) | null>(null);
  const isHealthRegenAllowedByHungerRef = useRef(true);
  const effectiveMaxHealthRef = useRef(
    DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX
  );
  const selectedAvatarCharacterDefinition =
    usingWorldPlazaSelectedAvatarCharacterDefinition();
  const selectedCharacterEngineDefinition =
    usingWorldPlazaSelectedCharacterEngineDefinition();

  const {
    hudSnapshot: playerHealthHudSnapshot,
    takeDamageRef,
    healRef,
    applyFallDamageRef,
    killRef,
    reviveRef,
    respawnRef,
    toggleInvincibleRef,
    addShieldRef,
    applyPoisonRef,
    applyBleedRef,
    applyPotentialDamageRef,
    applyStarvationDamageRef,
    toggleTemperatureDisplayUnitRef,
    rollDamageRef,
    toggleBuffRef,
    postRespawnInvincibilityUntilMsRef,
    healthStateRef,
    localTemperatureCelsiusRef,
  } = usingWorldPlazaPlayerHealth({
    isEnabled: isLocalGameplayEnabled && !isEditSessionActive,
    playerPositionRef,
    respawnWorldPoint,
    isDaytime: dayNightSunState.isDaytime,
    walkTargetRef,
    isWalkingRef,
    isJumpingRef,
    localAvatarMotionStateRef,
    placedBlocksRef,
    syncingMovePositionRef,
    healthSyncSnapshotRef,
    isHealthRegenAllowedRef: isHealthRegenAllowedByHungerRef,
    characterEngineDefinition: selectedCharacterEngineDefinition,
  });

  const { tryUsingSkill } =
    usingWorldPlazaCharacterEngineSkillCooldowns(healthStateRef);
  const tryUsingCharacterSkillRef = useRef(tryUsingSkill);
  tryUsingCharacterSkillRef.current = tryUsingSkill;

  useEffect(() => {
    effectiveMaxHealthRef.current = playerHealthHudSnapshot.effectiveMaxHealth;
  }, [playerHealthHudSnapshot.effectiveMaxHealth]);

  const {
    hungerHudSnapshot,
    hungerMovementMultipliersRef,
    consumingJumpHungerRef,
    eatingFoodRef,
    resettingHungerRef,
  } = usingWorldPlazaPlayerHunger({
    isEnabled: isLocalGameplayEnabled && !isEditSessionActive,
    isWalkingRef,
    isRunningRef,
    metabolismMultiplier:
      selectedCharacterEngineDefinition.stats.hungerDrainMultiplier,
    applyStarvationDamageRef,
    effectiveMaxHealthRef,
    isHealthRegenAllowedRef: isHealthRegenAllowedByHungerRef,
  });

  const handlingEatHotbarSlot = useCallback(
    (slotIndex: number): void => {
      const item = inventoryState.slots[slotIndex];

      if (!item) {
        return;
      }

      const foodDefinition = resolvingWorldPlazaInventoryFoodDefinition(
        item.itemTypeId
      );

      if (!foodDefinition) {
        return;
      }

      const didEat = eatingFoodRef.current?.(foodDefinition.hungerRestoreRatio);

      if (!didEat) {
        showingGameplayHudToast('Already full.');
        return;
      }

      updatingInventoryState((currentState) => {
        const consumeResult = consumingWorldPlazaInventoryItemByType(
          currentState,
          item.itemTypeId,
          1
        );

        return consumeResult.consumed ? consumeResult.nextState : null;
      });
    },
    [
      eatingFoodRef,
      inventoryState,
      updatingInventoryState,
      showingGameplayHudToast,
    ]
  );

  const {
    tryConsumingJumpStaminaRef,
    staminaRatio,
    isRunning: isRunningHud,
    isDepleted: isStaminaDepleted,
  } = usingWorldPlazaRunStamina({
    isEnabled: !isEditSessionActive,
    isWalkingRef,
    isClickRunIntentRef,
    isPointerHeldRef,
    pointerHeldSinceMsRef,
    isRunKeyHeldRef,
    isRunningOnIceRef,
    isRunningRef,
    healthStateRef,
    hungerMovementMultipliersRef,
  });

  const isPlayerDead = playerHealthHudSnapshot.isDead;
  isPlayerDeadRef.current = isPlayerDead;
  const deathScreenTitle = formattingWorldPlazaEntityDeathScreenTitle(
    playerHealthHudSnapshot.lastDamageKind
  );

  useEffect(() => {
    onFallLandedRef.current = (layerDelta: number): void => {
      applyFallDamageRef.current?.(layerDelta);
    };
  }, [applyFallDamageRef]);

  useEffect(() => {
    registeringLocomotionActivityRef.current = (): boolean => {
      return (
        isWalkingRef.current ||
        checkingWorldPlazaMovementDirectionIsActive(
          keyboardDirectionRef.current
        )
      );
    };
  }, [registeringLocomotionActivityRef]);

  usingWorldPlazaPersistingPlayerLastPosition({
    isEnabled: isLocalGameplayEnabled,
    onlineUserId,
    localPersistenceOwnerId,
    redditUserId,
    singlePlayerSaveSlotIndex,
    playerPositionRef,
    localAvatarMotionStateRef,
    isWalkingRef,
    isJumpingRef,
  });

  usingWorldPlazaRecordingExploredBiomes({
    isEnabled: isLocalGameplayEnabled,
    storageOwnerId: onlineUserId ?? localPersistenceOwnerId,
    playerPositionRef,
  });

  const {
    isTeleportFadeOverlayMounted,
    teleportFadeOverlayOpacity,
    teleportFadeTransitionDurationMs,
    teleportingWithScreenFade,
  } = usingWorldPlazaPlayerTeleportScreenFade();

  const createPlotVisitRequestMutation =
    usingWorldPlotVisitRequestCreateMutation();

  const { data: outgoingVisitRequestsPage } =
    usingWorldPlotVisitRequestsOutgoing({
      enabled: isBuildModeEnabled && isClaimModeActive,
      polling: isBuildModeEnabled && isClaimModeActive,
    });

  const outgoingVisitRequests = outgoingVisitRequestsPage?.rows ?? [];

  const teleportingPlayerToPlotBounds = useCallback(
    (plotBounds: DefiningWorldBuildingPlotBounds): void => {
      void teleportingWithScreenFade(() => {
        applyingWorldPlazaPlayerTeleportToWorldPoint({
          destinationWorldPoint:
            resolvingWorldPlazaWorldPointNearPlotBoundsForTeleport(
              plotBounds,
              placedBlocksRef.current.blocks
            ),
          placedBlocks: placedBlocksRef.current.blocks,
          playerPositionRef,
          walkTargetRef,
          isWalkingRef,
          isJumpingRef,
          localAvatarMotionStateRef,
          syncingMovePositionRef,
        });
        clearingWalkTarget();
      });
    },
    [
      clearingWalkTarget,
      isJumpingRef,
      isWalkingRef,
      localAvatarMotionStateRef,
      playerPositionRef,
      syncingMovePositionRef,
      teleportingWithScreenFade,
      walkTargetRef,
    ]
  );

  const teleportingPlayerToFirelands = useCallback((): void => {
    const destinationWorldPoint =
      findingWorldPlazaFirelandsTeleportWorldPointForDev();

    if (!destinationWorldPoint) {
      showingGameplayHudToast('No Firelands region found nearby.');
      return;
    }

    void teleportingWithScreenFade(() => {
      applyingWorldPlazaPlayerTeleportToWorldPoint({
        destinationWorldPoint,
        placedBlocks: placedBlocksRef.current.blocks,
        playerPositionRef,
        walkTargetRef,
        isWalkingRef,
        isJumpingRef,
        localAvatarMotionStateRef,
        syncingMovePositionRef,
      });
      clearingWalkTarget();
    });
  }, [
    clearingWalkTarget,
    isJumpingRef,
    isWalkingRef,
    localAvatarMotionStateRef,
    playerPositionRef,
    showingGameplayHudToast,
    syncingMovePositionRef,
    teleportingWithScreenFade,
    walkTargetRef,
  ]);

  const teleportingToApprovedFriendPlot = useCallback(
    async (
      plotBounds: DefiningWorldBuildingPlotBounds,
      requestId: string
    ): Promise<void> => {
      await teleportingWithScreenFade(() => {
        applyingWorldPlazaPlayerTeleportToWorldPoint({
          destinationWorldPoint:
            resolvingWorldPlazaWorldPointNearPlotBoundsForTeleport(
              plotBounds,
              placedBlocksRef.current.blocks
            ),
          placedBlocks: placedBlocksRef.current.blocks,
          playerPositionRef,
          walkTargetRef,
          isWalkingRef,
          isJumpingRef,
          localAvatarMotionStateRef,
          syncingMovePositionRef,
        });
        clearingWalkTarget();
      });

      await acknowledgingWorldPlotVisitRequest(requestId);

      void queryClient.invalidateQueries({
        queryKey: WORLD_PLOT_VISIT_REQUESTS_OUTGOING_QUERY_KEY,
      });
    },
    [
      clearingWalkTarget,
      isJumpingRef,
      isWalkingRef,
      localAvatarMotionStateRef,
      playerPositionRef,
      queryClient,
      syncingMovePositionRef,
      teleportingWithScreenFade,
      walkTargetRef,
    ]
  );

  const {
    chatSnapshot,
    openChat,
    closeChat,
    toggleChat,
    setDraftMessage,
    sendChatMessage,
    sendChatGifMessage,
  } = roomChat;

  isChatOpenRef.current = chatSnapshot.isChatOpen;

  const { isFriendsPanelOpen, closingFriendsPanel, togglingFriendsPanel } =
    usingWorldPlazaFriendsPanelVisibleState();

  const { activeCodexSection, openingCodexSection, closingCodexSection } =
    usingWorldPlazaCodexPanelVisibleState();

  useEffect(() => {
    if (!isPresenceReconnectOverlayVisible) {
      return;
    }

    closeChat();
    closingFriendsPanel();
    closingCodexSection();
  }, [
    closeChat,
    closingFriendsPanel,
    closingCodexSection,
    isPresenceReconnectOverlayVisible,
  ]);

  const wasPlayerDeadRef = useRef(false);

  useEffect(() => {
    if (!isPlayerDead) {
      wasPlayerDeadRef.current = false;
      return;
    }

    if (wasPlayerDeadRef.current) {
      return;
    }

    wasPlayerDeadRef.current = true;
    clearingWalkTarget();
    closeChat();
    closingFriendsPanel();
    closingCodexSection();
  }, [
    clearingWalkTarget,
    closeChat,
    closingFriendsPanel,
    closingCodexSection,
    isPlayerDead,
  ]);

  useEffect(() => {
    if (!isPlayerDead) {
      return;
    }

    const respawnTimeoutId = window.setTimeout(() => {
      respawnRef.current?.();
      resettingHungerRef.current?.();
      clearingWalkTarget();
      hostRef.current?.focus();
    }, DEFINING_WORLD_PLAZA_ENTITY_DEATH_AUTO_RESPAWN_MS);

    return () => {
      window.clearTimeout(respawnTimeoutId);
    };
  }, [clearingWalkTarget, isPlayerDead]);

  const handlingPresenceReconnect = useCallback((): void => {
    reconnectingPresence();
    hostRef.current?.focus();
  }, [reconnectingPresence]);

  const {
    trackedFriendUserId,
    togglingFriendTracking,
    clearingFriendTracking,
  } = usingWorldPlazaFriendTrackingState();

  useEffect(() => {
    if (!trackedFriendUserId || !roomSnapshot.isJoined) {
      return;
    }

    const isTrackedFriendInRoom = roomSnapshot.remotePlayers.some(
      (remotePlayer) => remotePlayer.userId === trackedFriendUserId
    );

    if (!isTrackedFriendInRoom) {
      clearingFriendTracking();
    }
  }, [
    clearingFriendTracking,
    roomSnapshot.isJoined,
    roomSnapshot.remotePlayers,
    trackedFriendUserId,
  ]);

  const isPlazaSocialEnabled = roomSnapshot.isJoined;

  usingWorldPlazaFriendsPanelKeyboardShortcuts({
    isEnabled:
      onlineUserId !== null && isPlazaSocialEnabled && !isEditSessionActive,
    isFriendsPanelOpen,
    isChatOpen: chatSnapshot.isChatOpen,
    closeChat,
    closingFriendsPanel,
    togglingFriendsPanel,
  });

  const { data: pendingFriendRequestCount = 0 } =
    usingUserProfileFriendRequestsPendingCount({
      enabled: onlineUserId !== null && roomSnapshot.isJoined,
      polling: onlineUserId !== null && roomSnapshot.isJoined,
    });

  const {
    activeFriendRequestDialog,
    acceptingFriendRequestDialog,
    decliningFriendRequestDialog,
    dismissingFriendRequestDialogLater,
    isRespondingToFriendRequestDialog,
  } = usingUserProfileFriendRequestPlazaDialogs({
    enabled: onlineUserId !== null && roomSnapshot.isJoined,
    currentUserId: onlineUserId,
  });

  const {
    activeVisitRequestDialog,
    approvingVisitRequestDialog,
    decliningVisitRequestDialog,
    dismissingVisitRequestDialogLater,
    isRespondingToVisitRequestDialog,
  } = usingWorldPlotVisitRequestHostPlazaDialogs({
    enabled:
      onlineUserId !== null &&
      roomSnapshot.isJoined &&
      activeFriendRequestDialog === null,
    currentUserId: onlineUserId,
  });

  const {
    activeApprovedVisitDialog,
    dismissingApprovedVisitDialogLater,
    isAcknowledgingApprovedVisitDialog,
  } = usingWorldPlotVisitRequestApprovedPlazaDialogs({
    enabled:
      onlineUserId !== null &&
      roomSnapshot.isJoined &&
      activeFriendRequestDialog === null &&
      activeVisitRequestDialog === null,
    currentUserId: onlineUserId,
  });

  const {
    activeFriendPlazaNotification,
    acknowledgingFriendPlazaNotification,
    isAcknowledgingFriendPlazaNotification,
  } = usingUserProfileFriendPlazaNotifications({
    enabled:
      onlineUserId !== null &&
      roomSnapshot.isJoined &&
      activeFriendRequestDialog === null &&
      activeVisitRequestDialog === null &&
      activeApprovedVisitDialog === null,
    currentUserId: onlineUserId,
    polling: onlineUserId !== null && roomSnapshot.isJoined,
  });

  const togglingChatFromActionBar = useCallback((): void => {
    if (!chatSnapshot.isChatOpen) {
      closingFriendsPanel();
    }
    toggleChat();
  }, [chatSnapshot.isChatOpen, closingFriendsPanel, toggleChat]);

  const togglingFriendsFromActionBar = useCallback((): void => {
    if (!isFriendsPanelOpen) {
      closeChat();
    }
    togglingFriendsPanel();
  }, [closeChat, isFriendsPanelOpen, togglingFriendsPanel]);

  const selectingCodexSectionFromActionBar = useCallback(
    (section: WorldPlazaCodexSectionId): void => {
      closeChat();
      closingFriendsPanel();
      openingCodexSection(section);
    },
    [closeChat, closingFriendsPanel, openingCodexSection]
  );

  const requestingFriendPlotVisit = useCallback(
    (
      hostUserId: string,
      hostDisplayName: string,
      bounds: DefiningWorldBuildingPlotBounds
    ): void => {
      createPlotVisitRequestMutation.mutate({
        hostUserId,
        hostDisplayName,
        bounds,
      });
    },
    [createPlotVisitRequestMutation]
  );

  const teleportingToApprovedFriendPlotFromClaimList = useCallback(
    (bounds: DefiningWorldBuildingPlotBounds, requestId: string): void => {
      void teleportingToApprovedFriendPlot(bounds, requestId);
    },
    [teleportingToApprovedFriendPlot]
  );

  const goingToApprovedVisitFromDialog = useCallback((): void => {
    if (!activeApprovedVisitDialog || isAcknowledgingApprovedVisitDialog) {
      return;
    }

    void teleportingToApprovedFriendPlot(
      activeApprovedVisitDialog.bounds,
      activeApprovedVisitDialog.requestId
    ).then(() => {
      dismissingApprovedVisitDialogLater();
    });
  }, [
    activeApprovedVisitDialog,
    dismissingApprovedVisitDialogLater,
    isAcknowledgingApprovedVisitDialog,
    teleportingToApprovedFriendPlot,
  ]);

  const syncingCharacterFacingOnline = useCallback((): void => {
    syncingMovePositionRef.current?.();
  }, [syncingMovePositionRef]);

  const {
    characterFacingDirectionRef,
    isTurnPointerHeldRef,
    handlingCharacterFacingPointerDown,
    handlingCharacterFacingPointerMove,
    handlingCharacterFacingPointerRelease,
  } = trackingWorldPlazaCharacterFacingRotationInput({
    isEnabled: isLocalGameplayEnabled,
    isChatOpenRef,
    viewportFrameRef,
    cameraOffsetRef,
    viewportSizeRef: pixiViewportSizeRef,
    cameraWorldZoomRef,
    playerPositionRef,
    isWalkingRef,
    isJumpingRef,
    onFacingChanged: syncingCharacterFacingOnline,
  });

  useEffect(() => {
    const executingPendingInventoryDropCallbacks = (): void => {
      syncingMovePositionRef.current?.();
      inventoryDropPlacement.executingPendingDropIfInRange();
    };

    onWalkArrivedRef.current = executingPendingInventoryDropCallbacks;
    onWalkStepRef.current = executingPendingInventoryDropCallbacks;
  }, [
    inventoryDropPlacement.executingPendingDropIfInRange,
    syncingMovePositionRef,
  ]);

  useEffect(() => {
    if (chatSnapshot.isChatOpen) {
      clearingWalkTarget();
    }
  }, [chatSnapshot.isChatOpen, clearingWalkTarget]);

  const typingUsersWithoutActiveBubble = useMemo(() => {
    if (chatSnapshot.typingUsers.length === 0) {
      return chatSnapshot.typingUsers;
    }

    const userIdsWithBubble = new Set(
      chatSnapshot.bubbles.map((bubble) => bubble.userId)
    );

    return chatSnapshot.typingUsers.filter(
      (typingUser) => !userIdsWithBubble.has(typingUser.userId)
    );
  }, [chatSnapshot.bubbles, chatSnapshot.typingUsers]);

  const playerNameLabelEntries =
    useMemo((): RenderingWorldPlazaPlayerNameLabelEntry[] => {
      if (!onlineUserId) {
        return [];
      }

      const localPosition = playerPositionRef.current;
      const entries: RenderingWorldPlazaPlayerNameLabelEntry[] = [
        {
          userId: onlineUserId,
          displayName: onlineDisplayName,
          profileStatusKind: onlineProfileStatusKind,
          avatarUrl: onlineAvatarUrl,
          anchorGridX: localPosition.x,
          anchorGridY: localPosition.y,
        },
      ];

      if (!roomSnapshot.isJoined) {
        return entries;
      }

      for (const remotePlayer of roomSnapshot.remotePlayers) {
        entries.push({
          userId: remotePlayer.userId,
          displayName: remotePlayer.displayName,
          profileStatusKind:
            parsingWorldPlazaUserProfileStatusKindForNetworkSync(
              remotePlayer.profileStatusKind
            ),
          avatarUrl: parsingWorldPlazaUserProfileAvatarUrlForNetworkSync(
            remotePlayer.avatarUrl
          ),
          anchorGridX: remotePlayer.x,
          anchorGridY: remotePlayer.y,
        });
      }

      return entries;
    }, [
      onlineDisplayName,
      onlineAvatarUrl,
      onlineProfileStatusKind,
      onlineUserId,
      roomSnapshot.isJoined,
      roomSnapshot.remotePlayers,
    ]);

  const playerHealthBarEntries =
    useMemo((): RenderingWorldPlazaEntityHealthBarEntry[] => {
      if (!isLocalGameplayEnabled) {
        return [];
      }

      const localPosition = playerPositionRef.current;
      const entries: RenderingWorldPlazaEntityHealthBarEntry[] = [
        {
          userId: localHealthEntityUserId,
          anchorGridX: localPosition.x,
          anchorGridY: localPosition.y,
          currentHealth: playerHealthHudSnapshot.currentHealth,
          effectiveMaxHealth: playerHealthHudSnapshot.effectiveMaxHealth,
          shieldPoints: playerHealthHudSnapshot.shieldPoints,
          isInvincible: playerHealthHudSnapshot.isInvincible,
          isDamageFlashing: playerHealthHudSnapshot.isDamageFlashing,
          displayName: shouldShowLocalPlayerNameLabel
            ? onlineDisplayName
            : null,
          avatarUrl: shouldShowLocalPlayerNameLabel ? onlineAvatarUrl : null,
          profileStatusKind: shouldShowLocalPlayerNameLabel
            ? onlineProfileStatusKind
            : null,
        },
      ];

      if (!onlineUserId || !roomSnapshot.isJoined) {
        return entries;
      }

      for (const remotePlayer of roomSnapshot.remotePlayers) {
        entries.push({
          userId: remotePlayer.userId,
          anchorGridX: remotePlayer.x,
          anchorGridY: remotePlayer.y,
          currentHealth: remotePlayer.healthCurrent,
          effectiveMaxHealth: remotePlayer.healthEffectiveMax,
          shieldPoints: remotePlayer.shieldPoints,
          isInvincible: remotePlayer.isInvincible,
          displayName: remotePlayer.displayName,
          avatarUrl: parsingWorldPlazaUserProfileAvatarUrlForNetworkSync(
            remotePlayer.avatarUrl
          ),
          profileStatusKind:
            parsingWorldPlazaUserProfileStatusKindForNetworkSync(
              remotePlayer.profileStatusKind
            ),
        });
      }

      return entries;
    }, [
      isLocalGameplayEnabled,
      localHealthEntityUserId,
      onlineAvatarUrl,
      onlineDisplayName,
      onlineProfileStatusKind,
      onlineUserId,
      shouldShowLocalPlayerNameLabel,
      playerHealthHudSnapshot.currentHealth,
      playerHealthHudSnapshot.effectiveMaxHealth,
      playerHealthHudSnapshot.shieldPoints,
      playerHealthHudSnapshot.isInvincible,
      playerHealthHudSnapshot.isDamageFlashing,
      roomSnapshot.isJoined,
      roomSnapshot.remotePlayers,
    ]);

  const savingCoordsAtHoverTile = useCallback((): void => {
    if (!hoverTilePosition) {
      return;
    }

    savingCoordsAtTilePosition(hoverTilePosition);
  }, [hoverTilePosition, savingCoordsAtTilePosition]);

  const savingCoordsAtSelectedSaveCoordsTile = useCallback((): void => {
    if (!saveCoordsSelectedTilePosition) {
      return;
    }

    savingCoordsAtTilePosition(saveCoordsSelectedTilePosition);
    closingSaveCoordsTilePopover();
  }, [
    closingSaveCoordsTilePopover,
    saveCoordsSelectedTilePosition,
    savingCoordsAtTilePosition,
  ]);

  const handlingPlazaHostPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      if (isChatOpenRef.current) {
        hostRef.current?.focus();
        return;
      }

      if (
        event.target instanceof Element &&
        event.target.closest(`[${DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE}]`)
      ) {
        hostRef.current?.focus();
        return;
      }

      if (isEditSessionActiveRef.current && viewportFrameRef.current) {
        const hoverTile =
          projectingWorldBuildingTilePositionFromViewportPointer(
            event.clientX,
            event.clientY,
            viewportFrameRef.current,
            cameraOffsetRef.current,
            pixiViewportSizeRef.current,
            cameraWorldZoomRef.current
          );

        updatingHoverTilePosition(hoverTile);

        if (
          isClaimModeActiveRef.current &&
          event.button ===
            DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_PRIMARY_POINTER_BUTTON &&
          hoverTile
        ) {
          event.preventDefault();
          event.stopPropagation();
          actingOnEditModeTileAtViewport(hoverTile);
          hostRef.current?.focus();
          return;
        }

        if (
          isBlockBuildModeActiveRef.current &&
          event.button ===
            DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_PRIMARY_POINTER_BUTTON &&
          hoverTile
        ) {
          event.preventDefault();
          event.stopPropagation();
          actingOnEditModeTileAtViewport(hoverTile);
          hostRef.current?.focus();
          return;
        }

        if (
          isBlockBuildModeActiveRef.current &&
          event.button ===
            DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_SECONDARY_POINTER_BUTTON &&
          hoverTile
        ) {
          event.preventDefault();
          event.stopPropagation();
          removingBlockAtTile(hoverTile);
          hostRef.current?.focus();
          return;
        }
      }

      if (
        !isEditSessionActiveRef.current &&
        (onlineUserId !== null || isSinglePlayerSession) &&
        viewportFrameRef.current &&
        event.button ===
          DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_SECONDARY_POINTER_BUTTON
      ) {
        const gridPoint = projectingWorldPlazaViewportClientPointToGridPoint(
          event.clientX,
          event.clientY,
          viewportFrameRef.current,
          cameraOffsetRef.current,
          pixiViewportSizeRef.current,
          cameraWorldZoomRef.current
        );

        if (gridPoint) {
          const viewportScreenPoint =
            projectingWorldPlazaViewportClientPointToViewportScreenPoint(
              event.clientX,
              event.clientY,
              viewportFrameRef.current,
              pixiViewportSizeRef.current
            );
          const pointerContext: DefiningWorldPlazaInteractablePointerHitContext =
            {
              gridPoint,
              ...(viewportScreenPoint
                ? {
                    viewportScreenPoint,
                    cameraOffset: cameraOffsetRef.current,
                    cameraWorldZoom: cameraWorldZoomRef.current,
                  }
                : {}),
            };

          if (handlingInteractableBlockPointerDown(pointerContext)) {
            event.preventDefault();
            event.stopPropagation();
            hostRef.current?.focus();
            return;
          }
        }

        clearingInteractableBlockClickSelection();

        const hoverTile = gridPoint
          ? snappingWorldBuildingTilePositionFromGridPoint(gridPoint)
          : null;

        if (hoverTile) {
          const clickedBlock = findingWorldBuildingPlacedBlockAtTileIndex(
            hoverTile.tileX,
            hoverTile.tileY,
            activeScenePlacedBlocks
          );

          if (
            clickedBlock?.definitionId ===
            DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE
          ) {
            return;
          }

          void attemptingFlintIgnitionAtTile(hoverTile);
        }
      }

      if (
        !isEditSessionActiveRef.current &&
        isLocalGameplayEnabled &&
        viewportFrameRef.current &&
        event.button ===
          DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_PRIMARY_POINTER_BUTTON
      ) {
        const gridPoint = projectingWorldPlazaViewportClientPointToGridPoint(
          event.clientX,
          event.clientY,
          viewportFrameRef.current,
          cameraOffsetRef.current,
          pixiViewportSizeRef.current,
          cameraWorldZoomRef.current
        );

        if (gridPoint) {
          const viewportScreenPoint =
            projectingWorldPlazaViewportClientPointToViewportScreenPoint(
              event.clientX,
              event.clientY,
              viewportFrameRef.current,
              pixiViewportSizeRef.current
            );
          const pointerContext: DefiningWorldPlazaInteractablePointerHitContext =
            {
              gridPoint,
              ...(viewportScreenPoint
                ? {
                    viewportScreenPoint,
                    cameraOffset: cameraOffsetRef.current,
                    cameraWorldZoom: cameraWorldZoomRef.current,
                  }
                : {}),
            };

          if (handlingInteractableBlockPointerDown(pointerContext)) {
            event.preventDefault();
            event.stopPropagation();
            hostRef.current?.focus();
            return;
          }
        }

        clearingInteractableBlockClickSelection();

        const hoverTile = gridPoint
          ? snappingWorldBuildingTilePositionFromGridPoint(gridPoint)
          : null;

        if (handlingSaveCoordsDoubleTapPointerDown(event, hoverTile)) {
          event.preventDefault();
          event.stopPropagation();
          hostRef.current?.focus();
          return;
        }
      }

      handlingCharacterFacingPointerDown(event);

      if (isTurnPointerHeldRef.current) {
        hostRef.current?.focus();
        return;
      }

      handlingPlazaPointerDown(event);
      syncingMovePositionRef.current?.();
      hostRef.current?.focus();
    },
    [
      handlingCharacterFacingPointerDown,
      handlingSaveCoordsDoubleTapPointerDown,
      clearingInteractableBlockClickSelection,
      handlingCampfireBlockInteraction,
      handlingInteractableBlockPointerDown,
      handlingPlazaPointerDown,
      actingOnEditModeTileAtViewport,
      removingBlockAtTile,
      onlineUserId,
      isTurnPointerHeldRef,
      syncingMovePositionRef,
      updatingHoverTilePosition,
      activeScenePlacedBlocks,
      attemptingFlintIgnitionAtTile,
      handlingInteractableBlockPointerDown,
      isSinglePlayerSession,
      isLocalGameplayEnabled,
    ]
  );

  const preventingPlazaViewportContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      event.preventDefault();
    },
    []
  );

  const handlingPlazaHostPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      if (isChatOpenRef.current) {
        return;
      }

      if (
        isEditSessionActiveRef.current &&
        !isBuildTilePopoverOpenRef.current &&
        viewportFrameRef.current &&
        !(
          event.target instanceof Element &&
          event.target.closest(`[${DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE}]`)
        )
      ) {
        updatingHoverTilePosition(
          projectingWorldBuildingTilePositionFromViewportPointer(
            event.clientX,
            event.clientY,
            viewportFrameRef.current,
            cameraOffsetRef.current,
            pixiViewportSizeRef.current,
            cameraWorldZoomRef.current
          )
        );
      }

      handlingCharacterFacingPointerMove(event);

      if (isTurnPointerHeldRef.current) {
        return;
      }

      handlingPlazaPointerMove(event);
    },
    [
      handlingCharacterFacingPointerMove,
      handlingPlazaPointerMove,
      isTurnPointerHeldRef,
      updatingHoverTilePosition,
    ]
  );

  const handlingPlazaHostPointerRelease = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      handlingCharacterFacingPointerRelease(event);
      handlingPlazaPointerRelease(event);
    },
    [handlingCharacterFacingPointerRelease, handlingPlazaPointerRelease]
  );

  const handlingPlazaHostKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      if (
        event.key !== DEFINING_WORLD_PLAZA_JUMP_KEY ||
        isChatOpenRef.current
      ) {
        return;
      }

      event.preventDefault();
    },
    []
  );

  const pixiRenderResolution = computingWorldPlazaViewportRenderResolution(
    typeof window === 'undefined' ? 1 : window.devicePixelRatio,
    performanceProfile.renderResolutionMax
  );

  return (
    <div
      ref={hostRef}
      tabIndex={DEFINING_WORLD_PLAZA_FOCUS_TAB_INDEX}
      role="application"
      aria-label={DEFINING_WORLD_PLAZA_ARIA_LABEL}
      onKeyDown={handlingPlazaHostKeyDown}
      onContextMenu={preventingPlazaViewportContextMenu}
      className={
        isFullscreen
          ? DEFINING_WORLD_PLAZA_HOST_FULLSCREEN_CLASS_NAME
          : hostLayout === 'fill'
            ? DEFINING_WORLD_PLAZA_HOST_FILL_CLASS_NAME
            : DEFINING_WORLD_PLAZA_HOST_EMBEDDED_CLASS_NAME
      }
      style={
        isFullscreen
          ? undefined
          : hostLayout === 'fill'
            ? computingWorldPlazaExpandedHostSizeStyle()
            : computingWorldPlazaEmbeddedHostSizeStyle()
      }
    >
      <div
        ref={viewportFrameRef}
        className={DEFINING_WORLD_PLAZA_VIEWPORT_FRAME_CLASS_NAME}
        onPointerDown={handlingPlazaHostPointerDown}
        onPointerMove={handlingPlazaHostPointerMove}
        onPointerUp={handlingPlazaHostPointerRelease}
        onPointerLeave={(event) => {
          handlingPlazaHostPointerRelease(event);
        }}
        onPointerCancel={handlingPlazaHostPointerRelease}
        onContextMenu={preventingPlazaViewportContextMenu}
      >
        <RenderingWorldPlazaBiomeBackdrop
          playerPositionRef={playerPositionRef}
        />
        <RenderingWorldPlazaBiomeMusic playerPositionRef={playerPositionRef} />
        <div className={DEFINING_WORLD_PLAZA_PIXI_STAGE_LAYER_CLASS_NAME}>
          <Application
            preference="webgl"
            resizeTo={viewportFrameRef}
            backgroundAlpha={0}
            width={DEFINING_WORLD_PLAZA_SANDBOX_DEFAULT_WIDTH_PX}
            height={DEFINING_WORLD_PLAZA_SANDBOX_DEFAULT_HEIGHT_PX}
            resolution={pixiRenderResolution}
            autoDensity
            antialias={performanceProfile.antialias}
            extensions={DEFINING_WORLD_PLAZA_PIXI_APPLICATION_EXTENSIONS}
            className={
              SYNCING_WORLD_PLAZA_PIXI_VIEWPORT_FRAME_CANVAS_CLASS_NAME
            }
          >
            <SyncingWorldPlazaPixiViewportFrameResize
              viewportFrameRef={viewportFrameRef}
            />
            {isDevDebugActive ? (
              <ReportingWorldPlazaPixiViewportDebugStatus
                viewportFrameRef={viewportFrameRef}
              />
            ) : null}
            <RenderingWorldPlazaDeclarativeTerrainSync
              playerPositionRef={playerPositionRef}
              cameraWorldZoomRef={cameraWorldZoomRef}
              placedBlocksRef={placedBlocksRef}
              burntGrassTileKeysRef={burntGrassTileKeysRef}
              choppedTreesByTileKeyRef={choppedTreesByTileKeyRef}
              floorLayerRef={terrainFloorLayerRef}
              trunkLayerRef={terrainTrunkLayerRef}
              canopyLayerRef={terrainCanopyLayerRef}
            />
            <RenderingWorldPlazaPlayerNightLightGroundGlow
              floorLayerRef={terrainFloorLayerRef}
              playerPositionRef={playerPositionRef}
              placedBlocksRef={placedBlocksRef}
            />
            <RenderingWorldPlazaLightSourcesGroundGlow
              floorLayerRef={terrainFloorLayerRef}
            />
            <RenderingWorldPlazaLightingDarknessLayer
              worldAnchorLayerRef={terrainFloorLayerRef}
              playerPositionRef={playerPositionRef}
            />
            <RenderingWorldPlazaFireLayer
              entityLayerRef={terrainTrunkLayerRef}
              fireCells={fireCells}
              placedBlocks={activeScenePlacedBlocks}
            />
            <MeasuringWorldPlazaPixiRenderDiagnostics />
            <RenderingWorldPlazaCameraRig
              playerPositionRef={playerPositionRef}
              cameraOffsetRef={cameraOffsetRef}
              viewportSizeRef={pixiViewportSizeRef}
              fullscreenLogicalViewportRef={fullscreenLogicalViewportRef}
              cameraWorldZoomRef={cameraWorldZoomRef}
            >
              <pixiContainer
                sortableChildren={
                  DEFINING_WORLD_PLAZA_TERRAIN_FLOOR_LAYER_SORTABLE_CHILDREN
                }
                zIndex={DEFINING_WORLD_DEPTH_RENDER_PLANE_FLOOR_Z_INDEX}
              >
                <pixiContainer
                  ref={(instance) => {
                    terrainFloorLayerRef.current = instance;
                  }}
                  sortableChildren={
                    DEFINING_WORLD_PLAZA_TERRAIN_FLOOR_LAYER_SORTABLE_CHILDREN
                  }
                  eventMode="none"
                />
                <RenderingWorldPlazaPlacedBlockGroundShadows
                  placedBlocks={activeScenePlacedBlocks}
                  shadowAlphaScale={
                    isClaimModeActive
                      ? DEFINING_WORLD_BUILDING_CLAIM_MODE_PLACED_BLOCK_ALPHA
                      : 1
                  }
                />
                <RenderingWorldPlazaClaimModePlotOwnershipOverlay
                  isVisible={isClaimModeActive}
                  overlayPlots={claimModeOverlayPlots}
                  localUserId={buildModeUserId}
                  plotOwnerLimits={plotOwnerLimits}
                  renderLayer="floor"
                />
                <RenderingWorldPlazaPlotBoundaries
                  isVisible={isBlockBuildModeActive}
                  ownedPlots={buildModeOwnedPlots}
                  renderLayer="floor"
                />
              </pixiContainer>
              <pixiContainer
                sortableChildren={
                  DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_LAYER_SORTABLE_CHILDREN
                }
                zIndex={DEFINING_WORLD_DEPTH_RENDER_PLANE_ENTITY_LAYER_Z_INDEX}
              >
                <pixiContainer
                  ref={(instance) => {
                    terrainTrunkLayerRef.current = instance;
                  }}
                  sortableChildren={
                    DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_LAYER_SORTABLE_CHILDREN
                  }
                  zIndex={
                    DEFINING_WORLD_DEPTH_RENDER_PLANE_ENTITY_AVATAR_SUB_LAYER_Z_INDEX
                  }
                >
                  <RenderingWorldPlazaRemotePlayers
                    remotePlayers={roomSnapshot.remotePlayers}
                    remotePlayerRegistryRef={remotePlayerRegistryRef}
                    playerRenderPositionRegistryRef={
                      playerRenderPositionRegistryRef
                    }
                  />
                  <RenderingWorldPlazaPlacedBlocks
                    placedBlocks={activeScenePlacedBlocks}
                    blockColumnAlpha={
                      isClaimModeActive
                        ? DEFINING_WORLD_BUILDING_CLAIM_MODE_PLACED_BLOCK_ALPHA
                        : 1
                    }
                  />
                  <RenderingWorldPlazaClaimModePlotOwnershipOverlay
                    isVisible={isClaimModeActive}
                    overlayPlots={claimModeOverlayPlots}
                    localUserId={buildModeUserId}
                    plotOwnerLimits={plotOwnerLimits}
                    renderLayer="entity"
                  />
                  <RenderingWorldPlazaPlotBoundaries
                    isVisible={isBlockBuildModeActive}
                    ownedPlots={buildModeOwnedPlots}
                    renderLayer="entity"
                  />
                  <RenderingWorldPlazaGirlSampleWalkAvatar
                    playerPositionRef={playerPositionRef}
                    localUserId={onlineUserId}
                    playerRenderPositionRegistryRef={
                      playerRenderPositionRegistryRef
                    }
                    localPlayerDodgeStateRef={localPlayerDodgeStateRef}
                    walkTargetRef={walkTargetRef}
                    isWalkingRef={isWalkingRef}
                    isRunningRef={isRunningRef}
                    jumpRequestedRef={jumpRequestedRef}
                    tryConsumingJumpStaminaRef={tryConsumingJumpStaminaRef}
                    isJumpingRef={isJumpingRef}
                    localAvatarMotionStateRef={localAvatarMotionStateRef}
                    syncingMovePositionRef={syncingMovePositionRef}
                    onWalkArrivedRef={onWalkArrivedRef}
                    onWalkStepRef={onWalkStepRef}
                    onFallLandedRef={onFallLandedRef}
                    isWalkPausedByCollisionRef={isWalkPausedByCollisionRef}
                    keyboardDirectionRef={keyboardDirectionRef}
                    characterFacingDirectionRef={characterFacingDirectionRef}
                    placedBlocksRef={placedBlocksRef}
                    isRunningOnIceRef={isRunningOnIceRef}
                    isPlayerDeadRef={isPlayerDeadRef}
                    activeToolActionRef={localAvatarToolActionRef}
                    postRespawnInvincibilityUntilMsRef={
                      postRespawnInvincibilityUntilMsRef
                    }
                    healthStateRef={healthStateRef}
                    localTemperatureCelsiusRef={localTemperatureCelsiusRef}
                    hungerMovementMultipliersRef={hungerMovementMultipliersRef}
                    consumingJumpHungerRef={consumingJumpHungerRef}
                  />
                  <RenderingWorldPlazaProjectileVisualLayer
                    renderPlane="ground-sorted"
                    projectileStoreRef={projectileStoreRef}
                    isEnabled={isProjectileEngineEnabled}
                  />
                  <RenderingWorldPlazaTerrainCollisionDebugOverlay
                    playerPositionRef={playerPositionRef}
                    isVisibleRef={isTerrainCollisionDebugVisibleRef}
                    placedBlocksRef={placedBlocksRef}
                  />
                  <RenderingWorldPlazaBlockPlacementPreview
                    isVisible={
                      isEditSessionActive &&
                      (isClaimModeActive || isBuildPlacementSelectionActive)
                    }
                    previewTilePositionRef={previewTilePositionRef}
                    isPreviewTileValidRef={isPreviewTileValidRef}
                    previewWorldLayerRef={previewWorldLayerRef}
                    previewBlockHeightRef={previewBlockHeightRef}
                    previewCutFootprintMaskRef={previewCutFootprintMaskRef}
                    previewCutGridAxisCellCountRef={
                      previewCutGridAxisCellCountRef
                    }
                  />
                  <RenderingWorldPlazaBlockRemovalHoverHighlight
                    isVisible={
                      isBlockBuildModeActive && !isBuildPlacementSelectionActive
                    }
                    hoveredRemovableBlockRef={hoveredRemovableBlockRef}
                  />
                </pixiContainer>
                <pixiContainer
                  ref={(instance) => {
                    terrainCanopyLayerRef.current = instance;
                  }}
                  sortableChildren={
                    DEFINING_WORLD_PLAZA_TERRAIN_CANOPY_LAYER_SORTABLE_CHILDREN
                  }
                  zIndex={
                    DEFINING_WORLD_DEPTH_RENDER_PLANE_ENTITY_CANOPY_SUB_LAYER_Z_INDEX
                  }
                  eventMode="none"
                />
                <pixiContainer
                  sortableChildren={
                    DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_LAYER_SORTABLE_CHILDREN
                  }
                  zIndex={
                    DEFINING_WORLD_DEPTH_RENDER_PLANE_ENTITY_EFFECTS_SUB_LAYER_Z_INDEX
                  }
                  eventMode="none"
                >
                  <RenderingWorldPlazaProjectileSimulation
                    projectileStoreRef={projectileStoreRef}
                    playerPositionRef={playerPositionRef}
                    localPlayerDodgeStateRef={localPlayerDodgeStateRef}
                    localPlayerTargetId={localPlayerProjectileTargetId}
                    healthStateRef={healthStateRef}
                    placedBlocksRef={placedBlocksRef}
                    isEnabled={isProjectileEngineEnabled}
                  />
                  <RenderingWorldPlazaProjectileVisualLayer
                    renderPlane="effects"
                    projectileStoreRef={projectileStoreRef}
                    isEnabled={isProjectileEngineEnabled}
                  />
                  <RenderingWorldPlazaClickArrowEffect
                    clickArrowEffectRef={clickArrowEffectRef}
                  />
                  <RenderingWorldPlazaInventoryDropTileOutlinePreview
                    dropMarkerTileRef={inventoryDropPlacement.dropMarkerTileRef}
                  />
                </pixiContainer>
              </pixiContainer>
            </RenderingWorldPlazaCameraRig>
          </Application>
        </div>

        <RenderingWorldPlazaDayNightOverlay />

        <RenderingWorldPlazaGameplayHud>
          <RenderingWorldPlazaPresenceReconnectOverlay
            isVisible={isPresenceReconnectOverlayVisible}
            disconnectReason={presenceDisconnectReason}
            onReconnect={handlingPresenceReconnect}
          />
          <RenderingWorldPlazaEntityDeathScreenOverlay
            isPlayerDead={isLocalGameplayEnabled && isPlayerDead}
            deathTitle={deathScreenTitle}
          />
          <RenderingWorldPlazaMobileLandscapePrompt
            isVisible={shouldShowLandscapePrompt}
          />
          <RenderingWorldPlazaMiniMapStack
            playerPositionRef={playerPositionRef}
            playerRenderPositionRegistryRef={playerRenderPositionRegistryRef}
            isWalkingRef={isWalkingRef}
            isRunningRef={isRunningRef}
            localUserId={onlineUserId}
            isFullscreen={hudIsFullscreen}
            ownedPlotsRef={ownedPlotsRef}
            localTemperatureCelsius={
              playerHealthHudSnapshot.localTemperatureCelsius
            }
            temperatureDisplayUnit={
              playerHealthHudSnapshot.temperatureDisplayUnit
            }
            isTemperatureVisible={
              isLocalGameplayEnabled && !isEditSessionActive
            }
            viewportHudScale={viewportHudScale}
            isInventoryHotbarVisible={
              isLocalGameplayEnabled && !isEditSessionActive
            }
          />
          {isLocalGameplayEnabled ? (
            <RenderingWorldPlazaStaminaBar isMobile={hudIsMobile} />
          ) : null}
          {isLocalGameplayEnabled ? (
            <RenderingWorldPlazaGameplayHudToast
              snapshot={gameplayHudToastSnapshot}
            />
          ) : null}
          {isLocalGameplayEnabled && !isEditSessionActive ? (
            <RenderingWorldPlazaEntityStatusEffectStack
              statusEffectHudRows={playerHealthHudSnapshot.statusEffectHudRows}
              hasOnlineRoomHud={isOnlineRoomEnabled}
              viewportHudScale={viewportHudScale}
            />
          ) : null}
          {isLocalGameplayEnabled && hudIsMobile && !isEditSessionActive ? (
            <RenderingWorldPlazaMobileJumpButton
              jumpRequestedRef={jumpRequestedRef}
              isJumpingRef={isJumpingRef}
              isChatOpen={chatSnapshot.isChatOpen}
              viewportHudScale={viewportHudScale}
            />
          ) : null}
          {isDevEnvironment ? (
            <RenderingWorldPlazaDevModePanel
              isOpen={isDevModePanelOpen}
              onToggle={togglingDevModePanel}
              onClose={closingDevModePanel}
              hasStaminaBar={false}
              isBuildModeActive={isBuildModeActive}
              playerPositionRef={playerPositionRef}
              isBlockBuildModeActive={isBlockBuildModeActive}
              selectedWorldLayer={selectedWorldLayer}
              previewWorldLayer={previewWorldLayer}
              hasBuildPreviewTile={Boolean(previewTilePosition)}
              selectedBlockHeight={selectedBlockHeight}
              previewBlockHeight={previewBlockHeight}
              isTerrainCollisionDebugVisible={isTerrainCollisionDebugVisible}
              onToggleTerrainCollisionDebug={
                togglingTerrainCollisionDebugVisible
              }
              isPerformanceDiagnosticsFeatureAvailable={
                isPerformanceDiagnosticsFeatureAvailable
              }
              isPerformanceDiagnosticsVisible={isPerformanceDiagnosticsVisible}
              onTogglePerformanceDiagnostics={
                togglingPerformanceDiagnosticsVisible
              }
              isAvatarSkinSelectorVisible={isAvatarSkinSelectorVisible}
              onToggleAvatarSkinSelector={togglingAvatarSkinSelectorVisible}
              isFeaturesDebugVisible={isFeaturesDebugVisible}
              onToggleFeaturesDebug={togglingFeaturesDebugVisible}
              healthHudSnapshot={playerHealthHudSnapshot}
              onHealthDamage={() => takeDamageRef.current?.(10)}
              onHealthHeal={() => healRef.current?.(10)}
              onHealthApplyPoison={(potency) =>
                applyPoisonRef.current?.(potency)
              }
              onHealthApplyBleed={(severity) =>
                applyBleedRef.current?.(severity)
              }
              onHealthApplyPotentialDamage={() =>
                applyPotentialDamageRef.current?.()
              }
              onHealthShield={() => addShieldRef.current?.(25)}
              onHealthToggleInvincible={() => toggleInvincibleRef.current?.()}
              onHealthToggleTemperatureDisplayUnit={() =>
                toggleTemperatureDisplayUnitRef.current?.()
              }
              onHealthRollDamage={(expectedDamage, forcedTier) =>
                rollDamageRef.current?.(expectedDamage, forcedTier)
              }
              onHealthToggleBuff={(buffId) => toggleBuffRef.current?.(buffId)}
              characterSkillIds={selectedCharacterEngineDefinition.skillIds}
              onUseCharacterSkill={(skillId) => {
                tryUsingCharacterSkillRef.current?.(skillId, performance.now());
              }}
              onHealthKill={() => killRef.current?.()}
              onHealthRevive={() => reviveRef.current?.()}
              onSpawnProjectile={(request) => {
                spawnProjectileRef.current?.(request);
              }}
              onlineUserId={onlineUserId}
              onTeleportToFirelands={teleportingPlayerToFirelands}
            />
          ) : null}
          <RenderingWorldPlazaSavedCoordsDirectionArrowOverlay
            isVisible={trackedSavedCoords !== null}
            savedCoords={trackedSavedCoords}
            playerPositionRef={playerPositionRef}
            cameraOffsetRef={cameraOffsetRef}
            cameraWorldZoomRef={cameraWorldZoomRef}
          />
          <RenderingWorldPlazaSavedCoordsTileStarMarkers
            trackedSavedCoords={trackedSavedCoords}
            cameraOffsetRef={cameraOffsetRef}
            cameraWorldZoomRef={cameraWorldZoomRef}
          />
          <RenderingWorldPlazaFriendTrackingDirectionArrowOverlay
            trackedFriendUserId={trackedFriendUserId}
            remotePlayerRegistryRef={remotePlayerRegistryRef}
            playerPositionRef={playerPositionRef}
            cameraOffsetRef={cameraOffsetRef}
            cameraWorldZoomRef={cameraWorldZoomRef}
          />
          {isLocalGameplayEnabled ? (
            <>
              <RenderingWorldPlazaEntityHealthBars
                healthBarEntries={playerHealthBarEntries}
                localUserId={localHealthEntityUserId}
                localHudSnapshot={playerHealthHudSnapshot}
                localStaminaHud={{
                  staminaRatio,
                  isRunning: isRunningHud,
                  isDepleted: isStaminaDepleted,
                }}
                playerPositionRef={playerPositionRef}
                remotePlayerRegistryRef={remotePlayerRegistryRef}
                playerRenderPositionRegistryRef={
                  playerRenderPositionRegistryRef
                }
                remotePlayers={roomSnapshot.remotePlayers}
                cameraOffsetRef={cameraOffsetRef}
                cameraWorldZoomRef={cameraWorldZoomRef}
              />
              <RenderingWorldPlazaEntityHealthFloatTexts
                localUserId={localHealthEntityUserId}
                anchorGridX={playerPositionRef.current.x}
                anchorGridY={playerPositionRef.current.y}
                floatingTexts={playerHealthHudSnapshot.floatingTexts}
                playerPositionRef={playerPositionRef}
                remotePlayerRegistryRef={remotePlayerRegistryRef}
                playerRenderPositionRegistryRef={
                  playerRenderPositionRegistryRef
                }
                remotePlayers={roomSnapshot.remotePlayers}
                cameraOffsetRef={cameraOffsetRef}
                cameraWorldZoomRef={cameraWorldZoomRef}
              />
              {!isEditSessionActive ? (
                <RenderingWorldPlazaCampfireInteractionLabels
                  placedBlocks={activeScenePlacedBlocks}
                  fireCells={fireCells}
                  selectedInteractableBlockKeysRef={
                    selectedInteractableBlockKeysRef
                  }
                  cameraOffsetRef={cameraOffsetRef}
                  cameraWorldZoomRef={cameraWorldZoomRef}
                  onInteractWithCampfire={handlingCampfireBlockInteraction}
                />
              ) : null}
              {!isEditSessionActive ? (
                <RenderingWorldPlazaTreeInteractionLabels
                  placedBlocks={activeScenePlacedBlocks}
                  selectedInteractableBlockKeysRef={
                    selectedInteractableBlockKeysRef
                  }
                  choppedTreeStateByTileKeyRef={choppedTreesByTileKeyRef}
                  timedInteractionProgressSnapshot={treeChopProgressSnapshot}
                  timedInteractionProgressRatioRef={treeChopProgressRatioRef}
                  cameraOffsetRef={cameraOffsetRef}
                  cameraWorldZoomRef={cameraWorldZoomRef}
                  onChopTree={handlingTreeChopInteraction}
                />
              ) : null}
            </>
          ) : null}
          {onlineUserId ? (
            <>
              {!isLocalGameplayEnabled ? (
                <RenderingWorldPlazaPlayerNameLabels
                  nameLabelEntries={playerNameLabelEntries}
                  localUserId={onlineUserId}
                  playerPositionRef={playerPositionRef}
                  remotePlayerRegistryRef={remotePlayerRegistryRef}
                  playerRenderPositionRegistryRef={
                    playerRenderPositionRegistryRef
                  }
                  remotePlayers={roomSnapshot.remotePlayers}
                  cameraOffsetRef={cameraOffsetRef}
                  cameraWorldZoomRef={cameraWorldZoomRef}
                />
              ) : null}
              {roomSnapshot.isJoined ? (
                <>
                  <RenderingWorldPlazaRoomTypingIndicators
                    typingUsers={typingUsersWithoutActiveBubble}
                    localUserId={onlineUserId}
                    playerPositionRef={playerPositionRef}
                    remotePlayerRegistryRef={remotePlayerRegistryRef}
                    playerRenderPositionRegistryRef={
                      playerRenderPositionRegistryRef
                    }
                    remotePlayers={roomSnapshot.remotePlayers}
                    cameraOffsetRef={cameraOffsetRef}
                    cameraWorldZoomRef={cameraWorldZoomRef}
                  />
                  <RenderingWorldPlazaRoomChatBubbles
                    bubbles={chatSnapshot.bubbles}
                    localUserId={onlineUserId}
                    playerPositionRef={playerPositionRef}
                    remotePlayerRegistryRef={remotePlayerRegistryRef}
                    playerRenderPositionRegistryRef={
                      playerRenderPositionRegistryRef
                    }
                    remotePlayers={roomSnapshot.remotePlayers}
                    cameraOffsetRef={cameraOffsetRef}
                    cameraWorldZoomRef={cameraWorldZoomRef}
                  />
                </>
              ) : null}
            </>
          ) : null}
          {onlineUserId ? (
            <>
              <RenderingWorldPlazaActionBar
                isVisible
                isSocialEnabled={isPlazaSocialEnabled && !isEditSessionActive}
                isEditEnabled
                isFullscreenSupported={isFullscreenSupported}
                isChatOpen={chatSnapshot.isChatOpen}
                isFriendsOpen={isFriendsPanelOpen}
                pendingFriendRequestCount={pendingFriendRequestCount}
                isClaimModeActive={isClaimModeActive}
                isBuildModeActive={isBlockBuildModeActive}
                isFullscreen={isFullscreen}
                isFullscreenViewport={hudIsFullscreen}
                viewportHudScale={viewportHudScale}
                isMobile={hudIsMobile}
                onExitToHome={onExitToHome}
                onToggleChat={togglingChatFromActionBar}
                onToggleFriends={togglingFriendsFromActionBar}
                onSelectCodexSection={selectingCodexSectionFromActionBar}
                onToggleClaimMode={togglingClaimMode}
                onToggleBuildMode={togglingBuildMode}
                onToggleFullscreen={() => {
                  void togglingViewportFullscreen({
                    shouldLockLandscapeOrientation: isMobile,
                  });
                }}
                inlineChatSlot={
                  !isEditSessionActive && isPlazaSocialEnabled ? (
                    <RenderingWorldPlazaRoomChatPanel
                      chatSnapshot={chatSnapshot}
                      isEnabled={isPlazaSocialEnabled}
                      focusContainerRef={hostRef}
                      onOpenChat={openChat}
                      onCloseChat={closeChat}
                      onDraftChange={setDraftMessage}
                      onSendMessage={sendChatMessage}
                      onSendGif={sendChatGifMessage}
                      viewportHudScale={viewportHudScale}
                    />
                  ) : null
                }
              />
              {!isEditSessionActive ? (
                <RenderingWorldPlazaInventoryHotbar
                  onlineUserId={onlineUserId}
                  viewportHudScale={viewportHudScale}
                  inventoryDropPlacement={inventoryDropPlacement}
                  selectedSlotIndex={equipment.selectedSlotIndex}
                  onSelectHotbarSlot={equipment.selectingHotbarSlot}
                  onEatHotbarSlot={handlingEatHotbarSlot}
                  hungerHud={hungerHudSnapshot}
                />
              ) : null}
              {!isEditSessionActive ? (
                <>
                  <RenderingWorldPlazaGroundItems
                    onlineUserId={onlineUserId}
                    playerPositionRef={playerPositionRef}
                    cameraOffsetRef={cameraOffsetRef}
                    cameraWorldZoomRef={cameraWorldZoomRef}
                    viewportHudScale={viewportHudScale}
                  />
                  <RenderingWorldPlazaInventoryDropArrowOverlay
                    dropMarkerTileRef={inventoryDropPlacement.dropMarkerTileRef}
                    cameraOffsetRef={cameraOffsetRef}
                    cameraWorldZoomRef={cameraWorldZoomRef}
                    viewportHudScale={viewportHudScale}
                  />
                </>
              ) : null}
              {!isEditSessionActive ? (
                <RenderingWorldPlazaFriendsPanel
                  isEnabled={isPlazaSocialEnabled}
                  isOpen={isFriendsPanelOpen}
                  onClose={closingFriendsPanel}
                  localUserId={onlineUserId}
                  plazaOnlineParticipants={roomSnapshot.onlineParticipants}
                  trackedFriendUserId={trackedFriendUserId}
                  onToggleTrackFriend={togglingFriendTracking}
                />
              ) : null}
            </>
          ) : null}
          {buildModeUserId ? (
            <>
              <RenderingWorldPlazaClaimModePanel
                isClaimModeActive={isClaimModeActive}
                hasUnsavedClaimChanges={hasUnsavedBuildChanges}
                isSavingClaimDraft={isSavingBuildDraft}
                claimErrorMessage={buildErrorMessage}
                ownerGroups={claimModeOwnerGroups}
                activeViewportPlots={activeViewportPlots}
                localUserId={buildModeUserId}
                localOwnedPlotCount={claimModeLocalOwnedPlotCount}
                localTileClaimCount={claimModeLocalTileClaimCount}
                plotOwnerLimits={plotOwnerLimits}
                isPlotRegistryLoading={isClaimModePlotRegistryLoading}
                plotRegistryErrorMessage={claimModePlotRegistryErrorMessage}
                onToggleClaimMode={togglingClaimMode}
                onTeleportToPlotBounds={teleportingPlayerToPlotBounds}
                onRequestingFriendPlotVisit={requestingFriendPlotVisit}
                onTeleportingToApprovedFriendPlot={
                  teleportingToApprovedFriendPlotFromClaimList
                }
                outgoingVisitRequests={outgoingVisitRequests}
                isRequestingFriendPlotVisit={
                  createPlotVisitRequestMutation.isPending
                }
                onRemoveTemporaryPlotAtTile={handlingRemoveTemporaryPlotAtTile}
                isRemovingTemporaryPlot={isRemovingTemporaryPlot}
                savedCoordsList={savedCoordsList}
                trackedSavedCoordsId={trackedSavedCoordsId}
                onToggleSavedCoordsTracking={togglingSavedCoordsTracking}
                onDeleteSavedCoords={deletingSavedCoords}
                isDeletingSavedCoords={isDeletingSavedCoords}
                onSaveClaimDraft={() => {
                  void savingBuildDraft().then(() =>
                    refetchingClaimModePlotRegistry()
                  );
                }}
              />
              {isBlockBuildModeActive ? (
                <RenderingWorldPlazaBuildModeHotbar
                  isVisible
                  selectedDefinitionId={selectedDefinitionId}
                  selectedWorldLayer={selectedWorldLayer}
                  selectedBlockHeight={selectedBlockHeight}
                  isPresetBlockTypeSelected={isPresetBlockTypeSelected}
                  selectedCutFootprintMask={selectedCutFootprintMask}
                  selectedCutGridAxisCellCount={selectedCutGridAxisCellCount}
                  buildErrorMessage={buildErrorMessage}
                  isSavingBuildDraft={isSavingBuildDraft}
                  onSelectDefinition={selectingBlockDefinition}
                  onSelectWorldLayer={selectingWorldLayer}
                  onSelectBlockHeight={selectingBlockHeight}
                  onSelectCutFootprintMask={selectingCutFootprintMask}
                  onSelectCutGridAxisCellCount={selectingCutGridAxisCellCount}
                />
              ) : null}
              {isClaimModeActive ? (
                <RenderingWorldPlazaClaimModeHotbar
                  isVisible
                  localOwnedPlotCount={claimModeLocalOwnedPlotCount}
                  localTileClaimCount={claimModeLocalTileClaimCount}
                  plotOwnerLimits={plotOwnerLimits}
                  hoverTilePosition={hoverTilePosition}
                  claimErrorMessage={buildErrorMessage}
                  isSavingClaimDraft={isSavingBuildDraft}
                  isSavingCoords={isSavingCoords}
                  canSaveMoreCoords={canSaveMoreCoords}
                  onSaveCoordsAtHoverTile={savingCoordsAtHoverTile}
                />
              ) : null}
              {!isEditSessionActive && onlineUserId ? (
                <RenderingWorldPlazaSaveCoordsTilePopover
                  isOpen={isSaveCoordsTilePopoverOpen}
                  selectedTilePositionRef={saveCoordsSelectedTilePositionRef}
                  cameraOffsetRef={cameraOffsetRef}
                  cameraWorldZoomRef={cameraWorldZoomRef}
                  isSavingCoords={isSavingCoords}
                  canSaveMoreCoords={canSaveMoreCoords}
                  onSaveCoords={savingCoordsAtSelectedSaveCoordsTile}
                />
              ) : null}
              <RenderingWorldPlazaBuildModeDiscardDialog
                isOpen={isDiscardBuildDraftDialogOpen}
                onKeepBuilding={cancelingBuildDraftDiscard}
                onConfirmDiscard={confirmingBuildDraftDiscard}
              />
            </>
          ) : null}
          {onlineUserId ? (
            <RenderingWorldPlazaRoomStatusHud
              roomSnapshot={roomSnapshot}
              localUserId={onlineUserId}
              maxPlayers={onlineMaxPlayers}
              isHidden={isEditSessionActive}
            />
          ) : null}
          {isSinglePlayerSession ? (
            <>
              <RenderingWorldPlazaActionBar
                isVisible
                isSocialEnabled={false}
                isEditEnabled={isBuildModeEnabled}
                isFullscreenSupported={isFullscreenSupported}
                isChatOpen={false}
                isFriendsOpen={false}
                isClaimModeActive={isClaimModeActive}
                isBuildModeActive={isBlockBuildModeActive}
                isFullscreen={isFullscreen}
                isFullscreenViewport={hudIsFullscreen}
                viewportHudScale={viewportHudScale}
                isMobile={hudIsMobile}
                onExitToHome={onExitToHome}
                onToggleChat={() => undefined}
                onToggleFriends={() => undefined}
                onSelectCodexSection={selectingCodexSectionFromActionBar}
                onToggleClaimMode={togglingClaimMode}
                onToggleBuildMode={togglingBuildMode}
                onToggleFullscreen={() => {
                  void togglingViewportFullscreen({
                    shouldLockLandscapeOrientation: isMobile,
                  });
                }}
              />
              {!isEditSessionActive ? (
                <RenderingWorldPlazaInventoryHotbar
                  localPersistenceOwnerId={localPersistenceOwnerId}
                  redditUserId={redditUserId}
                  saveSlotIndex={singlePlayerSaveSlotIndex}
                  viewportHudScale={viewportHudScale}
                  inventoryDropPlacement={inventoryDropPlacement}
                  selectedSlotIndex={equipment.selectedSlotIndex}
                  onSelectHotbarSlot={equipment.selectingHotbarSlot}
                  onEatHotbarSlot={handlingEatHotbarSlot}
                  hungerHud={hungerHudSnapshot}
                />
              ) : null}
              {!isEditSessionActive ? (
                <>
                  <RenderingWorldPlazaGroundItems
                    localPersistenceOwnerId={localPersistenceOwnerId}
                    redditUserId={redditUserId}
                    saveSlotIndex={singlePlayerSaveSlotIndex}
                    playerPositionRef={playerPositionRef}
                    cameraOffsetRef={cameraOffsetRef}
                    cameraWorldZoomRef={cameraWorldZoomRef}
                    viewportHudScale={viewportHudScale}
                  />
                  <RenderingWorldPlazaInventoryDropArrowOverlay
                    dropMarkerTileRef={inventoryDropPlacement.dropMarkerTileRef}
                    cameraOffsetRef={cameraOffsetRef}
                    cameraWorldZoomRef={cameraWorldZoomRef}
                    viewportHudScale={viewportHudScale}
                  />
                </>
              ) : null}
              {!isEditSessionActive ? (
                <RenderingWorldPlazaSaveCoordsTilePopover
                  isOpen={isSaveCoordsTilePopoverOpen}
                  selectedTilePositionRef={saveCoordsSelectedTilePositionRef}
                  cameraOffsetRef={cameraOffsetRef}
                  cameraWorldZoomRef={cameraWorldZoomRef}
                  isSavingCoords={isSavingCoords}
                  canSaveMoreCoords={canSaveMoreCoords}
                  onSaveCoords={savingCoordsAtSelectedSaveCoordsTile}
                />
              ) : null}
            </>
          ) : null}
        </RenderingWorldPlazaGameplayHud>
      </div>
      <RenderingUserProfileFriendRequestPlazaModal
        isOpen={activeFriendRequestDialog !== null}
        request={activeFriendRequestDialog}
        onAccept={acceptingFriendRequestDialog}
        onDecline={decliningFriendRequestDialog}
        onLater={dismissingFriendRequestDialogLater}
        isResponding={isRespondingToFriendRequestDialog}
      />
      <RenderingWorldPlotVisitRequestPlazaModal
        isOpen={
          activeFriendRequestDialog === null &&
          activeVisitRequestDialog !== null
        }
        request={activeVisitRequestDialog}
        onApprove={approvingVisitRequestDialog}
        onDecline={decliningVisitRequestDialog}
        onLater={dismissingVisitRequestDialogLater}
        isResponding={isRespondingToVisitRequestDialog}
      />
      <RenderingWorldPlotVisitApprovedPlazaModal
        isOpen={
          activeFriendRequestDialog === null &&
          activeVisitRequestDialog === null &&
          activeApprovedVisitDialog !== null
        }
        request={activeApprovedVisitDialog}
        onGoNow={goingToApprovedVisitFromDialog}
        onLater={dismissingApprovedVisitDialogLater}
        isTeleporting={isTeleportFadeOverlayMounted}
      />
      <RenderingWorldPlazaPlayerTeleportFadeOverlay
        isMounted={isTeleportFadeOverlayMounted}
        opacity={teleportFadeOverlayOpacity}
        transitionDurationMs={teleportFadeTransitionDurationMs}
      />
      <RenderingUserProfileFriendPlazaNotificationModal
        isOpen={
          activeFriendRequestDialog === null &&
          activeVisitRequestDialog === null &&
          activeApprovedVisitDialog === null &&
          activeFriendPlazaNotification !== null
        }
        notification={activeFriendPlazaNotification}
        onClose={acknowledgingFriendPlazaNotification}
        isClosing={isAcknowledgingFriendPlazaNotification}
      />
      <RenderingWorldPlazaTutorialOverlay
        isOpen={activeCodexSection === 'controls'}
        onClose={closingCodexSection}
        isMobile={hudIsMobile}
      />
      <RenderingWorldPlazaMechanicsOverlay
        isOpen={activeCodexSection === 'mechanics'}
        onClose={closingCodexSection}
      />
      <RenderingWorldPlazaBiomesOverlay
        isOpen={activeCodexSection === 'biomes'}
        onClose={closingCodexSection}
      />
      <RenderingWorldPlazaCodexPlaceholderOverlay
        sectionId={activeCodexSection === 'lore' ? activeCodexSection : null}
        onClose={closingCodexSection}
      />
    </div>
  );
}
