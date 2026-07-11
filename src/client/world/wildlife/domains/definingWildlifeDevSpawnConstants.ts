/**
 * Dev-only wildlife spawn tuning.
 *
 * @module components/world/wildlife/domains/definingWildlifeDevSpawnConstants
 */

/** Grid radius around the player where dev chickens appear. */
export const DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SPAWN_RADIUS_GRID = 2.5;

/** Default count for the single-chicken dev spawn button. */
export const DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SINGLE_SPAWN_COUNT = 1;

/** Swarm size for the cucco-style dev spawn button. */
export const DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SWARM_SPAWN_COUNT = 5;

/** Species id for dev grey wolf spawns. */
export const DEFINING_WILDLIFE_GREY_WOLF_SPECIES_ID = 'grey-wolf' as const;

/** Minimum grid distance from the player for a random dev wolf spawn. */
export const DEFINING_WILDLIFE_DEV_GREY_WOLF_SPAWN_RADIUS_MIN_GRID = 4;

/** Maximum grid distance from the player for a random dev wolf spawn. */
export const DEFINING_WILDLIFE_DEV_GREY_WOLF_SPAWN_RADIUS_MAX_GRID = 14;

/** Salt for seeded random wolf placement around the player. */
export const DEFINING_WILDLIFE_DEV_GREY_WOLF_RANDOM_PLACEMENT_SALT = 0x7a3f;

/** Grid offset in front of the player for catalog species spawns. */
export const DEFINING_WILDLIFE_DEV_SPECIES_SPAWN_OFFSET_GRID = 2;

/** Salt for seeded placement jitter on catalog species spawns. */
export const DEFINING_WILDLIFE_DEV_SPECIES_SPAWN_PLACEMENT_SALT = 0x51c3;

/** Species catalog columns in the wildlife spawner grid. */
export const DEFINING_WILDLIFE_DEV_SPAWN_SPECIES_GRID_COLUMN_COUNT = 3 as const;

/** Compact spawn button chrome for the species grid. */
export const STYLING_WILDLIFE_DEV_SPAWN_SPECIES_BUTTON_CLASS_NAME =
  'pointer-events-auto flex min-h-7 min-w-0 items-center truncate rounded-md border border-white/20 bg-black/50 px-1.5 py-1 text-left text-[9px] font-medium leading-tight text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70' as const;

/** Species catalog grid shell (scrolls with the parent tab; no nested scrollbar). */
export const STYLING_WILDLIFE_DEV_SPAWN_SPECIES_GRID_SHELL_CLASS_NAME =
  'grid gap-1 rounded border border-white/10 bg-black/35 p-1' as const;
