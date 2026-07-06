import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';

const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITION_BY_ID = new Map<
  string,
  DefiningWorldPlazaInventoryItemTypeDefinition
>(
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITIONS.map((definition) => [
    definition.typeId,
    definition,
  ])
);

/**
 * Resolves the full item definition for a type id, including gameplay behaviors.
 */
export function resolvingWorldPlazaInventoryItemTypeDefinition(
  typeId: string
): DefiningWorldPlazaInventoryItemTypeDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_DEFINITION_BY_ID.get(typeId) ??
    null
  );
}
