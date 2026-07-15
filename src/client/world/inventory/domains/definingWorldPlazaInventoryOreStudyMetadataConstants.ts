/**
 * Instance metadata marking an ore stack as already Studied for Lapidary.
 * Studied and unstudied ore keep the same item type but do not stack together.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryOreStudyMetadataConstants
 */

/** Inventory / ground-item metadata flag for a studied ore specimen stack. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ORE_STUDIED_METADATA_KEY =
  'studiedOre' as const;
