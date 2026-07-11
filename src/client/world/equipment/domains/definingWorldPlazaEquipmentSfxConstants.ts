import type { DefiningWorldPlazaAvatarToolActionId } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';

/**
 * FilmCow Hits & Crunches equipment impact SFX for harvest tool actions.
 *
 * Assets live under `public/harvest/sfx/filmcow-equipment/`.
 *
 * @module components/world/equipment/domains/definingWorldPlazaEquipmentSfxConstants
 */

/** Public URL prefix for shipped FilmCow equipment hit clips. */
export const DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_ASSET_BASE_URL =
  '/harvest/sfx/filmcow-equipment' as const;

/** Tool actions that play FilmCow impact clips during timed harvest channels. */
export type DefiningWorldPlazaEquipmentSfxToolActionId = Extract<
  DefiningWorldPlazaAvatarToolActionId,
  'tree-chop' | 'rock-mine' | 'pebble-pick'
>;

function buildingEquipmentSfxClipIds(
  stem: string,
  count: number
): readonly `${string}_${string}`[] {
  return Array.from({ length: count }, (_unused, index) => {
    const suffix = String(index + 1).padStart(2, '0');
    return `${stem}_${suffix}` as const;
  });
}

export const DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_WOOD_HIT_CLIP_IDS =
  buildingEquipmentSfxClipIds('wood_hit', 10);

export const DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_FRONDS_HIT_CLIP_IDS =
  buildingEquipmentSfxClipIds('fronds_hit', 5);

export const DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_BRICK_HIT_CLIP_IDS =
  buildingEquipmentSfxClipIds('brick_hit', 10);

export const DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_METAL_HIT_CLIP_IDS =
  buildingEquipmentSfxClipIds('metal_hit', 7);

export const DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_GROUND_THUMP_CLIP_IDS =
  buildingEquipmentSfxClipIds('ground_thump', 5);

export const DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_TINY_HIT_CLIP_IDS =
  buildingEquipmentSfxClipIds('tiny_hit', 8);

/** Stable ids for every bundled FilmCow equipment clip. */
export type DefiningWorldPlazaEquipmentSfxClipId =
  | (typeof DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_WOOD_HIT_CLIP_IDS)[number]
  | (typeof DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_FRONDS_HIT_CLIP_IDS)[number]
  | (typeof DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_BRICK_HIT_CLIP_IDS)[number]
  | (typeof DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_METAL_HIT_CLIP_IDS)[number]
  | (typeof DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_GROUND_THUMP_CLIP_IDS)[number]
  | (typeof DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_TINY_HIT_CLIP_IDS)[number];

/** Clip pool rotated per timed interaction milestone for each harvest tool action. */
export const DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_CLIP_POOL_BY_TOOL_ACTION: Record<
  DefiningWorldPlazaEquipmentSfxToolActionId,
  readonly DefiningWorldPlazaEquipmentSfxClipId[]
> = {
  'tree-chop': [
    ...DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_WOOD_HIT_CLIP_IDS,
    ...DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_FRONDS_HIT_CLIP_IDS,
  ],
  'rock-mine': [
    ...DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_BRICK_HIT_CLIP_IDS,
    ...DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_METAL_HIT_CLIP_IDS,
    ...DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_GROUND_THUMP_CLIP_IDS,
  ],
  'pebble-pick': [
    ...DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_TINY_HIT_CLIP_IDS,
    ...DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_GROUND_THUMP_CLIP_IDS,
  ],
};

/** Base impact volume before the SFX volume slider is applied. */
export const DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_TARGET_VOLUME_BY_TOOL_ACTION: Record<
  DefiningWorldPlazaEquipmentSfxToolActionId,
  number
> = {
  'tree-chop': 0.52,
  'rock-mine': 0.58,
  'pebble-pick': 0.38,
};

/** Extra gain on the final swing of a harvest channel. */
export const DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_FINAL_MILESTONE_VOLUME_MULTIPLIER = 1.12;
