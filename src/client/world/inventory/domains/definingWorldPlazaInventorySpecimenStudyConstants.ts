/**
 * Timed Study channel for inventory specimens (flowers, clovers, ores, fish).
 *
 * Duration rolls between instant and one second so stacks stay clickable
 * without feeling like corpse Study.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventorySpecimenStudyConstants
 */

/** Shortest specimen Study channel (near-instant), ms. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_DURATION_MIN_MS = 0;

/** Longest specimen Study channel, ms. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_DURATION_MAX_MS = 1_000;

/** Stable target key while the local player studies a hotbar specimen. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_PROGRESS_TARGET_KEY =
  'local-player-specimen-study' as const;

/** Progress ring icon while studying an inventory specimen. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_PROGRESS_ICON =
  'mdi:book-open-page-variant' as const;
