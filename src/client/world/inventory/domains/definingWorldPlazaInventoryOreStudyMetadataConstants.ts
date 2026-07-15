/**
 * Legacy metadata from when Study converted ore into a kept "studied" pile.
 * New Study consumes ore; this flag still blocks re-study and keeps old piles
 * from stacking with normal ore.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryOreStudyMetadataConstants
 */

/** Inventory / ground-item metadata flag for a legacy studied ore specimen stack. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ORE_STUDIED_METADATA_KEY =
  'studiedOre' as const;
