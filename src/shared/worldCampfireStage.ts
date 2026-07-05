/** Metadata key on placed campfire blocks for the extinguished visual stage. */
export const WORLD_CAMPFIRE_STAGE_METADATA_KEY = 'campfireStage' as const;

/** Persisted campfire stage when fuel has run out (lit is driven by fire cells). */
export const WORLD_CAMPFIRE_STAGE_EXTINGUISHED = 'extinguished' as const;

export type WorldCampfirePersistedStage =
  typeof WORLD_CAMPFIRE_STAGE_EXTINGUISHED;
