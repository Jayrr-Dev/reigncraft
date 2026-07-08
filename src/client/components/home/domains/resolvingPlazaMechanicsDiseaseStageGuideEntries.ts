import { formattingPlazaMechanicsInGameDurationLabel } from '@/components/home/domains/formattingPlazaMechanicsInGameDurationLabel';
import type { DefiningWorldPlazaEntityDiseaseStageGrant } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import {
  listingWorldPlazaEntityDiseaseDescriptors,
  resolvingWorldPlazaEntityDiseaseDescriptor,
  type DefiningWorldPlazaEntityDiseaseId,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';

export type PlazaMechanicsDiseaseStageGuideEntry = {
  timingLabel: string;
  effectLabel: string;
};

function resolvingPlazaMechanicsDiseaseStageEffectLabel(
  grant: DefiningWorldPlazaEntityDiseaseStageGrant
): string {
  if (grant.kind === 'poison') {
    return `${grant.potency} poison`;
  }

  if (grant.kind === 'bleed') {
    return `${grant.severity} bleed`;
  }

  if (grant.kind === 'potential_damage') {
    return 'Fated damage';
  }

  if (grant.kind === 'confusion') {
    return `Confusion (intensity ${grant.intensity})`;
  }

  if (grant.kind === 'sleep') {
    return 'Sleep episode';
  }

  const buffDescriptor = resolvingWorldPlazaEntityBuffDescriptor(grant.buffId);

  return buffDescriptor?.label ?? grant.buffId;
}

/** Ordered symptom stages for one disease (relative to incubation end). */
export function listingPlazaMechanicsDiseaseStageGuideEntries(
  diseaseId: string
): PlazaMechanicsDiseaseStageGuideEntry[] {
  const descriptor = listingWorldPlazaEntityDiseaseDescriptors().find(
    (candidate) => candidate.id === diseaseId
  );

  if (!descriptor) {
    return [];
  }

  return descriptor.grants.map((grant) => ({
    timingLabel: formattingPlazaMechanicsInGameDurationLabel(grant.delayMs),
    effectLabel: resolvingPlazaMechanicsDiseaseStageEffectLabel(grant),
  }));
}

/** Incubation and illness window copy for the mechanics guide. */
export function resolvingPlazaMechanicsDiseaseTimelineGuide(
  diseaseId: string
): {
  incubationLabel: string;
  illnessDurationLabel: string;
} | null {
  try {
    const descriptor = resolvingWorldPlazaEntityDiseaseDescriptor(
      diseaseId as DefiningWorldPlazaEntityDiseaseId
    );

    return {
      incubationLabel: formattingPlazaMechanicsInGameDurationLabel(
        descriptor.incubationMs
      ),
      illnessDurationLabel: formattingPlazaMechanicsInGameDurationLabel(
        descriptor.durationMs
      ),
    };
  } catch {
    return null;
  }
}
