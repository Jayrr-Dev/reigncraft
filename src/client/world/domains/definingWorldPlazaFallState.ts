import type { DefiningWorldPlazaGirlSampleWalkDirection } from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";

/** Active fall motion state for the local plaza avatar. */
export interface DefiningWorldPlazaFallState {
  /** World layer before the drop. */
  startLayer: number;
  /** World layer after sync applied the drop. */
  targetLayer: number;
  /** Layers descended during this fall. */
  layerDelta: number;
  /** Fall start timestamp from {@link performance.now}. */
  startedAtMs: number;
  /** Facing strip used for the fall animation. */
  direction: DefiningWorldPlazaGirlSampleWalkDirection;
  /** Total vertical screen travel for this fall (pixels). */
  totalDropScreenPx: number;
}
