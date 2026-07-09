import { formattingPlazaMechanicsInGameDurationLabel } from '@/components/home/domains/formattingPlazaMechanicsInGameDurationLabel';
import { resolvingPlazaMechanicsDiseaseStageEffectLabel } from '@/components/home/domains/resolvingPlazaMechanicsDiseaseStageGuideEntries';
import type {
  DefiningWorldPlazaEntityDiseaseDescriptor,
  DefiningWorldPlazaEntityDiseaseSeverity,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaEntityHealthDiseaseEffect } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_LABEL: Record<
  DefiningWorldPlazaEntityDiseaseSeverity,
  string
> = {
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
  critical: 'Critical',
};

export type ResolvingWorldPlazaEntityDiseaseHudDetailLinesResult = {
  severityLabel: string;
  effectLines: readonly string[];
};

/**
 * Builds compact HUD detail lines for an active disease: severity plus
 * active and upcoming symptom stages relative to symptom onset.
 */
export function resolvingWorldPlazaEntityDiseaseHudDetailLines({
  descriptor,
  diseaseEffect,
  worldEpochMs,
}: {
  descriptor: DefiningWorldPlazaEntityDiseaseDescriptor;
  diseaseEffect: DefiningWorldPlazaEntityHealthDiseaseEffect;
  worldEpochMs: number;
}): ResolvingWorldPlazaEntityDiseaseHudDetailLinesResult {
  const severityLabel =
    DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_LABEL[descriptor.severity];
  const elapsedSinceSymptomsMs = Math.max(
    0,
    worldEpochMs - diseaseEffect.symptomsStartAtMs
  );
  const durationMultiplier = diseaseEffect.durationMultiplier;

  const effectLines = descriptor.grants.map((grant) => {
    const scaledDelayMs = Math.round(grant.delayMs * durationMultiplier);
    const effectLabel = resolvingPlazaMechanicsDiseaseStageEffectLabel(grant);
    const isActive = elapsedSinceSymptomsMs >= scaledDelayMs;
    const timingLabel = isActive
      ? 'Active'
      : formattingPlazaMechanicsInGameDurationLabel(scaledDelayMs);

    return `${timingLabel}: ${effectLabel}`;
  });

  return {
    severityLabel,
    effectLines,
  };
}
