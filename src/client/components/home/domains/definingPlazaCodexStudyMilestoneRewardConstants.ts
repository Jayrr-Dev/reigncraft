/**
 * Overall collection milestone chest positions on codex panel progress bars.
 * Applies to Sighted/Logged (discovered) and Studied meters — not per-entry detail.
 * Concrete grants live in `definingPlazaCodexMilestoneRewardRegistry`.
 *
 * @module components/home/domains/definingPlazaCodexStudyMilestoneRewardConstants
 */

/**
 * Five chests on Sighted/Logged (discovered) dual-progress meters.
 */
export const DEFINING_PLAZA_CODEX_OVERALL_MILESTONE_REWARD_PERCENTS = [
  5, 20, 50, 75, 100,
] as const;

/**
 * Ten Studied chests, denser early then stretching toward mastery.
 * Gaps grow ~2,3,4,5,6,8,10,13,18,31.
 */
export const DEFINING_PLAZA_CODEX_STUDIED_MILESTONE_REWARD_PERCENTS = [
  2, 5, 9, 14, 20, 28, 38, 51, 69, 100,
] as const;

/**
 * Four chests on Biomes Discovered (and other default discovery-only meters).
 */
export const DEFINING_PLAZA_CODEX_DISCOVERY_MILESTONE_REWARD_PERCENTS = [
  25, 50, 75, 100,
] as const;

/**
 * Eight equal slices on Recipes Attached (~12.5% steps, rounded).
 */
export const DEFINING_PLAZA_CODEX_RECIPES_MILESTONE_REWARD_PERCENTS = [
  13, 25, 38, 50, 63, 75, 88, 100,
] as const;

/** Iconify id for locked / unclaimed milestone chest placeholders. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_CHEST_ICON =
  'mdi:treasure-chest' as const;

/** Iconify id for claimed (unlocked) milestone markers. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_CLAIMED_ICON =
  'mdi:check-bold' as const;

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
  'absolute top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-poster-teal/40 bg-parchment/90 text-ink-soft/55 shadow-[0_1px_0_0_rgba(20,37,43,0.35)] outline-none before:absolute before:-inset-2 before:content-[""]' as const;

/** Reached milestone chest circle (reward pending). */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_REACHED_CLASS_NAME =
  'absolute top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-poster-gold/70 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-poster-gold shadow-[0_1px_0_0_#14252b] outline-none before:absolute before:-inset-2 before:content-[""]' as const;

/** Claimed milestone circle: gold check instead of chest. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_CLAIMED_CLASS_NAME =
  'absolute top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-poster-gold/70 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-poster-gold shadow-[0_1px_0_0_#14252b] outline-none before:absolute before:-inset-2 before:content-[""]' as const;

/** Chest icon size inside the circle. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_ICON_CLASS_NAME =
  'size-2.5 shrink-0' as const;

/** Orange corner pip on a reached chest (reward ready). */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NOTIFICATION_BADGE_CLASS_NAME =
  'pointer-events-none absolute -right-0.5 -top-0.5 z-10 size-1.5 rounded-full border border-parchment bg-poster-orange shadow-[0_0_0_1px_rgba(20,37,43,0.35)]' as const;

/**
 * Click popover above a chest: reward label (+ item icon) or "N more".
 * Anchored at the chest percent; `usingWorldPlazaAnchoredPopoverViewportShiftX` keeps it on-screen.
 */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_CLASS_NAME =
  'absolute bottom-full z-20 mb-1 flex w-max max-w-[min(12rem,calc(100vw-2rem))] items-start gap-1 rounded border border-poster-teal/30 bg-parchment px-1.5 py-0.5 text-left text-[9px] font-bold uppercase leading-snug tracking-wide text-ink-soft whitespace-normal break-words shadow-[0_1px_0_0_rgba(20,37,43,0.25)]' as const;

/** Tiny recipe/item glyph beside popover copy. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ICON_CLASS_NAME =
  'mt-0.5 size-3.5 shrink-0' as const;

/** Wrapped label text beside the reward icon. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_LABEL_CLASS_NAME =
  'min-w-0 flex-1 whitespace-normal break-words' as const;
