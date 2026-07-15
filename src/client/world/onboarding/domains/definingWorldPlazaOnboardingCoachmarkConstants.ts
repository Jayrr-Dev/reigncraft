/**
 * Storage keys and anchor ids for plaza onboarding coachmarks.
 *
 * @module components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants
 */

/** localStorage key prefix; suffixed with `:${storageOwnerId}` when scoped. */
export const DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARKS_STORAGE_KEY_PREFIX =
  'world-plaza-onboarding-coachmarks' as const;

/** DOM attribute used to locate HUD targets for coachmark glow + tip placement. */
export const DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE =
  'data-plaza-onboarding-anchor' as const;

/** Stable id for one onboarding coachmark step. */
export type WorldPlazaOnboardingCoachmarkStepId =
  | 'move'
  | 'hotbar'
  | 'action-bar'
  | 'chop'
  | 'loot'
  | 'equip-tool';

/** DOM anchor ids referenced by coachmark steps. */
export type WorldPlazaOnboardingCoachmarkAnchorId =
  | 'move-hint'
  | 'hotbar'
  | 'action-bar'
  | 'chop-interaction'
  | 'equip-tool-slot';

export type WorldPlazaOnboardingCoachmarkPhase = 'core' | 'contextual';

export type WorldPlazaOnboardingCoachmarkAdvanceEvent =
  | 'move'
  | 'hotbar-click'
  | 'action-bar-click'
  | 'chop-start'
  | 'loot-pickup'
  | 'equip-tool';

export type WorldPlazaOnboardingCoachmarkDefinition = {
  readonly id: WorldPlazaOnboardingCoachmarkStepId;
  readonly phase: WorldPlazaOnboardingCoachmarkPhase;
  readonly title: string;
  readonly descriptionDesktop: string;
  readonly descriptionMobile: string;
  readonly targetAnchorId: WorldPlazaOnboardingCoachmarkAnchorId | null;
  readonly advanceEvent: WorldPlazaOnboardingCoachmarkAdvanceEvent;
  readonly tipPlacement: 'above' | 'below' | 'center';
};

/**
 * Resolves the localStorage key for completed onboarding coachmark steps.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaOnboardingCoachmarksStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARKS_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARKS_STORAGE_KEY_PREFIX;
}

/** Pulse ring applied to the active coachmark anchor element. */
export const STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_GLOW_CLASS_NAME =
  'plaza-onboarding-coachmark-glow' as const;

/** Tip card shell (compact parchment panel). */
export const STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_CLASS_NAME =
  'pointer-events-auto select-none rounded-md border-2 border-poster-wood/70 bg-[linear-gradient(165deg,#f0e2c4_0%,#e3d1a8_100%)] px-3 py-2 shadow-[inset_0_0_0_1px_rgba(255,250,230,0.6),0_6px_16px_rgba(20,28,26,0.45)] max-w-[min(18rem,calc(100vw-1.5rem))]' as const;

export const STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_TITLE_CLASS_NAME =
  'font-display text-sm font-semibold text-poster-wood' as const;

export const STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_BODY_CLASS_NAME =
  'mt-1 text-xs leading-snug text-poster-wood/90' as const;

export const STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_ACTIONS_CLASS_NAME =
  'mt-2 flex justify-end' as const;

export const STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_DISMISS_BUTTON_CLASS_NAME =
  'rounded border border-poster-wood/50 bg-poster-teal-deep/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-poster-wood hover:bg-poster-teal-deep/20' as const;
