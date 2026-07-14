/**
 * Resolves immune-system factor and permanent disease immunity rows for the
 * character profile Stats tab.
 *
 * @module components/world/domains/resolvingWorldPlazaProfilePanelImmunityEntries
 */

import {
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_IMMUNE_SYSTEM_ATTRIBUTE_ICON,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_DISEASE_IMMUNITY_VALUE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_IMMUNE_SYSTEM_ATTRIBUTE,
} from '@/components/world/domains/definingWorldPlazaProfilePanelConstants';
import {
  resolvingWorldPlazaEntityDiseaseDescriptor,
  type DefiningWorldPlazaEntityDiseaseId,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityImmuneSystemConstants';

/** One Immunity-section chip (factor or disease). */
export type ResolvingWorldPlazaProfilePanelImmunityEntry = {
  readonly id: string;
  readonly label: string;
  readonly iconName: string;
  readonly valueText: string;
  readonly diseaseId?: DefiningWorldPlazaEntityDiseaseId;
};

/** Immune factor chip plus permanent disease immunity chips. */
export type ResolvingWorldPlazaProfilePanelImmunitySections = {
  factorEntry: ResolvingWorldPlazaProfilePanelImmunityEntry;
  diseaseEntries: readonly ResolvingWorldPlazaProfilePanelImmunityEntry[];
};

function formattingImmuneSystemFactorValue(factor: number): string {
  return `${Math.round(factor)} / ${DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX}`;
}

/**
 * Builds the Immunity section chips from live immune-system state.
 */
export function resolvingWorldPlazaProfilePanelImmunityEntries(input: {
  immuneSystemFactor: number;
  diseaseImmunityIds: readonly DefiningWorldPlazaEntityDiseaseId[];
}): ResolvingWorldPlazaProfilePanelImmunitySections {
  const factorEntry: ResolvingWorldPlazaProfilePanelImmunityEntry = {
    id: 'immune-system',
    label: LABELING_WORLD_PLAZA_PROFILE_PANEL_IMMUNE_SYSTEM_ATTRIBUTE,
    iconName: DEFINING_WORLD_PLAZA_PROFILE_PANEL_IMMUNE_SYSTEM_ATTRIBUTE_ICON,
    valueText: formattingImmuneSystemFactorValue(input.immuneSystemFactor),
  };

  const diseaseEntries = [...input.diseaseImmunityIds]
    .map((diseaseId) => {
      const descriptor = resolvingWorldPlazaEntityDiseaseDescriptor(diseaseId);

      return {
        id: `disease-immunity-${diseaseId}`,
        label: descriptor.label,
        iconName: descriptor.icon,
        valueText: LABELING_WORLD_PLAZA_PROFILE_PANEL_DISEASE_IMMUNITY_VALUE,
        diseaseId,
      } satisfies ResolvingWorldPlazaProfilePanelImmunityEntry;
    })
    .sort((left, right) => left.label.localeCompare(right.label));

  return { factorEntry, diseaseEntries };
}
