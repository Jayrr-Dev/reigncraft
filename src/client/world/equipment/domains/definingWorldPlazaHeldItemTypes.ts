/**
 * Held-item visual ids and material tiers for 8-direction tool overlays.
 *
 * @module components/world/equipment/domains/definingWorldPlazaHeldItemTypes
 */

/**
 * When false, equipped tools do not draw the floating 8-direction overlay on
 * the avatar (local or remote). Inventory glyphs and tool gameplay stay on.
 * Flip to true to restore carry/swing sprites.
 */
export const DEFINING_WORLD_PLAZA_HELD_ITEM_OVERLAY_ENABLED = false;

/** Sprite sheet category under `public/harvest/sprites/`. */
export const DEFINING_WORLD_PLAZA_HELD_ITEM_VISUAL_IDS = [
  'sword',
  'axe',
  'hoe',
  'scythe',
  'fishrod',
] as const;

export type DefiningWorldPlazaHeldItemVisualId =
  (typeof DEFINING_WORLD_PLAZA_HELD_ITEM_VISUAL_IDS)[number];

/** Material tier maps to sheet column index 0–3. */
export const DEFINING_WORLD_PLAZA_HELD_ITEM_TIERS = [
  'wood',
  'iron',
  'steel',
  'gold',
] as const;

export type DefiningWorldPlazaHeldItemTier =
  (typeof DEFINING_WORLD_PLAZA_HELD_ITEM_TIERS)[number];

/** Column index per tier on the 4-column tool sheets. */
export const DEFINING_WORLD_PLAZA_HELD_ITEM_TIER_COLUMN_INDEX: Record<
  DefiningWorldPlazaHeldItemTier,
  number
> = {
  wood: 0,
  iron: 1,
  steel: 2,
  gold: 3,
};
