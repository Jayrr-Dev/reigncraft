import {
  DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE,
  DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_GAP_BASE_PX,
} from "@/components/world/domains/definingWorldPlazaActionBarConstants";
import {
  DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_ATTACHMENT_BUTTON_BASE_PX,
  DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_SEND_BUTTON_BASE_PX,
  DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_SLOT_BASE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_SLOT_BASE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaRoomChatPanelConstants";
import {
  computingWorldPlazaViewportHudScaledPx,
  stylingWorldPlazaViewportHudSquarePx,
} from "@/components/world/domains/computingWorldPlazaViewportHudScale";
import type { CSSProperties } from "react";

/** Viewport-resolved inline styles for chat embedded in the action bar. */
export interface DefiningWorldPlazaRoomChatActionBarViewportStyles {
  readonly slotStyle: CSSProperties;
  readonly inputRowStyle: CSSProperties;
  readonly attachmentButtonStyle: CSSProperties;
  readonly attachmentIconStyle: CSSProperties;
  readonly sendButtonStyle: CSSProperties;
  readonly sendIconStyle: CSSProperties;
  readonly inputStyle: CSSProperties;
}

/**
 * Resolves crisp pixel-sized chat slot styles for the current viewport scale.
 *
 * @param viewportHudScale - Live scale from the plaza viewport frame
 */
export function resolvingWorldPlazaRoomChatActionBarViewportStyles(
  viewportHudScale: number,
): DefiningWorldPlazaRoomChatActionBarViewportStyles {
  const slotWidthPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_SLOT_BASE_WIDTH_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE,
  );
  const slotHeightPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_SLOT_BASE_HEIGHT_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE,
  );
  const attachmentButtonStyle = stylingWorldPlazaViewportHudSquarePx(
    DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_ATTACHMENT_BUTTON_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE,
  );
  const attachmentIconStyle = stylingWorldPlazaViewportHudSquarePx(
    14,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE,
  );
  const sendButtonStyle = stylingWorldPlazaViewportHudSquarePx(
    DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_SEND_BUTTON_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE,
  );
  const sendIconStyle = stylingWorldPlazaViewportHudSquarePx(
    14,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE,
  );
  const inputFontSizePx = computingWorldPlazaViewportHudScaledPx(
    12,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE,
  );
  const inputRowGapPx = computingWorldPlazaViewportHudScaledPx(
    DEFINING_WORLD_PLAZA_ACTION_BAR_SHELL_GAP_BASE_PX,
    viewportHudScale,
    DEFINING_WORLD_PLAZA_ACTION_BAR_SCALE,
  );

  return {
    slotStyle: {
      width: slotWidthPx,
      height: slotHeightPx,
    },
    inputRowStyle: {
      gap: inputRowGapPx,
    },
    attachmentButtonStyle,
    attachmentIconStyle,
    sendButtonStyle,
    sendIconStyle,
    inputStyle: {
      fontSize: inputFontSizePx,
    },
  };
}
