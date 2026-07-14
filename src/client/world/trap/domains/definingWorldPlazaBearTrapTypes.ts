/**
 * Declarative types for player-placed bear traps.
 *
 * @module components/world/trap/domains/definingWorldPlazaBearTrapTypes
 */

export type DefiningWorldPlazaBearTrapId = string;

/**
 * `armed` — open jaws, triggers on walk-over.
 * `sprung` — closed after a trigger; Arm / Disarm / Pick up.
 * `disarmed` — closed safe; Arm / Pick up (no Disarm needed).
 */
export type DefiningWorldPlazaBearTrapState = 'armed' | 'sprung' | 'disarmed';

export type DefiningWorldPlazaBearTrapInstance = {
  readonly trapId: DefiningWorldPlazaBearTrapId;
  readonly position: { readonly x: number; readonly y: number };
  readonly state: DefiningWorldPlazaBearTrapState;
  readonly ownerId: string | null;
  /** Wall-clock ms when the closing snap animation started, or null when idle. */
  readonly snapStartedAtMs: number | null;
  /** Last resolved snap animation frame (0 open … 3 closed). */
  readonly snapFrame: number;
};

export type DefiningWorldPlazaBearTrapPlacement = {
  readonly trapId: DefiningWorldPlazaBearTrapId;
  readonly worldX: number;
  readonly worldY: number;
  readonly state: DefiningWorldPlazaBearTrapState;
  readonly ownerId: string | null;
};
