import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
import {
  DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_FINAL_MILESTONE_VOLUME_MULTIPLIER,
  DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_TARGET_VOLUME_BY_TOOL_ACTION,
  type DefiningWorldPlazaEquipmentSfxToolActionId,
} from '@/components/world/equipment/domains/definingWorldPlazaEquipmentSfxConstants';
import type { DefiningWorldPlazaTimedInteractionMilestone } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';

/**
 * Resolves equipment impact volume after applying the SFX volume slider.
 */
export function computingWorldPlazaEquipmentSfxEffectiveTargetVolume(
  toolActionId: DefiningWorldPlazaEquipmentSfxToolActionId,
  milestone: DefiningWorldPlazaTimedInteractionMilestone
): number {
  const baseVolume =
    DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_TARGET_VOLUME_BY_TOOL_ACTION[
      toolActionId
    ];
  const milestoneMultiplier =
    milestone === 'final'
      ? DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_FINAL_MILESTONE_VOLUME_MULTIPLIER
      : 1;

  return baseVolume * milestoneMultiplier * gettingWorldPlazaSfxVolume();
}
