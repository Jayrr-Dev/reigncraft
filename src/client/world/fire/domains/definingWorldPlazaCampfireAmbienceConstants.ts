/**
 * Looping campfire ambience from the Butterfly Looped Ambience Sounds pack.
 *
 * Assets live under `public/fire/sfx/campfire/`.
 *
 * @module components/world/fire/domains/definingWorldPlazaCampfireAmbienceConstants
 */

/** Public URL prefix for shipped campfire ambience clips. */
export const DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_ASSET_BASE_URL =
  '/fire/sfx/campfire' as const;

/** Stable id for the lit campfire loop clip. */
export type DefiningWorldPlazaCampfireAmbienceClipId = 'bonfire';

/** One shipped campfire ambience clip entry. */
export type DefiningWorldPlazaCampfireAmbienceClipDefinition = {
  readonly id: DefiningWorldPlazaCampfireAmbienceClipId;
  readonly fileName: string;
};

/** Campfire ambience clips preloaded for proximity playback. */
export const DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_CLIP_CATALOG: Record<
  DefiningWorldPlazaCampfireAmbienceClipId,
  DefiningWorldPlazaCampfireAmbienceClipDefinition
> = {
  bonfire: { id: 'bonfire', fileName: 'bonfire.ogg' },
};

/** Base loop volume before distance falloff and master SFX volume. */
export const DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_TARGET_VOLUME = 0.42;

/** Grid distance where campfire ambience is inaudible. */
export const DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_MAX_AUDIBLE_DISTANCE_GRID = 14;

/** Grid distance where campfire ambience plays at full target volume. */
export const DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_FULL_VOLUME_DISTANCE_GRID = 2;

/** Player position vs fire-cell poll interval (ms). */
export const DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_POLL_INTERVAL_MS = 150;
