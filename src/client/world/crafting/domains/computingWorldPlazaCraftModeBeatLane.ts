import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_DESPAWN_LEFT_PERCENT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_HALF_WIDTH_PERCENT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_TRAVEL_MS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_SPAWN_LEFT_PERCENT,
  type DefiningWorldPlazaCraftModeBeatNoteKind,
  type DefiningWorldPlazaCraftModeBeatPatternDefinition,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeBeatLaneConstants';

export type DefiningWorldPlazaCraftModeBeatLaneNote = {
  readonly noteId: string;
  readonly kind: DefiningWorldPlazaCraftModeBeatNoteKind;
  /** Wall time when the note center crosses the hit-zone center. */
  readonly hitAtMs: number;
  readonly resolved: boolean;
};

/**
 * Real ms for a freshly spawned note to reach the hit-zone center from the right.
 */
export function computingWorldPlazaCraftModeBeatTravelMsToHitZone(): number {
  const travelSpan =
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_SPAWN_LEFT_PERCENT -
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_DESPAWN_LEFT_PERCENT;
  const hitProgress =
    (DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_SPAWN_LEFT_PERCENT -
      DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT) /
    travelSpan;

  return hitProgress * DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_TRAVEL_MS;
}

/**
 * Lane X% for a note at `nowMs` (linear right → left).
 */
export function computingWorldPlazaCraftModeBeatNoteLeftPercent(
  note: Pick<DefiningWorldPlazaCraftModeBeatLaneNote, 'hitAtMs'>,
  nowMs: number
): number {
  const travelSpan =
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_SPAWN_LEFT_PERCENT -
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_DESPAWN_LEFT_PERCENT;
  const spawnAtMs =
    note.hitAtMs - computingWorldPlazaCraftModeBeatTravelMsToHitZone();
  const elapsedMs = nowMs - spawnAtMs;
  const t = Math.min(
    1,
    Math.max(0, elapsedMs / DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_TRAVEL_MS)
  );

  return (
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_SPAWN_LEFT_PERCENT - t * travelSpan
  );
}

/** True when the note center sits inside the dashed hit window. */
export function checkingWorldPlazaCraftModeBeatNoteInHitZone(
  leftPercent: number
): boolean {
  return (
    Math.abs(
      leftPercent - DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT
    ) <= DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_HALF_WIDTH_PERCENT
  );
}

/** True once the note has scrolled fully off the left edge. */
export function checkingWorldPlazaCraftModeBeatNoteDespawned(
  leftPercent: number
): boolean {
  return leftPercent <= DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_DESPAWN_LEFT_PERCENT;
}

/**
 * Builds live notes for one pattern wave starting at `patternStartMs`.
 * `patternStartMs` is when the first note should be centered in the hit zone.
 */
export function buildingWorldPlazaCraftModeBeatLaneNotesFromPattern(
  pattern: DefiningWorldPlazaCraftModeBeatPatternDefinition,
  patternStartMs: number,
  noteIdPrefix: string
): readonly DefiningWorldPlazaCraftModeBeatLaneNote[] {
  return pattern.notes.map((noteDefinition, index) => ({
    noteId: `${noteIdPrefix}-${pattern.id}-${index}`,
    kind: noteDefinition.kind,
    hitAtMs: patternStartMs + noteDefinition.hitOffsetMs,
    resolved: false,
  }));
}

/**
 * Picks the closest unresolved note currently inside the hit zone, if any.
 */
export function resolvingWorldPlazaCraftModeBeatLaneHitTarget(
  notes: readonly DefiningWorldPlazaCraftModeBeatLaneNote[],
  nowMs: number
): DefiningWorldPlazaCraftModeBeatLaneNote | null {
  let bestNote: DefiningWorldPlazaCraftModeBeatLaneNote | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const note of notes) {
    if (note.resolved) {
      continue;
    }

    const leftPercent = computingWorldPlazaCraftModeBeatNoteLeftPercent(
      note,
      nowMs
    );

    if (!checkingWorldPlazaCraftModeBeatNoteInHitZone(leftPercent)) {
      continue;
    }

    const distance = Math.abs(
      leftPercent - DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT
    );

    if (distance < bestDistance) {
      bestDistance = distance;
      bestNote = note;
    }
  }

  return bestNote;
}
