import { resolvingWorldPlazaHerbariumDiscoveryStorageKey } from '@/components/world/domains/definingWorldPlazaHerbariumDiscoveryConstants';
import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import { WORLD_FLOWER_SPECIES_RARITY_REGISTRY } from '../../../shared/worldFlowerRarity';
import type { WorldFlowerSpeciesId } from '../../../shared/worldFlowerRarity';

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
  treeStudyCountsByVariant: ReadonlyMap<DefiningWorldPlazaTreeVariantKind, number>;
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

const WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_SNAPSHOT: WorldPlazaHerbariumDiscoverySnapshot =
  {
    sightedFlowerSpeciesIds: new Set(),
    flowerStudyCountsBySpeciesId: new Map(),
    sightedTreeVariants: new Set(),
    treeStudyCountsByVariant: new Map(),
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
    };
  } catch {
    return WORLD_PLAZA_HERBARIUM_DISCOVERY_EMPTY_SNAPSHOT;
  }
}
