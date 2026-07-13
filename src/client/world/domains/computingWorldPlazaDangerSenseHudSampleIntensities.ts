/**
 * Samples continuous threat bearings onto danger + caution intensity rings.
 *
 * @module components/world/domains/computingWorldPlazaDangerSenseHudSampleIntensities
 */

import {
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_ANGULAR_FALLOFF_POWER,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_ANGULAR_SPREAD_RADIANS,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SAMPLE_COUNT,
  type DefiningWorldPlazaDangerSenseHudThreatBearing,
  type DefiningWorldPlazaDangerSenseHudTint,
} from '@/components/world/domains/definingWorldPlazaDangerSenseHudConstants';

const TWO_PI = Math.PI * 2;

/** Shortest signed angular distance in (-π, π]. */
export function computingWorldPlazaDangerSenseHudShortestAngleDeltaRadians(
  fromRadians: number,
  toRadians: number
): number {
  return Math.atan2(
    Math.sin(toRadians - fromRadians),
    Math.cos(toRadians - fromRadians)
  );
}

/**
 * Soft lobe weight for one sample angle relative to a threat bearing.
 */
export function computingWorldPlazaDangerSenseHudAngularLobeWeight(
  sampleBearingRadians: number,
  threatBearingRadians: number
): number {
  const absDelta = Math.abs(
    computingWorldPlazaDangerSenseHudShortestAngleDeltaRadians(
      sampleBearingRadians,
      threatBearingRadians
    )
  );

  if (absDelta >= DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_ANGULAR_SPREAD_RADIANS) {
    return 0;
  }

  const normalized =
    1 -
    absDelta / DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_ANGULAR_SPREAD_RADIANS;

  return Math.pow(
    normalized,
    DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_ANGULAR_FALLOFF_POWER
  );
}

function fillingWorldPlazaDangerSenseHudSampleRingForTint(
  threats: readonly DefiningWorldPlazaDangerSenseHudThreatBearing[],
  tint: DefiningWorldPlazaDangerSenseHudTint,
  out: Float32Array
): void {
  out.fill(0);

  const sampleCount = Math.min(
    out.length,
    DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SAMPLE_COUNT
  );

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const sampleBearingRadians = (sampleIndex / sampleCount) * TWO_PI;
    let peak = 0;

    for (const threat of threats) {
      if (threat.tint !== tint) {
        continue;
      }

      const weight = computingWorldPlazaDangerSenseHudAngularLobeWeight(
        sampleBearingRadians,
        threat.bearingRadians
      );
      if (weight <= 0) {
        continue;
      }

      const contribution = threat.intensity * weight;
      if (contribution > peak) {
        peak = contribution;
      }
    }

    out[sampleIndex] = peak;
  }
}

/**
 * Fills danger + caution rings from tinted threat bearings.
 * Sample index 0 sits at screen-east (math atan2 0), then clockwise.
 */
export function computingWorldPlazaDangerSenseHudSampleIntensities(
  threats: readonly DefiningWorldPlazaDangerSenseHudThreatBearing[],
  outDanger: Float32Array,
  outCaution: Float32Array
): void {
  fillingWorldPlazaDangerSenseHudSampleRingForTint(threats, 'danger', outDanger);
  fillingWorldPlazaDangerSenseHudSampleRingForTint(
    threats,
    'caution',
    outCaution
  );
}
