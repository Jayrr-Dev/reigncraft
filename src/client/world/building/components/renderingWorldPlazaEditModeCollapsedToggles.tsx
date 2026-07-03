"use client";

import {
  DEFINING_WORLD_BUILDING_BUILD_MODE_TOGGLE_BUTTON_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldBuildingBuildModeConstants";
import {
  DEFINING_WORLD_BUILDING_CLAIM_MODE_TOGGLE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_EDIT_MODE_COLLAPSED_TOGGLE_ANCHOR_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldBuildingClaimModeConstants";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";

/** Accessible label for the build mode toggle. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_TOGGLE_LABEL =
  "Toggle build mode" as const;

/** Accessible label for the claim mode toggle. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_TOGGLE_LABEL =
  "Toggle claim mode" as const;

export interface RenderingWorldPlazaEditModeCollapsedTogglesProps {
  isVisible: boolean;
  onToggleBuildMode: () => void;
  onToggleClaimMode: () => void;
}

/**
 * Top-right build and claim toggles when no edit mode is active.
 */
export function RenderingWorldPlazaEditModeCollapsedToggles({
  isVisible,
  onToggleBuildMode,
  onToggleClaimMode,
}: RenderingWorldPlazaEditModeCollapsedTogglesProps): React.JSX.Element | null {
  if (!isVisible) {
    return null;
  }

  return (
    <div className={DEFINING_WORLD_BUILDING_EDIT_MODE_COLLAPSED_TOGGLE_ANCHOR_CLASS_NAME}>
      <button
        type="button"
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        aria-label={RENDERING_WORLD_PLAZA_CLAIM_MODE_TOGGLE_LABEL}
        aria-pressed={false}
        onClick={onToggleClaimMode}
        className={DEFINING_WORLD_BUILDING_CLAIM_MODE_TOGGLE_BUTTON_CLASS_NAME}
      >
        Claim (C)
      </button>
      <button
        type="button"
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        aria-label={RENDERING_WORLD_PLAZA_BUILD_MODE_TOGGLE_LABEL}
        aria-pressed={false}
        onClick={onToggleBuildMode}
        className={DEFINING_WORLD_BUILDING_BUILD_MODE_TOGGLE_BUTTON_CLASS_NAME}
      >
        Build (B)
      </button>
    </div>
  );
}
