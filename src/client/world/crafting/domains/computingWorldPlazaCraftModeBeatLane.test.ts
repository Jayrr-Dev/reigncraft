import {
  buildingWorldPlazaCraftModeBeatLaneNotesFromPattern,
  checkingWorldPlazaCraftModeBeatNoteInHitZone,
  computingWorldPlazaCraftModeBeatNoteLeftPercent,
  computingWorldPlazaCraftModeBeatTravelMsToHitZone,
  resolvingWorldPlazaCraftModeBeatLaneHitTarget,
} from '@/components/world/crafting/domains/computingWorldPlazaCraftModeBeatLane';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_REGISTRY,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeBeatLaneConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaCraftModeBeatLane', () => {
  it('places a note at the hit-zone center on its hit time', () => {
    const hitAtMs = 10_000;
    const leftPercent = computingWorldPlazaCraftModeBeatNoteLeftPercent(
      { hitAtMs },
      hitAtMs
    );

    expect(leftPercent).toBeCloseTo(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT,
      5
    );
  });

  it('spawns notes to the right of the hit zone before they arrive', () => {
    const hitAtMs = 10_000;
    const nowMs = hitAtMs - computingWorldPlazaCraftModeBeatTravelMsToHitZone();
    const leftPercent = computingWorldPlazaCraftModeBeatNoteLeftPercent(
      { hitAtMs },
      nowMs
    );

    expect(leftPercent).toBeGreaterThan(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_HIT_ZONE_CENTER_PERCENT
    );
    expect(checkingWorldPlazaCraftModeBeatNoteInHitZone(leftPercent)).toBe(
      false
    );
  });

  it('builds patterned notes and resolves only in-zone targets', () => {
    const pattern = DEFINING_WORLD_PLAZA_CRAFT_MODE_BEAT_PATTERN_REGISTRY.find(
      (entry) => entry.id === 'double'
    );

    expect(pattern).toBeDefined();

    const notes = buildingWorldPlazaCraftModeBeatLaneNotesFromPattern(
      pattern!,
      5_000,
      'wave-1'
    );

    expect(notes).toHaveLength(2);
    expect(
      resolvingWorldPlazaCraftModeBeatLaneHitTarget(notes, 5_000)?.noteId
    ).toBe('wave-1-double-0');
    expect(
      resolvingWorldPlazaCraftModeBeatLaneHitTarget(notes, 4_000)
    ).toBeNull();
  });
});
