import { advancingWorldPlazaDangerSenseHudSampleIntensities } from '@/components/world/domains/advancingWorldPlazaDangerSenseHudSampleIntensities';
import {
  computingWorldPlazaDangerSenseHudAngularLobeWeight,
  computingWorldPlazaDangerSenseHudSampleIntensities,
} from '@/components/world/domains/computingWorldPlazaDangerSenseHudSampleIntensities';
import { computingWorldPlazaDangerSenseHudScreenBearingRadians } from '@/components/world/domains/computingWorldPlazaDangerSenseHudScreenBearingRadians';
import { computingWorldPlazaDangerSenseHudThreatBearings } from '@/components/world/domains/computingWorldPlazaDangerSenseHudThreatBearings';
import {
  creatingWorldPlazaDangerSenseHudSampleIntensities,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_CAUTION_INTENSITY,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_HUNTING_INTENSITY,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_MAX_RANGE_GRID,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SOFT_THREAT_INTENSITY_CAP,
} from '@/components/world/domains/definingWorldPlazaDangerSenseHudConstants';
import { resolvingWorldPlazaDangerSenseHudConicGradientBackgroundImage } from '@/components/world/domains/resolvingWorldPlazaDangerSenseHudVignetteCss';
import { DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import {
  computingWildlifeDangerSenseThreatIntensity,
  computingWildlifeDangerSenseThreatSignal,
  computingWorldPlazaDangerSenseHudDistanceFalloff,
} from '@/components/world/wildlife/domains/computingWildlifeDangerSenseThreatIntensity';
import {
  creatingWildlifeTestAiState,
  creatingWildlifeTestInstance,
} from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaDangerSenseHudScreenBearingRadians', () => {
  it('maps screen-up (grid NW) near -π/2', () => {
    const bearing = computingWorldPlazaDangerSenseHudScreenBearingRadians(-2, -2);
    expect(bearing).not.toBeNull();
    expect(bearing!).toBeCloseTo(-Math.PI / 2, 5);
  });

  it('maps screen-right (grid NE) near 0', () => {
    const bearing = computingWorldPlazaDangerSenseHudScreenBearingRadians(2, -2);
    expect(bearing).not.toBeNull();
    expect(bearing!).toBeCloseTo(0, 5);
  });

  it('returns null for a zero delta', () => {
    expect(
      computingWorldPlazaDangerSenseHudScreenBearingRadians(0, 0)
    ).toBeNull();
  });
});

describe('computingWildlifeDangerSenseThreatSignal', () => {
  it('returns hunting intensity for chase targeting the player', () => {
    const instance = creatingWildlifeTestInstance({
      position: { x: 1, y: 0, layer: 0 },
      aiState: creatingWildlifeTestAiState({
        intent: {
          mode: 'chase',
          targetInstanceId: 'player-1',
          targetPoint: { x: 0, y: 0, layer: 0 },
        },
      }),
    });

    expect(
      computingWildlifeDangerSenseThreatIntensity(instance, 'player-1', 1)
    ).toBe(DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_HUNTING_INTENSITY);
    expect(
      computingWildlifeDangerSenseThreatSignal(instance, 'player-1', 1)?.tint
    ).toBe('danger');
  });

  it('fades hunting intensity as the threat gets farther', () => {
    const instance = creatingWildlifeTestInstance({
      position: { x: 12, y: 0, layer: 0 },
      aiState: creatingWildlifeTestAiState({
        intent: {
          mode: 'chase',
          targetInstanceId: 'player-1',
          targetPoint: { x: 0, y: 0, layer: 0 },
        },
      }),
    });

    const near = computingWildlifeDangerSenseThreatIntensity(
      instance,
      'player-1',
      1
    );
    const mid = computingWildlifeDangerSenseThreatIntensity(
      instance,
      'player-1',
      12
    );
    expect(near).toBe(DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_HUNTING_INTENSITY);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(0.45);
  });

  it('returns yellow caution for territory warn', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'boar',
      position: { x: 1, y: 0, layer: 0 },
      aiState: creatingWildlifeTestAiState({
        intent: {
          mode: 'territoryWarn',
          targetInstanceId: 'player-1',
          targetPoint: { x: 0, y: 0, layer: 0 },
        },
      }),
    });

    const signal = computingWildlifeDangerSenseThreatSignal(
      instance,
      'player-1',
      1
    );
    expect(signal?.tint).toBe('caution');
    expect(signal?.intensity).toBeCloseTo(
      DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_CAUTION_INTENSITY
    );
  });

  it('returns yellow caution while a PackHunter shadows the player', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'grey-wolf',
      position: { x: 1, y: 0, layer: 0 },
      aggroState: {
        threats: [
          {
            targetId: 'player-1',
            threat: DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD,
            lastUpdatedAtMs: 0,
          },
        ],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkPhase: 'shadowing',
        stalkPhaseEnteredAtMs: 0,
      },
    });

    const signal = computingWildlifeDangerSenseThreatSignal(
      instance,
      'player-1',
      1
    );
    expect(signal?.tint).toBe('caution');
    expect(signal?.intensity).toBeCloseTo(
      DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_CAUTION_INTENSITY
    );
  });

  it('caps soft threat below hunting intensity for predators', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'grey-wolf',
      position: { x: 1, y: 0, layer: 0 },
      hungerState: {
        hungerRatio: 0.1,
        driveLevel: 'starving',
        lastFedAtMs: null,
      },
      aggroState: {
        threats: [
          {
            targetId: 'player-1',
            threat: DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD,
            lastUpdatedAtMs: 0,
          },
        ],
        activeTargetId: null,
        lastDamagedAtMs: null,
      },
    });

    expect(
      computingWildlifeDangerSenseThreatIntensity(instance, 'player-1', 1)
    ).toBeCloseTo(DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SOFT_THREAT_INTENSITY_CAP);
  });

  it('ignores fleeing deer with leftover damage threat', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'deer',
      position: { x: 3, y: 0, layer: 0 },
      aiState: creatingWildlifeTestAiState({
        intent: {
          mode: 'flee',
          targetPoint: { x: 20, y: 20, layer: 0 },
        },
      }),
      aggroState: {
        threats: [
          {
            targetId: 'player-1',
            threat: DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD,
            lastUpdatedAtMs: 0,
          },
        ],
        activeTargetId: 'player-1',
        lastDamagedAtMs: 0,
      },
    });

    expect(
      computingWildlifeDangerSenseThreatIntensity(instance, 'player-1', 3)
    ).toBe(0);
  });

  it('ignores idle deer that only have damage threat from being hunted', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'deer',
      position: { x: 3, y: 0, layer: 0 },
      aggroState: {
        threats: [
          {
            targetId: 'player-1',
            threat: DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD,
            lastUpdatedAtMs: 0,
          },
        ],
        activeTargetId: null,
        lastDamagedAtMs: 0,
      },
    });

    expect(
      computingWildlifeDangerSenseThreatIntensity(instance, 'player-1', 3)
    ).toBe(0);
  });

  it('falls to zero past max range', () => {
    expect(
      computingWorldPlazaDangerSenseHudDistanceFalloff(
        DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_MAX_RANGE_GRID
      )
    ).toBe(0);
  });
});

