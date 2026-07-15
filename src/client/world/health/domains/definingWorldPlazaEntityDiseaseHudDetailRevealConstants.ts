/**
 * Study-gated reveal flags for active disease HUD tooltip copy.
 *
 * Thresholds match Pathology study tiers so the in-run badge unlocks with the
 * same progress as the Guide dossier (infection hours + linked creature Study).
 *
 * Player-facing stages on the unified ladder:
 * - awareness (0): unknown illness, vague body note
 * - familiarity (1): name, severity, flavor
 * - understanding+ (5): active / upcoming mechanical stage lines
 *
 * @module components/world/health/domains/definingWorldPlazaEntityDiseaseHudDetailRevealConstants
 */

import type { PlazaCodexStudyTierId } from '@/components/home/domains/definingPlazaCodexStudyTier';

/** Which disease HUD tooltip fields are visible at one Pathology knowledge tier. */
export type DefiningWorldPlazaEntityDiseaseHudDetailReveal = {
  readonly showName: boolean;
  readonly showSeverity: boolean;
  readonly showDescription: boolean;
  readonly showEffectLines: boolean;
};

/** Title when Pathology study has not reached familiarity yet. */
export const LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_UNKNOWN_NAME =
  'Unknown Illness' as const;

/** Body copy while the illness identity is still locked. */
export const LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_UNKNOWN_DESCRIPTION =
  'Something is wrong. Endure it longer, or study carriers in Pathology.' as const;

/** Teaser when name is known but stage mechanics stay locked. */
export const LABELING_WORLD_PLAZA_ENTITY_DISEASE_HUD_EFFECTS_TEASER =
  'Needs more study....' as const;

/**
 * Progressive disease HUD unlocks keyed by unified Pathology study tier.
 *
 * Higher tiers past understanding keep full mechanical depth.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_DISEASE_HUD_DETAIL_REVEAL_BY_TIER: Readonly<
  Record<PlazaCodexStudyTierId, DefiningWorldPlazaEntityDiseaseHudDetailReveal>
> = {
  awareness: {
    showName: false,
    showSeverity: false,
    showDescription: false,
    showEffectLines: false,
  },
  familiarity: {
    showName: true,
    showSeverity: true,
    showDescription: true,
    showEffectLines: false,
  },
  understanding: {
    showName: true,
    showSeverity: true,
    showDescription: true,
    showEffectLines: true,
  },
  application: {
    showName: true,
    showSeverity: true,
    showDescription: true,
    showEffectLines: true,
  },
  proficiency: {
    showName: true,
    showSeverity: true,
    showDescription: true,
    showEffectLines: true,
  },
  expertise: {
    showName: true,
    showSeverity: true,
    showDescription: true,
    showEffectLines: true,
  },
  mastery: {
    showName: true,
    showSeverity: true,
    showDescription: true,
    showEffectLines: true,
  },
};
