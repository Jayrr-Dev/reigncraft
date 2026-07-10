import type { DefiningWorldPlazaEquipmentSfxToolActionId } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentSfxConstants';

const DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_ROTATION_INDEX_BY_TOOL_ACTION: Record<
  DefiningWorldPlazaEquipmentSfxToolActionId,
  number
> = {
  'tree-chop': 0,
  'rock-mine': 0,
  'pebble-pick': 0,
};

/**
 * Returns the current clip rotation offset for one harvest tool action.
 */
export function gettingWorldPlazaEquipmentSfxRotationIndex(
  toolActionId: DefiningWorldPlazaEquipmentSfxToolActionId
): number {
  return DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_ROTATION_INDEX_BY_TOOL_ACTION[
    toolActionId
  ];
}

/**
 * Advances the clip rotation after a full timed interaction completes.
 */
export function advancingWorldPlazaEquipmentSfxRotationIndex(
  toolActionId: DefiningWorldPlazaEquipmentSfxToolActionId
): void {
  DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_ROTATION_INDEX_BY_TOOL_ACTION[
    toolActionId
  ] += 1;
}

/** Resets rotation counters (used when the audio hook unmounts). */
export function resettingWorldPlazaEquipmentSfxRotationIndex(): void {
  DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_ROTATION_INDEX_BY_TOOL_ACTION[
    'tree-chop'
  ] = 0;
  DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_ROTATION_INDEX_BY_TOOL_ACTION[
    'rock-mine'
  ] = 0;
  DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_ROTATION_INDEX_BY_TOOL_ACTION[
    'pebble-pick'
  ] = 0;
}
