import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';

/** Right-side anchor for the local player status effect stack. */
export const STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.statusEffectStack
    .desktopAnchorClassName;

/** Right-aligned anchor below the action bar on narrow viewports. */
export const STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_MOBILE_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.statusEffectStack
    .mobileAnchorClassName;

/** Gap between the action bar shell and the mobile status stack. */
export const DEFINING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_MOBILE_BELOW_ACTION_BAR_GAP_BASE_PX =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.statusEffectStack
    .mobileBelowActionBarGapBasePx;

/** Popover placement for badges in the top-right status stack. */
export const DEFINING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_EXPLANATION_POPOVER_LAYOUT =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.statusEffectStack
    .explanationPopover;

/** Top offset when no online room HUD is visible. */
export const STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_TOP_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.statusEffectStack
    .desktopTopClassName;

/** Top offset on narrow viewports when no online room HUD is visible. */
export const STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_MOBILE_TOP_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.statusEffectStack
    .mobileTopClassName;

/** Top offset below the online room status HUD on md+ viewports. */
export const STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_TOP_WITH_ROOM_HUD_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.statusEffectStack
    .topWithRoomHudClassName;

/**
 * Resolves top offset for the status effect stack.
 */
export function resolvingWorldPlazaEntityStatusEffectStackTopClassName(
  hasOnlineRoomHud: boolean,
  isMobile = false
): string {
  if (hasOnlineRoomHud) {
    return STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_TOP_WITH_ROOM_HUD_CLASS_NAME;
  }

  return isMobile
    ? STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_MOBILE_TOP_CLASS_NAME
    : STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_TOP_CLASS_NAME;
}

/**
 * Resolves anchor classes for the status effect stack.
 */
export function resolvingWorldPlazaEntityStatusEffectStackAnchorClassName(
  isMobile = false
): string {
  return isMobile
    ? STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_MOBILE_ANCHOR_CLASS_NAME
    : STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_ANCHOR_CLASS_NAME;
}
