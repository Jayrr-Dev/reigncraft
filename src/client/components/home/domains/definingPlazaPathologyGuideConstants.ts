import {
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER,
  listingWorldPlazaEntityDiseaseDescriptors,
  type DefiningWorldPlazaEntityDiseaseId,
  type DefiningWorldPlazaEntityDiseaseSeverity,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { MappingWorldPlazaEntityBuffHudIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityBuffHudIcon';

/** One disease entry in the codex Pathology guide. */
export type DefiningPlazaPathologyGuideEntry = {
  diseaseId: DefiningWorldPlazaEntityDiseaseId;
  displayName: string;
  icon: MappingWorldPlazaEntityBuffHudIconName;
  severity: DefiningWorldPlazaEntityDiseaseSeverity;
  hudIconColorClassName: string;
  hudIconBorderClassName: string;
  /** Shown after the player first contracts the disease. */
  summary: string;
  /** Shown after the first Pathology study point. */
  studiedSummary: string;
  /** Short symptom note shown in the Symptoms tier. */
  propertiesSummary: string;
  /** Optional Apostle flavor line on the fully studied detail page. */
  apostleFlavor?: string;
};

/** Subtitle shown under the Pathology panel title. */
export const DEFINING_PLAZA_PATHOLOGY_PANEL_SUBTITLE =
  'Contract a disease to unlock its page. Live with it for Pathology points (1 per in-game hour), or study carrier creatures (1 point per 3 studies).' as const;

/** Label shown for diseases the player has not contracted yet. */
export const LABELING_PLAZA_PATHOLOGY_UNDISCOVERED_NAME = '???' as const;

/** Hint shown under locked Pathology cards. */
export const LABELING_PLAZA_PATHOLOGY_UNDISCOVERED_HINT =
  'Survive the illness at least once to open this page.' as const;

/** Static codex menu description for the Pathology section. */
export const LABELING_PLAZA_PATHOLOGY_CODEX_MENU_DESCRIPTION =
  'Contracted diseases and hidden ones' as const;

/** Player-facing severity labels for Pathology cards. */
export const LABELING_PLAZA_PATHOLOGY_SEVERITY: Record<
  DefiningWorldPlazaEntityDiseaseSeverity,
  string
> = {
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
  critical: 'Critical',
};

/** Copy for flower-borne diseases with no wildlife meat carriers. */
export const LABELING_PLAZA_PATHOLOGY_FLOWER_SOURCE =
  'Raw flowers (chewing petals)' as const;

function resolvingPlazaPathologyGuideSummary(description: string): string {
  const firstSentence = description.split(/(?<=\.)\s+/)[0]?.trim();

  if (firstSentence && firstSentence.length > 0) {
    return firstSentence;
  }

  return description;
}

function buildingPlazaPathologyGuideEntries(): readonly DefiningPlazaPathologyGuideEntry[] {
  return listingWorldPlazaEntityDiseaseDescriptors()
    .slice()
    .sort((left, right) => {
      const severityDelta =
        DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER[right.severity] -
        DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER[left.severity];

      if (severityDelta !== 0) {
        return severityDelta;
      }

      return left.label.localeCompare(right.label);
    })
    .map((descriptor) => ({
      diseaseId: descriptor.id,
      displayName: descriptor.label,
      icon: descriptor.icon,
      severity: descriptor.severity,
      hudIconColorClassName: descriptor.hudIconColorClassName,
      hudIconBorderClassName: descriptor.hudIconBorderClassName,
      summary: resolvingPlazaPathologyGuideSummary(descriptor.description),
      studiedSummary: descriptor.description,
      propertiesSummary: `${LABELING_PLAZA_PATHOLOGY_SEVERITY[descriptor.severity]} illness. Stages fire after incubation ends.`,
    }));
}

/** Ordered Pathology guide entries (severe first, then name). */
export const DEFINING_PLAZA_PATHOLOGY_GUIDE_ENTRIES: readonly DefiningPlazaPathologyGuideEntry[] =
  buildingPlazaPathologyGuideEntries();
