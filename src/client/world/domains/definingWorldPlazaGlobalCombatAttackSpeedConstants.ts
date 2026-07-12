/**
 * Global melee attack-speed scale for players and wildlife.
 *
 * 1 = catalog / character-engine baseline.
 * 0.5 = half speed (swings take twice as long).
 * 2 = double speed.
 *
 * Tune this single knob to retune all attack cadence without editing
 * per-character or per-species intervals.
 *
 * @module components/world/domains/definingWorldPlazaGlobalCombatAttackSpeedConstants
 */

/**
 * Multiplier on effective attack speed for every player character and mob.
 * Lower slows everyone; higher speeds everyone up.
 */
export const DEFINING_WORLD_PLAZA_GLOBAL_ATTACK_SPEED_SCALE = 0.5;

/** Floor so a mis-set scale cannot divide by zero or freeze swings forever. */
export const DEFINING_WORLD_PLAZA_GLOBAL_ATTACK_SPEED_SCALE_MIN = 0.05;
