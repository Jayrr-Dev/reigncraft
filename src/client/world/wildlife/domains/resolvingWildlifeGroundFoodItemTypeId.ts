/**
 * Resolves the inventory (or synthetic flora) item type for a forage target id.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeGroundFoodItemTypeId
 */

import { resolvingWorldPlazaFlowerSpeciesAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFlowerSpeciesAtTileIndex';
import { resolvingWorldPlazaFlowerItemTypeIdFromSpeciesId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryFlowerSpriteSheetConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import {
  checkingWildlifeGroundFlowerItemId,
  parsingWildlifeGroundFlowerItemId,
} from '@/components/world/wildlife/domains/definingWildlifeGroundFlowerIdConstants';
import {
  checkingWildlifeGroundGrassItemId,
} from '@/components/world/wildlife/domains/definingWildlifeGroundGrassIdConstants';
import {
  checkingWildlifeGroundShrubItemId,
} from '@/components/world/wildlife/domains/definingWildlifeGroundShrubIdConstants';
import { DEFINING_WILDLIFE_GROUND_GRASS_FOOD_ITEM_TYPE_ID } from '@/components/world/wildlife/domains/definingWildlifeFavoriteFoodConstants';
import { listingWildlifeGroundFoodItems } from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';

/** Item type for one selected ground-food / flora forage id, or null if gone. */
export function resolvingWildlifeGroundFoodItemTypeId(
  groundFoodItemId: string,
  nowMs: number
): string | null {
  if (checkingWildlifeGroundShrubItemId(groundFoodItemId)) {
    return DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED;
  }

  if (checkingWildlifeGroundGrassItemId(groundFoodItemId)) {
    return DEFINING_WILDLIFE_GROUND_GRASS_FOOD_ITEM_TYPE_ID;
  }

  if (checkingWildlifeGroundFlowerItemId(groundFoodItemId)) {
    const tile = parsingWildlifeGroundFlowerItemId(groundFoodItemId);

    if (!tile) {
      return null;
    }

    const speciesId = resolvingWorldPlazaFlowerSpeciesAtTileIndex(
      tile.tileX,
      tile.tileY
    );

    return resolvingWorldPlazaFlowerItemTypeIdFromSpeciesId(speciesId);
  }

  const groundItem = listingWildlifeGroundFoodItems(nowMs).find(
    (entry) => entry.id === groundFoodItemId
  );

  return groundItem?.itemTypeId ?? null;
}
