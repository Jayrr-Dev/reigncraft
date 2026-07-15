/**
 * Authored copy slots unlocked by unified codex study tiers.
 *
 * @module components/home/domains/definingPlazaCodexEntryContentSlots
 */

/** Player-written or designer-authored prose keyed to study tier unlocks. */
export type PlazaCodexEntryAuthoredSlots = {
  /** Tier 2 familiarity: sensory / look copy, no mechanics. */
  sensoryDescription?: string;
  /** Tier 3 understanding: researcher field notes. */
  fieldNotes?: string;
  /** Tier 4 application: vague observed effects and origins. */
  observedEffects?: string;
  /** Tier 5 proficiency: preparation notes (raw, cooked, tea, traps). */
  preparationNotes?: string;
  /** Tier 7 mastery: final apostle or flavor line. */
  apostleFlavor?: string;
};

/** Legacy flat guide entry shape still used during migration. */
export type PlazaCodexLegacyGuideCopy = {
  summary: string;
  studiedSummary: string;
  propertiesSummary?: string;
  apostleFlavor?: string;
};

/** Maps legacy guide fields onto unified authored slots. */
export function resolvingPlazaCodexAuthoredSlotsFromLegacyCopy(
  legacy: PlazaCodexLegacyGuideCopy
): PlazaCodexEntryAuthoredSlots {
  return {
    sensoryDescription: legacy.summary,
    fieldNotes: legacy.studiedSummary,
    observedEffects: legacy.propertiesSummary,
    preparationNotes: legacy.propertiesSummary,
    apostleFlavor: legacy.apostleFlavor,
  };
}
