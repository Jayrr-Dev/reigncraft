/**
 * Looping fire crackle ambience near procedural and ruin lava tiles.
 *
 * Reuses the shipped campfire bonfire loop under `public/sfx/campfire/`.
 *
 * @module components/world/fire/domains/definingWorldPlazaLavaAmbienceConstants
 */

/** Public URL prefix for the lava proximity loop clip. */
export const DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_ASSET_BASE_URL =
  '/sfx/campfire' as const;

/** Stable id for the lava proximity fire crackle loop. */
export type DefiningWorldPlazaLavaAmbienceClipId = 'crackle';

/** One shipped lava ambience clip entry. */
export type DefiningWorldPlazaLavaAmbienceClipDefinition = {
  readonly id: DefiningWorldPlazaLavaAmbienceClipId;
  readonly fileName: string;
};

/** Lava ambience clips preloaded for proximity playback. */
export const DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_CLIP_CATALOG: Record<
  DefiningWorldPlazaLavaAmbienceClipId,
  DefiningWorldPlazaLavaAmbienceClipDefinition
> = {
  crackle: { id: 'crackle', fileName: 'bonfire.wav' },
};

/** Base loop volume before distance falloff and master ambience volume. */
export const DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_TARGET_VOLUME = 0.36;

/** Tile scan radius when searching for nearby lava pools. */
export const DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SCAN_RADIUS_TILES = 12;

/** Grid distance where lava fire ambience is inaudible. */
export const DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_MAX_AUDIBLE_DISTANCE_GRID = 12;

/** Grid distance where lava fire ambience plays at full target volume. */
export const DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_FULL_VOLUME_DISTANCE_GRID = 1.5;

/** Player position vs lava tile poll interval (ms). */
export const DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_POLL_INTERVAL_MS = 150;
