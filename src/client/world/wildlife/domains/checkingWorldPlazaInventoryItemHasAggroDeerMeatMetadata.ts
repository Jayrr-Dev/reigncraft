/**
 * Reads the hidden aggro-deer meat tag from inventory item metadata.
 *
 * @module components/world/wildlife/domains/checkingWorldPlazaInventoryItemHasAggroDeerMeatMetadata
 */

import { DEFINING_WILDLIFE_AGGRO_DEER_MEAT_METADATA_KEY } from '@/components/world/wildlife/domains/definingWildlifeAggroDeerMeatConstants';

/** True when this stack came from a deer killed while hostile to the player. */
export function checkingWorldPlazaInventoryItemHasAggroDeerMeatMetadata(
  metadata: Readonly<Record<string, unknown>> | undefined
): boolean {
  return metadata?.[DEFINING_WILDLIFE_AGGRO_DEER_MEAT_METADATA_KEY] === true;
}
