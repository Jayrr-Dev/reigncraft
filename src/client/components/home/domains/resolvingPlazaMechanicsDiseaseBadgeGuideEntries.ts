import { formattingPlazaMechanicsInGameDurationRangeLabel } from '@/components/home/domains/formattingPlazaMechanicsInGameDurationLabel';
import { resolvingWorldPlazaEntityDiseaseBellCurveDurationRangeMs } from '@/components/world/health/domains/computingWorldPlazaEntityDiseaseBellCurveDurationMs';
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
  incubationRangeLabel: string;
  illnessDurationRangeLabel: string;
  timelineSubtitle: string;
};

function resolvingPlazaMechanicsDiseaseBadgeGuideEntry(
  descriptor: DefiningWorldPlazaEntityDiseaseDescriptor
): PlazaMechanicsDiseaseBadgeGuideEntry {
  const incubationRange =
    resolvingWorldPlazaEntityDiseaseBellCurveDurationRangeMs({
      meanMs: descriptor.incubationMs,
      kind: 'incubation',
    });
  const illnessRange = resolvingWorldPlazaEntityDiseaseBellCurveDurationRangeMs(
    {
      meanMs: descriptor.durationMs,
      kind: 'illness',
    }
  );
  const incubationRangeLabel =
    formattingPlazaMechanicsInGameDurationRangeLabel(incubationRange);
  const illnessDurationRangeLabel =
    formattingPlazaMechanicsInGameDurationRangeLabel(illnessRange);

  return {
    id: descriptor.id,
    label: descriptor.label,
    description: descriptor.description,
    icon: descriptor.icon,
    hudIconColorClassName: descriptor.hudIconColorClassName,
    hudIconBorderClassName: descriptor.hudIconBorderClassName,
    incubationRangeLabel,
    illnessDurationRangeLabel,
    timelineSubtitle: `Incubates ${incubationRangeLabel} · Illness ${illnessDurationRangeLabel}`,
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

  return `Bad for you: Incubates silently for ${entry.incubationRangeLabel}, then ${entry.label.toLowerCase()} worsens over ${entry.illnessDurationRangeLabel}.`;
}
