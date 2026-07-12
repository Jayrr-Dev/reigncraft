import {
  DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES,
  LABELING_PLAZA_BESTIARY_UNDISCOVERED_HINT,
  LABELING_PLAZA_BESTIARY_UNDISCOVERED_NAME,
  type DefiningPlazaBestiaryGuideEntry,
} from '@/components/home/domains/definingPlazaBestiaryGuideConstants';
import type { PlazaBestiaryStudyTierId } from '@/components/home/domains/definingPlazaBestiaryStudyTier';
import { LABELING_PLAZA_BIOMES_UNDISCOVERED_NAME } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import {
  resolvingPlazaBestiaryGuideCombatStats,
  resolvingPlazaBestiaryGuideEcologyStats,
  resolvingPlazaBestiaryGuideLootStats,
  resolvingPlazaBestiaryGuideOnHitProcRows,
  type PlazaBestiaryGuideCombatStats,
  type PlazaBestiaryGuideEcologyStats,
  type PlazaBestiaryGuideLootStats,
  type PlazaBestiaryGuideOnHitProcRow,
} from '@/components/home/domains/resolvingPlazaBestiaryGuideTieredStats';
import {
  checkingPlazaBestiaryStudyTierUnlocked,
  resolvingPlazaBestiaryStudyTierId,
} from '@/components/home/domains/resolvingPlazaBestiaryStudyTier';
import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSpeciesBiomeMembership } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesBiomeMembership';

export type PlazaBestiaryGuideDiscoveryState = 'locked' | 'sighted' | 'studied';

export type PlazaBestiaryGuideBiomeChip = {
  kind: DefiningWorldPlazaBiomeKind;
  label: string;
  isExplored: boolean;
};

export type PlazaBestiaryGuideDisplayEntry = {
  speciesId: DefiningWildlifeSpeciesId;
  icon: string;
  discoveryState: PlazaBestiaryGuideDiscoveryState;
  isSighted: boolean;
  isStudied: boolean;
  isFullyStudied: boolean;
  killCount: number;
  studyTierId: PlazaBestiaryStudyTierId;
  displayName: string;
  summary: string;
  studiedSummary: string;
  apostleFlavor: string | null;
  biomeKinds: readonly DefiningWorldPlazaBiomeKind[];
  biomeChips: readonly PlazaBestiaryGuideBiomeChip[];
  diet: string | null;
  temperamentLabel: string | null;
  activityPatternLabel: string | null;
  combatStats: PlazaBestiaryGuideCombatStats | null;
  onHitProcRows: readonly PlazaBestiaryGuideOnHitProcRow[] | null;
  ecologyStats: PlazaBestiaryGuideEcologyStats | null;
  lootStats: PlazaBestiaryGuideLootStats | null;
};

function formattingPlazaBestiaryTemperamentLabel(
  temperamentId: string | undefined
): string | null {
  if (!temperamentId) {
    return null;
  }

  const labels: Record<string, string> = {
    passive: 'Passive',
    docile: 'Docile',
    skittish: 'Skittish',
    retaliator: 'Retaliator',
    stalker: 'Stalker',
    predator: 'Predator',
    ambusher: 'Ambusher',
  };

  return labels[temperamentId] ?? temperamentId;
}

function formattingPlazaBestiaryActivityPatternLabel(
  activityPattern: string | undefined
): string | null {
  if (!activityPattern) {
    return null;
  }

  const labels: Record<string, string> = {
    nocturnal: 'Nocturnal',
    diurnal: 'Diurnal',
    crepuscular: 'Crepuscular',
    cathemeral: 'Cathemeral',
  };

  return labels[activityPattern] ?? activityPattern;
}

function formattingPlazaBestiaryDietLabel(
  diet: string | undefined
): string | null {
  if (!diet) {
    return null;
  }

  const labels: Record<string, string> = {
    herbivore: 'Herbivore',
    carnivore: 'Carnivore',
    omnivore: 'Omnivore',
    scavenger: 'Scavenger',
  };

  return labels[diet] ?? diet;
}

function gettingPlazaBestiarySpeciesKillCount(
  speciesId: DefiningWildlifeSpeciesId,
  killCountsBySpeciesId: Readonly<Record<DefiningWildlifeSpeciesId, number>>
): number {
  return killCountsBySpeciesId[speciesId] ?? 0;
}

