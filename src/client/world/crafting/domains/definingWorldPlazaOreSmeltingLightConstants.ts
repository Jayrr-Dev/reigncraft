/**
 * Night light tuning for active bloomery / clay kiln / clay stove stations.
 *
 * @module components/world/crafting/domains/definingWorldPlazaOreSmeltingLightConstants
 */

import { DEFINING_WORLD_PLAZA_LIGHT_SOURCE_DEFAULT_TINT } from '@/components/world/lighting/domains/definingWorldPlazaLightSource';

/** Light-store owner key for ore-smelting station glows. */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_LIGHT_OWNER_KEY =
  'ore-smelting' as const;

/**
 * Glow footprint vs torch texture. Slightly larger than a spreading fire so a
 * 2x2 kiln / bloomery reads as one hearth at night.
 */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_LIGHT_RADIUS_SCALE = 1.55;

/** Source strength 0..1 while a station is actively smelting. */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_LIGHT_BRIGHTNESS = 0.85;

/** Warm hearth tint (same family as campfire default). */
export const DEFINING_WORLD_PLAZA_ORE_SMELTING_LIGHT_TINT =
  DEFINING_WORLD_PLAZA_LIGHT_SOURCE_DEFAULT_TINT;
