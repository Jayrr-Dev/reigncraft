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

/** Charm fades over this many in-game days while held in the hotbar. */
export const DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DECAY_IN_GAME_DAYS = 1;

/** Real-ms wear budget for one full charm while held. */
export const DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DECAY_REAL_MS_WHILE_HELD =
  computingWorldPlazaInGameDaysToRealMs(
    DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DECAY_IN_GAME_DAYS
  );

/** Disease contraction multiplier while lucky (50% less likely). */
export const DEFINING_WORLD_PLAZA_LUCKY_DISEASE_CONTRACTION_MULTIPLIER = 0.5;

/** Weight / vein boost for rare flowers, ores, and biome scouting. */
export const DEFINING_WORLD_PLAZA_LUCKY_DISCOVERY_LUCK_MULTIPLIER = 1.5;

/** Item type id that grants the lucky charm bundle while selected. */
export const DEFINING_WORLD_PLAZA_LUCKY_CHARM_ITEM_TYPE_ID =
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_CLOVER_4_LEAF;
