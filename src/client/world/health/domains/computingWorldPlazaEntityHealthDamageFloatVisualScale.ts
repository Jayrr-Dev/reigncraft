import {
  listingWorldPlazaEntityHealthFloatTextKindLowTierVisualMagnitudes,
  listingWorldPlazaEntityHealthFloatTextKindVisualMagnitudes,
} from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierRegistry';
import type { DefiningWorldPlazaEntityHealthFloatTextKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';
import { isWorldPlazaEntityHealthFloatDamageKind } from '@/components/world/health/domains/formattingWorldPlazaEntityHealthFloatTextLabel';

/** Baseline font size for a normal (0σ) damage float. */
export const COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_BASE_FONT_PX = 24;

/** Font growth per |σ| away from expected — applies to high and low rolls. */
export const COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_FONT_PX_PER_ABSOLUTE_SD = 5;

/** Soft cap so UI stays readable on astronomically rare tail hits. */
export const COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_MAX_FONT_PX = 80;

/** Base on-screen time for damage floats before |σ| scaling. */
export const COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_BASE_LIFETIME_MS = 1200;

/** Extra linger per |σ| for extreme high/low outcomes. */
export const COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_LIFETIME_MS_PER_ABSOLUTE_SD = 100;

/** Base CSS animation length for damage floats (seconds). */
export const COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_BASE_ANIMATION_SEC = 1.1;

/** Animation extension per |σ|. */
export const COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_ANIMATION_SEC_PER_ABSOLUTE_SD = 0.06;

const COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_KIND_ABSOLUTE_SD =
  listingWorldPlazaEntityHealthFloatTextKindVisualMagnitudes();

/** Low-tier floats: softened smallest → blocked mid → dodged largest. */
const COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_LOW_TIER_VISUAL_MAGNITUDE =
  listingWorldPlazaEntityHealthFloatTextKindLowTierVisualMagnitudes();

/**
 * Resolves |σ| for sizing/linger — uses the roll score when present, otherwise
 * approximates from the outcome tier kind. Low tiers use inverted visual weight.
 */
export function resolvingWorldPlazaEntityHealthDamageFloatAbsoluteDeviationScore({
  kind,
  deviationScore,
}: {
  kind: DefiningWorldPlazaEntityHealthFloatTextKind;
  deviationScore?: number | null;
}): number {
  const lowTierMagnitude =
    COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_LOW_TIER_VISUAL_MAGNITUDE[
      kind
    ];

  if (lowTierMagnitude !== undefined) {
    return lowTierMagnitude;
  }

  if (deviationScore !== null && deviationScore !== undefined) {
    return Math.abs(deviationScore);
  }

  return (
    COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_KIND_ABSOLUTE_SD[kind] ?? 0
  );
}

/** Font size grows with |σ| so extreme high and low rolls both read larger. */
export function computingWorldPlazaEntityHealthDamageFloatFontSizePx({
  kind,
  deviationScore,
}: {
  kind: DefiningWorldPlazaEntityHealthFloatTextKind;
  deviationScore?: number | null;
}): number {
  if (!isWorldPlazaEntityHealthFloatDamageKind(kind)) {
    return COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_BASE_FONT_PX;
  }

  const absoluteDeviationScore =
    resolvingWorldPlazaEntityHealthDamageFloatAbsoluteDeviationScore({
      kind,
      deviationScore,
    });

  return Math.min(
    COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_MAX_FONT_PX,
    Math.round(
      COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_BASE_FONT_PX +
        absoluteDeviationScore *
          COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_FONT_PX_PER_ABSOLUTE_SD
    )
  );
}

/** On-screen lifetime scales with |σ| for damage floats. */
export function computingWorldPlazaEntityHealthDamageFloatLifetimeMs({
  kind,
  deviationScore,
}: {
  kind: DefiningWorldPlazaEntityHealthFloatTextKind;
  deviationScore?: number | null;
}): number {
  if (!isWorldPlazaEntityHealthFloatDamageKind(kind)) {
    return 0;
  }

  const absoluteDeviationScore =
    resolvingWorldPlazaEntityHealthDamageFloatAbsoluteDeviationScore({
      kind,
      deviationScore,
    });

  return Math.round(
    COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_BASE_LIFETIME_MS +
      absoluteDeviationScore *
        COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_LIFETIME_MS_PER_ABSOLUTE_SD
  );
}

/** CSS animation duration matched to linger and |σ|. */
export function computingWorldPlazaEntityHealthDamageFloatAnimationDurationSec({
  kind,
  deviationScore,
}: {
  kind: DefiningWorldPlazaEntityHealthFloatTextKind;
  deviationScore?: number | null;
}): number {
  if (!isWorldPlazaEntityHealthFloatDamageKind(kind)) {
    return 1.4;
  }

  const absoluteDeviationScore =
    resolvingWorldPlazaEntityHealthDamageFloatAbsoluteDeviationScore({
      kind,
      deviationScore,
    });

  return (
    COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_BASE_ANIMATION_SEC +
    absoluteDeviationScore *
      COMPUTING_WORLD_PLAZA_ENTITY_HEALTH_DAMAGE_FLOAT_ANIMATION_SEC_PER_ABSOLUTE_SD
  );
}
