/**
 * SFX volume storage and mixer labels for plaza audio.
 *
 * @module components/world/domains/definingWorldPlazaSfxVolumeConstants
 */

/** localStorage key for the SFX volume preference (0–1). */
export const DEFINING_WORLD_PLAZA_SFX_VOLUME_STORAGE_KEY =
  'world-plaza-sfx-volume' as const;

/** Default SFX volume when no saved preference exists. */
export const DEFINING_WORLD_PLAZA_SFX_VOLUME_DEFAULT = 1 as const;

/** Label for the SFX volume slider. */
export const LABELING_WORLD_PLAZA_SFX_VOLUME_SLIDER = 'SFX volume' as const;

/** SFX volume range input styling (matches music slider). */
export const STYLING_WORLD_PLAZA_SFX_VOLUME_MIXER_SLIDER_CLASS_NAME =
  'h-1.5 w-full cursor-pointer appearance-none rounded-full bg-poster-teal/20 accent-poster-gold max-md:h-3' as const;
