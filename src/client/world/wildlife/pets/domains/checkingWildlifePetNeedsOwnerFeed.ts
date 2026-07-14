/**
 * True when a bonded pet is hungry enough to seek the owner and accept Feed.
 *
 * @module components/world/wildlife/pets/domains/checkingWildlifePetNeedsOwnerFeed
 */

import { DEFINING_WILDLIFE_PET_FEED_HUNGER_RATIO_THRESHOLD } from '@/components/world/wildlife/pets/domains/definingWildlifePetCompanionCareActionConstants';

/**
 * Pet hunger below the feed threshold (default 75%) means the animal decides
 * to trail the owner for food and the player may Feed it.
 */
export function checkingWildlifePetNeedsOwnerFeed(
  hungerRatio: number
): boolean {
  return hungerRatio < DEFINING_WILDLIFE_PET_FEED_HUNGER_RATIO_THRESHOLD;
}
