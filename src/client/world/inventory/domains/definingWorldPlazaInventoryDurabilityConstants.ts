/** Metadata key for remaining durability on a single inventory item instance. */
export const DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_METADATA_KEY =
  'durability' as const;

/** Default break chance per use while durability is already at zero. */
export const DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_BREAK_CHANCE_AT_ZERO = 0.15;

/** Inclusive min durability lost per successful tool use (default roll). */
export const DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_WEAR_PER_USE_MIN = 1;

/** Inclusive max durability lost per successful tool use (default roll). */
export const DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_WEAR_PER_USE_MAX = 3;

/** Wood axe max durability before it can start breaking at zero. */
export const DEFINING_WORLD_PLAZA_INVENTORY_AXE_MAX_DURABILITY = 66;

/** Build tool max durability before it can start breaking at zero. */
export const DEFINING_WORLD_PLAZA_INVENTORY_BUILD_TOOL_MAX_DURABILITY = 106;
