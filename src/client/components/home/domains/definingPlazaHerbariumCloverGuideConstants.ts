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
  /** Properties tier copy (four-leaf stays vague until full combined study). */
  propertiesSummary: string;
  /** Full-dossier properties for four-leaf once combined study hits 100. */
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
  ] as const;

/** Hint for undiscovered clover cards. */
export const LABELING_PLAZA_HERBARIUM_UNDISCOVERED_CLOVER_HINT =
  'Search long grass to log your first clover.' as const;

/** Vague four-leaf inspect copy while Lucky is active and study is below full. */
export const LABELING_PLAZA_HERBARIUM_CLOVER_LUCKY_ACTIVE_VAGUE_DESCRIPTION =
  "You're feeling really lucky today." as const;

/** Teaser on four-leaf inspect before full clover study. */
export const LABELING_PLAZA_HERBARIUM_CLOVER_LUCKY_EFFECTS_LOCKED_TEASER =
  'Study 100 clovers in the Herbarium to learn what the charm actually does.' as const;
