/**
 * Timed Study interaction on felled tree stumps for the herbarium.
 *
 * @module components/world/harvest/domains/definingWorldPlazaTreeStumpStudyConstants
 */

/** Chebyshev grid reach for starting / continuing a stump study. */
export const DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_PLAYER_RANGE_GRID = 2;

/** Study channel duration for one stump (ms). */
export const DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_DURATION_MS = 4_000;

/** Study points awarded for completing one stump Study. */
export const DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_POINTS = 1;

/** Progress ring icon while studying a stump. */
export const DEFINING_WORLD_PLAZA_TREE_STUMP_STUDY_PROGRESS_ICON =
  'mdi:book-open-page-variant' as const;

/** Floating action label on a selected stump. */
export const LABELING_WORLD_PLAZA_TREE_STUMP_STUDY_ACTION = 'Study' as const;

/** localStorage key prefix for per-owner studied stump tiles. */
export const DEFINING_WORLD_PLAZA_STUDIED_TREE_STUMPS_LOCAL_STORAGE_KEY_PREFIX =
  'world-plaza-studied-tree-stumps' as const;
