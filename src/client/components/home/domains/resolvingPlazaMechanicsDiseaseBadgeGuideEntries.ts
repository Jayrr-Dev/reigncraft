import {
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER,
  listingWorldPlazaEntityDiseaseDescriptors,
  type DefiningWorldPlazaEntityDiseaseDescriptor,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { MappingWorldPlazaEntityBuffHudIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityBuffHudIcon';

export type PlazaMechanicsDiseaseBadgeGuideEntry = {
  id: string;
  label: string;
  description: string;
  severity: DefiningWorldPlazaEntityDiseaseDescriptor['severity'];
  icon: MappingWorldPlazaEntityBuffHudIconName;
  hudIconColorClassName: string;
  hudIconBorderClassName: string;
};

function resolvingPlazaMechanicsDiseaseBadgeGuideEntry(
  descriptor: DefiningWorldPlazaEntityDiseaseDescriptor
): PlazaMechanicsDiseaseBadgeGuideEntry {
  return {
    id: descriptor.id,
    label: descriptor.label,
    description: descriptor.description,
    severity: descriptor.severity,
    icon: descriptor.icon,
    hudIconColorClassName: descriptor.hudIconColorClassName,
    hudIconBorderClassName: descriptor.hudIconBorderClassName,
  };
}

/** All disease badge entries for the mechanics guide, sorted by severity then name. */
export function listingPlazaMechanicsDiseaseBadgeGuideEntries(): PlazaMechanicsDiseaseBadgeGuideEntry[] {
  return listingWorldPlazaEntityDiseaseDescriptors()
    .map(resolvingPlazaMechanicsDiseaseBadgeGuideEntry)
    .sort((left, right) => {
      const severityDelta =
        DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER[right.severity] -
        DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER[left.severity];

      if (severityDelta !== 0) {
        return severityDelta;
      }

      return left.label.localeCompare(right.label);
    });
}

/** Short player-impact line for one disease badge. */
export function resolvingPlazaMechanicsDiseaseBadgePlayerImpact(
  diseaseId: string
): string {
  const entry = listingPlazaMechanicsDiseaseBadgeGuideEntries().find(
    (candidate) => candidate.id === diseaseId
  );

  if (!entry) {
    return 'Bad for you: sickness stacks over time while the disease lasts.';
  }

  return `Bad for you: Incubates silently, then ${entry.label.toLowerCase()} worsens in stages.`;
}
