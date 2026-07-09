/**
 * Copy and timed-interaction chrome for docile-animal Betray? labels.
 *
 * @module components/world/wildlife/domains/definingWildlifeDocileAttackConfirmConstants
 */

/** Outlined label above an unauthorized docile animal (confirm phase). */
export const LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_TITLE = 'Betray?' as const;

/** Outlined label while the betrayal windup runs. */
export const LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BETRAYING_TITLE =
  'Betraying....' as const;

/** Bundled Iconify id for the betrayal progress ring center icon. */
export const DEFINING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BACKSTAB_ICON =
  'game-icons:backstab' as const;

/** Delay after activating Betray? before damage applies (ms). */
export const DEFINING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BETRAY_WINDUP_MS =
  2_000 as const;
