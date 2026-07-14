/**
 * NPC species catalog (sprites, size, hunt mass/tier).
 *
 * @module components/world/npc/domains/definingNpcSpeciesRegistry
 */

import type {
  DefiningNpcActionId,
  DefiningNpcSpeciesId,
} from '@/components/world/npc/domains/definingNpcTypes';

export type DefiningNpcSpeciesDefinition = {
  readonly speciesId: DefiningNpcSpeciesId;
  readonly displayName: string;
  readonly spriteFolder: string;
  readonly sizeScale: number;
  readonly collisionRadiusGrid: number;
  readonly massKg: number;
  readonly trophicTier: 1 | 2 | 3;
  readonly baseMaxHealth: number;
  readonly actionIds: readonly DefiningNpcActionId[];
};

const DEFINING_NPC_DEFAULT_ACTIONS: readonly DefiningNpcActionId[] = [
  'talk',
  'shop',
  'quest',
] as const;

export const DEFINING_NPC_SPECIES_REGISTRY: readonly DefiningNpcSpeciesDefinition[] =
  [
    {
      speciesId: 'villager-a',
      displayName: 'Villager',
      spriteFolder: 'villager-a',
      sizeScale: 1,
      collisionRadiusGrid: 0.35,
      massKg: 70,
      trophicTier: 2,
      baseMaxHealth: 80,
      actionIds: DEFINING_NPC_DEFAULT_ACTIONS,
    },
    {
      speciesId: 'villager-b',
      displayName: 'Villager',
      spriteFolder: 'villager-b',
      sizeScale: 1,
      collisionRadiusGrid: 0.35,
      massKg: 65,
      trophicTier: 2,
      baseMaxHealth: 80,
      actionIds: DEFINING_NPC_DEFAULT_ACTIONS,
    },
    {
      speciesId: 'villager-c',
      displayName: 'Villager',
      spriteFolder: 'villager-c',
      sizeScale: 1,
      collisionRadiusGrid: 0.35,
      massKg: 72,
      trophicTier: 2,
      baseMaxHealth: 80,
      actionIds: DEFINING_NPC_DEFAULT_ACTIONS,
    },
  ] as const;

const DEFINING_NPC_SPECIES_BY_ID = new Map(
  DEFINING_NPC_SPECIES_REGISTRY.map((entry) => [entry.speciesId, entry])
);

/** Resolves one NPC species definition, or null when unknown. */
export function resolvingNpcSpeciesDefinition(
  speciesId: string
): DefiningNpcSpeciesDefinition | null {
  return DEFINING_NPC_SPECIES_BY_ID.get(speciesId as DefiningNpcSpeciesId) ?? null;
}
