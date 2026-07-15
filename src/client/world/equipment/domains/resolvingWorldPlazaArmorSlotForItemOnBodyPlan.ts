import type { DefiningWorldPlazaArmorBodyPlanId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';

/**
 * Maps humanoid armor slot ids to animal body-plan slots.
 */
export function resolvingWorldPlazaArmorSlotForItemOnBodyPlan(input: {
  itemSlotId: DefiningWorldPlazaArmorSlotId;
  bodyPlanId: DefiningWorldPlazaArmorBodyPlanId;
}): DefiningWorldPlazaArmorSlotId | null {
  if (input.bodyPlanId === 'humanoid') {
    return input.itemSlotId;
  }

  if (input.itemSlotId === 'body') {
    return 'torso';
  }

  if (input.itemSlotId === 'leg') {
    return null;
  }

  if (input.itemSlotId === 'foot') {
    return 'paw-hooves';
  }

  return input.itemSlotId;
}
