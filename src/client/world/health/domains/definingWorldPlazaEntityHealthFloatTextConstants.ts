/** How long a non-damage combat float stays on screen (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_LIFETIME_MS = 1000;

/** Damage floats linger slightly longer than heals (before |σ| scaling). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_TEXT_LIFETIME_MS = 1200;

/** Max simultaneous floats above the local player. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_MAX_COUNT = 8;

/** Vertical gap between stacked floats (world-local px). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_STACK_GAP_PX = 22;

/** Offset above the health bar anchor (world-local px). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_OFFSET_ABOVE_BAR_PX = 8;

/** Minimum amount worth showing on a float. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_MIN_AMOUNT = 0.5;

/** Cooldown between repeated blocked floats (ms). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_BLOCKED_COOLDOWN_MS = 600;
