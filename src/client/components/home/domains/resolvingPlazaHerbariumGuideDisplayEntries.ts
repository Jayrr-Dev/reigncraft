import { LABELING_PLAZA_BIOMES_UNDISCOVERED_NAME } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import {
  DEFINING_PLAZA_HERBARIUM_FLOWER_GUIDE_ENTRIES,
  DEFINING_PLAZA_HERBARIUM_TREE_GUIDE_ENTRIES,
  LABELING_PLAZA_HERBARIUM_UNDISCOVERED_HINT,
  LABELING_PLAZA_HERBARIUM_UNDISCOVERED_NAME,
  type DefiningPlazaHerbariumFlowerEntry,
  type DefiningPlazaHerbariumTreeEntry,
} from '@/components/home/domains/definingPlazaHerbariumGuideConstants';
import type { PlazaHerbariumStudyTierId } from '@/components/home/domains/definingPlazaHerbariumStudyTier';
import {
  resolvingPlazaHerbariumFlowerEatEffectStatRows,
  type PlazaHerbariumFlowerEatEffectStatRow,
} from '@/components/home/domains/resolvingPlazaHerbariumFlowerEatEffectStatRows';
import {
  resolvingPlazaHerbariumEntryRarity,
  resolvingPlazaHerbariumEntryRarityLabel,
} from '@/components/home/domains/resolvingPlazaHerbariumRarity';
import {
  checkingPlazaHerbariumStudyTierUnlocked,
  resolvingPlazaHerbariumStudyTierId,
} from '@/components/home/domains/resolvingPlazaHerbariumStudyTier';
import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  DEFINING_WORLD_PLAZA_TREE_BIOME_CONFIG,
  type DefiningWorldPlazaTreeVariantKind,
} from '@/components/world/domains/definingWorldPlazaTreeConstants';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';

export type PlazaHerbariumGuideDiscoveryState =
  | 'locked'
  | 'sighted'
  | 'studied';

export type PlazaHerbariumGuideBiomeChip = {
  kind: DefiningWorldPlazaBiomeKind;
  label: string;
  isExplored: boolean;
};

export type PlazaHerbariumGuideDisplayEntryBase = {
  discoveryState: PlazaHerbariumGuideDiscoveryState;
  isSighted: boolean;
  isStudied: boolean;
  isFullyStudied: boolean;
  studyCount: number;
  studyTierId: PlazaHerbariumStudyTierId;
  rarity: DefiningWorldPlazaInventoryItemRarity;
  rarityLabel: string;
  icon: string;
  displayName: string;
  summary: string;
  studiedSummary: string;
  propertiesSummary: string | null;
  apostleFlavor: string | null;
  biomeKinds: readonly DefiningWorldPlazaBiomeKind[];
  biomeChips: readonly PlazaHerbariumGuideBiomeChip[];
};

export type PlazaHerbariumGuideFlowerDisplayEntry =
  PlazaHerbariumGuideDisplayEntryBase & {
    kind: 'flower';
    speciesId: WorldFlowerSpeciesId;
    eatEffectStatRows: readonly PlazaHerbariumFlowerEatEffectStatRow[] | null;
  };

export type PlazaHerbariumGuideTreeDisplayEntry =
  PlazaHerbariumGuideDisplayEntryBase & {
    kind: 'tree';
    variant: DefiningWorldPlazaTreeVariantKind;
    eatEffectStatRows: null;
  };

export type PlazaHerbariumGuideDisplayEntry =
  | PlazaHerbariumGuideFlowerDisplayEntry
  | PlazaHerbariumGuideTreeDisplayEntry;

/** Biome kinds that ever draw a pickable flower decoration. */
function listingPlazaHerbariumFlowerBearingBiomeKinds(): readonly DefiningWorldPlazaBiomeKind[] {
  return Object.values(DEFINING_WORLD_PLAZA_BIOME_CATALOG)
    .filter((biome) => biome.flowerColors !== null)
    .map((biome) => biome.kind);
}

