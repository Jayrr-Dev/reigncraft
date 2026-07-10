/**
 * Tuning for avatar texture warm-up during world boot.
 *
 * Boot loads only the currently selected skin (core locomotion motions).
 * Other skins and GirlSample combat strips load lazily on first need so
 * mobile tabs do not OOM during the avatar-sprites loading step.
 *
 * @module components/world/domains/definingWorldPlazaAvatarBootTexturePreloadConstants
 */

/** How many avatar texture load tasks run at once during boot. */
export const DEFINING_WORLD_PLAZA_AVATAR_BOOT_PRELOAD_CONCURRENCY = 3;
