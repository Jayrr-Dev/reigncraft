/**
 * Smooth value noise and fractal Brownian motion (fBm) for coherent world maps.
 *
 * The sine-based hash used previously had no spatial coherence, so neighboring
 * tiles produced unrelated values. These helpers use integer bit-mixing plus
 * smooth interpolation so sampled fields vary gradually across space.
 *
 * @module components/world/domains/generatingWorldPlazaValueNoise
 */

/** Default octave count for fractal sampling. */
export const DEFINING_WORLD_PLAZA_NOISE_DEFAULT_OCTAVES = 4;

/** Default amplitude falloff per octave. */
export const DEFINING_WORLD_PLAZA_NOISE_DEFAULT_PERSISTENCE = 0.5;

/** Default frequency growth per octave. */
export const DEFINING_WORLD_PLAZA_NOISE_DEFAULT_LACUNARITY = 2;

/** Largest unsigned 32-bit value plus one, used to normalize hashes. */
const DEFINING_WORLD_PLAZA_NOISE_UINT32_RANGE = 4294967296;

/** Seed offset applied per octave so layers stay independent. */
const DEFINING_WORLD_PLAZA_NOISE_OCTAVE_SEED_STRIDE = 1013;

/** Options for {@link samplingWorldPlazaFractalNoise}. */
export interface SamplingWorldPlazaFractalNoiseOptions {
  /** Base sampling frequency (smaller is smoother / larger features). */
  frequency: number;
  /** Octave count for added detail. */
  octaves?: number;
  /** Amplitude falloff per octave. */
  persistence?: number;
  /** Frequency growth per octave. */
  lacunarity?: number;
}

/**
 * Mixes integer coordinates into a stable unit float in [0, 1).
 *
 * @param gridX - Integer lattice X.
 * @param gridY - Integer lattice Y.
 * @param seed - Field discriminator.
 */
export function hashingWorldPlazaCoordinateToUnitFloat(
  gridX: number,
  gridY: number,
  seed: number,
): number {
  let hash = seed | 0;
  hash = Math.imul(hash ^ (gridX | 0), 0x27d4eb2d);
  hash = Math.imul(hash ^ (gridY | 0), 0x85ebca6b);
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x2c1b3c6d);
  hash ^= hash >>> 12;

  return (hash >>> 0) / DEFINING_WORLD_PLAZA_NOISE_UINT32_RANGE;
}

/** Quintic smoothstep so interpolation has zero first/second derivatives at ends. */
function fadingWorldPlazaNoiseInterpolant(value: number): number {
  return value * value * value * (value * (value * 6 - 15) + 10);
}

/** Linear interpolation. */
function interpolatingWorldPlazaNoiseLinear(
  from: number,
  to: number,
  mix: number,
): number {
  return from + (to - from) * mix;
}

/**
 * Samples smooth value noise at a continuous point.
 *
 * @param x - Continuous X.
 * @param y - Continuous Y.
 * @param seed - Field discriminator.
 */
export function samplingWorldPlazaValueNoise(
  x: number,
  y: number,
  seed: number,
): number {
  const gridX0 = Math.floor(x);
  const gridY0 = Math.floor(y);
  const fractionX = x - gridX0;
  const fractionY = y - gridY0;
  const easeX = fadingWorldPlazaNoiseInterpolant(fractionX);
  const easeY = fadingWorldPlazaNoiseInterpolant(fractionY);

  const corner00 = hashingWorldPlazaCoordinateToUnitFloat(gridX0, gridY0, seed);
  const corner10 = hashingWorldPlazaCoordinateToUnitFloat(
    gridX0 + 1,
    gridY0,
    seed,
  );
  const corner01 = hashingWorldPlazaCoordinateToUnitFloat(
    gridX0,
    gridY0 + 1,
    seed,
  );
  const corner11 = hashingWorldPlazaCoordinateToUnitFloat(
    gridX0 + 1,
    gridY0 + 1,
    seed,
  );

  const topEdge = interpolatingWorldPlazaNoiseLinear(corner00, corner10, easeX);
  const bottomEdge = interpolatingWorldPlazaNoiseLinear(
    corner01,
    corner11,
    easeX,
  );

  return interpolatingWorldPlazaNoiseLinear(topEdge, bottomEdge, easeY);
}

/**
 * Samples fractal Brownian motion (summed value-noise octaves) in [0, 1].
 *
 * @param x - Continuous X (tile space).
 * @param y - Continuous Y (tile space).
 * @param seed - Field discriminator.
 * @param options - Frequency and octave tuning.
 */
export function samplingWorldPlazaFractalNoise(
  x: number,
  y: number,
  seed: number,
  options: SamplingWorldPlazaFractalNoiseOptions,
): number {
  const octaves = options.octaves ?? DEFINING_WORLD_PLAZA_NOISE_DEFAULT_OCTAVES;
  const persistence =
    options.persistence ?? DEFINING_WORLD_PLAZA_NOISE_DEFAULT_PERSISTENCE;
  const lacunarity =
    options.lacunarity ?? DEFINING_WORLD_PLAZA_NOISE_DEFAULT_LACUNARITY;

  let amplitude = 1;
  let frequency = options.frequency;
  let total = 0;
  let amplitudeSum = 0;

  for (let octave = 0; octave < octaves; octave += 1) {
    total +=
      amplitude *
      samplingWorldPlazaValueNoise(
        x * frequency,
        y * frequency,
        seed + octave * DEFINING_WORLD_PLAZA_NOISE_OCTAVE_SEED_STRIDE,
      );
    amplitudeSum += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  return amplitudeSum === 0 ? 0 : total / amplitudeSum;
}
