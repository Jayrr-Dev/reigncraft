import { SIZING_USER_PROFILE_CARD_DISPLAY_MAX_WIDTH_PX } from "@/components/dashboard/profile/domains/definingUserProfileConstants";
import type { CSSProperties } from "react";

/** Visual scale applied to the full community profile card in plaza popovers. */
export const DEFINING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_CARD_SCALE = 0.62;

/** Unscaled profile card width before the plaza popover scale is applied (pixels). */
export const DEFINING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_CARD_SOURCE_WIDTH_PX =
  SIZING_USER_PROFILE_CARD_DISPLAY_MAX_WIDTH_PX;

/** Popover profile card width after scale (pixels). */
export const DEFINING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_CARD_MAX_WIDTH_PX = Math.round(
  DEFINING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_CARD_SOURCE_WIDTH_PX *
    DEFINING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_CARD_SCALE,
);

/**
 * CSS layout for shrinking a full-size profile card inside the plaza popover.
 */
export function computingWorldPlazaPlayerProfilePopoverScaledCardLayout(): {
  shell: CSSProperties;
  scaledContent: CSSProperties;
} {
  return {
    shell: {
      width: DEFINING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_CARD_MAX_WIDTH_PX,
      maxHeight: "min(65vh, 520px)",
      overflowX: "hidden",
      overflowY: "auto",
    },
    scaledContent: {
      width: DEFINING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_CARD_SOURCE_WIDTH_PX,
      scale: DEFINING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_CARD_SCALE,
      transformOrigin: "top left",
    },
  };
}
