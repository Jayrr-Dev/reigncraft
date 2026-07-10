/** Metadata key listing enchantment type ids on one item instance. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENTS_METADATA_KEY =
  'enchantments' as const;

/** Metadata key for per-enchantment runtime state (cooldowns, armed flags). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STATE_METADATA_KEY =
  'enchantmentState' as const;

/** Activation kind: always-on vs player-armed. */
export type DefiningWorldPlazaInventoryEnchantmentKind = 'passive' | 'active';

/**
 * Player-facing family for item mods.
 * Enhancements = raw physical / concrete capability.
 * Enchantments = status, buffs, debuffs, damage types.
 */
export type DefiningWorldPlazaInventoryEnchantmentFamily =
  | 'enhancement'
  | 'enchantment';
