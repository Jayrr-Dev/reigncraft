/**
 * Declarative Spritcore death-penalty fractions.
 *
 * Carried inventory cores and invested (committed) upgrade spend both spill
 * on death so respawn returns a weaker character.
 *
 * @module components/world/spritcore/domains/definingWorldPlazaSpritcoreDeathDropConstants
 */

/** Fraction of inventory Spritcore spilled to the ground on death. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_DEATH_CARRIED_DROP_FRACTION = 0.2;

/** Fraction of committed (invested) Spritcore spilled + stripped from upgrades. */
export const DEFINING_WORLD_PLAZA_SPRITCORE_DEATH_COMMITTED_DROP_FRACTION = 0.1;
