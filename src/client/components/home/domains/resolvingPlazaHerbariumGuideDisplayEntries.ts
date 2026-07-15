import { LABELING_PLAZA_BIOMES_UNDISCOVERED_NAME } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import type { PlazaCodexStudyTierId } from '@/components/home/domains/definingPlazaCodexStudyTier';
import type { PlazaCodexStudyTrackId } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import { checkingPlazaHerbariumBerryIsLeavesCategory } from '@/components/home/domains/definingPlazaHerbariumCategoryFilter';
import {
  DEFINING_PLAZA_HERBARIUM_BERRY_GUIDE_ENTRIES,
  LABELING_PLAZA_HERBARIUM_UNDISCOVERED_BERRY_HINT,
  type DefiningPlazaHerbariumBerryEntry,
} from '@/components/home/domains/definingPlazaHerbariumBerryGuideConstants';
import {
  DEFINING_PLAZA_HERBARIUM_CLOVER_GUIDE_ENTRIES,
  LABELING_PLAZA_HERBARIUM_UNDISCOVERED_CLOVER_HINT,
  type DefiningPlazaHerbariumCloverEntry,
} from '@/components/home/domains/definingPlazaHerbariumCloverGuideConstants';
import {
  DEFINING_PLAZA_HERBARIUM_FLOWER_GUIDE_ENTRIES,
  DEFINING_PLAZA_HERBARIUM_TREE_GUIDE_ENTRIES,
  LABELING_PLAZA_HERBARIUM_UNDISCOVERED_HINT,
  LABELING_PLAZA_HERBARIUM_UNDISCOVERED_NAME,
  type DefiningPlazaHerbariumFlowerEntry,
  type DefiningPlazaHerbariumTreeEntry,
} from '@/components/home/domains/definingPlazaHerbariumGuideConstants';
import {
  DEFINING_PLAZA_HERBARIUM_MUSHROOM_GUIDE_ENTRIES,
  LABELING_PLAZA_HERBARIUM_UNDISCOVERED_MUSHROOM_HINT,
  type DefiningPlazaHerbariumMushroomEntry,
} from '@/components/home/domains/definingPlazaHerbariumMushroomGuideConstants';
import {
  checkingPlazaCodexStudyTierUnlocked,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';
import {
  resolvingPlazaHerbariumCloverLuckyEffectStatRows,
  type PlazaHerbariumCloverLuckyEffectStatRow,
} from '@/components/home/domains/resolvingPlazaHerbariumCloverLuckyEffectStatRows';
import {
  resolvingPlazaHerbariumFlowerEatEffectStatRows,
  type PlazaHerbariumFlowerEatEffectStatRow,
} from '@/components/home/domains/resolvingPlazaHerbariumFlowerEatEffectStatRows';
import {
  resolvingPlazaHerbariumMushroomEatEffectStatRows,
  type PlazaHerbariumMushroomEatEffectStatRow,
} from '@/components/home/domains/resolvingPlazaHerbariumMushroomEatEffectStatRows';
import {
  resolvingPlazaHerbariumEntryRarity,
  resolvingPlazaHerbariumEntryRarityLabel,
} from '@/components/home/domains/resolvingPlazaHerbariumRarity';
import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  DEFINING_WORLD_PLAZA_TREE_BIOME_CONFIG,
  type DefiningWorldPlazaTreeVariantKind,
} from '@/components/world/domains/definingWorldPlazaTreeConstants';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import { resolvingWorldPlazaMushroomCatalogEntryBySpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';
import type { WorldCloverSearchLootKind } from '../../../../shared/worldCloverSearchLoot';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';
import type { WorldShrubBerryLootKind } from '../../../../shared/worldShrubBerryLoot';

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
  studyTierId: PlazaCodexStudyTierId;
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

export type PlazaHerbariumGuideCloverDisplayEntry =
  PlazaHerbariumGuideDisplayEntryBase & {
    kind: 'clover';
    cloverKind: WorldCloverSearchLootKind;
    luckyEffectStatRows:
      | readonly PlazaHerbariumCloverLuckyEffectStatRow[]
      | null;
  };

export type PlazaHerbariumGuideBerryDisplayEntry =
  PlazaHerbariumGuideDisplayEntryBase & {
    kind: 'berry';
    berryLootKind: WorldShrubBerryLootKind;
    eatEffectStatRows: null;
  };

export type PlazaHerbariumGuideMushroomDisplayEntry =
  PlazaHerbariumGuideDisplayEntryBase & {
    kind: 'mushroom';
    speciesId: DefiningWorldPlazaMushroomSpeciesId;
    preparationNotes: string | null;
    eatEffectStatRows: readonly PlazaHerbariumMushroomEatEffectStatRow[] | null;
  };

export type PlazaHerbariumGuideDisplayEntry =
  | PlazaHerbariumGuideFlowerDisplayEntry
  | PlazaHerbariumGuideTreeDisplayEntry
  | PlazaHerbariumGuideCloverDisplayEntry
  | PlazaHerbariumGuideBerryDisplayEntry
  | PlazaHerbariumGuideMushroomDisplayEntry;

const HERBARIUM_FLOWER_TRACK: PlazaCodexStudyTrackId = 'herbarium-flower';
const HERBARIUM_TREE_TRACK: PlazaCodexStudyTrackId = 'herbarium-tree';
const HERBARIUM_CLOVER_TRACK: PlazaCodexStudyTrackId = 'herbarium-clover';
const HERBARIUM_BERRY_TRACK: PlazaCodexStudyTrackId = 'herbarium-berry';
const HERBARIUM_MUSHROOM_TRACK: PlazaCodexStudyTrackId = 'herbarium-mushroom';

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

/** Biome kinds where one mushroom species can fruit. */
function listingPlazaHerbariumMushroomBiomeKinds(
  speciesId: DefiningWorldPlazaMushroomSpeciesId
): readonly DefiningWorldPlazaBiomeKind[] {
  return resolvingWorldPlazaMushroomCatalogEntryBySpeciesId(speciesId)
    .biomeKinds;
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

function resolvingPlazaHerbariumStudyGates(
  trackId: PlazaCodexStudyTrackId,
  studyCount: number
): {
  isStudied: boolean;
  isPropertiesUnlocked: boolean;
  isHabitatsUnlocked: boolean;
  isExpertiseUnlocked: boolean;
  isFullyStudied: boolean;
  studyTierId: PlazaCodexStudyTierId;
} {
  return {
    isStudied: checkingPlazaCodexStudyTierUnlocked(
      trackId,
      'familiarity',
      studyCount
    ),
    isPropertiesUnlocked: checkingPlazaCodexStudyTierUnlocked(
      trackId,
      'application',
      studyCount
    ),
    isHabitatsUnlocked: checkingPlazaCodexStudyTierUnlocked(
      trackId,
      'application',
      studyCount
    ),
    isExpertiseUnlocked: checkingPlazaCodexStudyTierUnlocked(
      trackId,
      'expertise',
      studyCount
    ),
    isFullyStudied: checkingPlazaCodexStudyTierUnlocked(
      trackId,
      'mastery',
      studyCount
    ),
    studyTierId: resolvingPlazaCodexStudyTierId(trackId, studyCount),
  };
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
  exploredBiomeKinds: ReadonlySet<DefiningWorldPlazaBiomeKind> = new Set(),
  sightedCloverKinds: ReadonlySet<WorldCloverSearchLootKind> = new Set(),
  cloverStudyCount = 0,
  sightedBerryLootKinds: ReadonlySet<WorldShrubBerryLootKind> = new Set(),
  berryStudyCountsByLootKind: Readonly<
    Partial<Record<WorldShrubBerryLootKind, number>>
  > = {},
  sightedMushroomSpeciesIds: ReadonlySet<DefiningWorldPlazaMushroomSpeciesId> = new Set(),
  mushroomStudyCountsBySpeciesId: Readonly<
    Partial<Record<DefiningWorldPlazaMushroomSpeciesId, number>>
  > = {}
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
        const {
          isStudied,
          isPropertiesUnlocked,
          isHabitatsUnlocked,
          isExpertiseUnlocked,
          isFullyStudied,
          studyTierId,
        } = resolvingPlazaHerbariumStudyGates(
          HERBARIUM_FLOWER_TRACK,
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
          studyTierId,
          rarity,
          rarityLabel: resolvingPlazaHerbariumEntryRarityLabel(rarity),
          eatEffectStatRows: isExpertiseUnlocked
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
          biomeChips: isHabitatsUnlocked
            ? buildingPlazaHerbariumBiomeChips(
                flowerBiomeKinds,
                exploredBiomeKinds
              )
            : [],
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
        const {
          isStudied,
          isPropertiesUnlocked,
          isHabitatsUnlocked,
          isFullyStudied,
          studyTierId,
        } = resolvingPlazaHerbariumStudyGates(HERBARIUM_TREE_TRACK, studyCount);
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
          studyTierId,
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
          biomeChips: isHabitatsUnlocked
            ? buildingPlazaHerbariumBiomeChips(biomeKinds, exploredBiomeKinds)
            : [],
        };
      }
    );

  const cloverBiomeKinds = listingPlazaHerbariumFlowerBearingBiomeKinds();

  const cloverEntries: PlazaHerbariumGuideCloverDisplayEntry[] =
    DEFINING_PLAZA_HERBARIUM_CLOVER_GUIDE_ENTRIES.map(
      (entry: DefiningPlazaHerbariumCloverEntry) => {
        const studyCount = cloverStudyCount;
        const isSighted = sightedCloverKinds.has(entry.cloverKind);
        const discoveryState = resolvingPlazaHerbariumDiscoveryState(
          isSighted,
          studyCount
        );
        const {
          isStudied,
          isPropertiesUnlocked,
          isHabitatsUnlocked,
          isExpertiseUnlocked,
          isFullyStudied,
          studyTierId,
        } = resolvingPlazaHerbariumStudyGates(
          HERBARIUM_CLOVER_TRACK,
          studyCount
        );
        const rarity = resolvingPlazaHerbariumEntryRarity({
          kind: 'clover',
          cloverKind: entry.cloverKind,
        });
        const propertiesSummary = isPropertiesUnlocked
          ? entry.cloverKind === 'four_leaf' && isFullyStudied
            ? (entry.propertiesSummaryFull ?? entry.propertiesSummary)
            : entry.propertiesSummary
          : null;

        return {
          kind: 'clover',
          cloverKind: entry.cloverKind,
          icon: entry.icon,
          discoveryState,
          isSighted,
          isStudied,
          isFullyStudied,
          studyCount,
          studyTierId,
          rarity,
          rarityLabel: resolvingPlazaHerbariumEntryRarityLabel(rarity),
          luckyEffectStatRows:
            entry.cloverKind === 'four_leaf' && isExpertiseUnlocked
              ? resolvingPlazaHerbariumCloverLuckyEffectStatRows()
              : null,
          displayName: isSighted
            ? entry.displayName
            : LABELING_PLAZA_HERBARIUM_UNDISCOVERED_NAME,
          summary: isSighted
            ? entry.summary
            : LABELING_PLAZA_HERBARIUM_UNDISCOVERED_CLOVER_HINT,
          studiedSummary: entry.studiedSummary,
          propertiesSummary,
          apostleFlavor: null,
          biomeKinds: cloverBiomeKinds,
          biomeChips: isHabitatsUnlocked
            ? buildingPlazaHerbariumBiomeChips(
                cloverBiomeKinds,
                exploredBiomeKinds
              )
            : [],
        };
      }
    );

  const berryBiomeKinds = listingPlazaHerbariumFlowerBearingBiomeKinds();

  const buildingPlazaHerbariumBerryDisplayEntry = (
    entry: DefiningPlazaHerbariumBerryEntry
  ): PlazaHerbariumGuideBerryDisplayEntry => {
    const studyCount = berryStudyCountsByLootKind[entry.berryLootKind] ?? 0;
    const isSighted =
      studyCount > 0 || sightedBerryLootKinds.has(entry.berryLootKind);
    const discoveryState = resolvingPlazaHerbariumDiscoveryState(
      sightedBerryLootKinds.has(entry.berryLootKind),
      studyCount
    );
    const {
      isStudied,
      isPropertiesUnlocked,
      isHabitatsUnlocked,
      isFullyStudied,
      studyTierId,
    } = resolvingPlazaHerbariumStudyGates(HERBARIUM_BERRY_TRACK, studyCount);
    const rarity = resolvingPlazaHerbariumEntryRarity({
      kind: 'berry',
      berryLootKind: entry.berryLootKind,
    });

    return {
      kind: 'berry',
      berryLootKind: entry.berryLootKind,
      icon: entry.icon,
      discoveryState,
      isSighted,
      isStudied,
      isFullyStudied,
      studyCount,
      studyTierId,
      rarity,
      rarityLabel: resolvingPlazaHerbariumEntryRarityLabel(rarity),
      eatEffectStatRows: null,
      displayName: isSighted
        ? entry.displayName
        : LABELING_PLAZA_HERBARIUM_UNDISCOVERED_NAME,
      summary: isSighted
        ? entry.summary
        : LABELING_PLAZA_HERBARIUM_UNDISCOVERED_BERRY_HINT,
      studiedSummary: entry.studiedSummary,
      propertiesSummary: isPropertiesUnlocked ? entry.propertiesSummary : null,
      apostleFlavor: isFullyStudied ? (entry.apostleFlavor ?? null) : null,
      biomeKinds: berryBiomeKinds,
      biomeChips: isHabitatsUnlocked
        ? buildingPlazaHerbariumBiomeChips(berryBiomeKinds, exploredBiomeKinds)
        : [],
    };
  };

  const leafBerryEntries: PlazaHerbariumGuideBerryDisplayEntry[] = [];
  const fruitBerryEntries: PlazaHerbariumGuideBerryDisplayEntry[] = [];

  for (const entry of DEFINING_PLAZA_HERBARIUM_BERRY_GUIDE_ENTRIES) {
    const displayEntry = buildingPlazaHerbariumBerryDisplayEntry(entry);
    if (checkingPlazaHerbariumBerryIsLeavesCategory(entry.berryLootKind)) {
      leafBerryEntries.push(displayEntry);
    } else {
      fruitBerryEntries.push(displayEntry);
    }
  }

  const mushroomEntries: PlazaHerbariumGuideMushroomDisplayEntry[] =
    DEFINING_PLAZA_HERBARIUM_MUSHROOM_GUIDE_ENTRIES.map(
      (entry: DefiningPlazaHerbariumMushroomEntry) => {
        const studyCount = mushroomStudyCountsBySpeciesId[entry.speciesId] ?? 0;
        const isSighted =
          studyCount > 0 || sightedMushroomSpeciesIds.has(entry.speciesId);
        const discoveryState = resolvingPlazaHerbariumDiscoveryState(
          sightedMushroomSpeciesIds.has(entry.speciesId),
          studyCount
        );
        const {
          isStudied,
          isPropertiesUnlocked,
          isHabitatsUnlocked,
          isExpertiseUnlocked,
          isFullyStudied,
          studyTierId,
        } = resolvingPlazaHerbariumStudyGates(
          HERBARIUM_MUSHROOM_TRACK,
          studyCount
        );
        const rarity = resolvingPlazaHerbariumEntryRarity({
          kind: 'mushroom',
          speciesId: entry.speciesId,
        });
        const biomeKinds = listingPlazaHerbariumMushroomBiomeKinds(
          entry.speciesId
        );

        return {
          kind: 'mushroom',
          speciesId: entry.speciesId,
          icon: entry.icon,
          discoveryState,
          isSighted,
          isStudied,
          isFullyStudied,
          studyCount,
          studyTierId,
          rarity,
          rarityLabel: resolvingPlazaHerbariumEntryRarityLabel(rarity),
          eatEffectStatRows: isExpertiseUnlocked
            ? resolvingPlazaHerbariumMushroomEatEffectStatRows(entry.speciesId)
            : null,
          displayName: isSighted
            ? checkingPlazaCodexStudyTierUnlocked(
                HERBARIUM_MUSHROOM_TRACK,
                'proficiency',
                studyCount
              )
              ? entry.displayName
              : entry.fieldName
            : LABELING_PLAZA_HERBARIUM_UNDISCOVERED_NAME,
          summary: isSighted
            ? entry.summary
            : LABELING_PLAZA_HERBARIUM_UNDISCOVERED_MUSHROOM_HINT,
          studiedSummary: entry.studiedSummary,
          propertiesSummary: isPropertiesUnlocked
            ? entry.propertiesSummary
            : null,
          preparationNotes: isPropertiesUnlocked
            ? entry.preparationNotes
            : null,
          apostleFlavor: isFullyStudied ? (entry.apostleFlavor ?? null) : null,
          biomeKinds,
          biomeChips: isHabitatsUnlocked
            ? buildingPlazaHerbariumBiomeChips(biomeKinds, exploredBiomeKinds)
            : [],
        };
      }
    );

  return [
    ...flowerEntries,
    ...cloverEntries,
    ...leafBerryEntries,
    ...fruitBerryEntries,
    ...mushroomEntries,
    ...treeEntries,
  ];
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
