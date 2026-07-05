/**
 * Registers built-in world animation clips (lava tiles, etc.).
 *
 * Call once during world boot after assets begin preloading.
 *
 * @module components/world/animation/domains/initializingWorldPlazaBuiltinAnimationClips
 */

let didInitializeBuiltinAnimationClips = false;

/**
 * Idempotently registers clips used by terrain overlays and effects.
 */
export function initializingWorldPlazaBuiltinAnimationClips(): void {
  if (didInitializeBuiltinAnimationClips) {
    return;
  }

  didInitializeBuiltinAnimationClips = true;
}

/**
 * Resets built-in clip registration (tests only).
 */
export function resettingWorldPlazaBuiltinAnimationClipsForTests(): void {
  didInitializeBuiltinAnimationClips = false;
}
