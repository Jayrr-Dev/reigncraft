import {
  listingWorldPlazaEntityDiseaseDescriptors,
  type DefiningWorldPlazaEntityDiseaseDescriptor,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { MappingWorldPlazaEntityBuffHudIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityBuffHudIcon';

export type PlazaMechanicsDiseaseBadgeGuideEntry = {
  id: string;
  label: string;
  description: string;
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
    icon: descriptor.icon,
    hudIconColorClassName: descriptor.hudIconColorClassName,
    hudIconBorderClassName: descriptor.hudIconBorderClassName,
  };
}

/** All disease badge entries for the mechanics guide, sorted by name. */
export function listingPlazaMechanicsDiseaseBadgeGuideEntries(): PlazaMechanicsDiseaseBadgeGuideEntry[] {
  return listingWorldPlazaEntityDiseaseDescriptors()
    .map(resolvingPlazaMechanicsDiseaseBadgeGuideEntry)
    .sort((left, right) => left.label.localeCompare(right.label));
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
