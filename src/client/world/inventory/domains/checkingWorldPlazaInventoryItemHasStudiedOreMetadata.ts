/**
 * Reads the legacy studied-ore flag from inventory item metadata.
 *
 * @module components/world/inventory/domains/checkingWorldPlazaInventoryItemHasStudiedOreMetadata
 */

import { DEFINING_WORLD_PLAZA_INVENTORY_ORE_STUDIED_METADATA_KEY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryOreStudyMetadataConstants';

/** True when this ore stack is a legacy studied pile (kept, not re-studyable). */
export function checkingWorldPlazaInventoryItemHasStudiedOreMetadata(
  metadata: Readonly<Record<string, unknown>> | undefined
): boolean {
  return (
    metadata?.[DEFINING_WORLD_PLAZA_INVENTORY_ORE_STUDIED_METADATA_KEY] === true
  );
}