/** Biome kinds whose tree pool includes one silhouette variant. */
function listingPlazaHerbariumTreeBiomeKinds(
  variant: DefiningWorldPlazaTreeVariantKind
): readonly DefiningWorldPlazaBiomeKind[] {
  const biomeKinds: DefiningWorldPlazaBiomeKind[] = [];

  for (const [biomeKind, config] of Object.entries(
    DEFINING_WORLD_PLAZA_TREE_BIOME_CONFIG
  )) {
    if (config?.species.some((entry) => entry.species.variant === variant)) {
      biomeKinds.push(biomeKind as DefiningWorldPlazaBiomeKind);
    }
  }

  return biomeKinds;
}

function buildingPlazaHerbariumBiomeChips(
  biomeKinds: readonly DefiningWorldPlazaBiomeKind[],
  exploredBiomeKinds: ReadonlySet<DefiningWorldPlazaBiomeKind>
): readonly PlazaHerbariumGuideBiomeChip[] {
  return biomeKinds.map((biomeKind) => {
    const isExplored = exploredBiomeKinds.has(biomeKind);

    return {
      kind: biomeKind,
      isExplored,
      label: isExplored
        ? DEFINING_WORLD_PLAZA_BIOME_CATALOG[biomeKind].displayName
        : LABELING_PLAZA_BIOMES_UNDISCOVERED_NAME,
    };
  });
}

function resolvingPlazaHerbariumDiscoveryState(
  isSightedInStore: boolean,
  studyCount: number
): PlazaHerbariumGuideDiscoveryState {
  if (studyCount > 0) {
    return 'studied';
  }

  if (isSightedInStore) {
    return 'sighted';
  }

  return 'locked';
}

/**
 * Merges herbarium catalog data with the player's discovery sets for the codex panel.
 *
 * @param exploredBiomeKinds - Biome kinds the player has entered (gates habitat chip names).
 */
