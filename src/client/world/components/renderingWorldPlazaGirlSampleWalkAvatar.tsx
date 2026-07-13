'use client';

import { applyingWorldPlazaDeclarativeAvatarMotionToSprite } from '@/components/world/animation/domains/applyingWorldPlazaDeclarativeAvatarMotionToSprite';
import {
  resolvingWorldPlazaAvatarToolActionClipAssignment,
  type DefiningWorldPlazaAvatarToolAction,
  type DefiningWorldPlazaAvatarToolActionId,
} from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
import {
  formattingWorldPlazaAvatarMotionClipId,
  type DefiningWorldPlazaAvatarMotionClipSuffix,
} from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { resolvingWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { registeringWorldPlazaAvatarCombatMotionAnimationClips } from '@/components/world/animation/domains/registeringWorldPlazaAvatarCombatMotionAnimationClips';
import { registeringWorldPlazaAvatarMotionAnimationClips } from '@/components/world/animation/domains/registeringWorldPlazaAvatarMotionAnimationClips';
import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { computingWorldPlazaPlayerJumpLayerReachMaxFromMultiplier } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import {
  checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex,
  resolvingWorldBuildingJumpForwardGridDistanceClampedToWall,
} from '@/components/world/building/domains/resolvingWorldBuildingCollision';
import { syncingWorldPlazaPlayerStandingLayer } from '@/components/world/building/domains/syncingWorldPlazaPlayerStandingLayer';
import {
  checkingWorldPlazaCharacterEngineMotionKindAllowed,
  resolvingWorldPlazaCharacterEngineShouldRun,
} from '@/components/world/character/domains/checkingWorldPlazaCharacterEngineMotionKindAllowed';
import { convertingWorldPlazaCharacterEngineGridSpeedToScreenSpeedPerSecond } from '@/components/world/character/domains/computingWorldPlazaCharacterEngineDerivedStats';
import { computingWorldPlazaCharacterEngineSpriteScale } from '@/components/world/character/domains/computingWorldPlazaCharacterEngineSpriteScale';
import {
  usingWorldPlazaSelectedCharacterEngineDefinition,
  usingWorldPlazaSelectedCharacterEngineDerivedStats,
} from '@/components/world/character/hooks/usingWorldPlazaSelectedCharacterEngineDefinition';
import { resolvingWorldCollisionEjectingPlayerFromBlockedWorldPoint } from '@/components/world/collision';
import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import { RenderingWorldPlazaAvatarCharacterSwitchEffect } from '@/components/world/components/renderingWorldPlazaAvatarCharacterSwitchEffect';
import { DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET } from '@/components/world/depth';
import { advancingWorldPlazaGirlSampleCombatPresentation } from '@/components/world/domains/advancingWorldPlazaGirlSampleCombatPresentation';
import { applyingWorldPlazaGirlSampleAvatarMotionToSpriteWithFallback } from '@/components/world/domains/applyingWorldPlazaGirlSampleAvatarMotionToSpriteWithFallback';
import { attemptingWorldPlazaPlayerFallFromLayerDrop } from '@/components/world/domains/attemptingWorldPlazaPlayerFallFromLayerDrop';
import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import {
  checkingWorldPlazaAvatarCombatMotionSupported,
  checkingWorldPlazaAvatarCombatPresentationSupported,
  resolvingWorldPlazaAnimalCombatMotionClipSuffix,
} from '@/components/world/domains/checkingWorldPlazaAvatarCombatPresentationSupported';
import { checkingWorldPlazaGirlSampleAvatarRollClipReady } from '@/components/world/domains/checkingWorldPlazaGirlSampleAvatarCombatClipsReady';
import { checkingWorldPlazaGirlSampleRollCanChainIntoNext } from '@/components/world/domains/checkingWorldPlazaGirlSampleRollCanChainIntoNext';
import { checkingWorldPlazaGirlSampleRollDodgeWindowIsActive } from '@/components/world/domains/checkingWorldPlazaGirlSampleRollDodgeWindowIsActive';
import { checkingWorldPlazaPlayerMobileAutoJumpWaterGapAhead } from '@/components/world/domains/checkingWorldPlazaPlayerMobileAutoJumpWaterGapAhead';
import { checkingWorldPlazaPlayerShouldSlideOnIceAfterRun } from '@/components/world/domains/checkingWorldPlazaPlayerShouldSlideOnIceAfterRun';
import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { computingWorldPlazaAcceleratedRunSpeed } from '@/components/world/domains/computingWorldPlazaAcceleratedRunSpeed';
import { computingWorldPlazaAvatarGroundShadowSizeScale } from '@/components/world/domains/computingWorldPlazaAvatarGroundShadowSizeScale';
import { computingWorldPlazaGirlSampleFallDurationMs } from '@/components/world/domains/computingWorldPlazaGirlSampleFallDurationMs';
import { computingWorldPlazaGirlSampleFallVerticalOffsetPx } from '@/components/world/domains/computingWorldPlazaGirlSampleFallVerticalOffsetPx';
import { computingWorldPlazaGirlSampleJumpArcOffsetPx } from '@/components/world/domains/computingWorldPlazaGirlSampleJumpArcOffsetPx';
import { computingWorldPlazaGirlSampleRollChainUnlockAtMs } from '@/components/world/domains/computingWorldPlazaGirlSampleRollChainUnlockAtMs';
import {
  computingWorldPlazaIceSlideVelocity,
  resolvingWorldPlazaIceRunAnimationSpeedScale,
  type DefiningWorldPlazaIceSlideVelocity,
} from '@/components/world/domains/computingWorldPlazaIceSlideVelocity';
import { computingWorldPlazaIsometricGridDeltaFromScreenDirection } from '@/components/world/domains/computingWorldPlazaIsometricGridDeltaFromScreenDirection';
import { computingWorldPlazaIsometricGridStepTowardTarget } from '@/components/world/domains/computingWorldPlazaIsometricGridStepTowardTarget';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { checkingWorldPlazaAnimalAvatarCombatSupported } from '@/components/world/domains/definingWorldPlazaAnimalAvatarCombatRegistry';
import { resolvingWorldPlazaAvatarFootOffsetBelowGridAnchorPx } from '@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition';
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
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN,
  DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_WALK,
  type DefiningWorldPlazaAvatarMotionKind,
  type DefiningWorldPlazaAvatarMotionState,
} from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';
import type { DefiningWorldPlazaFallState } from '@/components/world/domains/definingWorldPlazaFallState';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_REACTION_DURATION_MS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_DURATION_MS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_DURATION_MS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_FORWARD_GRID_DISTANCE,
  type DefiningWorldPlazaGirlSampleCombatMotionClipSuffix,
} from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_READY_IDLE_DURATION_MS } from '@/components/world/domains/definingWorldPlazaGirlSampleIdleConstants';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_ARC_PEAK_SCREEN_PX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DURATION_MS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_FORWARD_GRID_DISTANCE,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_ARC_PEAK_SCREEN_PX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_FORWARD_GRID_DISTANCE,
} from '@/components/world/domains/definingWorldPlazaGirlSampleJumpConstants';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON,
  type DefiningWorldPlazaGirlSampleWalkDirection,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import { DEFINING_WORLD_PLAZA_ICE_SLIDE_SCREEN_RUN_SPEED_PER_SECOND } from '@/components/world/domains/definingWorldPlazaIceSlideConstants';
