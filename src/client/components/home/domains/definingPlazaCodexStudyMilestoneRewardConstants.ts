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
  'peer/milestone absolute top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-poster-teal/40 bg-parchment/90 text-ink-soft/55 shadow-[0_1px_0_0_rgba(20,37,43,0.35)] outline-none before:absolute before:-inset-2 before:content-[""]' as const;

/** Reached milestone chest circle (reward pending / claimed later). */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_REACHED_CLASS_NAME =
  'peer/milestone absolute top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-poster-gold/70 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-poster-gold shadow-[0_1px_0_0_#14252b] outline-none before:absolute before:-inset-2 before:content-[""]' as const;

/** Chest icon size inside the circle. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_ICON_CLASS_NAME =
  'size-2.5 shrink-0' as const;

/** Orange corner pip on a reached chest (reward ready). */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NOTIFICATION_BADGE_CLASS_NAME =
  'pointer-events-none absolute -right-0.5 -top-0.5 z-10 size-1.5 rounded-full border border-parchment bg-poster-orange shadow-[0_0_0_1px_rgba(20,37,43,0.35)]' as const;

/**
 * Popover above a chest: reward label (+ item icon) or "N more".
 * Anchored on the markers layer (not the chest button) so edge pins stay inside the track.
 * Visible via peer-hover / peer-focus-visible / peer-aria-expanded from the chest button.
 */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_CLASS_NAME =
  'pointer-events-none absolute bottom-full z-20 mb-1 flex w-max max-w-[min(9.5rem,100%)] items-center gap-1 rounded border border-poster-teal/30 bg-parchment px-1.5 py-0.5 text-left text-[9px] font-bold uppercase leading-tight tracking-wide text-ink-soft opacity-0 shadow-[0_1px_0_0_rgba(20,37,43,0.25)] transition-opacity peer-hover/milestone:opacity-100 peer-focus-visible/milestone:opacity-100 peer-aria-expanded/milestone:opacity-100' as const;

/** Center popover on mid-track chests (left set inline to percent). */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ALIGN_CENTER_CLASS_NAME =
  '-translate-x-1/2' as const;

/** Flush to track start — early chests never spill past panel edge. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ALIGN_START_CLASS_NAME =
  'left-0 translate-x-0' as const;

/** Flush to track end — late chests stay inside. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ALIGN_END_CLASS_NAME =
  'right-0 left-auto translate-x-0' as const;

/** Tiny recipe/item glyph beside popover copy. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ICON_CLASS_NAME =
  'size-3.5 shrink-0' as const;

/** Wrapped label text beside the reward icon. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_LABEL_CLASS_NAME =
  'min-w-0 flex-1' as const;
