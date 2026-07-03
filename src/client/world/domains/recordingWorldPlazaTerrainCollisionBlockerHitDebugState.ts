import type { DefiningWorldPlazaTerrainCollisionBlockerKind } from "@/components/world/domains/definingWorldPlazaTerrainCollisionBlockerKind";
import { DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_DISPLAY_DURATION_MS } from "@/components/world/domains/definingWorldPlazaTerrainCollisionBlockerHitDebugConstants";

/**
 * Stores the latest plaza movement blocker hit for debug overlays.
 *
 * @module components/world/domains/recordingWorldPlazaTerrainCollisionBlockerHitDebugState
 */

/** One recorded collision stop for debug display. */
export interface DefiningWorldPlazaTerrainCollisionBlockerHitDebugState {
  /** Which collision system blocked movement. */
  readonly kind: DefiningWorldPlazaTerrainCollisionBlockerKind;
  /** Short human-readable summary. */
  readonly label: string;
  /** Extra context (tile index, anchor, obstacle name). */
  readonly detail: string;
  /** Avatar position after collision resolution. */
  readonly gridX: number;
  /** Avatar position after collision resolution. */
  readonly gridY: number;
  /** Related tile column, when applicable. */
  readonly tileX: number | null;
  /** Related tile row, when applicable. */
  readonly tileY: number | null;
  /** Monotonic hit counter since the page loaded. */
  readonly hitCount: number;
  /** `performance.now()` when the hit was recorded. */
  readonly recordedAtMs: number;
}

/** Payload for {@link recordingWorldPlazaTerrainCollisionBlockerHitDebugState}. */
export interface RecordingWorldPlazaTerrainCollisionBlockerHitDebugStateInput {
  readonly kind: DefiningWorldPlazaTerrainCollisionBlockerKind;
  readonly label: string;
  readonly detail: string;
  readonly gridX: number;
  readonly gridY: number;
  readonly tileX?: number | null;
  readonly tileY?: number | null;
}

let recordingWorldPlazaTerrainCollisionBlockerHitDebugHitCount = 0;
let recordingWorldPlazaTerrainCollisionBlockerHitDebugLatestState: DefiningWorldPlazaTerrainCollisionBlockerHitDebugState | null =
  null;

/**
 * Records the latest blocker hit for debug overlays.
 *
 * @param hit - Resolved blocker metadata and stop position.
 */
export function recordingWorldPlazaTerrainCollisionBlockerHitDebugState(
  hit: RecordingWorldPlazaTerrainCollisionBlockerHitDebugStateInput,
): void {
  recordingWorldPlazaTerrainCollisionBlockerHitDebugHitCount += 1;

  recordingWorldPlazaTerrainCollisionBlockerHitDebugLatestState = {
    kind: hit.kind,
    label: hit.label,
    detail: hit.detail,
    gridX: hit.gridX,
    gridY: hit.gridY,
    tileX: hit.tileX ?? null,
    tileY: hit.tileY ?? null,
    hitCount: recordingWorldPlazaTerrainCollisionBlockerHitDebugHitCount,
    recordedAtMs: performance.now(),
  };
}

/**
 * Returns the latest blocker hit while it is still within the display window.
 */
export function readingWorldPlazaTerrainCollisionBlockerHitDebugState(): DefiningWorldPlazaTerrainCollisionBlockerHitDebugState | null {
  const latestState = recordingWorldPlazaTerrainCollisionBlockerHitDebugLatestState;

  if (!latestState) {
    return null;
  }

  if (
    performance.now() - latestState.recordedAtMs >
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_HIT_DISPLAY_DURATION_MS
  ) {
    return null;
  }

  return latestState;
}

/**
 * Clears stored blocker-hit debug state.
 */
export function clearingWorldPlazaTerrainCollisionBlockerHitDebugState(): void {
  recordingWorldPlazaTerrainCollisionBlockerHitDebugLatestState = null;
}
