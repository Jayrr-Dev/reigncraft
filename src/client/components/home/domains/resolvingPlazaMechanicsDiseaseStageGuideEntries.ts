import {
  formattingPlazaMechanicsInGameDurationLabel,
  formattingPlazaMechanicsInGameDurationRangeLabel,
} from '@/components/home/domains/formattingPlazaMechanicsInGameDurationLabel';
import { resolvingWorldPlazaEntityDiseaseBellCurveDurationRangeMs } from '@/components/world/health/domains/computingWorldPlazaEntityDiseaseBellCurveDurationMs';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import type { DefiningWorldPlazaEntityDiseaseStageGrant } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import {
  listingWorldPlazaEntityDiseaseDescriptors,
  resolvingWorldPlazaEntityDiseaseDescriptor,
  type DefiningWorldPlazaEntityDiseaseId,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';

export type PlazaMechanicsDiseaseStageGuideEntry = {
  timingLabel: string;
  effectLabel: string;
};

export function resolvingPlazaMechanicsDiseaseStageEffectLabel(
  grant: DefiningWorldPlazaEntityDiseaseStageGrant
): string {
  if (grant.kind === 'poison') {
    const healthPercentLabel = `${Math.round(grant.healthPercentDamage * 100)}% max HP`;
    const drainLabel = formattingPlazaMechanicsInGameDurationLabel(
      grant.durationMs
    );

    return `${grant.potency} poison · ${healthPercentLabel} over ${drainLabel}`;
  }

  if (grant.kind === 'bleed') {
    const healthPercentLabel = `${Math.round(grant.healthPercentDamage * 100)}% max HP`;
    const drainLabel = formattingPlazaMechanicsInGameDurationLabel(
      grant.durationMs
    );

    return `${grant.severity} bleed · ${healthPercentLabel} over ${drainLabel}`;
  }

  if (grant.kind === 'potential_damage') {
    return `Fated damage · ${Math.round(grant.healthPercentDamage * 100)}% max HP`;
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
  incubationRangeLabel: string;
  illnessDurationRangeLabel: string;
} | null {
  try {
    const descriptor = resolvingWorldPlazaEntityDiseaseDescriptor(
      diseaseId as DefiningWorldPlazaEntityDiseaseId
    );
    const incubationRange =
      resolvingWorldPlazaEntityDiseaseBellCurveDurationRangeMs({
        meanMs: descriptor.incubationMs,
        kind: 'incubation',
      });
    const illnessRange =
      resolvingWorldPlazaEntityDiseaseBellCurveDurationRangeMs({
        meanMs: descriptor.durationMs,
        kind: 'illness',
      });

    return {
      incubationRangeLabel:
        formattingPlazaMechanicsInGameDurationRangeLabel(incubationRange),
      illnessDurationRangeLabel:
        formattingPlazaMechanicsInGameDurationRangeLabel(illnessRange),
    };
  } catch {
    return null;
  }
}
