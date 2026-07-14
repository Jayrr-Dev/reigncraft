/**
 * Picks the armor slot set for the active avatar skin.
 *
 * @module components/world/equipment/domains/resolvingWorldPlazaArmorSlotsForAvatarSkin
 */

import { checkingWorldPlazaAnimalPlayableAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAnimalPlayableAvatarSkinRegistry';
import {
  DEFINING_WORLD_PLAZA_ARMOR_SLOT_REGISTRY,
  type DefiningWorldPlazaArmorBodyPlanId,
  type DefiningWorldPlazaArmorSlotDefinition,
} from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';

/** Resolves humanoid vs animal armor body plan from the selected skin id. */
export function resolvingWorldPlazaArmorBodyPlanForAvatarSkin(
  skinId: string
): DefiningWorldPlazaArmorBodyPlanId {
  return checkingWorldPlazaAnimalPlayableAvatarSkinId(skinId)
    ? 'animal'
    : 'humanoid';
}

/** Ordered armor slots for the selected avatar skin. */
export function resolvingWorldPlazaArmorSlotsForAvatarSkin(
  skinId: string
): readonly DefiningWorldPlazaArmorSlotDefinition[] {
  const bodyPlan = resolvingWorldPlazaArmorBodyPlanForAvatarSkin(skinId);
  return DEFINING_WORLD_PLAZA_ARMOR_SLOT_REGISTRY[bodyPlan];
}
