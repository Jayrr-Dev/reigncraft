import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_BREAK_COLOR_TIERS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_DESPAWN_LEFT_PERCENT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_HALF_WIDTH_PERCENT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_RANDOM_SNAP_CHANCE,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_SNAP_CENTERS_PERCENT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_TRAVEL_MS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_SPAWN_LEFT_PERCENT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_STRIKE_COLOR_TIERS,
  type DefiningWorldPlazaCraftModeBeatNoteKind,
  type DefiningWorldPlazaCraftModeBeatPatternDefinition,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeBeatLaneConstants';

export type DefiningWorldPlazaCraftModeBeatLaneNote = {
  readonly noteId: string;
  readonly kind: DefiningWorldPlazaCraftModeBeatNoteKind;
  /** Wall time when the note center crosses its target gold-zone center. */
  readonly hitAtMs: number;
  /** Gold-zone center this note aims at (zone may snap later for new waves). */
  readonly targetHitZoneCenterPercent: number;
  /** Full right→left travel duration for this note (shorter = faster tempo). */
  readonly travelMs: number;
  readonly resolved: boolean;
};

/**
 * Real ms for a note spawned on the right to reach `hitZoneCenterPercent`.
 */
export function computingWorldPlazaCraftModeBeatTravelMsToHitZone(
  hitZoneCenterPercent: number = DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT,
  travelMs: number = DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_TRAVEL_MS
): number {
  const travelSpan =
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_SPAWN_LEFT_PERCENT -
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_DESPAWN_LEFT_PERCENT;
  const hitProgress =
    (DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_SPAWN_LEFT_PERCENT -
      hitZoneCenterPercent) /
    travelSpan;

  return hitProgress * travelMs;
}

/** Scales base travel ms by tempo (higher tempo = shorter travel). */
export function computingWorldPlazaCraftModeBeatTravelMsForTempo(
  tempo: number
): number {
  return Math.round(DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_TRAVEL_MS / tempo);
}

/**
 * Lane X% for a note at `nowMs` (linear right → left toward its target zone).
 */
export function computingWorldPlazaCraftModeBeatNoteLeftPercent(
  note: Pick<
    DefiningWorldPlazaCraftModeBeatLaneNote,
    'hitAtMs' | 'targetHitZoneCenterPercent' | 'travelMs'
  >,
  nowMs: number
): number {
  const travelSpan =
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_SPAWN_LEFT_PERCENT -
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_DESPAWN_LEFT_PERCENT;
  const spawnAtMs =
    note.hitAtMs -
    computingWorldPlazaCraftModeBeatTravelMsToHitZone(
      note.targetHitZoneCenterPercent,
      note.travelMs
    );
  const elapsedMs = nowMs - spawnAtMs;
  const t = Math.min(1, Math.max(0, elapsedMs / note.travelMs));

  return (
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_SPAWN_LEFT_PERCENT - t * travelSpan
  );
}

/** True when the note center sits inside the gold window at `hitZoneCenterPercent`. */
export function checkingWorldPlazaCraftModeBeatNoteInHitZone(
  leftPercent: number,
  hitZoneCenterPercent: number
): boolean {
  return (
    Math.abs(leftPercent - hitZoneCenterPercent) <=
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_HALF_WIDTH_PERCENT
  );
}

/** True once the note has scrolled fully off the left edge. */
export function checkingWorldPlazaCraftModeBeatNoteDespawned(
  leftPercent: number
): boolean {
  return leftPercent <= DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_DESPAWN_LEFT_PERCENT;
}

/**
 * Builds live notes for one pattern wave.
 * `patternStartMs` is when the first note centers in `hitZoneCenterPercent`.
 */
export function buildingWorldPlazaCraftModeBeatLaneNotesFromPattern(
  pattern: DefiningWorldPlazaCraftModeBeatPatternDefinition,
  patternStartMs: number,
  noteIdPrefix: string,
  hitZoneCenterPercent: number,
  travelMs: number = DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_TRAVEL_MS
): readonly DefiningWorldPlazaCraftModeBeatLaneNote[] {
  return pattern.notes.map((noteDefinition, index) => ({
    noteId: `${noteIdPrefix}-${pattern.id}-${index}`,
    kind: noteDefinition.kind,
    hitAtMs: patternStartMs + noteDefinition.hitOffsetMs,
    targetHitZoneCenterPercent: hitZoneCenterPercent,
    travelMs,
    resolved: false,
  }));
}

/**
 * Picks the closest unresolved note currently inside the active gold zone.
 */
export function resolvingWorldPlazaCraftModeBeatLaneHitTarget(
  notes: readonly DefiningWorldPlazaCraftModeBeatLaneNote[],
  nowMs: number,
  hitZoneCenterPercent: number
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

    if (
      !checkingWorldPlazaCraftModeBeatNoteInHitZone(
        leftPercent,
        hitZoneCenterPercent
      )
    ) {
      continue;
    }

    const distance = Math.abs(leftPercent - hitZoneCenterPercent);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestNote = note;
    }
  }

  return bestNote;
}

/**
 * Next gold-zone snap: prefer left→right, sometimes jump to a random other slot.
 */
export function resolvingWorldPlazaCraftModeBeatNextHitZoneCenterPercent(
  currentCenterPercent: number,
  randomUnit: number = Math.random()
): number {
  const snaps = DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_SNAP_CENTERS_PERCENT;
  const currentIndex = snaps.findIndex(
    (center) => center === currentCenterPercent
  );
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;

  if (
    randomUnit < DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_RANDOM_SNAP_CHANCE &&
    snaps.length > 1
  ) {
    const otherIndexes = snaps
      .map((_, index) => index)
      .filter((index) => index !== safeCurrentIndex);
    const pick = otherIndexes[Math.floor(randomUnit * 1000) % otherIndexes.length];
    return snaps[pick ?? ((safeCurrentIndex + 1) % snaps.length)] ?? snaps[0];
  }

  return snaps[(safeCurrentIndex + 1) % snaps.length] ?? snaps[0];
}

type StrikeColorTier =
  (typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_STRIKE_COLOR_TIERS)[number];
type BreakColorTier =
  (typeof DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_BREAK_COLOR_TIERS)[number];

/** Strike disk / float color for the current consecutive-hit count. */
export function resolvingWorldPlazaCraftModeBeatStrikeColorTier(
  comboCount: number
): StrikeColorTier {
  let resolved: StrikeColorTier =
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_STRIKE_COLOR_TIERS[0]!;

  for (const tier of DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_STRIKE_COLOR_TIERS) {
    if (comboCount >= tier.minCombo) {
      resolved = tier;
    }
  }

  return resolved;
}

/**
 * BREAK float color: red at low combo, shifts toward strike-disk hues as speed climbs.
 */
export function resolvingWorldPlazaCraftModeBeatBreakColorTier(
  comboCount: number
): BreakColorTier {
  let resolved: BreakColorTier =
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_BREAK_COLOR_TIERS[0]!;

  for (const tier of DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_BREAK_COLOR_TIERS) {
    if (comboCount >= tier.minCombo) {
      resolved = tier;
    }
  }

  return resolved;
}
