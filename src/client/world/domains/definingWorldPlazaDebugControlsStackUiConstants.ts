/**
 * Shared layout for the left-side plaza debug control stack.
 *
 * Collision, Perf, and Character share one anchored flex column so vertical
 * spacing stays uniform regardless of how many toggles are visible.
 *
 * @module components/world/domains/definingWorldPlazaDebugControlsStackUiConstants
 */

/** Vertical gap between stacked debug toggle buttons. */
export const DEFINING_WORLD_PLAZA_DEBUG_CONTROLS_STACK_GAP_CLASS_NAME =
  "gap-1.5" as const;

/** Left-side anchor for the stacked debug controls. */
export const DEFINING_WORLD_PLAZA_DEBUG_CONTROLS_STACK_ANCHOR_CLASS_NAME =
  "pointer-events-none absolute left-3 z-20 flex select-none flex-col" as const;

/**
 * Resolves the top offset for the debug control stack below layer labels.
 *
 * @param hasStaminaBar - True when the stamina HUD is visible above the labels.
 * @param isBuildModeActive - True when build mode adds a second layer label line.
 */
export function resolvingWorldPlazaDebugControlsStackAnchorTopClassName(
  hasStaminaBar: boolean,
  isBuildModeActive: boolean,
): string {
  if (hasStaminaBar) {
    return isBuildModeActive ? "top-[8.5rem]" : "top-[6.75rem]";
  }

  return isBuildModeActive ? "top-[6rem]" : "top-[4.5rem]";
}
