import { computingPlazaPathologyStudyPoints } from '@/components/home/domains/computingPlazaPathologyStudyPoints';
import {
  DEFINING_PLAZA_PATHOLOGY_GUIDE_ENTRIES,
  LABELING_PLAZA_PATHOLOGY_FLOWER_SOURCE,
  LABELING_PLAZA_PATHOLOGY_SEVERITY,
  LABELING_PLAZA_PATHOLOGY_UNDISCOVERED_HINT,
  LABELING_PLAZA_PATHOLOGY_UNDISCOVERED_NAME,
  type DefiningPlazaPathologyGuideEntry,
} from '@/components/home/domains/definingPlazaPathologyGuideConstants';
import type { PlazaPathologyStudyTierId } from '@/components/home/domains/definingPlazaPathologyStudyTier';
import {
  checkingPlazaPathologyDiseaseHasWildlifeCarriers,
  listingPlazaPathologySpeciesIdsCausingDisease,
} from '@/components/home/domains/resolvingPlazaPathologyCreatureDiseaseLinks';
import {
  checkingPlazaPathologyStudyTierUnlocked,
  resolvingPlazaPathologyStudyTierId,
} from '@/components/home/domains/resolvingPlazaPathologyStudyTier';
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
  /** Pathology points: floor(linkedCreatureStudies / 3), 0 when not obtained. */
  studyCount: number;
  studyTierId: PlazaPathologyStudyTierId;
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
 * Merges Pathology catalog data with obtained + linked-creature study progress.
 *
 * Entries stay locked until the disease is obtained. Study points only apply
 * for display/tiers once obtained (silent linked totals may already exist).
 */
export function resolvingPlazaPathologyGuideDisplayEntries(
  obtainedDiseaseIds: ReadonlySet<DefiningWorldPlazaEntityDiseaseId>,
  linkedCreatureStudiesByDiseaseId: Readonly<
    Partial<Record<DefiningWorldPlazaEntityDiseaseId, number>>
  >
): PlazaPathologyGuideDisplayEntry[] {
  return DEFINING_PLAZA_PATHOLOGY_GUIDE_ENTRIES.map(
    (entry: DefiningPlazaPathologyGuideEntry) => {
      const isObtained = obtainedDiseaseIds.has(entry.diseaseId);
      const linkedCreatureStudies =
        linkedCreatureStudiesByDiseaseId[entry.diseaseId] ?? 0;
      const rawStudyCount =
        computingPlazaPathologyStudyPoints(linkedCreatureStudies);
      // Gate progress behind obtained: locked pages show zero study.
      const studyCount = isObtained ? rawStudyCount : 0;
      const discoveryState = resolvingPlazaPathologyDiscoveryState(
        isObtained,
        studyCount
      );
      const isStudied = checkingPlazaPathologyStudyTierUnlocked(
        'fieldNotes',
        studyCount
      );
      const isPropertiesUnlocked = checkingPlazaPathologyStudyTierUnlocked(
        'properties',
        studyCount
      );
      const isCarriersUnlocked = checkingPlazaPathologyStudyTierUnlocked(
        'habitats',
        studyCount
      );
      const isFullyStudied = checkingPlazaPathologyStudyTierUnlocked(
        'full',
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
        studyCount,
        studyTierId: resolvingPlazaPathologyStudyTierId(studyCount),
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
        stageGuideEntries: isPropertiesUnlocked
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
