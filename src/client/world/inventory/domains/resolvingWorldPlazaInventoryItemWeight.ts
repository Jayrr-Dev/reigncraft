/**
 * Resolves carry weight for a plaza inventory item type.
 *
 * @module components/world/inventory/domains/resolvingWorldPlazaInventoryItemWeight
 */

import { computingWorldPlazaMeatItemWeightFromSpeciesMassKg } from '@/components/world/inventory/domains/computingWorldPlazaMeatItemWeightFromSpeciesMassKg';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_BY_TYPE_ID,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_DEFAULT,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemWeightConstants';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';
import {
  resolvingWildlifeSpeciesDefinition,
  type DefiningWildlifeSpeciesId,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

/**
 * Resolves unitless carry weight for one item type id.
 *
 * Explicit registry rows win. Wildlife meat falls back to species mass.
 * Unknown types use the default weight.
 */
export function resolvingWorldPlazaInventoryItemWeight(
  itemTypeId: string
): number {
  const explicitWeight =
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_BY_TYPE_ID[itemTypeId];

  if (explicitWeight !== undefined) {
    return explicitWeight;
  }

  const definition = resolvingWorldPlazaInventoryItemTypeDefinition(itemTypeId);
  const wildlifeSpeciesId = definition?.food?.wildlifeSpeciesId;

  if (wildlifeSpeciesId) {
    const species = resolvingWildlifeSpeciesDefinition(
      wildlifeSpeciesId as DefiningWildlifeSpeciesId
    );

    if (species) {
      return computingWorldPlazaMeatItemWeightFromSpeciesMassKg(species.massKg);
    }
  }

  return DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_DEFAULT;
}
