import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';

/** Right-side anchor for the local player status effect stack. */
export const STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.statusEffectStack
    .desktopAnchorClassName;

/** Right-aligned anchor below the minimap on narrow viewports. */
export const STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_MOBILE_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.statusEffectStack
    .mobileAnchorClassName;

/** Popover placement for badges in the top-right status stack. */
export const DEFINING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_EXPLANATION_POPOVER_LAYOUT =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.statusEffectStack
    .explanationPopover;

/** Estimated room-status block height for stacking status badges below it. */
export const DEFINING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_BELOW_ROOM_HUD_ESTIMATED_OCCUPIED_BASE_PX =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.statusEffectStack
    .belowRoomHudEstimatedOccupiedBasePx;

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
