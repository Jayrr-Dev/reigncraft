/**
 * Storage keys and anchor ids for plaza onboarding coachmarks.
 *
 * @module components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants
 */

/** localStorage key prefix; suffixed with `:${storageOwnerId}` when scoped. */
export const DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARKS_STORAGE_KEY_PREFIX =
  'world-plaza-onboarding-coachmarks' as const;

/**
 * localStorage key prefix for "core tutorial finished" (move / hotbar / action-bar).
 * Survives step-list loss so core tips never replay after the player finishes them.
 */
export const DEFINING_WORLD_PLAZA_ONBOARDING_CORE_FINISHED_STORAGE_KEY_PREFIX =
  'world-plaza-onboarding-core-finished' as const;

/** DOM attribute used to locate HUD targets for coachmark glow + tip placement. */
export const DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE =
  'data-plaza-onboarding-anchor' as const;

/** Stable id for one onboarding coachmark step. */
export type WorldPlazaOnboardingCoachmarkStepId =
  | 'move'
  | 'hotbar'
  | 'action-bar'
  | 'chop'
  | 'forage'
  | 'mine'
  | 'loot'
  | 'equip-tool'
  | 'melee'
  | 'hunger'
  | 'temperature'
  | 'stamina'
  | 'status-effects'
  | 'craft'
  | 'cook'
  | 'codex'
  | 'herbarium'
  | 'study'
  | 'transform'
  | 'minimap'
  | 'build'
  | 'claim'
  | 'spritcore'
  | 'pets';

/** DOM anchor ids referenced by coachmark steps. */
export type WorldPlazaOnboardingCoachmarkAnchorId =
  | 'move-hint'
  | 'hotbar'
  | 'action-bar'
  | 'chop-interaction'
  | 'forage-interaction'
  | 'mine-interaction'
  | 'equip-tool-slot'
  | 'hunger-orb'
  | 'temperature-orb'
  | 'stamina-bar'
  | 'status-effect-stack'
  | 'hud-toolbar-craft'
  | 'hud-toolbar-build-claim'
  | 'codex-book'
  | 'cook-interaction'
  | 'study-interaction'
  | 'transform-control'
  | 'minimap-orb'
  | 'profile-panel'
  | 'pets-roster';

export type WorldPlazaOnboardingCoachmarkPhase = 'core' | 'contextual';

export type WorldPlazaOnboardingCoachmarkAdvanceEvent =
  | 'move'
  | 'hotbar-click'
  | 'action-bar-click'
  | 'chop-start'
  | 'forage-pick'
  | 'mine-start'
  | 'loot-pickup'
  | 'equip-tool'
  | 'melee-swing'
  | 'hunger-click'
  | 'temperature-click'
  | 'stamina-sprint'
  | 'status-effect-click'
  | 'craft-mode-select'
  | 'cook-start'
  | 'codex-open'
  | 'herbarium-codex-open'
  | 'study-start'
  | 'transform-open'
  | 'minimap-open'
  | 'build-mode-select'
  | 'claim-mode-select'
  | 'spritcore-view'
  | 'pets-open';

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

/**
 * Resolves the localStorage key for the durable core-tutorial-finished flag.
 *
 * @param storageOwnerId - Session owner id, or null for the legacy global key.
 */
export function resolvingWorldPlazaOnboardingCoreFinishedStorageKey(
  storageOwnerId: string | null
): string {
  if (storageOwnerId) {
    return `${DEFINING_WORLD_PLAZA_ONBOARDING_CORE_FINISHED_STORAGE_KEY_PREFIX}:${storageOwnerId}`;
  }

  return DEFINING_WORLD_PLAZA_ONBOARDING_CORE_FINISHED_STORAGE_KEY_PREFIX;
}

/** Pulse ring applied to the active coachmark anchor element. */
export const STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_GLOW_CLASS_NAME =
  'plaza-onboarding-coachmark-glow' as const;

/** Gap between tip card and its HUD / interaction anchor. */
export const DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_OFFSET_PX =
  12 as const;

/**
 * Soft tips auto-dismiss so they never demand a tap during combat or death.
 * Outside click / Escape / Got it still complete the step immediately.
 */
export const DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_AUTO_DISMISS_MS =
  8_000 as const;

/**
 * Authored tip width: `min(14rem, 100vw - 2rem)`.
 * Explicit width (not max-width) so abspos shrink-to-fit cannot crush the card
 * when the anchor sits near the right edge of a narrow mobile viewport.
 */
export const DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_MAX_WIDTH_REM =
  14 as const;

export const DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_VIEWPORT_GUTTER_REM =
  2 as const;

/**
 * Tip layer paints above bottom HUD chrome (hotbar / mode badges at z-50) and
 * under item-detail / profile overlays (z-60+). Death tips stay hidden via
 * `isPlayerDead` rather than z-order. Pointer-events stay off on the layer.
 */
export const STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_LAYER_CLASS_NAME =
  'pointer-events-none fixed inset-0 z-[55]' as const;

/** Tip card shell (quiet parchment chip, not a modal). */
export const STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_CLASS_NAME =
  'pointer-events-auto select-none rounded border border-poster-wood/55 bg-[linear-gradient(165deg,#f0e2c4f2_0%,#e3d1a8f0_100%)] px-2.5 py-1.5 shadow-[inset_0_0_0_1px_rgba(255,250,230,0.45),0_3px_10px_rgba(20,28,26,0.28)] w-[min(14rem,calc(100vw-2rem))] box-border' as const;

export const STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_TITLE_CLASS_NAME =
  'font-display text-xs font-semibold text-poster-wood' as const;

export const STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_BODY_CLASS_NAME =
  'mt-0.5 text-[11px] leading-snug text-poster-wood/85' as const;

export const STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_ACTIONS_CLASS_NAME =
  'mt-1.5 flex justify-end' as const;

export const STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_DISMISS_BUTTON_CLASS_NAME =
  'rounded border border-poster-wood/40 bg-poster-teal-deep/5 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-poster-wood/80 hover:bg-poster-teal-deep/15' as const;
