/**
 * Bottom hotbar styling for claim and build edit modes.
 *
 * @module components/world/building/domains/definingWorldPlazaEditModeHotbarConstants
 */

/** Bottom-center anchor shared by claim and build mode hotbars. */
export const STYLING_WORLD_PLAZA_EDIT_MODE_HOTBAR_ANCHOR_CLASS_NAME =
  "pointer-events-none absolute inset-x-0 bottom-3 z-40 flex justify-center px-3" as const;

/** Inner shell for edit mode hotbars (matches inventory hotbar footprint). */
export const STYLING_WORLD_PLAZA_EDIT_MODE_HOTBAR_SHELL_CLASS_NAME =
  "pointer-events-auto flex max-w-[min(100%,42rem)] flex-col gap-1.5 rounded-md border border-white/15 bg-[#0d1b2a]/95 p-2 shadow-lg backdrop-blur-sm" as const;

/** Accessible label for the build mode bottom hotbar. */
export const LABELING_WORLD_PLAZA_BUILD_MODE_HOTBAR = "Build mode hotbar" as const;

/** Accessible label for the claim mode bottom hotbar. */
export const LABELING_WORLD_PLAZA_CLAIM_MODE_HOTBAR = "Claim mode hotbar" as const;

/** Debounce before auto-persisting build draft changes. */
export const DEFINING_WORLD_PLAZA_EDIT_MODE_AUTO_SAVE_DEBOUNCE_MS = 500 as const;
