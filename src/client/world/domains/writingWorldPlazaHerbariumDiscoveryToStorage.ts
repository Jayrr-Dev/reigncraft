import { resolvingWorldPlazaHerbariumDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaHerbariumDiscoveryConstants';
import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';
import type { WorldCloverSearchLootKind } from '../../../shared/worldCloverSearchLoot';
import type { WorldFlowerSpeciesId } from '../../../shared/worldFlowerRarity';
import type { WorldShrubBerryLootKind } from '../../../shared/worldShrubBerryLoot';

function formattingWorldPlazaHerbariumStudyCountsRecord<TId extends string>(
  studyCountsById: ReadonlyMap<TId, number>
): Record<string, number> {
  return Object.fromEntries(
    [...studyCountsById.entries()]
      .filter(([, count]) => count > 0)
      .sort(([leftId], [rightId]) => leftId.localeCompare(rightId))
  );
}

/**
 * Persists herbarium discovery to localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function writingWorldPlazaHerbariumDiscoveryToStorage(
  storageOwnerId: string | null,
  sightedFlowerSpeciesIds: ReadonlySet<WorldFlowerSpeciesId>,
  flowerStudyCountsBySpeciesId: ReadonlyMap<WorldFlowerSpeciesId, number>,
  sightedTreeVariants: ReadonlySet<DefiningWorldPlazaTreeVariantKind>,
  treeStudyCountsByVariant: ReadonlyMap<
    DefiningWorldPlazaTreeVariantKind,
    number
  >,
  sightedCloverKinds: ReadonlySet<WorldCloverSearchLootKind>,
  cloverStudyCount: number,
  sightedBerryLootKinds: ReadonlySet<WorldShrubBerryLootKind>,
  berryStudyCountsByLootKind: ReadonlyMap<WorldShrubBerryLootKind, number>,
  sightedMushroomSpeciesIds: ReadonlySet<DefiningWorldPlazaMushroomSpeciesId>,
  mushroomStudyCountsBySpeciesId: ReadonlyMap<
    DefiningWorldPlazaMushroomSpeciesId,
    number
  >
): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    resolvingWorldPlazaHerbariumDiscoveryStorageKey(storageOwnerId),
    JSON.stringify({
      sightedFlowers: [...sightedFlowerSpeciesIds].sort(),
      flowerStudyCounts: formattingWorldPlazaHerbariumStudyCountsRecord(
        flowerStudyCountsBySpeciesId
      ),
      sightedTrees: [...sightedTreeVariants].sort(),
      treeStudyCounts: formattingWorldPlazaHerbariumStudyCountsRecord(
        treeStudyCountsByVariant
      ),
      sightedClovers: [...sightedCloverKinds].sort(),
      cloverStudyCount: cloverStudyCount > 0 ? cloverStudyCount : undefined,
      sightedBerries: [...sightedBerryLootKinds].sort(),
      berryStudyCounts: formattingWorldPlazaHerbariumStudyCountsRecord(
        berryStudyCountsByLootKind
      ),
      sightedMushrooms: [...sightedMushroomSpeciesIds].sort(),
      mushroomStudyCounts: formattingWorldPlazaHerbariumStudyCountsRecord(
        mushroomStudyCountsBySpeciesId
      ),
    })
  );
}
