import {
  DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_CLIP_POOL_BY_TOOL_ACTION,
  type DefiningWorldPlazaEquipmentSfxClipId,
  type DefiningWorldPlazaEquipmentSfxToolActionId,
} from '@/components/world/equipment/domains/definingWorldPlazaEquipmentSfxConstants';
import type { DefiningWorldPlazaTimedInteractionMilestone } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';

const DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_MILESTONE_ORDER = [
  'start',
  'mid',
  'final',
] as const satisfies readonly DefiningWorldPlazaTimedInteractionMilestone[];

/**
 * Picks the next clip in a tool action pool for one timed-interaction milestone.
 */
export function resolvingWorldPlazaEquipmentSfxClipIdForMilestone(
  toolActionId: DefiningWorldPlazaEquipmentSfxToolActionId,
  milestone: DefiningWorldPlazaTimedInteractionMilestone,
  rotationIndex: number
): DefiningWorldPlazaEquipmentSfxClipId {
  const clipPool =
    DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_CLIP_POOL_BY_TOOL_ACTION[toolActionId];
  const milestoneIndex =
    DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_MILESTONE_ORDER.indexOf(milestone);
  const normalizedMilestoneIndex = milestoneIndex >= 0 ? milestoneIndex : 0;
  const poolIndex =
    (rotationIndex + normalizedMilestoneIndex + clipPool.length) %
    clipPool.length;

  return clipPool[poolIndex];
}
