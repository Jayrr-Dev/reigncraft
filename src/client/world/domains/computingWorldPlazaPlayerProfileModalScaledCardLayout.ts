import { SIZING_USER_PROFILE_CARD_DISPLAY_MAX_WIDTH_PX } from "@/components/dashboard/profile/domains/definingUserProfileConstants";
import type { CSSProperties } from "react";

/** Full-size profile card width inside the plaza modal (pixels). */
export const DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_CARD_MAX_WIDTH_PX =
  SIZING_USER_PROFILE_CARD_DISPLAY_MAX_WIDTH_PX;

/**
 * CSS layout for a full-size community profile card inside the plaza modal.
 */
export function computingWorldPlazaPlayerProfileModalScaledCardLayout(): {
  shell: CSSProperties;
  scaledContent: CSSProperties;
} {
  return {
    shell: {
      width: DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_CARD_MAX_WIDTH_PX,
      maxWidth: "100%",
      maxHeight: "min(80vh, 640px)",
      overflowX: "hidden",
      overflowY: "auto",
    },
    scaledContent: {
      width: "100%",
    },
  };
}
