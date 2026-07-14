'use client';

// Must run before any other module in this graph imports `@pixi/react`.
import '@/components/world/domains/registeringWorldPixiElements';

import type { CommunityMemberProfileStatusKind } from '@/components/community/domains/definingCommunityMemberProfileStatus';
import { RenderingUserProfileFriendPlazaNotificationModal } from '@/components/friends/components/renderingUserProfileFriendPlazaNotificationModal';
import { RenderingUserProfileFriendRequestPlazaModal } from '@/components/friends/components/renderingUserProfileFriendRequestPlazaModal';
import { usingUserProfileFriendPlazaNotifications } from '@/components/friends/hooks/usingUserProfileFriendPlazaNotifications';
import { usingUserProfileFriendRequestPlazaDialogs } from '@/components/friends/hooks/usingUserProfileFriendRequestPlazaDialogs';
import { usingUserProfileFriendRequestsPendingCount } from '@/components/friends/hooks/usingUserProfileFriendRequestsPendingCount';
import {
  checkingPlazaHerbariumStudyTierUnlocked,
  formattingPlazaHerbariumStudyCountProgress,
} from '@/components/home/domains/resolvingPlazaHerbariumStudyTier';
import {
  checkingPlazaLapidaryStudyTierUnlocked,
  formattingPlazaLapidaryStudyCountProgress,
} from '@/components/home/domains/resolvingPlazaLapidaryStudyTier';
import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaAvatarToolAction } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
import { sendingWorldPlazaAudioLifecycleEvent } from '@/components/world/audio/lifecycle/managingWorldPlazaAudioLifecycleStore';
import { RenderingSpiritedSpritesBetaLayer } from '@/components/world/beta/spirited/components/renderingSpiritedSpritesBetaLayer';
import type { DefiningSpiritedSpritesBetaAnimalId } from '@/components/world/beta/spirited/domains/definingSpiritedSpritesBetaCatalog';
import {
  clearingSpiritedSpritesBetaSpawnInstances,
  creatingSpiritedSpritesBetaSpawnStore,
} from '@/components/world/beta/spirited/domains/managingSpiritedSpritesBetaSpawnStore';
import { spawningSpiritedSpritesBetaNearPoint } from '@/components/world/beta/spirited/domains/spawningSpiritedSpritesBetaNearPoint';
import { RenderingWorldPlazaBlockPlacementPreview } from '@/components/world/building/components/renderingWorldPlazaBlockPlacementPreview';
import { RenderingWorldPlazaBlockRemovalHoverHighlight } from '@/components/world/building/components/renderingWorldPlazaBlockRemovalHoverHighlight';
import { RenderingWorldPlazaBuildModeDiscardDialog } from '@/components/world/building/components/renderingWorldPlazaBuildModeDiscardDialog';
import { RenderingWorldPlazaClaimModePlotOwnershipOverlay } from '@/components/world/building/components/renderingWorldPlazaClaimModePlotOwnershipOverlay';
import { RenderingWorldPlazaEditModeHotbar } from '@/components/world/building/components/renderingWorldPlazaEditModeHotbar';
import { RenderingWorldPlazaEditModePlotCapacityMetric } from '@/components/world/building/components/renderingWorldPlazaEditModePlotCapacityMetric';
import { RenderingWorldPlazaHudToolbarCraftModePanel } from '@/components/world/building/components/renderingWorldPlazaHudToolbarCraftModePanel';
import { RenderingWorldPlazaPlacedBlockGroundShadows } from '@/components/world/building/components/renderingWorldPlazaPlacedBlockGroundShadows';
import { RenderingWorldPlazaPlacedBlocks } from '@/components/world/building/components/renderingWorldPlazaPlacedBlocks';
import { RenderingWorldPlazaPlotBoundaries } from '@/components/world/building/components/renderingWorldPlazaPlotBoundaries';
import {
  countingWorldBuildingOwnerOwnedPlotCount,
  countingWorldBuildingOwnerPlotTileClaims,
} from '@/components/world/building/domains/countingWorldBuildingOwnerPlotClaims';
import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
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
import type { DefiningWorldBuildingEditPaintAction } from '@/components/world/building/domains/definingWorldBuildingEditMode';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingPlotBounds } from '@/components/world/building/domains/definingWorldBuildingPlotBounds';
import { LABELING_WORLD_BUILDING_SESSION_PLACEMENT_SUCCESS_TOAST } from '@/components/world/building/domains/definingWorldBuildingSessionBlockConstants';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import {
  formattingWorldBuildingTilePositionKey,
  snappingWorldBuildingTilePositionFromGridPoint,
} from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_BUILD_DEFAULT } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import type { DefiningWorldPlazaCraftModeCookbookId } from '@/components/world/building/domains/definingWorldPlazaCraftModeCookbookRegistry';
import { mergingWorldBuildingClaimModeOverlayPlots } from '@/components/world/building/domains/mergingWorldBuildingClaimModeOverlayPlots';
import { projectingWorldBuildingTilePositionFromViewportPointer } from '@/components/world/building/domains/projectingWorldBuildingTilePositionFromViewportPointerEvent';
import { findingWorldBuildingPlacedBlockAtTileIndex } from '@/components/world/building/domains/resolvingWorldBuildingCollision';
import { usingWorldPlazaBuildMode } from '@/components/world/building/hooks/usingWorldPlazaBuildMode';
import { usingWorldPlazaClaimModePlotRegistryQuery } from '@/components/world/building/hooks/usingWorldPlazaClaimModePlotRegistryQuery';
import { usingWorldPlazaLocalhostDevEnvironment } from '@/components/world/building/hooks/usingWorldPlazaLocalhostDevEnvironment';
import { usingWorldPlazaPlacedBlocksQuery } from '@/components/world/building/hooks/usingWorldPlazaPlacedBlocksQuery';
import { usingWorldPlazaPlotOwnerLimitsQuery } from '@/components/world/building/hooks/usingWorldPlazaPlotOwnerLimitsQuery';
import { usingWorldPlazaPlotSubscription } from '@/components/world/building/hooks/usingWorldPlazaPlotSubscription';
import { usingWorldPlazaSessionBuildingCleanup } from '@/components/world/building/hooks/usingWorldPlazaSessionBuildingCleanup';
import { usingWorldPlazaTemporaryPlotLifecycle } from '@/components/world/building/hooks/usingWorldPlazaTemporaryPlotLifecycle';
import { computingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/computingWorldPlazaCharacterEngineDerivedStats';
import { usingWorldPlazaCharacterEngineSkillCooldowns } from '@/components/world/character/hooks/usingWorldPlazaCharacterEngineSkillCooldowns';
import { usingWorldPlazaSelectedCharacterEngineDefinition } from '@/components/world/character/hooks/usingWorldPlazaSelectedCharacterEngineDefinition';
import { MeasuringWorldPlazaPixiRenderDiagnostics } from '@/components/world/components/measuringWorldPlazaPixiRenderDiagnostics';
import {
  ProvidingWorldPlazaPerformanceProfile,
  usingWorldPlazaPerformanceProfile,
} from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import { RenderingWorldPlazaActionBar } from '@/components/world/components/renderingWorldPlazaActionBar';
import { RenderingWorldPlazaAvatarFootsteps } from '@/components/world/components/renderingWorldPlazaAvatarFootsteps';
import { RenderingWorldPlazaAvatarMeleeSfx } from '@/components/world/components/renderingWorldPlazaAvatarMeleeSfx';
import { RenderingWorldPlazaAvatarMotionSfx } from '@/components/world/components/renderingWorldPlazaAvatarMotionSfx';
import { RenderingWorldPlazaBestiaryOverlay } from '@/components/world/components/renderingWorldPlazaBestiaryOverlay';
import { RenderingWorldPlazaBiomeAmbience } from '@/components/world/components/renderingWorldPlazaBiomeAmbience';
import { RenderingWorldPlazaBiomeBackdrop } from '@/components/world/components/renderingWorldPlazaBiomeBackdrop';
import { RenderingWorldPlazaBiomeMusic } from '@/components/world/components/renderingWorldPlazaBiomeMusic';
import { RenderingWorldPlazaBiomesOverlay } from '@/components/world/components/renderingWorldPlazaBiomesOverlay';
import { RenderingWorldPlazaCameraRig } from '@/components/world/components/renderingWorldPlazaCameraRig';
import { RenderingWorldPlazaClickArrowEffect } from '@/components/world/components/renderingWorldPlazaClickArrowEffect';
import { RenderingWorldPlazaDangerSenseHudOverlay } from '@/components/world/components/renderingWorldPlazaDangerSenseHudOverlay';
import { RenderingWorldPlazaDayNightOverlay } from '@/components/world/components/renderingWorldPlazaDayNightOverlay';
import { RenderingWorldPlazaDeclarativeTerrainSync } from '@/components/world/components/renderingWorldPlazaDeclarativeTerrainSync';
import { RenderingWorldPlazaDevModePanel } from '@/components/world/components/renderingWorldPlazaDevModePanel';
import { RenderingWorldPlazaFriendsPanel } from '@/components/world/components/renderingWorldPlazaFriendsPanel';
import { RenderingWorldPlazaFriendTrackingDirectionArrowOverlay } from '@/components/world/components/renderingWorldPlazaFriendTrackingDirectionArrowOverlay';
import { RenderingWorldPlazaGameplayHud } from '@/components/world/components/renderingWorldPlazaGameplayHud';
import { RenderingWorldPlazaGirlSampleVoiceSfx } from '@/components/world/components/renderingWorldPlazaGirlSampleVoiceSfx';
import { RenderingWorldPlazaGirlSampleWalkAvatar } from '@/components/world/components/renderingWorldPlazaGirlSampleWalkAvatar';
import { RenderingWorldPlazaHerbariumOverlay } from '@/components/world/components/renderingWorldPlazaHerbariumOverlay';
import { RenderingWorldPlazaHudToolbarBottomAnchor } from '@/components/world/components/renderingWorldPlazaHudToolbarBottomAnchor';
import { RenderingWorldPlazaLapidaryOverlay } from '@/components/world/components/renderingWorldPlazaLapidaryOverlay';
import { RenderingWorldPlazaLoreBookOverlay } from '@/components/world/components/renderingWorldPlazaLoreBookOverlay';
import { RenderingWorldPlazaMechanicsOverlay } from '@/components/world/components/renderingWorldPlazaMechanicsOverlay';
import { RenderingWorldPlazaMobileDebugPanel } from '@/components/world/components/renderingWorldPlazaMobileDebugPanel';
import { RenderingWorldPlazaMobileLandscapePrompt } from '@/components/world/components/renderingWorldPlazaMobileLandscapePrompt';
import { RenderingWorldPlazaMobileRollButton } from '@/components/world/components/renderingWorldPlazaMobileRollButton';
import { RenderingWorldPlazaPlayerCombatLockCrosshair } from '@/components/world/components/renderingWorldPlazaPlayerCombatLockCrosshair';
import type { RenderingWorldPlazaPlayerNameLabelEntry } from '@/components/world/components/renderingWorldPlazaPlayerNameLabels';
import { RenderingWorldPlazaPlayerNameLabels } from '@/components/world/components/renderingWorldPlazaPlayerNameLabels';
import { RenderingWorldPlazaPlayerNightLightGroundGlow } from '@/components/world/components/renderingWorldPlazaPlayerNightLightGroundGlow';
import { RenderingWorldPlazaPlayerTeleportFadeOverlay } from '@/components/world/components/renderingWorldPlazaPlayerTeleportFadeOverlay';
import { RenderingWorldPlazaPresenceReconnectOverlay } from '@/components/world/components/renderingWorldPlazaPresenceReconnectOverlay';
import { RenderingWorldPlazaProfilePanel } from '@/components/world/components/renderingWorldPlazaProfilePanel';
import { RenderingWorldPlazaRecipesOverlay } from '@/components/world/components/renderingWorldPlazaRecipesOverlay';
import { RenderingWorldPlazaRemotePlayers } from '@/components/world/components/renderingWorldPlazaRemotePlayers';
import { RenderingWorldPlazaRoomChatBubbles } from '@/components/world/components/renderingWorldPlazaRoomChatBubbles';
import { RenderingWorldPlazaRoomChatPanel } from '@/components/world/components/renderingWorldPlazaRoomChatPanel';
import { RenderingWorldPlazaRoomStatusHud } from '@/components/world/components/renderingWorldPlazaRoomStatusHud';
import { RenderingWorldPlazaRoomTypingIndicators } from '@/components/world/components/renderingWorldPlazaRoomTypingIndicators';
import { RenderingWorldPlazaSavedCoordsDirectionArrowOverlay } from '@/components/world/components/renderingWorldPlazaSavedCoordsDirectionArrowOverlay';
import { RenderingWorldPlazaSavedCoordsTileStarMarkers } from '@/components/world/components/renderingWorldPlazaSavedCoordsTileStarMarkers';
import { RenderingWorldPlazaTerrainCollisionDebugOverlay } from '@/components/world/components/renderingWorldPlazaTerrainCollisionDebugOverlay';
import { RenderingWorldPlazaTutorialOverlay } from '@/components/world/components/renderingWorldPlazaTutorialOverlay';
import { RenderingWorldPlazaWorldNotifications } from '@/components/world/components/renderingWorldPlazaWorldNotifications';
import { ReportingWorldPlazaPixiViewportDebugStatus } from '@/components/world/components/reportingWorldPlazaPixiViewportDebugStatus';
import {
  SYNCING_WORLD_PLAZA_PIXI_VIEWPORT_FRAME_CANVAS_CLASS_NAME,
  SyncingWorldPlazaPixiViewportFrameResize,
} from '@/components/world/components/syncingWorldPlazaPixiViewportFrameResize';
import { checkingWorldPlazaCraftRecipeAffordable } from '@/components/world/crafting/domains/checkingWorldPlazaCraftRecipeAffordable';
import { committingWorldPlazaCraftRecipePlaceablePlacement } from '@/components/world/crafting/domains/committingWorldPlazaCraftRecipePlaceablePlacement';
import { resolvingWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import {
  LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_INVENTORY_FULL_TOAST,
  LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_INVENTORY_SUCCESS_TOAST,
  LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_MISSING_MATERIALS_TOAST,
  LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_NOT_ATTACHED_TOAST,
  LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PAGE_ALREADY_ATTACHED_TOAST,
  LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PAGE_ATTACHED_TOAST,
  LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PLACEMENT_CANCELED_TOAST,
  LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PLACEMENT_MATERIALS_LOST_TOAST,
  LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PLACEMENT_REFUNDED_TOAST,
  LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PLACEMENT_SUCCESS_TOAST,
  LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REFUND_INVENTORY_FULL_TOAST,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeUiConstants';
import { executingWorldPlazaCraftRecipeInventoryOutcome } from '@/components/world/crafting/domains/executingWorldPlazaCraftRecipeInventoryOutcome';
import { refundingWorldPlazaCraftRecipeIngredients } from '@/components/world/crafting/domains/refundingWorldPlazaCraftRecipeIngredients';
import { showingWorldPlazaCraftRecipeRefundFloatFeedback } from '@/components/world/crafting/domains/showingWorldPlazaCraftRecipeRefundFloatFeedback';
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
import { resolvingWorldPlazaAnimalPlayableAvatarUnlockWildlifeSpeciesId } from '@/components/world/domains/checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked';
import {
  computingWorldPlazaEmbeddedHostSizeStyle,
  computingWorldPlazaExpandedHostSizeStyle,
} from '@/components/world/domains/computingWorldPlazaEmbeddedHostSizeStyle';
import { computingWorldPlazaGirlSampleMeleePresentationTiming } from '@/components/world/domains/computingWorldPlazaGirlSampleMeleePresentationTiming';
import { computingWorldPlazaViewportRenderResolution } from '@/components/world/domains/computingWorldPlazaViewportRenderResolution';
import type {
  DefiningWorldPlazaAvatarBlockReactionPresentationState,
  DefiningWorldPlazaAvatarDamagedPresentationState,
  DefiningWorldPlazaAvatarDeathPresentationState,
  DefiningWorldPlazaAvatarMeleePresentationState,
  DefiningWorldPlazaAvatarPushPresentationState,
  DefiningWorldPlazaAvatarRollPresentationState,
  DefiningWorldPlazaAvatarSleepPresentationState,
} from '@/components/world/domains/definingWorldPlazaAvatarCombatPresentationTypes';
import {
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_STATE_IDLE,
  type DefiningWorldPlazaAvatarMotionState,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { DEFINING_WORLD_PLAZA_CAMERA_ZOOM } from '@/components/world/domains/definingWorldPlazaCameraConstants';
import { DEFINING_WORLD_PLAZA_CAMERA_OFFSET_INITIAL } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import {
  DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_PRIMARY_POINTER_BUTTON,
  DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_SECONDARY_POINTER_BUTTON,
  DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE,
} from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { WorldPlazaCodexSectionId } from '@/components/world/domains/definingWorldPlazaCodexConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { checkingWorldPlazaMovementDirectionIsActive } from '@/components/world/domains/definingWorldPlazaMovementDirection';
import type {
  DefiningWorldPlazaOnlineRoomSnapshot,
  DefiningWorldPlazaRemotePlayer,
} from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import type { UsingWorldPlazaOnlineRoomChatResult } from '@/components/world/domains/definingWorldPlazaOnlineRoomChatBindings';
import { DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_HOVER_CURSOR } from '@/components/world/domains/definingWorldPlazaPlayerCombatLockConstants';
import type { DefiningWorldPlazaPlayerCombatLockState } from '@/components/world/domains/definingWorldPlazaPlayerCombatLockTypes';
import { DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ENABLED } from '@/components/world/domains/definingWorldPlazaPlayerNightLightConstants';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaPresenceDisconnectReason } from '@/components/world/domains/definingWorldPlazaPresenceDisconnectConstants';
import { DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
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
import { findingWorldPlazaBiomeTeleportWorldPointForDev } from '@/components/world/domains/findingWorldPlazaBiomeTeleportWorldPointForDev';
import { recordingWorldPlazaBestiarySpeciesStudied } from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import { checkingWorldPlazaDevQaLoadEnabled } from '@/components/world/domains/managingWorldPlazaDevQaLoadStore';
import {
  gettingWorldPlazaHerbariumFlowerStudyCountsSnapshot,
  gettingWorldPlazaHerbariumTreeStudyCountsSnapshot,
  recordingWorldPlazaHerbariumFlowerStudied,
  recordingWorldPlazaHerbariumTreeStudied,
} from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';
import {
  gettingWorldPlazaLapidaryOreStudyCountsSnapshot,
  recordingWorldPlazaLapidaryOreStudied,
} from '@/components/world/domains/managingWorldPlazaLapidaryDiscoveryStore';
import { settingWorldPlazaOnlineRoomId } from '@/components/world/domains/managingWorldPlazaOnlineRoomIdStore';
import {
  attachingWorldPlazaRecipePage,
  checkingWorldPlazaRecipePageAttachedInStore,
  initializingWorldPlazaRecipeDiscoveryStore,
} from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import { settingWorldPlazaPerformanceDiagnosticsEnabled } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { parsingWorldPlazaUserProfileAvatarUrlForNetworkSync } from '@/components/world/domains/parsingWorldPlazaUserProfileAvatarUrlForNetworkSync';
import { parsingWorldPlazaUserProfileStatusKindForNetworkSync } from '@/components/world/domains/parsingWorldPlazaUserProfileStatusKindForNetworkSync';
import { playingWorldPlazaAvatarMeleeSwingSfx } from '@/components/world/domains/playingWorldPlazaAvatarMeleeSfx';
import {
  projectingWorldPlazaViewportClientPointToGridPoint,
  projectingWorldPlazaViewportClientPointToViewportScreenPoint,
} from '@/components/world/domains/projectingWorldPlazaViewportClientPointToGridPoint';
import { resolvingWorldPlazaAvatarClipPresentation } from '@/components/world/domains/resolvingWorldPlazaAvatarClipPresentation';
import { resolvingWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirection';
import { resolvingWorldPlazaInitialPlayerSpawnWorldPoint } from '@/components/world/domains/resolvingWorldPlazaInitialPlayerSpawnWorldPoint';
import type { DefiningWorldPlazaPixiViewportSize } from '@/components/world/domains/resolvingWorldPlazaPixiViewportSize';
import { resolvingWorldPlazaPlayerCombatLockTick } from '@/components/world/domains/resolvingWorldPlazaPlayerCombatLockTick';
import { resolvingWorldPlazaSavedCoordsById } from '@/components/world/domains/resolvingWorldPlazaSavedCoordsListFromStorage';
import { resolvingWorldPlazaWorldPointNearPlotBoundsForTeleport } from '@/components/world/domains/resolvingWorldPlazaWorldPointNearPlotBoundsForTeleport';
import {
  checkingWorldPlazaDomOverlayFrameShouldUpdate,
  subscribingWorldPlazaDomOverlayFrame,
} from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { settlingWorldPlazaMeleeSwingDamage } from '@/components/world/domains/settlingWorldPlazaMeleeSwingDamage';
import { RenderingWorldPlazaEquipmentSfx } from '@/components/world/equipment/components/renderingWorldPlazaEquipmentSfx';
import type { DefiningWorldPlazaHeldItemPresentation } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemPresentationRegistry';
import { resolvingWorldPlazaEquippedAttackEv } from '@/components/world/equipment/domains/resolvingWorldPlazaEquippedAttackEv';
import { resolvingWorldPlazaEquippedHeldItemPresentation } from '@/components/world/equipment/domains/resolvingWorldPlazaEquippedHeldItemPresentation';
import { resolvingWorldPlazaHeldItemPresentationForItemTypeId } from '@/components/world/equipment/domains/resolvingWorldPlazaHeldItemPresentationForItemTypeId';
import { usingWorldPlazaEquipment } from '@/components/world/equipment/hooks/usingWorldPlazaEquipment';
import { RenderingWorldPlazaFarmingInteractionLabels } from '@/components/world/farming/components/renderingWorldPlazaFarmingInteractionLabels';
import { RenderingWorldPlazaFarmlandGroundMarkers } from '@/components/world/farming/components/renderingWorldPlazaFarmlandGroundMarkers';
import { listingWorldPlazaFarmlandTilesInInteractionRange } from '@/components/world/farming/domains/listingWorldPlazaFarmlandTilesInInteractionRange';
import {
  advancingWorldPlazaLocalFarmlandGrowthForOwner,
  readingWorldPlazaLocalFarmlandByTileKey,
} from '@/components/world/farming/domains/managingWorldPlazaLocalFarmland';
import { usingWorldPlazaFarmingInteraction } from '@/components/world/farming/hooks/usingWorldPlazaFarmingInteraction';
import { usingWorldPlazaFarmingProgress } from '@/components/world/farming/hooks/usingWorldPlazaFarmingProgress';
import { RenderingWorldPlazaCampfireAmbience } from '@/components/world/fire/components/renderingWorldPlazaCampfireAmbience';
import { RenderingWorldPlazaCampfireInteractionLabels } from '@/components/world/fire/components/renderingWorldPlazaCampfireInteractionLabels';
import { RenderingWorldPlazaFireLayer } from '@/components/world/fire/components/renderingWorldPlazaFireLayer';
import { RenderingWorldPlazaLavaAmbience } from '@/components/world/fire/components/renderingWorldPlazaLavaAmbience';
import { validatingWorldPlazaCampfireCookStart } from '@/components/world/fire/domains/validatingWorldPlazaCampfireCookStart';
import { usingWorldPlazaCampfireCookProgress } from '@/components/world/fire/hooks/usingWorldPlazaCampfireCookProgress';
import { usingWorldPlazaCampfireInteraction } from '@/components/world/fire/hooks/usingWorldPlazaCampfireInteraction';
import { usingWorldPlazaFireCells } from '@/components/world/fire/hooks/usingWorldPlazaFireCells';
import { usingWorldPlazaFlintIgnitionAttempt } from '@/components/world/fire/hooks/usingWorldPlazaFlintIgnitionAttempt';
import { RenderingWorldPlazaFishingInteractionLabels } from '@/components/world/fishing/components/renderingWorldPlazaFishingInteractionLabels';
import { checkingWorldPlazaFishingCastEligibility } from '@/components/world/fishing/domains/checkingWorldPlazaFishingCastEligibility';
import { computingWorldPlazaFishingCastDurationMs } from '@/components/world/fishing/domains/computingWorldPlazaFishingCastDurationMs';
import { usingWorldPlazaFishingInteraction } from '@/components/world/fishing/hooks/usingWorldPlazaFishingInteraction';
import { usingWorldPlazaFishingProgress } from '@/components/world/fishing/hooks/usingWorldPlazaFishingProgress';
import { RenderingWorldPlazaFlowerInteractionLabels } from '@/components/world/harvest/components/renderingWorldPlazaFlowerInteractionLabels';
import { RenderingWorldPlazaPebbleInteractionLabels } from '@/components/world/harvest/components/renderingWorldPlazaPebbleInteractionLabels';
import { RenderingWorldPlazaRockInteractionLabels } from '@/components/world/harvest/components/renderingWorldPlazaRockInteractionLabels';
import { RenderingWorldPlazaTreeInteractionLabels } from '@/components/world/harvest/components/renderingWorldPlazaTreeInteractionLabels';
import { RenderingWorldPlazaTreeStumpStudyLabels } from '@/components/world/harvest/components/renderingWorldPlazaTreeStumpStudyLabels';
import { DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_POINTS } from '@/components/world/harvest/domains/definingWorldPlazaTreeStumpStudyConstants';
import { findingWorldPlazaTreeStumpAtGridPoint } from '@/components/world/harvest/domains/findingWorldPlazaTreeStumpAtGridPoint';
import type { ListingWorldPlazaTreeStumpsInStudyRangeEntry } from '@/components/world/harvest/domains/listingWorldPlazaTreeStumpsInStudyRange';
import { formattingWorldPlazaChoppedTreeTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { formattingWorldPlazaMinedRockTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';
import {
  formattingWorldPlazaPickedFlowerTileKey,
  pickingWorldPlazaLocalFlower,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import { formattingWorldPlazaPickedPebbleTileKey } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';
import { markingWorldPlazaLocalTreeStumpStudied } from '@/components/world/harvest/domains/managingWorldPlazaLocalStudiedTreeStumps';
import { registeringWorldPlazaChoppedTreesVisualLayerLookup } from '@/components/world/harvest/domains/registeringWorldPlazaChoppedTreesVisualLayerLookup';
import { registeringWorldPlazaMinedRocksVisualLayerLookup } from '@/components/world/harvest/domains/registeringWorldPlazaMinedRocksVisualLayerLookup';
import { registeringWorldPlazaPickedFlowersLookup } from '@/components/world/harvest/domains/registeringWorldPlazaPickedFlowersLookup';
import { registeringWorldPlazaPickedPebblesLookup } from '@/components/world/harvest/domains/registeringWorldPlazaPickedPebblesLookup';
import { usingWorldPlazaChoppedTrees } from '@/components/world/harvest/hooks/usingWorldPlazaChoppedTrees';
import { usingWorldPlazaFlowerPickInteraction } from '@/components/world/harvest/hooks/usingWorldPlazaFlowerPickInteraction';
import { usingWorldPlazaFlowerPickProgress } from '@/components/world/harvest/hooks/usingWorldPlazaFlowerPickProgress';
import { usingWorldPlazaMinedRocks } from '@/components/world/harvest/hooks/usingWorldPlazaMinedRocks';
import { usingWorldPlazaPebblePickInteraction } from '@/components/world/harvest/hooks/usingWorldPlazaPebblePickInteraction';
import { usingWorldPlazaPebblePickProgress } from '@/components/world/harvest/hooks/usingWorldPlazaPebblePickProgress';
import {
  DEFINING_WORLD_PLAZA_PICKED_FLOWERS_QUERY_KEY_ROOT,
  checkingWorldPlazaPickedFlowersUseLocalPersistence,
  usingWorldPlazaPickedFlowers,
} from '@/components/world/harvest/hooks/usingWorldPlazaPickedFlowers';
import { usingWorldPlazaPickedPebbles } from '@/components/world/harvest/hooks/usingWorldPlazaPickedPebbles';
import { pickingWorldHarvestDevvitFlower } from '@/components/world/harvest/repositories/callingWorldHarvestDevvitApi';
import { usingWorldPlazaRockMineInteraction } from '@/components/world/harvest/hooks/usingWorldPlazaRockMineInteraction';
import { usingWorldPlazaRockMineProgress } from '@/components/world/harvest/hooks/usingWorldPlazaRockMineProgress';
import { usingWorldPlazaTreeChopInteraction } from '@/components/world/harvest/hooks/usingWorldPlazaTreeChopInteraction';
import { usingWorldPlazaTreeChopProgress } from '@/components/world/harvest/hooks/usingWorldPlazaTreeChopProgress';
import { usingWorldPlazaTreeStumpStudyProgress } from '@/components/world/harvest/hooks/usingWorldPlazaTreeStumpStudyProgress';
import { RenderingWorldPlazaEntityDeathScreenOverlay } from '@/components/world/health/components/renderingWorldPlazaEntityDeathScreenOverlay';
import {
  RenderingWorldPlazaEntityHealthBars,
  type RenderingWorldPlazaEntityHealthBarEntry,
} from '@/components/world/health/components/renderingWorldPlazaEntityHealthBars';
import { RenderingWorldPlazaEntityHealthFloatTexts } from '@/components/world/health/components/renderingWorldPlazaEntityHealthFloatTexts';
import { RenderingWorldPlazaEntityStatusEffectStack } from '@/components/world/health/components/renderingWorldPlazaEntityStatusEffectStack';
import { RenderingWorldPlazaEntityWorldAnchoredSleepSpeechBubble } from '@/components/world/health/components/renderingWorldPlazaEntityWorldAnchoredSleepSpeechBubble';
import { RenderingWorldPlazaEntityWorldAnchoredStunDots } from '@/components/world/health/components/renderingWorldPlazaEntityWorldAnchoredStunDots';
import {
  advancingWorldPlazaEntitySleepSpeechBubble,
  type DefiningWorldPlazaEntitySleepSpeechBubble,
} from '@/components/world/health/domains/advancingWorldPlazaEntitySleepSpeechBubble';
import { checkingWorldPlazaEntityBuffIsActive } from '@/components/world/health/domains/checkingWorldPlazaEntityBuffIsActive';
import { checkingWorldPlazaEntityPlayerSleepIsActive } from '@/components/world/health/domains/checkingWorldPlazaEntityPlayerSleepIsActive';
import {
  checkingWorldPlazaEntityPlayerStunIsActive,
  resolvingWorldPlazaEntityHealthActiveStunEffect,
} from '@/components/world/health/domains/checkingWorldPlazaEntityPlayerStunIsActive';
import { DEFINING_WORLD_PLAZA_ENTITY_DEATH_AUTO_RESPAWN_MS } from '@/components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import type { DefiningWorldPlazaEntityHealthSyncSnapshot } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { DEFINING_WORLD_PLAZA_ENTITY_SOULBREAK_DEV_HEALTH_PERCENT_EV } from '@/components/world/health/domains/definingWorldPlazaEntitySoulbreakConstants';
import { formattingWorldPlazaEntityDeathScreenTitle } from '@/components/world/health/domains/formattingWorldPlazaEntityDeathScreenTitle';
import { resolvingWorldPlazaEntityHealthAttackSpeedMultiplier } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthAttackSpeedMultiplier';
import { resolvingWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureComfortBand';
import { usingWorldPlazaPersistingPlayerConditions } from '@/components/world/health/hooks/usingWorldPlazaPersistingPlayerConditions';
import { usingWorldPlazaPlayerHealth } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';
import { trackingWorldPlazaArrowKeyInput } from '@/components/world/hooks/trackingWorldPlazaArrowKeyInput';
import { trackingWorldPlazaCharacterFacingRotationInput } from '@/components/world/hooks/trackingWorldPlazaCharacterFacingRotationInput';
import { trackingWorldPlazaClickMovementTarget } from '@/components/world/hooks/trackingWorldPlazaClickMovementTarget';
import { trackingWorldPlazaJumpInput } from '@/components/world/hooks/trackingWorldPlazaJumpInput';
import { trackingWorldPlazaPresenceActivity } from '@/components/world/hooks/trackingWorldPlazaPresenceActivity';
import { trackingWorldPlazaRollInput } from '@/components/world/hooks/trackingWorldPlazaRollInput';
import { usingWorldPlazaAvatarSkinSelectorVisibleState } from '@/components/world/hooks/usingWorldPlazaAvatarSkinSelectorVisibleState';
import { usingWorldPlazaCodexPanelVisibleState } from '@/components/world/hooks/usingWorldPlazaCodexPanelVisibleState';
import { usingWorldPlazaDangerSenseEnabled } from '@/components/world/hooks/usingWorldPlazaDangerSenseEnabled';
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
import { usingWorldPlazaGenerationFeaturesState } from '@/components/world/hooks/usingWorldPlazaGenerationFeaturesState';
import { usingWorldPlazaHudToolbarMode } from '@/components/world/hooks/usingWorldPlazaHudToolbarMode';
import { usingWorldPlazaMobileDebug } from '@/components/world/hooks/usingWorldPlazaMobileDebug';
import { usingWorldPlazaMobileLandscapeViewport } from '@/components/world/hooks/usingWorldPlazaMobileLandscapeViewport';
import { usingWorldPlazaPerformanceDiagnosticsVisibleState } from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsVisibleState';
import { usingWorldPlazaPersistingPlayerLastPosition } from '@/components/world/hooks/usingWorldPlazaPersistingPlayerLastPosition';
import { usingWorldPlazaPlayerTeleportScreenFade } from '@/components/world/hooks/usingWorldPlazaPlayerTeleportScreenFade';
import { usingWorldPlazaProfilePanelVisibleState } from '@/components/world/hooks/usingWorldPlazaProfilePanelVisibleState';
import { usingWorldPlazaRecordingBestiarySightings } from '@/components/world/hooks/usingWorldPlazaRecordingBestiarySightings';
import { usingWorldPlazaRecordingDiscoveredNamedRealms } from '@/components/world/hooks/usingWorldPlazaRecordingDiscoveredNamedRealms';
import { usingWorldPlazaRecordingExploredBiomes } from '@/components/world/hooks/usingWorldPlazaRecordingExploredBiomes';
import { usingWorldPlazaRecordingHerbariumSightings } from '@/components/world/hooks/usingWorldPlazaRecordingHerbariumSightings';
import { usingWorldPlazaRecordingLapidarySightings } from '@/components/world/hooks/usingWorldPlazaRecordingLapidarySightings';
import { usingWorldPlazaRunStamina } from '@/components/world/hooks/usingWorldPlazaRunStamina';
import { usingWorldPlazaSavedCoordsQuery } from '@/components/world/hooks/usingWorldPlazaSavedCoordsQuery';
import { usingWorldPlazaSavedCoordsTrackingVisibleState } from '@/components/world/hooks/usingWorldPlazaSavedCoordsTrackingVisibleState';
import { usingWorldPlazaSelectedAvatarCharacterDefinition } from '@/components/world/hooks/usingWorldPlazaSelectedAvatarCharacterDefinition';
import { usingWorldPlazaTerrainCollisionDebugVisibleState } from '@/components/world/hooks/usingWorldPlazaTerrainCollisionDebugVisibleState';
import { usingWorldPlazaViewportFullscreenLetterbox } from '@/components/world/hooks/usingWorldPlazaViewportFullscreenLetterbox';
import { usingWorldPlazaViewportHudScale } from '@/components/world/hooks/usingWorldPlazaViewportHudScale';
import { usingWorldPlazaViewportProfileLayoutInputs } from '@/components/world/hooks/usingWorldPlazaViewportProfileLayoutInputs';
import { usingWorldPlazaPlayerHunger } from '@/components/world/hunger/hooks/usingWorldPlazaPlayerHunger';
import { checkingWorldPlazaInteractablePointerHoverTarget } from '@/components/world/interaction/domains/checkingWorldPlazaInteractablePointerHoverTarget';
import {
  DEFINING_WORLD_PLAZA_CORPSE_POINTER_HOVER_CURSOR,
  DEFINING_WORLD_PLAZA_INTERACTABLE_POINTER_DEFAULT_CURSOR,
  DEFINING_WORLD_PLAZA_INTERACTABLE_POINTER_HOVER_CURSOR,
} from '@/components/world/interaction/domains/definingWorldPlazaInteractablePointerCursorConstants';
import type { DefiningWorldPlazaInteractablePointerHitContext } from '@/components/world/interaction/domains/definingWorldPlazaInteractablePointerHitContext';
import {
  clearingWorldPlazaInteractableBlockClickSelection,
  selectingWorldPlazaFarmlandTileForClickAction,
  selectingWorldPlazaFishingTileForClickAction,
  selectingWorldPlazaInteractableBlockForClickAction,
  selectingWorldPlazaInteractableFlowerForClickAction,
  selectingWorldPlazaInteractablePebbleForClickAction,
  selectingWorldPlazaInteractableRockForClickAction,
  selectingWorldPlazaInteractableTreeForClickAction,
  selectingWorldPlazaTreeStumpForClickAction,
  selectingWorldPlazaWildlifeCorpseForClickAction,
} from '@/components/world/interaction/domains/managingWorldPlazaInteractableBlockClickSelection';
import { trackingWorldPlazaInteractableBlockPointerInteraction } from '@/components/world/interaction/hooks/trackingWorldPlazaInteractableBlockPointerInteraction';
import { usingWorldPlazaHideActionsEnabled } from '@/components/world/interaction/hooks/usingWorldPlazaHideActionsEnabled';
import { usingWorldPlazaProximityInteractableBlockSelection } from '@/components/world/interaction/hooks/usingWorldPlazaProximityInteractableBlockSelection';
import { RenderingWorldPlazaGroundItems } from '@/components/world/inventory/components/renderingWorldPlazaGroundItems';
import { RenderingWorldPlazaInventoryBagSfx } from '@/components/world/inventory/components/renderingWorldPlazaInventoryBagSfx';
import { RenderingWorldPlazaInventoryDropItemOverlay } from '@/components/world/inventory/components/renderingWorldPlazaInventoryDropItemOverlay';
import { RenderingWorldPlazaInventoryDropTileOutlinePreview } from '@/components/world/inventory/components/renderingWorldPlazaInventoryDropTileOutlinePreview';
import { RenderingWorldPlazaInventoryFoodEatOverlay } from '@/components/world/inventory/components/renderingWorldPlazaInventoryFoodEatOverlay';
import { RenderingWorldPlazaInventoryHotbar } from '@/components/world/inventory/components/renderingWorldPlazaInventoryHotbar';
import { applyingWorldPlazaInventorySlotActiveEnchantmentUse } from '@/components/world/inventory/domains/applyingWorldPlazaInventorySlotActiveEnchantmentUse';
import { computingWorldPlazaInventoryItemEnchantmentHarvestSpeedMultiplier } from '@/components/world/inventory/domains/computingWorldPlazaInventoryItemEnchantmentHarvestSpeedMultiplier';
import { consumingWorldPlazaInventoryItemByType } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemByType';
import { consumingWorldPlazaInventoryItemFromSlot } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemFromSlot';
import { parsingWorldPlazaFlowerSpeciesIdFromItemTypeId } from '@/components/world/inventory/domains/definingWorldPlazaFlowerEatEffectRegistry';
import { parsingWorldPlazaOreSpeciesIdFromItemTypeId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryOreSpriteSheetConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WHEAT_SEED } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { disarmingWorldPlazaInventorySlotArmedHarvestEnchantments } from '@/components/world/inventory/domains/disarmingWorldPlazaInventorySlotArmedHarvestEnchantments';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { resolvingWorldPlazaInventoryFoodEatEffects } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodEatEffects';
import {
  checkingWorldPlazaInventoryItemIsFood,
  resolvingWorldPlazaInventoryFoodDefinition,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
import { resolvingWorldPlazaInventoryItemRecipePageRecipeId } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemRecipePage';
import { wearingWorldPlazaEquippedInventoryToolDurability } from '@/components/world/inventory/domains/wearingWorldPlazaEquippedInventoryToolDurability';
import { trackingWorldPlazaInventoryDropPlacement } from '@/components/world/inventory/hooks/trackingWorldPlazaInventoryDropPlacement';
import { usingWorldPlazaInventory } from '@/components/world/inventory/hooks/usingWorldPlazaInventory';
import {
  usingWorldPlazaInventoryFoodEatProgress,
  type DefiningWorldPlazaInventoryFoodEatProgressContext,
} from '@/components/world/inventory/hooks/usingWorldPlazaInventoryFoodEatProgress';
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
  DefiningWorldPlazaProjectileTarget,
  SpawningWorldPlazaProjectileRequest,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import type { ManagingWorldPlazaProjectileStore } from '@/components/world/projectile/domains/managingWorldPlazaProjectileStore';
import { usingWorldPlazaProjectileEngine } from '@/components/world/projectile/hooks/usingWorldPlazaProjectileEngine';
import {
  DEFINING_WILDLIFE_PLAYER_MELEE_REACH_GRID,
  findingWildlifeInstanceAtGridPoint,
  RenderingWildlifeLayer,
  resolvingWildlifeSpeciesDefinition,
  usingWildlifeSimulation,
} from '@/components/world/wildlife';
import { RenderingWildlifeDocileBetrayInteractionLabels } from '@/components/world/wildlife/components/renderingWildlifeDocileBetrayInteractionLabels';
import { RenderingWildlifeFootsteps } from '@/components/world/wildlife/components/renderingWildlifeFootsteps';
import { RenderingWildlifeOmegaWolfSfx } from '@/components/world/wildlife/components/renderingWildlifeOmegaWolfSfx';
import { RenderingWildlifeSpeciesSfx } from '@/components/world/wildlife/components/renderingWildlifeSpeciesSfx';
import { RenderingWildlifeStudySfx } from '@/components/world/wildlife/components/renderingWildlifeStudySfx';
import { RenderingWorldPlazaWildlifeCorpseStudyLabels } from '@/components/world/wildlife/components/renderingWorldPlazaWildlifeCorpseStudyLabels';
import { RenderingWorldPlazaWildlifeHealthFloatTexts } from '@/components/world/wildlife/components/renderingWorldPlazaWildlifeHealthFloatTexts';
import { RenderingWorldPlazaWildlifeNameTags } from '@/components/world/wildlife/components/renderingWorldPlazaWildlifeNameTags';
import { RenderingWorldPlazaWildlifeSpeechBubbles } from '@/components/world/wildlife/components/renderingWorldPlazaWildlifeSpeechBubbles';
import { applyingWildlifeDocilePetComplete } from '@/components/world/wildlife/domains/applyingWildlifeDocilePetComplete';
import { applyingWildlifePlayerMeleeHitSideEffects } from '@/components/world/wildlife/domains/applyingWildlifePlayerMeleeHitSideEffects';
import { checkingWildlifeDocilePetIsReady } from '@/components/world/wildlife/domains/checkingWildlifeDocilePetIsReady';
import { checkingWildlifeSpeciesIsDocile } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsDocile';
import { resolvingWildlifeDocilePetKind } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsPettable';
import { clearingWildlifeAreaOnPlayerDeath } from '@/components/world/wildlife/domains/clearingWildlifeAreaOnPlayerDeath';
import { computingWildlifeCorpseStudyPoints } from '@/components/world/wildlife/domains/computingWildlifeCorpseStudyPoints';
import { cookingWildlifeMeatAtCampfire } from '@/components/world/wildlife/domains/cookingWildlifeMeatAtCampfire';
import { resolvingWildlifeDiseaseTransmissionProfile } from '@/components/world/wildlife/domains/definingWildlifeDiseaseTransmissionRegistry';
import { DEFINING_WILDLIFE_DOCILE_PET_STUDY_POINTS } from '@/components/world/wildlife/domains/definingWildlifeDocilePetConstants';
import type { DefiningWildlifeFloatingCombatText } from '@/components/world/wildlife/domains/definingWildlifeFloatingCombatTextTypes';
import type { DefiningWildlifeNameTagOverlay } from '@/components/world/wildlife/domains/definingWildlifeNameTagTypes';
import type { DefiningWildlifeSpeechBubbleOverlay } from '@/components/world/wildlife/domains/definingWildlifeSpeechBubbleTypes';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeInstance,
  DefiningWildlifeSpeciesId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { enqueueingWildlifeCorpseStudyFloatFeedback } from '@/components/world/wildlife/domains/enqueueingWildlifeCorpseStudyFloatFeedback';
import { enqueueingWildlifeMissFloatFeedback } from '@/components/world/wildlife/domains/enqueueingWildlifeMissFloatFeedback';
import { findingWildlifeCorpseAtGridPoint } from '@/components/world/wildlife/domains/findingWildlifeCorpseAtGridPoint';
import type { ListingWildlifeCorpsesInStudyRangeEntry } from '@/components/world/wildlife/domains/listingWildlifeCorpsesInStudyRange';
import {
  clearingWildlifeDocileAttackConfirmPending,
  readingWildlifeDocileAttackConfirmPending,
  settingWildlifeDocileAttackConfirmPending,
} from '@/components/world/wildlife/domains/managingWildlifeDocileAttackConfirmStore';
import {
  checkingWildlifeGroundFlowerOptimisticIsPicked,
  registeringWildlifeGroundFlowerBridge,
} from '@/components/world/wildlife/domains/managingWildlifeGroundFlowerBridge';
import {
  clearingWildlifeInstanceStore,
  gettingWildlifeInstance,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { playingWildlifeStudySfx } from '@/components/world/wildlife/domains/playingWildlifeStudySfx';
import { renamingWildlifeInstanceDisplayName } from '@/components/world/wildlife/domains/renamingWildlifeInstanceDisplayName';
import { resolvingWildlifeDiseaseTransmissionChance } from '@/components/world/wildlife/domains/resolvingWildlifeDiseaseTransmissionChance';
import { resolvingWildlifeInstanceCollisionRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { spawningWildlifeDevAggressiveChickensNearPoint } from '@/components/world/wildlife/domains/spawningWildlifeDevAggressiveChickensNearPoint';
import { spawningWildlifeDevGreyWolfRandomlyNearPoint } from '@/components/world/wildlife/domains/spawningWildlifeDevGreyWolfRandomlyNearPoint';
import { spawningWildlifeDevSpeciesNearPoint } from '@/components/world/wildlife/domains/spawningWildlifeDevSpeciesNearPoint';
import { usingWildlifeDocileAttackConfirm } from '@/components/world/wildlife/hooks/usingWildlifeDocileAttackConfirm';
import { usingWildlifeDocileBetrayProgress } from '@/components/world/wildlife/hooks/usingWildlifeDocileBetrayProgress';
import { usingWildlifeDocilePetProximitySelection } from '@/components/world/wildlife/hooks/usingWildlifeDocilePetProximitySelection';
import { usingWorldPlazaWildlifeCorpseStudyProgress } from '@/components/world/wildlife/hooks/usingWorldPlazaWildlifeCorpseStudyProgress';
import {
  applyingWildlifePetOwnerFeed,
  applyingWildlifePetOwnerHeal,
  checkingWildlifePetHasCapability,
  checkingWildlifePetItemIsEquippableWeapon,
  formattingWildlifePetInstanceId,
  syncingWildlifePetBondToRoster,
  syncingWildlifePetInstanceVitalsToRoster,
  updatingWildlifePetRecord,
  type DefiningWildlifePetBondState,
} from '@/components/world/wildlife/pets';
import { RenderingWildlifePetModal } from '@/components/world/wildlife/pets/components/renderingWildlifePetModal';
import { RenderingWildlifePetNameDialog } from '@/components/world/wildlife/pets/components/renderingWildlifePetNameDialog';
import { RenderingWildlifePetRosterPanel } from '@/components/world/wildlife/pets/components/renderingWildlifePetRosterPanel';
import {
  applyingWildlifePetDevLoyaltyGrant,
  type ApplyingWildlifePetDevLoyaltyGrantKind,
} from '@/components/world/wildlife/pets/domains/applyingWildlifePetDevLoyaltyGrant';
import { DEFINING_WILDLIFE_PET_MODAL_HEAL_AMOUNT } from '@/components/world/wildlife/pets/domains/definingWildlifePetModalConstants';
import { findingWildlifeNearestPettableInstance } from '@/components/world/wildlife/pets/domains/findingWildlifeNearestPettableInstance';
import { usingWildlifeActivePetSpawn } from '@/components/world/wildlife/pets/hooks/usingWildlifeActivePetSpawn';
import { usingWildlifePetModalState } from '@/components/world/wildlife/pets/hooks/usingWildlifePetModalState';
import { usingWildlifePetRosterPanelVisibleState } from '@/components/world/wildlife/pets/hooks/usingWildlifePetRosterPanelVisibleState';
import { showToast } from '@devvit/web/client';
import { Application } from '@pixi/react';
import { useQueryClient } from '@tanstack/react-query';
import type { Container } from 'pixi.js';
import { CullerPlugin } from 'pixi.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  PlazaDevvitOnlineOwnedPetSnapshot,
  PlazaDevvitOnlineWildlifeDamageEvent,
  PlazaDevvitOnlineWildlifeSnapshot,
} from '../../../shared/plazaDevvitOnline';
import { PLAZA_DEVVIT_ONLINE_DEFAULT_MAX_PLAYERS } from '../../../shared/plazaDevvitOnline';
import type { PlazaSaveSlotIndex } from '../../../shared/plazaGameSession';
import { WORLD_HARVEST_DEVVIT_PICK_FLOWER_API_PATH } from '../../../shared/worldHarvestDevvit';

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

/** Keeps the Pixi canvas above the biome sky backdrop and below DOM HUD overlays. */
const DEFINING_WORLD_PLAZA_PIXI_STAGE_LAYER_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.pixiStageLayer} relative z-10 h-full w-full`;

/** Accessible label for the plaza viewport. */
const DEFINING_WORLD_PLAZA_ARIA_LABEL =
  'World Plaza. Click to walk. Double-click to run. Hold to run on mobile. Arrow keys or WASD to move. Hold Shift to run. Hold right-click to face the mouse. Space to jump. Press R or use the roll button on mobile to dodge.' as const;

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
  /** Player cap shown in the room HUD (fallback when room meta not yet loaded). */
  onlineMaxPlayers?: number;
  /** Selected multiplayer named room id. */
  onlineRoomId?: string | null;
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
  onlineMaxPlayers = PLAZA_DEVVIT_ONLINE_DEFAULT_MAX_PLAYERS,
  onlineRoomId = null,
  onExitToHome,
}: RenderingWorldPlazaPixiSceneProps): React.JSX.Element {
  useEffect(() => {
    settingWorldPlazaOnlineRoomId(onlineUserId ? onlineRoomId : null);

    return () => {
      settingWorldPlazaOnlineRoomId(null);
    };
  }, [onlineRoomId, onlineUserId]);

  const handlingForcedOnlineExit = useCallback(
    (reason: string): void => {
      showToast(reason);
      onExitToHome?.();
    },
    [onExitToHome]
  );

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

  const wildlifeSnapshotsOutRef = useRef<PlazaDevvitOnlineWildlifeSnapshot[]>(
    []
  );
  const remoteWildlifeSnapshotsRef = useRef<
    PlazaDevvitOnlineWildlifeSnapshot[]
  >([]);
  const pendingWildlifeDamageEventsRef = useRef<
    PlazaDevvitOnlineWildlifeDamageEvent[]
  >([]);
  const ownedPetSnapshotsOutRef = useRef<PlazaDevvitOnlineOwnedPetSnapshot[]>(
    []
  );
  const remoteOwnedPetSnapshotsRef = useRef<
    PlazaDevvitOnlineOwnedPetSnapshot[]
  >([]);

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
    enabled: isOnlineRoomEnabled && Boolean(onlineRoomId),
    roomId: onlineRoomId ?? '',
    playerPositionRef,
    localAvatarMotionStateRef,
    healthSyncSnapshotRef,
    pendingProjectileSpawnEventsRef: pendingOnlineSpawnEventsRef,
    onRemoteProjectileSpawnEvents: ingestOnlineSpawnEvents,
    wildlifeSnapshotsOutRef,
    pendingWildlifeDamageEventsRef,
    remoteWildlifeSnapshotsRef,
    ownedPetSnapshotsOutRef,
    remoteOwnedPetSnapshotsRef,
    onForcedExit: handlingForcedOnlineExit,
  });

  const roomChat = usingWorldPlazaDevvitPollingRoomChat({
    userId: onlineUserId,
    displayName: onlineDisplayName,
    playerPositionRef,
    isRoomJoined: onlineRoom.roomSnapshot.isJoined,
    enabled: isOnlineRoomEnabled && Boolean(onlineRoomId),
    roomId: onlineRoomId ?? '',
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
        onlineRoomId={onlineRoomId}
        onExitToHome={onExitToHome}
        onlineRoom={onlineRoom}
        roomChat={roomChat}
        wildlifeSnapshotsOutRef={wildlifeSnapshotsOutRef}
        remoteWildlifeSnapshotsRef={remoteWildlifeSnapshotsRef}
        pendingWildlifeDamageEventsRef={pendingWildlifeDamageEventsRef}
        ownedPetSnapshotsOutRef={ownedPetSnapshotsOutRef}
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
  onlineRoomId: string | null;
  onExitToHome?: () => void;
  onlineRoom: RenderingWorldPlazaOnlineRoomBinding;
  roomChat: UsingWorldPlazaOnlineRoomChatResult;
  wildlifeSnapshotsOutRef: React.RefObject<PlazaDevvitOnlineWildlifeSnapshot[]>;
  remoteWildlifeSnapshotsRef: React.RefObject<
    PlazaDevvitOnlineWildlifeSnapshot[]
  >;
  pendingWildlifeDamageEventsRef: React.RefObject<
    PlazaDevvitOnlineWildlifeDamageEvent[]
  >;
  ownedPetSnapshotsOutRef: React.RefObject<PlazaDevvitOnlineOwnedPetSnapshot[]>;
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
  onlineRoomId,
  onExitToHome,
  onlineRoom,
  roomChat,
  wildlifeSnapshotsOutRef,
  remoteWildlifeSnapshotsRef,
  pendingWildlifeDamageEventsRef,
  ownedPetSnapshotsOutRef,
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
  const {
    isMobileDebugActive,
    isMobileDebugHudVisible,
    frameStats: mobileDebugFrameStats,
    uptimeSec: mobileDebugUptimeSec,
    hidingMobileDebugHud,
    copyingMobileDebugReport,
  } = usingWorldPlazaMobileDebug(performanceProfile);
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
  const isMobileViewportRef = useRef(hudIsMobile);
  isMobileViewportRef.current = hudIsMobile;

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
  const previewDefinitionIdRef =
    useRef<DefiningWorldBuildingBlockDefinitionId | null>(null);
  const hoveredRemovableBlockRef =
    useRef<DefiningWorldBuildingPlacedBlock | null>(null);
  const isBuildTilePopoverOpenRef = useRef(false);
  const isEditSessionActiveRef = useRef(false);
  const isPlayerDeadRef = useRef(false);
  const isPlayerAsleepRef = useRef(false);
  const isPlayerStunnedRef = useRef(false);
  const isRollingRef = useRef(false);
  const isRollDodgeActiveRef = useRef(false);
  const rollDodgeProgressRef = useRef(0);
  const rollChainUnlockAtMsRef = useRef(0);
  const rollStateRef =
    useRef<DefiningWorldPlazaAvatarRollPresentationState | null>(null);
  const meleeAttackStateRef =
    useRef<DefiningWorldPlazaAvatarMeleePresentationState | null>(null);
  const combatLockRef = useRef<DefiningWorldPlazaPlayerCombatLockState | null>(
    null
  );
  const applyingPlayerMeleeDamageOnSwingCompleteRef = useRef<
    ((melee: DefiningWorldPlazaAvatarMeleePresentationState) => void) | null
  >(null);
  const pushStateRef =
    useRef<DefiningWorldPlazaAvatarPushPresentationState | null>(null);
  const blockReactionStateRef =
    useRef<DefiningWorldPlazaAvatarBlockReactionPresentationState | null>(null);
  const damagedStateRef =
    useRef<DefiningWorldPlazaAvatarDamagedPresentationState | null>(null);
  const deathStateRef =
    useRef<DefiningWorldPlazaAvatarDeathPresentationState | null>(null);
  const sleepStateRef =
    useRef<DefiningWorldPlazaAvatarSleepPresentationState | null>(null);
  const [sleepSpeechBubble, setSleepSpeechBubble] =
    useState<DefiningWorldPlazaEntitySleepSpeechBubble | null>(null);
  const isBlockBuildModeActiveRef = useRef(false);
  const isBuildModeActiveRef = useRef(false);
  const isClaimModeActiveRef = useRef(false);
  const isSaveCoordsPlacementActiveRef = useRef(false);
  const isEditPaintPointerHeldRef = useRef(false);
  const editPaintActionRef =
    useRef<DefiningWorldBuildingEditPaintAction | null>(null);
  const lastEditPaintTileKeyRef = useRef<string | null>(null);
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

  usingWorldPlazaSessionBuildingCleanup(
    isLocalGameplayEnabled && onlineUserId !== null,
    onlineUserId
  );

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
  const { flags: generationFeatureFlags } =
    usingWorldPlazaGenerationFeaturesState();
  const isWildlifeGenerationEnabled =
    generationFeatureFlags[DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE];
  const isWildlifeSpeechBubblesEnabled =
    generationFeatureFlags[
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_SPEECH_BUBBLES
    ];
  const isWildlifeDamageNumbersEnabled =
    generationFeatureFlags[
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_DAMAGE_NUMBERS
    ];
  const isWildlifeNameTagsEnabled =
    generationFeatureFlags[
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_NAME_TAGS
    ];
  const isHudMinimapEnabled =
    generationFeatureFlags[DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_MINIMAP];
  const isHudActionBarEnabled =
    generationFeatureFlags[
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_ACTION_BAR
    ];
  const isHudHotbarEnabled =
    generationFeatureFlags[DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_HOTBAR];
  const isHudCraftingEnabled =
    isHudHotbarEnabled &&
    generationFeatureFlags[
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_CRAFTING
    ];
  const isHudDayNightEnabled =
    generationFeatureFlags[
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_DAY_NIGHT
    ];
  const isHudDangerSenseFeatureEnabled =
    generationFeatureFlags[
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_DANGER_SENSE
    ];
  const { isDangerSenseEnabled: isDangerSensePreferenceEnabled } =
    usingWorldPlazaDangerSenseEnabled();
  const isHudDangerSenseEnabled =
    isHudDangerSenseFeatureEnabled && isDangerSensePreferenceEnabled;
  const isHudStatusEnabled =
    generationFeatureFlags[DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_STATUS];
  const isHudHealthEnabled =
    generationFeatureFlags[DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_HEALTH];
  const isHudStaminaEnabled =
    generationFeatureFlags[DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_STAMINA];
  const isHudWorldAnchorsEnabled =
    generationFeatureFlags[
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.HUD_WORLD_ANCHORS
    ];

  useEffect(() => {
    if (!isPerformanceDiagnosticsFeatureAvailable) {
      return;
    }

    settingWorldPlazaPerformanceDiagnosticsEnabled(
      isPerformanceDiagnosticsVisible || isMobileDebugActive
    );
  }, [
    isMobileDebugActive,
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

  const [isSaveCoordsPlacementActive, setIsSaveCoordsPlacementActive] =
    useState(false);
  isSaveCoordsPlacementActiveRef.current = isSaveCoordsPlacementActive;

  const startingSaveCoordsPlacement = useCallback((): void => {
    if (!canSaveMoreCoords || isSavingCoords) {
      return;
    }

    setIsSaveCoordsPlacementActive(true);
  }, [canSaveMoreCoords, isSavingCoords]);

  const cancellingSaveCoordsPlacement = useCallback((): void => {
    setIsSaveCoordsPlacementActive(false);
  }, []);

  useEffect(() => {
    if (!isSaveCoordsPlacementActive) {
      return;
    }

    const handlingKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsSaveCoordsPlacementActive(false);
      }
    };

    window.addEventListener('keydown', handlingKeyDown);
    return () => {
      window.removeEventListener('keydown', handlingKeyDown);
    };
  }, [isSaveCoordsPlacementActive]);

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

  const { plotOwnerLimits } = usingWorldPlazaPlotOwnerLimitsQuery({
    userId: buildModeUserId,
    isEnabled: isBuildModeEnabled,
  });

  usingWorldPlazaTemporaryPlotLifecycle({
    isEnabled: isBuildModeEnabled,
    onlineUserId: buildModeUserId,
  });

  const [isRemovingTemporaryPlot, setIsRemovingTemporaryPlot] = useState(false);
  const [openCraftCookbookId, setOpenCraftCookbookId] =
    useState<DefiningWorldPlazaCraftModeCookbookId | null>(null);
  const onSuccessfulBlockPlacementRef = useRef<
    | ((
        tilePosition: DefiningWorldBuildingTilePosition,
        placedBlockId: string,
        isSessionPlacement?: boolean
      ) => void)
    | null
  >(null);
  const onBlockRemovedRef = useRef<
    ((removedBlock: DefiningWorldBuildingPlacedBlock) => void) | null
  >(null);
  const pendingCraftRecipeIdRef =
    useRef<DefiningWorldPlazaCraftModeRecipeId | null>(null);
  const [
    pendingCraftPlacementPreviewDefinitionId,
    setPendingCraftPlacementPreviewDefinitionId,
  ] = useState<DefiningWorldBuildingBlockDefinitionId | null>(null);
  const craftedCommittedBlockRecipeByBlockIdRef = useRef(
    new Map<string, DefiningWorldPlazaCraftModeRecipeId>()
  );
  const showingCraftRefundFloatsRef = useRef<
    (
      recipeDefinition: NonNullable<
        ReturnType<typeof resolvingWorldPlazaCraftModeRecipeDefinition>
      >
    ) => void
  >(() => undefined);
  /** After exiting build with armed craft, skip refund UI once this session. */
  const craftPlacementCancelRefundWaivedForSessionRef = useRef(false);

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
    togglingEditSession,
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
    actingOnEditModeTileAtViewport,
    resolvingEditPaintActionAtTile,
    paintingEditModeTileAtViewport,
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
    onSuccessfulBlockPlacementRef,
    onBlockRemovedRef,
  });

  const { hudToolbarMode, selectingHudToolbarMode } =
    usingWorldPlazaHudToolbarMode({
      isEditSessionActive,
      isBlockBuildModeActive,
      isClaimModeActive,
      isBuildModeEnabled,
      togglingEditSession,
      activatingBuildMode,
      activatingClaimMode,
    });

  const isProjectileEngineEnabled =
    isPlazaProjectileSessionActive &&
    isLocalGameplayEnabled &&
    !checkingWorldPlazaDevQaLoadEnabled() &&
    generationFeatureFlags[DEFINING_WORLD_PLAZA_GENERATION_FEATURE.PROJECTILES];

  const isDevQaBlankSlate = checkingWorldPlazaDevQaLoadEnabled();

  const handlingRemoveTemporaryPlotAtTile = useCallback(
    (tilePosition: DefiningWorldBuildingTilePosition): void => {
      setIsRemovingTemporaryPlot(true);
      void removingTemporaryPlotAtTile(tilePosition).finally(() => {
        setIsRemovingTemporaryPlot(false);
      });
    },
    [removingTemporaryPlotAtTile]
  );

  const {
    ownerGroups: claimModeOwnerGroups,
    isLoading: isClaimModePlotRegistryLoading,
    refetchingRegistry: refetchingClaimModePlotRegistry,
  } = usingWorldPlazaClaimModePlotRegistryQuery({
    isEnabled:
      isBuildModeEnabled && (isClaimModeActive || isBlockBuildModeActive),
    localUserId: buildModeUserId,
    localOwnedDraftPlots: activeOwnedPlots,
  });

  const wasSavingBuildDraftRef = useRef(false);

  useEffect(() => {
    if (
      wasSavingBuildDraftRef.current &&
      !isSavingBuildDraft &&
      (isClaimModeActive || isBlockBuildModeActive)
    ) {
      void refetchingClaimModePlotRegistry();
    }

    wasSavingBuildDraftRef.current = isSavingBuildDraft;
  }, [
    isBlockBuildModeActive,
    isClaimModeActive,
    isSavingBuildDraft,
    refetchingClaimModePlotRegistry,
  ]);

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
  previewDefinitionIdRef.current =
    pendingCraftPlacementPreviewDefinitionId ?? selectedDefinitionId;
  hoveredRemovableBlockRef.current = hoveredRemovableBlock;
  isBuildTilePopoverOpenRef.current = isBuildTilePopoverOpen;
  isEditSessionActiveRef.current = isEditSessionActive;
  isBlockBuildModeActiveRef.current = isBlockBuildModeActive;
  isBuildModeActiveRef.current = isEditSessionActive;
  isClaimModeActiveRef.current = isClaimModeActive;
  isTerrainCollisionDebugVisibleRef.current =
    isDevDebugActive && isTerrainCollisionDebugVisible;
  selectedWorldLayerRef.current = selectedWorldLayer;

  useEffect(() => {
    if (!isClaimModeActive) {
      setIsSaveCoordsPlacementActive(false);
    }
  }, [isClaimModeActive]);

  usingWorldPlazaPlotSubscription({
    isEnabled: isBuildModeEnabled,
    refetchingPlots,
  });

  const selectedCharacterEngineDefinition =
    usingWorldPlazaSelectedCharacterEngineDefinition();
  const selectedCharacterEngineDerivedStats =
    computingWorldPlazaCharacterEngineDerivedStats(
      selectedCharacterEngineDefinition
    );

  const { jumpRequestedRef } = trackingWorldPlazaJumpInput({
    isEnabled: isLocalGameplayEnabled,
    isChatOpenRef,
    focusContainerRef: hostRef,
    isJumpingRef,
    isPlayerAsleepRef,
    isPlayerStunnedRef,
  });

  const { rollRequestedRef } = trackingWorldPlazaRollInput({
    isEnabled: isLocalGameplayEnabled,
    isChatOpenRef,
    focusContainerRef: hostRef,
    isPlayerDeadRef,
    isPlayerAsleepRef,
    isPlayerStunnedRef,
  });

  const {
    walkTargetRef,
    walkWaypointsRef,
    walkDestinationRef,
    navigationPlacedBlockSnapshotRef,
    isWalkingRef,
    isPointerHeldRef,
    pointerHeldSinceMsRef,
    isClickRunIntentRef,
    clickArrowEffectRef,
    handlingPlazaPointerDown,
    handlingPlazaPointerMove,
    handlingPlazaPointerRelease,
    clearingWalkTarget,
    applyingWalkPlanToDestination,
    isWalkPausedByCollisionRef,
    isRunningRef,
  } = trackingWorldPlazaClickMovementTarget({
    isEnabled: isLocalGameplayEnabled,
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
    isPlayerAsleepRef,
    isPlayerStunnedRef,
    placedBlocksRef,
    playerRadiusGrid: selectedCharacterEngineDerivedStats.collisionRadiusGrid,
    playerHeightWorldLayers:
      selectedCharacterEngineDerivedStats.heightWorldLayers,
  });

  const { roomSnapshot, remotePlayerRegistryRef, syncingMovePositionRef } =
    onlineRoom;

  const {
    moveItem,
    addItemWithStacking,
    updateState: updatingInventoryState,
    flushingPersist: flushingInventoryPersist,
    state: inventoryState,
  } = usingWorldPlazaInventory({
    onlineUserId,
    localPersistenceOwnerId,
    redditUserId,
    saveSlotIndex: isSinglePlayerSession ? singlePlayerSaveSlotIndex : null,
    seedDemoItems: false,
  });

  const equipment = usingWorldPlazaEquipment({ inventoryState });
  const equippedHeldItemPresentationRef =
    useRef<DefiningWorldPlazaHeldItemPresentation | null>(null);

  const { showingGameplayHudToast } = usingWorldPlazaGameplayHudToast();

  const clearingPendingCraftPlacement = useCallback(
    (options: {
      readonly showCanceledToast: boolean;
      readonly showRefundFeedback: boolean;
      readonly honorSessionWaiver: boolean;
    }): void => {
      const pendingRecipeId = pendingCraftRecipeIdRef.current;

      if (pendingRecipeId === null) {
        return;
      }

      const recipeDefinition =
        resolvingWorldPlazaCraftModeRecipeDefinition(pendingRecipeId);

      pendingCraftRecipeIdRef.current = null;
      setPendingCraftPlacementPreviewDefinitionId(null);

      let shouldShowRefundFeedback = options.showRefundFeedback;
      let shouldShowCanceledToast = options.showCanceledToast;

      if (
        options.honorSessionWaiver &&
        craftPlacementCancelRefundWaivedForSessionRef.current
      ) {
        shouldShowRefundFeedback = false;
        shouldShowCanceledToast = false;
        craftPlacementCancelRefundWaivedForSessionRef.current = false;
      }

      if (recipeDefinition && shouldShowRefundFeedback) {
        showingCraftRefundFloatsRef.current(recipeDefinition);
      }

      if (shouldShowCanceledToast) {
        showingGameplayHudToast(
          LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PLACEMENT_CANCELED_TOAST
        );
      }
    },
    [showingGameplayHudToast]
  );

  const handlingSuccessfulCraftedBlockPlacement = useCallback(
    (
      _tilePosition: DefiningWorldBuildingTilePosition,
      placedBlockId: string,
      isSessionPlacement = false
    ): void => {
      const pendingRecipeId = pendingCraftRecipeIdRef.current;

      if (pendingRecipeId === null) {
        return;
      }

      const recipeDefinition =
        resolvingWorldPlazaCraftModeRecipeDefinition(pendingRecipeId);

      if (!recipeDefinition || recipeDefinition.outcome.kind !== 'entity') {
        pendingCraftRecipeIdRef.current = null;
        setPendingCraftPlacementPreviewDefinitionId(null);
        return;
      }

      const entityOutcome = recipeDefinition.outcome;
      const committedRecipeId = pendingRecipeId;
      pendingCraftRecipeIdRef.current = null;
      setPendingCraftPlacementPreviewDefinitionId(null);

      updatingInventoryState((currentState) => {
        const commitResult = committingWorldPlazaCraftRecipePlaceablePlacement(
          currentState,
          recipeDefinition
        );

        if (commitResult.outcome === 'committed') {
          craftedCommittedBlockRecipeByBlockIdRef.current.set(
            placedBlockId,
            committedRecipeId
          );
          showingGameplayHudToast(
            isSessionPlacement
              ? LABELING_WORLD_BUILDING_SESSION_PLACEMENT_SUCCESS_TOAST
              : LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PLACEMENT_SUCCESS_TOAST
          );
          // Disarm ghost selection; flush/exit silent build. Craft HUD stays via resolver.
          selectingBlockDefinition(entityOutcome.blockDefinitionId);
          togglingEditSession();
          return commitResult.nextState;
        }

        showingGameplayHudToast(
          LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PLACEMENT_MATERIALS_LOST_TOAST
        );
        return null;
      });
    },
    [
      selectingBlockDefinition,
      showingGameplayHudToast,
      togglingEditSession,
      updatingInventoryState,
    ]
  );

  useEffect(() => {
    onSuccessfulBlockPlacementRef.current =
      handlingSuccessfulCraftedBlockPlacement;

    return () => {
      onSuccessfulBlockPlacementRef.current = null;
    };
  }, [handlingSuccessfulCraftedBlockPlacement]);

  const handlingCraftRecipe = useCallback(
    (recipeId: DefiningWorldPlazaCraftModeRecipeId): void => {
      if (!isHudCraftingEnabled || !isBuildModeEnabled) {
        return;
      }

      const recipeDefinition =
        resolvingWorldPlazaCraftModeRecipeDefinition(recipeId);

      if (!recipeDefinition) {
        return;
      }

      if (!checkingWorldPlazaRecipePageAttachedInStore(recipeId)) {
        showingGameplayHudToast(
          LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_NOT_ATTACHED_TOAST
        );
        return;
      }

      if (
        !checkingWorldPlazaCraftRecipeAffordable(
          inventoryState,
          recipeDefinition
        )
      ) {
        showingGameplayHudToast(
          LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_MISSING_MATERIALS_TOAST
        );
        return;
      }

      if (recipeDefinition.outcome.kind === 'item') {
        updatingInventoryState((currentState) => {
          const craftResult = executingWorldPlazaCraftRecipeInventoryOutcome(
            currentState,
            recipeDefinition
          );

          if (craftResult.outcome === 'crafted') {
            showingGameplayHudToast(
              LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_INVENTORY_SUCCESS_TOAST
            );
            return craftResult.nextState;
          }

          if (craftResult.outcome === 'inventory-full') {
            showingGameplayHudToast(
              LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_INVENTORY_FULL_TOAST
            );
          } else {
            showingGameplayHudToast(
              LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_MISSING_MATERIALS_TOAST
            );
          }

          return null;
        });
        return;
      }

      pendingCraftRecipeIdRef.current = recipeId;
      setPendingCraftPlacementPreviewDefinitionId(
        recipeDefinition.outcome.blockDefinitionId
      );
      previewDefinitionIdRef.current =
        recipeDefinition.outcome.blockDefinitionId;
      setOpenCraftCookbookId(null);
      // Silent build under Craft HUD: ghost + click-place without flipping to Build/Claim.
      activatingBuildMode();
      enteringBuildPlacementForBlockDefinition(
        recipeDefinition.outcome.blockDefinitionId,
        recipeDefinition.outcome.blockHeight
      );
    },
    [
      activatingBuildMode,
      enteringBuildPlacementForBlockDefinition,
      inventoryState,
      isBuildModeEnabled,
      isHudCraftingEnabled,
      showingGameplayHudToast,
      updatingInventoryState,
    ]
  );

  const handlingAttachRecipePageHotbarSlot = useCallback(
    (slotIndex: number): void => {
      const slotItem = inventoryState.slots[slotIndex];

      if (!slotItem) {
        return;
      }

      const recipeId = resolvingWorldPlazaInventoryItemRecipePageRecipeId(
        slotItem.itemTypeId
      );

      if (recipeId === null) {
        return;
      }

      if (checkingWorldPlazaRecipePageAttachedInStore(recipeId)) {
        showingGameplayHudToast(
          LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PAGE_ALREADY_ATTACHED_TOAST
        );
        return;
      }

      updatingInventoryState((currentState) => {
        if (checkingWorldPlazaRecipePageAttachedInStore(recipeId)) {
          showingGameplayHudToast(
            LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PAGE_ALREADY_ATTACHED_TOAST
          );
          return null;
        }

        const consumeResult = consumingWorldPlazaInventoryItemFromSlot(
          currentState,
          slotIndex,
          1
        );

        if (!consumeResult.consumed) {
          return null;
        }

        attachingWorldPlazaRecipePage(recipeId);
        showingGameplayHudToast(
          LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PAGE_ATTACHED_TOAST
        );
        return consumeResult.nextState;
      });
    },
    [inventoryState.slots, showingGameplayHudToast, updatingInventoryState]
  );

  useEffect(() => {
    if (!isBlockBuildModeActive) {
      const hadPendingCraftPlacement = pendingCraftRecipeIdRef.current !== null;

      clearingPendingCraftPlacement({
        showCanceledToast: false,
        showRefundFeedback: false,
        honorSessionWaiver: false,
      });

      if (hadPendingCraftPlacement) {
        craftPlacementCancelRefundWaivedForSessionRef.current = true;
      }

      return;
    }

    const pendingRecipeId = pendingCraftRecipeIdRef.current;

    if (pendingRecipeId === null) {
      return;
    }

    const recipeDefinition =
      resolvingWorldPlazaCraftModeRecipeDefinition(pendingRecipeId);

    if (!recipeDefinition || recipeDefinition.outcome.kind !== 'entity') {
      pendingCraftRecipeIdRef.current = null;
      setPendingCraftPlacementPreviewDefinitionId(null);
      return;
    }

    const isStillArmed =
      isBuildPlacementSelectionActive &&
      selectedDefinitionId === recipeDefinition.outcome.blockDefinitionId;

    if (!isStillArmed) {
      clearingPendingCraftPlacement({
        showCanceledToast: true,
        showRefundFeedback: true,
        honorSessionWaiver: true,
      });
    }
  }, [
    clearingPendingCraftPlacement,
    isBlockBuildModeActive,
    isBuildPlacementSelectionActive,
    selectedDefinitionId,
  ]);

  const chopPersistenceOwnerId = localPersistenceOwnerId ?? onlineUserId;
  equippedHeldItemPresentationRef.current =
    resolvingWorldPlazaEquippedHeldItemPresentation(
      inventoryState,
      equipment.selectedSlotIndex
    );
  const farmlandByTileKeyRef = useRef(
    chopPersistenceOwnerId
      ? readingWorldPlazaLocalFarmlandByTileKey(chopPersistenceOwnerId)
      : new Map()
  );
  const [farmlandRevision, bumpFarmlandRevision] = useState(0);
  const refreshingFarmlandState = useCallback((): void => {
    if (!chopPersistenceOwnerId) {
      farmlandByTileKeyRef.current = new Map();
      return;
    }

    advancingWorldPlazaLocalFarmlandGrowthForOwner(
      chopPersistenceOwnerId,
      performance.now()
    );
    farmlandByTileKeyRef.current = readingWorldPlazaLocalFarmlandByTileKey(
      chopPersistenceOwnerId
    );
    bumpFarmlandRevision((revision) => revision + 1);
  }, [chopPersistenceOwnerId]);

  useEffect(() => {
    if (!chopPersistenceOwnerId || !isLocalGameplayEnabled) {
      return;
    }

    const intervalId = window.setInterval(() => {
      refreshingFarmlandState();
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [chopPersistenceOwnerId, isLocalGameplayEnabled, refreshingFarmlandState]);
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

  const { minedRockStateByTileKey } = usingWorldPlazaMinedRocks({
    enabled: isLocalGameplayEnabled,
    localPersistenceOwnerId,
    redditUserId,
    saveSlotIndex: isSinglePlayerSession ? singlePlayerSaveSlotIndex : null,
  });
  const minedRocksByTileKeyRef = useRef(minedRockStateByTileKey);
  minedRocksByTileKeyRef.current = minedRockStateByTileKey;

  useEffect(() => {
    registeringWorldPlazaMinedRocksVisualLayerLookup((tileX, tileY) =>
      minedRockStateByTileKey.get(
        formattingWorldPlazaMinedRockTileKey(tileX, tileY)
      )
    );

    return () => {
      registeringWorldPlazaMinedRocksVisualLayerLookup(null);
    };
  }, [minedRockStateByTileKey]);

  const { pickedPebbleStateByTileKey } = usingWorldPlazaPickedPebbles({
    enabled: isLocalGameplayEnabled,
    localPersistenceOwnerId,
    redditUserId,
    saveSlotIndex: isSinglePlayerSession ? singlePlayerSaveSlotIndex : null,
  });
  const pickedPebblesByTileKeyRef = useRef(pickedPebbleStateByTileKey);
  pickedPebblesByTileKeyRef.current = pickedPebbleStateByTileKey;

  useEffect(() => {
    registeringWorldPlazaPickedPebblesLookup((tileX, tileY) =>
      pickedPebbleStateByTileKey.get(
        formattingWorldPlazaPickedPebbleTileKey(tileX, tileY)
      )
    );

    return () => {
      registeringWorldPlazaPickedPebblesLookup(null);
    };
  }, [pickedPebbleStateByTileKey]);

  const { pickedFlowerStateByTileKey } = usingWorldPlazaPickedFlowers({
    enabled: isLocalGameplayEnabled,
    localPersistenceOwnerId,
    redditUserId,
    saveSlotIndex: isSinglePlayerSession ? singlePlayerSaveSlotIndex : null,
  });
  const pickedFlowersByTileKeyRef = useRef(pickedFlowerStateByTileKey);
  pickedFlowersByTileKeyRef.current = pickedFlowerStateByTileKey;

  useEffect(() => {
    registeringWorldPlazaPickedFlowersLookup(
      (tileX, tileY) =>
        Boolean(
          pickedFlowerStateByTileKey.get(
            formattingWorldPlazaPickedFlowerTileKey(tileX, tileY)
          )?.isPicked
        ) || checkingWildlifeGroundFlowerOptimisticIsPicked(tileX, tileY)
    );

    return () => {
      registeringWorldPlazaPickedFlowersLookup(null);
    };
  }, [pickedFlowerStateByTileKey]);

  useEffect(() => {
    if (!isLocalGameplayEnabled) {
      registeringWildlifeGroundFlowerBridge(null);
      return;
    }

    const useLocalPersistence =
      checkingWorldPlazaPickedFlowersUseLocalPersistence(
        localPersistenceOwnerId,
        redditUserId
      );

    registeringWildlifeGroundFlowerBridge({
      consumeGroundFlower: (tileX, tileY, consumerPosition) => {
        const pickRequest = {
          tileX,
          tileY,
          playerX: consumerPosition.x,
          playerY: consumerPosition.y,
        };

        if (useLocalPersistence && localPersistenceOwnerId) {
          const result = pickingWorldPlazaLocalFlower(
            localPersistenceOwnerId,
            pickRequest
          );

          if (result.outcome !== 'picked') {
            return false;
          }

          void queryClient.invalidateQueries({
            queryKey: [DEFINING_WORLD_PLAZA_PICKED_FLOWERS_QUERY_KEY_ROOT],
          });
          return true;
        }

        if (!redditUserId) {
          return false;
        }

        void pickingWorldHarvestDevvitFlower(
          WORLD_HARVEST_DEVVIT_PICK_FLOWER_API_PATH,
          {
            ...pickRequest,
            saveSlotIndex: isSinglePlayerSession
              ? singlePlayerSaveSlotIndex
              : null,
          }
        )
          .then((result) => {
            if (result.outcome === 'picked') {
              void queryClient.invalidateQueries({
                queryKey: [DEFINING_WORLD_PLAZA_PICKED_FLOWERS_QUERY_KEY_ROOT],
              });
            }
          })
          .catch(() => undefined);

        return true;
      },
    });

    return () => {
      registeringWildlifeGroundFlowerBridge(null);
    };
  }, [
    isLocalGameplayEnabled,
    isSinglePlayerSession,
    localPersistenceOwnerId,
    queryClient,
    redditUserId,
    singlePlayerSaveSlotIndex,
  ]);

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
  const { isHideActionsEnabled } = usingWorldPlazaHideActionsEnabled();
  const campfireInventorySlotsRef = useRef<
    readonly { itemTypeId: string; quantity: number }[]
  >([]);
  const fireCellsRef = useRef(fireCells);
  fireCellsRef.current = fireCells;

  const { performingCampfireAction, resolvingCampfireInteractionState } =
    usingWorldPlazaCampfireInteraction({
      onlineUserId,
      localPersistenceOwnerId,
      playerPositionRef,
      fireCells,
      placedBlocks: activeScenePlacedBlocks,
      inventoryState,
      consumingInventoryItem: consumingFireInventoryItem,
    });

  campfireInventorySlotsRef.current = inventoryState.slots.flatMap((slot) =>
    slot && slot.quantity > 0
      ? [{ itemTypeId: slot.itemTypeId, quantity: slot.quantity }]
      : []
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

  const selectingProceduralRockForInteractionLabel = useCallback(
    (tileX: number, tileY: number): void => {
      selectingWorldPlazaInteractableRockForClickAction(
        selectedInteractableBlockKeysRef,
        tileX,
        tileY
      );
    },
    []
  );

  const selectingProceduralPebbleForInteractionLabel = useCallback(
    (tileX: number, tileY: number): void => {
      selectingWorldPlazaInteractablePebbleForClickAction(
        selectedInteractableBlockKeysRef,
        tileX,
        tileY
      );
    },
    []
  );

  const selectingProceduralFlowerForInteractionLabel = useCallback(
    (tileX: number, tileY: number): void => {
      selectingWorldPlazaInteractableFlowerForClickAction(
        selectedInteractableBlockKeysRef,
        tileX,
        tileY
      );
    },
    []
  );

  const clearingInteractableBlockClickSelection = useCallback((): void => {
    // Proximity mode owns the label set each overlay frame; miss-clear would flash.
    // Hide Actions restores click-to-show, so miss should dismiss the popover.
    if (!isHideActionsEnabled) {
      return;
    }

    clearingWorldPlazaInteractableBlockClickSelection(
      selectedInteractableBlockKeysRef
    );
  }, [isHideActionsEnabled]);

  const { handlingInteractableBlockPointerDown } =
    trackingWorldPlazaInteractableBlockPointerInteraction({
      isEnabled: isLocalGameplayEnabled && !isEditSessionActive,
      actorUserId: buildModeUserId,
      playerPositionRef,
      placedBlocks: activeScenePlacedBlocks,
      chopPersistenceOwnerId,
      choppedTreeStateByTileKey,
      onProceduralTreePopoverSelect: selectingProceduralTreeForInteractionLabel,
      minedRockStateByTileKey,
      onProceduralRockPopoverSelect: selectingProceduralRockForInteractionLabel,
      pickedPebbleStateByTileKey,
      onProceduralPebblePopoverSelect:
        selectingProceduralPebbleForInteractionLabel,
      pickedFlowerStateByTileKey,
      onProceduralFlowerPopoverSelect:
        selectingProceduralFlowerForInteractionLabel,
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

  const handlingCampfireCookComplete = useCallback(
    (context: {
      recipe: { rawItemTypeId: string; cookedDisplayName: string };
    }): void => {
      updatingInventoryState((currentState) => {
        const cookResult = cookingWildlifeMeatAtCampfire(
          currentState,
          context.recipe.rawItemTypeId
        );

        if (cookResult.outcome === 'cooked') {
          showingGameplayHudToast(`Cooked ${cookResult.cookedDisplayName}.`);
          notifyingWorldPlazaInventoryItemAdded(1);
          return cookResult.nextState;
        }

        if (cookResult.outcome === 'inventory-full') {
          showingGameplayHudToast('Inventory is full.');
        } else {
          showingGameplayHudToast('Could not finish cooking.');
        }

        return null;
      });
    },
    [showingGameplayHudToast, updatingInventoryState]
  );

  const {
    snapshot: campfireCookProgressSnapshot,
    progressRatioRef: campfireCookProgressRatioRef,
    startingCampfireCook,
  } = usingWorldPlazaCampfireCookProgress({
    playerPositionRef,
    selectedInteractableBlockKeysRef,
    fireCellsRef,
    onCookComplete: handlingCampfireCookComplete,
  });

  const handlingCampfireAction = useCallback(
    (
      block: DefiningWorldBuildingPlacedBlock,
      action: 'light' | 'add-wood' | 'cook'
    ): void => {
      if (action === 'cook') {
        const { isLit } = resolvingCampfireInteractionState(block);
        const validation = validatingWorldPlazaCampfireCookStart({
          isLit,
          inventoryState,
        });

        if (!validation.ok) {
          showingGameplayHudToast(validation.message);
          return;
        }

        const didStart = startingCampfireCook(block, validation.recipe);

        if (!didStart) {
          showingGameplayHudToast('Already cooking meat.');
        }

        return;
      }

      if (isCampfireActionPendingRef.current) {
        return;
      }

      isCampfireActionPendingRef.current = true;

      void performingCampfireAction(block, action)
        .then((result) => {
          if (result.message) {
            showingGameplayHudToast(result.message);
          }
        })
        .finally(() => {
          isCampfireActionPendingRef.current = false;
        });
    },
    [
      inventoryState,
      performingCampfireAction,
      resolvingCampfireInteractionState,
      showingGameplayHudToast,
      startingCampfireCook,
    ]
  );

  const handlingCampfireBlockInteraction = useCallback(
    (block: DefiningWorldBuildingPlacedBlock): void => {
      const { isLit } = resolvingCampfireInteractionState(block);
      handlingCampfireAction(block, isLit ? 'add-wood' : 'light');
    },
    [handlingCampfireAction, resolvingCampfireInteractionState]
  );

  const wearingEquippedAxeDurability = useCallback((): void => {
    const selectedSlotIndex = equipment.selectedSlotIndex;
    let didBreak = false;

    updatingInventoryState((currentState) => {
      const wearResult = wearingWorldPlazaEquippedInventoryToolDurability(
        currentState,
        selectedSlotIndex,
        'axe'
      );

      if (!wearResult.applied) {
        return null;
      }

      didBreak = wearResult.broken;
      return wearResult.nextState;
    });

    if (didBreak) {
      equipment.clearingSelectedHotbarSlot();
      showingGameplayHudToast('Your wood axe broke!');
    }
  }, [equipment, showingGameplayHudToast, updatingInventoryState]);

  const wearingEquippedPickaxeDurability = useCallback((): void => {
    const selectedSlotIndex = equipment.selectedSlotIndex;
    let didBreak = false;

    updatingInventoryState((currentState) => {
      const wearResult = wearingWorldPlazaEquippedInventoryToolDurability(
        currentState,
        selectedSlotIndex,
        'pickaxe'
      );

      if (!wearResult.applied) {
        return null;
      }

      didBreak = wearResult.broken;
      return wearResult.nextState;
    });

    if (didBreak) {
      equipment.clearingSelectedHotbarSlot();
      showingGameplayHudToast('Your pickaxe broke!');
    }
  }, [equipment, showingGameplayHudToast, updatingInventoryState]);

  const resolvingEquippedAxeHarvestSpeedMultiplier = useCallback((): number => {
    const equippedTool = equipment.checkingEquippedToolKind('axe');

    if (!equippedTool.hasToolKind || equipment.selectedSlotIndex === null) {
      return 1;
    }

    const equippedItem = inventoryState.slots[equipment.selectedSlotIndex];

    if (!equippedItem) {
      return equippedTool.harvestSpeedMultiplier;
    }

    return (
      equippedTool.harvestSpeedMultiplier *
      computingWorldPlazaInventoryItemEnchantmentHarvestSpeedMultiplier(
        equippedItem
      )
    );
  }, [equipment, inventoryState]);

  const resolvingEquippedPickaxeHarvestSpeedMultiplier =
    useCallback((): number => {
      const equippedTool = equipment.checkingEquippedToolKind('pickaxe');

      if (!equippedTool.hasToolKind || equipment.selectedSlotIndex === null) {
        return 1;
      }

      const equippedItem = inventoryState.slots[equipment.selectedSlotIndex];

      if (!equippedItem) {
        return equippedTool.harvestSpeedMultiplier;
      }

      return (
        equippedTool.harvestSpeedMultiplier *
        computingWorldPlazaInventoryItemEnchantmentHarvestSpeedMultiplier(
          equippedItem
        )
      );
    }, [equipment, inventoryState]);

  const handlingUseActiveEnchantment = useCallback(
    (slotIndex: number, enchantmentId: string): void => {
      let toastMessage: string | null = null;

      updatingInventoryState((currentState) => {
        const useResult = applyingWorldPlazaInventorySlotActiveEnchantmentUse(
          currentState,
          slotIndex,
          enchantmentId
        );

        toastMessage = useResult.toastMessage;
        return useResult.type === 'invalid' || useResult.type === 'cooldown'
          ? null
          : useResult.nextState;
      });

      if (toastMessage) {
        showingGameplayHudToast(toastMessage);
      }
    },
    [showingGameplayHudToast, updatingInventoryState]
  );

  const { validatingTreeChopStart, completingTreeChopLayer } =
    usingWorldPlazaTreeChopInteraction({
      localPersistenceOwnerId,
      redditUserId,
      saveSlotIndex: isSinglePlayerSession ? singlePlayerSaveSlotIndex : null,
      choppedTreeStateByTileKey,
      playerPositionRef,
      showingGameplayHudToast,
      onTreeChopLayerSucceeded: wearingEquippedAxeDurability,
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
      if (isPlayerAsleepRef.current || isPlayerStunnedRef.current) {
        return;
      }

      if (!validatingTreeChopStart(entry)) {
        return;
      }

      const harvestSpeedMultiplier =
        resolvingEquippedAxeHarvestSpeedMultiplier();
      const selectedSlotIndex = equipment.selectedSlotIndex;

      if (selectedSlotIndex !== null) {
        updatingInventoryState((currentState) =>
          disarmingWorldPlazaInventorySlotArmedHarvestEnchantments(
            currentState,
            selectedSlotIndex
          )
        );
      }

      const didStart = startingTreeChop(entry, harvestSpeedMultiplier);

      if (!didStart) {
        showingGameplayHudToast('Already chopping a tree.');
      }
    },
    [
      equipment.selectedSlotIndex,
      resolvingEquippedAxeHarvestSpeedMultiplier,
      showingGameplayHudToast,
      startingTreeChop,
      updatingInventoryState,
      validatingTreeChopStart,
    ]
  );

  const { validatingRockMineStart, completingRockMineLayer } =
    usingWorldPlazaRockMineInteraction({
      localPersistenceOwnerId,
      redditUserId,
      saveSlotIndex: isSinglePlayerSession ? singlePlayerSaveSlotIndex : null,
      minedRockStateByTileKey,
      playerPositionRef,
      showingGameplayHudToast,
      onRockMineLayerSucceeded: wearingEquippedPickaxeDurability,
    });

  const completingRockMineLayerRef = useRef(completingRockMineLayer);
  completingRockMineLayerRef.current = completingRockMineLayer;

  const handlingRockMineComplete = useCallback(
    (entry: Parameters<typeof completingRockMineLayer>[0]): void => {
      void completingRockMineLayerRef.current(entry);
    },
    []
  );

  const {
    snapshot: rockMineProgressSnapshot,
    progressRatioRef: rockMineProgressRatioRef,
    startingRockMine,
  } = usingWorldPlazaRockMineProgress({
    playerPositionRef,
    selectedInteractableBlockKeysRef,
    avatarToolActionRef: localAvatarToolActionRef,
    onMineComplete: handlingRockMineComplete,
  });

  const handlingRockMineInteraction = useCallback(
    (entry: Parameters<typeof validatingRockMineStart>[0]): void => {
      if (isPlayerAsleepRef.current || isPlayerStunnedRef.current) {
        return;
      }

      if (!equipment.checkingEquippedToolKind('pickaxe').hasToolKind) {
        showingGameplayHudToast('Equip a pickaxe to mine rocks.');
        return;
      }

      if (!validatingRockMineStart(entry)) {
        return;
      }

      const harvestSpeedMultiplier =
        resolvingEquippedPickaxeHarvestSpeedMultiplier();
      const selectedSlotIndex = equipment.selectedSlotIndex;

      if (selectedSlotIndex !== null) {
        updatingInventoryState((currentState) =>
          disarmingWorldPlazaInventorySlotArmedHarvestEnchantments(
            currentState,
            selectedSlotIndex
          )
        );
      }

      const didStart = startingRockMine(entry, harvestSpeedMultiplier);

      if (!didStart) {
        showingGameplayHudToast('Already mining a rock.');
      }
    },
    [
      equipment,
      resolvingEquippedPickaxeHarvestSpeedMultiplier,
      showingGameplayHudToast,
      startingRockMine,
      updatingInventoryState,
      validatingRockMineStart,
    ]
  );

  const { validatingPebblePickStart, completingPebblePick } =
    usingWorldPlazaPebblePickInteraction({
      localPersistenceOwnerId,
      redditUserId,
      saveSlotIndex: isSinglePlayerSession ? singlePlayerSaveSlotIndex : null,
      pickedPebbleStateByTileKey,
      playerPositionRef,
      inventoryState,
      updatingInventoryState,
      showingGameplayHudToast,
    });

  const completingPebblePickRef = useRef(completingPebblePick);
  completingPebblePickRef.current = completingPebblePick;

  const handlingPebblePickComplete = useCallback(
    (entry: Parameters<typeof completingPebblePick>[0]): void => {
      void completingPebblePickRef.current(entry);
    },
    []
  );

  const {
    snapshot: pebblePickProgressSnapshot,
    progressRatioRef: pebblePickProgressRatioRef,
    startingPebblePick,
  } = usingWorldPlazaPebblePickProgress({
    playerPositionRef,
    selectedInteractableBlockKeysRef,
    avatarToolActionRef: localAvatarToolActionRef,
    onPickComplete: handlingPebblePickComplete,
  });

  const handlingPebblePickInteraction = useCallback(
    (entry: Parameters<typeof validatingPebblePickStart>[0]): void => {
      if (isPlayerAsleepRef.current || isPlayerStunnedRef.current) {
        return;
      }

      if (!validatingPebblePickStart(entry)) {
        return;
      }

      const didStart = startingPebblePick(entry);

      if (!didStart) {
        showingGameplayHudToast('Already picking a pebble.');
      }
    },
    [showingGameplayHudToast, startingPebblePick, validatingPebblePickStart]
  );

  const { validatingFlowerPickStart, completingFlowerPick } =
    usingWorldPlazaFlowerPickInteraction({
      localPersistenceOwnerId,
      redditUserId,
      saveSlotIndex: isSinglePlayerSession ? singlePlayerSaveSlotIndex : null,
      pickedFlowerStateByTileKey,
      playerPositionRef,
      inventoryState,
      updatingInventoryState,
      showingGameplayHudToast,
    });

  const completingFlowerPickRef = useRef(completingFlowerPick);
  completingFlowerPickRef.current = completingFlowerPick;

  const handlingFlowerPickComplete = useCallback(
    (entry: Parameters<typeof completingFlowerPick>[0]): void => {
      void completingFlowerPickRef.current(entry);
    },
    []
  );

  const {
    snapshot: flowerPickProgressSnapshot,
    progressRatioRef: flowerPickProgressRatioRef,
    startingFlowerPick,
  } = usingWorldPlazaFlowerPickProgress({
    playerPositionRef,
    selectedInteractableBlockKeysRef,
    avatarToolActionRef: localAvatarToolActionRef,
    onPickComplete: handlingFlowerPickComplete,
  });

  const handlingFlowerPickInteraction = useCallback(
    (entry: Parameters<typeof validatingFlowerPickStart>[0]): void => {
      if (isPlayerAsleepRef.current || isPlayerStunnedRef.current) {
        return;
      }

      if (!validatingFlowerPickStart(entry)) {
        return;
      }

      const didStart = startingFlowerPick(entry);

      if (!didStart) {
        showingGameplayHudToast('Already picking a flower.');
      }
    },
    [showingGameplayHudToast, startingFlowerPick, validatingFlowerPickStart]
  );

  const hasEquippedFishrod =
    equipment.checkingEquippedToolKind('fishrod').hasToolKind;
  const hasEquippedHoe = equipment.checkingEquippedToolKind('hoe').hasToolKind;
  const hasEquippedScythe =
    equipment.checkingEquippedToolKind('scythe').hasToolKind;
  const hasSeedsInInventory = inventoryState.slots.some(
    (slot) =>
      slot !== null &&
      slot.itemTypeId === DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WHEAT_SEED &&
      slot.quantity > 0
  );
  const hasEquippedFishrodRef = useRef(hasEquippedFishrod);
  const hasEquippedHoeRef = useRef(hasEquippedHoe);
  const hasEquippedScytheRef = useRef(hasEquippedScythe);
  const hasSeedsInInventoryRef = useRef(hasSeedsInInventory);
  const proximityPlacedBlocksRef = useRef(activeScenePlacedBlocks);
  hasEquippedFishrodRef.current = hasEquippedFishrod;
  hasEquippedHoeRef.current = hasEquippedHoe;
  hasEquippedScytheRef.current = hasEquippedScythe;
  hasSeedsInInventoryRef.current = hasSeedsInInventory;
  proximityPlacedBlocksRef.current = activeScenePlacedBlocks;

  const { validatingFishingCastStart, completingFishingCast } =
    usingWorldPlazaFishingInteraction({
      playerPositionRef,
      updatingInventoryState,
      selectedSlotIndex: equipment.selectedSlotIndex,
      showingGameplayHudToast,
    });

  const completingFishingCastRef = useRef(completingFishingCast);
  completingFishingCastRef.current = completingFishingCast;

  const resolvingEquippedFishrodCastDurationMs = useCallback(
    (_entry: { tileX: number; tileY: number }): number => {
      const equippedItem =
        equipment.selectedSlotIndex === null
          ? null
          : inventoryState.slots[equipment.selectedSlotIndex];
      const presentation = equippedItem
        ? resolvingWorldPlazaHeldItemPresentationForItemTypeId(
            equippedItem.itemTypeId
          )
        : null;
      const tier = presentation?.tier ?? 'wood';
      const harvestSpeed =
        equipment.checkingEquippedToolKind('fishrod').harvestSpeedMultiplier;

      return computingWorldPlazaFishingCastDurationMs(tier, harvestSpeed);
    },
    [equipment, inventoryState]
  );

  const {
    snapshot: fishingProgressSnapshot,
    progressRatioRef: fishingProgressRatioRef,
    startingFishingCast,
  } = usingWorldPlazaFishingProgress({
    playerPositionRef,
    selectedInteractableBlockKeysRef,
    avatarToolActionRef: localAvatarToolActionRef,
    resolvingCastDurationMs: resolvingEquippedFishrodCastDurationMs,
    onCastComplete: (entry) => {
      completingFishingCastRef.current(entry);
    },
  });

  const handlingFishingInteraction = useCallback(
    (entry: Parameters<typeof validatingFishingCastStart>[0]): void => {
      if (isPlayerAsleepRef.current || isPlayerStunnedRef.current) {
        return;
      }

      if (!hasEquippedFishrod) {
        showingGameplayHudToast('Equip a fishing rod first.');
        return;
      }

      if (!validatingFishingCastStart(entry)) {
        return;
      }

      const didStart = startingFishingCast(entry);

      if (!didStart) {
        showingGameplayHudToast('Already fishing.');
      }
    },
    [
      hasEquippedFishrod,
      showingGameplayHudToast,
      startingFishingCast,
      validatingFishingCastStart,
    ]
  );

  const { validatingFarmingActionStart, completingFarmingAction } =
    usingWorldPlazaFarmingInteraction({
      persistenceOwnerId: chopPersistenceOwnerId,
      playerPositionRef,
      inventoryState,
      updatingInventoryState,
      selectedSlotIndex: equipment.selectedSlotIndex,
      showingGameplayHudToast,
      onFarmlandStateChanged: refreshingFarmlandState,
    });

  const completingFarmingActionRef = useRef(completingFarmingAction);
  completingFarmingActionRef.current = completingFarmingAction;

  const {
    snapshot: farmingProgressSnapshot,
    progressRatioRef: farmingProgressRatioRef,
    startingFarmingAction,
  } = usingWorldPlazaFarmingProgress({
    playerPositionRef,
    selectedInteractableBlockKeysRef,
    avatarToolActionRef: localAvatarToolActionRef,
    resolvingHarvestSpeedMultiplier: resolvingEquippedAxeHarvestSpeedMultiplier,
    onActionComplete: (entry) => {
      completingFarmingActionRef.current(entry);
    },
  });

  const handlingFarmingInteraction = useCallback(
    (entry: Parameters<typeof validatingFarmingActionStart>[0]): void => {
      if (isPlayerAsleepRef.current || isPlayerStunnedRef.current) {
        return;
      }

      if (
        entry.interactionKind === 'till' &&
        !equipment.checkingEquippedToolKind('hoe').hasToolKind
      ) {
        showingGameplayHudToast('Equip a hoe to till soil.');
        return;
      }

      if (
        entry.interactionKind === 'harvest' &&
        !equipment.checkingEquippedToolKind('scythe').hasToolKind
      ) {
        showingGameplayHudToast('Equip a scythe to harvest.');
        return;
      }

      if (!validatingFarmingActionStart(entry)) {
        return;
      }

      const didStart = startingFarmingAction(entry);

      if (!didStart) {
        showingGameplayHudToast('Already working the field.');
      }
    },
    [
      equipment,
      showingGameplayHudToast,
      startingFarmingAction,
      validatingFarmingActionStart,
    ]
  );

  const handlingToolGroundPointerSelection = useCallback(
    (gridPoint: { x: number; y: number }): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const tileX = Math.floor(gridPoint.x);
      const tileY = Math.floor(gridPoint.y);

      if (hasEquippedFishrod) {
        const eligibility = checkingWorldPlazaFishingCastEligibility(
          playerPosition,
          tileX,
          tileY
        );

        if (eligibility.isEligible) {
          selectingWorldPlazaFishingTileForClickAction(
            selectedInteractableBlockKeysRef,
            tileX,
            tileY
          );
          return true;
        }
      }

      const farmlandEntries = listingWorldPlazaFarmlandTilesInInteractionRange({
        playerPosition,
        farmlandByTileKey: farmlandByTileKeyRef.current,
        hasEquippedHoe,
        hasEquippedScythe,
        hasSeedsInInventory,
      }).filter((entry) => entry.tileX === tileX && entry.tileY === tileY);

      if (farmlandEntries.length > 0) {
        selectingWorldPlazaFarmlandTileForClickAction(
          selectedInteractableBlockKeysRef,
          tileX,
          tileY,
          farmlandEntries[0].interactionKind
        );
        return true;
      }

      return false;
    },
    [
      hasEquippedFishrod,
      hasEquippedHoe,
      hasEquippedScythe,
      hasSeedsInInventory,
      playerPositionRef,
    ]
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
    updateInventoryState: updatingInventoryState,
    flushingInventoryPersist,
  });

  cancellingPendingInventoryGroundDropQueueRef.current =
    inventoryDropPlacement.cancellingPendingInventoryGroundDropQueue;

  const { directionRef: keyboardDirectionRef, isRunKeyHeldRef } =
    trackingWorldPlazaArrowKeyInput({
      isEnabled: isLocalGameplayEnabled,
      focusContainerRef: hostRef,
      isChatOpenRef,
      isPlayerDeadRef,
      isPlayerAsleepRef,
      isPlayerStunnedRef,
      cancellingPlayerMovementIntentRef:
        cancellingPendingInventoryGroundDropQueueRef,
    });

  const dayNightSunState = usingWorldPlazaDayNightSunState(
    isHudDayNightEnabled || isHudMinimapEnabled
  );
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

  const {
    hudSnapshot: playerHealthHudSnapshot,
    syncingHealthHudFromStateRef,
    takeDamageRef,
    enqueueMissFloatRef,
    enqueueItemGainFloatRef,
    enqueueHealFloatRef,
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
    applyDiseaseRef,
    setFrostbiteStacksRef,
    applyStarvationDamageRef,
    toggleTemperatureDisplayUnitRef,
    rollDamageRef,
    toggleBuffRef,
    postRespawnInvincibilityUntilMsRef,
    damagedReactionUntilMsRef,
    damageFlashUntilMsRef,
    defensiveReactionUntilMsRef,
    healthStateRef,
    localTemperatureCelsiusRef,
    characterEngineDefenseRef,
  } = usingWorldPlazaPlayerHealth({
    isEnabled: isLocalGameplayEnabled,
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
    isRollDodgeActiveRef,
    rollDodgeProgressRef,
    isRollingRef,
  });

  useEffect(() => {
    showingCraftRefundFloatsRef.current = (recipeDefinition) => {
      showingWorldPlazaCraftRecipeRefundFloatFeedback(
        (itemTypeId, amount) =>
          enqueueItemGainFloatRef.current(itemTypeId, amount),
        recipeDefinition
      );
    };
  }, [enqueueItemGainFloatRef]);

  const handlingRemovedCraftedBlock = useCallback(
    (removedBlock: DefiningWorldBuildingPlacedBlock): void => {
      if (
        removedBlock.definitionId !==
        DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE
      ) {
        return;
      }

      const recipeId = craftedCommittedBlockRecipeByBlockIdRef.current.get(
        removedBlock.blockId
      );

      if (!recipeId) {
        return;
      }

      craftedCommittedBlockRecipeByBlockIdRef.current.delete(
        removedBlock.blockId
      );

      const recipeDefinition =
        resolvingWorldPlazaCraftModeRecipeDefinition(recipeId);

      if (!recipeDefinition) {
        return;
      }

      updatingInventoryState((currentState) => {
        const refundResult = refundingWorldPlazaCraftRecipeIngredients(
          currentState,
          recipeDefinition
        );

        if (refundResult.outcome === 'refunded') {
          const refundedQuantity = recipeDefinition.ingredients.reduce(
            (total, ingredient) => total + ingredient.quantity,
            0
          );
          notifyingWorldPlazaInventoryItemAdded(refundedQuantity);
          showingCraftRefundFloatsRef.current(recipeDefinition);
          showingGameplayHudToast(
            LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_PLACEMENT_REFUNDED_TOAST
          );
          return refundResult.nextState;
        }

        showingGameplayHudToast(
          LABELING_WORLD_PLAZA_CRAFT_MODE_RECIPE_REFUND_INVENTORY_FULL_TOAST
        );
        return null;
      });
    },
    [showingGameplayHudToast, updatingInventoryState]
  );

  useEffect(() => {
    onBlockRemovedRef.current = handlingRemovedCraftedBlock;

    return () => {
      onBlockRemovedRef.current = null;
    };
  }, [handlingRemovedCraftedBlock]);

  const remoteWildlifeUserIds = roomSnapshot.remotePlayers.map(
    (remotePlayer) => remotePlayer.userId
  );

  const wildlifeProjectileTargetsRef = useRef<
    DefiningWorldPlazaProjectileTarget[]
  >([]);
  const wildlifeFloatingCombatTextsRef = useRef<
    DefiningWildlifeFloatingCombatText[]
  >([]);
  const wildlifeFloatingCombatTextIdsRef = useRef<readonly string[]>([]);
  const [wildlifeFloatingCombatTexts, setWildlifeFloatingCombatTexts] =
    useState<readonly DefiningWildlifeFloatingCombatText[]>([]);
  const wildlifeSpeechBubblesRef = useRef<
    DefiningWildlifeSpeechBubbleOverlay[]
  >([]);
  const wildlifeSpeechBubbleKeysRef = useRef<readonly string[]>([]);
  const [wildlifeSpeechBubbles, setWildlifeSpeechBubbles] = useState<
    readonly DefiningWildlifeSpeechBubbleOverlay[]
  >([]);
  const wildlifeNameTagsRef = useRef<DefiningWildlifeNameTagOverlay[]>([]);
  const wildlifeNameTagsMountRevisionRef = useRef(0);
  const lastSyncedWildlifeNameTagsMountRevisionRef = useRef(0);
  const wildlifeHoveredInstanceIdRef = useRef<string | null>(null);
  const interactablePointerHoverCursorRef = useRef<string>(
    DEFINING_WORLD_PLAZA_INTERACTABLE_POINTER_DEFAULT_CURSOR
  );
  const wildlifeDamagedPlayerAtMsByInstanceIdRef = useRef<Map<string, number>>(
    new Map()
  );
  const [wildlifeNameTags, setWildlifeNameTags] = useState<
    readonly DefiningWildlifeNameTagOverlay[]
  >([]);

  useEffect(() => {
    if (!isLocalGameplayEnabled) {
      wildlifeFloatingCombatTextsRef.current.length = 0;
      wildlifeFloatingCombatTextIdsRef.current = [];
      setWildlifeFloatingCombatTexts([]);
      wildlifeSpeechBubblesRef.current.length = 0;
      wildlifeSpeechBubbleKeysRef.current = [];
      setWildlifeSpeechBubbles([]);
      wildlifeNameTagsRef.current.length = 0;
      wildlifeNameTagsMountRevisionRef.current = 0;
      lastSyncedWildlifeNameTagsMountRevisionRef.current = 0;
      wildlifeHoveredInstanceIdRef.current = null;
      wildlifeDamagedPlayerAtMsByInstanceIdRef.current.clear();
      setWildlifeNameTags([]);
      return;
    }

    let lastBridgeUpdateAtMs = 0;

    return subscribingWorldPlazaDomOverlayFrame((deltaMs, frameTimeMs) => {
      if (
        !checkingWorldPlazaDomOverlayFrameShouldUpdate(
          deltaMs,
          lastBridgeUpdateAtMs,
          frameTimeMs,
          false
        )
      ) {
        return;
      }

      lastBridgeUpdateAtMs = frameTimeMs;
      const nextTexts = wildlifeFloatingCombatTextsRef.current;
      const previousTextIds = wildlifeFloatingCombatTextIdsRef.current;
      const didTextMountSetChange =
        previousTextIds.length !== nextTexts.length ||
        nextTexts.some(
          (entry, index) => entry.floatText.id !== previousTextIds[index]
        );

      if (didTextMountSetChange) {
        wildlifeFloatingCombatTextIdsRef.current = nextTexts.map(
          (entry) => entry.floatText.id
        );
        setWildlifeFloatingCombatTexts([...nextTexts]);
      }

      const nextSpeechBubbles = wildlifeSpeechBubblesRef.current;
      const previousSpeechBubbleKeys = wildlifeSpeechBubbleKeysRef.current;
      const didSpeechBubbleMountSetChange =
        previousSpeechBubbleKeys.length !== nextSpeechBubbles.length ||
        nextSpeechBubbles.some(
          (entry, index) =>
            `${entry.instanceId}:${entry.message}` !==
            previousSpeechBubbleKeys[index]
        );

      if (didSpeechBubbleMountSetChange) {
        wildlifeSpeechBubbleKeysRef.current = nextSpeechBubbles.map(
          (entry) => `${entry.instanceId}:${entry.message}`
        );
        setWildlifeSpeechBubbles([...nextSpeechBubbles]);
      }

      const nextNameTags = wildlifeNameTagsRef.current;
      if (
        lastSyncedWildlifeNameTagsMountRevisionRef.current !==
        wildlifeNameTagsMountRevisionRef.current
      ) {
        lastSyncedWildlifeNameTagsMountRevisionRef.current =
          wildlifeNameTagsMountRevisionRef.current;
        setWildlifeNameTags([...nextNameTags]);
      }
    });
  }, [isLocalGameplayEnabled]);

  const wildlifeMeatDropContextRef = useRef<{
    localPersistenceOwnerId: string | null;
    redditUserId: string | null;
    saveSlotIndex: PlazaSaveSlotIndex | null;
    playerPosition: DefiningWorldPlazaWorldPoint;
  } | null>(null);

  wildlifeMeatDropContextRef.current = playerPositionRef.current
    ? {
        localPersistenceOwnerId,
        redditUserId,
        saveSlotIndex: isSinglePlayerSession ? singlePlayerSaveSlotIndex : null,
        playerPosition: playerPositionRef.current,
      }
    : null;

  const playerRunStaminaStateRef = useRef({
    ...DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
  });
  const playerStillDurationMsRef = useRef(0);
  const playerTransformWildlifeSpeciesIdRef =
    useRef<DefiningWildlifeSpeciesId | null>(null);
  playerTransformWildlifeSpeciesIdRef.current =
    resolvingWorldPlazaAnimalPlayableAvatarUnlockWildlifeSpeciesId(
      selectedCharacterEngineDefinition.presentation.skinId
    );

  const { wildlifeStoreRef, tickConfigRef, applyWildlifeDamageRef } =
    usingWildlifeSimulation({
      enabled: isLocalGameplayEnabled && isWildlifeGenerationEnabled,
      localUserId: onlineUserId ?? localPersistenceOwnerId ?? 'local-player',
      remoteUserIds: remoteWildlifeUserIds,
      playerPositionRef,
      localAvatarMotionStateRef,
      playerHealthStateRef: healthStateRef,
      playerRunStaminaStateRef: playerRunStaminaStateRef,
      playerStillDurationMsRef,
      isPlayerWalkingRef: isWalkingRef,
      isPlayerRunningRef: isRunningRef,
      isPlayerJumpingRef: isJumpingRef,
      placedBlocksRef,
      remoteWildlifeSnapshotsRef,
      wildlifeSnapshotsOutRef,
      pendingWildlifeDamageEventsRef,
      projectileTargetsOutRef: wildlifeProjectileTargetsRef,
      wildlifeFloatingCombatTextsOutRef: wildlifeFloatingCombatTextsRef,
      wildlifeSpeechBubblesOutRef: wildlifeSpeechBubblesRef,
      wildlifeNameTagsOutRef: wildlifeNameTagsRef,
      wildlifeNameTagsMountRevisionRef,
      wildlifeHoveredInstanceIdRef,
      wildlifeDamagedPlayerAtMsByInstanceIdRef,
      meatDropContextRef: wildlifeMeatDropContextRef,
      playerTransformWildlifeSpeciesIdRef,
      onPlayerHitByWildlife: (hit) => {
        wildlifeDamagedPlayerAtMsByInstanceIdRef.current.set(
          hit.instanceId,
          performance.now()
        );
        takeDamageRef.current?.(hit.damageAmount, 'physical');
        applyingWildlifePlayerMeleeHitSideEffects(hit, {
          applyBleed: (severity, flatExpectedDamage) =>
            applyBleedRef.current?.(severity, flatExpectedDamage),
          applyPoison: (potency, flatExpectedDamage) =>
            applyPoisonRef.current?.(potency, flatExpectedDamage),
          applyBuff: (buffId) => {
            const state = healthStateRef.current;
            const nowMs = performance.now();
            const isActive = checkingWorldPlazaEntityBuffIsActive({
              buffId,
              state,
              nowMs,
              defenderModifierIds: state.damageRollModifiers.map(
                (modifier) => modifier.id
              ),
              attackerModifierIds: [],
            });

            if (!isActive) {
              toggleBuffRef.current?.(buffId);
            }
          },
          applyDisease: (diseaseId) => {
            applyDiseaseRef.current?.(diseaseId);
          },
        });
      },
      onPlayerContactWildlife: (event) => {
        const species = resolvingWildlifeSpeciesDefinition(event.speciesId);
        const profile = resolvingWildlifeDiseaseTransmissionProfile(
          event.speciesId
        );

        if (!species || !profile?.contact) {
          return;
        }

        const chance = resolvingWildlifeDiseaseTransmissionChance({
          speciesId: event.speciesId,
          temperamentId: species.temperamentId,
          aggressionLevel: event.aggressionLevel,
          kind: 'contact',
        });

        if (chance > 0 && Math.random() < chance) {
          applyDiseaseRef.current?.(profile.diseaseId);
        }
      },
    });

  useEffect(() => {
    if (isWildlifeGenerationEnabled) {
      return;
    }

    clearingWildlifeInstanceStore(wildlifeStoreRef.current);
    wildlifeSnapshotsOutRef.current.length = 0;
    pendingWildlifeDamageEventsRef.current.length = 0;
    wildlifeProjectileTargetsRef.current.length = 0;
    wildlifeFloatingCombatTextsRef.current.length = 0;
    wildlifeSpeechBubblesRef.current.length = 0;
    wildlifeNameTagsRef.current.length = 0;
    wildlifeNameTagsMountRevisionRef.current += 1;
    wildlifeHoveredInstanceIdRef.current = null;
    wildlifeDamagedPlayerAtMsByInstanceIdRef.current.clear();
    setWildlifeFloatingCombatTexts([]);
    setWildlifeSpeechBubbles([]);
    setWildlifeNameTags([]);
  }, [
    isWildlifeGenerationEnabled,
    pendingWildlifeDamageEventsRef,
    wildlifeSnapshotsOutRef,
    wildlifeStoreRef,
  ]);

  usingWildlifeActivePetSpawn({
    isEnabled: isLocalGameplayEnabled && isWildlifeGenerationEnabled,
    storageOwnerId: localPersistenceOwnerId,
    onlineUserId,
    cloudSaveSlotIndex: isSinglePlayerSession
      ? singlePlayerSaveSlotIndex
      : null,
    wildlifeStoreRef,
    playerPositionRef,
    resolveSpecies: resolvingWildlifeSpeciesDefinition,
  });

  const {
    selectedPetInstanceId,
    isModalOpen: isPetModalOpen,
    namingPetInstanceId,
    isNameDialogOpen: isPetNameDialogOpen,
    rosterSnapshot: petRosterSnapshot,
    openingPetModal,
    closingPetModal,
    openingPetNameDialog,
    closingPetNameDialog,
  } = usingWildlifePetModalState();

  useEffect(() => {
    if (!(isLocalGameplayEnabled && isWildlifeGenerationEnabled)) {
      return;
    }

    const broadcastingOwnedPetSnapshot = (): void => {
      const ownerUserId = onlineUserId ?? localPersistenceOwnerId;
      ownedPetSnapshotsOutRef.current.length = 0;

      if (!ownerUserId) {
        return;
      }

      for (const record of petRosterSnapshot.pets) {
        if (
          !record.isActive ||
          (record.healthCurrent !== null && record.healthCurrent <= 0)
        ) {
          continue;
        }

        const instance = gettingWildlifeInstance(
          wildlifeStoreRef.current,
          formattingWildlifePetInstanceId(record.petId)
        );

        if (!instance?.petBond) {
          continue;
        }

        ownedPetSnapshotsOutRef.current.push({
          petId: instance.petBond.petId,
          ownerUserId,
          speciesId: instance.speciesId,
          displayName: instance.customDisplayName ?? null,
          x: instance.position.x,
          y: instance.position.y,
          facingDirection: instance.facingDirection,
          motionClip: instance.aiState.motionClip,
          healthCurrent: instance.healthState.currentHealth,
          loyalty: instance.petBond.loyalty,
          command: instance.petBond.command,
        });
      }
    };

    broadcastingOwnedPetSnapshot();
    const intervalId = window.setInterval(broadcastingOwnedPetSnapshot, 500);

    return () => window.clearInterval(intervalId);
  }, [
    isLocalGameplayEnabled,
    isWildlifeGenerationEnabled,
    localPersistenceOwnerId,
    onlineUserId,
    ownedPetSnapshotsOutRef,
    petRosterSnapshot,
    wildlifeStoreRef,
  ]);

  const handlingPetRename = useCallback(
    (instanceId: string, name: string | null): void => {
      const trimmedName = name?.trim() ?? '';

      if (trimmedName.length === 0) {
        return;
      }

      const instance = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        instanceId
      );

      // Permanent name: refuse if already set.
      if (!instance || instance.customDisplayName?.trim()) {
        return;
      }

      const didRename = renamingWildlifeInstanceDisplayName(
        wildlifeStoreRef.current,
        instanceId,
        trimmedName
      );

      if (!didRename) {
        return;
      }

      const namedInstance = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        instanceId
      );

      if (namedInstance?.petBond?.isPersistent) {
        updatingWildlifePetRecord(namedInstance.petBond.petId, {
          displayName: trimmedName,
        });
      }
    },
    [wildlifeStoreRef]
  );

  const handlingPetNameDialogConfirm = useCallback(
    (name: string): void => {
      if (!namingPetInstanceId) {
        return;
      }

      handlingPetRename(namingPetInstanceId, name);
      closingPetNameDialog();
    },
    [closingPetNameDialog, handlingPetRename, namingPetInstanceId]
  );

  const handlingPetSetCommand = useCallback(
    (
      instanceId: string,
      command: DefiningWildlifePetBondState['command']
    ): void => {
      const instance = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        instanceId
      );
      const petBond = instance?.petBond;

      if (!instance || !petBond) {
        return;
      }

      replacingWildlifeInstance(wildlifeStoreRef.current, {
        ...instance,
        petBond: { ...petBond, command },
      });

      if (petBond.isPersistent) {
        updatingWildlifePetRecord(petBond.petId, { command });
      }
    },
    [wildlifeStoreRef]
  );

  const handlingPetFeed = useCallback(
    (instanceId: string, inventorySlotIndex: number): void => {
      const instance = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        instanceId
      );
      const slotItem = inventoryState.slots[inventorySlotIndex];
      const foodDefinition = slotItem
        ? resolvingWorldPlazaInventoryFoodDefinition(slotItem.itemTypeId)
        : null;

      if (!instance || !instance.petBond || !slotItem || !foodDefinition) {
        return;
      }

      const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

      if (!species) {
        return;
      }

      updatingInventoryState((currentState) => {
        const consumeResult = consumingWorldPlazaInventoryItemFromSlot(
          currentState,
          inventorySlotIndex,
          1
        );

        if (!consumeResult.consumed) {
          return null;
        }

        const feedResult = applyingWildlifePetOwnerFeed({
          instance,
          species,
          hungerRestoreRatio: foodDefinition.hungerRestoreRatio,
          nowMs: Date.now(),
        });
        replacingWildlifeInstance(
          wildlifeStoreRef.current,
          feedResult.instance
        );
        syncingWildlifePetInstanceVitalsToRoster(feedResult.instance);

        return consumeResult.nextState;
      });
    },
    [inventoryState.slots, updatingInventoryState, wildlifeStoreRef]
  );

  const handlingPetHeal = useCallback(
    (instanceId: string): void => {
      const instance = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        instanceId
      );

      if (!instance || !instance.petBond) {
        return;
      }

      const healResult = applyingWildlifePetOwnerHeal({
        instance,
        healAmount: DEFINING_WILDLIFE_PET_MODAL_HEAL_AMOUNT,
        nowMs: Date.now(),
      });
      replacingWildlifeInstance(wildlifeStoreRef.current, healResult.instance);
      syncingWildlifePetInstanceVitalsToRoster(healResult.instance);
    },
    [wildlifeStoreRef]
  );

  const handlingPetEquipWeapon = useCallback(
    (instanceId: string, inventorySlotIndex: number): void => {
      const instance = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        instanceId
      );
      const petBond = instance?.petBond;
      const slotItem = inventoryState.slots[inventorySlotIndex];

      if (
        !instance ||
        !petBond ||
        !checkingWildlifePetItemIsEquippableWeapon(slotItem)
      ) {
        return;
      }

      updatingInventoryState((currentState) => {
        const consumeResult = consumingWorldPlazaInventoryItemFromSlot(
          currentState,
          inventorySlotIndex,
          1
        );

        if (!consumeResult.consumed || !slotItem) {
          return null;
        }

        const weaponItem: DefiningInventoryItem = { ...slotItem, quantity: 1 };
        const nextInstance: DefiningWildlifeInstance = {
          ...instance,
          petBond: { ...petBond, weaponItem },
        };
        replacingWildlifeInstance(wildlifeStoreRef.current, nextInstance);

        if (petBond.isPersistent) {
          updatingWildlifePetRecord(petBond.petId, { weaponItem });
        }

        return consumeResult.nextState;
      });
    },
    [inventoryState.slots, updatingInventoryState, wildlifeStoreRef]
  );

  const handlingPetUnequipWeapon = useCallback(
    (instanceId: string): void => {
      const instance = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        instanceId
      );
      const petBond = instance?.petBond;
      const weaponItem = petBond?.weaponItem;

      if (!instance || !petBond || !weaponItem) {
        return;
      }

      replacingWildlifeInstance(wildlifeStoreRef.current, {
        ...instance,
        petBond: { ...petBond, weaponItem: null },
      });

      if (petBond.isPersistent) {
        updatingWildlifePetRecord(petBond.petId, { weaponItem: null });
      }

      addItemWithStacking(weaponItem);
    },
    [addItemWithStacking, wildlifeStoreRef]
  );

  const handlingPetTeachSkill = useCallback(
    (instanceId: string, skillId: string): void => {
      const instance = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        instanceId
      );
      const petBond = instance?.petBond;

      if (!instance || !petBond || petBond.learnedSkillIds.includes(skillId)) {
        return;
      }

      const learnedSkillIds = [...petBond.learnedSkillIds, skillId];
      replacingWildlifeInstance(wildlifeStoreRef.current, {
        ...instance,
        petBond: { ...petBond, learnedSkillIds },
      });

      if (petBond.isPersistent) {
        updatingWildlifePetRecord(petBond.petId, { learnedSkillIds });
      }
    },
    [wildlifeStoreRef]
  );

  const handlingPetEquipSkill = useCallback(
    (instanceId: string, skillId: string | null): void => {
      const instance = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        instanceId
      );
      const petBond = instance?.petBond;

      if (!instance || !petBond) {
        return;
      }

      replacingWildlifeInstance(wildlifeStoreRef.current, {
        ...instance,
        petBond: { ...petBond, equippedSkillId: skillId },
      });

      if (petBond.isPersistent) {
        updatingWildlifePetRecord(petBond.petId, { equippedSkillId: skillId });
      }
    },
    [wildlifeStoreRef]
  );

  usingWorldPlazaProximityInteractableBlockSelection({
    enabled: isLocalGameplayEnabled && !isHideActionsEnabled,
    playerPositionRef,
    selectedInteractableBlockKeysRef,
    placedBlocksRef: proximityPlacedBlocksRef,
    choppedTreeStateByTileKeyRef: choppedTreesByTileKeyRef,
    chopPersistenceOwnerId,
    minedRockStateByTileKeyRef: minedRocksByTileKeyRef,
    pickedPebbleStateByTileKeyRef: pickedPebblesByTileKeyRef,
    pickedFlowerStateByTileKeyRef: pickedFlowersByTileKeyRef,
    farmlandByTileKeyRef,
    wildlifeStoreRef,
    hasEquippedFishrodRef,
    hasEquippedHoeRef,
    hasEquippedScytheRef,
    hasSeedsInInventoryRef,
  });

  const spiritedSpritesBetaStoreRef = useRef(
    creatingSpiritedSpritesBetaSpawnStore()
  );

  const handlingDevSpawnSpiritedSpritesBetaAnimal = useCallback(
    (animalId: DefiningSpiritedSpritesBetaAnimalId) => {
      const playerPosition = playerPositionRef.current;
      if (!playerPosition) {
        return;
      }

      spawningSpiritedSpritesBetaNearPoint({
        store: spiritedSpritesBetaStoreRef.current,
        center: playerPosition,
        animalId,
        nowMs: Date.now(),
      });
    },
    [playerPositionRef]
  );

  const handlingDevClearSpiritedSpritesBetaSpawns = useCallback(() => {
    clearingSpiritedSpritesBetaSpawnInstances(
      spiritedSpritesBetaStoreRef.current
    );
  }, []);

  const {
    pending: docileAttackConfirmPending,
    cancelingPending: cancelingDocileAttackConfirm,
  } = usingWildlifeDocileAttackConfirm();

  const handlingDocileBetrayComplete = useCallback(
    (pending: NonNullable<typeof docileAttackConfirmPending>): void => {
      const instance = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        pending.instanceId
      );

      if (!instance || instance.isDead) {
        return;
      }

      const studyPoints = DEFINING_WILDLIFE_DOCILE_PET_STUDY_POINTS;
      const ownerUserId = onlineUserId ?? localPersistenceOwnerId;
      const nowMs = Date.now();
      const { instance: pettedInstance, becamePersistent } =
        applyingWildlifeDocilePetComplete({
          instance,
          studyPoints,
          nowMs,
          ownerUserId,
        });
      replacingWildlifeInstance(wildlifeStoreRef.current, pettedInstance);

      if (ownerUserId) {
        syncingWildlifePetBondToRoster({
          instance: pettedInstance,
          ownerUserId,
          becamePersistent,
          nowMs,
        });
      }

      recordingWorldPlazaBestiarySpeciesStudied(pending.speciesId, studyPoints);
      playingWildlifeStudySfx();
    },
    [wildlifeStoreRef, onlineUserId, localPersistenceOwnerId]
  );

  const {
    snapshot: docileBetrayProgressSnapshot,
    progressRatioRef: docileBetrayProgressRatioRef,
    startingDocileBetray,
    cancellingDocileBetray,
  } = usingWildlifeDocileBetrayProgress({
    playerPositionRef,
    wildlifeStoreRef,
    onBetrayComplete: handlingDocileBetrayComplete,
  });

  const activeDocilePettingInstanceIdRef = useRef<string | null>(null);
  activeDocilePettingInstanceIdRef.current =
    docileBetrayProgressSnapshot.isActive
      ? docileBetrayProgressSnapshot.activeTargetKey
      : null;

  usingWildlifeDocilePetProximitySelection({
    enabled: isLocalGameplayEnabled && !isHideActionsEnabled,
    playerPositionRef,
    wildlifeStoreRef,
    selectedInteractableBlockKeysRef,
    activePettingInstanceIdRef: activeDocilePettingInstanceIdRef,
  });

  const handlingDocileBetrayInteraction = useCallback(
    (pending: Parameters<typeof startingDocileBetray>[0]): void => {
      if (isPlayerAsleepRef.current || isPlayerStunnedRef.current) {
        return;
      }

      startingDocileBetray(pending);
    },
    [startingDocileBetray]
  );

  const clearingDocileBetraySelection = useCallback((): void => {
    cancelingDocileAttackConfirm();
    cancellingDocileBetray();
  }, [cancelingDocileAttackConfirm, cancellingDocileBetray]);

  useEffect(() => {
    return () => {
      clearingWildlifeDocileAttackConfirmPending();
      cancellingDocileBetray();
    };
  }, [cancellingDocileBetray]);

  applyingPlayerMeleeDamageOnSwingCompleteRef.current = (
    melee: DefiningWorldPlazaAvatarMeleePresentationState
  ) => {
    applyWildlifeDamageRef.current?.(
      melee.targetInstanceId,
      melee.damageAmount
    );

    const selectedSlotIndex = equipment.selectedSlotIndex;
    let didBreak = false;

    updatingInventoryState((currentState) => {
      const wearResult = wearingWorldPlazaEquippedInventoryToolDurability(
        currentState,
        selectedSlotIndex,
        'sword'
      );

      if (!wearResult.applied) {
        return null;
      }

      didBreak = wearResult.broken;
      return wearResult.nextState;
    });

    if (didBreak) {
      showingGameplayHudToast('Your sword broke.');
    }
  };

  const handlingWildlifeCorpseStudyComplete = useCallback(
    (entry: ListingWildlifeCorpsesInStudyRangeEntry): void => {
      const instance = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        entry.instanceId
      );

      if (!instance || !instance.isDead || instance.hasBeenStudied) {
        return;
      }

      const studyPoints = computingWildlifeCorpseStudyPoints(entry.massKg);
      replacingWildlifeInstance(
        wildlifeStoreRef.current,
        enqueueingWildlifeCorpseStudyFloatFeedback({
          instance,
          studyPoints,
          nowMs: Date.now(),
        })
      );
      recordingWorldPlazaBestiarySpeciesStudied(entry.speciesId, studyPoints);
      playingWildlifeStudySfx();
      clearingInteractableBlockClickSelection();
    },
    [clearingInteractableBlockClickSelection, wildlifeStoreRef]
  );

  const {
    snapshot: wildlifeCorpseStudyProgressSnapshot,
    progressRatioRef: wildlifeCorpseStudyProgressRatioRef,
    startingCorpseStudy,
  } = usingWorldPlazaWildlifeCorpseStudyProgress({
    playerPositionRef,
    selectedInteractableBlockKeysRef,
    wildlifeStoreRef,
    onStudyComplete: handlingWildlifeCorpseStudyComplete,
  });

  const handlingWildlifeCorpseStudyInteraction = useCallback(
    (entry: ListingWildlifeCorpsesInStudyRangeEntry): void => {
      if (isPlayerAsleepRef.current || isPlayerStunnedRef.current) {
        return;
      }

      const didStart = startingCorpseStudy(entry);

      if (!didStart) {
        showingGameplayHudToast('Already studying a corpse.');
      }
    },
    [showingGameplayHudToast, startingCorpseStudy]
  );

  const handlingWildlifeCorpseClick = useCallback(
    (gridPoint: { x: number; y: number }): boolean => {
      if (isPlayerAsleepRef.current || isPlayerStunnedRef.current) {
        return false;
      }

      const clickedCorpse = findingWildlifeCorpseAtGridPoint(
        wildlifeStoreRef.current,
        gridPoint,
        (instance) => {
          const species = resolvingWildlifeSpeciesDefinition(
            instance.speciesId
          );

          if (!species) {
            return 0.35;
          }

          return resolvingWildlifeInstanceCollisionRadiusGrid(
            species,
            instance
          );
        }
      );

      if (!clickedCorpse) {
        return false;
      }

      selectingWorldPlazaWildlifeCorpseForClickAction(
        selectedInteractableBlockKeysRef,
        clickedCorpse.instanceId
      );

      return true;
    },
    [wildlifeStoreRef]
  );

  const handlingTreeStumpStudyComplete = useCallback(
    (entry: ListingWorldPlazaTreeStumpsInStudyRangeEntry): void => {
      const didMark = markingWorldPlazaLocalTreeStumpStudied(
        chopPersistenceOwnerId,
        entry.tileX,
        entry.tileY
      );

      if (!didMark) {
        return;
      }

      recordingWorldPlazaHerbariumTreeStudied(
        entry.variant,
        DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_POINTS
      );
      const studyCount =
        gettingWorldPlazaHerbariumTreeStudyCountsSnapshot()[entry.variant] ??
        DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_POINTS;
      showingGameplayHudToast(
        `Studied · Herbarium ${formattingPlazaHerbariumStudyCountProgress(studyCount)}`
      );
      playingWildlifeStudySfx();
      clearingInteractableBlockClickSelection();
    },
    [
      chopPersistenceOwnerId,
      clearingInteractableBlockClickSelection,
      showingGameplayHudToast,
    ]
  );

  const {
    snapshot: treeStumpStudyProgressSnapshot,
    progressRatioRef: treeStumpStudyProgressRatioRef,
    startingStumpStudy,
  } = usingWorldPlazaTreeStumpStudyProgress({
    playerPositionRef,
    selectedInteractableBlockKeysRef,
    placedBlocksRef: proximityPlacedBlocksRef,
    choppedTreeStateByTileKeyRef: choppedTreesByTileKeyRef,
    persistenceOwnerId: chopPersistenceOwnerId,
    onStudyComplete: handlingTreeStumpStudyComplete,
  });

  const handlingTreeStumpStudyInteraction = useCallback(
    (entry: ListingWorldPlazaTreeStumpsInStudyRangeEntry): void => {
      if (isPlayerAsleepRef.current || isPlayerStunnedRef.current) {
        return;
      }

      const didStart = startingStumpStudy(entry);

      if (!didStart) {
        showingGameplayHudToast('Already studying a stump.');
      }
    },
    [showingGameplayHudToast, startingStumpStudy]
  );

  const handlingTreeStumpClick = useCallback(
    (
      pointerContext: DefiningWorldPlazaInteractablePointerHitContext
    ): boolean => {
      if (isPlayerAsleepRef.current || isPlayerStunnedRef.current) {
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (
        !playerPosition ||
        pointerContext.viewportScreenPoint === undefined ||
        pointerContext.cameraOffset === undefined ||
        pointerContext.cameraWorldZoom === undefined
      ) {
        return false;
      }

      const clickedStump = findingWorldPlazaTreeStumpAtGridPoint(
        {
          gridPoint: pointerContext.gridPoint,
          viewportScreenPoint: pointerContext.viewportScreenPoint,
          cameraOffset: pointerContext.cameraOffset,
          cameraWorldZoom: pointerContext.cameraWorldZoom,
        },
        playerPosition,
        proximityPlacedBlocksRef.current,
        chopPersistenceOwnerId,
        choppedTreesByTileKeyRef.current
      );

      if (!clickedStump) {
        return false;
      }

      selectingWorldPlazaTreeStumpForClickAction(
        selectedInteractableBlockKeysRef,
        clickedStump.tileX,
        clickedStump.tileY
      );

      return true;
    },
    [chopPersistenceOwnerId, playerPositionRef]
  );

  const handlingDevSpawnAggressiveChickens = useCallback(
    (count: number) => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      spawningWildlifeDevAggressiveChickensNearPoint({
        store: wildlifeStoreRef.current,
        center: playerPosition,
        count,
        nowMs: Date.now(),
        playerUserId: onlineUserId ?? localPersistenceOwnerId ?? 'local-player',
      });
    },
    [localPersistenceOwnerId, onlineUserId, playerPositionRef, wildlifeStoreRef]
  );

  const handlingDevSpawnRandomGreyWolf = useCallback(() => {
    const playerPosition = playerPositionRef.current;

    if (!playerPosition) {
      return;
    }

    spawningWildlifeDevGreyWolfRandomlyNearPoint({
      store: wildlifeStoreRef.current,
      center: playerPosition,
      nowMs: Date.now(),
    });
  }, [playerPositionRef, wildlifeStoreRef]);

  const handlingDevSpawnWildlifeSpecies = useCallback(
    (
      speciesId: DefiningWildlifeSpeciesId,
      aggressionLevel: DefiningWildlifeAggressionLevel
    ) => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      spawningWildlifeDevSpeciesNearPoint({
        store: wildlifeStoreRef.current,
        center: playerPosition,
        speciesId,
        aggressionLevel,
        nowMs: Date.now(),
      });
    },
    [playerPositionRef, wildlifeStoreRef]
  );

  const handlingDevApplyNearestDogLoyalty = useCallback(
    (grant: ApplyingWildlifePetDevLoyaltyGrantKind) => {
      const playerPosition = playerPositionRef.current;
      const ownerUserId = onlineUserId ?? localPersistenceOwnerId;

      if (!playerPosition || !ownerUserId) {
        return;
      }

      const nearestDog = findingWildlifeNearestPettableInstance({
        store: wildlifeStoreRef.current,
        origin: playerPosition,
        petKind: 'dog',
      });

      if (!nearestDog) {
        return;
      }

      const nowMs = Date.now();
      const { instance: nextInstance, becamePersistent } =
        applyingWildlifePetDevLoyaltyGrant({
          instance: nearestDog,
          ownerUserId,
          grant,
          nowMs,
        });

      replacingWildlifeInstance(wildlifeStoreRef.current, nextInstance);
      syncingWildlifePetBondToRoster({
        instance: nextInstance,
        ownerUserId,
        becamePersistent,
        nowMs,
      });
      syncingWildlifePetInstanceVitalsToRoster(nextInstance, nowMs);
    },
    [localPersistenceOwnerId, onlineUserId, playerPositionRef, wildlifeStoreRef]
  );

  const applyingInteractablePointerHoverCursor = useCallback(
    (nextCursor: string): void => {
      if (interactablePointerHoverCursorRef.current === nextCursor) {
        return;
      }

      interactablePointerHoverCursorRef.current = nextCursor;
      const viewportFrame = viewportFrameRef.current;

      if (viewportFrame) {
        viewportFrame.style.cursor = nextCursor;
      }
    },
    []
  );

  const resolvingWildlifePointerCollisionRadiusGrid = useCallback(
    (instance: DefiningWildlifeInstance): number => {
      const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

      if (!species) {
        return 0.35;
      }

      return resolvingWildlifeInstanceCollisionRadiusGrid(species, instance);
    },
    []
  );

  const updatingHoveredWildlifeInstanceId = useCallback(
    (clientX: number, clientY: number): void => {
      if (!isLocalGameplayEnabled || !viewportFrameRef.current) {
        wildlifeHoveredInstanceIdRef.current = null;
        applyingInteractablePointerHoverCursor(
          DEFINING_WORLD_PLAZA_INTERACTABLE_POINTER_DEFAULT_CURSOR
        );
        return;
      }

      const gridPoint = projectingWorldPlazaViewportClientPointToGridPoint(
        clientX,
        clientY,
        viewportFrameRef.current,
        cameraOffsetRef.current,
        pixiViewportSizeRef.current,
        cameraWorldZoomRef.current
      );

      if (!gridPoint) {
        wildlifeHoveredInstanceIdRef.current = null;
        applyingInteractablePointerHoverCursor(
          DEFINING_WORLD_PLAZA_INTERACTABLE_POINTER_DEFAULT_CURSOR
        );
        return;
      }

      const hoveredInstance = findingWildlifeInstanceAtGridPoint(
        wildlifeStoreRef.current,
        gridPoint,
        resolvingWildlifePointerCollisionRadiusGrid
      );

      wildlifeHoveredInstanceIdRef.current =
        hoveredInstance?.instanceId ?? null;

      const canAttackHoverTarget = Boolean(
        hoveredInstance &&
        !hoveredInstance.isDead &&
        !isPlayerAsleepRef.current &&
        !isPlayerStunnedRef.current
      );

      if (canAttackHoverTarget) {
        applyingInteractablePointerHoverCursor(
          DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_HOVER_CURSOR
        );
        return;
      }

      const hoveredCorpse = findingWildlifeCorpseAtGridPoint(
        wildlifeStoreRef.current,
        gridPoint,
        resolvingWildlifePointerCollisionRadiusGrid
      );

      if (hoveredCorpse) {
        applyingInteractablePointerHoverCursor(
          DEFINING_WORLD_PLAZA_CORPSE_POINTER_HOVER_CURSOR
        );
        return;
      }

      const viewportScreenPoint =
        projectingWorldPlazaViewportClientPointToViewportScreenPoint(
          clientX,
          clientY,
          viewportFrameRef.current,
          pixiViewportSizeRef.current
        );

      if (
        viewportScreenPoint &&
        playerPositionRef.current &&
        !isPlayerAsleepRef.current &&
        !isPlayerStunnedRef.current
      ) {
        const hoveredStump = findingWorldPlazaTreeStumpAtGridPoint(
          {
            gridPoint,
            viewportScreenPoint,
            cameraOffset: cameraOffsetRef.current,
            cameraWorldZoom: cameraWorldZoomRef.current,
          },
          playerPositionRef.current,
          proximityPlacedBlocksRef.current,
          chopPersistenceOwnerId,
          choppedTreesByTileKeyRef.current
        );

        if (hoveredStump) {
          applyingInteractablePointerHoverCursor(
            DEFINING_WORLD_PLAZA_CORPSE_POINTER_HOVER_CURSOR
          );
          return;
        }
      }

      const pointerContext: DefiningWorldPlazaInteractablePointerHitContext = {
        gridPoint,
        ...(viewportScreenPoint
          ? {
              viewportScreenPoint,
              cameraOffset: cameraOffsetRef.current,
              cameraWorldZoom: cameraWorldZoomRef.current,
            }
          : {}),
      };

      const isInteractableHoverTarget =
        checkingWorldPlazaInteractablePointerHoverTarget({
          pointerContext,
          playerPosition: playerPositionRef.current,
          placedBlocks: placedBlocksRef.current.blocks,
          actorUserId: buildModeUserId,
          chopPersistenceOwnerId,
          choppedTreeStateByTileKey: choppedTreesByTileKeyRef.current,
          minedRockStateByTileKey: minedRocksByTileKeyRef.current,
          pickedPebbleStateByTileKey: pickedPebblesByTileKeyRef.current,
          pickedFlowerStateByTileKey: pickedFlowersByTileKeyRef.current,
          wildlifeStore: wildlifeStoreRef.current,
          resolveWildlifeCollisionRadiusGrid:
            resolvingWildlifePointerCollisionRadiusGrid,
        });

      applyingInteractablePointerHoverCursor(
        isInteractableHoverTarget
          ? DEFINING_WORLD_PLAZA_INTERACTABLE_POINTER_HOVER_CURSOR
          : DEFINING_WORLD_PLAZA_INTERACTABLE_POINTER_DEFAULT_CURSOR
      );
    },
    [
      applyingInteractablePointerHoverCursor,
      buildModeUserId,
      chopPersistenceOwnerId,
      isLocalGameplayEnabled,
      resolvingWildlifePointerCollisionRadiusGrid,
      wildlifeStoreRef,
    ]
  );

  const clearingCombatLock = useCallback((): void => {
    combatLockRef.current = null;
  }, []);

  const startingMeleeSwingAtWildlife = useCallback(
    (instance: DefiningWildlifeInstance): boolean => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const activeMelee = meleeAttackStateRef.current;
      const nowMs = performance.now();

      if (
        activeMelee &&
        nowMs - activeMelee.startedAtMs < activeMelee.durationMs
      ) {
        return false;
      }

      // Settle any finished-but-unregistered swing before overwriting the
      // shared state, so damage from the previous swing is never dropped.
      settlingWorldPlazaMeleeSwingDamage(activeMelee, nowMs, (completed) =>
        applyingPlayerMeleeDamageOnSwingCompleteRef.current?.(completed)
      );

      const reachDistance = Math.hypot(
        instance.position.x - playerPosition.x,
        instance.position.y - playerPosition.y
      );

      if (reachDistance > DEFINING_WILDLIFE_PLAYER_MELEE_REACH_GRID) {
        replacingWildlifeInstance(
          wildlifeStoreRef.current,
          enqueueingWildlifeMissFloatFeedback({
            instance,
            nowMs: performance.now(),
          })
        );
        return false;
      }

      const meleePresentation = resolvingWorldPlazaAvatarClipPresentation(
        selectedAvatarCharacterDefinition,
        'melee'
      );
      const meleeTiming = computingWorldPlazaGirlSampleMeleePresentationTiming(
        selectedCharacterEngineDerivedStats.attackSpeed *
          resolvingWorldPlazaEntityHealthAttackSpeedMultiplier(
            healthStateRef.current,
            nowMs
          ),
        {
          frameCount: meleePresentation.sheetLayout.frameCount,
          baselineAnimationFps: meleePresentation.animationFps,
        }
      );

      clearingWalkTarget();
      meleeAttackStateRef.current = {
        direction: resolvingWorldPlazaGirlSampleWalkDirection(
          instance.position.x - playerPosition.x,
          instance.position.y - playerPosition.y,
          localAvatarMotionStateRef.current.facingDirection
        ),
        startedAtMs: performance.now(),
        targetGridX: instance.position.x,
        targetGridY: instance.position.y,
        targetInstanceId: instance.instanceId,
        damageAmount: Math.round(
          playerTransformWildlifeSpeciesIdRef.current
            ? selectedCharacterEngineDerivedStats.attackPower
            : resolvingWorldPlazaEquippedAttackEv(
                selectedCharacterEngineDerivedStats.attackPower,
                inventoryState,
                equipment.selectedSlotIndex
              )
        ),
        durationMs: meleeTiming.durationMs,
        animationFps: meleeTiming.animationFps,
        damageRegistered: false,
      };

      playingWorldPlazaAvatarMeleeSwingSfx();

      return true;
    },
    [
      clearingWalkTarget,
      equipment.selectedSlotIndex,
      healthStateRef,
      inventoryState,
      localAvatarMotionStateRef,
      playerPositionRef,
      playerTransformWildlifeSpeciesIdRef,
      selectedAvatarCharacterDefinition,
      selectedCharacterEngineDerivedStats.attackPower,
      selectedCharacterEngineDerivedStats.attackSpeed,
      wildlifeStoreRef,
    ]
  );

  const lockingCombatOnWildlifeInstance = useCallback(
    (instance: DefiningWildlifeInstance): void => {
      const nowMs = performance.now();
      combatLockRef.current = {
        targetInstanceId: instance.instanceId,
        lastChaseGridX: instance.position.x,
        lastChaseGridY: instance.position.y,
        lastChaseReplanAtMs: 0,
      };
      isClickRunIntentRef.current = true;

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const reachDistance = Math.hypot(
        instance.position.x - playerPosition.x,
        instance.position.y - playerPosition.y
      );

      if (reachDistance <= DEFINING_WILDLIFE_PLAYER_MELEE_REACH_GRID) {
        startingMeleeSwingAtWildlife(instance);
        return;
      }

      applyingWalkPlanToDestination(
        { x: instance.position.x, y: instance.position.y },
        { run: true }
      );
      combatLockRef.current.lastChaseReplanAtMs = nowMs;
    },
    [
      applyingWalkPlanToDestination,
      isClickRunIntentRef,
      playerPositionRef,
      startingMeleeSwingAtWildlife,
    ]
  );

  const handlingWildlifeMeleeClick = useCallback(
    (gridPoint: { x: number; y: number }): boolean => {
      if (isPlayerAsleepRef.current || isPlayerStunnedRef.current) {
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const clickedInstance = findingWildlifeInstanceAtGridPoint(
        wildlifeStoreRef.current,
        gridPoint,
        (instance) => {
          const species = resolvingWildlifeSpeciesDefinition(
            instance.speciesId
          );

          if (!species) {
            return 0.35;
          }

          return resolvingWildlifeInstanceCollisionRadiusGrid(
            species,
            instance
          );
        }
      );

      if (!clickedInstance || clickedInstance.isDead) {
        return false;
      }

      const clickedSpecies = resolvingWildlifeSpeciesDefinition(
        clickedInstance.speciesId
      );

      if (checkingWildlifeSpeciesIsDocile(clickedSpecies)) {
        clearingCombatLock();
        cancellingDocileBetray();

        const petKind = resolvingWildlifeDocilePetKind(
          clickedInstance.speciesId
        );

        if (!petKind) {
          clearingWildlifeDocileAttackConfirmPending();
          return false;
        }

        const hasNamablePetBond =
          clickedInstance.petBond !== null &&
          clickedInstance.petBond !== undefined &&
          checkingWildlifePetHasCapability(
            clickedInstance.petBond.loyalty,
            'namable'
          );

        if (
          !hasNamablePetBond &&
          !checkingWildlifeDocilePetIsReady(clickedInstance, Date.now())
        ) {
          clearingWildlifeDocileAttackConfirmPending();
          return true;
        }

        const reachDistance = Math.hypot(
          clickedInstance.position.x - playerPosition.x,
          clickedInstance.position.y - playerPosition.y
        );

        if (reachDistance > DEFINING_WILDLIFE_PLAYER_MELEE_REACH_GRID) {
          clearingWildlifeDocileAttackConfirmPending();
          isClickRunIntentRef.current = true;
          applyingWalkPlanToDestination(
            {
              x: clickedInstance.position.x,
              y: clickedInstance.position.y,
            },
            { run: true }
          );
          return true;
        }

        clearingWalkTarget();

        // Familiar+: show Name? overhead action. Rename opens from that button,
        // never from a Pet windup.
        settingWildlifeDocileAttackConfirmPending({
          instanceId: clickedInstance.instanceId,
          speciesId: clickedInstance.speciesId,
          displayName: clickedSpecies?.displayName ?? 'animal',
          petKind,
        });
        return true;
      }

      clearingDocileBetraySelection();
      lockingCombatOnWildlifeInstance(clickedInstance);
      return true;
    },
    [
      applyingWalkPlanToDestination,
      cancellingDocileBetray,
      clearingCombatLock,
      clearingDocileBetraySelection,
      clearingWalkTarget,
      isClickRunIntentRef,
      lockingCombatOnWildlifeInstance,
      playerPositionRef,
      wildlifeStoreRef,
    ]
  );

  useEffect(() => {
    if (!isLocalGameplayEnabled) {
      clearingCombatLock();
      return;
    }

    return subscribingWorldPlazaDomOverlayFrame((_deltaMs, frameTimeMs) => {
      const lock = combatLockRef.current;

      if (!lock) {
        return;
      }

      if (
        isPlayerDeadRef.current ||
        isPlayerAsleepRef.current ||
        isPlayerStunnedRef.current
      ) {
        clearingCombatLock();
        clearingWalkTarget();
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const target = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        lock.targetInstanceId
      );
      const activeMelee = meleeAttackStateRef.current;
      const isMeleeBusy = Boolean(
        activeMelee &&
        frameTimeMs - activeMelee.startedAtMs < activeMelee.durationMs
      );

      // Backstop: settle a finished swing from this loop too, in case the
      // avatar Pixi tick is not running (e.g. textures still loading).
      if (!isMeleeBusy) {
        settlingWorldPlazaMeleeSwingDamage(
          activeMelee,
          frameTimeMs,
          (completed) =>
            applyingPlayerMeleeDamageOnSwingCompleteRef.current?.(completed)
        );
      }
      const tickResult = resolvingWorldPlazaPlayerCombatLockTick({
        lock,
        playerPosition,
        target: target
          ? {
              instanceId: target.instanceId,
              position: target.position,
              isDead: target.isDead,
            }
          : null,
        nowMs: frameTimeMs,
        isMeleeBusy,
        isDocileConfirmPending: Boolean(
          readingWildlifeDocileAttackConfirmPending()
        ),
        hasActiveWalk: Boolean(isWalkingRef.current && walkTargetRef.current),
      });

      if (tickResult.kind === 'clear') {
        clearingCombatLock();
        clearingWalkTarget();
        return;
      }

      if (tickResult.kind === 'hold') {
        // Root in place while swinging or waiting on Attack? confirm.
        if (walkTargetRef.current || isWalkingRef.current) {
          clearingWalkTarget();
        }
        return;
      }

      if (tickResult.kind === 'chase') {
        isClickRunIntentRef.current = true;

        if (tickResult.shouldReplan) {
          applyingWalkPlanToDestination(tickResult.destination, {
            run: true,
          });
          lock.lastChaseGridX = tickResult.destination.x;
          lock.lastChaseGridY = tickResult.destination.y;
          lock.lastChaseReplanAtMs = frameTimeMs;
        }

        return;
      }

      clearingWalkTarget();
      const swingTarget = gettingWildlifeInstance(
        wildlifeStoreRef.current,
        tickResult.targetInstanceId
      );

      if (!swingTarget || swingTarget.isDead) {
        clearingCombatLock();
        return;
      }

      startingMeleeSwingAtWildlife(swingTarget);
    });
  }, [
    applyingWalkPlanToDestination,
    clearingCombatLock,
    clearingWalkTarget,
    isClickRunIntentRef,
    isLocalGameplayEnabled,
    isWalkingRef,
    playerPositionRef,
    startingMeleeSwingAtWildlife,
    walkTargetRef,
    wildlifeStoreRef,
  ]);

  const { tryUsingSkill } = usingWorldPlazaCharacterEngineSkillCooldowns({
    healthStateRef,
    enqueueHealFloatRef,
  });
  const tryUsingCharacterSkillRef = useRef(tryUsingSkill);
  tryUsingCharacterSkillRef.current = tryUsingSkill;

  useEffect(() => {
    effectiveMaxHealthRef.current = playerHealthHudSnapshot.effectiveMaxHealth;
  }, [playerHealthHudSnapshot.effectiveMaxHealth]);

  const {
    hungerHudSnapshot,
    hungerStateRef,
    hungerMovementMultipliersRef,
    consumingJumpHungerRef,
    eatingFoodRef,
    resettingHungerRef,
    syncingHungerHudFromStateRef,
  } = usingWorldPlazaPlayerHunger({
    isEnabled: isLocalGameplayEnabled,
    isWalkingRef,
    isRunningRef,
    metabolismMultiplier:
      selectedCharacterEngineDefinition.stats.hungerDrainMultiplier,
    applyStarvationDamageRef,
    effectiveMaxHealthRef,
    isHealthRegenAllowedRef: isHealthRegenAllowedByHungerRef,
  });

  const handlingFoodEatComplete = useCallback(
    (context: DefiningWorldPlazaInventoryFoodEatProgressContext): void => {
      const previousHealth = healthStateRef.current.currentHealth;
      const eatEffects = resolvingWorldPlazaInventoryFoodEatEffects({
        foodDefinition: context.foodDefinition,
        healthState: healthStateRef.current,
        nowMs: performance.now(),
        worldEpochMs: Date.now(),
        sicknessRoll: Math.random(),
        wellFedRoll: Math.random(),
        foodItemMetadata: context.itemMetadata,
      });

      const didEat = eatingFoodRef.current?.(
        eatEffects.effectiveHungerRestoreRatio
      );

      if (!didEat) {
        showingGameplayHudToast('Already full.');
        return;
      }

      healthStateRef.current = eatEffects.nextHealthState;

      const healedAmount =
        healthStateRef.current.currentHealth - previousHealth;

      if (healedAmount > 0) {
        enqueueHealFloatRef.current?.(healedAmount);
      } else {
        syncingHealthHudFromStateRef.current();
      }

      updatingInventoryState((currentState) => {
        const consumeResult = consumingWorldPlazaInventoryItemFromSlot(
          currentState,
          context.slotIndex,
          1
        );

        return consumeResult.consumed ? consumeResult.nextState : null;
      });
    },
    [
      eatingFoodRef,
      enqueueHealFloatRef,
      healthStateRef,
      showingGameplayHudToast,
      syncingHealthHudFromStateRef,
      updatingInventoryState,
    ]
  );

  const {
    snapshot: foodEatProgressSnapshot,
    progressRatioRef: foodEatProgressRatioRef,
    overlaySnapshot: foodEatOverlaySnapshot,
    startingFoodEat,
    isFoodEatActive,
  } = usingWorldPlazaInventoryFoodEatProgress({
    playerPositionRef,
    healthStateRef,
    keyboardDirectionRef,
    walkTargetRef,
    jumpRequestedRef,
    rollRequestedRef,
    avatarToolActionRef: localAvatarToolActionRef,
    onEatComplete: handlingFoodEatComplete,
  });

  const handlingEatHotbarSlot = useCallback(
    (slotIndex: number): void => {
      if (
        isPlayerAsleepRef.current ||
        isPlayerStunnedRef.current ||
        isPlayerDeadRef.current
      ) {
        return;
      }

      if (isFoodEatActive()) {
        showingGameplayHudToast('Already eating.');
        return;
      }

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

      if ((hungerHudSnapshot.hungerRatio ?? 0) >= 1) {
        showingGameplayHudToast('Already full.');
        return;
      }

      const didStart = startingFoodEat({
        slotIndex,
        foodDefinition,
        itemMetadata: item.metadata,
      });

      if (!didStart) {
        showingGameplayHudToast('Already eating.');
      }
    },
    [
      hungerHudSnapshot.hungerRatio,
      inventoryState.slots,
      isFoodEatActive,
      showingGameplayHudToast,
      startingFoodEat,
    ]
  );

  const handlingStudyHotbarSlot = useCallback(
    (slotIndex: number): void => {
      if (
        isPlayerAsleepRef.current ||
        isPlayerStunnedRef.current ||
        isPlayerDeadRef.current
      ) {
        return;
      }

      const item = inventoryState.slots[slotIndex];

      if (!item) {
        return;
      }

      const flowerSpeciesId = parsingWorldPlazaFlowerSpeciesIdFromItemTypeId(
        item.itemTypeId
      );
      const oreSpeciesId = parsingWorldPlazaOreSpeciesIdFromItemTypeId(
        item.itemTypeId
      );

      if (flowerSpeciesId) {
        const currentStudyCount =
          gettingWorldPlazaHerbariumFlowerStudyCountsSnapshot()[
            flowerSpeciesId
          ] ?? 0;

        if (
          checkingPlazaHerbariumStudyTierUnlocked('full', currentStudyCount)
        ) {
          showingGameplayHudToast('Already fully studied.');
          return;
        }

        let didConsume = false;

        updatingInventoryState((currentState) => {
          const consumeResult = consumingWorldPlazaInventoryItemFromSlot(
            currentState,
            slotIndex,
            1
          );

          didConsume = consumeResult.consumed;
          return consumeResult.consumed ? consumeResult.nextState : null;
        });

        if (!didConsume) {
          showingGameplayHudToast('Nothing left to study.');
          return;
        }

        recordingWorldPlazaHerbariumFlowerStudied(flowerSpeciesId);
        const studyCount =
          gettingWorldPlazaHerbariumFlowerStudyCountsSnapshot()[
            flowerSpeciesId
          ] ?? 1;
        showingGameplayHudToast(
          `Studied · Herbarium ${formattingPlazaHerbariumStudyCountProgress(studyCount)}`
        );
        return;
      }

      if (oreSpeciesId) {
        const currentStudyCount =
          gettingWorldPlazaLapidaryOreStudyCountsSnapshot()[oreSpeciesId] ?? 0;

        if (checkingPlazaLapidaryStudyTierUnlocked('full', currentStudyCount)) {
          showingGameplayHudToast('Already fully studied.');
          return;
        }

        let didConsume = false;

        updatingInventoryState((currentState) => {
          const consumeResult = consumingWorldPlazaInventoryItemFromSlot(
            currentState,
            slotIndex,
            1
          );

          didConsume = consumeResult.consumed;
          return consumeResult.consumed ? consumeResult.nextState : null;
        });

        if (!didConsume) {
          showingGameplayHudToast('Nothing left to study.');
          return;
        }

        recordingWorldPlazaLapidaryOreStudied(oreSpeciesId);
        const studyCount =
          gettingWorldPlazaLapidaryOreStudyCountsSnapshot()[oreSpeciesId] ?? 1;
        showingGameplayHudToast(
          `Studied · Lapidary ${formattingPlazaLapidaryStudyCountProgress(studyCount)}`
        );
      }
    },
    [inventoryState.slots, showingGameplayHudToast, updatingInventoryState]
  );

  const {
    tryConsumingJumpStaminaRef,
    tryConsumingRollStaminaRef,
    staminaRatio,
    isRunning: isRunningHud,
    isDepleted: isStaminaDepleted,
  } = usingWorldPlazaRunStamina({
    isEnabled: isLocalGameplayEnabled,
    isWalkingRef,
    isClickRunIntentRef,
    isPointerHeldRef,
    pointerHeldSinceMsRef,
    isRunKeyHeldRef,
    isRunningOnIceRef,
    isRunningRef,
    healthStateRef,
    hungerMovementMultipliersRef,
    runStaminaStateRef: playerRunStaminaStateRef,
  });

  const isPlayerDead = playerHealthHudSnapshot.isDead;
  const temperatureComfortBand = useMemo(
    () =>
      resolvingWorldPlazaEntityTemperatureComfortBand(
        playerHealthHudSnapshot.temperatureResistance
      ),
    [playerHealthHudSnapshot.temperatureResistance]
  );
  const wasPlayerDeadForAudioRef = useRef(isPlayerDead);

  useEffect(() => {
    if (wasPlayerDeadForAudioRef.current === isPlayerDead) {
      return;
    }

    wasPlayerDeadForAudioRef.current = isPlayerDead;
    sendingWorldPlazaAudioLifecycleEvent(
      isPlayerDead ? 'PLAYER_DIED' : 'PLAYER_RESPAWNED'
    );
  }, [isPlayerDead]);

  isPlayerDeadRef.current = isPlayerDead;
  const isPlayerAsleep = checkingWorldPlazaEntityPlayerSleepIsActive(
    healthStateRef.current,
    performance.now()
  );
  isPlayerAsleepRef.current = isPlayerAsleep;
  isPlayerStunnedRef.current = checkingWorldPlazaEntityPlayerStunIsActive(
    healthStateRef.current,
    performance.now()
  );
  const activeStunEffect = resolvingWorldPlazaEntityHealthActiveStunEffect(
    healthStateRef.current,
    performance.now()
  );

  useEffect(() => {
    if (!isPlayerAsleep) {
      setSleepSpeechBubble(null);
      return;
    }

    let isActive = true;

    const advancingSleepSpeechBubble = (): void => {
      if (!isActive) {
        return;
      }

      setSleepSpeechBubble((currentBubble) =>
        advancingWorldPlazaEntitySleepSpeechBubble({
          nowMs: performance.now(),
          isAsleep: true,
          sleepStartedAtMs: sleepStateRef.current?.startedAtMs ?? null,
          activeBubble: currentBubble,
        })
      );
    };

    advancingSleepSpeechBubble();
    const intervalId = window.setInterval(advancingSleepSpeechBubble, 100);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [isPlayerAsleep]);

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

  usingWorldPlazaPersistingPlayerConditions({
    isEnabled: isLocalGameplayEnabled && localPersistenceOwnerId !== null,
    localPersistenceOwnerId,
    redditUserId,
    singlePlayerSaveSlotIndex,
    healthStateRef,
    hungerStateRef,
    onHydrated: () => {
      syncingHealthHudFromStateRef.current();
      syncingHungerHudFromStateRef.current();
    },
  });

  const isSignedInSinglePlayerCloudSave =
    onlineUserId === null &&
    redditUserId !== null &&
    singlePlayerSaveSlotIndex !== null;
  const discoveryCloudSaveSlotIndex = isSignedInSinglePlayerCloudSave
    ? singlePlayerSaveSlotIndex
    : null;

  usingWorldPlazaRecordingExploredBiomes({
    isEnabled: isLocalGameplayEnabled,
    storageOwnerId: onlineUserId ?? localPersistenceOwnerId,
    cloudSaveSlotIndex: discoveryCloudSaveSlotIndex,
    playerPositionRef,
  });

  usingWorldPlazaRecordingDiscoveredNamedRealms({
    isEnabled: isLocalGameplayEnabled,
    storageOwnerId: onlineUserId ?? localPersistenceOwnerId,
    cloudSaveSlotIndex: discoveryCloudSaveSlotIndex,
    playerPositionRef,
  });

  usingWorldPlazaRecordingBestiarySightings({
    isEnabled: isLocalGameplayEnabled,
    storageOwnerId: onlineUserId ?? localPersistenceOwnerId,
    cloudSaveSlotIndex: discoveryCloudSaveSlotIndex,
    playerPositionRef,
    wildlifeStoreRef,
  });

  usingWorldPlazaRecordingHerbariumSightings({
    isEnabled: isLocalGameplayEnabled,
    storageOwnerId: onlineUserId ?? localPersistenceOwnerId,
    playerPositionRef,
    inventoryState,
    pickedFlowerStateByTileKey,
  });

  usingWorldPlazaRecordingLapidarySightings({
    isEnabled: isLocalGameplayEnabled,
    storageOwnerId: onlineUserId ?? localPersistenceOwnerId,
    playerPositionRef,
    inventoryState,
    minedRockStateByTileKey,
  });

  useEffect(() => {
    initializingWorldPlazaRecipeDiscoveryStore(
      onlineUserId ?? localPersistenceOwnerId,
      {
        cloudSaveSlotIndex: discoveryCloudSaveSlotIndex,
      }
    );
  }, [discoveryCloudSaveSlotIndex, localPersistenceOwnerId, onlineUserId]);

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
          playerHeightWorldLayers:
            selectedCharacterEngineDerivedStats.heightWorldLayers,
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
      selectedCharacterEngineDerivedStats.heightWorldLayers,
      syncingMovePositionRef,
      teleportingWithScreenFade,
      walkTargetRef,
    ]
  );

  const teleportingPlayerToBiome = useCallback(
    (biomeKind: DefiningWorldPlazaBiomeKind): void => {
      const destinationWorldPoint =
        findingWorldPlazaBiomeTeleportWorldPointForDev({
          biomeKind,
          originWorldPoint: playerPositionRef.current,
        });
      const biomeDisplayName =
        DEFINING_WORLD_PLAZA_BIOME_CATALOG[biomeKind].displayName;

      if (!destinationWorldPoint) {
        showingGameplayHudToast(`No ${biomeDisplayName} region found nearby.`);
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
          playerHeightWorldLayers:
            selectedCharacterEngineDerivedStats.heightWorldLayers,
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
      selectedCharacterEngineDerivedStats.heightWorldLayers,
      showingGameplayHudToast,
      syncingMovePositionRef,
      teleportingWithScreenFade,
      walkTargetRef,
    ]
  );

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
          playerHeightWorldLayers:
            selectedCharacterEngineDerivedStats.heightWorldLayers,
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
      selectedCharacterEngineDerivedStats.heightWorldLayers,
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

  const { isProfilePanelOpen, closingProfilePanel, togglingProfilePanel } =
    usingWorldPlazaProfilePanelVisibleState();
  const {
    isPetRosterPanelOpen,
    closingPetRosterPanel,
    togglingPetRosterPanel,
  } = usingWildlifePetRosterPanelVisibleState();

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
    clearingCombatLock();
    clearingWalkTarget();
    closeChat();
    closingFriendsPanel();
    closingCodexSection();

    const deathPosition = playerPositionRef.current;
    const wildlifePlayerUserId = onlineUserId ?? localPersistenceOwnerId;

    if (deathPosition && wildlifePlayerUserId && isLocalGameplayEnabled) {
      clearingWildlifeAreaOnPlayerDeath({
        store: wildlifeStoreRef.current,
        center: deathPosition,
        playerUserId: wildlifePlayerUserId,
        nowMs: Date.now(),
        resolveSpecies: resolvingWildlifeSpeciesDefinition,
      });
    }
  }, [
    clearingCombatLock,
    clearingWalkTarget,
    closeChat,
    closingCodexSection,
    closingFriendsPanel,
    isLocalGameplayEnabled,
    isPlayerDead,
    localPersistenceOwnerId,
    onlineUserId,
    playerPositionRef,
    wildlifeStoreRef,
  ]);

  useEffect(() => {
    if (!isPlayerDead) {
      return;
    }

    const respawnTimeoutId = window.setTimeout(() => {
      respawnRef.current?.();
      resettingHungerRef.current?.();
      clearingCombatLock();
      clearingWalkTarget();
      hostRef.current?.focus();
    }, DEFINING_WORLD_PLAZA_ENTITY_DEATH_AUTO_RESPAWN_MS);

    return () => {
      window.clearTimeout(respawnTimeoutId);
    };
  }, [clearingCombatLock, clearingWalkTarget, isPlayerDead]);

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

    const isTrackedFriendInRoom = (roomSnapshot.remotePlayers ?? []).some(
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
    isEnabled: onlineUserId !== null && isPlazaSocialEnabled,
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
    const executingPendingInventoryDropOnWalkArrived = (): void => {
      syncingMovePositionRef.current?.();
      inventoryDropPlacement.executingPendingDropIfInRange();
    };
    const executingPendingInventoryDropOnWalkStep = (): void => {
      // The room's 150ms sync interval publishes movement. Posting here every
      // render frame floods mobile HTTP and stalls click-walk animation.
      inventoryDropPlacement.executingPendingDropIfInRange();
    };

    onWalkArrivedRef.current = executingPendingInventoryDropOnWalkArrived;
    onWalkStepRef.current = executingPendingInventoryDropOnWalkStep;
  }, [
    inventoryDropPlacement.executingPendingDropIfInRange,
    syncingMovePositionRef,
  ]);

  useEffect(() => {
    if (chatSnapshot.isChatOpen) {
      clearingCombatLock();
      clearingWalkTarget();
    }
  }, [chatSnapshot.isChatOpen, clearingCombatLock, clearingWalkTarget]);

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

  const isLocalPlayerHudHiddenForCorpseStudy =
    wildlifeCorpseStudyProgressSnapshot.isActive ||
    wildlifeCorpseStudyProgressSnapshot.isCancelling ||
    treeStumpStudyProgressSnapshot.isActive ||
    treeStumpStudyProgressSnapshot.isCancelling;

  const playerNameLabelEntries =
    useMemo((): RenderingWorldPlazaPlayerNameLabelEntry[] => {
      if (!onlineUserId) {
        return [];
      }

      const localPosition = playerPositionRef.current;
      const entries: RenderingWorldPlazaPlayerNameLabelEntry[] = [];

      if (!isLocalPlayerHudHiddenForCorpseStudy) {
        entries.push({
          userId: onlineUserId,
          displayName: onlineDisplayName,
          profileStatusKind: onlineProfileStatusKind,
          avatarUrl: onlineAvatarUrl,
          anchorGridX: localPosition.x,
          anchorGridY: localPosition.y,
        });
      }

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
      isLocalPlayerHudHiddenForCorpseStudy,
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
      const entries: RenderingWorldPlazaEntityHealthBarEntry[] = [];

      if (!isLocalPlayerHudHiddenForCorpseStudy) {
        entries.push({
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
        });
      }

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
      isLocalPlayerHudHiddenForCorpseStudy,
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

  const hudToolbarEditModeHotbar = useMemo(() => {
    if (
      !buildModeUserId ||
      (hudToolbarMode !== DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD &&
        hudToolbarMode !== DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM)
    ) {
      return null;
    }

    return (
      <RenderingWorldPlazaEditModeHotbar
        isVisible
        isEmbeddedInHudToolbarStack
        isBuildModeActive={isBlockBuildModeActive}
        isClaimModeActive={isClaimModeActive}
        onActivateBuildMode={activatingBuildMode}
        onActivateClaimMode={activatingClaimMode}
        selectedDefinitionId={selectedDefinitionId}
        selectedWorldLayer={selectedWorldLayer}
        selectedBlockHeight={selectedBlockHeight}
        isPresetBlockTypeSelected={isPresetBlockTypeSelected}
        selectedCutFootprintMask={selectedCutFootprintMask}
        selectedCutGridAxisCellCount={selectedCutGridAxisCellCount}
        localOwnedPlotCount={claimModeLocalOwnedPlotCount}
        localTileClaimCount={claimModeLocalTileClaimCount}
        plotOwnerLimits={plotOwnerLimits}
        isSavingCoords={isSavingCoords}
        canSaveMoreCoords={canSaveMoreCoords}
        isSaveCoordsPlacementActive={isSaveCoordsPlacementActive}
        onStartSaveCoordsPlacement={startingSaveCoordsPlacement}
        onCancelSaveCoordsPlacement={cancellingSaveCoordsPlacement}
        ownerGroups={claimModeOwnerGroups}
        activeViewportPlots={activeViewportPlots}
        localUserId={buildModeUserId}
        isPlotRegistryLoading={isClaimModePlotRegistryLoading}
        onTeleportToPlotBounds={teleportingPlayerToPlotBounds}
        onRequestingFriendPlotVisit={requestingFriendPlotVisit}
        onTeleportingToApprovedFriendPlot={
          teleportingToApprovedFriendPlotFromClaimList
        }
        outgoingVisitRequests={outgoingVisitRequests}
        isRequestingFriendPlotVisit={createPlotVisitRequestMutation.isPending}
        onRemoveTemporaryPlotAtTile={handlingRemoveTemporaryPlotAtTile}
        isRemovingTemporaryPlot={isRemovingTemporaryPlot}
        savedCoordsList={savedCoordsList}
        trackedSavedCoordsId={trackedSavedCoordsId}
        onToggleSavedCoordsTracking={togglingSavedCoordsTracking}
        onDeleteSavedCoords={deletingSavedCoords}
        isDeletingSavedCoords={isDeletingSavedCoords}
        viewportHudScale={viewportHudScale}
        isMobile={hudIsMobile}
        isFullscreen={hudIsFullscreen}
        onSelectDefinition={selectingBlockDefinition}
        onSelectWorldLayer={selectingWorldLayer}
        onSelectBlockHeight={selectingBlockHeight}
        onSelectCutFootprintMask={selectingCutFootprintMask}
        onSelectCutGridAxisCellCount={selectingCutGridAxisCellCount}
      />
    );
  }, [
    activatingBuildMode,
    activatingClaimMode,
    activeViewportPlots,
    buildModeUserId,
    canSaveMoreCoords,
    claimModeLocalOwnedPlotCount,
    claimModeLocalTileClaimCount,
    claimModeOwnerGroups,
    createPlotVisitRequestMutation.isPending,
    deletingSavedCoords,
    handlingRemoveTemporaryPlotAtTile,
    hoverTilePosition,
    hudIsFullscreen,
    hudIsMobile,
    hudToolbarMode,
    isBlockBuildModeActive,
    isClaimModeActive,
    isClaimModePlotRegistryLoading,
    isDeletingSavedCoords,
    isPresetBlockTypeSelected,
    isRemovingTemporaryPlot,
    isSaveCoordsPlacementActive,
    isSavingCoords,
    outgoingVisitRequests,
    plotOwnerLimits,
    requestingFriendPlotVisit,
    savedCoordsList,
    selectedBlockHeight,
    selectedCutFootprintMask,
    selectedCutGridAxisCellCount,
    selectedDefinitionId,
    selectedWorldLayer,
    selectingBlockDefinition,
    selectingBlockHeight,
    selectingCutFootprintMask,
    selectingCutGridAxisCellCount,
    selectingWorldLayer,
    startingSaveCoordsPlacement,
    cancellingSaveCoordsPlacement,
    teleportingPlayerToPlotBounds,
    teleportingToApprovedFriendPlotFromClaimList,
    togglingSavedCoordsTracking,
    trackedSavedCoordsId,
    viewportHudScale,
  ]);

  const hudToolbarEditModePlotCapacityMetric = useMemo(() => {
    if (
      !buildModeUserId ||
      (hudToolbarMode !== DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD &&
        hudToolbarMode !== DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM)
    ) {
      return null;
    }

    return (
      <RenderingWorldPlazaEditModePlotCapacityMetric
        localOwnedPlotCount={claimModeLocalOwnedPlotCount}
        localTileClaimCount={claimModeLocalTileClaimCount}
        plotOwnerLimits={plotOwnerLimits}
        viewportHudScale={viewportHudScale}
        isMobile={hudIsMobile}
      />
    );
  }, [
    buildModeUserId,
    claimModeLocalOwnedPlotCount,
    claimModeLocalTileClaimCount,
    hudIsMobile,
    hudToolbarMode,
    plotOwnerLimits,
    viewportHudScale,
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

      if (
        !isEditSessionActiveRef.current &&
        event.button ===
          DEFINING_WORLD_PLAZA_CLICK_MOVEMENT_PRIMARY_POINTER_BUTTON &&
        inventoryDropPlacement.isDropPlacementActiveRef.current
      ) {
        if (
          inventoryDropPlacement.handlingDropPlacementWorldClick(
            event.clientX,
            event.clientY,
            inventoryState
          )
        ) {
          event.preventDefault();
          event.stopPropagation();
          syncingMovePositionRef.current?.();
          hostRef.current?.focus();
          return;
        }
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

          if (isSaveCoordsPlacementActiveRef.current) {
            savingCoordsAtTilePosition(hoverTile);
            setIsSaveCoordsPlacementActive(false);
            hostRef.current?.focus();
            return;
          }

          const paintAction = resolvingEditPaintActionAtTile(hoverTile);
          if (paintAction) {
            isEditPaintPointerHeldRef.current = true;
            editPaintActionRef.current = paintAction;
            lastEditPaintTileKeyRef.current =
              formattingWorldBuildingTilePositionKey(hoverTile);
            paintingEditModeTileAtViewport(hoverTile, paintAction);
            event.currentTarget.setPointerCapture(event.pointerId);
          } else {
            actingOnEditModeTileAtViewport(hoverTile);
          }
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
          const paintAction = resolvingEditPaintActionAtTile(hoverTile);
          if (paintAction) {
            isEditPaintPointerHeldRef.current = true;
            editPaintActionRef.current = paintAction;
            lastEditPaintTileKeyRef.current =
              formattingWorldBuildingTilePositionKey(hoverTile);
            paintingEditModeTileAtViewport(hoverTile, paintAction);
            event.currentTarget.setPointerCapture(event.pointerId);
          } else {
            actingOnEditModeTileAtViewport(hoverTile);
          }
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
            clearingCombatLock();
            clearingDocileBetraySelection();
            event.preventDefault();
            event.stopPropagation();
            hostRef.current?.focus();
            return;
          }

          clearingInteractableBlockClickSelection();

          if (handlingWildlifeCorpseClick(gridPoint)) {
            clearingCombatLock();
            clearingDocileBetraySelection();
            event.preventDefault();
            event.stopPropagation();
            hostRef.current?.focus();
            return;
          }

          if (handlingTreeStumpClick(pointerContext)) {
            clearingCombatLock();
            clearingDocileBetraySelection();
            event.preventDefault();
            event.stopPropagation();
            hostRef.current?.focus();
            return;
          }

          if (handlingWildlifeMeleeClick(gridPoint)) {
            event.preventDefault();
            event.stopPropagation();
            hostRef.current?.focus();
            return;
          }
        } else {
          clearingInteractableBlockClickSelection();
        }
      }

      handlingCharacterFacingPointerDown(event);

      if (isTurnPointerHeldRef.current) {
        hostRef.current?.focus();
        return;
      }

      // Clicking empty ground (or non-target) cancels combat lock-on and Betray?.
      clearingCombatLock();
      clearingDocileBetraySelection();
      handlingPlazaPointerDown(event);
      syncingMovePositionRef.current?.();
      hostRef.current?.focus();
    },
    [
      clearingCombatLock,
      clearingDocileBetraySelection,
      handlingCharacterFacingPointerDown,
      clearingInteractableBlockClickSelection,
      handlingCampfireBlockInteraction,
      handlingInteractableBlockPointerDown,
      handlingPlazaPointerDown,
      handlingWildlifeCorpseClick,
      handlingTreeStumpClick,
      handlingToolGroundPointerSelection,
      handlingWildlifeMeleeClick,
      actingOnEditModeTileAtViewport,
      resolvingEditPaintActionAtTile,
      paintingEditModeTileAtViewport,
      removingBlockAtTile,
      onlineUserId,
      isTurnPointerHeldRef,
      syncingMovePositionRef,
      updatingHoverTilePosition,
      activeScenePlacedBlocks,
      attemptingFlintIgnitionAtTile,
      handlingInteractableBlockPointerDown,
      inventoryDropPlacement,
      inventoryState,
      isSinglePlayerSession,
      isLocalGameplayEnabled,
      savingCoordsAtTilePosition,
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
          isEditPaintPointerHeldRef.current &&
          editPaintActionRef.current &&
          hoverTile
        ) {
          const tileKey = formattingWorldBuildingTilePositionKey(hoverTile);
          if (tileKey !== lastEditPaintTileKeyRef.current) {
            lastEditPaintTileKeyRef.current = tileKey;
            paintingEditModeTileAtViewport(
              hoverTile,
              editPaintActionRef.current
            );
          }
        }
      }

      handlingCharacterFacingPointerMove(event);

      if (isTurnPointerHeldRef.current) {
        return;
      }

      inventoryDropPlacement.handlingDropPlacementPointerMove(
        event.clientX,
        event.clientY
      );

      updatingHoveredWildlifeInstanceId(event.clientX, event.clientY);

      handlingPlazaPointerMove(event);
    },
    [
      handlingCharacterFacingPointerMove,
      handlingPlazaPointerMove,
      inventoryDropPlacement.handlingDropPlacementPointerMove,
      isTurnPointerHeldRef,
      paintingEditModeTileAtViewport,
      updatingHoverTilePosition,
      updatingHoveredWildlifeInstanceId,
    ]
  );

  const handlingPlazaHostPointerRelease = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      if (isEditPaintPointerHeldRef.current) {
        isEditPaintPointerHeldRef.current = false;
        editPaintActionRef.current = null;
        lastEditPaintTileKeyRef.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      }

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
          wildlifeHoveredInstanceIdRef.current = null;
          applyingInteractablePointerHoverCursor(
            DEFINING_WORLD_PLAZA_INTERACTABLE_POINTER_DEFAULT_CURSOR
          );
          handlingPlazaHostPointerRelease(event);
        }}
        onPointerCancel={handlingPlazaHostPointerRelease}
        onContextMenu={preventingPlazaViewportContextMenu}
      >
        {isDevQaBlankSlate ? null : (
          <RenderingWorldPlazaBiomeBackdrop
            playerPositionRef={playerPositionRef}
          />
        )}
        {generationFeatureFlags[
          DEFINING_WORLD_PLAZA_GENERATION_FEATURE.AUDIO_SFX
        ] ? (
          <>
            <RenderingWorldPlazaBiomeMusic
              playerPositionRef={playerPositionRef}
            />
            <RenderingWorldPlazaBiomeAmbience
              playerPositionRef={playerPositionRef}
            />
            <RenderingWorldPlazaAvatarFootsteps
              playerPositionRef={playerPositionRef}
              localAvatarMotionStateRef={localAvatarMotionStateRef}
            />
            <RenderingWorldPlazaAvatarMotionSfx />
            <RenderingWorldPlazaAvatarMeleeSfx />
            <RenderingWorldPlazaEquipmentSfx />
            <RenderingWorldPlazaInventoryBagSfx />
            <RenderingWorldPlazaGirlSampleVoiceSfx />
            <RenderingWildlifeOmegaWolfSfx
              playerPositionRef={playerPositionRef}
              wildlifeStoreRef={wildlifeStoreRef}
            />
            <RenderingWildlifeStudySfx />
            <RenderingWildlifeSpeciesSfx
              playerPositionRef={playerPositionRef}
              wildlifeStoreRef={wildlifeStoreRef}
            />
            <RenderingWildlifeFootsteps
              playerPositionRef={playerPositionRef}
              wildlifeStoreRef={wildlifeStoreRef}
            />
            <RenderingWorldPlazaCampfireAmbience
              playerPositionRef={playerPositionRef}
              fireCellsRef={fireCellsRef}
            />
            <RenderingWorldPlazaLavaAmbience
              playerPositionRef={playerPositionRef}
            />
          </>
        ) : null}
        <div className={DEFINING_WORLD_PLAZA_PIXI_STAGE_LAYER_CLASS_NAME}>
          <Application
            preference="webgl"
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
              cameraOffsetRef={cameraOffsetRef}
              cameraWorldZoomRef={cameraWorldZoomRef}
              placedBlocksRef={placedBlocksRef}
              burntGrassTileKeysRef={burntGrassTileKeysRef}
              choppedTreesByTileKeyRef={choppedTreesByTileKeyRef}
              pickedPebblesByTileKeyRef={pickedPebblesByTileKeyRef}
              pickedFlowersByTileKeyRef={pickedFlowersByTileKeyRef}
              floorLayerRef={terrainFloorLayerRef}
              trunkLayerRef={terrainTrunkLayerRef}
              canopyLayerRef={terrainCanopyLayerRef}
            />
            {isDevQaBlankSlate ? null : (
              <>
                {isLocalGameplayEnabled ? (
                  <RenderingWorldPlazaFarmlandGroundMarkers
                    farmlandByTileKeyRef={farmlandByTileKeyRef}
                    revision={farmlandRevision}
                  />
                ) : null}
                <RenderingWorldPlazaFireLayer
                  entityLayerRef={terrainTrunkLayerRef}
                  fireCells={fireCells}
                  placedBlocks={activeScenePlacedBlocks}
                />
              </>
            )}
            {/*
              Night lighting stays mounted even in Dev QA blank slate. Blank
              slate used to unmount this stack, so CSS day/night tint still
              darkened the world while torch/fairy/campfire holes never ran —
              fairies looked like dots with no light pool.
            */}
            {DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_ENABLED ? (
              <RenderingWorldPlazaPlayerNightLightGroundGlow
                floorLayerRef={terrainFloorLayerRef}
                playerPositionRef={playerPositionRef}
                placedBlocksRef={placedBlocksRef}
              />
            ) : null}
            <RenderingWorldPlazaLightSourcesGroundGlow
              floorLayerRef={terrainFloorLayerRef}
            />
            <RenderingWorldPlazaLightingDarknessLayer
              worldAnchorLayerRef={terrainFloorLayerRef}
              playerPositionRef={playerPositionRef}
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
                    localPlayerPositionRef={playerPositionRef}
                  />
                  {isWildlifeGenerationEnabled ? (
                    <RenderingWildlifeLayer
                      wildlifeStoreRef={wildlifeStoreRef}
                      tickConfigRef={tickConfigRef}
                    />
                  ) : null}
                  <RenderingSpiritedSpritesBetaLayer
                    storeRef={spiritedSpritesBetaStoreRef}
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
                    walkWaypointsRef={walkWaypointsRef}
                    walkDestinationRef={walkDestinationRef}
                    navigationPlacedBlockSnapshotRef={
                      navigationPlacedBlockSnapshotRef
                    }
                    isWalkingRef={isWalkingRef}
                    isRunningRef={isRunningRef}
                    runStaminaStateRef={playerRunStaminaStateRef}
                    jumpRequestedRef={jumpRequestedRef}
                    tryConsumingJumpStaminaRef={tryConsumingJumpStaminaRef}
                    tryConsumingRollStaminaRef={tryConsumingRollStaminaRef}
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
                    rollRequestedRef={rollRequestedRef}
                    rollStateRef={rollStateRef}
                    rollChainUnlockAtMsRef={rollChainUnlockAtMsRef}
                    isRollingRef={isRollingRef}
                    isRollDodgeActiveRef={isRollDodgeActiveRef}
                    rollDodgeProgressRef={rollDodgeProgressRef}
                    meleeAttackStateRef={meleeAttackStateRef}
                    applyingPlayerMeleeDamageOnSwingCompleteRef={
                      applyingPlayerMeleeDamageOnSwingCompleteRef
                    }
                    pushStateRef={pushStateRef}
                    blockReactionStateRef={blockReactionStateRef}
                    damagedStateRef={damagedStateRef}
                    deathStateRef={deathStateRef}
                    sleepStateRef={sleepStateRef}
                    damagedReactionUntilMsRef={damagedReactionUntilMsRef}
                    defensiveReactionUntilMsRef={defensiveReactionUntilMsRef}
                    isMobileViewportRef={isMobileViewportRef}
                    equippedHeldItemPresentationRef={
                      equippedHeldItemPresentationRef
                    }
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
                    wildlifeStoreRef={wildlifeStoreRef}
                  />
                  <RenderingWorldPlazaBlockPlacementPreview
                    isVisible={
                      isEditSessionActive &&
                      (isClaimModeActive ||
                        isBuildPlacementSelectionActive ||
                        pendingCraftPlacementPreviewDefinitionId !== null)
                    }
                    isClaimModePreview={isClaimModeActive}
                    previewTilePositionRef={previewTilePositionRef}
                    isPreviewTileValidRef={isPreviewTileValidRef}
                    previewWorldLayerRef={previewWorldLayerRef}
                    previewBlockHeightRef={previewBlockHeightRef}
                    previewCutFootprintMaskRef={previewCutFootprintMaskRef}
                    previewCutGridAxisCellCountRef={
                      previewCutGridAxisCellCountRef
                    }
                    previewDefinitionIdRef={previewDefinitionIdRef}
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
                    rollDodgeProgressRef={rollDodgeProgressRef}
                    extraTargetsRef={wildlifeProjectileTargetsRef}
                    onExtraTargetHit={(targetId, archetypeId) => {
                      applyWildlifeDamageRef.current?.(
                        targetId,
                        0,
                        archetypeId
                      );
                    }}
                    onLocalPlayerJumpDodgeMiss={() => {
                      enqueueMissFloatRef.current?.();
                    }}
                  />
                  <RenderingWorldPlazaProjectileVisualLayer
                    renderPlane="effects"
                    projectileStoreRef={projectileStoreRef}
                    isEnabled={isProjectileEngineEnabled}
                  />
                  <RenderingWorldPlazaClickArrowEffect
                    clickArrowEffectRef={clickArrowEffectRef}
                  />
                  <RenderingWorldPlazaPlayerCombatLockCrosshair
                    combatLockRef={combatLockRef}
                    wildlifeStoreRef={wildlifeStoreRef}
                  />
                  <RenderingWorldPlazaInventoryDropTileOutlinePreview
                    dropMarkerTileRef={inventoryDropPlacement.dropMarkerTileRef}
                  />
                </pixiContainer>
              </pixiContainer>
            </RenderingWorldPlazaCameraRig>
          </Application>
        </div>

        {isHudDayNightEnabled ? <RenderingWorldPlazaDayNightOverlay /> : null}
        {isHudDangerSenseEnabled ? (
          <RenderingWorldPlazaDangerSenseHudOverlay
            wildlifeStoreRef={wildlifeStoreRef}
            playerPositionRef={playerPositionRef}
            playerUserId={
              onlineUserId ?? localPersistenceOwnerId ?? 'local-player'
            }
          />
        ) : null}

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
          {isHudStatusEnabled && isLocalGameplayEnabled ? (
            <RenderingWorldPlazaWorldNotifications isMobile={hudIsMobile} />
          ) : null}
          {isHudStatusEnabled && isLocalGameplayEnabled ? (
            <RenderingWorldPlazaEntityStatusEffectStack
              statusEffectHudRows={playerHealthHudSnapshot.statusEffectHudRows}
              hasOnlineRoomHud={isOnlineRoomEnabled}
              viewportHudScale={viewportHudScale}
            />
          ) : null}
          {isHudStatusEnabled && isLocalGameplayEnabled && hudIsMobile ? (
            <RenderingWorldPlazaMobileRollButton
              rollRequestedRef={rollRequestedRef}
              isChatOpen={chatSnapshot.isChatOpen}
              isPlayerDeadRef={isPlayerDeadRef}
              isPlayerAsleepRef={isPlayerAsleepRef}
              isPlayerStunnedRef={isPlayerStunnedRef}
              viewportHudScale={viewportHudScale}
            />
          ) : null}
          {isDevEnvironment ? (
            <RenderingWorldPlazaDevModePanel
              isOpen={isDevModePanelOpen}
              onToggle={togglingDevModePanel}
              onClose={closingDevModePanel}
              hasStaminaBar={false}
              viewportHudScale={viewportHudScale}
              isMobile={hudIsMobile}
              isFullscreen={hudIsFullscreen}
              isBuildModeActive={isBuildModeActive}
              playerPositionRef={playerPositionRef}
              playerHeightWorldLayers={
                selectedCharacterEngineDerivedStats.heightWorldLayers
              }
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
              onHealthApplySoulbreak={() =>
                takeDamageRef.current?.(
                  DEFINING_WORLD_PLAZA_ENTITY_SOULBREAK_DEV_HEALTH_PERCENT_EV,
                  'soulbreak'
                )
              }
              onHealthApplyDisease={(diseaseId) =>
                applyDiseaseRef.current?.(diseaseId)
              }
              onHealthSetFrostbiteStacks={(stackCount) =>
                setFrostbiteStacksRef.current?.(stackCount)
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
              onSpawnAggressiveChickens={handlingDevSpawnAggressiveChickens}
              onSpawnRandomGreyWolf={handlingDevSpawnRandomGreyWolf}
              onSpawnWildlifeSpecies={handlingDevSpawnWildlifeSpecies}
              onSpawnSpiritedSpritesBetaAnimal={
                handlingDevSpawnSpiritedSpritesBetaAnimal
              }
              onClearSpiritedSpritesBetaSpawns={
                handlingDevClearSpiritedSpritesBetaSpawns
              }
              wildlifeStoreRef={wildlifeStoreRef}
              onApplyNearestDogLoyalty={handlingDevApplyNearestDogLoyalty}
              onlineUserId={onlineUserId}
              onTeleportToBiome={teleportingPlayerToBiome}
              onExitToHome={!isHudActionBarEnabled ? onExitToHome : undefined}
            />
          ) : !isHudActionBarEnabled && onExitToHome ? (
            <button
              type="button"
              className="pointer-events-auto absolute left-3 top-3 z-50 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow"
              onClick={onExitToHome}
            >
              Home
            </button>
          ) : null}
          {isHudWorldAnchorsEnabled ? (
            <>
              <RenderingWorldPlazaSavedCoordsDirectionArrowOverlay
                isVisible={trackedSavedCoords !== null}
                savedCoords={trackedSavedCoords}
                playerPositionRef={playerPositionRef}
                cameraOffsetRef={cameraOffsetRef}
                cameraWorldZoomRef={cameraWorldZoomRef}
                onArrived={clearingSavedCoordsTracking}
              />
              <RenderingWorldPlazaSavedCoordsTileStarMarkers
                trackedSavedCoords={trackedSavedCoords}
                isSaveCoordsPlacementActive={isSaveCoordsPlacementActive}
                placementHoverTileRef={hoverTilePositionRef}
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
            </>
          ) : null}
          {(isHudHealthEnabled || isHudStaminaEnabled) &&
          isLocalGameplayEnabled ? (
            <RenderingWorldPlazaEntityHealthBars
              healthBarEntries={playerHealthBarEntries}
              localUserId={localHealthEntityUserId}
              localHudSnapshot={playerHealthHudSnapshot}
              localStaminaHud={
                isHudStaminaEnabled
                  ? {
                      staminaRatio,
                      isRunning: isRunningHud,
                      isDepleted: isStaminaDepleted,
                    }
                  : null
              }
              isHealthTrackVisible={isHudHealthEnabled}
              playerPositionRef={playerPositionRef}
              remotePlayerRegistryRef={remotePlayerRegistryRef}
              playerRenderPositionRegistryRef={playerRenderPositionRegistryRef}
              remotePlayers={roomSnapshot.remotePlayers}
              cameraOffsetRef={cameraOffsetRef}
              cameraWorldZoomRef={cameraWorldZoomRef}
            />
          ) : null}
          {isHudHealthEnabled && isLocalGameplayEnabled ? (
            <RenderingWorldPlazaEntityHealthFloatTexts
              localUserId={localHealthEntityUserId}
              anchorGridX={playerPositionRef.current.x}
              anchorGridY={playerPositionRef.current.y}
              floatingTexts={playerHealthHudSnapshot.floatingTexts}
              playerPositionRef={playerPositionRef}
              remotePlayerRegistryRef={remotePlayerRegistryRef}
              playerRenderPositionRegistryRef={playerRenderPositionRegistryRef}
              remotePlayers={roomSnapshot.remotePlayers}
              cameraOffsetRef={cameraOffsetRef}
              cameraWorldZoomRef={cameraWorldZoomRef}
            />
          ) : null}
          {isHudWorldAnchorsEnabled && isLocalGameplayEnabled ? (
            <>
              <RenderingWorldPlazaInventoryFoodEatOverlay
                localUserId={localHealthEntityUserId}
                overlaySnapshot={foodEatOverlaySnapshot}
                progressSnapshot={foodEatProgressSnapshot}
                progressRatioRef={foodEatProgressRatioRef}
                playerPositionRef={playerPositionRef}
                playerRenderPositionRegistryRef={
                  playerRenderPositionRegistryRef
                }
                cameraOffsetRef={cameraOffsetRef}
                cameraWorldZoomRef={cameraWorldZoomRef}
              />
              <RenderingWorldPlazaEntityWorldAnchoredStunDots
                localUserId={localHealthEntityUserId}
                anchorGridX={playerPositionRef.current.x}
                anchorGridY={playerPositionRef.current.y}
                isVisible={activeStunEffect !== null}
                phaseSeed={activeStunEffect?.phaseSeed ?? 0}
                playerPositionRef={playerPositionRef}
                remotePlayerRegistryRef={remotePlayerRegistryRef}
                playerRenderPositionRegistryRef={
                  playerRenderPositionRegistryRef
                }
                remotePlayers={roomSnapshot.remotePlayers}
                cameraOffsetRef={cameraOffsetRef}
                cameraWorldZoomRef={cameraWorldZoomRef}
              />
              <RenderingWorldPlazaEntityWorldAnchoredSleepSpeechBubble
                localUserId={localHealthEntityUserId}
                anchorGridX={playerPositionRef.current.x}
                anchorGridY={playerPositionRef.current.y}
                isVisible={isPlayerAsleep && sleepSpeechBubble !== null}
                bubble={sleepSpeechBubble}
                playerPositionRef={playerPositionRef}
                remotePlayerRegistryRef={remotePlayerRegistryRef}
                playerRenderPositionRegistryRef={
                  playerRenderPositionRegistryRef
                }
                remotePlayers={roomSnapshot.remotePlayers}
                cameraOffsetRef={cameraOffsetRef}
                cameraWorldZoomRef={cameraWorldZoomRef}
              />
              <RenderingWorldPlazaCampfireInteractionLabels
                placedBlocks={activeScenePlacedBlocks}
                fireCells={fireCells}
                selectedInteractableBlockKeysRef={
                  selectedInteractableBlockKeysRef
                }
                inventorySlotsRef={campfireInventorySlotsRef}
                cookProgressSnapshot={campfireCookProgressSnapshot}
                cookProgressRatioRef={campfireCookProgressRatioRef}
                cameraOffsetRef={cameraOffsetRef}
                cameraWorldZoomRef={cameraWorldZoomRef}
                onCampfireAction={handlingCampfireAction}
              />
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
              <RenderingWorldPlazaRockInteractionLabels
                selectedInteractableBlockKeysRef={
                  selectedInteractableBlockKeysRef
                }
                minedRockStateByTileKeyRef={minedRocksByTileKeyRef}
                timedInteractionProgressSnapshot={rockMineProgressSnapshot}
                timedInteractionProgressRatioRef={rockMineProgressRatioRef}
                cameraOffsetRef={cameraOffsetRef}
                cameraWorldZoomRef={cameraWorldZoomRef}
                onMineRock={handlingRockMineInteraction}
              />
              <RenderingWorldPlazaPebbleInteractionLabels
                selectedInteractableBlockKeysRef={
                  selectedInteractableBlockKeysRef
                }
                pickedPebbleStateByTileKeyRef={pickedPebblesByTileKeyRef}
                timedInteractionProgressSnapshot={pebblePickProgressSnapshot}
                timedInteractionProgressRatioRef={pebblePickProgressRatioRef}
                cameraOffsetRef={cameraOffsetRef}
                cameraWorldZoomRef={cameraWorldZoomRef}
                onPickPebble={handlingPebblePickInteraction}
              />
              <RenderingWorldPlazaFlowerInteractionLabels
                selectedInteractableBlockKeysRef={
                  selectedInteractableBlockKeysRef
                }
                pickedFlowerStateByTileKeyRef={pickedFlowersByTileKeyRef}
                timedInteractionProgressSnapshot={flowerPickProgressSnapshot}
                timedInteractionProgressRatioRef={flowerPickProgressRatioRef}
                cameraOffsetRef={cameraOffsetRef}
                cameraWorldZoomRef={cameraWorldZoomRef}
                onPickFlower={handlingFlowerPickInteraction}
              />
              <RenderingWorldPlazaFishingInteractionLabels
                playerPositionRef={playerPositionRef}
                selectedInteractableBlockKeysRef={
                  selectedInteractableBlockKeysRef
                }
                timedInteractionProgressSnapshot={fishingProgressSnapshot}
                timedInteractionProgressRatioRef={fishingProgressRatioRef}
                cameraOffsetRef={cameraOffsetRef}
                cameraWorldZoomRef={cameraWorldZoomRef}
                onFish={handlingFishingInteraction}
              />
              <RenderingWorldPlazaFarmingInteractionLabels
                playerPositionRef={playerPositionRef}
                farmlandByTileKeyRef={farmlandByTileKeyRef}
                selectedInteractableBlockKeysRef={
                  selectedInteractableBlockKeysRef
                }
                hasEquippedHoe={hasEquippedHoe}
                hasEquippedScythe={hasEquippedScythe}
                hasSeedsInInventory={hasSeedsInInventory}
                timedInteractionProgressSnapshot={farmingProgressSnapshot}
                timedInteractionProgressRatioRef={farmingProgressRatioRef}
                cameraOffsetRef={cameraOffsetRef}
                cameraWorldZoomRef={cameraWorldZoomRef}
                onFarmingAction={handlingFarmingInteraction}
              />
              <RenderingWorldPlazaWildlifeCorpseStudyLabels
                wildlifeStoreRef={wildlifeStoreRef}
                playerPositionRef={playerPositionRef}
                selectedInteractableBlockKeysRef={
                  selectedInteractableBlockKeysRef
                }
                timedInteractionProgressSnapshot={
                  wildlifeCorpseStudyProgressSnapshot
                }
                timedInteractionProgressRatioRef={
                  wildlifeCorpseStudyProgressRatioRef
                }
                cameraOffsetRef={cameraOffsetRef}
                cameraWorldZoomRef={cameraWorldZoomRef}
                onStudyCorpse={handlingWildlifeCorpseStudyInteraction}
              />
              <RenderingWorldPlazaTreeStumpStudyLabels
                placedBlocksRef={proximityPlacedBlocksRef}
                playerPositionRef={playerPositionRef}
                selectedInteractableBlockKeysRef={
                  selectedInteractableBlockKeysRef
                }
                choppedTreeStateByTileKeyRef={choppedTreesByTileKeyRef}
                persistenceOwnerId={chopPersistenceOwnerId}
                timedInteractionProgressSnapshot={
                  treeStumpStudyProgressSnapshot
                }
                timedInteractionProgressRatioRef={
                  treeStumpStudyProgressRatioRef
                }
                cameraOffsetRef={cameraOffsetRef}
                cameraWorldZoomRef={cameraWorldZoomRef}
                onStudyStump={handlingTreeStumpStudyInteraction}
              />
            </>
          ) : null}
          {isWildlifeGenerationEnabled && isLocalGameplayEnabled ? (
            <>
              {isWildlifeNameTagsEnabled ? (
                <RenderingWorldPlazaWildlifeNameTags
                  nameTags={wildlifeNameTags}
                  nameTagsOutRef={wildlifeNameTagsRef}
                  cameraOffsetRef={cameraOffsetRef}
                  cameraWorldZoomRef={cameraWorldZoomRef}
                />
              ) : null}
              {isWildlifeDamageNumbersEnabled ? (
                <RenderingWorldPlazaWildlifeHealthFloatTexts
                  floatingCombatTexts={wildlifeFloatingCombatTexts}
                  floatingCombatTextsOutRef={wildlifeFloatingCombatTextsRef}
                  cameraOffsetRef={cameraOffsetRef}
                  cameraWorldZoomRef={cameraWorldZoomRef}
                />
              ) : null}
              {isWildlifeSpeechBubblesEnabled ? (
                <RenderingWorldPlazaWildlifeSpeechBubbles
                  speechBubbles={wildlifeSpeechBubbles}
                  speechBubblesOutRef={wildlifeSpeechBubblesRef}
                  cameraOffsetRef={cameraOffsetRef}
                  cameraWorldZoomRef={cameraWorldZoomRef}
                />
              ) : null}
            </>
          ) : null}
          {isHudWorldAnchorsEnabled && onlineUserId ? (
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
              {isHudActionBarEnabled ? (
                <RenderingWorldPlazaActionBar
                  isVisible
                  isSocialEnabled={isPlazaSocialEnabled}
                  isFullscreenSupported={isFullscreenSupported}
                  isChatOpen={chatSnapshot.isChatOpen}
                  isFriendsOpen={isFriendsPanelOpen}
                  pendingFriendRequestCount={pendingFriendRequestCount}
                  isFullscreen={isFullscreen}
                  isFullscreenViewport={hudIsFullscreen}
                  viewportHudScale={viewportHudScale}
                  isMobile={hudIsMobile}
                  onExitToHome={onExitToHome}
                  onToggleChat={togglingChatFromActionBar}
                  onToggleFriends={togglingFriendsFromActionBar}
                  isProfileOpen={isProfilePanelOpen}
                  onToggleProfile={togglingProfilePanel}
                  isPetsOpen={isPetRosterPanelOpen}
                  onTogglePets={
                    petRosterSnapshot.pets.length > 0
                      ? togglingPetRosterPanel
                      : undefined
                  }
                  onSelectCodexSection={selectingCodexSectionFromActionBar}
                  onToggleFullscreen={() => {
                    void togglingViewportFullscreen({
                      shouldLockLandscapeOrientation: isMobile,
                    });
                  }}
                  hungerHud={hungerHudSnapshot}
                  temperatureHud={{
                    localTemperatureCelsius:
                      playerHealthHudSnapshot.localTemperatureCelsius,
                    temperatureDisplayUnit:
                      playerHealthHudSnapshot.temperatureDisplayUnit,
                    comfortBand: temperatureComfortBand,
                  }}
                  playerPositionRef={playerPositionRef}
                  minimapHud={
                    isHudMinimapEnabled
                      ? {
                          playerRenderPositionRegistryRef:
                            playerRenderPositionRegistryRef,
                          isWalkingRef,
                          isRunningRef,
                          localUserId: onlineUserId,
                          ownedPlotsRef,
                        }
                      : null
                  }
                  inlineChatSlot={
                    isPlazaSocialEnabled ? (
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
              ) : null}
              {isHudHotbarEnabled ? (
                <>
                  {hudToolbarEditModePlotCapacityMetric}
                  <RenderingWorldPlazaHudToolbarBottomAnchor
                    activeMode={hudToolbarMode}
                    onSelectMode={selectingHudToolbarMode}
                    isEditEnabled={isBuildModeEnabled}
                    viewportHudScale={viewportHudScale}
                    isMobile={hudIsMobile}
                    isFullscreen={hudIsFullscreen}
                  >
                    {hudToolbarMode ===
                    DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS ? (
                      <RenderingWorldPlazaInventoryHotbar
                        onlineUserId={onlineUserId}
                        viewportHudScale={viewportHudScale}
                        isMobile={hudIsMobile}
                        isFullscreen={hudIsFullscreen}
                        isEmbeddedInHudToolbarStack
                        inventoryDropPlacement={inventoryDropPlacement}
                        selectedSlotIndex={equipment.selectedSlotIndex}
                        onSelectHotbarSlot={equipment.selectingHotbarSlot}
                        onEatHotbarSlot={handlingEatHotbarSlot}
                        onStudyHotbarSlot={handlingStudyHotbarSlot}
                        onAttachRecipePageHotbarSlot={
                          handlingAttachRecipePageHotbarSlot
                        }
                        onUseActiveEnchantment={handlingUseActiveEnchantment}
                        playerEffectiveMaxHealth={
                          playerHealthHudSnapshot.effectiveMaxHealth
                        }
                      />
                    ) : null}
                    {hudToolbarMode ===
                    DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT ? (
                      <RenderingWorldPlazaHudToolbarCraftModePanel
                        inventoryState={inventoryState}
                        isCraftingEnabled={isHudCraftingEnabled}
                        openCookbookId={openCraftCookbookId}
                        onOpenCookbookIdChange={setOpenCraftCookbookId}
                        onCraftRecipe={handlingCraftRecipe}
                      />
                    ) : null}
                    {hudToolbarEditModeHotbar}
                  </RenderingWorldPlazaHudToolbarBottomAnchor>
                  <RenderingWorldPlazaGroundItems
                    onlineUserId={onlineUserId}
                    playerPositionRef={playerPositionRef}
                    cameraOffsetRef={cameraOffsetRef}
                    cameraWorldZoomRef={cameraWorldZoomRef}
                    viewportHudScale={viewportHudScale}
                    wildlifeStoreRef={wildlifeStoreRef}
                    playerTargetId={localPlayerProjectileTargetId}
                  />
                  <RenderingWorldPlazaInventoryDropItemOverlay
                    dropMarkerTileRef={inventoryDropPlacement.dropMarkerTileRef}
                    dropPlacementItemTypeIdRef={
                      inventoryDropPlacement.dropPlacementItemTypeIdRef
                    }
                    cameraOffsetRef={cameraOffsetRef}
                    cameraWorldZoomRef={cameraWorldZoomRef}
                    viewportHudScale={viewportHudScale}
                  />
                </>
              ) : null}
              <RenderingWorldPlazaFriendsPanel
                isEnabled={isPlazaSocialEnabled}
                isOpen={isFriendsPanelOpen}
                onClose={closingFriendsPanel}
                localUserId={onlineUserId}
                plazaOnlineParticipants={roomSnapshot.onlineParticipants}
                trackedFriendUserId={trackedFriendUserId}
                onToggleTrackFriend={togglingFriendTracking}
              />
            </>
          ) : null}
          {buildModeUserId ? (
            <>
              <RenderingWorldPlazaBuildModeDiscardDialog
                isOpen={isDiscardBuildDraftDialogOpen}
                onKeepBuilding={cancelingBuildDraftDiscard}
                onConfirmDiscard={confirmingBuildDraftDiscard}
              />
            </>
          ) : null}
          {isHudWorldAnchorsEnabled ? (
            <RenderingWildlifeDocileBetrayInteractionLabels
              pending={docileAttackConfirmPending}
              wildlifeStoreRef={wildlifeStoreRef}
              timedInteractionProgressSnapshot={docileBetrayProgressSnapshot}
              timedInteractionProgressRatioRef={docileBetrayProgressRatioRef}
              cameraOffsetRef={cameraOffsetRef}
              cameraWorldZoomRef={cameraWorldZoomRef}
              canFeedPet={inventoryState.slots.some(
                (slot) =>
                  slot !== null &&
                  checkingWorldPlazaInventoryItemIsFood(slot.itemTypeId)
              )}
              onBetray={handlingDocileBetrayInteraction}
              onNamePet={openingPetNameDialog}
              onOpenPetModal={openingPetModal}
              onFeedPet={(instanceId) => {
                const foodSlotIndex = inventoryState.slots.findIndex(
                  (slot) =>
                    slot !== null &&
                    checkingWorldPlazaInventoryItemIsFood(slot.itemTypeId)
                );

                if (foodSlotIndex < 0) {
                  return;
                }

                handlingPetFeed(instanceId, foodSlotIndex);
              }}
              onSetPetCommand={handlingPetSetCommand}
            />
          ) : null}
          {isHudStatusEnabled && onlineUserId ? (
            <RenderingWorldPlazaRoomStatusHud
              roomSnapshot={roomSnapshot}
              localUserId={onlineUserId}
              maxPlayers={onlineMaxPlayers}
              isHidden={false}
            />
          ) : null}
          {isSinglePlayerSession ? (
            <>
              {isHudActionBarEnabled ? (
                <RenderingWorldPlazaActionBar
                  isVisible
                  isSocialEnabled={false}
                  isFullscreenSupported={isFullscreenSupported}
                  isChatOpen={false}
                  isFriendsOpen={false}
                  isFullscreen={isFullscreen}
                  isFullscreenViewport={hudIsFullscreen}
                  viewportHudScale={viewportHudScale}
                  isMobile={hudIsMobile}
                  onExitToHome={onExitToHome}
                  onToggleChat={() => undefined}
                  onToggleFriends={() => undefined}
                  isProfileOpen={isProfilePanelOpen}
                  onToggleProfile={togglingProfilePanel}
                  isPetsOpen={isPetRosterPanelOpen}
                  onTogglePets={
                    petRosterSnapshot.pets.length > 0
                      ? togglingPetRosterPanel
                      : undefined
                  }
                  onSelectCodexSection={selectingCodexSectionFromActionBar}
                  onToggleFullscreen={() => {
                    void togglingViewportFullscreen({
                      shouldLockLandscapeOrientation: isMobile,
                    });
                  }}
                  hungerHud={hungerHudSnapshot}
                  temperatureHud={{
                    localTemperatureCelsius:
                      playerHealthHudSnapshot.localTemperatureCelsius,
                    temperatureDisplayUnit:
                      playerHealthHudSnapshot.temperatureDisplayUnit,
                    comfortBand: temperatureComfortBand,
                  }}
                  playerPositionRef={playerPositionRef}
                  minimapHud={
                    isHudMinimapEnabled
                      ? {
                          playerRenderPositionRegistryRef:
                            playerRenderPositionRegistryRef,
                          isWalkingRef,
                          isRunningRef,
                          localUserId: onlineUserId,
                          ownedPlotsRef,
                        }
                      : null
                  }
                />
              ) : null}
              {isHudHotbarEnabled ? (
                <>
                  {hudToolbarEditModePlotCapacityMetric}
                  <RenderingWorldPlazaHudToolbarBottomAnchor
                    activeMode={hudToolbarMode}
                    onSelectMode={selectingHudToolbarMode}
                    isEditEnabled={isBuildModeEnabled}
                    viewportHudScale={viewportHudScale}
                    isMobile={hudIsMobile}
                    isFullscreen={hudIsFullscreen}
                  >
                    {hudToolbarMode ===
                    DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS ? (
                      <RenderingWorldPlazaInventoryHotbar
                        localPersistenceOwnerId={localPersistenceOwnerId}
                        redditUserId={redditUserId}
                        saveSlotIndex={singlePlayerSaveSlotIndex}
                        viewportHudScale={viewportHudScale}
                        isMobile={hudIsMobile}
                        isFullscreen={hudIsFullscreen}
                        isEmbeddedInHudToolbarStack
                        inventoryDropPlacement={inventoryDropPlacement}
                        selectedSlotIndex={equipment.selectedSlotIndex}
                        onSelectHotbarSlot={equipment.selectingHotbarSlot}
                        onEatHotbarSlot={handlingEatHotbarSlot}
                        onStudyHotbarSlot={handlingStudyHotbarSlot}
                        onAttachRecipePageHotbarSlot={
                          handlingAttachRecipePageHotbarSlot
                        }
                        onUseActiveEnchantment={handlingUseActiveEnchantment}
                        playerEffectiveMaxHealth={
                          playerHealthHudSnapshot.effectiveMaxHealth
                        }
                      />
                    ) : null}
                    {hudToolbarMode ===
                    DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT ? (
                      <RenderingWorldPlazaHudToolbarCraftModePanel
                        inventoryState={inventoryState}
                        isCraftingEnabled={isHudCraftingEnabled}
                        openCookbookId={openCraftCookbookId}
                        onOpenCookbookIdChange={setOpenCraftCookbookId}
                        onCraftRecipe={handlingCraftRecipe}
                      />
                    ) : null}
                    {hudToolbarEditModeHotbar}
                  </RenderingWorldPlazaHudToolbarBottomAnchor>
                  <RenderingWorldPlazaGroundItems
                    localPersistenceOwnerId={localPersistenceOwnerId}
                    redditUserId={redditUserId}
                    saveSlotIndex={singlePlayerSaveSlotIndex}
                    playerPositionRef={playerPositionRef}
                    cameraOffsetRef={cameraOffsetRef}
                    cameraWorldZoomRef={cameraWorldZoomRef}
                    viewportHudScale={viewportHudScale}
                    wildlifeStoreRef={wildlifeStoreRef}
                    playerTargetId={localPlayerProjectileTargetId}
                  />
                  <RenderingWorldPlazaInventoryDropItemOverlay
                    dropMarkerTileRef={inventoryDropPlacement.dropMarkerTileRef}
                    dropPlacementItemTypeIdRef={
                      inventoryDropPlacement.dropPlacementItemTypeIdRef
                    }
                    cameraOffsetRef={cameraOffsetRef}
                    cameraWorldZoomRef={cameraWorldZoomRef}
                    viewportHudScale={viewportHudScale}
                  />
                </>
              ) : null}
            </>
          ) : null}
          <RenderingWorldPlazaProfilePanel
            isOpen={isProfilePanelOpen}
            onClose={closingProfilePanel}
            displayName={onlineDisplayName}
            characterDisplayName={selectedCharacterEngineDefinition.displayName}
            healthHudSnapshot={playerHealthHudSnapshot}
            hungerHudSnapshot={hungerHudSnapshot}
            staminaHud={{
              staminaRatio,
              isRunning: isRunningHud,
              isDepleted: isStaminaDepleted,
            }}
            derivedStats={selectedCharacterEngineDerivedStats}
          />
          <RenderingWildlifePetRosterPanel
            isOpen={isPetRosterPanelOpen}
            onClose={closingPetRosterPanel}
          />
        </RenderingWorldPlazaGameplayHud>
      </div>
      <RenderingWildlifePetNameDialog
        isOpen={isPetNameDialogOpen}
        speciesId={
          namingPetInstanceId
            ? (gettingWildlifeInstance(
                wildlifeStoreRef.current,
                namingPetInstanceId
              )?.speciesId ?? null)
            : null
        }
        onCancel={closingPetNameDialog}
        onConfirm={handlingPetNameDialogConfirm}
      />
      <RenderingWildlifePetModal
        isOpen={isPetModalOpen}
        instanceId={selectedPetInstanceId}
        wildlifeStoreRef={wildlifeStoreRef}
        inventoryState={inventoryState}
        characterSkillIds={selectedCharacterEngineDefinition.skillIds}
        onClose={closingPetModal}
        onSetCommand={handlingPetSetCommand}
        onFeed={handlingPetFeed}
        onHeal={handlingPetHeal}
        onEquipWeapon={handlingPetEquipWeapon}
        onUnequipWeapon={handlingPetUnequipWeapon}
        onTeachSkill={handlingPetTeachSkill}
        onEquipSkill={handlingPetEquipSkill}
      />
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
      <RenderingWorldPlazaBestiaryOverlay
        isOpen={activeCodexSection === 'bestiary'}
        onClose={closingCodexSection}
      />
      <RenderingWorldPlazaHerbariumOverlay
        isOpen={activeCodexSection === 'herbarium'}
        onClose={closingCodexSection}
      />
      <RenderingWorldPlazaLapidaryOverlay
        isOpen={activeCodexSection === 'lapidary'}
        onClose={closingCodexSection}
      />
      <RenderingWorldPlazaRecipesOverlay
        isOpen={activeCodexSection === 'recipes'}
        onClose={closingCodexSection}
      />
      <RenderingWorldPlazaLoreBookOverlay
        isOpen={activeCodexSection === 'lore'}
        onClose={closingCodexSection}
      />
      <RenderingWorldPlazaMobileDebugPanel
        isVisible={isMobileDebugHudVisible}
        performanceProfile={performanceProfile}
        frameStats={mobileDebugFrameStats}
        uptimeSec={mobileDebugUptimeSec}
        onCopyReport={() => {
          void copyingMobileDebugReport();
        }}
        onHide={hidingMobileDebugHud}
      />
    </div>
  );
}
