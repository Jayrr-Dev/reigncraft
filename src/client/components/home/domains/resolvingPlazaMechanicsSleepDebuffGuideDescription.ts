import { DEFINING_WORLD_PLAZA_SLEEP_WAKE_BONUS_DAMAGE } from '@/components/world/health/domains/definingWorldPlazaEntitySleepConstants';
import { DEFINING_WILDLIFE_POST_AGGRO_SLEEP_BLOCK_MS } from '@/components/world/wildlife/domains/definingWildlifeSleepConstants';

const DEFINING_PLAZA_MECHANICS_SLEEP_DEBUFF_POST_AGGRO_BLOCK_SECONDS =
  Math.round(DEFINING_WILDLIFE_POST_AGGRO_SLEEP_BLOCK_MS / 1000);

/** Mechanics-guide copy for the sleep debuff, aligned with wildlife sleep rules. */
export function resolvingPlazaMechanicsSleepDebuffGuideDescription(): string {
  return `Out cold. You cannot move, attack, jump, or roll until this ends or damage wakes you; the waking hit adds ${DEFINING_WORLD_PLAZA_SLEEP_WAKE_BONUS_DAMAGE} bonus damage. Wildlife normally sleep on the day/night clock and stay awake for ${DEFINING_PLAZA_MECHANICS_SLEEP_DEBUFF_POST_AGGRO_BLOCK_SECONDS} seconds after a fight, but this debuff forces rest even mid-combat. The first hit on a sleeping animal rolls lethal EV, then it flees or fights.`;
}
