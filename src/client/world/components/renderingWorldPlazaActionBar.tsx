'use client';

/**
 * Top-centered plaza action bar for settings, chat, friends, build,
 * character transform, and fullscreen.
 *
 * @module components/world/components/renderingWorldPlazaActionBar
 */

import { useUserData } from '@/components/hooks/useAuth';
import {
  DEFINING_REIGNCRAFT_TOAST_WIDTH_PX,
  DEFINING_REIGNCRAFT_TOASTER_ID,
} from '@/components/ui/domains/definingReigncraftToastConstants';
import { RenderingReigncraftToaster } from '@/components/ui/sonner';
import type { DefiningWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { RenderingWorldPlazaActionBarTransformPanel } from '@/components/world/components/renderingWorldPlazaActionBarTransformPanel';
import { RenderingWorldPlazaCodexMenuPanel } from '@/components/world/components/renderingWorldPlazaCodexMenuPanel';
import { RenderingWorldPlazaDayNightIndicator } from '@/components/world/components/renderingWorldPlazaDayNightIndicator';
import { RenderingWorldPlazaDayNightPanel } from '@/components/world/components/renderingWorldPlazaDayNightPanel';
import { RenderingWorldPlazaExitHomeConfirmDialog } from '@/components/world/components/renderingWorldPlazaExitHomeConfirmDialog';
import { RenderingWorldPlazaMasterVolumeMixerPanel } from '@/components/world/components/renderingWorldPlazaMasterVolumeMixerPanel';
import { RenderingWorldPlazaMiniMapStack } from '@/components/world/components/renderingWorldPlazaMiniMapStack';
import { RenderingWorldPlazaPerformanceDiagnosticsFpsReadout } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsFpsReadout';
import { RenderingWorldPlazaWorldLayerIndicator } from '@/components/world/components/renderingWorldPlazaWorldLayerIndicator';
import { checkingWorldPlazaAvatarTransformControlVisible } from '@/components/world/domains/checkingWorldPlazaAvatarTransformControlVisible';
import {
  DEFINING_WORLD_PLAZA_ACTION_BAR_ANCHOR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ACTION_BAR_COLUMN_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_ANCHOR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ACTION_BAR_TOAST_HOST_CLASS_NAME,
  LABELING_WORLD_PLAZA_ACTION_BAR_CHAT,
  LABELING_WORLD_PLAZA_ACTION_BAR_FRIENDS,
  LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM,
  STYLING_WORLD_PLAZA_ACTION_BAR_FRIENDS_NOTIFICATION_BADGE,
  STYLING_WORLD_PLAZA_ACTION_BAR_LIGHT_THEME_SCOPE_CLASS,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_ANCHOR_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaActionBarConstants';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  LABELING_WORLD_PLAZA_ACTION_BAR_CODEX,
  LABELING_WORLD_PLAZA_CODEX_REWARD_READY,
  STYLING_WORLD_PLAZA_ACTION_BAR_CODEX_ANCHOR_CLASS_NAME,
  STYLING_WORLD_PLAZA_CODEX_BOOK_REWARD_READY_BADGE_CLASS_NAME,
  type WorldPlazaCodexSectionId,
} from '@/components/world/domains/definingWorldPlazaCodexConstants';
import { STYLING_WORLD_PLAZA_ACTION_BAR_DAY_NIGHT_ANCHOR_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDayNightIndicatorConstants';
import {
  LABELING_WORLD_PLAZA_ACTION_BAR_SETTINGS,
  STYLING_WORLD_PLAZA_ACTION_BAR_SOUND_MIXER_ANCHOR_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaMasterVolumeConstants';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import { LABELING_WORLD_PLAZA_ACTION_BAR_PROFILE } from '@/components/world/domains/definingWorldPlazaProfilePanelConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_ENTER_LABEL,
  DEFINING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_EXIT_LABEL,
} from '@/components/world/domains/definingWorldPlazaViewportFullscreenConstants';
import { STYLING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER_ANCHOR_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaWorldLayerIndicatorConstants';
import { listingWorldPlazaAvatarSkinOptionsForUser } from '@/components/world/domains/listingWorldPlazaAvatarSkinOptionsForUser';
import {
  gettingWorldPlazaBestiaryStudyCountsSnapshot,
  subscribingWorldPlazaBestiaryDiscovery,
} from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import { resolvingWorldPlazaActionBarViewportStyles } from '@/components/world/domains/resolvingWorldPlazaActionBarViewportStyles';
import { RenderingWorldPlazaTemperatureIndicator } from '@/components/world/health/components/renderingWorldPlazaTemperatureIndicator';
import { RenderingWorldPlazaTemperaturePanel } from '@/components/world/health/components/renderingWorldPlazaTemperaturePanel';
import { STYLING_WORLD_PLAZA_ACTION_BAR_TEMPERATURE_ANCHOR_CLASS_NAME } from '@/components/world/health/domains/definingWorldPlazaTemperatureIndicatorConstants';
import type { DefiningWorldPlazaTemperatureDisplayUnit } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import { usingWorldPlazaCodexRewardReadySections } from '@/components/world/hooks/usingWorldPlazaCodexRewardReadySections';
import { usingWorldPlazaMinimapEnabled } from '@/components/world/hooks/usingWorldPlazaMinimapEnabled';
import { usingWorldPlazaPerformanceFpsReadoutVisibleState } from '@/components/world/hooks/usingWorldPlazaPerformanceFpsReadoutVisibleState';
import { usingWorldPlazaSelectedAvatarSkin } from '@/components/world/hooks/usingWorldPlazaSelectedAvatarSkin';
import { RenderingWorldPlazaHungerIndicator } from '@/components/world/hunger/components/renderingWorldPlazaHungerIndicator';
import { RenderingWorldPlazaHungerPanel } from '@/components/world/hunger/components/renderingWorldPlazaHungerPanel';
import type { DefiningWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import { STYLING_WORLD_PLAZA_ACTION_BAR_HUNGER_ANCHOR_CLASS_NAME } from '@/components/world/hunger/domains/definingWorldPlazaHungerPanelConstants';
import { DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import { LABELING_WORLD_PLAZA_ACTION_BAR_PETS } from '@/components/world/wildlife/pets/domains/definingWildlifePetRosterPanelConstants';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Maximize2,
  MessageCircle,
  Minimize2,
  PawPrint,
  Settings,
  Shell,
  UserRound,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';

/** Props for {@link RenderingWorldPlazaActionBar}. */
export interface RenderingWorldPlazaActionBarProps {
  /** When false, hides the entire bar. */
  isVisible: boolean;
  /** When false, hides social actions (chat, friends). */
  isSocialEnabled: boolean;
  /** When false, hides the fullscreen control. */
  isFullscreenSupported: boolean;
  isChatOpen: boolean;
  isFriendsOpen: boolean;
  /** Pending incoming friend requests for the notification badge. */
  pendingFriendRequestCount?: number;
  /** True while the character profile panel is open. */
  isProfileOpen?: boolean;
  /** True while the companions roster panel is open. */
  isPetsOpen?: boolean;
  isFullscreen: boolean;
  onToggleChat: () => void;
  onToggleFriends: () => void;
  /** Toggles the character profile panel when provided. */
  onToggleProfile?: () => void;
  /** Toggles the companions roster panel when provided. */
  onTogglePets?: () => void;
  onToggleFullscreen: () => void;
  /** Opens a codex section overlay when provided. */
  onSelectCodexSection?: (section: WorldPlazaCodexSectionId) => void;
  /** Returns to the home screen when provided. */
  onExitToHome?: () => void;
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
  /** When true, shrinks controls for narrow viewports. */
  isMobile?: boolean;
  /** When true, applies slightly tighter shell padding (fullscreen HUD profile). */
  isFullscreenViewport?: boolean;
  /** Inline chat controls rendered in place of build mode when chat is open. */
  inlineChatSlot?: React.ReactNode;
  /** When set, shows the hunger sphere left of transform. */
  hungerHud?: {
    readonly hungerRatio: number;
    readonly tier: DefiningWorldPlazaHungerTier;
    readonly isStarving: boolean;
  } | null;
  /** When set, shows the temperature sphere beside hunger. */
  temperatureHud?: {
    readonly localTemperatureCelsius: number | null;
    readonly temperatureDisplayUnit: DefiningWorldPlazaTemperatureDisplayUnit;
    /** Character comfort band for soft blue→peach orb colors. */
    readonly comfortBand?: {
      readonly comfortLowCelsius: number;
      readonly comfortHighCelsius: number;
    } | null;
  } | null;
  /** Live local player position; drives the world-layer orb. */
  playerPositionRef?: React.RefObject<DefiningWorldPlazaWorldPoint> | null;
  /** When set, layer orb toggles the minimap dropdown under the action bar. */
  minimapHud?: {
    readonly playerRenderPositionRegistryRef: React.RefObject<
      Map<string, DefiningWorldPlazaPlayerRenderPosition>
    >;
    readonly isWalkingRef: React.RefObject<boolean>;
    readonly isRunningRef: React.RefObject<boolean>;
    readonly localUserId: string | null;
    readonly ownedPlotsRef: React.RefObject<DefiningWorldBuildingPlot[]>;
  } | null;
}

/**
 * Resolves button classes for one action bar control.
 *
 * @param isActive - Whether the control's mode or panel is active
 */
function stylingWorldPlazaActionBarButton(isActive: boolean): string {
  return isActive
    ? DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_ACTIVE_CLASS_NAME
    : DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_CLASS_NAME;
}

/**
 * Minimal game-style action bar anchored to the top center of the plaza viewport.
 */
export function RenderingWorldPlazaActionBar({
  isVisible,
  isSocialEnabled,
  isFullscreenSupported,
  isChatOpen,
  isFriendsOpen,
  pendingFriendRequestCount = 0,
  isProfileOpen = false,
  isPetsOpen = false,
  isFullscreen,
  onToggleChat,
  onToggleFriends,
  onToggleProfile,
  onTogglePets,
  onToggleFullscreen,
  onSelectCodexSection,
  onExitToHome,
  viewportHudScale = 1,
  isMobile = false,
  isFullscreenViewport = false,
  inlineChatSlot = null,
  hungerHud = null,
  temperatureHud = null,
  playerPositionRef = null,
  minimapHud = null,
}: RenderingWorldPlazaActionBarProps): React.JSX.Element | null {
  const viewportStyles = useMemo(
    () =>
      resolvingWorldPlazaActionBarViewportStyles(
        viewportHudScale,
        isMobile,
        isFullscreenViewport
      ),
    [viewportHudScale, isMobile, isFullscreenViewport]
  );

  const { data: userData } = useUserData();
  const selectedAvatarSkinId = usingWorldPlazaSelectedAvatarSkin();
  const studyCountsBySpeciesId = useSyncExternalStore(
    subscribingWorldPlazaBestiaryDiscovery,
    gettingWorldPlazaBestiaryStudyCountsSnapshot,
    gettingWorldPlazaBestiaryStudyCountsSnapshot
  );
  const unlockedAvatarSkinOptions = useMemo(
    () =>
      listingWorldPlazaAvatarSkinOptionsForUser(
        userData?.username,
        userData?.alias,
        studyCountsBySpeciesId
      ),
    [studyCountsBySpeciesId, userData?.alias, userData?.username]
  );
  const isTransformControlVisible =
    checkingWorldPlazaAvatarTransformControlVisible(
      unlockedAvatarSkinOptions,
      selectedAvatarSkinId
    );
  const { isMinimapPreferenceEnabled, settingMinimapEnabled } =
    usingWorldPlazaMinimapEnabled();
  const { isFpsReadoutVisible } =
    usingWorldPlazaPerformanceFpsReadoutVisibleState();
  const [isTransformPanelOpen, setIsTransformPanelOpen] = useState(false);
  const [isHungerPanelOpen, setIsHungerPanelOpen] = useState(false);
  const [isTemperaturePanelOpen, setIsTemperaturePanelOpen] = useState(false);
  const [isDayNightPanelOpen, setIsDayNightPanelOpen] = useState(false);
  const [isSoundMixerOpen, setIsSoundMixerOpen] = useState(false);
  const [isCodexMenuOpen, setIsCodexMenuOpen] = useState(false);
  const [isExitHomeConfirmOpen, setIsExitHomeConfirmOpen] = useState(false);
  const rewardReadySectionIds = usingWorldPlazaCodexRewardReadySections();
  const hasCodexRewardReady = rewardReadySectionIds.size > 0;

  useEffect(() => {
    if (!isChatOpen) {
      return;
    }

    setIsTransformPanelOpen(false);
    setIsHungerPanelOpen(false);
    setIsTemperaturePanelOpen(false);
    setIsDayNightPanelOpen(false);
    setIsSoundMixerOpen(false);
    setIsCodexMenuOpen(false);
    settingMinimapEnabled(false);
  }, [isChatOpen, settingMinimapEnabled]);

  useEffect(() => {
    if (isTransformControlVisible) {
      return;
    }

    setIsTransformPanelOpen(false);
  }, [isTransformControlVisible]);

  useEffect(() => {
    if (
      !isTransformPanelOpen &&
      !isHungerPanelOpen &&
      !isTemperaturePanelOpen &&
      !isDayNightPanelOpen &&
      !isCodexMenuOpen
    ) {
      return;
    }

    settingMinimapEnabled(false);
  }, [
    isTransformPanelOpen,
    isHungerPanelOpen,
    isTemperaturePanelOpen,
    isDayNightPanelOpen,
    isCodexMenuOpen,
    settingMinimapEnabled,
  ]);

  if (!isVisible) {
    return null;
  }

  const fullscreenLabel = isFullscreen
    ? DEFINING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_EXIT_LABEL
    : DEFINING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_ENTER_LABEL;

  return (
    <>
      <div
        className={cn(
          isMobile
            ? DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_ANCHOR_CLASS_NAME
            : DEFINING_WORLD_PLAZA_ACTION_BAR_ANCHOR_CLASS_NAME,
          STYLING_WORLD_PLAZA_ACTION_BAR_LIGHT_THEME_SCOPE_CLASS
        )}
      >
        <div className={DEFINING_WORLD_PLAZA_ACTION_BAR_COLUMN_CLASS_NAME}>
          <div
            {...{
              [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true,
              [DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE]: 'action-bar',
            }}
            className={DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_CLASS_NAME}
            style={viewportStyles.shellStyle}
            role="toolbar"
            aria-label="Plaza actions"
          >
            {!isChatOpen ? (
              <>
                <div
                  className={
                    STYLING_WORLD_PLAZA_ACTION_BAR_SOUND_MIXER_ANCHOR_CLASS_NAME
                  }
                >
                  <button
                    type="button"
                    aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_SETTINGS}
                    aria-pressed={isSoundMixerOpen}
                    aria-expanded={isSoundMixerOpen}
                    onClick={() => {
                      setIsHungerPanelOpen(false);
                      setIsTemperaturePanelOpen(false);
                      setIsDayNightPanelOpen(false);
                      setIsTransformPanelOpen(false);
                      setIsCodexMenuOpen(false);
                      settingMinimapEnabled(false);
                      setIsSoundMixerOpen((wasOpen) => !wasOpen);
                    }}
                    className={stylingWorldPlazaActionBarButton(
                      isSoundMixerOpen
                    )}
                    style={viewportStyles.buttonStyle}
                  >
                    <Settings
                      className={
                        DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME
                      }
                      style={viewportStyles.iconStyle}
                      aria-hidden="true"
                    />
                  </button>
                  <RenderingWorldPlazaMasterVolumeMixerPanel
                    isOpen={isSoundMixerOpen}
                    onRequestExitToHome={
                      onExitToHome
                        ? () => {
                            setIsSoundMixerOpen(false);
                            setIsExitHomeConfirmOpen(true);
                          }
                        : undefined
                    }
                    onSelectGuideSection={
                      onSelectCodexSection
                        ? (section) => {
                            setIsSoundMixerOpen(false);
                            onSelectCodexSection(section);
                          }
                        : undefined
                    }
                  />
                </div>
                {onSelectCodexSection ? (
                  <div
                    {...{
                      [DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE]:
                        'codex-book',
                    }}
                    className={
                      STYLING_WORLD_PLAZA_ACTION_BAR_CODEX_ANCHOR_CLASS_NAME
                    }
                  >
                    <button
                      type="button"
                      aria-label={
                        hasCodexRewardReady
                          ? `${LABELING_WORLD_PLAZA_ACTION_BAR_CODEX}. ${LABELING_WORLD_PLAZA_CODEX_REWARD_READY}`
                          : LABELING_WORLD_PLAZA_ACTION_BAR_CODEX
                      }
                      aria-pressed={isCodexMenuOpen}
                      aria-expanded={isCodexMenuOpen}
                      onClick={() => {
                        setIsHungerPanelOpen(false);
                        setIsTemperaturePanelOpen(false);
                        setIsDayNightPanelOpen(false);
                        setIsTransformPanelOpen(false);
                        setIsSoundMixerOpen(false);
                        settingMinimapEnabled(false);
                        setIsCodexMenuOpen((wasOpen) => !wasOpen);
                      }}
                      className={cn(
                        stylingWorldPlazaActionBarButton(isCodexMenuOpen),
                        'relative'
                      )}
                      style={viewportStyles.buttonStyle}
                    >
                      <BookOpen
                        className={
                          DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME
                        }
                        style={viewportStyles.iconStyle}
                        aria-hidden="true"
                      />
                      {hasCodexRewardReady ? (
                        <span
                          className={
                            STYLING_WORLD_PLAZA_CODEX_BOOK_REWARD_READY_BADGE_CLASS_NAME
                          }
                          style={viewportStyles.notificationBadgeStyle}
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                    <RenderingWorldPlazaCodexMenuPanel
                      isOpen={isCodexMenuOpen}
                      rewardReadySectionIds={rewardReadySectionIds}
                      onSelectSection={(section) => {
                        setIsCodexMenuOpen(false);
                        onSelectCodexSection(section);
                      }}
                    />
                  </div>
                ) : null}
                <span
                  className={DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_CLASS_NAME}
                  style={viewportStyles.dividerStyle}
                  aria-hidden="true"
                />
              </>
            ) : null}
            {isSocialEnabled ? (
              <button
                type="button"
                aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_CHAT}
                aria-pressed={isChatOpen}
                onClick={onToggleChat}
                className={stylingWorldPlazaActionBarButton(isChatOpen)}
                style={viewportStyles.buttonStyle}
              >
                <MessageCircle
                  className={DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME}
                  style={viewportStyles.iconStyle}
                  aria-hidden="true"
                />
              </button>
            ) : null}

            {!isChatOpen ? (
              <>
                {isSocialEnabled ? (
                  <>
                    <button
                      type="button"
                      aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_FRIENDS}
                      aria-pressed={isFriendsOpen}
                      onClick={onToggleFriends}
                      className={cn(
                        stylingWorldPlazaActionBarButton(isFriendsOpen),
                        'relative'
                      )}
                      style={viewportStyles.buttonStyle}
                    >
                      <Users
                        className={
                          DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME
                        }
                        style={viewportStyles.iconStyle}
                        aria-hidden="true"
                      />
                      {pendingFriendRequestCount > 0 ? (
                        <span
                          className={
                            STYLING_WORLD_PLAZA_ACTION_BAR_FRIENDS_NOTIFICATION_BADGE
                          }
                          style={viewportStyles.notificationBadgeStyle}
                          aria-hidden="true"
                        >
                          {pendingFriendRequestCount > 9
                            ? '9+'
                            : pendingFriendRequestCount}
                        </span>
                      ) : null}
                    </button>

                    <span
                      className={
                        DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_CLASS_NAME
                      }
                      style={viewportStyles.dividerStyle}
                      aria-hidden="true"
                    />
                  </>
                ) : null}

                {onToggleProfile ? (
                  <button
                    type="button"
                    {...{
                      [DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE]:
                        'profile-panel',
                    }}
                    aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_PROFILE}
                    aria-pressed={isProfileOpen}
                    onClick={onToggleProfile}
                    className={stylingWorldPlazaActionBarButton(isProfileOpen)}
                    style={viewportStyles.buttonStyle}
                  >
                    <UserRound
                      className={
                        DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME
                      }
                      style={viewportStyles.iconStyle}
                      aria-hidden="true"
                    />
                  </button>
                ) : null}

                {onTogglePets ? (
                  <button
                    type="button"
                    {...{
                      [DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE]:
                        'pets-roster',
                    }}
                    aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_PETS}
                    aria-pressed={isPetsOpen}
                    onClick={onTogglePets}
                    className={stylingWorldPlazaActionBarButton(isPetsOpen)}
                    style={viewportStyles.buttonStyle}
                  >
                    <PawPrint
                      className={
                        DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME
                      }
                      style={viewportStyles.iconStyle}
                      aria-hidden="true"
                    />
                  </button>
                ) : null}

                {isTransformControlVisible ? (
                  <div
                    className={
                      STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_ANCHOR_CLASS_NAME
                    }
                  >
                    <button
                      type="button"
                      {...{
                        [DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE]:
                          'transform-control',
                      }}
                      aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM}
                      aria-pressed={isTransformPanelOpen}
                      aria-expanded={isTransformPanelOpen}
                      onClick={() => {
                        setIsHungerPanelOpen(false);
                        setIsTemperaturePanelOpen(false);
                        setIsDayNightPanelOpen(false);
                        setIsSoundMixerOpen(false);
                        setIsCodexMenuOpen(false);
                        settingMinimapEnabled(false);
                        setIsTransformPanelOpen((wasOpen) => !wasOpen);
                      }}
                      className={stylingWorldPlazaActionBarButton(
                        isTransformPanelOpen
                      )}
                      style={viewportStyles.buttonStyle}
                    >
                      <Shell
                        className={
                          DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME
                        }
                        style={viewportStyles.iconStyle}
                        aria-hidden="true"
                      />
                    </button>

                    {isTransformPanelOpen ? (
                      <RenderingWorldPlazaActionBarTransformPanel
                        selectedAvatarSkinId={selectedAvatarSkinId}
                        onSelectSkin={() => {
                          setIsTransformPanelOpen(false);
                        }}
                      />
                    ) : null}
                  </div>
                ) : null}

                {hungerHud ? (
                  <span
                    className={
                      DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_CLASS_NAME
                    }
                    style={viewportStyles.dividerStyle}
                    aria-hidden="true"
                  />
                ) : null}

                {hungerHud ? (
                  <div
                    {...{
                      [DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE]:
                        'hunger-orb',
                    }}
                    className={
                      STYLING_WORLD_PLAZA_ACTION_BAR_HUNGER_ANCHOR_CLASS_NAME
                    }
                  >
                    <RenderingWorldPlazaHungerIndicator
                      hungerRatio={hungerHud.hungerRatio}
                      tier={hungerHud.tier}
                      isStarving={hungerHud.isStarving}
                      viewportHudScale={viewportHudScale}
                      isMobile={isMobile}
                      isOpen={isHungerPanelOpen}
                      onToggle={() => {
                        setIsTransformPanelOpen(false);
                        setIsSoundMixerOpen(false);
                        setIsCodexMenuOpen(false);
                        setIsTemperaturePanelOpen(false);
                        setIsDayNightPanelOpen(false);
                        settingMinimapEnabled(false);
                        setIsHungerPanelOpen((wasOpen) => !wasOpen);
                      }}
                    />
                    {isHungerPanelOpen ? (
                      <RenderingWorldPlazaHungerPanel
                        hungerRatio={hungerHud.hungerRatio}
                        tier={hungerHud.tier}
                        isStarving={hungerHud.isStarving}
                      />
                    ) : null}
                  </div>
                ) : null}

                {temperatureHud &&
                temperatureHud.localTemperatureCelsius !== null ? (
                  <div
                    {...{
                      [DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE]:
                        'temperature-orb',
                    }}
                    className={
                      STYLING_WORLD_PLAZA_ACTION_BAR_TEMPERATURE_ANCHOR_CLASS_NAME
                    }
                  >
                    <RenderingWorldPlazaTemperatureIndicator
                      localTemperatureCelsius={
                        temperatureHud.localTemperatureCelsius
                      }
                      temperatureDisplayUnit={
                        temperatureHud.temperatureDisplayUnit
                      }
                      comfortBand={temperatureHud.comfortBand}
                      viewportHudScale={viewportHudScale}
                      isMobile={isMobile}
                      isOpen={isTemperaturePanelOpen}
                      onToggle={() => {
                        setIsTransformPanelOpen(false);
                        setIsSoundMixerOpen(false);
                        setIsCodexMenuOpen(false);
                        setIsHungerPanelOpen(false);
                        setIsDayNightPanelOpen(false);
                        settingMinimapEnabled(false);
                        setIsTemperaturePanelOpen((wasOpen) => !wasOpen);
                      }}
                    />
                    {isTemperaturePanelOpen ? (
                      <RenderingWorldPlazaTemperaturePanel
                        temperatureDisplayUnit={
                          temperatureHud.temperatureDisplayUnit
                        }
                        comfortBand={temperatureHud.comfortBand}
                      />
                    ) : null}
                  </div>
                ) : null}

                <div
                  className={
                    STYLING_WORLD_PLAZA_ACTION_BAR_DAY_NIGHT_ANCHOR_CLASS_NAME
                  }
                >
                  <RenderingWorldPlazaDayNightIndicator
                    viewportHudScale={viewportHudScale}
                    isMobile={isMobile}
                    isOpen={isDayNightPanelOpen}
                    onToggle={() => {
                      setIsTransformPanelOpen(false);
                      setIsSoundMixerOpen(false);
                      setIsCodexMenuOpen(false);
                      setIsHungerPanelOpen(false);
                      setIsTemperaturePanelOpen(false);
                      settingMinimapEnabled(false);
                      setIsDayNightPanelOpen((wasOpen) => !wasOpen);
                    }}
                  />
                  {isDayNightPanelOpen ? (
                    <RenderingWorldPlazaDayNightPanel />
                  ) : null}
                </div>

                {playerPositionRef ? (
                  <div
                    className={
                      STYLING_WORLD_PLAZA_ACTION_BAR_WORLD_LAYER_ANCHOR_CLASS_NAME
                    }
                  >
                    <RenderingWorldPlazaWorldLayerIndicator
                      viewportHudScale={viewportHudScale}
                      isMobile={isMobile}
                      isOpen={isMinimapPreferenceEnabled}
                      onToggle={() => {
                        const nextMinimapEnabled = !isMinimapPreferenceEnabled;
                        setIsTransformPanelOpen(false);
                        setIsSoundMixerOpen(false);
                        setIsCodexMenuOpen(false);
                        setIsHungerPanelOpen(false);
                        setIsTemperaturePanelOpen(false);
                        setIsDayNightPanelOpen(false);
                        // Defer store write until panel setStates commit. Sync
                        // minimap updates re-render before those flush, and the
                        // "close map when a panel is open" effect would see stale
                        // open panels and immediately undo the open.
                        queueMicrotask(() => {
                          settingMinimapEnabled(nextMinimapEnabled);
                        });
                      }}
                    />
                    {minimapHud && isMinimapPreferenceEnabled ? (
                      <RenderingWorldPlazaMiniMapStack
                        playerPositionRef={playerPositionRef}
                        playerRenderPositionRegistryRef={
                          minimapHud.playerRenderPositionRegistryRef
                        }
                        isWalkingRef={minimapHud.isWalkingRef}
                        isRunningRef={minimapHud.isRunningRef}
                        localUserId={minimapHud.localUserId}
                        isFullscreen={isFullscreenViewport || isFullscreen}
                        ownedPlotsRef={minimapHud.ownedPlotsRef}
                        viewportHudScale={viewportHudScale}
                      />
                    ) : null}
                  </div>
                ) : null}

                {isFullscreenSupported ? (
                  <>
                    <span
                      className={
                        DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_CLASS_NAME
                      }
                      style={viewportStyles.dividerStyle}
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      aria-label={fullscreenLabel}
                      aria-pressed={isFullscreen}
                      onClick={onToggleFullscreen}
                      className={stylingWorldPlazaActionBarButton(isFullscreen)}
                      style={viewportStyles.buttonStyle}
                    >
                      {isFullscreen ? (
                        <Minimize2
                          className={
                            DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME
                          }
                          style={viewportStyles.iconStyle}
                          aria-hidden="true"
                        />
                      ) : (
                        <Maximize2
                          className={
                            DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME
                          }
                          style={viewportStyles.iconStyle}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </>
                ) : null}

                {inlineChatSlot ? (
                  <div className="hidden" aria-hidden="true">
                    {inlineChatSlot}
                  </div>
                ) : null}
              </>
            ) : (
              inlineChatSlot
            )}
          </div>
          <div
            className={DEFINING_WORLD_PLAZA_ACTION_BAR_TOAST_HOST_CLASS_NAME}
            style={{ width: DEFINING_REIGNCRAFT_TOAST_WIDTH_PX }}
          >
            <RenderingReigncraftToaster
              toasterId={DEFINING_REIGNCRAFT_TOASTER_ID.plaza}
              variant="gameplay"
              position="top-center"
              offset={0}
              mobileOffset={0}
              toastWidthPx={DEFINING_REIGNCRAFT_TOAST_WIDTH_PX}
            />
          </div>
        </div>
      </div>
      {onExitToHome ? (
        <RenderingWorldPlazaExitHomeConfirmDialog
          isOpen={isExitHomeConfirmOpen}
          onStay={() => {
            setIsExitHomeConfirmOpen(false);
          }}
          onConfirmExit={() => {
            setIsExitHomeConfirmOpen(false);
            onExitToHome();
          }}
        />
      ) : null}
      {isFpsReadoutVisible ? (
        <RenderingWorldPlazaPerformanceDiagnosticsFpsReadout
          viewportHudScale={viewportHudScale}
          isMobile={isMobile}
        />
      ) : null}
    </>
  );
}
