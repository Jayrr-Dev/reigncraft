/**
 * Placeholder study-milestone reward markers along codex progress tracks.
 *
 * @module components/home/domains/definingPlazaCodexStudyMilestoneRewardConstants
 */

import type { PlazaCodexStudyTierId } from '@/components/home/domains/definingPlazaCodexStudyTier';

/**
 * Study tiers that will grant a chest reward (placeholder UI until loot wires in).
 * Skips awareness (0) and familiarity (1) — too early for a reward beat.
 */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_TIERS: readonly PlazaCodexStudyTierId[] =
  [
    'understanding',
    'application',
    'proficiency',
    'expertise',
    'mastery',
  ] as const;

/** Iconify id for locked/unlocked milestone chest placeholders. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_CHEST_ICON =
  'mdi:treasure-chest' as const;

/** Outer wrap: track + overlapping chest nodes. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_SHELL_CLASS_NAME =
  'relative mt-1.5 h-4' as const;

/** Thin fill track centered in the shell. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_TRACK_CLASS_NAME =
  'absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full border border-poster-teal/25 bg-poster-teal-deep/15' as const;

/** Gold fill inside the milestone track. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_FILL_CLASS_NAME =
  'h-full rounded-full bg-[linear-gradient(90deg,#c98a2d_0%,#d9a441_100%)] transition-[width] duration-500' as const;

/** Absolute layer holding chest circles. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_MARKERS_CLASS_NAME =
  'pointer-events-none absolute inset-0' as const;

/** Locked (not yet reached) chest circle. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_LOCKED_CLASS_NAME =
  'absolute top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-poster-teal/40 bg-parchment/90 text-ink-soft/55 shadow-[0_1px_0_0_rgba(20,37,43,0.35)]' as const;

/** Reached milestone chest circle (reward pending / claimed later). */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_REACHED_CLASS_NAME =
  'absolute top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-poster-gold/70 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-poster-gold shadow-[0_1px_0_0_#14252b]' as const;

/** Chest icon size inside the circle. */
export const DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_ICON_CLASS_NAME =
  'size-2.5 shrink-0' as const;
