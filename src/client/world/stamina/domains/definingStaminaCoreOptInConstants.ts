/**
 * Opt-in switch for shared stamina core tick.
 *
 * Default false: player and wildlife keep their existing advance paths.
 * Set true to route wrappers through {@link advancingStaminaCoreTick}.
 *
 * @module components/world/stamina/domains/definingStaminaCoreOptInConstants
 */

/**
 * When true, wildlife and player stamina wrappers delegate the drain/regen/latch
 * loop to `advancingStaminaCoreTick`. Default stays on legacy paths.
 */
export const DEFINING_STAMINA_CORE_TICK_OPT_IN = false as const;
