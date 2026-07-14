/**
 * Shared layout for wildlife HP / stamina bars and hunger circle above the sprite.
 *
 * @module components/world/wildlife/domains/definingWildlifeVitalsBarConstants
 */

/** Screen-space lift above the grid anchor (scaled by instance size). */
export const DEFINING_WILDLIFE_VITALS_BAR_LIFT_PX = 26;

/** Draw vitals just above the body in the depth sort stack. */
export const DEFINING_WILDLIFE_VITALS_BAR_Z_INDEX_OFFSET = 1;

/** HP track width in screen px. */
export const DEFINING_WILDLIFE_VITALS_BAR_WIDTH_PX = 24;

/** HP track height in screen px. */
export const DEFINING_WILDLIFE_VITALS_BAR_HEIGHT_PX = 3;

/** Stamina track height in screen px. */
export const DEFINING_WILDLIFE_VITALS_STAMINA_BAR_HEIGHT_PX = 2;

/** Gap between HP and stamina tracks. */
export const DEFINING_WILDLIFE_VITALS_BAR_GAP_PX = 0.5;

/** Outer radius of the wildlife hunger orb (bronze ring). */
export const DEFINING_WILDLIFE_HUNGER_CIRCLE_OUTER_RADIUS_PX = 7;

/** Inner fill disc radius (inside the bronze ring). */
export const DEFINING_WILDLIFE_HUNGER_CIRCLE_INNER_RADIUS_PX = 5.5;

/** Gap between hunger circle and HP/stamina bars. */
export const DEFINING_WILDLIFE_HUNGER_CIRCLE_GAP_FROM_BARS_PX = 2;

/** Bronze ring fill approximating the HUD hunger orb chrome. */
export const DEFINING_WILDLIFE_HUNGER_CIRCLE_RING_COLOR = 0xd4b06a;

/** Empty disc behind the brown hunger fill. */
export const DEFINING_WILDLIFE_HUNGER_CIRCLE_EMPTY_COLOR = 0x372d20;

/** Empty disc alpha (matches HUD empty track). */
export const DEFINING_WILDLIFE_HUNGER_CIRCLE_EMPTY_ALPHA = 0.72;

/** Arc segment steps for the bottom-fill chord path. */
export const DEFINING_WILDLIFE_HUNGER_CIRCLE_FILL_ARC_STEPS = 16;

/** Pixel-art drumstick edge length inside the pet hunger orb. */
export const DEFINING_WILDLIFE_HUNGER_CIRCLE_ICON_SIZE_PX = 9;
