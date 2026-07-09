import {
  DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES,
  LABELING_PLAZA_BESTIARY_UNDISCOVERED_HINT,
  LABELING_PLAZA_BESTIARY_UNDISCOVERED_NAME,
  type DefiningPlazaBestiaryGuideEntry,
} from '@/components/home/domains/definingPlazaBestiaryGuideConstants';
import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSpeciesBiomeMembership } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesBiomeMembership';

export type PlazaBestiaryGuideDiscoveryState = 'locked' | 'sighted' | 'studied';

export type PlazaBestiaryGuideDisplayEntry = {
  speciesId: DefiningWildlifeSpeciesId;
  icon: string;
  discoveryState: PlazaBestiaryGuideDiscoveryState;
  isSighted: boolean;
  isStudied: boolean;
  displayName: string;
  summary: string;
  studiedSummary: string;
  apostleFlavor: string | null;
  biomeKinds: readonly DefiningWorldPlazaBiomeKind[];
  biomeLabels: readonly string[];
  diet: string | null;
  temperamentLabel: string | null;
  activityPatternLabel: string | null;
};

function formattingPlazaBestiaryTemperamentLabel(
  temperamentId: string | undefined
): string | null {
  if (!temperamentId) {
    return null;
  }

  const labels: Record<string, string> = {
    passive: 'Passive',
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

function resolvingPlazaBestiaryGuideDiscoveryState(
  speciesId: DefiningWildlifeSpeciesId,
  sightedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>,
  killedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>
): PlazaBestiaryGuideDiscoveryState {
  if (killedSpeciesIds.has(speciesId)) {
    return 'studied';
  }

  if (sightedSpeciesIds.has(speciesId)) {
    return 'sighted';
  }

  return 'locked';
}

/**
 * Merges bestiary catalog data with the player's discovery sets for the codex panel.
 */
export function resolvingPlazaBestiaryGuideDisplayEntries(
  sightedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>,
  killedSpeciesIds: ReadonlySet<DefiningWildlifeSpeciesId>
): PlazaBestiaryGuideDisplayEntry[] {
  return DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES.map(
    (entry: DefiningPlazaBestiaryGuideEntry) => {
      const speciesDefinition = resolvingWildlifeSpeciesDefinition(
        entry.speciesId
      );
      const discoveryState = resolvingPlazaBestiaryGuideDiscoveryState(
        entry.speciesId,
        sightedSpeciesIds,
        killedSpeciesIds
      );
      const isSighted = discoveryState !== 'locked';
      const isStudied = discoveryState === 'studied';
      const biomeKinds = resolvingWildlifeSpeciesBiomeMembership(
        entry.speciesId
      );
      const biomeLabels = biomeKinds.map(
        (biomeKind) => DEFINING_WORLD_PLAZA_BIOME_CATALOG[biomeKind].displayName
      );

      return {
        speciesId: entry.speciesId,
        icon: entry.icon,
        discoveryState,
        isSighted,
        isStudied,
        displayName: isSighted
          ? (speciesDefinition?.displayName ?? entry.speciesId)
          : LABELING_PLAZA_BESTIARY_UNDISCOVERED_NAME,
        summary: isSighted
          ? entry.summary
          : LABELING_PLAZA_BESTIARY_UNDISCOVERED_HINT,
        studiedSummary: entry.studiedSummary,
        apostleFlavor: isStudied ? (entry.apostleFlavor ?? null) : null,
        biomeKinds,
        biomeLabels,
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
