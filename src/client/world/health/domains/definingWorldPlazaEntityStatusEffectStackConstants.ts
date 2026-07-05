/** Right-side anchor for the local player status effect stack. */
export const STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_ANCHOR_CLASS_NAME =
  'pointer-events-none absolute right-3 z-20 flex select-none flex-col items-end gap-1' as const;

/** Top offset when no online room HUD is visible. */
export const STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_TOP_CLASS_NAME =
  'top-3' as const;

/** Top offset below the online room status HUD on md+ viewports. */
export const STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_TOP_WITH_ROOM_HUD_CLASS_NAME =
  'top-3 md:top-28' as const;

/**
 * Resolves top offset for the status effect stack.
 */
export function resolvingWorldPlazaEntityStatusEffectStackTopClassName(
  hasOnlineRoomHud: boolean
): string {
  return hasOnlineRoomHud
    ? STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_TOP_WITH_ROOM_HUD_CLASS_NAME
    : STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_TOP_CLASS_NAME;
}
