/**
 * Shared Sighted/Studied (or Logged/Studied) dual progress chrome for codex panels.
 *
 * @module components/home/domains/definingPlazaCodexDualProgressConstants
 */

/** Outer parchment shell around the paired meters. */
export const DEFINING_PLAZA_CODEX_DUAL_PROGRESS_SHELL_CLASS_NAME =
  'shrink-0 rounded-md border border-poster-teal/25 bg-parchment/45 px-3 py-1.5' as const;

/** Horizontal row holding the two metric columns. */
export const DEFINING_PLAZA_CODEX_DUAL_PROGRESS_ROW_CLASS_NAME =
  'flex items-start gap-3' as const;

/** One metric column (label + bar). */
export const DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COLUMN_CLASS_NAME =
  'min-w-0 flex-1' as const;

/** Uppercase metric label row. */
export const DEFINING_PLAZA_CODEX_DUAL_PROGRESS_LABEL_CLASS_NAME =
  'flex items-center justify-between gap-1 text-[10px] font-bold uppercase tracking-wide text-ink-soft' as const;

/** Mono count after the metric label. */
export const DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COUNT_CLASS_NAME =
  'font-mono tabular-nums text-poster-teal-deep' as const;

/** Track behind the fill. */
export const DEFINING_PLAZA_CODEX_DUAL_PROGRESS_TRACK_CLASS_NAME =
  'mt-1 h-1.5 overflow-hidden rounded-full border border-poster-teal/25 bg-poster-teal-deep/15' as const;

/** Gold fill inside the track. */
export const DEFINING_PLAZA_CODEX_DUAL_PROGRESS_FILL_CLASS_NAME =
  'h-full rounded-full bg-[linear-gradient(90deg,#c98a2d_0%,#d9a441_100%)] transition-[width] duration-500' as const;
