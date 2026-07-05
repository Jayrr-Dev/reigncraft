import {
  DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_SEED,
} from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';
import { samplingWorldPlazaFractalNoise } from '@/components/world/domains/generatingWorldPlazaValueNoise';

/**
 * Low-frequency Firelands body noise shared by classification and centrality.
 *
 * @module components/world/domains/resolvingWorldPlazaFirelandsBodyNoiseAtTileIndex
 */

/**
 * Samples the Firelands body noise field in [0, 1).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaFirelandsBodyNoiseAtTileIndex(
  tileX: number,
  tileY: number
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_OCTAVES,
    }
  );
}
