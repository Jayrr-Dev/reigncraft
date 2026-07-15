/**
 * Shared bag/popover inspect reveal flags keyed by unified codex study tiers.
 *
 * Domain reveal maps extend these progressive unlocks. Rarity and stack meta
 * stay visible from awareness; Study progress teases until mastery.
 *
 * @module components/world/inventory/domains/definingPlazaCodexInventoryRevealByTier
 */

import type { PlazaCodexStudyTierId } from '@/components/home/domains/definingPlazaCodexStudyTier';

/**
 * Base inspect unlocks shared across herbarium, lapidary, and bestiary bag UI.
 *
 * - awareness: rarity/stack/meta, study tease, no description body
 * - familiarity: sensory / summary depth 1
 * - understanding: field notes depth
 * - application: vague properties / observed effects
 * - proficiency: prep notes, effect labels without exact numbers
 * - expertise: named buffs/debuffs, exact numbers, proc names
 * - mastery: durations, chances %, full dossier
 */
export type DefiningPlazaCodexInventoryRevealBase = {
  /**
   * Flavor copy depth:
   * 0 hidden, 1 sensory summary, 2 field notes, 3 full studied body.
   */
  readonly descriptionTier: 0 | 1 | 2 | 3;
  readonly showStudyProgress: boolean;
  readonly showGenericItemMeta: boolean;
  /** Vague properties / observed effects line. */
  readonly showPropertiesSummary: boolean;
  /** Effect / risk labels without exact numbers. */
  readonly showEffectLabels: boolean;
  /** Named buffs/debuffs and exact mechanic numbers. */
  readonly showEffectNumbers: boolean;
  /** Durations, proc chances %, residual odds. */
  readonly showEffectChances: boolean;
};

/** Progressive bag inspect unlocks for every codex study track. */
export const DEFINING_PLAZA_CODEX_INVENTORY_REVEAL_BY_TIER: Readonly<
  Record<PlazaCodexStudyTierId, DefiningPlazaCodexInventoryRevealBase>
> = {
  awareness: {
    descriptionTier: 0,
    showStudyProgress: true,
    showGenericItemMeta: true,
    showPropertiesSummary: false,
    showEffectLabels: false,
    showEffectNumbers: false,
    showEffectChances: false,
  },
  familiarity: {
    descriptionTier: 1,
    showStudyProgress: true,
    showGenericItemMeta: true,
    showPropertiesSummary: false,
    showEffectLabels: false,
    showEffectNumbers: false,
    showEffectChances: false,
  },
  understanding: {
    descriptionTier: 2,
    showStudyProgress: true,
    showGenericItemMeta: true,
    showPropertiesSummary: false,
    showEffectLabels: false,
    showEffectNumbers: false,
    showEffectChances: false,
  },
  application: {
    descriptionTier: 2,
    showStudyProgress: true,
    showGenericItemMeta: true,
    showPropertiesSummary: true,
    showEffectLabels: false,
    showEffectNumbers: false,
    showEffectChances: false,
  },
  proficiency: {
    descriptionTier: 3,
    showStudyProgress: true,
    showGenericItemMeta: true,
    showPropertiesSummary: true,
    showEffectLabels: true,
    showEffectNumbers: false,
    showEffectChances: false,
  },
  expertise: {
    descriptionTier: 3,
    showStudyProgress: true,
    showGenericItemMeta: true,
    showPropertiesSummary: true,
    showEffectLabels: true,
    showEffectNumbers: true,
    showEffectChances: false,
  },
  mastery: {
    descriptionTier: 3,
    showStudyProgress: true,
    showGenericItemMeta: true,
    showPropertiesSummary: true,
    showEffectLabels: true,
    showEffectNumbers: true,
    showEffectChances: true,
  },
};
