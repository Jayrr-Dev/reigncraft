import {
  buildingWorldPlazaCraftModeBeatLaneNotesFromPattern,
  checkingWorldPlazaCraftModeBeatNoteInHitZone,
  computingWorldPlazaCraftModeBeatNoteLeftPercent,
  computingWorldPlazaCraftModeBeatTravelMsForTempo,
  computingWorldPlazaCraftModeBeatTravelMsToHitZone,
  resolvingWorldPlazaCraftModeBeatLaneHitTarget,
  resolvingWorldPlazaCraftModeBeatNextHitZoneCenterPercent,
  resolvingWorldPlazaCraftModeBeatStrikeColorTier,
} from '@/components/world/crafting/domains/computingWorldPlazaCraftModeBeatLane';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_TRAVEL_MS,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_REGISTRY,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeBeatLaneConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaCraftModeBeatLane', () => {
  it('places a note at the hit-zone center on its hit time', () => {
    const hitAtMs = 10_000;
    const zone = DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT;
    const leftPercent = computingWorldPlazaCraftModeBeatNoteLeftPercent(
      {
        hitAtMs,
        targetHitZoneCenterPercent: zone,
        travelMs: DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_TRAVEL_MS,
      },
      hitAtMs
    );

    expect(leftPercent).toBeCloseTo(zone, 5);
  });

  it('spawns notes to the right of the hit zone before they arrive', () => {
    const hitAtMs = 10_000;
    const zone = 50;
    const travelMs = DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_TRAVEL_MS;
    const nowMs =
      hitAtMs - computingWorldPlazaCraftModeBeatTravelMsToHitZone(zone, travelMs);
    const leftPercent = computingWorldPlazaCraftModeBeatNoteLeftPercent(
      { hitAtMs, targetHitZoneCenterPercent: zone, travelMs },
      nowMs
    );

    expect(leftPercent).toBeGreaterThan(zone);
    expect(checkingWorldPlazaCraftModeBeatNoteInHitZone(leftPercent, zone)).toBe(
      false
    );
  });

  it('builds patterned notes and resolves only in-zone targets', () => {
    const pattern = DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_REGISTRY.find(
      (entry) => entry.id === 'double'
    );
    const zone = 34;

    expect(pattern).toBeDefined();

    const notes = buildingWorldPlazaCraftModeBeatLaneNotesFromPattern(
      pattern!,
      5_000,
      'wave-1',
      zone
    );

    expect(notes).toHaveLength(2);
    expect(
      resolvingWorldPlazaCraftModeBeatLaneHitTarget(notes, 5_000, zone)?.noteId
    ).toBe('wave-1-double-0');
    expect(
      resolvingWorldPlazaCraftModeBeatLaneHitTarget(notes, 4_000, zone)
    ).toBeNull();
  });

  it('snaps the gold zone left to right by default', () => {
    expect(resolvingWorldPlazaCraftModeBeatNextHitZoneCenterPercent(18, 0.9)).toBe(
      34
    );
    expect(resolvingWorldPlazaCraftModeBeatNextHitZoneCenterPercent(82, 0.9)).toBe(
      18
    );
  });

  it('picks hotter strike colors as combo climbs', () => {
    expect(resolvingWorldPlazaCraftModeBeatStrikeColorTier(1).label).toBe('amber');
    expect(resolvingWorldPlazaCraftModeBeatStrikeColorTier(12).label).toBe('cyan');
  });

  it('shortens travel time as tempo rises after pauses', () => {
    expect(computingWorldPlazaCraftModeBeatTravelMsForTempo(1)).toBe(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_TRAVEL_MS
    );
    expect(computingWorldPlazaCraftModeBeatTravelMsForTempo(2)).toBe(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_NOTE_TRAVEL_MS / 2
    );
  });
});
