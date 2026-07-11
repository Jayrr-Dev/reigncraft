/**
 * Auto-jump preference and gap-scan tuning for plaza locomotion.
 *
 * @module components/world/domains/definingWorldPlazaMobileAutoJumpConstants
 */

/** localStorage key for the auto-jump preference. */
export const DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_STORAGE_KEY =
  'world-plaza-mobile-auto-jump-enabled' as const;

/**
 * When no saved preference exists, auto-jump is on for mobile viewports only.
 * Desktop stays off until the player enables it in Settings.
 */
export const DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_DEFAULT_ENABLED_ON_MOBILE =
  true as const;

/** Settings row label in the action-bar mixer panel. */
export const LABELING_WORLD_PLAZA_MOBILE_AUTO_JUMP_TOGGLE =
  'Auto jump' as const;

/** Forward scan step when looking for a water gap ahead. */
export const DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_SCAN_STEP_GRID = 0.25;

/**
 * Furthest distance ahead to start committing to an auto-jump.
 * Keeps the avatar from leaping while still several tiles from the bank.
 */
export const DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_DETECT_MAX_GRID = 2.25;

/** Minimum gap width (along the scan) before auto-jump is worth requesting. */
export const DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_MIN_GAP_GRID = 0.35;

/**
 * Minimum delay between forward water probes while moving.
 * At full default run speed the player covers 0.3 grid during this interval,
 * well inside the 2.25-grid detection range.
 */
export const DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_PROBE_INTERVAL_MS = 100;

/** Cooldown after an auto-jump attempt so edge spam does not drain stamina. */
export const DEFINING_WORLD_PLAZA_MOBILE_AUTO_JUMP_COOLDOWN_MS = 450;

/** Checkbox row styling inside the settings mixer panel. */
export const STYLING_WORLD_PLAZA_MOBILE_AUTO_JUMP_TOGGLE_ROW_CLASS_NAME =
  'flex cursor-pointer items-center gap-2 text-xs font-semibold text-ink' as const;

/** Checkbox input styling for the auto-jump toggle. */
export const STYLING_WORLD_PLAZA_MOBILE_AUTO_JUMP_CHECKBOX_CLASS_NAME =
  'size-3.5 shrink-0 cursor-pointer rounded border border-poster-teal/40 bg-white/80 accent-poster-gold' as const;
