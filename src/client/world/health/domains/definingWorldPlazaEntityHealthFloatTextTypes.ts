import type {
  DefiningWorldPlazaDamageOutcomeTier,
  DefiningWorldPlazaEntityDamageKind,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';

/** Visual category for a floating health combat number. */
export type DefiningWorldPlazaEntityHealthFloatTextKind =
  | 'damage'
  | 'damage_critical'
  | 'damage_true_strike'
  | 'damage_lethal'
  | 'damage_fatal'
  | 'damage_softened'
  | 'damage_roll_blocked'
  | 'damage_dodged'
  | 'heal'
  | 'heal_regen'
  | 'health_scale'
  | 'shield_gain'
  | 'shield_absorb'
  | 'blocked'
  | 'miss'
  | 'study'
  | 'loyalty'
  | 'item_gain'
  | 'fishing_catch_rarity';

/** One ephemeral combat float above the local player. */
export type DefiningWorldPlazaEntityHealthFloatText = {
  id: string;
  kind: DefiningWorldPlazaEntityHealthFloatTextKind;
  amount: number;
  damageKind: DefiningWorldPlazaEntityDamageKind | null;
  /** Inventory item type when {@link kind} is `item_gain` (craft refunds, etc.). */
  itemTypeId?: string | null;
  /** Catch rarity when {@link kind} is `fishing_catch_rarity`. */
  rarity?: DefiningWorldPlazaInventoryItemRarity | null;
  /** True when the fish escaped: red X + rarity name (no "Catch"). */
  escaped?: boolean | null;
  /** Outcome tier when heal/shield amounts were rolled statistically. */
  outcomeTier?: DefiningWorldPlazaDamageOutcomeTier | null;
  /** Standard-deviation distance from expected when the float came from a roll. */
  deviationScore?: number | null;
  createdAtMs: number;
  stackIndex: number;
};
