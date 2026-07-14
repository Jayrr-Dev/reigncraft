/**
 * Whether a living NPC may be hunted by wildlife (player-like prey).
 *
 * @module components/world/npc/domains/checkingNpcIsHuntablePrey
 */

import type { DefiningNpcInstance } from '@/components/world/npc/domains/definingNpcTypes';

export function checkingNpcIsHuntablePrey(
  instance: DefiningNpcInstance
): boolean {
  return !instance.isDead;
}
