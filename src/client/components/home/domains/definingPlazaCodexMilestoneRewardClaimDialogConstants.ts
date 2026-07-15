/**
 * Copy and chrome for Codex milestone reward claim dialog.
 *
 * @module components/home/domains/definingPlazaCodexMilestoneRewardClaimDialogConstants
 */

import { DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE } from '@/components/world/domains/definingWorldPlazaConfirmDialogConstants';

/** Fixed overlay over the full viewport. */
export const STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_OVERLAY_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.overlayFixed;

/** Parchment panel shell. */
export const STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_PANEL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.panel} plaza-pop-in flex flex-col items-center text-center`;

/** Body stack: art, title, description. */
export const STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_BODY_CLASS_NAME =
  'flex w-full flex-col items-center gap-3';

/** Eyebrow above the reward name. */
export const STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_EYEBROW_CLASS_NAME =
  'font-display text-[0.65rem] font-bold uppercase tracking-[0.14em] text-poster-gold';

/** Large reward name. */
export const STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_TITLE_CLASS_NAME =
  'font-display text-lg font-bold tracking-wide text-poster-teal-deep';

/** Short claim blurb under the title. */
export const STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_DESCRIPTION_CLASS_NAME =
  'text-sm font-medium italic leading-snug text-ink-soft';

/** Circular socket holding the reward glyph. */
export const STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_ART_SHELL_CLASS_NAME =
  'flex size-20 items-center justify-center rounded-full border-2 border-poster-gold/70 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-poster-gold shadow-[0_3px_0_0_#14252b,0_8px_18px_rgba(20,28,26,0.28)]';

/** Iconify / sprite size inside the art shell. */
export const STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_ART_ICON_CLASS_NAME =
  'size-10 shrink-0';

/** Dismiss action row. */
export const STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_ACTIONS_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.actions;

/** Primary dismiss button. */
export const STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_DISMISS_BUTTON_CLASS_NAME =
  DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.singleActionButton;

/** Accessible dialog label. */
export const LABELING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_ARIA =
  'Codex milestone reward claimed' as const;

/** Eyebrow copy above the reward name. */
export const LABELING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_EYEBROW =
  'Reward unlocked' as const;

/** Dismiss button label. */
export const LABELING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_DISMISS =
  'Nice' as const;
