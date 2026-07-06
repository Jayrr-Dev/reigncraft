import {
  DEFINING_PLAZA_MECHANICS_COMBAT_DAMAGE_KIND_PREVIEW_SAMPLES,
  type DefiningPlazaMechanicsCombatDamageKindPreviewSample,
} from '@/components/home/domains/definingPlazaMechanicsCombatDamageKindPreviewConstants';

/** Looks up the combat float preview sample for a mechanics damage card. */
export function resolvingPlazaMechanicsCombatDamageKindPreviewSample(
  sectionId: string
): DefiningPlazaMechanicsCombatDamageKindPreviewSample | null {
  return (
    DEFINING_PLAZA_MECHANICS_COMBAT_DAMAGE_KIND_PREVIEW_SAMPLES.find(
      (sample) => sample.sectionId === sectionId
    ) ?? null
  );
}
