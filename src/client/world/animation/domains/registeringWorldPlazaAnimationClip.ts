import type { DefiningWorldPlazaAnimationClipDefinition } from '@/components/world/animation/domains/definingWorldPlazaAnimationTypes';

/**
 * Global registry of declarative animation clips.
 *
 * @module components/world/animation/domains/registeringWorldPlazaAnimationClip
 */

const animationClipRegistry = new Map<
  string,
  DefiningWorldPlazaAnimationClipDefinition
>();

/**
 * Registers or replaces one animation clip definition.
 *
 * @param clip - Clip metadata and frame resolver.
 */
export function registeringWorldPlazaAnimationClip(
  clip: DefiningWorldPlazaAnimationClipDefinition
): void {
  const previousClip = animationClipRegistry.get(clip.clipId);

  if (previousClip?.ownedTextures) {
    destroyingWorldPlazaAnimationClipOwnedTextures(previousClip);
  }

  animationClipRegistry.set(clip.clipId, clip);
}

/**
 * Returns a registered clip, or null when unknown.
 *
 * @param clipId - Clip identifier from a playback request.
 */
export function resolvingWorldPlazaAnimationClip(
  clipId: string
): DefiningWorldPlazaAnimationClipDefinition | null {
  return animationClipRegistry.get(clipId) ?? null;
}

/**
 * Lists every registered clip id (useful for dev tooling).
 */
export function listingWorldPlazaAnimationClipIds(): readonly string[] {
  return [...animationClipRegistry.keys()];
}

function destroyingWorldPlazaAnimationClipOwnedTextures(
  clip: DefiningWorldPlazaAnimationClipDefinition
): void {
  for (const texture of clip.ownedTextures ?? []) {
    if (!texture.destroyed) {
      texture.destroy(false);
    }
  }
}

/**
 * Removes every clip whose id starts with `clipIdPrefix` and destroys owned
 * frame textures. Used by wildlife texture LRU eviction.
 */
export function removingWorldPlazaAnimationClipsByPrefix(
  clipIdPrefix: string
): number {
  let removedCount = 0;

  for (const clipId of [...animationClipRegistry.keys()]) {
    if (!clipId.startsWith(clipIdPrefix)) {
      continue;
    }

    const clip = animationClipRegistry.get(clipId);

    if (clip) {
      destroyingWorldPlazaAnimationClipOwnedTextures(clip);
    }

    animationClipRegistry.delete(clipId);
    removedCount += 1;
  }

  return removedCount;
}

/**
 * Clears the registry (tests only).
 */
export function clearingWorldPlazaAnimationClipRegistryForTests(): void {
  for (const clip of animationClipRegistry.values()) {
    destroyingWorldPlazaAnimationClipOwnedTextures(clip);
  }

  animationClipRegistry.clear();
}
