import type { WorldCloverSearchLootKind } from '../../../../shared/worldCloverSearchLoot';

/** One clover entry in the codex herbarium guide. */
export type DefiningPlazaHerbariumCloverEntry = {
  cloverKind: WorldCloverSearchLootKind;
  displayName: string;
  icon: string;
  /** Shown after the player finds this clover kind once. */
  summary: string;
  /** Shown after the first Study point on the shared clover track. */
  studiedSummary: string;
  /** Properties tier copy (lucky leaves stay vague until their study gate). */
  propertiesSummary: string;
  /** Full-dossier properties once the kind's study gate is met. */
  propertiesSummaryFull?: string;
};

/** Clover guide entries (shared combined study progress). */
export const DEFINING_PLAZA_HERBARIUM_CLOVER_GUIDE_ENTRIES: readonly DefiningPlazaHerbariumCloverEntry[] =
  [
    {
      cloverKind: 'three_leaf',
      displayName: 'Three-leaf clover',
      icon: 'mdi:clover',
      summary: 'A common shamrock tangled in long grass.',
      studiedSummary:
        'Three-leaf clovers turn up in almost every long-grass search. Wanderers pocket them for luck that never quite arrives.',
      propertiesSummary: 'Common forage. No studied effect when held.',
    },
    {
      cloverKind: 'four_leaf',
      displayName: 'Four-leaf clover',
      icon: 'mdi:clover',
      summary: 'A rare fourth leaf tucked in the tangle.',
      studiedSummary:
        'Four-leaf clovers are scarce enough that most field notes stop at superstition. Hold one and something shifts, but the books disagree on what.',
      propertiesSummary:
        'Held: something favors you. Field notes are not detailed enough to say how.',
      propertiesSummaryFull:
        'Held: Lucky charm. Halves disease risk, skews damage taken safer and damage dealt stronger, improves rare finds, and raises food buff chances until the leaf fades (1 in-game day while held).',
    },
    {
      cloverKind: 'five_leaf',
      displayName: 'Five-leaf clover',
      icon: 'mdi:clover',
      summary: 'Five leaves in a tight star. Almost never in the same patch twice.',
      studiedSummary:
        'Five-leaf finds are logged as miscounts more often than miracles. The ones that stay real feel louder than a four-leaf when you hold them.',
      propertiesSummary:
        'Held: Lucky, but stronger. Study 500 clovers to pin down the multiplier.',
      propertiesSummaryFull:
        'Held: Lucky charm at 1.5× potency. Same day-long fade as a four-leaf, with deeper disease cuts and stronger rare-find and food-buff boosts.',
    },
    {
      cloverKind: 'six_leaf',
      displayName: 'Six-leaf clover',
      icon: 'mdi:clover',
      summary: 'Six leaves. Field guides call it a rumor until someone bags one.',
      studiedSummary:
        'Six-leaf clovers barely make the margins of herbarium ledgers. Finding one is surprise loot; keeping it is another problem.',
      propertiesSummary:
        'Held: Lucky beyond the usual charm. Study 1000 clovers before the numbers settle.',
      propertiesSummaryFull:
        'Held: Lucky charm at 2× potency. Surprise long-grass loot. Same day-long fade, with the strongest disease cut and rare-find boosts in the clover line.',
    },
  ] as const;

/** Hint for undiscovered clover cards. */
export const LABELING_PLAZA_HERBARIUM_UNDISCOVERED_CLOVER_HINT =
  'Search long grass to log your first clover.' as const;

/** Vague lucky-charm inspect copy while Lucky is active and study is below full. */
export const LABELING_PLAZA_HERBARIUM_CLOVER_LUCKY_ACTIVE_VAGUE_DESCRIPTION =
  "You're feeling really lucky today." as const;

/** Teaser on lucky clovers before full clover study. */
export const LABELING_PLAZA_HERBARIUM_CLOVER_LUCKY_EFFECTS_LOCKED_TEASER =
  'Study 1000 clovers in the Herbarium to learn what the charm actually does.' as const;

/** Teaser for five-leaf details before the 500 study gate. */
export const LABELING_PLAZA_HERBARIUM_CLOVER_FIVE_LEAF_LOCKED_TEASER =
  'Study 500 clovers in the Herbarium to learn what a five-leaf charm does.' as const;