describe('computingWorldPlazaDangerSenseHudSampleIntensities', () => {
  it('peaks near the threat bearing and fades away angularly', () => {
    const danger = creatingWorldPlazaDangerSenseHudSampleIntensities();
    const caution = creatingWorldPlazaDangerSenseHudSampleIntensities();
    computingWorldPlazaDangerSenseHudSampleIntensities(
      [{ bearingRadians: 0, intensity: 1, tint: 'danger' }],
      danger,
      caution
    );

    expect(danger[0]).toBeGreaterThan(0.95);
    expect(caution[0]).toBe(0);
    expect(computingWorldPlazaDangerSenseHudAngularLobeWeight(0, 0)).toBe(1);
    expect(
      computingWorldPlazaDangerSenseHudAngularLobeWeight(Math.PI, 0)
    ).toBe(0);

    const oppositeIndex = Math.floor(danger.length / 2);
    expect(danger[oppositeIndex] ?? 0).toBeLessThan(0.05);
  });
});

describe('computingWorldPlazaDangerSenseHudThreatBearings', () => {
  it('returns a continuous bearing for a hunting wolf east of the player', () => {
    const threats = computingWorldPlazaDangerSenseHudThreatBearings({
      playerUserId: 'player-1',
      playerPosition: { x: 0, y: 0, layer: 0 },
      instances: [
        creatingWildlifeTestInstance({
          position: { x: 1, y: -1, layer: 0 },
          aiState: creatingWildlifeTestAiState({
            intent: {
              mode: 'attack',
              targetInstanceId: 'player-1',
              targetPoint: { x: 0, y: 0, layer: 0 },
            },
          }),
        }),
      ],
    });

    expect(threats).toHaveLength(1);
    expect(threats[0]?.bearingRadians).toBeCloseTo(0, 5);
    expect(threats[0]?.intensity).toBeGreaterThan(0.9);
    expect(threats[0]?.tint).toBe('danger');
  });
});

describe('resolvingWorldPlazaDangerSenseHudConicGradientBackgroundImage', () => {
  it('returns none for a dark ring and a conic string when lit', () => {
    const danger = creatingWorldPlazaDangerSenseHudSampleIntensities();
    const caution = creatingWorldPlazaDangerSenseHudSampleIntensities();
    expect(
      resolvingWorldPlazaDangerSenseHudConicGradientBackgroundImage(
        danger,
        caution
      )
    ).toBe('none');

    caution[0] = 1;
    const lit = resolvingWorldPlazaDangerSenseHudConicGradientBackgroundImage(
      danger,
      caution
    );
    expect(lit.startsWith('conic-gradient(from 90deg,')).toBe(true);
    expect(lit.includes('255, 210, 48')).toBe(true);
  });
});

describe('advancingWorldPlazaDangerSenseHudSampleIntensities', () => {
  it('rises toward the target over time', () => {
    const previous = creatingWorldPlazaDangerSenseHudSampleIntensities();
    const target = creatingWorldPlazaDangerSenseHudSampleIntensities();
    target[0] = 1;

    advancingWorldPlazaDangerSenseHudSampleIntensities(previous, target, 120);

    expect(previous[0]).toBeGreaterThan(0.5);
    expect(previous[0]).toBeLessThan(1);
  });
});
