/**
 * Fixed world placements for plaza NPCs (near origin spawn ring).
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

/** Three starter villagers near world origin; move later via this registry. */
export const DEFINING_NPC_PLACEMENT_REGISTRY: readonly DefiningNpcPlacement[] =
  [
    {
      npcId: 'npc-villager-a',
      speciesId: 'villager-a',
      displayName: 'Villager',
      worldX: 4,
      worldY: 2,
    },
    {
      npcId: 'npc-villager-b',
      speciesId: 'villager-b',
      displayName: 'Villager',
      worldX: 6,
      worldY: 1,
    },
    {
      npcId: 'npc-villager-c',
      speciesId: 'villager-c',
      displayName: 'Villager',
      worldX: 5,
      worldY: -2,
    },
  ] as const;
