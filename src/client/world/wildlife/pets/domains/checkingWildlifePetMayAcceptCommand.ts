/**
 * Command unlock gates for bonded companions.
 *
 * @module components/world/wildlife/pets/domains/checkingWildlifePetMayAcceptCommand
 */

import { checkingWildlifePetHasCapability } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';
import type { DefiningWildlifePetCommandId } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';

const DEFINING_WILDLIFE_PET_COMMAND_CAPABILITY_BY_ID: Record<
  DefiningWildlifePetCommandId,
  'commandsStayFollow' | 'commandsAttackDefend' | null
> = {
  follow: 'commandsStayFollow',
  stay: 'commandsStayFollow',
  attack: 'commandsAttackDefend',
  defend: 'commandsAttackDefend',
};

/** True when loyalty unlocks the requested companion command. */
export function checkingWildlifePetMayAcceptCommand(
  loyalty: number,
  command: DefiningWildlifePetCommandId
): boolean {
  const requiredCapability =
    DEFINING_WILDLIFE_PET_COMMAND_CAPABILITY_BY_ID[command];

  if (!requiredCapability) {
    return true;
  }

  return checkingWildlifePetHasCapability(loyalty, requiredCapability);
}

/** Lists commands currently available at a loyalty total. */
export function listingWildlifePetAvailableCommands(
  loyalty: number
): readonly DefiningWildlifePetCommandId[] {
  const commands: DefiningWildlifePetCommandId[] = [];

  if (checkingWildlifePetMayAcceptCommand(loyalty, 'follow')) {
    commands.push('follow', 'stay');
  }

  if (checkingWildlifePetMayAcceptCommand(loyalty, 'attack')) {
    commands.push('attack', 'defend');
  }

  return commands;
}