function resolvingPlazaBestiaryGuideDiscoveryState(
  speciesId: DefiningWildlifeSpeciesId,
  sightedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>,
  killCount: number
): PlazaBestiaryGuideDiscoveryState {
  if (killCount > 0) {
    return 'studied';
  }

  if (sightedSpeciesIds.has(speciesId)) {
    return 'sighted';
  }

  return 'locked';
}

/**
 * Merges bestiary catalog data with the player's discovery sets for the codex panel.
 *
 * @param exploredBiomeKinds - Biome kinds the player has entered (gates habitat chip names).
 */
export function resolvingPlazaBestiaryGuideDisplayEntries(
  sightedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>,
  killCountsBySpeciesId: Readonly<Record<DefiningWildlifeSpeciesId, number>>,
  exploredBiomeKinds: ReadonlySet<DefiningWorldPlazaBiomeKind> = new Set()
): PlazaBestiaryGuideDisplayEntry[] {
  return DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES.map(
    (entry: DefiningPlazaBestiaryGuideEntry) => {
      const speciesDefinition = resolvingWildlifeSpeciesDefinition(
        entry.speciesId
      );
      const killCount = gettingPlazaBestiarySpeciesKillCount(
        entry.speciesId,
        killCountsBySpeciesId
      );
      const studyTierId = resolvingPlazaBestiaryStudyTierId(killCount);
      const discoveryState = resolvingPlazaBestiaryGuideDiscoveryState(
        entry.speciesId,
        sightedSpeciesIds,
        killCount
      );
      const isSighted = discoveryState !== 'locked';
      const isStudied = checkingPlazaBestiaryStudyTierUnlocked(
        'studied',
        killCount
      );
      const isFullyStudied = checkingPlazaBestiaryStudyTierUnlocked(
        'full',
        killCount
      );
      const biomeKinds = resolvingWildlifeSpeciesBiomeMembership(
        entry.speciesId
      );
      const biomeChips = biomeKinds.map((biomeKind) => {
        const isExplored = exploredBiomeKinds.has(biomeKind);

        return {
          kind: biomeKind,
          isExplored,
          label: isExplored
            ? DEFINING_WORLD_PLAZA_BIOME_CATALOG[biomeKind].displayName
            : LABELING_PLAZA_BIOMES_UNDISCOVERED_NAME,
        };
      });

      return {
        speciesId: entry.speciesId,
        icon: entry.icon,
        discoveryState,
        isSighted,
        isStudied,
        isFullyStudied,
        killCount,
        studyTierId,
        displayName: isSighted
          ? (speciesDefinition?.displayName ?? entry.speciesId)
          : LABELING_PLAZA_BESTIARY_UNDISCOVERED_NAME,
        summary: isSighted
          ? entry.summary
          : LABELING_PLAZA_BESTIARY_UNDISCOVERED_HINT,
        studiedSummary: entry.studiedSummary,
        apostleFlavor: isFullyStudied ? (entry.apostleFlavor ?? null) : null,
        biomeKinds,
        biomeChips,
        diet: isStudied
          ? formattingPlazaBestiaryDietLabel(speciesDefinition?.diet)
          : null,
        temperamentLabel: isStudied
          ? formattingPlazaBestiaryTemperamentLabel(
              speciesDefinition?.temperamentId
            )
          : null,
        activityPatternLabel: isStudied
          ? formattingPlazaBestiaryActivityPatternLabel(
              speciesDefinition?.activityPattern
            )
          : null,
        combatStats: resolvingPlazaBestiaryGuideCombatStats(
          entry.speciesId,
          killCount
        ),
        onHitProcRows: resolvingPlazaBestiaryGuideOnHitProcRows(
          entry.speciesId,
          killCount
        ),
        ecologyStats: resolvingPlazaBestiaryGuideEcologyStats(
          entry.speciesId,
          killCount
        ),
        lootStats: resolvingPlazaBestiaryGuideLootStats(
          entry.speciesId,
          killCount
        ),
      };
    }
  );
}

/**
 * Formats the codex menu subtitle for the Bestiary section.
 */
export function formattingPlazaBestiaryCodexMenuDescription(
  sightedCount: number,
  totalCount: number
): string {
  if (sightedCount <= 0) {
    return 'No animals sighted yet';
  }

  if (sightedCount >= totalCount) {
    return `All ${totalCount} animals sighted`;
  }

  return `${sightedCount} of ${totalCount} animals sighted`;
}
