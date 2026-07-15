import { computingPlazaPathologyTotalStudyPoints } from '@/components/home/domains/computingPlazaPathologyStudyPoints';
import type { PlazaCodexStudyTierId } from '@/components/home/domains/definingPlazaCodexStudyTier';
import type { PlazaCodexStudyTrackId } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import {
  DEFINING_PLAZA_PATHOLOGY_GUIDE_ENTRIES,
  LABELING_PLAZA_PATHOLOGY_FLOWER_SOURCE,
  LABELING_PLAZA_PATHOLOGY_SEVERITY,
  LABELING_PLAZA_PATHOLOGY_UNDISCOVERED_HINT,
  LABELING_PLAZA_PATHOLOGY_UNDISCOVERED_NAME,
  type DefiningPlazaPathologyGuideEntry,
} from '@/components/home/domains/definingPlazaPathologyGuideConstants';
import {
  checkingPlazaPathologyDiseaseHasWildlifeCarriers,
  listingPlazaPathologySpeciesIdsCausingDisease,
} from '@/components/home/domains/resolvingPlazaPathologyCreatureDiseaseLinks';
import {
  checkingPlazaCodexStudyTierUnlocked,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';
import {
  listingPlazaMechanicsDiseaseStageGuideEntries,
  resolvingPlazaMechanicsDiseaseTimelineGuide,
  type PlazaMechanicsDiseaseStageGuideEntry,
} from '@/components/home/domains/resolvingPlazaMechanicsDiseaseStageGuideEntries';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaEntityDiseaseSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { MappingWorldPlazaEntityBuffHudIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityBuffHudIcon';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type PlazaPathologyGuideDiscoveryState = 'locked' | 'obtained' | 'studied';

export type PlazaPathologyGuideCarrierChip = {
  speciesId: DefiningWildlifeSpeciesId;
  label: string;
};

export type PlazaPathologyGuideDisplayEntry = {
  diseaseId: DefiningWorldPlazaEntityDiseaseId;
  discoveryState: PlazaPathologyGuideDiscoveryState;
  isObtained: boolean;
  isStudied: boolean;
  isFullyStudied: boolean;
  /** Linked creature Study points (pre-floor). */
  linkedCreatureStudies: number;
  /** Pathology points from living with the disease (1 per in-game hour). */
  infectionStudyPoints: number;
  /**
   * Pathology points: floor(linkedCreatureStudies / 3) + infection hours,
   * 0 when not obtained.
   */
  studyCount: number;
  studyTierId: PlazaCodexStudyTierId;
  severity: DefiningWorldPlazaEntityDiseaseSeverity;
  severityLabel: string;
  icon: MappingWorldPlazaEntityBuffHudIconName;
  hudIconColorClassName: string;
  hudIconBorderClassName: string;
  displayName: string;
  summary: string;
  studiedSummary: string;
  propertiesSummary: string | null;
  apostleFlavor: string | null;
  stageGuideEntries: readonly PlazaMechanicsDiseaseStageGuideEntry[] | null;
  carrierChips: readonly PlazaPathologyGuideCarrierChip[] | null;
  flowerSourceLabel: string | null;
  incubationRangeLabel: string | null;
  illnessDurationRangeLabel: string | null;
};

const PATHOLOGY_TRACK: PlazaCodexStudyTrackId = 'pathology';

function resolvingPlazaPathologyCarrierChips(
  diseaseId: DefiningWorldPlazaEntityDiseaseId
): readonly PlazaPathologyGuideCarrierChip[] {
  return listingPlazaPathologySpeciesIdsCausingDisease(diseaseId).map(
    (speciesId) => ({
      speciesId,
      label:
        resolvingWildlifeSpeciesDefinition(speciesId)?.displayName ?? speciesId,
    })
  );
}

function resolvingPlazaPathologyDiscoveryState(
  isObtained: boolean,
  studyCount: number
): PlazaPathologyGuideDiscoveryState {
  if (!isObtained) {
    return 'locked';
  }

  if (studyCount > 0) {
    return 'studied';
  }

  return 'obtained';
}

/**
 * Merges Pathology catalog data with obtained + study progress.
 *
 * Entries stay locked until the disease is obtained. Study points only apply
 * for display/tiers once obtained (silent linked totals may already exist).
 */
export function resolvingPlazaPathologyGuideDisplayEntries(
  obtainedDiseaseIds: ReadonlySet<DefiningWorldPlazaEntityDiseaseId>,
  linkedCreatureStudiesByDiseaseId: Readonly<
    Partial<Record<DefiningWorldPlazaEntityDiseaseId, number>>
  >,
  infectionStudyPointsByDiseaseId: Readonly<
    Partial<Record<DefiningWorldPlazaEntityDiseaseId, number>>
  > = {}
): PlazaPathologyGuideDisplayEntry[] {
  return DEFINING_PLAZA_PATHOLOGY_GUIDE_ENTRIES.map(
    (entry: DefiningPlazaPathologyGuideEntry) => {
      const isObtained = obtainedDiseaseIds.has(entry.diseaseId);
      const linkedCreatureStudies =
        linkedCreatureStudiesByDiseaseId[entry.diseaseId] ?? 0;
      const infectionStudyPoints =
        infectionStudyPointsByDiseaseId[entry.diseaseId] ?? 0;
      const rawStudyCount = computingPlazaPathologyTotalStudyPoints(
        linkedCreatureStudies,
        infectionStudyPoints
      );
      // Gate progress behind obtained: locked pages show zero study.
      const studyCount = isObtained ? rawStudyCount : 0;
      const discoveryState = resolvingPlazaPathologyDiscoveryState(
        isObtained,
        studyCount
      );
      const isStudied = checkingPlazaCodexStudyTierUnlocked(
        PATHOLOGY_TRACK,
        'familiarity',
        studyCount
      );
      const isPropertiesUnlocked = checkingPlazaCodexStudyTierUnlocked(
        PATHOLOGY_TRACK,
        'application',
        studyCount
      );
      // Symptoms / carriers stay at proficiency (legacy habitats title override).
      const isCarriersUnlocked = checkingPlazaCodexStudyTierUnlocked(
        PATHOLOGY_TRACK,
        'proficiency',
        studyCount
      );
      const isFullyStudied = checkingPlazaCodexStudyTierUnlocked(
        PATHOLOGY_TRACK,
        'mastery',
        studyCount
      );
      const timelineGuide = isFullyStudied
        ? resolvingPlazaMechanicsDiseaseTimelineGuide(entry.diseaseId)
        : null;
      const hasWildlifeCarriers =
        checkingPlazaPathologyDiseaseHasWildlifeCarriers(entry.diseaseId);

      return {
        diseaseId: entry.diseaseId,
        discoveryState,
        isObtained,
        isStudied,
        isFullyStudied,
        linkedCreatureStudies,
        infectionStudyPoints,
        studyCount,
        studyTierId: resolvingPlazaCodexStudyTierId(
          PATHOLOGY_TRACK,
          studyCount
        ),
        severity: entry.severity,
        severityLabel: LABELING_PLAZA_PATHOLOGY_SEVERITY[entry.severity],
        icon: entry.icon,
        hudIconColorClassName: entry.hudIconColorClassName,
        hudIconBorderClassName: entry.hudIconBorderClassName,
        displayName: isObtained
          ? entry.displayName
          : LABELING_PLAZA_PATHOLOGY_UNDISCOVERED_NAME,
        summary: isObtained
          ? entry.summary
          : LABELING_PLAZA_PATHOLOGY_UNDISCOVERED_HINT,
        studiedSummary: entry.studiedSummary,
        propertiesSummary: isPropertiesUnlocked
          ? entry.propertiesSummary
          : null,
        apostleFlavor: isFullyStudied ? (entry.apostleFlavor ?? null) : null,
        stageGuideEntries: isCarriersUnlocked
          ? listingPlazaMechanicsDiseaseStageGuideEntries(entry.diseaseId)
          : null,
        carrierChips: isCarriersUnlocked
          ? resolvingPlazaPathologyCarrierChips(entry.diseaseId)
          : null,
        flowerSourceLabel:
          isCarriersUnlocked && !hasWildlifeCarriers
            ? LABELING_PLAZA_PATHOLOGY_FLOWER_SOURCE
            : null,
        incubationRangeLabel: timelineGuide?.incubationRangeLabel ?? null,
        illnessDurationRangeLabel:
          timelineGuide?.illnessDurationRangeLabel ?? null,
      };
    }
  );
}

/**
 * Formats the codex menu subtitle for the Pathology section.
 */
export function formattingPlazaPathologyCodexMenuDescription(
  obtainedCount: number,
  totalCount: number
): string {
  if (obtainedCount <= 0) {
    return 'No diseases logged yet';
  }

  if (obtainedCount >= totalCount) {
    return `All ${totalCount} diseases logged`;
  }

  return `${obtainedCount} of ${totalCount} diseases logged`;
}
