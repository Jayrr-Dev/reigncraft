import type { DefiningWorldPlazaGirlSampleWalkDirection } from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/** Active jump motion state for the local plaza avatar. */
export interface DefiningWorldPlazaJumpState {
  /** Facing strip used for the jump animation. */
  direction: DefiningWorldPlazaGirlSampleWalkDirection;
  /** Grid position when the jump started. */
  startPosition: DefiningWorldPlazaWorldPoint;
  /** Grid position where the jump lands. */
  targetPosition: DefiningWorldPlazaWorldPoint;
  /** Jump start timestamp from {@link performance.now}. */
  startedAtMs: number;
  /** Jump start timestamp from {@link Date.now} for network sync. */
  networkStartedAtMs: number;
  /** True when the jump started while the avatar was running. */
  isRunJump: boolean;
  /** Peak arc height in screen pixels for this jump instance. */
  arcPeakScreenPx: number;
  /** World layer the avatar stood on when the jump started. */
  startLayer: number;
  /** World layer the avatar settles on when the jump lands. */
  landingLayer: number;
}