import type { DefiningWorldPlazaJumpState } from '@/components/world/domains/definingWorldPlazaJumpState';
import {
  DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_COOLDOWN_MS,
  DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_PROBE_INTERVAL_MS,
} from '@/components/world/domains/definingWorldPlazaMobileAutoJumpConstants';
import type { DefiningWorldPlazaMovementDirection } from '@/components/world/domains/definingWorldPlazaMovementDirection';
import { checkingWorldPlazaMovementDirectionIsActive } from '@/components/world/domains/definingWorldPlazaMovementDirection';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaRunStaminaState } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  computingWorldPlazaAvatarGroundShadowJumpHeightRatio,
  drawingWorldPlazaAvatarGroundShadowOnGraphics,
  updatingWorldPlazaAvatarGroundShadowGraphics,
} from '@/components/world/domains/drawingWorldPlazaAvatarGroundShadowOnGraphics';
import { loadingWorldPlazaAnimalAvatarCombatMotionTextures } from '@/components/world/domains/loadingWorldPlazaAnimalAvatarCombatMotionTextures';
import { loadingWorldPlazaGirlSampleCombatMotionTextures } from '@/components/world/domains/loadingWorldPlazaGirlSampleCharacterTextures';
import { checkingWorldPlazaDevQaLoadEnabled } from '@/components/world/domains/managingWorldPlazaDevQaLoadStore';
import {
  applyingWorldPlazaCachedDisplayObjectZIndex,
  computingWorldPlazaPlacedBlocksDepthRevision,
  creatingWorldPlazaEntityDepthSortCache,
  resolvingWorldPlazaCachedAvatarBodySortKey,
} from '@/components/world/domains/managingWorldPlazaEntityDepthSortCache';
import { checkingWorldPlazaMobileAutoJumpEnabled } from '@/components/world/domains/managingWorldPlazaMobileAutoJumpStore';
import {
  beginningWorldPlazaPerformanceSample,
  checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled,
  incrementingWorldPlazaPerformanceDiagnosticsCounter,
  settingWorldPlazaPerformanceDiagnosticsGauge,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { notifyingWorldPlazaAvatarMotionSfxEvent } from '@/components/world/domains/notifyingWorldPlazaAvatarMotionSfxEvent';
import { recordingWorldPlazaPlayerPerformanceDiagnostics } from '@/components/world/domains/recordingWorldPlazaPlayerPerformanceDiagnostics';
import { resolvingWorldPlazaAvatarClipPresentation } from '@/components/world/domains/resolvingWorldPlazaAvatarClipPresentation';
import { resolvingWorldPlazaAvatarRollDurationMs } from '@/components/world/domains/resolvingWorldPlazaAvatarRollDurationMs';
import { resolvingWorldPlazaGirlSampleCombatSpritePresentation } from '@/components/world/domains/resolvingWorldPlazaGirlSampleCombatSpritePresentation';
import { resolvingWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirection';
import { resolvingWorldPlazaGirlSampleWalkDirectionToGridDirection } from '@/components/world/domains/resolvingWorldPlazaGirlSampleWalkDirectionToGridDirection';
import { resolvingWorldPlazaIceSlideFrozenRunFrameIndex } from '@/components/world/domains/resolvingWorldPlazaIceSlideFrozenRunFrameIndex';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { resolvingWorldPlazaJumpLandingGridPointAlongPath } from '@/components/world/domains/resolvingWorldPlazaJumpLandingGridPointAlongPath';
import {
  checkingWorldPlazaLavaHeatProximityAtGridPoint,
  checkingWorldPlazaLavaSinkHidesAvatarBodyAtBaseOffsetPx,
  computingWorldPlazaLavaMovementSpeedMultiplierAtGridPoint,
  computingWorldPlazaLavaSinkBobOffsetPx,
  computingWorldPlazaLavaSinkOffsetPxAtGridPoint,
  drawingWorldPlazaLavaHeatProximityGlowOnGraphics,
  drawingWorldPlazaLavaSinkCoverBackOnGraphics,
  drawingWorldPlazaLavaSinkCoverFrontOnGraphics,
  updatingWorldPlazaLavaHeatProximityGlowAnimation,
  updatingWorldPlazaLavaSinkCoverAnimation,
} from '@/components/world/domains/resolvingWorldPlazaLavaSinkStateAtGridPoint';
import { resolvingWorldPlazaRunAnimationSpeedScale } from '@/components/world/domains/resolvingWorldPlazaRunAnimationSpeedScale';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { checkingWorldPlazaTerrainBlocksJumpLandingAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainObstacleKindFromFeature';
import { settlingWorldPlazaMeleeSwingDamage } from '@/components/world/domains/settlingWorldPlazaMeleeSwingDamage';
import { computingWorldPlazaHeldItemSwingPose } from '@/components/world/equipment/domains/computingWorldPlazaHeldItemSwingPose';
import type { DefiningWorldPlazaHeldItemPresentation } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemPresentationRegistry';
import { DEFINING_WORLD_PLAZA_HELD_ITEM_SWING_PROFILE_BY_TOOL_ACTION } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemSwingRegistry';
import { usingWorldPlazaAvatarHeldItemOverlay } from '@/components/world/equipment/hooks/usingWorldPlazaAvatarHeldItemOverlay';
import { applyingWorldPlazaConfusionDeflectionToGridDelta } from '@/components/world/health/domains/applyingWorldPlazaConfusionDeflectionToGridDelta';
import { checkingWorldPlazaEntityPlayerSleepIsActive } from '@/components/world/health/domains/checkingWorldPlazaEntityPlayerSleepIsActive';
import { resolvingWorldPlazaEntityHealthActiveStunEffect } from '@/components/world/health/domains/checkingWorldPlazaEntityPlayerStunIsActive';
import { computingWorldPlazaEntityRespawnInvincibilityBlinkAlpha } from '@/components/world/health/domains/computingWorldPlazaEntityRespawnInvincibilityBlinkAlpha';
import { computingWorldPlazaEntityStunAvatarWobbleRadians } from '@/components/world/health/domains/computingWorldPlazaEntityStunAvatarWobbleRadians';
import { resolvingWorldPlazaEnvironmentalFrostMovementSpeedMultiplierForEntity } from '@/components/world/health/domains/computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier';
import { computingWorldPlazaFrostbiteAvatarTint } from '@/components/world/health/domains/computingWorldPlazaFrostbiteAvatarTint';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { DEFINING_WORLD_PLAZA_ENTITY_TEMPERATURE_RESISTANCE_DEFAULT } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import { resolvingWorldPlazaEntityHealthMovementMultipliers } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthMovementMultipliers';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { usingWorldPlazaSelectedAvatarCharacterDefinition } from '@/components/world/hooks/usingWorldPlazaSelectedAvatarCharacterDefinition';
import type { ResolvingWorldPlazaHungerMovementEffects } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerMovementEffects';
import {
  advancingWorldPlazaNavigationWalkWaypoint,
  applyingWorldPlazaNavigationWalkTargets,
  checkingWorldPlazaNavigationPathNeedsReplan,
  clearingWorldPlazaNavigationWalkWaypoints,
  DEFINING_WORLD_PLAZA_NAVIGATION_REPLAN_STUCK_FRAME_COUNT,
  resolvingWorldPlazaNavigationWalkPlan,
} from '@/components/world/navigation';
import type { DefiningWorldPlazaPlayerProjectileDodgeState } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import { useQuery } from '@tanstack/react-query';
import type { Container, Graphics, Sprite, Ticker } from 'pixi.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Below this grid distance moved in a frame, a click-walk pressing into a tree
 * trunk is treated as blocked and the walk target is dropped (avoids the avatar
 * grinding its walk animation forever against a trunk).
 */
const DEFINING_WORLD_PLAZA_AVATAR_WALK_BLOCKED_GRID_EPSILON = 0.002;

/** Below this length, reuse the last non-zero frame movement for cliff lip relief. */
const DEFINING_WORLD_PLAZA_AVATAR_CLIFF_LIP_MOVEMENT_REUSE_EPSILON = 1e-5;

export interface RenderingWorldPlazaGirlSampleWalkAvatarProps {
  /** Shared player position in grid space. */
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  /** Auth user id for live render-position registry writes. */
  localUserId: string | null;
  /** Live avatar render positions shared with chat bubbles. */
  playerRenderPositionRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
  /** Click destination; null when not walking. */
  walkTargetRef: React.RefObject<DefiningWorldPlazaWorldPoint | null>;
  /** Remaining queued navigation waypoints after the active target. */
  walkWaypointsRef?: React.RefObject<DefiningWorldPlazaWorldPoint[]>;
  /** Final click destination retained for replans. */
  walkDestinationRef?: React.RefObject<DefiningWorldPlazaWorldPoint | null>;
  /** Placed-block ids captured when the active path was planned. */
  navigationPlacedBlockSnapshotRef?: React.RefObject<ReadonlySet<string>>;
  /** Updated each frame while walking toward a click target. */
  isWalkingRef: React.RefObject<boolean>;
  /** True while hold-to-run movement is active (owned by the stamina loop). */
  isRunningRef: React.RefObject<boolean>;
  /** Live run stamina state (burst ramp reads `runningForSeconds`). */
  runStaminaStateRef?: React.RefObject<DefiningWorldPlazaRunStaminaState>;
  /** Set by the jump input hook; consumed when a jump starts. */
  jumpRequestedRef: React.RefObject<boolean>;
  /** Spends stamina for a jump; returns false when the jump is blocked. */
  tryConsumingJumpStaminaRef: React.RefObject<(isRunJump: boolean) => boolean>;
  /** Spends stamina for a roll dodge; returns false when the roll is blocked. */
  tryConsumingRollStaminaRef?: React.RefObject<() => boolean>;
  /** True while a jump animation is in progress. */
  isJumpingRef: React.RefObject<boolean>;
  /** Live motion state synced to Colyseus each frame. */
  localAvatarMotionStateRef: React.RefObject<DefiningWorldPlazaAvatarMotionState>;
  /** Equipped hotbar held-item overlay resolved from inventory. */
  equippedHeldItemPresentationRef?: React.RefObject<DefiningWorldPlazaHeldItemPresentation | null>;
  /** Sends position and motion immediately (e.g. on jump start). */
  syncingMovePositionRef?: React.RefObject<(() => void) | null>;
  /** Optional hook invoked when the avatar reaches the click target or lands. */
  onWalkArrivedRef?: React.RefObject<(() => void) | null>;
  /** Optional hook invoked after each click-walk step while moving. */
  onWalkStepRef?: React.RefObject<(() => void) | null>;
  /** Optional hook invoked when a layer-drop fall finishes landing. */
  onFallLandedRef?: React.RefObject<((layerDelta: number) => void) | null>;
  /** Set when a collision box stops movement; cleared on the next pointer input. */
  isWalkPausedByCollisionRef: React.RefObject<boolean>;
  /** Held arrow keys and WASD direction from keyboard input. */
  keyboardDirectionRef: React.RefObject<DefiningWorldPlazaMovementDirection>;
  /** Player-placed blocks near the avatar for collision resolution. */
  placedBlocksRef?: React.RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
  /** Idle turn-in-place facing updated by Q/E and movement. */
  characterFacingDirectionRef: React.RefObject<DefiningWorldPlazaGirlSampleWalkDirection>;
  /** True while actively running on frozen water; drives faster ice run stamina drain. */
  isRunningOnIceRef?: React.RefObject<boolean>;
  /** When true, the avatar stops moving while dead. */
  isPlayerDeadRef?: React.RefObject<boolean>;
  /** Active timed tool action; the avatar plays its clip and stays in place. */
  activeToolActionRef?: React.RefObject<DefiningWorldPlazaAvatarToolAction | null>;
  /** Post-respawn invincibility expiry for sprite blink feedback. */
  postRespawnInvincibilityUntilMsRef?: React.RefObject<number>;
  /** Live player health state for movement buff multipliers. */
  healthStateRef?: React.RefObject<DefiningWorldPlazaEntityHealthState>;
  /** Smoothed local temperature for environmental frost movement slow. */
  localTemperatureCelsiusRef?: React.RefObject<number | null>;
  /** Live hunger tier movement effects (speed gates, jump lockout). */
  hungerMovementMultipliersRef?: React.RefObject<ResolvingWorldPlazaHungerMovementEffects>;
  /** Spends hunger for a jump; fire-and-forget, called alongside stamina consumption. */
  consumingJumpHungerRef?: React.RefObject<(isRunJump: boolean) => void>;
  /** Live jump arc offset for projectile dodge resolution. */
  localPlayerDodgeStateRef?: React.RefObject<DefiningWorldPlazaPlayerProjectileDodgeState>;
  /** Roll dodge input and live roll state. */
  rollRequestedRef?: React.RefObject<boolean>;
  rollStateRef?: React.RefObject<DefiningWorldPlazaAvatarRollPresentationState | null>;
  /** Absolute time when the next roll may begin (0 = no cooldown). */
  rollChainUnlockAtMsRef?: React.RefObject<number>;
  isRollingRef?: React.RefObject<boolean>;
  isRollDodgeActiveRef?: React.RefObject<boolean>;
  /** Roll animation progress synced each frame; 0 outside the dodge window. */
  rollDodgeProgressRef?: React.RefObject<number>;
  /** Live melee attack presentation. */
  meleeAttackStateRef?: React.RefObject<DefiningWorldPlazaAvatarMeleePresentationState | null>;
  pushStateRef?: React.RefObject<DefiningWorldPlazaAvatarPushPresentationState | null>;
  blockReactionStateRef?: React.RefObject<DefiningWorldPlazaAvatarBlockReactionPresentationState | null>;
  damagedStateRef?: React.RefObject<DefiningWorldPlazaAvatarDamagedPresentationState | null>;
  deathStateRef?: React.RefObject<DefiningWorldPlazaAvatarDeathPresentationState | null>;
  sleepStateRef?: React.RefObject<DefiningWorldPlazaAvatarSleepPresentationState | null>;
  /** Registers wildlife damage when the melee strip finishes. */
  applyingPlayerMeleeDamageOnSwingCompleteRef?: React.RefObject<
    ((melee: DefiningWorldPlazaAvatarMeleePresentationState) => void) | null
  >;
  damagedReactionUntilMsRef?: React.RefObject<number>;
  defensiveReactionUntilMsRef?: React.RefObject<number>;
  /** True while the HUD viewport profile is mobile (gates auto-jump). */
  isMobileViewportRef?: React.RefObject<boolean>;
}

/**
 * Local plaza test avatar using GirlSample isometric walk, run, and jump strips.
 */
export function RenderingWorldPlazaGirlSampleWalkAvatar({
  playerPositionRef,
  localUserId,
  playerRenderPositionRegistryRef,
  walkTargetRef,
  walkWaypointsRef,
  walkDestinationRef,
  navigationPlacedBlockSnapshotRef,
  isWalkingRef,
  isRunningRef,
  runStaminaStateRef,
  jumpRequestedRef,
  tryConsumingJumpStaminaRef,
  tryConsumingRollStaminaRef,
  isJumpingRef,
  localAvatarMotionStateRef,
  equippedHeldItemPresentationRef,
  syncingMovePositionRef,
  onWalkArrivedRef,
  onWalkStepRef,
  onFallLandedRef,
  isWalkPausedByCollisionRef,
  keyboardDirectionRef,
  placedBlocksRef,
  characterFacingDirectionRef,
  isRunningOnIceRef,
  isPlayerDeadRef,
  activeToolActionRef,
  postRespawnInvincibilityUntilMsRef,
  healthStateRef,
  localTemperatureCelsiusRef,
  hungerMovementMultipliersRef,
  consumingJumpHungerRef,
  localPlayerDodgeStateRef,
  rollRequestedRef,
  rollStateRef,
  rollChainUnlockAtMsRef,
  isRollingRef,
  isRollDodgeActiveRef,
  rollDodgeProgressRef,
  meleeAttackStateRef,
  pushStateRef,
  blockReactionStateRef,
  damagedStateRef,
  deathStateRef,
  sleepStateRef,
  applyingPlayerMeleeDamageOnSwingCompleteRef,
  damagedReactionUntilMsRef,
  defensiveReactionUntilMsRef,
  isMobileViewportRef,
}: RenderingWorldPlazaGirlSampleWalkAvatarProps): React.JSX.Element | null {
  const characterDefinition =
    usingWorldPlazaSelectedAvatarCharacterDefinition();
  const characterEngineDefinition =
    usingWorldPlazaSelectedCharacterEngineDefinition();
  const characterEngineDerivedStats =
    usingWorldPlazaSelectedCharacterEngineDerivedStats();
  const effectiveSpriteScale = computingWorldPlazaCharacterEngineSpriteScale(
    characterDefinition,
    characterEngineDefinition
  );
  const avatarGroundShadowSizeScale =
    computingWorldPlazaAvatarGroundShadowSizeScale(
      characterDefinition,
      characterEngineDerivedStats.sizeScale
    );
  const avatarHeldItemSpriteRef = useRef<Sprite | null>(null);
  const { updatingHeldItemOverlay } = usingWorldPlazaAvatarHeldItemOverlay({
    heldItemSpriteRef: avatarHeldItemSpriteRef,
    effectiveAvatarSpriteScale: effectiveSpriteScale,
  });
  const walkScreenSpeedPerSecond =
    convertingWorldPlazaCharacterEngineGridSpeedToScreenSpeedPerSecond(
      characterEngineDerivedStats.walkSpeedGridPerSecond
    );
  const runScreenSpeedPerSecond =
    convertingWorldPlazaCharacterEngineGridSpeedToScreenSpeedPerSecond(
      characterEngineDerivedStats.runSpeedGridPerSecond
    );
  const navigationStuckFrameCountRef = useRef(0);
  const navigationReplanFrameCounterRef = useRef(0);
  const avatarDepthSortCacheRef = useRef(
    creatingWorldPlazaEntityDepthSortCache()
  );
  const avatarBodyZIndexRef = useRef(Number.NaN);
  const avatarShadowZIndexRef = useRef(Number.NaN);
  const performanceProfile = usingWorldPlazaPerformanceProfile();
  const avatarShadowContainerRef = useRef<Container | null>(null);
  const avatarGroundShadowGraphicsRef = useRef<Graphics | null>(null);
  const avatarLavaHeatProximityGlowGraphicsRef = useRef<Graphics | null>(null);
  const avatarContainerRef = useRef<Container | null>(null);
  const avatarSpriteRef = useRef<Sprite | null>(null);
  const avatarLavaSinkCoverBackGraphicsRef = useRef<Graphics | null>(null);
  const avatarLavaSinkCoverFrontGraphicsRef = useRef<Graphics | null>(null);
  const animationTimeRef = useRef(0);
  const jumpStateRef = useRef<DefiningWorldPlazaJumpState | null>(null);
  const fallStateRef = useRef<DefiningWorldPlazaFallState | null>(null);
  const walkDirectionRef = useRef<DefiningWorldPlazaGirlSampleWalkDirection>(
    characterDefinition.defaultDirection
  );
  const previousMotionKindRef = useRef<DefiningWorldPlazaAvatarMotionKind>(
    DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE
  );
  const inactiveSinceMsRef = useRef<number | null>(null);
  const previousReadyIdleActiveRef = useRef(false);
  const lastLocomotionWasRunRef = useRef(false);
  const lastFrameMovementDeltaRef = useRef({ x: 0, y: 0 });
  const previousCollisionHeightWorldLayersRef = useRef(
    characterEngineDerivedStats.heightWorldLayers
  );
  const confusionPhaseRadiansRef = useRef(0);
  /** Live grid velocity for ice run momentum and post-stop slide. */
  const iceSlideVelocityRef = useRef<DefiningWorldPlazaIceSlideVelocity>({
    x: 0,
    y: 0,
  });
  /** Run strip frame held still while the avatar slides after releasing input on ice. */
  const iceSlideFrozenRunFrameIndexRef = useRef<number | null>(null);
  /** True after an ice run until the post-run slide fully settles. */
  const wasRunningOnIceRef = useRef(false);
  /** Tool action playing on the previous tick, for animation phase resets. */
  const previousToolActionIdRef =
    useRef<DefiningWorldPlazaAvatarToolActionId | null>(null);
  /** Wall-clock start of the current tool action, drives held-item swing. */
  const toolActionSwingStartMsRef = useRef(0);
  const previousDamagedReactionUntilMsRef = useRef(0);
  const previousDefensiveReactionUntilMsRef = useRef(0);
  /** Earliest time another mobile auto-jump may be requested. */
  const mobileAutoJumpUnlockAtMsRef = useRef(0);
  /** Last forward water probe time; the scan is too costly to run every frame. */
  const mobileAutoJumpLastProbeAtMsRef = useRef(0);
  /** When true, the next consumed jump uses run-jump distance (mobile auto-jump). */
  const mobileAutoJumpForceRunJumpRef = useRef(false);
  const requestedCombatMotionTexturesRef = useRef(
    new Set<DefiningWorldPlazaGirlSampleCombatMotionClipSuffix>()
  );
  const [, setCombatTextureRequestRevision] = useState(0);
  const requestingCombatMotionTextures = useCallback(
    (motionKind: DefiningWorldPlazaGirlSampleCombatMotionClipSuffix): void => {
      if (requestedCombatMotionTexturesRef.current.has(motionKind)) {
        return;
      }

      requestedCombatMotionTexturesRef.current.add(motionKind);
      setCombatTextureRequestRevision((revision) => revision + 1);
    },
    []
  );

  const { data: coreCharacterTextures } = useQuery({
    queryKey: characterDefinition.texturesQueryKey,
    queryFn: characterDefinition.loadTextures,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
  });

  const supportsCombatPresentation =
    checkingWorldPlazaAvatarCombatPresentationSupported(
      characterDefinition.skinId
    );
  const canLoadRequestedCombatTextures =
    supportsCombatPresentation && Boolean(coreCharacterTextures);
  const combatTextureQueryDefaults = {
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  } as const;

  const loadingCombatMotionTextures = (
    motionKind: DefiningWorldPlazaGirlSampleCombatMotionClipSuffix
  ) => {
    if (
      checkingWorldPlazaAnimalAvatarCombatSupported(characterDefinition.skinId)
    ) {
      const animalMotionKind =
        resolvingWorldPlazaAnimalCombatMotionClipSuffix(motionKind);

      if (!animalMotionKind) {
        return Promise.reject(
          new Error(
            `Animal skin ${characterDefinition.skinId} has no combat strip for ${motionKind}.`
          )
        );
      }

      return loadingWorldPlazaAnimalAvatarCombatMotionTextures(
        characterDefinition.skinId,
        animalMotionKind
      );
    }

    return loadingWorldPlazaGirlSampleCombatMotionTextures(motionKind);
  };

  const { data: rollCombatTextures } = useQuery({
    queryKey: [
      ...characterDefinition.texturesQueryKey,
      'combat-strip',
      'roll',
    ] as const,
    queryFn: () => loadingCombatMotionTextures('roll'),
    enabled:
      canLoadRequestedCombatTextures &&
      requestedCombatMotionTexturesRef.current.has('roll') &&
      checkingWorldPlazaAvatarCombatMotionSupported(
        characterDefinition.skinId,
        'roll'
      ),
    ...combatTextureQueryDefaults,
  });
  const { data: meleeCombatTextures } = useQuery({
    queryKey: [
      ...characterDefinition.texturesQueryKey,
      'combat-strip',
      'melee',
    ] as const,
    queryFn: () => loadingCombatMotionTextures('melee'),
    enabled:
      canLoadRequestedCombatTextures &&
      requestedCombatMotionTexturesRef.current.has('melee') &&
      checkingWorldPlazaAvatarCombatMotionSupported(
        characterDefinition.skinId,
        'melee'
      ),
    ...combatTextureQueryDefaults,
  });
  const { data: damagedCombatTextures } = useQuery({
    queryKey: [
      ...characterDefinition.texturesQueryKey,
      'combat-strip',
      'damaged',
    ] as const,
    queryFn: () => loadingCombatMotionTextures('damaged'),
    enabled:
      canLoadRequestedCombatTextures &&
      requestedCombatMotionTexturesRef.current.has('damaged') &&
      checkingWorldPlazaAvatarCombatMotionSupported(
        characterDefinition.skinId,
        'damaged'
      ),
    ...combatTextureQueryDefaults,
  });
  const { data: deathCombatTextures } = useQuery({
    queryKey: [
      ...characterDefinition.texturesQueryKey,
      'combat-strip',
      'death',
    ] as const,
    queryFn: () => loadingCombatMotionTextures('death'),
    enabled:
      canLoadRequestedCombatTextures &&
      requestedCombatMotionTexturesRef.current.has('death') &&
      checkingWorldPlazaAvatarCombatMotionSupported(
        characterDefinition.skinId,
        'death'
      ),
    ...combatTextureQueryDefaults,
  });
  const { data: pushCombatTextures } = useQuery({
    queryKey: [
      ...characterDefinition.texturesQueryKey,
      'combat-strip',
      'push',
    ] as const,
    queryFn: () => loadingCombatMotionTextures('push'),
    enabled:
      canLoadRequestedCombatTextures &&
      requestedCombatMotionTexturesRef.current.has('push') &&
      checkingWorldPlazaAvatarCombatMotionSupported(
        characterDefinition.skinId,
        'push'
      ),
    ...combatTextureQueryDefaults,
  });
  const { data: blockCombatTextures } = useQuery({
    queryKey: [
      ...characterDefinition.texturesQueryKey,
      'combat-strip',
      'block',
    ] as const,
    queryFn: () => loadingCombatMotionTextures('block'),
    enabled:
      canLoadRequestedCombatTextures &&
      requestedCombatMotionTexturesRef.current.has('block') &&
      checkingWorldPlazaAvatarCombatMotionSupported(
        characterDefinition.skinId,
        'block'
      ),
    ...combatTextureQueryDefaults,
  });
  const loadedCombatTextures = useMemo(() => {
    if (
      !rollCombatTextures &&
      !meleeCombatTextures &&
      !damagedCombatTextures &&
      !deathCombatTextures &&
      !pushCombatTextures &&
      !blockCombatTextures
    ) {
      return undefined;
    }

    return {
      ...(rollCombatTextures ? { roll: rollCombatTextures } : {}),
      ...(meleeCombatTextures ? { melee: meleeCombatTextures } : {}),
      ...(damagedCombatTextures ? { damaged: damagedCombatTextures } : {}),
      ...(deathCombatTextures ? { death: deathCombatTextures } : {}),
      ...(pushCombatTextures ? { push: pushCombatTextures } : {}),
      ...(blockCombatTextures ? { block: blockCombatTextures } : {}),
    };
  }, [
    blockCombatTextures,
    damagedCombatTextures,
    deathCombatTextures,
    meleeCombatTextures,
    pushCombatTextures,
    rollCombatTextures,
  ]);

  const characterTextures = useMemo(() => {
    if (!coreCharacterTextures) {
      return undefined;
    }

    if (!loadedCombatTextures) {
      return coreCharacterTextures;
    }

    return {
      ...coreCharacterTextures,
      ...loadedCombatTextures,
    };
  }, [coreCharacterTextures, loadedCombatTextures]);

  const drawingAvatarLavaSinkCoverBack = useCallback(
    (graphics: Graphics): void => {
      drawingWorldPlazaLavaSinkCoverBackOnGraphics(
        graphics,
        characterEngineDerivedStats.sizeScale
      );
    },
    [characterEngineDerivedStats.sizeScale]
  );

  const drawingAvatarLavaSinkCoverFront = useCallback(
    (graphics: Graphics): void => {
      drawingWorldPlazaLavaSinkCoverFrontOnGraphics(
        graphics,
        characterEngineDerivedStats.sizeScale
      );
    },
    [characterEngineDerivedStats.sizeScale]
  );

  const registeredAvatarClipKeyRef = useRef<string | null>(null);
  const combatClipRegistrationKey = [
    rollCombatTextures ? 'roll' : '',
    meleeCombatTextures ? 'melee' : '',
    damagedCombatTextures ? 'damaged' : '',
    deathCombatTextures ? 'death' : '',
    pushCombatTextures ? 'push' : '',
    blockCombatTextures ? 'block' : '',
  ].join(',');
  const avatarClipRegistrationKey = [
    ...characterDefinition.texturesQueryKey,
    combatClipRegistrationKey || 'core-only',
  ].join('|');

  if (
    characterTextures &&
    registeredAvatarClipKeyRef.current !== avatarClipRegistrationKey
  ) {
    registeringWorldPlazaAvatarMotionAnimationClips({
      characterDefinition,
      textures: characterTextures,
    });

    try {
      registeringWorldPlazaAvatarCombatMotionAnimationClips({
        characterDefinition,
        textures: characterTextures,
      });
    } catch {
      // Combat strips are optional; locomotion clips must keep working.
    }

    registeredAvatarClipKeyRef.current = avatarClipRegistrationKey;
  }

  const drawingAvatarGroundShadow = useCallback(
    (graphics: Graphics): void => {
      avatarGroundShadowGraphicsRef.current = graphics;
      drawingWorldPlazaAvatarGroundShadowOnGraphics(
        graphics,
        0,
        walkDirectionRef.current,
        resolvingWorldPlazaAvatarFootOffsetBelowGridAnchorPx(
          characterDefinition
        ) * characterEngineDerivedStats.sizeScale,
        avatarGroundShadowSizeScale
      );
    },
    [
      avatarGroundShadowSizeScale,
      characterDefinition,
      characterEngineDerivedStats.sizeScale,
    ]
  );

  const drawingAvatarLavaHeatProximityGlow = useCallback(
    (graphics: Graphics): void => {
      avatarLavaHeatProximityGlowGraphicsRef.current = graphics;
      drawingWorldPlazaLavaHeatProximityGlowOnGraphics(
        graphics,
        resolvingWorldPlazaAvatarFootOffsetBelowGridAnchorPx(
          characterDefinition
        ),
        characterEngineDerivedStats.sizeScale
      );
    },
    [characterDefinition, characterEngineDerivedStats.sizeScale]
  );

  const attachingAvatarSprite = useCallback(
    (sprite: Sprite | null): void => {
      avatarSpriteRef.current = sprite;

      if (!sprite) {
        return;
      }

      sprite.anchor.set(
        characterDefinition.anchorXNormalized,
        characterDefinition.anchorYNormalized
      );
      // Only apply the selected skin scale once that skin's textures are ready.
      // Otherwise a high scale (dogs/cats) lands on leftover large-frame art
      // from girl/fox and the avatar looks giant until the query resolves.
      if (characterTextures) {
        sprite.scale.set(effectiveSpriteScale);
      }
      sprite.eventMode = 'none';
    },
    [characterDefinition, characterTextures, effectiveSpriteScale]
  );

  useEffect(() => {
    const sprite = avatarSpriteRef.current;

    if (!sprite || !characterTextures) {
      return;
    }

    sprite.anchor.set(
      characterDefinition.anchorXNormalized,
      characterDefinition.anchorYNormalized
    );
    sprite.scale.set(effectiveSpriteScale);
    applyingWorldPlazaDeclarativeAvatarMotionToSprite({
      sprite,
      skinId: characterDefinition.skinId,
      motionSuffix: 'walk',
      direction: walkDirectionRef.current,
      frameIndex: 0,
    });
  }, [characterTextures, characterDefinition, effectiveSpriteScale]);

  usingWorldPlazaSafeTick((ticker: Ticker) => {
    const finishAvatarTickSample = beginningWorldPlazaPerformanceSample(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.AVATAR_TICK
    );
    const shadowContainer = avatarShadowContainerRef.current;
    const container = avatarContainerRef.current;
    const sprite = avatarSpriteRef.current;
    const playerPosition = playerPositionRef.current;
    const placedBlocksScene = placedBlocksRef?.current;
    const scenePlacedBlocks = placedBlocksScene?.blocks ?? [];
    const scenePlacedBlocksByTile = placedBlocksScene?.blocksByTile;
    const walkTarget = walkTargetRef.current;
    const keyboardDirection = keyboardDirectionRef.current;
    const activeToolAction = activeToolActionRef?.current ?? null;
    const isEatingToolAction = activeToolAction?.toolActionId === 'eat';
    const hasKeyboardDirection =
      checkingWorldPlazaMovementDirectionIsActive(keyboardDirection);
    // Eat reads keyboard for cancel only; other tool actions block locomotion.
    const isKeyboardMoving = !activeToolAction && hasKeyboardDirection;

    if (isKeyboardMoving) {
      if (walkTargetRef.current !== null) {
        walkTargetRef.current = null;
      }

      if (walkDestinationRef) {
        walkDestinationRef.current = null;
      }

      if (walkWaypointsRef) {
        clearingWorldPlazaNavigationWalkWaypoints(walkWaypointsRef);
      }

      if (navigationPlacedBlockSnapshotRef) {
        navigationPlacedBlockSnapshotRef.current = new Set();
      }

      navigationStuckFrameCountRef.current = 0;
      isWalkingRef.current = true;
      isWalkPausedByCollisionRef.current = false;
    } else if (walkTarget === null) {
      isWalkingRef.current = false;
    }

    const jumpState = jumpStateRef.current;
    const fallState = fallStateRef.current;
    const isJumping = jumpState !== null;
    const isFalling = fallState !== null;

    isJumpingRef.current = isJumping || isFalling;

    if (
      !shadowContainer ||
      !container ||
      !sprite ||
      !playerPosition ||
      !characterTextures
    ) {
      finishAvatarTickSample();
      return;
    }

    container.visible =
      checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabled(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.AVATARS
      );

    if (isRunningOnIceRef) {
      isRunningOnIceRef.current = false;
    }

    const nowMs = performance.now();
    const isPlayerDead = isPlayerDeadRef?.current ?? false;
    const isPlayerAsleep = checkingWorldPlazaEntityPlayerSleepIsActive(
      healthStateRef?.current ?? null,
      nowMs
    );
    const activeStunEffect = resolvingWorldPlazaEntityHealthActiveStunEffect(
      healthStateRef?.current ?? null,
      nowMs
    );
    const isPlayerStunned = activeStunEffect !== null;
    const rollDurationMs = resolvingWorldPlazaAvatarRollDurationMs(
      characterDefinition.skinId
    );
    const hasCombatTextures =
      supportsCombatPresentation && loadedCombatTextures !== undefined;
    const hasRollClipReady = checkingWorldPlazaGirlSampleAvatarRollClipReady(
      characterDefinition.skinId,
      characterTextures
    );
    const activeRollState = rollStateRef?.current ?? null;
    const rollProgress = activeRollState
      ? Math.min(1, (nowMs - activeRollState.startedAtMs) / rollDurationMs)
      : 0;
    const isRollAnimating = Boolean(activeRollState) && rollProgress < 1;
    const isRolling = isRollAnimating;
    const activeMeleeState = meleeAttackStateRef?.current ?? null;
    const isMeleeAttacking = Boolean(
      activeMeleeState &&
      nowMs - activeMeleeState.startedAtMs < activeMeleeState.durationMs
    );

    if (supportsCombatPresentation) {
      if (
        (isPlayerDead || isPlayerAsleep) &&
        checkingWorldPlazaAvatarCombatMotionSupported(
          characterDefinition.skinId,
          'death'
        )
      ) {
        requestingCombatMotionTextures('death');
      }

      if (activeRollState || rollRequestedRef?.current) {
        requestingCombatMotionTextures('roll');
      }

      if (activeMeleeState) {
        requestingCombatMotionTextures('melee');
      }
    }

    if (isRollingRef) {
      isRollingRef.current = isRolling;
    }

    if (isPlayerDead) {
      walkTargetRef.current = null;
      isWalkingRef.current = false;
      isRunningRef.current = false;
      isWalkPausedByCollisionRef.current = true;
      jumpStateRef.current = null;
      fallStateRef.current = null;
      isJumpingRef.current = false;
      if (rollRequestedRef) {
        rollRequestedRef.current = false;
      }

      if (sleepStateRef?.current) {
        sleepStateRef.current = null;
      }

      if (deathStateRef && !deathStateRef.current) {
        deathStateRef.current = {
          direction: characterFacingDirectionRef.current,
          startedAtMs: nowMs,
        };
      }
    } else if (deathStateRef?.current) {
      deathStateRef.current = null;
    }

    if (!isPlayerDead && isPlayerAsleep) {
      if (sleepStateRef && !sleepStateRef.current) {
        sleepStateRef.current = {
          direction: characterFacingDirectionRef.current,
          startedAtMs: nowMs,
        };
      }
    } else if (sleepStateRef?.current) {
      sleepStateRef.current = null;
    }

    const damagedReactionUntilMs = damagedReactionUntilMsRef?.current ?? 0;
    const defensiveReactionUntilMs = defensiveReactionUntilMsRef?.current ?? 0;
    const isDamagedReacting = nowMs < damagedReactionUntilMs;

    if (supportsCombatPresentation) {
      if (
        isDamagedReacting &&
        checkingWorldPlazaAvatarCombatMotionSupported(
          characterDefinition.skinId,
          'damaged'
        )
      ) {
        requestingCombatMotionTextures('damaged');
      }

      if (
        nowMs < defensiveReactionUntilMs &&
        checkingWorldPlazaAvatarCombatMotionSupported(
          characterDefinition.skinId,
          'block'
        )
      ) {
        requestingCombatMotionTextures('block');
      }
    }

    if (
      damagedStateRef &&
      damagedReactionUntilMs > previousDamagedReactionUntilMsRef.current &&
      damagedReactionUntilMs > nowMs
    ) {
      damagedStateRef.current = {
        direction: characterFacingDirectionRef.current,
        startedAtMs: nowMs,
      };
      walkTargetRef.current = null;
      isWalkingRef.current = false;
      isRunningRef.current = false;
      jumpRequestedRef.current = false;
      mobileAutoJumpForceRunJumpRef.current = false;
      // Keep buffered roll so the player can cancel hit-react into a dodge.
    }

    if (
      blockReactionStateRef &&
      defensiveReactionUntilMs > previousDefensiveReactionUntilMsRef.current &&
      defensiveReactionUntilMs > nowMs
    ) {
      blockReactionStateRef.current = {
        direction: characterFacingDirectionRef.current,
        startedAtMs: nowMs,
      };
    }

    previousDamagedReactionUntilMsRef.current = damagedReactionUntilMs;
    previousDefensiveReactionUntilMsRef.current = defensiveReactionUntilMs;

    const blocksLocomotionInput =
      isPlayerDead ||
      isPlayerAsleep ||
      isPlayerStunned ||
      isRolling ||
      isMeleeAttacking ||
      isDamagedReacting;

    if (
      (isDamagedReacting || isPlayerAsleep || isPlayerStunned) &&
      !isJumping &&
      !isFalling &&
      !isPlayerDead
    ) {
      walkTargetRef.current = null;
      isWalkingRef.current = false;
      isRunningRef.current = false;
      jumpRequestedRef.current = false;
      mobileAutoJumpForceRunJumpRef.current = false;
      // Sleep/stun still eat roll input; hit-react does not (roll cancels it).
      if ((isPlayerAsleep || isPlayerStunned) && rollRequestedRef) {
        rollRequestedRef.current = false;
      }
    }

    // Timed tool action (chopping, ...): hold the avatar in place and drop
    // any queued movement so the action animation plays without drifting.
    // Eat keeps click-walk / jump / roll intents so those can cancel the channel.
    if (
      activeToolAction &&
      !isJumping &&
      !isFalling &&
      !blocksLocomotionInput
    ) {
      if (!isEatingToolAction) {
        walkTargetRef.current = null;
        isWalkingRef.current = false;
        isRunningRef.current = false;
        jumpRequestedRef.current = false;
        mobileAutoJumpForceRunJumpRef.current = false;
      } else {
        // Still freeze in place while chewing; leave walk/jump/roll flags alone.
        isRunningRef.current = false;
      }

      if (previousToolActionIdRef.current !== activeToolAction.toolActionId) {
        animationTimeRef.current = 0;
        previousToolActionIdRef.current = activeToolAction.toolActionId;
        toolActionSwingStartMsRef.current = performance.now();
      }
    } else {
      previousToolActionIdRef.current = null;
    }

    const preStepPositionX = playerPosition.x;
    const preStepPositionY = playerPosition.y;
    const movementMultipliers = healthStateRef?.current
      ? resolvingWorldPlazaEntityHealthMovementMultipliers(
          healthStateRef.current,
          performance.now()
        )
      : {
          speedMultiplier: 1,
          walkSpeedMultiplier: 1,
          jumpDistanceMultiplier: 1,
          jumpArcMultiplier: 1,
          jumpLayerReachMultiplier: 1,
          staminaDrainMultiplier: 1,
          staminaRegenMultiplier: 1,
          staminaJumpCostMultiplier: 1,
        };
    const hungerMovementEffects = hungerMovementMultipliersRef?.current ?? {
      speedMultiplier: 1,
      staminaDrainMultiplier: 1,
      staminaRegenMultiplier: 1,
      jumpCostMultiplier: 1,
      isSprintDisabled: false,
      isJumpDisabled: false,
      isHealthDraining: false,
    };
    const environmentalFrostSpeedMultiplier =
      resolvingWorldPlazaEnvironmentalFrostMovementSpeedMultiplierForEntity({
        localTemperatureCelsius: localTemperatureCelsiusRef?.current ?? null,
        temperatureResistance:
          healthStateRef?.current.temperatureResistance ??
          DEFINING_WORLD_PLAZA_ENTITY_TEMPERATURE_RESISTANCE_DEFAULT,
      });
    const walkSpeedMultiplier =
      movementMultipliers.speedMultiplier *
      movementMultipliers.walkSpeedMultiplier *
      hungerMovementEffects.speedMultiplier *
      environmentalFrostSpeedMultiplier;
    movementMultipliers.speedMultiplier *=
      hungerMovementEffects.speedMultiplier;
    movementMultipliers.speedMultiplier *= environmentalFrostSpeedMultiplier;
    movementMultipliers.jumpDistanceMultiplier *=
      characterEngineDerivedStats.jumpDistanceScale;
    const allowsJump = checkingWorldPlazaCharacterEngineMotionKindAllowed(
      characterEngineDefinition,
      'jump'
    );
    const jumpLayerReachMax =
      computingWorldPlazaPlayerJumpLayerReachMaxFromMultiplier(
        movementMultipliers.jumpLayerReachMultiplier,
        characterEngineDerivedStats.maxJumpLayerReach
      );

    let jumpArcOffsetPx = 0;
    let fallVerticalOffsetPx = 0;
    let animationFrameIndex = 0;
    let activeMotionSuffix: DefiningWorldPlazaAvatarMotionClipSuffix = 'idle';
    let activeDirection: typeof walkDirectionRef.current =
      walkDirectionRef.current;
    let isIceCoasting = false;

    if (
      !isJumping &&
      !isFalling &&
      !isPlayerDead &&
      !isMeleeAttacking &&
      !isEatingToolAction &&
      !isPlayerAsleep &&
      !isPlayerStunned &&
      rollRequestedRef?.current &&
      rollStateRef &&
      hasRollClipReady &&
      checkingWorldPlazaGirlSampleRollCanChainIntoNext(
        nowMs,
        rollChainUnlockAtMsRef?.current ?? 0
      )
    ) {
      rollRequestedRef.current = false;

      const rollDirection = isKeyboardMoving
        ? resolvingWorldPlazaGirlSampleWalkDirection(
            computingWorldPlazaIsometricGridDeltaFromScreenDirection(
              keyboardDirection,
              1,
              1
            ).x,
            computingWorldPlazaIsometricGridDeltaFromScreenDirection(
              keyboardDirection,
              1,
              1
            ).y,
            walkDirectionRef.current
          )
        : characterFacingDirectionRef.current;
      const rollGridDirection =
        resolvingWorldPlazaGirlSampleWalkDirectionToGridDirection(
          rollDirection
        );
      const rollStartLayer =
        resolvingWorldPlazaPlayerWorldLayer(playerPosition);
      const rollLandingGridPoint = {
        x:
          playerPosition.x +
          rollGridDirection.x *
            DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_FORWARD_GRID_DISTANCE,
        y:
          playerPosition.y +
          rollGridDirection.y *
            DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_FORWARD_GRID_DISTANCE,
      };
      const rollLandingTile =
        resolvingWorldPlazaIsometricTileIndexAtGridPoint(rollLandingGridPoint);
      const rollLandingSurfaceLayer =
        resolvingWorldPlazaSurfaceLayerAtTileIndex(
          rollLandingTile.tileX,
          rollLandingTile.tileY,
          scenePlacedBlocks
        );
      const forwardGridDistance =
        resolvingWorldBuildingJumpForwardGridDistanceClampedToWall(
          playerPosition,
          rollGridDirection,
          DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_FORWARD_GRID_DISTANCE,
          scenePlacedBlocks,
          rollStartLayer,
          rollLandingSurfaceLayer,
          jumpLayerReachMax,
          characterEngineDerivedStats.heightWorldLayers
        );

      const didConsumeRollStamina =
        tryConsumingRollStaminaRef?.current?.() ?? true;

      if (didConsumeRollStamina) {
        jumpRequestedRef.current = false;
        mobileAutoJumpForceRunJumpRef.current = false;

        // Cancel hit-react so roll clip + locomotion take over immediately.
        if (damagedStateRef) {
          damagedStateRef.current = null;
        }
        if (damagedReactionUntilMsRef) {
          damagedReactionUntilMsRef.current = 0;
        }

        rollStateRef.current = {
          direction: rollDirection,
          startedAtMs: nowMs,
          startPosition: {
            x: playerPosition.x,
            y: playerPosition.y,
          },
          targetPosition: {
            x: playerPosition.x + rollGridDirection.x * forwardGridDistance,
            y: playerPosition.y + rollGridDirection.y * forwardGridDistance,
          },
        };

        if (rollChainUnlockAtMsRef) {
          rollChainUnlockAtMsRef.current =
            computingWorldPlazaGirlSampleRollChainUnlockAtMs(
              nowMs,
              rollDurationMs
            );
        }

        walkDirectionRef.current = rollDirection;
        characterFacingDirectionRef.current = rollDirection;
        notifyingWorldPlazaAvatarMotionSfxEvent({ eventKind: 'roll_dodge' });
        syncingMovePositionRef?.current?.();
      }
    }

    if (
      !checkingWorldPlazaDevQaLoadEnabled() &&
      !blocksLocomotionInput &&
      !isEatingToolAction &&
      !isJumping &&
      !isFalling &&
      !jumpRequestedRef.current &&
      !hungerMovementEffects.isJumpDisabled &&
      allowsJump &&
      checkingWorldPlazaMobileAutoJumpEnabled(
        isMobileViewportRef?.current ?? false
      ) &&
      nowMs >= mobileAutoJumpUnlockAtMsRef.current &&
      nowMs - mobileAutoJumpLastProbeAtMsRef.current >=
        DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_PROBE_INTERVAL_MS &&
      (isWalkingRef.current || isKeyboardMoving)
    ) {
      mobileAutoJumpLastProbeAtMsRef.current = nowMs;
      const finishAutoJumpProbeSample = beginningWorldPlazaPerformanceSample(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.AVATAR_AUTO_JUMP_PROBE
      );
      incrementingWorldPlazaPerformanceDiagnosticsCounter(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.PLAYER_AUTO_JUMP_PROBE
      );
      const autoJumpGridDirection =
        resolvingWorldPlazaGirlSampleWalkDirectionToGridDirection(
          walkDirectionRef.current
        );
      const autoJumpStartLayer =
        resolvingWorldPlazaPlayerWorldLayer(playerPosition);
      const autoJumpStartTile =
        resolvingWorldPlazaIsometricTileIndexAtGridPoint(playerPosition);
      const isAutoJumpStartOnWater =
        checkingWorldPlazaTerrainBlocksJumpLandingAtTileIndex(
          autoJumpStartTile.tileX,
          autoJumpStartTile.tileY
        ) ||
        checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex(
          autoJumpStartTile.tileX,
          autoJumpStartTile.tileY,
          scenePlacedBlocks
        );

      if (
        !isAutoJumpStartOnWater &&
        checkingWorldPlazaPlayerMobileAutoJumpWaterGapAhead({
          playerPosition,
          gridDirection: autoJumpGridDirection,
          placedBlocks: scenePlacedBlocks,
          jumpStartLayer: autoJumpStartLayer,
          jumpLayerReachMax,
          jumpDistanceMultiplier: movementMultipliers.jumpDistanceMultiplier,
          playerHeightWorldLayers:
            characterEngineDerivedStats.heightWorldLayers,
        })
      ) {
        incrementingWorldPlazaPerformanceDiagnosticsCounter(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.PLAYER_AUTO_JUMP_TRIGGER
        );
        // Run-jump distance is required to clear multi-tile rivers.
        mobileAutoJumpForceRunJumpRef.current = true;
        jumpRequestedRef.current = true;
        mobileAutoJumpUnlockAtMsRef.current =
          nowMs + DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_COOLDOWN_MS;
      }
      finishAutoJumpProbeSample();
    }

    if (
      !blocksLocomotionInput &&
      !isEatingToolAction &&
      !isJumping &&
      !isFalling &&
      jumpRequestedRef.current &&
      (hungerMovementEffects.isJumpDisabled || !allowsJump)
    ) {
      jumpRequestedRef.current = false;
      mobileAutoJumpForceRunJumpRef.current = false;
    }

    if (
      !blocksLocomotionInput &&
      !isEatingToolAction &&
      !isJumping &&
      !isFalling &&
      jumpRequestedRef.current &&
      allowsJump
    ) {
      jumpRequestedRef.current = false;

      const isRunJump =
        mobileAutoJumpForceRunJumpRef.current ||
        (isRunningRef.current &&
          isWalkingRef.current &&
          (walkTargetRef.current !== null || isKeyboardMoving));
      mobileAutoJumpForceRunJumpRef.current = false;
      const requestedForwardGridDistance =
        (isRunJump
          ? DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_FORWARD_GRID_DISTANCE
          : DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_FORWARD_GRID_DISTANCE) *
        movementMultipliers.jumpDistanceMultiplier;
      const jumpDirection = walkDirectionRef.current;
      const gridDirection =
        resolvingWorldPlazaGirlSampleWalkDirectionToGridDirection(
          jumpDirection
        );
      const jumpStartLayer =
        resolvingWorldPlazaPlayerWorldLayer(playerPosition);
      const placedBlocks = scenePlacedBlocks;
      const startTile =
        resolvingWorldPlazaIsometricTileIndexAtGridPoint(playerPosition);
      const isJumpStartOnWater =
        checkingWorldPlazaTerrainBlocksJumpLandingAtTileIndex(
          startTile.tileX,
          startTile.tileY
        ) ||
        checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex(
          startTile.tileX,
          startTile.tileY,
          placedBlocks
        );
      const fullDistanceLandingGridPoint = {
        x: playerPosition.x + gridDirection.x * requestedForwardGridDistance,
        y: playerPosition.y + gridDirection.y * requestedForwardGridDistance,
      };
      const fullDistanceLandingTile =
        resolvingWorldPlazaIsometricTileIndexAtGridPoint(
          fullDistanceLandingGridPoint
        );
      const fullDistanceLandingSurfaceLayer =
        resolvingWorldPlazaSurfaceLayerAtTileIndex(
          fullDistanceLandingTile.tileX,
          fullDistanceLandingTile.tileY,
          placedBlocks
        );
      const forwardGridDistance =
        resolvingWorldBuildingJumpForwardGridDistanceClampedToWall(
          playerPosition,
          gridDirection,
          requestedForwardGridDistance,
          placedBlocks,
          jumpStartLayer,
          fullDistanceLandingSurfaceLayer,
          jumpLayerReachMax,
          characterEngineDerivedStats.heightWorldLayers
        );
      const resolvedJumpLanding =
        resolvingWorldPlazaJumpLandingGridPointAlongPath(
          playerPosition,
          gridDirection,
          forwardGridDistance,
          placedBlocks,
          jumpStartLayer,
          jumpLayerReachMax,
          characterEngineDerivedStats.heightWorldLayers
        );

      if (!isJumpStartOnWater && resolvedJumpLanding) {
        const landingGridPoint = resolvedJumpLanding.landingGridPoint;
        const jumpLandingLayer = resolvedJumpLanding.landingSurfaceLayer;

        const didConsumeJumpStamina =
          tryConsumingJumpStaminaRef.current?.(isRunJump) ?? false;

        if (didConsumeJumpStamina) {
          consumingJumpHungerRef?.current?.(isRunJump);

          const arcPeakScreenPx =
            (isRunJump
              ? DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_ARC_PEAK_SCREEN_PX
              : DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_ARC_PEAK_SCREEN_PX) *
            movementMultipliers.jumpArcMultiplier;

          walkTargetRef.current = null;
          isWalkingRef.current = false;
          isRunningRef.current = false;
          isWalkPausedByCollisionRef.current = true;

          jumpStateRef.current = {
            direction: jumpDirection,
            startPosition: {
              x: playerPosition.x,
              y: playerPosition.y,
            },
            targetPosition: {
              x: landingGridPoint.x,
              y: landingGridPoint.y,
            },
            startedAtMs: performance.now(),
            networkStartedAtMs: Date.now(),
            isRunJump,
            arcPeakScreenPx,
            startLayer: jumpStartLayer,
            landingLayer: jumpLandingLayer,
          };

          isJumpingRef.current = true;
          notifyingWorldPlazaAvatarMotionSfxEvent({
            eventKind: 'jump_takeoff',
          });
          syncingMovePositionRef?.current?.();
        }
      }
    }

    const activeJumpState = jumpStateRef.current;
    const activeRollStateForTick = rollStateRef?.current ?? null;
    const rollProgressForMovement = activeRollStateForTick
      ? Math.min(
          1,
          (nowMs - activeRollStateForTick.startedAtMs) / rollDurationMs
        )
      : 0;
    const isRollAnimatingForMovement =
      Boolean(activeRollStateForTick) && rollProgressForMovement < 1;
    const isRollDodgeActive =
      Boolean(activeRollStateForTick) &&
      checkingWorldPlazaGirlSampleRollDodgeWindowIsActive(
        rollProgressForMovement
      );

    if (isRollDodgeActiveRef) {
      isRollDodgeActiveRef.current = isRollDodgeActive;
    }

    if (rollDodgeProgressRef) {
      rollDodgeProgressRef.current = isRollDodgeActive
        ? rollProgressForMovement
        : 0;
    }

    if (activeRollStateForTick && rollProgressForMovement >= 1) {
      if (rollStateRef) {
        rollStateRef.current = null;
      }
      isWalkPausedByCollisionRef.current = false;
    }

    if (meleeAttackStateRef?.current) {
      const meleeSettleResult = settlingWorldPlazaMeleeSwingDamage(
        meleeAttackStateRef.current,
        nowMs,
        (completedMelee) =>
          applyingPlayerMeleeDamageOnSwingCompleteRef?.current?.(completedMelee)
      );

      if (meleeSettleResult.isComplete) {
        meleeAttackStateRef.current = null;
      }
    }

    let activeFallState = fallStateRef.current;
    const jumpProgress = activeJumpState
      ? Math.min(
          1,
          (performance.now() - activeJumpState.startedAtMs) /
            DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_DURATION_MS
        )
      : 0;
    const isLocomoting = Boolean(
      activeJumpState ||
      activeFallState ||
      (activeRollStateForTick && isRollAnimatingForMovement) ||
      isKeyboardMoving ||
      (walkTarget && isWalkingRef.current)
    );

    if (isLocomoting) {
      inactiveSinceMsRef.current = null;
      previousReadyIdleActiveRef.current = false;
    }

    const deltaSeconds = ticker.deltaMS / 1000;

    if (isRollAnimatingForMovement && activeRollStateForTick) {
      playerPosition.x =
        activeRollStateForTick.startPosition.x +
        (activeRollStateForTick.targetPosition.x -
          activeRollStateForTick.startPosition.x) *
          rollProgressForMovement;
      playerPosition.y =
        activeRollStateForTick.startPosition.y +
        (activeRollStateForTick.targetPosition.y -
          activeRollStateForTick.startPosition.y) *
          rollProgressForMovement;
      walkDirectionRef.current = activeRollStateForTick.direction;
      characterFacingDirectionRef.current = activeRollStateForTick.direction;
    } else if (activeJumpState) {
      const elapsedMs = performance.now() - activeJumpState.startedAtMs;

      playerPosition.layer = activeJumpState.startLayer;
      playerPosition.x =
        activeJumpState.startPosition.x +
        (activeJumpState.targetPosition.x - activeJumpState.startPosition.x) *
          jumpProgress;
      playerPosition.y =
        activeJumpState.startPosition.y +
        (activeJumpState.targetPosition.y - activeJumpState.startPosition.y) *
          jumpProgress;

      jumpArcOffsetPx = computingWorldPlazaGirlSampleJumpArcOffsetPx(
        jumpProgress,
        activeJumpState.arcPeakScreenPx
      );
      animationFrameIndex = Math.min(
        characterDefinition.jumpSheetLayout.frameCount - 1,
        Math.floor((elapsedMs / 1000) * characterDefinition.jumpAnimationFps)
      );
      activeMotionSuffix = 'jump';
      activeDirection = activeJumpState.direction;
      lastLocomotionWasRunRef.current = activeJumpState.isRunJump;

      if (jumpProgress >= 1) {
        playerPosition.layer = activeJumpState.landingLayer;
        walkTargetRef.current = null;
        isWalkingRef.current = false;
        isRunningRef.current = false;
        isWalkPausedByCollisionRef.current = false;
        jumpStateRef.current = null;
        isJumpingRef.current = false;
        animationTimeRef.current = 0;
        syncingMovePositionRef?.current?.();
      }
    } else if (activeFallState) {
      const elapsedMs = performance.now() - activeFallState.startedAtMs;
      const fallDurationMs = computingWorldPlazaGirlSampleFallDurationMs(
        activeFallState.layerDelta
      );
      const fallProgress = Math.min(1, elapsedMs / fallDurationMs);

      fallVerticalOffsetPx = computingWorldPlazaGirlSampleFallVerticalOffsetPx(
        fallProgress,
        activeFallState.totalDropScreenPx
      );
      animationFrameIndex =
        Math.floor((elapsedMs / 1000) * characterDefinition.fallAnimationFps) %
        characterDefinition.fallSheetLayout.frameCount;
      activeMotionSuffix = 'fall';
      activeDirection = characterDefinition.fallSpriteDirection;

      if (fallProgress >= 1) {
        const completedFallLayerDelta = activeFallState.layerDelta;
        playerPosition.layer = activeFallState.targetLayer;
        fallStateRef.current = null;
        activeFallState = null;
        animationTimeRef.current = 0;
        onFallLandedRef?.current?.(completedFallLayerDelta);
        syncingMovePositionRef?.current?.();
      }
    } else if (activeToolAction) {
      const toolActionClipAssignment =
        resolvingWorldPlazaAvatarToolActionClipAssignment(
          activeToolAction.toolActionId,
          characterDefinition.skinId
        );
      const toolActionSheetLayout = resolvingWorldPlazaAvatarClipPresentation(
        characterDefinition,
        toolActionClipAssignment.clipSuffix
      ).sheetLayout;
      const toolActionFacingDirection =
        resolvingWorldPlazaGirlSampleWalkDirection(
          activeToolAction.targetGridX - playerPosition.x,
          activeToolAction.targetGridY - playerPosition.y,
          walkDirectionRef.current
        );

      walkDirectionRef.current = toolActionFacingDirection;
      characterFacingDirectionRef.current = toolActionFacingDirection;
      activeDirection = toolActionFacingDirection;
      activeMotionSuffix = toolActionClipAssignment.clipSuffix;
      animationTimeRef.current +=
        deltaSeconds * toolActionClipAssignment.animationFps;
      animationFrameIndex =
        Math.floor(animationTimeRef.current) % toolActionSheetLayout.frameCount;
      iceSlideVelocityRef.current = { x: 0, y: 0 };
      iceSlideFrozenRunFrameIndexRef.current = null;
      wasRunningOnIceRef.current = false;
    } else if (
      checkingWorldPlazaPlayerShouldSlideOnIceAfterRun(
        playerPosition,
        iceSlideVelocityRef.current,
        wasRunningOnIceRef.current,
        isRunningRef.current
      )
    ) {
      const nextVelocity = computingWorldPlazaIceSlideVelocity(
        iceSlideVelocityRef.current,
        null,
        deltaSeconds
      );

      iceSlideVelocityRef.current = nextVelocity;

      const gridDeltaX = nextVelocity.x * deltaSeconds;
      const gridDeltaY = nextVelocity.y * deltaSeconds;

      playerPosition.x += gridDeltaX;
      playerPosition.y += gridDeltaY;

      activeMotionSuffix = 'run';

      if (iceSlideFrozenRunFrameIndexRef.current === null) {
        iceSlideFrozenRunFrameIndexRef.current =
          resolvingWorldPlazaIceSlideFrozenRunFrameIndex(
            animationTimeRef.current,
            characterDefinition.runSheetLayout.frameCount
          );
      }

      if (
        Math.hypot(gridDeltaX, gridDeltaY) >
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON
      ) {
        walkDirectionRef.current = resolvingWorldPlazaGirlSampleWalkDirection(
          gridDeltaX,
          gridDeltaY,
          walkDirectionRef.current
        );
        characterFacingDirectionRef.current = walkDirectionRef.current;
      }

      animationFrameIndex = iceSlideFrozenRunFrameIndexRef.current;
      activeDirection = walkDirectionRef.current;
      isIceCoasting = true;
      lastLocomotionWasRunRef.current = true;
    } else if (
      !blocksLocomotionInput &&
      !isRollAnimatingForMovement &&
      isKeyboardMoving
    ) {
      const isRunning = resolvingWorldPlazaCharacterEngineShouldRun(
        characterEngineDefinition,
        isRunningRef.current,
        true
      );
      isRunningRef.current = isRunning;
      activeMotionSuffix = isRunning ? 'run' : 'walk';

      const standingTile =
        resolvingWorldPlazaIsometricTileIndexAtGridPoint(playerPosition);
      const isOnIce = checkingWorldPlazaWaterIsFrozenAtTileIndex(
        standingTile.tileX,
        standingTile.tileY,
        { placedBlocksByTile: scenePlacedBlocksByTile }
      );
      const baseRunScreenSpeedPerSecond = isOnIce
        ? DEFINING_WORLD_PLAZA_ICE_SLIDE_SCREEN_RUN_SPEED_PER_SECOND
        : runScreenSpeedPerSecond;
      const acceleratedRunScreenSpeedPerSecond = isRunning
        ? computingWorldPlazaAcceleratedRunSpeed(
            walkScreenSpeedPerSecond,
            baseRunScreenSpeedPerSecond,
            runStaminaStateRef?.current.runningForSeconds ?? 0,
            runStaminaStateRef?.current.staminaRatio ?? 1
          )
        : baseRunScreenSpeedPerSecond;
      const movementSpeedPerSecond =
        (isRunning
          ? acceleratedRunScreenSpeedPerSecond
          : walkScreenSpeedPerSecond) *
        (isRunning
          ? movementMultipliers.speedMultiplier
          : walkSpeedMultiplier) *
        computingWorldPlazaLavaMovementSpeedMultiplierAtGridPoint(
          playerPosition.x,
          playerPosition.y,
          resolvingWorldPlazaPlayerWorldLayer(playerPosition),
          characterEngineDerivedStats.isLavaWalkable
        );
      const targetGridVelocity =
        computingWorldPlazaIsometricGridDeltaFromScreenDirection(
          keyboardDirection,
          movementSpeedPerSecond,
          1
        );

      let gridDelta;

      if (isRunning && isOnIce) {
        const nextVelocity = computingWorldPlazaIceSlideVelocity(
          iceSlideVelocityRef.current,
          targetGridVelocity,
          deltaSeconds
        );

        iceSlideVelocityRef.current = nextVelocity;
        gridDelta = {
          x: nextVelocity.x * deltaSeconds,
          y: nextVelocity.y * deltaSeconds,
        };
        wasRunningOnIceRef.current = true;
        if (isRunningOnIceRef) {
          isRunningOnIceRef.current = true;
        }
      } else {
        if (!isOnIce || !wasRunningOnIceRef.current) {
          iceSlideVelocityRef.current = { x: 0, y: 0 };
        }

        gridDelta = {
          x: targetGridVelocity.x * deltaSeconds,
          y: targetGridVelocity.y * deltaSeconds,
        };

        const confusedKeyboardMovement =
          applyingWorldPlazaConfusionDeflectionToGridDelta({
            gridDelta,
            deltaSeconds,
            healthState: healthStateRef?.current ?? null,
            nowMs: performance.now(),
            phaseRadians: confusionPhaseRadiansRef.current,
          });

        gridDelta = confusedKeyboardMovement.gridDelta;
        confusionPhaseRadiansRef.current =
          confusedKeyboardMovement.nextPhaseRadians;
      }

      playerPosition.x += gridDelta.x;
      playerPosition.y += gridDelta.y;

      if (
        Math.hypot(gridDelta.x, gridDelta.y) >
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON
      ) {
        walkDirectionRef.current = resolvingWorldPlazaGirlSampleWalkDirection(
          gridDelta.x,
          gridDelta.y,
          walkDirectionRef.current
        );
        characterFacingDirectionRef.current = walkDirectionRef.current;
      }

      const runAnimationSpeedScale = isRunning
        ? resolvingWorldPlazaRunAnimationSpeedScale(
            acceleratedRunScreenSpeedPerSecond,
            baseRunScreenSpeedPerSecond
          )
        : 1;
      const iceRunAnimationSpeedScale =
        isRunning && isOnIce
          ? resolvingWorldPlazaIceRunAnimationSpeedScale(
              iceSlideVelocityRef.current,
              targetGridVelocity
            )
          : 1;
      const animationFps = isRunning
        ? characterDefinition.runAnimationFps *
          runAnimationSpeedScale *
          iceRunAnimationSpeedScale
        : characterDefinition.walkAnimationFps;

      animationTimeRef.current += (ticker.deltaMS / 1000) * animationFps;
      animationFrameIndex = Math.floor(animationTimeRef.current);
      activeDirection = walkDirectionRef.current;

      if (isRunning) {
        lastLocomotionWasRunRef.current = true;

        if (isOnIce) {
          iceSlideFrozenRunFrameIndexRef.current =
            resolvingWorldPlazaIceSlideFrozenRunFrameIndex(
              animationTimeRef.current,
              characterDefinition.runSheetLayout.frameCount
            );
        }
      }
    } else if (
      !blocksLocomotionInput &&
      !isRollAnimatingForMovement &&
      walkTarget &&
      isWalkingRef.current
    ) {
      const isRunning = resolvingWorldPlazaCharacterEngineShouldRun(
        characterEngineDefinition,
        isRunningRef.current,
        true
      );
      isRunningRef.current = isRunning;
      activeMotionSuffix = isRunning ? 'run' : 'walk';

      const standingTile =
        resolvingWorldPlazaIsometricTileIndexAtGridPoint(playerPosition);
      const isOnIce = checkingWorldPlazaWaterIsFrozenAtTileIndex(
        standingTile.tileX,
        standingTile.tileY,
        { placedBlocksByTile: scenePlacedBlocksByTile }
      );
      const baseRunScreenSpeedPerSecond = isOnIce
        ? DEFINING_WORLD_PLAZA_ICE_SLIDE_SCREEN_RUN_SPEED_PER_SECOND
        : runScreenSpeedPerSecond;
      const acceleratedRunScreenSpeedPerSecond = isRunning
        ? computingWorldPlazaAcceleratedRunSpeed(
            walkScreenSpeedPerSecond,
            baseRunScreenSpeedPerSecond,
            runStaminaStateRef?.current.runningForSeconds ?? 0,
            runStaminaStateRef?.current.staminaRatio ?? 1
          )
        : baseRunScreenSpeedPerSecond;
      const movementSpeedPerSecond =
        (isRunning
          ? acceleratedRunScreenSpeedPerSecond
          : walkScreenSpeedPerSecond) *
        (isRunning
          ? movementMultipliers.speedMultiplier
          : walkSpeedMultiplier) *
        computingWorldPlazaLavaMovementSpeedMultiplierAtGridPoint(
          playerPosition.x,
          playerPosition.y,
          resolvingWorldPlazaPlayerWorldLayer(playerPosition),
          characterEngineDerivedStats.isLavaWalkable
        );
      const stepResult = computingWorldPlazaIsometricGridStepTowardTarget(
        playerPosition,
        walkTarget,
        movementSpeedPerSecond,
        ticker.deltaMS / 1000
      );

      const confusedClickMovement =
        applyingWorldPlazaConfusionDeflectionToGridDelta({
          gridDelta: {
            x: stepResult.nextPosition.x - playerPosition.x,
            y: stepResult.nextPosition.y - playerPosition.y,
          },
          deltaSeconds: ticker.deltaMS / 1000,
          healthState: healthStateRef?.current ?? null,
          nowMs: performance.now(),
          phaseRadians: confusionPhaseRadiansRef.current,
        });
      confusionPhaseRadiansRef.current = confusedClickMovement.nextPhaseRadians;

      const gridDeltaX = confusedClickMovement.gridDelta.x;
      const gridDeltaY = confusedClickMovement.gridDelta.y;

      playerPosition.x += gridDeltaX;
      playerPosition.y += gridDeltaY;
      onWalkStepRef?.current?.();

      if (isRunning && isOnIce && deltaSeconds > 0) {
        wasRunningOnIceRef.current = true;
        if (isRunningOnIceRef) {
          isRunningOnIceRef.current = true;
        }
        iceSlideVelocityRef.current = {
          x: gridDeltaX / deltaSeconds,
          y: gridDeltaY / deltaSeconds,
        };
      }

      if (
        Math.hypot(gridDeltaX, gridDeltaY) >
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_FACING_CHANGE_EPSILON
      ) {
        walkDirectionRef.current = resolvingWorldPlazaGirlSampleWalkDirection(
          gridDeltaX,
          gridDeltaY,
          walkDirectionRef.current
        );
        characterFacingDirectionRef.current = walkDirectionRef.current;
      }

      const runAnimationSpeedScale = isRunning
        ? resolvingWorldPlazaRunAnimationSpeedScale(
            acceleratedRunScreenSpeedPerSecond,
            baseRunScreenSpeedPerSecond
          )
        : 1;
      const animationFps = isRunning
        ? characterDefinition.runAnimationFps * runAnimationSpeedScale
        : characterDefinition.walkAnimationFps;

      animationTimeRef.current += (ticker.deltaMS / 1000) * animationFps;
      animationFrameIndex = Math.floor(animationTimeRef.current);
      activeDirection = walkDirectionRef.current;

      if (isRunning) {
        lastLocomotionWasRunRef.current = true;

        if (isOnIce) {
          iceSlideFrozenRunFrameIndexRef.current =
            resolvingWorldPlazaIceSlideFrozenRunFrameIndex(
              animationTimeRef.current,
              characterDefinition.runSheetLayout.frameCount
            );
        }
      }

      if (stepResult.arrived) {
        if (walkWaypointsRef && walkWaypointsRef.current.length > 0) {
          const reachedFinalWaypoint =
            advancingWorldPlazaNavigationWalkWaypoint({
              walkTargetRef,
              walkWaypointsRef,
            });

          if (reachedFinalWaypoint) {
            if (walkDestinationRef) {
              walkDestinationRef.current = null;
            }

            if (navigationPlacedBlockSnapshotRef) {
              navigationPlacedBlockSnapshotRef.current = new Set();
            }

            navigationStuckFrameCountRef.current = 0;
            isWalkingRef.current = false;
            animationTimeRef.current = 0;
            onWalkArrivedRef?.current?.();
          } else {
            isWalkingRef.current = true;
            animationTimeRef.current = 0;
          }
        } else {
          walkTargetRef.current = null;
          isWalkingRef.current = false;
          animationTimeRef.current = 0;
          onWalkArrivedRef?.current?.();
        }
      }
    } else {
      const shouldPlayReadyIdleAfterRun = lastLocomotionWasRunRef.current;

      if (shouldPlayReadyIdleAfterRun) {
        if (inactiveSinceMsRef.current === null) {
          inactiveSinceMsRef.current = performance.now();
        }

        const inactiveDurationMs =
          performance.now() - inactiveSinceMsRef.current;
        const isReadyIdleActive =
          inactiveDurationMs <
          DEFINING_WORLD_PLAZA_GIRL_SAMPLE_READY_IDLE_DURATION_MS;

        if (isReadyIdleActive) {
          activeMotionSuffix = 'idle';
          animationTimeRef.current +=
            (ticker.deltaMS / 1000) * characterDefinition.idleAnimationFps;
          animationFrameIndex = Math.floor(animationTimeRef.current);
        } else {
          animationFrameIndex = 0;
          activeMotionSuffix = 'idle';
        }

        if (isReadyIdleActive !== previousReadyIdleActiveRef.current) {
          if (isReadyIdleActive) {
            animationTimeRef.current = 0;
          }

          previousReadyIdleActiveRef.current = isReadyIdleActive;
        }
      } else {
        inactiveSinceMsRef.current = null;
        previousReadyIdleActiveRef.current = false;
        animationFrameIndex = 0;
      }

      activeDirection = characterFacingDirectionRef.current;
      walkDirectionRef.current = characterFacingDirectionRef.current;
      iceSlideVelocityRef.current = { x: 0, y: 0 };
      iceSlideFrozenRunFrameIndexRef.current = null;
      wasRunningOnIceRef.current = false;
    }

    const frameMovementDeltaX = playerPosition.x - preStepPositionX;
    const frameMovementDeltaY = playerPosition.y - preStepPositionY;

    if (
      Math.hypot(frameMovementDeltaX, frameMovementDeltaY) >
      DEFINING_WORLD_PLAZA_AVATAR_CLIFF_LIP_MOVEMENT_REUSE_EPSILON
    ) {
      lastFrameMovementDeltaRef.current = {
        x: frameMovementDeltaX,
        y: frameMovementDeltaY,
      };
    }

    const collisionMovementDelta = {
      x:
        Math.abs(frameMovementDeltaX) >
        DEFINING_WORLD_PLAZA_AVATAR_CLIFF_LIP_MOVEMENT_REUSE_EPSILON
          ? frameMovementDeltaX
          : lastFrameMovementDeltaRef.current.x,
      y:
        Math.abs(frameMovementDeltaY) >
        DEFINING_WORLD_PLAZA_AVATAR_CLIFF_LIP_MOVEMENT_REUSE_EPSILON
          ? frameMovementDeltaY
          : lastFrameMovementDeltaRef.current.y,
    };

    const attemptedMoveDistance = Math.hypot(
      frameMovementDeltaX,
      frameMovementDeltaY
    );
    const didCollisionHeightChange =
      previousCollisionHeightWorldLayersRef.current !==
      characterEngineDerivedStats.heightWorldLayers;
    previousCollisionHeightWorldLayersRef.current =
      characterEngineDerivedStats.heightWorldLayers;
    const shouldRunAvatarCollision =
      attemptedMoveDistance >
        DEFINING_WORLD_PLAZA_AVATAR_WALK_BLOCKED_GRID_EPSILON ||
      Boolean(activeJumpState) ||
      isRollAnimatingForMovement ||
      didCollisionHeightChange;

    if (shouldRunAvatarCollision) {
      const finishAvatarCollisionSample = beginningWorldPlazaPerformanceSample(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.AVATAR_COLLISION
      );
      const collisionPlayerLayer = activeJumpState
        ? jumpProgress >= 1
          ? activeJumpState.landingLayer
          : activeJumpState.startLayer
        : playerPosition.layer;
      const blockedPosition =
        resolvingWorldCollisionEjectingPlayerFromBlockedWorldPoint(
          {
            x: playerPosition.x,
            y: playerPosition.y,
          },
          {
            isJumping: Boolean(activeJumpState),
            jumpProgress,
            fallbackPosition: {
              x: preStepPositionX,
              y: preStepPositionY,
            },
            placedBlocks: scenePlacedBlocks,
            placedBlocksByTile: scenePlacedBlocksByTile,
            playerLayer: collisionPlayerLayer,
            playerCenter: {
              x: playerPosition.x,
              y: playerPosition.y,
            },
            movementDelta: collisionMovementDelta,
            playerRadiusGrid: characterEngineDerivedStats.collisionRadiusGrid,
            playerHeightWorldLayers:
              characterEngineDerivedStats.heightWorldLayers,
            jumpLayerReachMax,
          }
        );

      if (!activeJumpState && !isRollAnimatingForMovement) {
        playerPosition.x = blockedPosition.x;
        playerPosition.y = blockedPosition.y;
      }
      finishAvatarCollisionSample();
    }

    const actualMoveDistance = Math.hypot(
      playerPosition.x - preStepPositionX,
      playerPosition.y - preStepPositionY
    );
    const isAttemptingLocomotion =
      isKeyboardMoving ||
      isIceCoasting ||
      Boolean(walkTarget && isWalkingRef.current);
    const isPushingIntoObstacle =
      isAttemptingLocomotion &&
      attemptedMoveDistance >
        DEFINING_WORLD_PLAZA_AVATAR_WALK_BLOCKED_GRID_EPSILON &&
      actualMoveDistance < attemptedMoveDistance * 0.25;

    if (
      supportsCombatPresentation &&
      isPushingIntoObstacle &&
      checkingWorldPlazaAvatarCombatMotionSupported(
        characterDefinition.skinId,
        'push'
      )
    ) {
      requestingCombatMotionTextures('push');
    }

    if (isPushingIntoObstacle) {
      incrementingWorldPlazaPerformanceDiagnosticsCounter(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.PLAYER_COLLISION_BLOCKED_FRAME
      );
      navigationStuckFrameCountRef.current += 1;
    } else {
      navigationStuckFrameCountRef.current = 0;
    }

    navigationReplanFrameCounterRef.current += 1;

    const shouldEvaluateNavigationReplan =
      navigationReplanFrameCounterRef.current >=
      performanceProfile.navigationReplanIntervalFrames;

    // Reset on every evaluation, not just on replans, so the waypoint tile-key
    // scan stays on the interval cadence instead of running every frame once
    // the counter first saturates.
    if (shouldEvaluateNavigationReplan) {
      navigationReplanFrameCounterRef.current = 0;
    }

    if (
      shouldEvaluateNavigationReplan &&
      walkWaypointsRef &&
      walkDestinationRef &&
      navigationPlacedBlockSnapshotRef &&
      walkDestinationRef.current &&
      checkingWorldPlazaNavigationPathNeedsReplan({
        remainingWaypoints: walkWaypointsRef.current,
        placedBlocks: scenePlacedBlocks,
        previousPlacedBlockIds: navigationPlacedBlockSnapshotRef.current,
        stuckFrameCount: navigationStuckFrameCountRef.current,
        stuckFrameThreshold:
          DEFINING_WORLD_PLAZA_NAVIGATION_REPLAN_STUCK_FRAME_COUNT,
      })
    ) {
      const finishNavigationReplanSample = beginningWorldPlazaPerformanceSample(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.AVATAR_NAVIGATION_REPLAN
      );
      incrementingWorldPlazaPerformanceDiagnosticsCounter(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.PLAYER_NAVIGATION_REPLAN
      );
      const replannedWalk = resolvingWorldPlazaNavigationWalkPlan({
        start: playerPosition,
        destination: walkDestinationRef.current,
        placedBlocks: scenePlacedBlocks,
        placedBlocksByTile: scenePlacedBlocksByTile,
        isJumping: Boolean(activeJumpState),
        playerRadiusGrid: characterEngineDerivedStats.collisionRadiusGrid,
        playerHeightWorldLayers:
          characterEngineDerivedStats.heightWorldLayers,
        maxNodeExpansions: performanceProfile.navigationMaxNodeExpansions,
      });
      settingWorldPlazaPerformanceDiagnosticsGauge(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_NAVIGATION_LAST_NODES_EXPANDED,
        replannedWalk.nodesExpanded
      );
      settingWorldPlazaPerformanceDiagnosticsGauge(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.PLAYER_NAVIGATION_LAST_PATH_LENGTH,
        replannedWalk.path.length
      );
      incrementingWorldPlazaPerformanceDiagnosticsCounter(
        replannedWalk.usedPathfinding
          ? DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.PLAYER_NAVIGATION_REPLAN_PATHFINDING
          : DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.PLAYER_NAVIGATION_REPLAN_FALLBACK
      );
      finishNavigationReplanSample();

      navigationPlacedBlockSnapshotRef.current = new Set(
        scenePlacedBlocks.map((placedBlock) => placedBlock.blockId)
      );
      applyingWorldPlazaNavigationWalkTargets({
        walkTargetRef,
        walkWaypointsRef,
        destination: walkDestinationRef.current,
        path: replannedWalk.path,
      });
      navigationStuckFrameCountRef.current = 0;
      navigationReplanFrameCounterRef.current = 0;
      isWalkingRef.current = true;
      isWalkPausedByCollisionRef.current = false;
    }

    if (
      pushStateRef &&
      hasCombatTextures &&
      !activeJumpState &&
      !isRollAnimatingForMovement &&
      !blocksLocomotionInput &&
      isPushingIntoObstacle
    ) {
      const activePushState = pushStateRef.current;

      if (
        !activePushState ||
        nowMs - activePushState.startedAtMs >=
          DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_DURATION_MS
      ) {
        pushStateRef.current = {
          direction: walkDirectionRef.current,
          startedAtMs: nowMs,
        };
      }
    } else if (pushStateRef?.current) {
      pushStateRef.current = null;
    }

    const layerBeforeSync = resolvingWorldPlazaPlayerWorldLayer(playerPosition);
    syncingWorldPlazaPlayerStandingLayer(
      playerPosition,
      scenePlacedBlocks,
      Boolean(activeJumpState) || Boolean(activeFallState),
      scenePlacedBlocksByTile
    );

    if (!activeJumpState && !activeFallState) {
      const layerAfterSync =
        resolvingWorldPlazaPlayerWorldLayer(playerPosition);
      const nextFallState = attemptingWorldPlazaPlayerFallFromLayerDrop(
        layerBeforeSync,
        layerAfterSync,
        performance.now(),
        activeDirection
      );

      if (nextFallState) {
        incrementingWorldPlazaPerformanceDiagnosticsCounter(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.PLAYER_FALL_STARTED
        );
        fallStateRef.current = nextFallState;
        activeFallState = nextFallState;
        isWalkPausedByCollisionRef.current = true;
        isJumpingRef.current = true;

        // Render the fall's first frame at takeoff height on this same tick.
        // The fall is detected after the motion branch already ran, so without
        // this the avatar would render snapped to the ground surface for one
        // frame before the next tick lifts it back up to start the drop.
        fallVerticalOffsetPx =
          computingWorldPlazaGirlSampleFallVerticalOffsetPx(
            0,
            nextFallState.totalDropScreenPx
          );
        animationFrameIndex = 0;
        animationTimeRef.current = 0;
        activeMotionSuffix = 'fall';
        activeDirection = characterDefinition.fallSpriteDirection;
      }
    }

    if (!activeJumpState && walkTarget && isWalkingRef.current) {
      const movedGridDistance = Math.hypot(
        playerPosition.x - preStepPositionX,
        playerPosition.y - preStepPositionY
      );

      if (
        movedGridDistance <
        DEFINING_WORLD_PLAZA_AVATAR_WALK_BLOCKED_GRID_EPSILON
      ) {
        walkTargetRef.current = null;
        isWalkingRef.current = false;
        isRunningRef.current = false;
        isWalkPausedByCollisionRef.current = true;
        animationTimeRef.current = 0;
        onWalkArrivedRef?.current?.();
      }
    }

    const motionKind: DefiningWorldPlazaAvatarMotionKind = activeJumpState
      ? DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP
      : activeFallState
        ? DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_JUMP
        : isKeyboardMoving ||
            (walkTarget && isWalkingRef.current) ||
            isIceCoasting
          ? isIceCoasting || isRunningRef.current
            ? DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_RUN
            : DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_WALK
          : DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE;

    if (motionKind !== previousMotionKindRef.current) {
      incrementingWorldPlazaPerformanceDiagnosticsCounter(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.PLAYER_MOTION_TRANSITION
      );
      if (
        motionKind === DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE ||
        previousMotionKindRef.current ===
          DEFINING_WORLD_PLAZA_AVATAR_MOTION_KIND_IDLE
      ) {
        animationTimeRef.current = 0;
      }

      previousMotionKindRef.current = motionKind;
    }

    localAvatarMotionStateRef.current = {
      motionKind,
      facingDirection: activeDirection,
      jumpStartedAtMs: activeJumpState?.networkStartedAtMs ?? 0,
      jumpArcPeakScreenPx: activeJumpState?.arcPeakScreenPx ?? 0,
      layer: activeJumpState
        ? activeJumpState.startLayer
        : resolvingWorldPlazaPlayerWorldLayer(playerPosition),
      heldItemVisualId:
        equippedHeldItemPresentationRef?.current?.visualId ?? null,
      heldItemTier: equippedHeldItemPresentationRef?.current?.tier ?? null,
    };

    if (
      activeRollStateForTick &&
      nowMs - activeRollStateForTick.startedAtMs >= rollDurationMs &&
      rollStateRef
    ) {
      rollStateRef.current = null;
    }

    if (
      damagedStateRef?.current &&
      nowMs - damagedStateRef.current.startedAtMs >=
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_DURATION_MS
    ) {
      damagedStateRef.current = null;
    }

    if (
      blockReactionStateRef?.current &&
      nowMs - blockReactionStateRef.current.startedAtMs >=
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_BLOCK_REACTION_DURATION_MS
    ) {
      blockReactionStateRef.current = null;
    }

    let combatPresentation: ReturnType<
      typeof advancingWorldPlazaGirlSampleCombatPresentation
    > = null;

    if (!checkingWorldPlazaDevQaLoadEnabled()) {
      const finishCombatPresentationSample =
        beginningWorldPlazaPerformanceSample(
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.AVATAR_COMBAT_PRESENTATION
        );
      combatPresentation = advancingWorldPlazaGirlSampleCombatPresentation({
        nowMs,
        characterDefinition,
        hasCombatTextures,
        hasRollClipReady,
        isPlayerDead,
        isPlayerAsleep,
        defaultDirection: characterFacingDirectionRef.current,
        healthState: healthStateRef?.current ?? null,
        defensiveReactionUntilMs,
        rollState: rollStateRef?.current ?? null,
        meleeState: meleeAttackStateRef?.current ?? null,
        pushState: pushStateRef?.current ?? null,
        blockReactionState: blockReactionStateRef?.current ?? null,
        damagedState: damagedStateRef?.current ?? null,
        deathState: deathStateRef?.current ?? null,
        sleepState: sleepStateRef?.current ?? null,
        isLocomoting,
      });
      finishCombatPresentationSample();
    }

    if (
      combatPresentation &&
      resolvingWorldPlazaAnimationClip(
        formattingWorldPlazaAvatarMotionClipId(
          characterDefinition.skinId,
          combatPresentation.motionSuffix
        )
      )
    ) {
      activeMotionSuffix = combatPresentation.motionSuffix;
      activeDirection = combatPresentation.direction;
      animationFrameIndex = combatPresentation.frameIndex;
    }

    if (
      isPlayerStunned &&
      !isPlayerDead &&
      activeMotionSuffix !== 'death' &&
      activeMotionSuffix !== 'roll' &&
      activeMotionSuffix !== 'melee'
    ) {
      activeMotionSuffix = 'idle';
      activeDirection = characterFacingDirectionRef.current;
      walkDirectionRef.current = characterFacingDirectionRef.current;
      animationTimeRef.current +=
        (ticker.deltaMS / 1000) * characterDefinition.idleAnimationFps;
      animationFrameIndex =
        Math.floor(animationTimeRef.current) %
        characterDefinition.idleSheetLayout.frameCount;
    }

    const combatSpritePresentation =
      resolvingWorldPlazaGirlSampleCombatSpritePresentation({
        motionSuffix: activeMotionSuffix,
        frameIndex: animationFrameIndex,
      });
    const combatSpriteOffsetBelowGridAnchorPx =
      combatSpritePresentation.offsetBelowGridAnchorPx *
      characterEngineDerivedStats.sizeScale;
    const avatarFootOffsetBelowGridAnchorPx =
      resolvingWorldPlazaAvatarFootOffsetBelowGridAnchorPx(
        characterDefinition
      ) * characterEngineDerivedStats.sizeScale;

    sprite.anchor.set(
      combatSpritePresentation.anchorXNormalized,
      combatSpritePresentation.anchorYNormalized
    );
    sprite.scale.set(effectiveSpriteScale);

    applyingWorldPlazaGirlSampleAvatarMotionToSpriteWithFallback({
      sprite,
      skinId: characterDefinition.skinId,
      motionSuffix: activeMotionSuffix,
      direction: activeDirection,
      frameIndex: animationFrameIndex,
    });

    const standingLayerOffsetPx = activeJumpState
      ? computingWorldBuildingWorldLayerScreenOffsetPx(
          activeJumpState.startLayer
        ) +
        (computingWorldBuildingWorldLayerScreenOffsetPx(
          activeJumpState.landingLayer
        ) -
          computingWorldBuildingWorldLayerScreenOffsetPx(
            activeJumpState.startLayer
          )) *
          jumpProgress
      : computingWorldBuildingWorldLayerScreenOffsetPx(
          resolvingWorldPlazaPlayerWorldLayer(playerPosition)
        );
    const screenPoint =
      convertingWorldPlazaGridPointToIsometricScreenPoint(playerPosition);
    const anchoredScreenY = screenPoint.y + standingLayerOffsetPx;
    const groundShadowLiftPeakScreenPx = activeJumpState
      ? activeJumpState.arcPeakScreenPx
      : activeFallState
        ? activeFallState.totalDropScreenPx
        : 0;
    const groundShadowJumpHeightRatio =
      computingWorldPlazaAvatarGroundShadowJumpHeightRatio(
        jumpArcOffsetPx + fallVerticalOffsetPx,
        groundShadowLiftPeakScreenPx
      );

    const placedBlocksDepthRevision =
      computingWorldPlazaPlacedBlocksDepthRevision(
        scenePlacedBlocks.length,
        scenePlacedBlocks[scenePlacedBlocks.length - 1]?.blockId
      );
    const avatarBodyEntityZIndex = resolvingWorldPlazaCachedAvatarBodySortKey(
      playerPosition,
      avatarDepthSortCacheRef.current,
      {
        placedBlocks: scenePlacedBlocks,
        placedBlocksByTile: scenePlacedBlocksByTile,
        avatarFootOffsetBelowGridAnchorPx,
      },
      placedBlocksDepthRevision
    );

    // Sinking into molten lava: skip while airborne so jumps can clear pools.
    const lavaSinkBaseOffsetPx =
      activeJumpState || activeFallState
        ? 0
        : computingWorldPlazaLavaSinkOffsetPxAtGridPoint(
            playerPosition.x,
            playerPosition.y,
            resolvingWorldPlazaPlayerWorldLayer(playerPosition),
            characterEngineDerivedStats.isLavaWalkable
          );
    const isLavaHeatProximate =
      !activeJumpState &&
      !activeFallState &&
      lavaSinkBaseOffsetPx === 0 &&
      checkingWorldPlazaLavaHeatProximityAtGridPoint(
        playerPosition.x,
        playerPosition.y,
        resolvingWorldPlazaPlayerWorldLayer(playerPosition),
        characterEngineDerivedStats.collisionRadiusGrid
      );
    const isLavaSubmergedPastAvatarHeight =
      checkingWorldPlazaLavaSinkHidesAvatarBodyAtBaseOffsetPx(
        lavaSinkBaseOffsetPx,
        characterEngineDerivedStats.heightWorldLayers
      );
    // Gentle bob so treading lava reads as floating; the cover layers stay
    // pinned at the surface while only the body bobs.
    const lavaSinkOffsetPx =
      lavaSinkBaseOffsetPx > 0
        ? lavaSinkBaseOffsetPx +
          computingWorldPlazaLavaSinkBobOffsetPx(performance.now())
        : 0;

    updatingWorldPlazaLavaSinkCoverAnimation(
      {
        backGraphics: avatarLavaSinkCoverBackGraphicsRef.current,
        frontGraphics: avatarLavaSinkCoverFrontGraphicsRef.current,
      },
      lavaSinkBaseOffsetPx > 0,
      performance.now()
    );
    updatingWorldPlazaLavaHeatProximityGlowAnimation(
      avatarLavaHeatProximityGlowGraphicsRef.current,
      isLavaHeatProximate,
      performance.now()
    );

    shadowContainer.position.set(screenPoint.x, anchoredScreenY);
    // Sync the shadow with the sprite: share the body sort key so whatever
    // occludes (or hides) the avatar occludes the shadow too. The shadow draws
    // just under the body via the tiny negative offset and its earlier child
    // order in the container.
    applyingWorldPlazaCachedDisplayObjectZIndex(
      shadowContainer,
      avatarBodyEntityZIndex +
        DEFINING_WORLD_DEPTH_AVATAR_GROUND_SHADOW_BODY_SYNC_Z_INDEX_OFFSET,
      avatarShadowZIndexRef
    );
    shadowContainer.visible =
      container.visible && (lavaSinkBaseOffsetPx === 0 || isLavaHeatProximate);
    if (avatarGroundShadowGraphicsRef.current) {
      avatarGroundShadowGraphicsRef.current.visible = !isLavaHeatProximate;
    }
    container.position.set(screenPoint.x, anchoredScreenY);
    container.rotation = isPlayerStunned
      ? computingWorldPlazaEntityStunAvatarWobbleRadians(
          nowMs,
          activeStunEffect?.phaseSeed ?? 0
        )
      : 0;
    applyingWorldPlazaCachedDisplayObjectZIndex(
      container,
      avatarBodyEntityZIndex,
      avatarBodyZIndexRef
    );
    sprite.visible = !isLavaSubmergedPastAvatarHeight;
    sprite.position.set(
      0,
      jumpArcOffsetPx +
        fallVerticalOffsetPx +
        lavaSinkOffsetPx +
        combatSpriteOffsetBelowGridAnchorPx
    );
    const respawnInvincibilityBlinkAlpha =
      computingWorldPlazaEntityRespawnInvincibilityBlinkAlpha(
        postRespawnInvincibilityUntilMsRef?.current ?? 0,
        performance.now()
      );
    sprite.alpha = respawnInvincibilityBlinkAlpha;
    sprite.tint = computingWorldPlazaFrostbiteAvatarTint(
      healthStateRef?.current?.frostbite?.stackCount ?? 0
    );
    shadowContainer.alpha = respawnInvincibilityBlinkAlpha;
    const heldItemSwingProfile = activeToolAction
      ? DEFINING_WORLD_PLAZA_HELD_ITEM_SWING_PROFILE_BY_TOOL_ACTION[
          activeToolAction.toolActionId
        ]
      : null;
    const heldItemSwingPose = heldItemSwingProfile
      ? computingWorldPlazaHeldItemSwingPose(
          heldItemSwingProfile,
          activeDirection,
          performance.now() - toolActionSwingStartMsRef.current
        )
      : null;

    updatingHeldItemOverlay(
      equippedHeldItemPresentationRef?.current ?? null,
      activeDirection,
      heldItemSwingPose
    );
    updatingWorldPlazaAvatarGroundShadowGraphics(
      avatarGroundShadowGraphicsRef.current,
      jumpArcOffsetPx + fallVerticalOffsetPx,
      groundShadowLiftPeakScreenPx,
      activeDirection,
      avatarFootOffsetBelowGridAnchorPx,
      avatarGroundShadowSizeScale
    );

    if (localUserId) {
      playerRenderPositionRegistryRef.current?.set(localUserId, {
        x: playerPosition.x,
        y: playerPosition.y,
        layer: playerPosition.layer,
        avatarScreenOffsetYPx:
          standingLayerOffsetPx +
          jumpArcOffsetPx +
          fallVerticalOffsetPx +
          combatSpriteOffsetBelowGridAnchorPx,
        avatarStandingLayerScreenOffsetYPx: standingLayerOffsetPx,
        avatarFacingDirection: activeDirection,
        avatarGroundShadowJumpHeightRatio: groundShadowJumpHeightRatio,
      });
    }

    if (localPlayerDodgeStateRef?.current) {
      localPlayerDodgeStateRef.current = {
        jumpArcOffsetPx: jumpArcOffsetPx + fallVerticalOffsetPx,
        collisionRadiusGrid: characterEngineDerivedStats.collisionRadiusGrid,
      };
    }

    recordingWorldPlazaPlayerPerformanceDiagnostics({
      nowMs,
      frameDeltaMs: ticker.deltaMS,
      attemptedMoveDistance,
      actualMoveDistance,
      healthState: healthStateRef?.current ?? null,
      staminaState: runStaminaStateRef?.current ?? null,
      navigationWaypointCount: walkWaypointsRef?.current.length ?? 0,
      worldLayer: resolvingWorldPlazaPlayerWorldLayer(playerPosition),
      isKeyboardMoving,
      isClickMoving: Boolean(walkTarget && isWalkingRef.current),
      isRunning: isRunningRef.current,
      isJumping: Boolean(activeJumpState),
      isFalling: Boolean(activeFallState),
      isRolling: isRollAnimatingForMovement,
      isPushing: isPushingIntoObstacle,
      isIceSliding: isIceCoasting,
      isStunned: isPlayerStunned,
      isAsleep: isPlayerAsleep,
      isDead: isPlayerDead,
    });
    finishAvatarTickSample();
  }, 'tick:local-avatar');

  return (
    <>
      <pixiContainer
        ref={(container) => {
          avatarShadowContainerRef.current = container;
        }}
        eventMode="none"
      >
        <pixiGraphics
          draw={drawingAvatarLavaHeatProximityGlow}
          visible={false}
          eventMode="none"
        />
        <pixiGraphics draw={drawingAvatarGroundShadow} eventMode="none" />
      </pixiContainer>
      <pixiContainer
        ref={(container) => {
          avatarContainerRef.current = container;
        }}
        sortableChildren
      >
        <pixiGraphics
          ref={(graphics) => {
            avatarLavaSinkCoverBackGraphicsRef.current = graphics;
          }}
          draw={drawingAvatarLavaSinkCoverBack}
          visible={false}
          eventMode="none"
        />
        <pixiSprite ref={attachingAvatarSprite} />
        <RenderingWorldPlazaAvatarCharacterSwitchEffect
          skinId={characterDefinition.skinId}
          footOffsetBelowGridAnchorPx={
            resolvingWorldPlazaAvatarFootOffsetBelowGridAnchorPx(
              characterDefinition
            ) * characterEngineDerivedStats.sizeScale
          }
        />
        <pixiSprite
          ref={(sprite) => {
            avatarHeldItemSpriteRef.current = sprite;
          }}
          eventMode="none"
          visible={false}
        />
        <pixiGraphics
          ref={(graphics) => {
            avatarLavaSinkCoverFrontGraphicsRef.current = graphics;
          }}
          draw={drawingAvatarLavaSinkCoverFront}
          visible={false}
          eventMode="none"
        />
      </pixiContainer>
    </>
  );
}
