/**
 * Ambience volume storage and mixer labels for plaza environmental loops.
 *
 * @module components/world/domains/definingWorldPlazaAmbienceVolumeConstants
 */

/** localStorage key for the ambience volume preference (0–1). */
export const DEFINING_WORLD_PLAZA_AMBIENCE_VOLUME_STORAGE_KEY =
  'world-plaza-ambience-volume' as const;

/**
 * Master kill switch for biome, flowing-water, campfire, and lava ambience.
 * When false, loops stay silent regardless of slider or localStorage.
 */
export const DEFINING_WORLD_PLAZA_AMBIENCE_ENABLED = false as const;

/** Default ambience volume when no saved preference exists. */
export const DEFINING_WORLD_PLAZA_AMBIENCE_VOLUME_DEFAULT = 1 as const;

/** Label for the ambience volume slider. */
export const LABELING_WORLD_PLAZA_AMBIENCE_VOLUME_SLIDER =
  'Ambience volume' as const;

/** Ambience volume range input styling (matches music and SFX sliders). */
export const STYLING_WORLD_PLAZA_AMBIENCE_VOLUME_MIXER_SLIDER_CLASS_NAME =
  'h-1.5 w-full cursor-pointer appearance-none rounded-full bg-poster-teal/20 accent-poster-gold' as const;
