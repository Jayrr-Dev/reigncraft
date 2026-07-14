import { resolvingWorldPlazaHerbariumDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaHerbariumDiscoveryConstants';
import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import type { WorldCloverSearchLootKind } from '../../../shared/worldCloverSearchLoot';
import type { WorldFlowerSpeciesId } from '../../../shared/worldFlowerRarity';
import { WORLD_FLOWER_SPECIES_RARITY_REGISTRY } from '../../../shared/worldFlowerRarity';
import type { WorldShrubBerryLootKind } from '../../../shared/worldShrubBerryLoot';

const DEFINING_WORLD_PLAZA_HERBARIUM_CLOVER_KIND_SET = new Set<string>([
  'three_leaf',
  'four_leaf',
]);

const DEFINING_WORLD_PLAZA_HERBARIUM_BERRY_LOOT_KIND_SET = new Set<string>([
  'red_berry',
  'blue_berry',
  'golden_berry',
  'tea_leaves',
]);

const DEFINING_WORLD_PLAZA_HERBARIUM_FLOWER_SPECIES_ID_SET = new Set<string>(
  WORLD_FLOWER_SPECIES_RARITY_REGISTRY.map(
    (entry: { speciesId: WorldFlowerSpeciesId }) => entry.speciesId
  )
);

const DEFINING_WORLD_PLAZA_HERBARIUM_TREE_VARIANT_SET = new Set<string>([
  'oak',
  'blossom',
  'willow',
  'acacia',
  'spruce',
  'birch',
  'pine',
  'palm',
  'deadwood',
  'cactus',
]);

export type WorldPlazaHerbariumDiscoverySnapshot = {
  sightedFlowerSpeciesIds: ReadonlySet<WorldFlowerSpeciesId>;
  flowerStudyCountsBySpeciesId: ReadonlyMap<WorldFlowerSpeciesId, number>;
  sightedTreeVariants: ReadonlySet<DefiningWorldPlazaTreeVariantKind>;
  treeStudyCountsByVariant: ReadonlyMap<
    DefiningWorldPlazaTreeVariantKind,
    number
  >;
  sightedCloverKinds: ReadonlySet<WorldCloverSearchLootKind>;
  cloverStudyCount: number;
  sightedBerryLootKinds: ReadonlySet<WorldShrubBerryLootKind>;
  berryStudyCountsByLootKind: ReadonlyMap<WorldShrubBerryLootKind, number>;
};

function checkingWorldPlazaHerbariumFlowerSpeciesId(
  value: unknown
): value is WorldFlowerSpeciesId {
  return (
    typeof value === 'string' &&
    DEFINING_WORLD_PLAZA_HERBARIUM_FLOWER_SPECIES_ID_SET.has(value)
  );
}

function checkingWorldPlazaHerbariumTreeVariant(
  value: unknown
): value is DefiningWorldPlazaTreeVariantKind {
  return (
    typeof value === 'string' &&
    DEFINING_WORLD_PLAZA_HERBARIUM_TREE_VARIANT_SET.has(value)
  );
}

function readingWorldPlazaHerbariumIdSet<TId extends string>(
  value: unknown,
  checkingId: (value: unknown) => value is TId
): ReadonlySet<TId> {
  if (!Array.isArray(value)) {
    return new Set();
  }

  return new Set(value.filter(checkingId));
}

function readingWorldPlazaHerbariumStudyCounts<TId extends string>(
  value: unknown,
  checkingId: (value: unknown) => value is TId
): Map<TId, number> {
  if (!value || typeof value !== 'object') {
    return new Map();
  }

  const studyCounts = new Map<TId, number>();

  for (const [rawId, rawCount] of Object.entries(value)) {
    if (!checkingId(rawId)) {
      continue;
    }

    const parsedCount =
      typeof rawCount === 'number' && Number.isFinite(rawCount)
        ? Math.max(0, Math.floor(rawCount))
        : 0;

    if (parsedCount > 0) {
      studyCounts.set(rawId, parsedCount);
    }
  }

  return studyCounts;
}

function checkingWorldPlazaHerbariumCloverKind(
  value: unknown
): value is WorldCloverSearchLootKind {
  return (
    typeof value === 'string' &&
    DEFINING_WORLD_PLAZA_HERBARIUM_CLOVER_KIND_SET.has(value)
  );
}

function checkingWorldPlazaHerbariumBerryLootKind(
  value: unknown
): value is WorldShrubBerryLootKind {
  return (
    typeof value === 'string' &&
    DEFINING_WORLD_PLAZA_HERBARIUM_BERRY_LOOT_KIND_SET.has(value)
  );
}

const WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_SNAPSHOT: WorldPlazaHerbariumDiscoverySnapshot =
  {
    sightedFlowerSpeciesIds: new Set(),
    flowerStudyCountsBySpeciesId: new Map(),
    sightedTreeVariants: new Set(),
    treeStudyCountsByVariant: new Map(),
    sightedCloverKinds: new Set(),
    cloverStudyCount: 0,
    sightedBerryLootKinds: new Set(),
    berryStudyCountsByLootKind: new Map(),
  };

/**
 * Reads herbarium discovery from localStorage.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function readingWorldPlazaHerbariumDiscoveryFromStorage(
  storageOwnerId: string | null
): WorldPlazaHerbariumDiscoverySnapshot {
  if (typeof window === 'undefined') {
    return WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_SNAPSHOT;
  }

  try {
    const rawValue = localStorage.getItem(
      resolvingWorldPlazaHerbariumDiscoveryStorageKey(storageOwnerId)
    );

    if (!rawValue) {
      return WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_SNAPSHOT;
    }

    const parsedValue = JSON.parse(rawValue);

    if (!parsedValue || typeof parsedValue !== 'object') {
      return WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_SNAPSHOT;
    }

    return {
      sightedFlowerSpeciesIds: readingWorldPlazaHerbariumIdSet(
        Reflect.get(parsedValue, 'sightedFlowers'),
        checkingWorldPlazaHerbariumFlowerSpeciesId
      ),
      flowerStudyCountsBySpeciesId: readingWorldPlazaHerbariumStudyCounts(
        Reflect.get(parsedValue, 'flowerStudyCounts'),
        checkingWorldPlazaHerbariumFlowerSpeciesId
      ),
      sightedTreeVariants: readingWorldPlazaHerbariumIdSet(
        Reflect.get(parsedValue, 'sightedTrees'),
        checkingWorldPlazaHerbariumTreeVariant
      ),
      treeStudyCountsByVariant: readingWorldPlazaHerbariumStudyCounts(
        Reflect.get(parsedValue, 'treeStudyCounts'),
        checkingWorldPlazaHerbariumTreeVariant
      ),
      sightedCloverKinds: readingWorldPlazaHerbariumIdSet(
        Reflect.get(parsedValue, 'sightedClovers'),
        checkingWorldPlazaHerbariumCloverKind
      ),
      cloverStudyCount: (() => {
        const rawCount = Reflect.get(parsedValue, 'cloverStudyCount');

        return typeof rawCount === 'number' && Number.isFinite(rawCount)
          ? Math.max(0, Math.floor(rawCount))
          : 0;
      })(),
      sightedBerryLootKinds: readingWorldPlazaHerbariumIdSet(
        Reflect.get(parsedValue, 'sightedBerries'),
        checkingWorldPlazaHerbariumBerryLootKind
      ),
      berryStudyCountsByLootKind: readingWorldPlazaHerbariumStudyCounts(
        Reflect.get(parsedValue, 'berryStudyCounts'),
        checkingWorldPlazaHerbariumBerryLootKind
      ),
    };
  } catch {
    return WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_SNAPSHOT;
  }
}
