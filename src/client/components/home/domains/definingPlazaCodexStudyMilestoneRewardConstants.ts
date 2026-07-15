/**
 * Overall collection milestone chest positions on codex panel progress bars.
 * Applies to Sighted/Logged (discovered) and Studied meters — not per-entry detail.
 * Concrete grants live in `definingPlazaCodexMilestoneRewardRegistry`.
 *
 * @module components/home/domains/definingPlazaCodexStudyMilestoneRewardConstants
 */

/** Relative positions along dual-progress meters (Sighted/Logged + Studied). */
export const DEFINING_PLAZA_CODEX_OVERALL_MILESTONE_REWARD_PERCENTS = [
  5, 20, 50, 75, 100,
] as const;

/**
 * Four chests on discovery-only meters (Biomes Discovered, Recipes Attached).
 */
export const DEFINING_PLAZA_CODEX_DISCOVERY_MILESTONE_REWARD_PERCENTS = [
  25, 50, 75, 100,
] as const;

/** Iconify id for locked/unlocked milestone chest placeholders. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_CHEST_ICON =
  'mdi:treasure-chest' as const;

/** Outer wrap: track + overlapping chest nodes. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_SHELL_CLASS_NAME =
  'relative mt-1.5 h-4 overflow-visible' as const;

/** Thin fill track centered in the shell. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_TRACK_CLASS_NAME =
  'absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full border border-poster-teal/25 bg-poster-teal-deep/15' as const;

/** Gold fill inside the milestone track. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_FILL_CLASS_NAME =
  'h-full rounded-full bg-[linear-gradient(90deg,#c98a2d_0%,#d9a441_100%)] transition-[width] duration-500' as const;

/** Absolute layer holding chest circles. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_MARKERS_CLASS_NAME =
  'absolute inset-0' as const;

/** Locked (not yet reached) chest circle. Extra inset expands mobile tap target. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_LOCKED_CLASS_NAME =
  'group/milestone absolute top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-poster-teal/40 bg-parchment/90 text-ink-soft/55 shadow-[0_1px_0_0_rgba(20,37,43,0.35)] outline-none before:absolute before:-inset-2 before:content-[""]' as const;

/** Reached milestone chest circle (reward pending / claimed later). */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_REACHED_CLASS_NAME =
  'group/milestone absolute top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-poster-gold/70 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-poster-gold shadow-[0_1px_0_0_#14252b] outline-none before:absolute before:-inset-2 before:content-[""]' as const;

/** Chest icon size inside the circle. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_ICON_CLASS_NAME =
  'size-2.5 shrink-0' as const;

/** Orange corner pip on a reached chest (reward ready). */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NOTIFICATION_BADGE_CLASS_NAME =
  'pointer-events-none absolute -right-0.5 -top-0.5 z-10 size-1.5 rounded-full border border-parchment bg-poster-orange shadow-[0_0_0_1px_rgba(20,37,43,0.35)]' as const;

/**
 * Popover above a chest: "Reward ready" or "N more".
 * Visible on hover (desktop), focus-visible (keyboard), or aria-expanded (tap/mobile).
 */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_CLASS_NAME =
  'pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 whitespace-nowrap rounded border border-poster-teal/30 bg-parchment px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-soft opacity-0 shadow-[0_1px_0_0_rgba(20,37,43,0.25)] transition-opacity group-hover/milestone:opacity-100 group-focus-visible/milestone:opacity-100 group-aria-expanded/milestone:opacity-100' as const;
