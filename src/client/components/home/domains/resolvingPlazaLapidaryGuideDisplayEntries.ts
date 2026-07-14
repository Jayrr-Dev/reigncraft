import { LABELING_PLAZA_BIOMES_UNDISCOVERED_NAME } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import {
  DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES,
  LABELING_PLAZA_LAPIDARY_UNDISCOVERED_HINT,
  LABELING_PLAZA_LAPIDARY_UNDISCOVERED_NAME,
  type DefiningPlazaLapidaryOreEntry,
} from '@/components/home/domains/definingPlazaLapidaryGuideConstants';
import type { PlazaLapidaryStudyTierId } from '@/components/home/domains/definingPlazaLapidaryStudyTier';
import {
  resolvingPlazaLapidaryEntryRarity,
  resolvingPlazaLapidaryEntryRarityLabel,
} from '@/components/home/domains/resolvingPlazaLapidaryRarity';
import {
  checkingPlazaLapidaryStudyTierUnlocked,
  resolvingPlazaLapidaryStudyTierId,
} from '@/components/home/domains/resolvingPlazaLapidaryStudyTier';
import {
  resolvingPlazaLapidaryOreVeinStatRows,
  type PlazaLapidaryOreVeinStatRow,
} from '@/components/home/domains/resolvingPlazaLapidaryOreVeinStatRows';
import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';

export type PlazaLapidaryGuideDiscoveryState =
  | 'locked'
  | 'sighted'
  | 'studied';

export type PlazaLapidaryGuideBiomeChip = {
  kind: DefiningWorldPlazaBiomeKind;
  label: string;
  isExplored: boolean;
};

export type PlazaLapidaryGuideDisplayEntry = {
  kind: 'ore';
  speciesId: WorldOreSpeciesId;
  discoveryState: PlazaLapidaryGuideDiscoveryState;
  isSighted: boolean;
  isStudied: boolean;
  isFullyStudied: boolean;
  studyCount: number;
  studyTierId: PlazaLapidaryStudyTierId;
  rarity: DefiningWorldPlazaInventoryItemRarity;
  rarityLabel: string;
  icon: string;
  displayName: string;
  summary: string;
  studiedSummary: string;
  propertiesSummary: string | null;
  apostleFlavor: string | null;
  veinStatRows: readonly PlazaLapidaryOreVeinStatRow[] | null;
  biomeKinds: readonly DefiningWorldPlazaBiomeKind[];
  biomeChips: readonly PlazaLapidaryGuideBiomeChip[];
};

/** Biome kinds where column rocks (and ore veins) can appear. */
function listingPlazaLapidaryOreBearingBiomeKinds(): readonly DefiningWorldPlazaBiomeKind[] {
  return Object.values(DEFINING_WORLD_PLAZA_BIOME_CATALOG)
    .filter((biome) => biome.kind !== 'ocean')
    .map((biome) => biome.kind);
}

function buildingPlazaLapidaryBiomeChips(
  biomeKinds: readonly DefiningWorldPlazaBiomeKind[],
  exploredBiomeKinds: ReadonlySet<DefiningWorldPlazaBiomeKind>
): readonly PlazaLapidaryGuideBiomeChip[] {
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

function resolvingPlazaLapidaryDiscoveryState(
  isSightedInStore: boolean,
  studyCount: number
): PlazaLapidaryGuideDiscoveryState {
  if (studyCount > 0) {
    return 'studied';
  }

  if (isSightedInStore) {
    return 'sighted';
  }

  return 'locked';
}

/**
 * Merges lapidary catalog data with the player's discovery sets for the codex panel.
 *
 * @param exploredBiomeKinds - Biome kinds the player has entered (gates habitat chip names).
 */
export function resolvingPlazaLapidaryGuideDisplayEntries(
  oreStudyCountsBySpeciesId: Readonly<
    Partial<Record<WorldOreSpeciesId, number>>
  >,
  sightedOreSpeciesIds: ReadonlySet<WorldOreSpeciesId>,
  exploredBiomeKinds: ReadonlySet<DefiningWorldPlazaBiomeKind> = new Set()
): PlazaLapidaryGuideDisplayEntry[] {
  const oreBiomeKinds = listingPlazaLapidaryOreBearingBiomeKinds();

  return DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES.map(
    (entry: DefiningPlazaLapidaryOreEntry) => {
      const studyCount = oreStudyCountsBySpeciesId[entry.speciesId] ?? 0;
      const isSighted =
        studyCount > 0 || sightedOreSpeciesIds.has(entry.speciesId);
      const discoveryState = resolvingPlazaLapidaryDiscoveryState(
        sightedOreSpeciesIds.has(entry.speciesId),
        studyCount
      );
      const isStudied = checkingPlazaLapidaryStudyTierUnlocked(
        'fieldNotes',
        studyCount
      );
      const isPropertiesUnlocked = checkingPlazaLapidaryStudyTierUnlocked(
        'properties',
        studyCount
      );
      const isFullyStudied = checkingPlazaLapidaryStudyTierUnlocked(
        'full',
        studyCount
      );
      const rarity = resolvingPlazaLapidaryEntryRarity(entry.speciesId);

      return {
        kind: 'ore' as const,
        speciesId: entry.speciesId,
        icon: entry.icon,
        discoveryState,
        isSighted,
        isStudied,
        isFullyStudied,
        studyCount,
        studyTierId: resolvingPlazaLapidaryStudyTierId(studyCount),
        rarity,
        rarityLabel: resolvingPlazaLapidaryEntryRarityLabel(rarity),
        veinStatRows: isFullyStudied
          ? resolvingPlazaLapidaryOreVeinStatRows(entry.speciesId)
          : null,
        displayName: isSighted
          ? entry.displayName
          : LABELING_PLAZA_LAPIDARY_UNDISCOVERED_NAME,
        summary: isSighted
          ? entry.summary
          : LABELING_PLAZA_LAPIDARY_UNDISCOVERED_HINT,
        studiedSummary: entry.studiedSummary,
        propertiesSummary: isPropertiesUnlocked
          ? entry.propertiesSummary
          : null,
        apostleFlavor: isFullyStudied ? (entry.apostleFlavor ?? null) : null,
        biomeKinds: oreBiomeKinds,
        biomeChips: buildingPlazaLapidaryBiomeChips(
          oreBiomeKinds,
          exploredBiomeKinds
        ),
      };
    }
  );
}

/**
 * Formats the codex menu subtitle for the Lapidary section.
 */
export function formattingPlazaLapidaryCodexMenuDescription(
  sightedCount: number,
  totalCount: number
): string {
  if (sightedCount <= 0) {
    return 'No ores sighted yet';
  }

  if (sightedCount >= totalCount) {
    return `All ${totalCount} ores sighted`;
  }

  return `${sightedCount} of ${totalCount} ores sighted`;
}
