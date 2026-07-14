/**
 * Builds public URLs for chest prop sprites.
 *
 * @module components/world/chest/domains/formattingWorldPlazaChestSpriteUrl
 */

import type {
  DefiningWorldPlazaChestFacing,
  DefiningWorldPlazaChestSpriteVisualState,
  DefiningWorldPlazaChestState,
  DefiningWorldPlazaChestVariant,
} from '@/components/world/chest/domains/definingWorldPlazaChestTypes';

/** Locked chests reuse the closed lid art. */
export function resolvingWorldPlazaChestSpriteVisualState(
  state: DefiningWorldPlazaChestState
): DefiningWorldPlazaChestSpriteVisualState {
  return state === 'open' ? 'open' : 'closed';
}

/**
 * Returns `/environment/sprites/props/chest/chest-{variant}-{facing}-{closed|open}.webp`.
 */
export function formattingWorldPlazaChestSpriteUrl(
  variant: DefiningWorldPlazaChestVariant,
  facing: DefiningWorldPlazaChestFacing,
  state: DefiningWorldPlazaChestState
): string {
  const visual = resolvingWorldPlazaChestSpriteVisualState(state);

  return `/environment/sprites/props/chest/chest-${variant}-${facing}-${visual}.webp`;
}
