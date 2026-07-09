/**
 * Rebuilds held-item overlay presentation from synced network fields.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaHeldItemPresentationFromNetworkFields
 */

import {
  DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_REGISTRY,
  type DefiningWorldPlazaHeldItemPresentation,
} from '@/components/world/equipment/domains/definingWorldPlazaHeldItemPresentationRegistry';
import {
  DEFINING_WORLD_PLAZA_HELD_ITEM_TIERS,
  DEFINING_WORLD_PLAZA_HELD_ITEM_VISUAL_IDS,
  type DefiningWorldPlazaHeldItemTier,
  type DefiningWorldPlazaHeldItemVisualId,
} from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';

function checkingHeldItemVisualId(
  value: string
): value is DefiningWorldPlazaHeldItemVisualId {
  return (
    DEFINING_WORLD_PLAZA_HELD_ITEM_VISUAL_IDS as readonly string[]
  ).includes(value);
}

function checkingHeldItemTier(
  value: string
): value is DefiningWorldPlazaHeldItemTier {
  return (DEFINING_WORLD_PLAZA_HELD_ITEM_TIERS as readonly string[]).includes(
    value
  );
}

/**
 * Returns overlay presentation when both synced fields are valid; otherwise null.
 */
export function resolvingWorldPlazaHeldItemPresentationFromNetworkFields(
  heldItemVisualId: string | null | undefined,
  heldItemTier: string | null | undefined
): DefiningWorldPlazaHeldItemPresentation | null {
  if (!heldItemVisualId || !heldItemTier) {
    return null;
  }

  if (
    !checkingHeldItemVisualId(heldItemVisualId) ||
    !checkingHeldItemTier(heldItemTier)
  ) {
    return null;
  }

  return {
    visualId: heldItemVisualId,
    tier: heldItemTier,
    entry:
      DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_REGISTRY[heldItemVisualId],
  };
}
