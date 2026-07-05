/**
 * Equipment tool kinds for world plaza harvesting and building actions.
 *
 * @module components/world/equipment/domains/definingWorldPlazaEquipmentToolKind
 */

/** Harvesting / building tool categories checked by the equipment engine. */
export type DefiningWorldPlazaEquipmentToolKind = 'axe' | 'build' | 'ignite';

/** Capabilities granted by an inventory item type when equipped. */
export type DefiningWorldPlazaEquipmentItemCapabilities = {
  readonly toolKinds: readonly DefiningWorldPlazaEquipmentToolKind[];
  /** Multiplier applied to harvest channel durations (higher = faster). */
  readonly harvestSpeedMultiplier: number;
};
