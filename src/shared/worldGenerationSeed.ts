/**
 * Session-scoped world generation seed offset for procedural plaza maps.
 *
 * Default 0 keeps the legacy fixed layout for older saves and shared online rooms.
 *
 * @module shared/worldGenerationSeed
 */

/** Active world generation seed offset (0 = legacy fixed map). */
let activeWorldGenerationSeed = 0;

/**
 * Returns the active world generation seed offset.
 */
export function gettingWorldGenerationSeed(): number {
  return activeWorldGenerationSeed;
}

/**
 * Sets the active world generation seed offset used by noise and placement hashes.
 *
 * @param worldSeed - Seed offset; truncated to a signed 32-bit int.
 */
export function settingWorldGenerationSeed(worldSeed: number): void {
  activeWorldGenerationSeed = worldSeed | 0;
}

/**
 * Mints a non-zero world generation seed for a new single-player save.
 */
export function mintingWorldGenerationSeed(): number {
  return 1 + Math.floor(Math.random() * 2_147_483_646);
}
