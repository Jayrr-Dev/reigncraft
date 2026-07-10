/**
 * Fixed wildlife simulation timestep tuning.
 *
 * Sim runs at 30 Hz with accumulator catch-up so render stays at display rate
 * while AI/physics work halves on 60 Hz devices.
 *
 * @module components/world/wildlife/domains/definingWildlifeSimulationTimestepConstants
 */

/** Target wildlife simulation rate (Hz). */
export const DEFINING_WILDLIFE_SIMULATION_TICK_HZ = 30;

/** Fixed step duration in milliseconds for one sim tick. */
export const DEFINING_WILDLIFE_SIMULATION_TICK_MS =
  1000 / DEFINING_WILDLIFE_SIMULATION_TICK_HZ;

/** Max catch-up steps per render frame (avoids spiral-of-death after tab sleep). */
export const DEFINING_WILDLIFE_SIMULATION_MAX_STEPS_PER_FRAME = 2;
