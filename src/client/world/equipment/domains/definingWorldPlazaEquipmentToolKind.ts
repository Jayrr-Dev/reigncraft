/**
 * Equipment tool kinds for world plaza harvesting and building actions.
 *
 * @module components/world/equipment/domains/definingWorldPlazaEquipmentToolKind
 */

import type { DefiningWorldPlazaEquipmentEvModifier } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentEvModifier';
import type {
  DefiningWorldPlazaHeldItemTier,
  DefiningWorldPlazaHeldItemVisualId,
} from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';

/** Harvesting / building / combat tool categories checked by the equipment engine. */
export type DefiningWorldPlazaEquipmentToolKind =
  | 'axe'
  | 'pickaxe'
  | 'build'
  | 'ignite'
  | 'sword'
  | 'hoe'
  | 'scythe'
  | 'fishrod';

/** Capabilities granted by an inventory item type when equipped. */
export type DefiningWorldPlazaEquipmentItemCapabilities = {
  readonly toolKinds: readonly DefiningWorldPlazaEquipmentToolKind[];
  /** Multiplier applied to harvest channel durations (higher = faster). */
  readonly harvestSpeedMultiplier: number;
  readonly heldItemVisualId?: DefiningWorldPlazaHeldItemVisualId;
  readonly heldItemTier?: DefiningWorldPlazaHeldItemTier;
  /**
   * Legacy outgoing melee damage multiplier when this weapon is equipped.
   * Prefer {@link attackEvModifier}; still honored as multiplicative attack EV.
   */
  readonly meleeDamageMultiplier?: number;
  /** Additive or multiplicative modifier on player attack EV while equipped. */
  readonly attackEvModifier?: DefiningWorldPlazaEquipmentEvModifier;
  /** Additive or multiplicative modifier on player defense EV while equipped. */
  readonly defenseEvModifier?: DefiningWorldPlazaEquipmentEvModifier;
};
