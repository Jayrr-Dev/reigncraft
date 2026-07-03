"use client";

import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_ARIA_LABEL,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_BUTTON_LABEL,
} from "@/components/world/domains/definingWorldPlazaTerrainCollisionDebugUiConstants";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";

export interface RenderingWorldPlazaTerrainCollisionDebugToggleButtonProps {
  /** True when collision debug overlays are visible. */
  isVisible: boolean;
  /** Flips collision debug visibility. */
  onToggle: () => void;
}

/**
 * Collision debug toggle button for the plaza debug control stack.
 */
export function RenderingWorldPlazaTerrainCollisionDebugToggleButton({
  isVisible,
  onToggle,
}: RenderingWorldPlazaTerrainCollisionDebugToggleButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      aria-label={DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_ARIA_LABEL}
      aria-pressed={isVisible}
      onClick={onToggle}
      className={
        isVisible
          ? DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_BUTTON_ACTIVE_CLASS_NAME
          : DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_BUTTON_CLASS_NAME
      }
    >
      {DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_TOGGLE_BUTTON_LABEL}
    </button>
  );
}
