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

/**
 * Clears the registry (tests only).
 */
export function clearingWorldPlazaAnimationClipRegistryForTests(): void {
  animationClipRegistry.clear();
}
