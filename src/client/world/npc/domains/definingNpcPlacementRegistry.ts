/**
 * Fixed world placements for plaza NPCs.
 *
 * Empty until designers pick spots. Add rows here to spawn villagers.
 *
 * @module components/world/npc/domains/definingNpcPlacementRegistry
 */

import type {
  DefiningNpcId,
  DefiningNpcSpeciesId,
} from '@/components/world/npc/domains/definingNpcTypes';

export type DefiningNpcPlacement = {
  readonly npcId: DefiningNpcId;
  readonly speciesId: DefiningNpcSpeciesId;
  readonly displayName: string;
  readonly worldX: number;
  readonly worldY: number;
};

/**
 * Live plaza placements. Keep empty for no world spawns.
 *
 * Example row:
 * `{ npcId: 'npc-villager-a', speciesId: 'villager-a', displayName: 'Villager', worldX: 4, worldY: 2 }`
 */
export const DEFINING_NPC_PLACEMENT_REGISTRY: readonly DefiningNpcPlacement[] =
  [];
