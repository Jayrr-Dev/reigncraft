import {
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CHANCE,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_DEFAULT_BEAR_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_DURATION_MS,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_WOLF_SPECIES_ID,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingCastEncounterConstants';
import { resolvingWorldPlazaFishingCastEncounterRoll } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCastEncounterRoll';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaFishingCastEncounterRoll', () => {
  it('returns null when the chance gate misses', () => {
    expect(
      resolvingWorldPlazaFishingCastEncounterRoll({
        biomeKind: 'forest',
        nowMs: 1_000,
        rollUnit: () => DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CHANCE,
      })
    ).toBeNull();
  });

  it('rolls a forest bear predator with a 10s stalk arm timer', () => {
    const rolls = [
      0, // chance hit
      0, // kind = bear
      0, // brown-bear
    ];
    let index = 0;

    const plan = resolvingWorldPlazaFishingCastEncounterRoll({
      biomeKind: 'forest',
      nowMs: 5_000,
      rollUnit: () => rolls[index++] ?? 0,
    });

    expect(plan).toEqual({
      encounterKind: 'bear',
      speciesId:
        DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_DEFAULT_BEAR_SPECIES_ID,
      aggressionLevel: 'aggressive',
      temperamentOverrideId: 'predator',
      fishingCastEncounter: {
        kind: 'predator',
        armedAtMs:
          5_000 + DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_DURATION_MS,
        fleeDistanceGrid: 26,
        expiresAtMs: null,
        phase: 'stalking',
      },
    });
  });

  it('rolls wolf, pinguin, and fairy kinds', () => {
    const wolf = resolvingWorldPlazaFishingCastEncounterRoll({
      biomeKind: 'plains',
      nowMs: 1_000,
      rollUnit: (() => {
        const rolls = [0, 0.3];
        let index = 0;
        return () => rolls[index++] ?? 0;
      })(),
    });
    expect(wolf?.speciesId).toBe(
      DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_WOLF_SPECIES_ID
    );
    expect(wolf?.fishingCastEncounter.kind).toBe('predator');

    const pinguin = resolvingWorldPlazaFishingCastEncounterRoll({
      biomeKind: 'plains',
      nowMs: 1_000,
      rollUnit: (() => {
        const rolls = [0, 0.55];
        let index = 0;
        return () => rolls[index++] ?? 0;
      })(),
    });
    expect(pinguin?.speciesId).toBe(
      DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_SPECIES_ID
    );
    expect(pinguin?.temperamentOverrideId).toBe('docile');

    const fairy = resolvingWorldPlazaFishingCastEncounterRoll({
      biomeKind: 'plains',
      nowMs: 1_000,
      rollUnit: (() => {
        const rolls = [0, 0.8];
        let index = 0;
        return () => rolls[index++] ?? 0;
      })(),
    });
    expect(fairy?.speciesId).toBe(
      DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_SPECIES_ID
    );
    expect(fairy?.fishingCastEncounter.kind).toBe('fairy');
  });
});
