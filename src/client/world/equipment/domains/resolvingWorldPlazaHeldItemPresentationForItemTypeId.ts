/**
 * Maps inventory item types to held-item overlay presentation.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaHeldItemPresentationForItemTypeId
 */

import {
  DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_REGISTRY,
  type DefiningWorldPlazaHeldItemPresentation,
} from '@/components/world/equipment/domains/definingWorldPlazaHeldItemPresentationRegistry';
import type {
  DefiningWorldPlazaHeldItemTier,
  DefiningWorldPlazaHeldItemVisualId,
} from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';

/**
 * Returns held overlay presentation when the item type declares a visual id.
 */
export function resolvingWorldPlazaHeldItemPresentationForItemTypeId(
  itemTypeId: string
): DefiningWorldPlazaHeldItemPresentation | null {
  const definition = resolvingWorldPlazaInventoryItemTypeDefinition(itemTypeId);
  const equipment = definition?.equipment;

  if (!equipment?.heldItemVisualId) {
    return null;
  }

  const tier: DefiningWorldPlazaHeldItemTier = equipment.heldItemTier ?? 'wood';
  const visualId: DefiningWorldPlazaHeldItemVisualId =
    equipment.heldItemVisualId;

  return {
    visualId,
    tier,
    entry: DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_REGISTRY[visualId],
  };
}