export function resolvingPlazaHerbariumGuideDisplayEntries(
  flowerStudyCountsBySpeciesId: Readonly<
    Partial<Record<WorldFlowerSpeciesId, number>>
  >,
  sightedTreeVariants: ReadonlySet<DefiningWorldPlazaTreeVariantKind>,
  treeStudyCountsByVariant: Readonly<
    Partial<Record<DefiningWorldPlazaTreeVariantKind, number>>
  >,
  exploredBiomeKinds: ReadonlySet<DefiningWorldPlazaBiomeKind> = new Set()
): PlazaHerbariumGuideDisplayEntry[] {
  const flowerBiomeKinds = listingPlazaHerbariumFlowerBearingBiomeKinds();

  const flowerEntries: PlazaHerbariumGuideFlowerDisplayEntry[] =
    DEFINING_PLAZA_HERBARIUM_FLOWER_GUIDE_ENTRIES.map(
      (entry: DefiningPlazaHerbariumFlowerEntry) => {
        const studyCount = flowerStudyCountsBySpeciesId[entry.speciesId] ?? 0;
        // Flowers unlock only after a pick (study), never by proximity alone.
        const isSighted = studyCount > 0;
        const discoveryState = resolvingPlazaHerbariumDiscoveryState(
          isSighted,
          studyCount
        );
        const isStudied = checkingPlazaHerbariumStudyTierUnlocked(
          'fieldNotes',
          studyCount
        );
        const isPropertiesUnlocked = checkingPlazaHerbariumStudyTierUnlocked(
          'properties',
          studyCount
        );
        const isFullyStudied = checkingPlazaHerbariumStudyTierUnlocked(
          'full',
          studyCount
        );
        const rarity = resolvingPlazaHerbariumEntryRarity({
          kind: 'flower',
          speciesId: entry.speciesId,
        });

        return {
          kind: 'flower',
          speciesId: entry.speciesId,
          icon: entry.icon,
          discoveryState,
          isSighted,
          isStudied,
          isFullyStudied,
          studyCount,
          studyTierId: resolvingPlazaHerbariumStudyTierId(studyCount),
          rarity,
          rarityLabel: resolvingPlazaHerbariumEntryRarityLabel(rarity),
          eatEffectStatRows: isFullyStudied
            ? resolvingPlazaHerbariumFlowerEatEffectStatRows(entry.speciesId)
            : null,
          displayName: isSighted
            ? entry.displayName
            : LABELING_PLAZA_HERBARIUM_UNDISCOVERED_NAME,
          summary: isSighted
            ? entry.summary
            : LABELING_PLAZA_HERBARIUM_UNDISCOVERED_HINT,
          studiedSummary: entry.studiedSummary,
          propertiesSummary: isPropertiesUnlocked
            ? entry.propertiesSummary
            : null,
          apostleFlavor: isFullyStudied ? (entry.apostleFlavor ?? null) : null,
          biomeKinds: flowerBiomeKinds,
          biomeChips: buildingPlazaHerbariumBiomeChips(
            flowerBiomeKinds,
            exploredBiomeKinds
          ),
        };
      }
    );

  const treeEntries: PlazaHerbariumGuideTreeDisplayEntry[] =
    DEFINING_PLAZA_HERBARIUM_TREE_GUIDE_ENTRIES.map(
      (entry: DefiningPlazaHerbariumTreeEntry) => {
        const studyCount = treeStudyCountsByVariant[entry.variant] ?? 0;
        const isSighted =
          studyCount > 0 || sightedTreeVariants.has(entry.variant);
        const discoveryState = resolvingPlazaHerbariumDiscoveryState(
          sightedTreeVariants.has(entry.variant),
          studyCount
        );
        const isStudied = checkingPlazaHerbariumStudyTierUnlocked(
          'fieldNotes',
          studyCount
        );
        const isPropertiesUnlocked = checkingPlazaHerbariumStudyTierUnlocked(
          'properties',
          studyCount
        );
        const isFullyStudied = checkingPlazaHerbariumStudyTierUnlocked(
          'full',
          studyCount
        );
        const biomeKinds = listingPlazaHerbariumTreeBiomeKinds(entry.variant);
        const rarity = resolvingPlazaHerbariumEntryRarity({
          kind: 'tree',
          variant: entry.variant,
        });

        return {
          kind: 'tree',
          variant: entry.variant,
          icon: entry.icon,
          discoveryState,
          isSighted,
          isStudied,
          isFullyStudied,
          studyCount,
          studyTierId: resolvingPlazaHerbariumStudyTierId(studyCount),
          rarity,
          rarityLabel: resolvingPlazaHerbariumEntryRarityLabel(rarity),
          eatEffectStatRows: null,
          displayName: isSighted
            ? entry.displayName
            : LABELING_PLAZA_HERBARIUM_UNDISCOVERED_NAME,
          summary: isSighted
            ? entry.summary
            : LABELING_PLAZA_HERBARIUM_UNDISCOVERED_HINT,
          studiedSummary: entry.studiedSummary,
          propertiesSummary: isPropertiesUnlocked
            ? entry.propertiesSummary
            : null,
          apostleFlavor: isFullyStudied ? (entry.apostleFlavor ?? null) : null,
          biomeKinds,
          biomeChips: buildingPlazaHerbariumBiomeChips(
            biomeKinds,
            exploredBiomeKinds
          ),
        };
      }
    );

  return [...flowerEntries, ...treeEntries];
}

/**
 * Formats the codex menu subtitle for the Herbarium section.
 */
export function formattingPlazaHerbariumCodexMenuDescription(
  sightedCount: number,
  totalCount: number
): string {
  if (sightedCount <= 0) {
    return 'No flora sighted yet';
  }

  if (sightedCount >= totalCount) {
    return `All ${totalCount} flora sighted`;
  }

  return `${sightedCount} of ${totalCount} flora sighted`;
}
