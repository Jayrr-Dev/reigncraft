import { computingWorldPlazaInGameDaysToRealMs } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

/** HUD buff shown while the four-leaf clover is held. */
export const DEFINING_WORLD_PLAZA_LUCKY_BUFF_ID = 'lucky-buff' as const;

/** Defender roll preset toggled with the lucky charm. */
export const DEFINING_WORLD_PLAZA_LUCKY_BUFF_DEFENDER_ID =
  'lucky-buff-defender' as const;

/** Attacker roll preset toggled with the lucky charm. */
export const DEFINING_WORLD_PLAZA_LUCKY_BUFF_ATTACKER_ID =
  'lucky-buff-attacker' as const;

/** Max charm durability for a fresh four-leaf clover. */
export const DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DURABILITY_MAX = 100;

/** Charm fades this many in-game days after being picked. */
export const DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DECAY_IN_GAME_DAYS = 1;

/** Real-ms lifetime for one full charm after pickup. */
export const DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DECAY_REAL_MS_AFTER_PICKUP =
  computingWorldPlazaInGameDaysToRealMs(
    DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DECAY_IN_GAME_DAYS
  );

/** Inventory metadata timestamp marking when the clover was picked. */
export const DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_PICKED_AT_MS_METADATA_KEY =
  'fourLeafCloverPickedAtMs' as const;

/** Disease contraction multiplier while lucky (50% less likely). */
export const DEFINING_WORLD_PLAZA_LUCKY_DISEASE_CONTRACTION_MULTIPLIER = 0.5;

/** Weight / vein boost for rare flowers, ores, and biome scouting. */
export const DEFINING_WORLD_PLAZA_LUCKY_DISCOVERY_LUCK_MULTIPLIER = 1.5;

/** Chance boost for cooked well-fed buffs and flower eat-effect procs. */
export const DEFINING_WORLD_PLAZA_LUCKY_FOOD_BUFF_CHANCE_MULTIPLIER = 1.5;

/** Item type id that grants the lucky charm bundle while selected. */
export const DEFINING_WORLD_PLAZA_LUCKY_CHARM_ITEM_TYPE_ID =
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF;
