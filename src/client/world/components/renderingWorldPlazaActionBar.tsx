'use client';

/**
 * Top-centered plaza action bar for chat, friends, claim, build, character
 * transform, and fullscreen.
 *
 * @module components/world/components/renderingWorldPlazaActionBar
 */

import { RenderingWorldPlazaCodexMenuPanel } from '@/components/world/components/renderingWorldPlazaCodexMenuPanel';
import { RenderingWorldPlazaExitHomeConfirmDialog } from '@/components/world/components/renderingWorldPlazaExitHomeConfirmDialog';
import { RenderingWorldPlazaMasterVolumeMixerPanel } from '@/components/world/components/renderingWorldPlazaMasterVolumeMixerPanel';
import {
  DEFINING_WORLD_PLAZA_ACTION_BAR_ANCHOR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ACTION_BAR_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ACTION_BAR_MOBILE_ANCHOR_CLASS_NAME,
  DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_CLASS_NAME,
  LABELING_WORLD_PLAZA_ACTION_BAR_BUILD,
  LABELING_WORLD_PLAZA_ACTION_BAR_CHAT,
  LABELING_WORLD_PLAZA_ACTION_BAR_CLAIM,
  LABELING_WORLD_PLAZA_ACTION_BAR_FRIENDS,
  LABELING_WORLD_PLAZA_ACTION_BAR_HOME,
  LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM,
  STYLING_WORLD_PLAZA_ACTION_BAR_FRIENDS_NOTIFICATION_BADGE,
  STYLING_WORLD_PLAZA_ACTION_BAR_LIGHT_THEME_SCOPE_CLASS,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_ANCHOR_CLASS_NAME,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_BASE_CLASS_NAME,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_INACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_PANEL_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaActionBarConstants';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  LABELING_WORLD_PLAZA_ACTION_BAR_CODEX,
  STYLING_WORLD_PLAZA_ACTION_BAR_CODEX_ANCHOR_CLASS_NAME,
  type WorldPlazaCodexSectionId,
} from '@/components/world/domains/definingWorldPlazaCodexConstants';
import {
  LABELING_WORLD_PLAZA_ACTION_BAR_SETTINGS,
  STYLING_WORLD_PLAZA_ACTION_BAR_SOUND_MIXER_ANCHOR_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaMasterVolumeConstants';
import {
  DEFINING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_ENTER_LABEL,
  DEFINING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_EXIT_LABEL,
} from '@/components/world/domains/definingWorldPlazaViewportFullscreenConstants';
import { settingWorldPlazaSelectedAvatarSkin } from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import { resolvingWorldPlazaActionBarViewportStyles } from '@/components/world/domains/resolvingWorldPlazaActionBarViewportStyles';
import { usingWorldPlazaSelectedAvatarSkin } from '@/components/world/hooks/usingWorldPlazaSelectedAvatarSkin';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Hammer,
  Home,
  MapPinned,
  Maximize2,
  MessageCircle,
  Minimize2,
  Settings,
  Shell,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

/** Props for {@link RenderingWorldPlazaActionBar}. */
export interface RenderingWorldPlazaActionBarProps {
  /** When false, hides the entire bar. */
  isVisible: boolean;
  /** When false, disables social actions (chat, friends). */
  isSocialEnabled: boolean;
  /** When false, disables claim and build actions. */
  isEditEnabled: boolean;
  /** When false, hides the fullscreen control. */
  isFullscreenSupported: boolean;
  isChatOpen: boolean;
  isFriendsOpen: boolean;
  /** Pending incoming friend requests for the notification badge. */
  pendingFriendRequestCount?: number;
  isClaimModeActive: boolean;
  isBuildModeActive: boolean;
  isFullscreen: boolean;
  onToggleChat: () => void;
  onToggleFriends: () => void;
  onToggleClaimMode: () => void;
  onToggleBuildMode: () => void;
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
  isEditEnabled,
  isFullscreenSupported,
  isChatOpen,
  isFriendsOpen,
  pendingFriendRequestCount = 0,
  isClaimModeActive,
  isBuildModeActive,
  isFullscreen,
  onToggleChat,
  onToggleFriends,
  onToggleClaimMode,
  onToggleBuildMode,
  onToggleFullscreen,
  onSelectCodexSection,
  onExitToHome,
  viewportHudScale = 1,
  isMobile = false,
  isFullscreenViewport = false,
  inlineChatSlot = null,
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

  const selectedAvatarSkinId = usingWorldPlazaSelectedAvatarSkin();
  const [isTransformPanelOpen, setIsTransformPanelOpen] = useState(false);
  const [isSoundMixerOpen, setIsSoundMixerOpen] = useState(false);
  const [isCodexMenuOpen, setIsCodexMenuOpen] = useState(false);
  const [isExitHomeConfirmOpen, setIsExitHomeConfirmOpen] = useState(false);

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
        <div
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          className={DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_CLASS_NAME}
          style={viewportStyles.shellStyle}
          role="toolbar"
          aria-label="Plaza actions"
        >
          {onExitToHome ? (
            <button
              type="button"
              aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_HOME}
              onClick={() => {
                setIsExitHomeConfirmOpen(true);
              }}
              className={stylingWorldPlazaActionBarButton(false)}
              style={viewportStyles.buttonStyle}
            >
              <Home
                className={DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME}
                style={viewportStyles.iconStyle}
                aria-hidden="true"
              />
            </button>
          ) : null}
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
                setIsSoundMixerOpen((wasOpen) => !wasOpen);
              }}
              className={stylingWorldPlazaActionBarButton(isSoundMixerOpen)}
              style={viewportStyles.buttonStyle}
            >
              <Settings
                className={DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME}
                style={viewportStyles.iconStyle}
                aria-hidden="true"
              />
            </button>
            <RenderingWorldPlazaMasterVolumeMixerPanel
              isOpen={isSoundMixerOpen}
            />
          </div>
          {onSelectCodexSection ? (
            <div
              className={STYLING_WORLD_PLAZA_ACTION_BAR_CODEX_ANCHOR_CLASS_NAME}
            >
              <button
                type="button"
                aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_CODEX}
                aria-pressed={isCodexMenuOpen}
                aria-expanded={isCodexMenuOpen}
                onClick={() => {
                  setIsCodexMenuOpen((wasOpen) => !wasOpen);
                }}
                className={stylingWorldPlazaActionBarButton(isCodexMenuOpen)}
                style={viewportStyles.buttonStyle}
              >
                <BookOpen
                  className={DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME}
                  style={viewportStyles.iconStyle}
                  aria-hidden="true"
                />
              </button>
              <RenderingWorldPlazaCodexMenuPanel
                isOpen={isCodexMenuOpen}
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
          <button
            type="button"
            aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_CHAT}
            aria-pressed={isChatOpen}
            disabled={!isSocialEnabled}
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

          {!isChatOpen ? (
            <>
              <button
                type="button"
                aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_FRIENDS}
                aria-pressed={isFriendsOpen}
                disabled={!isSocialEnabled}
                onClick={onToggleFriends}
                className={cn(
                  stylingWorldPlazaActionBarButton(isFriendsOpen),
                  'relative'
                )}
                style={viewportStyles.buttonStyle}
              >
                <Users
                  className={DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME}
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
                className={DEFINING_WORLD_PLAZA_ACTION_BAR_DIVIDER_CLASS_NAME}
                style={viewportStyles.dividerStyle}
                aria-hidden="true"
              />

              <button
                type="button"
                aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_CLAIM}
                aria-pressed={isClaimModeActive}
                disabled={!isEditEnabled}
                onClick={onToggleClaimMode}
                className={stylingWorldPlazaActionBarButton(isClaimModeActive)}
                style={viewportStyles.buttonStyle}
              >
                <MapPinned
                  className={DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME}
                  style={viewportStyles.iconStyle}
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_BUILD}
                aria-pressed={isBuildModeActive}
                disabled={!isEditEnabled}
                onClick={onToggleBuildMode}
                className={stylingWorldPlazaActionBarButton(isBuildModeActive)}
                style={viewportStyles.buttonStyle}
              >
                <Hammer
                  className={DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME}
                  style={viewportStyles.iconStyle}
                  aria-hidden="true"
                />
              </button>

              <div
                className={
                  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_ANCHOR_CLASS_NAME
                }
              >
                <button
                  type="button"
                  aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM}
                  aria-pressed={isTransformPanelOpen}
                  aria-expanded={isTransformPanelOpen}
                  onClick={() => {
                    setIsTransformPanelOpen((wasOpen) => !wasOpen);
                  }}
                  className={stylingWorldPlazaActionBarButton(
                    isTransformPanelOpen
                  )}
                  style={viewportStyles.buttonStyle}
                >
                  <Shell
                    className={DEFINING_WORLD_PLAZA_ACTION_BAR_ICON_CLASS_NAME}
                    style={viewportStyles.iconStyle}
                    aria-hidden="true"
                  />
                </button>

                {isTransformPanelOpen ? (
                  <div
                    {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                    className={
                      STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_PANEL_CLASS_NAME
                    }
                    role="menu"
                    aria-label={LABELING_WORLD_PLAZA_ACTION_BAR_TRANSFORM}
                  >
                    {DEFINING_WORLD_PLAZA_AVATAR_SKIN_OPTIONS.map(
                      (skinOption) => {
                        const isActiveSkin =
                          skinOption.skinId === selectedAvatarSkinId;

                        return (
                          <button
                            key={skinOption.skinId}
                            type="button"
                            role="menuitemradio"
                            aria-checked={isActiveSkin}
                            onClick={() => {
                              settingWorldPlazaSelectedAvatarSkin(
                                skinOption.skinId
                              );
                              setIsTransformPanelOpen(false);
                            }}
                            className={cn(
                              STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_BASE_CLASS_NAME,
                              isActiveSkin
                                ? STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_ACTIVE_CLASS_NAME
                                : STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_INACTIVE_CLASS_NAME
                            )}
                          >
                            {skinOption.label}
                          </button>
                        );
                      }
                    )}
                  </div>
                ) : null}
              </div>

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
    </>
  );
}
