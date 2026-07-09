import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WILDLIFE_CORPSE_STUDY_PLAYER_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeCorpseStudyConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  formattingWildlifeCorpseStudySelectionKey,
  resolvingWildlifeCorpseStudyInstanceIdFromSelectionKey,
} from '@/components/world/wildlife/domains/formattingWildlifeCorpseStudySelectionKey';
import {
  gettingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

export type ListingWildlifeCorpsesInStudyRangeEntry = {
  readonly instanceId: string;
  readonly speciesId: string;
  readonly position: DefiningWorldPlazaWorldPoint;
  readonly massKg: number;
};

/**
 * Resolves selected corpse Study targets that are still valid and in range.
 */
export function listingWildlifeCorpsesInStudyRange(
  store: ManagingWildlifeInstanceStore,
  selectedKeys: ReadonlySet<string>,
  playerPosition: DefiningWorldPlazaWorldPoint | null,
  resolveMassKg: (instance: DefiningWildlifeInstance) => number
): readonly ListingWildlifeCorpsesInStudyRangeEntry[] {
  if (!playerPosition || selectedKeys.size === 0) {
    return [];
  }

  const entries: ListingWildlifeCorpsesInStudyRangeEntry[] = [];

  for (const selectionKey of selectedKeys) {
    const instanceId =
      resolvingWildlifeCorpseStudyInstanceIdFromSelectionKey(selectionKey);

    if (!instanceId) {
      continue;
    }

    const instance = gettingWildlifeInstance(store, instanceId);

    if (
      !instance ||
      !instance.isDead ||
      instance.hasBeenStudied ||
      instance.diedAtMs === null
    ) {
      continue;
    }

    const distance = computingWorldPlazaGridChebyshevDistance(
      playerPosition.x,
      playerPosition.y,
      instance.position.x,
      instance.position.y
    );

    if (distance > DEFINING_WILDLIFE_CORPSE_STUDY_PLAYER_RANGE_GRID) {
      continue;
    }

    entries.push({
      instanceId: instance.instanceId,
      speciesId: instance.speciesId,
      position: instance.position,
      massKg: resolveMassKg(instance),
    });
  }

  return entries;
}

export { formattingWildlifeCorpseStudySelectionKey };
