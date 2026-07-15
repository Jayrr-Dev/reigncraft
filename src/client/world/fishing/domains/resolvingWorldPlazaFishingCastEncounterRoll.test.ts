import {
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CHANCE,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_COOLDOWN_MS,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_DEFAULT_BEAR_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_SPECIES_ID,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_DURATION_MS,
  DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_WOLF_SPECIES_ID,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingCastEncounterConstants';
import { resettingWorldPlazaFishingCastEncounterCooldownForTests } from '@/components/world/fishing/domains/managingWorldPlazaFishingCastEncounterCooldown';
import { resolvingWorldPlazaFishingCastEncounterRoll } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCastEncounterRoll';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(() => {
  resettingWorldPlazaFishingCastEncounterCooldownForTests();
});

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

  it('returns null when the cooldown is still active', () => {
    expect(
      resolvingWorldPlazaFishingCastEncounterRoll({
        biomeKind: 'forest',
        nowMs: 100_000,
        lastEncounterAtMs: 20_000,
        rollUnit: () => 0,
      })
    ).toBeNull();
  });

  it('rolls a forest bear predator pack with a 10s stalk arm timer', () => {
    const rolls = [
      0, // chance hit
      0, // weighted event = bear (first eligible with roll 0 on total weight)
      0, // brown-bear
      0, // pack size
    ];
    let index = 0;

    const plan = resolvingWorldPlazaFishingCastEncounterRoll({
      biomeKind: 'forest',
      nowMs: 5_000,
      rollUnit: () => rolls[index++] ?? 0,
    });

    expect(plan?.encounterKind).toBe('bear');
    expect(plan?.members).toHaveLength(1);
    expect(plan?.members[0]).toEqual({
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
      isTameableBondCandidate: false,
    });
  });

  it('rolls wolf, pinguin, and fairy kinds from biome pools', () => {
    const wolf = resolvingWorldPlazaFishingCastEncounterRoll({
      biomeKind: 'plains',
      nowMs: 1_000,
      rollUnit: (() => {
        const rolls = [0, 0.12];
        let index = 0;
        return () => rolls[index++] ?? 0;
      })(),
    });
    expect(wolf?.encounterKind).toBe('wolf');
    expect(wolf?.members[0]?.speciesId).toBe(
      DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_WOLF_SPECIES_ID
    );
    expect(wolf?.members[0]?.fishingCastEncounter.kind).toBe('predator');

    const pinguin = resolvingWorldPlazaFishingCastEncounterRoll({
      biomeKind: 'beach',
      nowMs: 1_000,
      rollUnit: (() => {
        const rolls = [0, 0.05];
        let index = 0;
        return () => rolls[index++] ?? 0;
      })(),
    });
    expect(pinguin?.encounterKind).toBe('pinguin');
    expect(pinguin?.members[0]?.speciesId).toBe(
      DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_SPECIES_ID
    );
    expect(pinguin?.members[0]?.temperamentOverrideId).toBe('docile');

    const fairy = resolvingWorldPlazaFishingCastEncounterRoll({
      biomeKind: 'desert',
      nowMs: 1_000,
      rollUnit: (() => {
        const rolls = [0, 0.1];
        let index = 0;
        return () => rolls[index++] ?? 0;
      })(),
    });
    expect(fairy?.encounterKind).toBe('fairy');
    expect(fairy?.members[0]?.speciesId).toBe(
      DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_SPECIES_ID
    );
    expect(fairy?.members[0]?.fishingCastEncounter.kind).toBe('fairy');
  });

  it('rolls savanna lions and jungle monkey troops with one tameable member', () => {
    const lion = resolvingWorldPlazaFishingCastEncounterRoll({
      biomeKind: 'savanna',
      nowMs: 2_000,
      rollUnit: (() => {
        const rolls = [0, 0.2, 0, 0];
        let index = 0;
        return () => rolls[index++] ?? 0;
      })(),
    });
    expect(lion?.encounterKind).toBe('lion');
    expect(lion?.members[0]?.speciesId).toBe('lion');
    expect(lion?.members[0]?.fishingCastEncounter.kind).toBe('predator');

    const monkeyTroop = resolvingWorldPlazaFishingCastEncounterRoll({
      biomeKind: 'jungle',
      nowMs: 3_000,
      rollUnit: (() => {
        const rolls = [0, 0.35, 0, 0];
        let index = 0;
        return () => rolls[index++] ?? 0;
      })(),
    });
    expect(monkeyTroop?.encounterKind).toBe('monkey_troop');
    expect(monkeyTroop?.members.length).toBeGreaterThanOrEqual(3);
    expect(monkeyTroop?.members[0]?.isTameableBondCandidate).toBe(true);
    expect(monkeyTroop?.members[0]?.fishingCastEncounter.kind).toBe('curious');
    expect(monkeyTroop?.members[1]?.isTameableBondCandidate).toBe(false);
    expect(monkeyTroop?.members[1]?.fishingCastEncounter.kind).toBe('herd');
  });

  it('respects cooldown only inside the configured window', () => {
    const nowMs = 200_000;
    const lastEncounterAtMs =
      nowMs - DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_COOLDOWN_MS + 1;

    expect(
      resolvingWorldPlazaFishingCastEncounterRoll({
        biomeKind: 'forest',
        nowMs,
        lastEncounterAtMs,
        rollUnit: () => 0,
      })
    ).toBeNull();

    const cooledDownAtMs =
      nowMs - DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_COOLDOWN_MS;

    expect(
      resolvingWorldPlazaFishingCastEncounterRoll({
        biomeKind: 'forest',
        nowMs,
        lastEncounterAtMs: cooledDownAtMs,
        rollUnit: () => 0,
      })
    ).not.toBeNull();
  });
});
