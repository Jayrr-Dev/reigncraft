/**
 * Sums Lapidary ore Study points across every species.
 *
 * @module components/world/domains/computingWorldPlazaLapidaryTotalOreStudyCount
 */

import type { WorldOreSpeciesId } from '../../../shared/worldOreRarity';

/**
 * Total Study points recorded for all ore species.
 *
 * @param oreStudyCountsBySpeciesId - Per-species Study totals from the Lapidary store
 */
export function computingWorldPlazaLapidaryTotalOreStudyCount(
  oreStudyCountsBySpeciesId: Readonly<Partial<Record<WorldOreSpeciesId, number>>>
): number {
  let total = 0;

  for (const studyCount of Object.values(oreStudyCountsBySpeciesId)) {
    if (typeof studyCount !== 'number' || !Number.isFinite(studyCount)) {
      continue;
    }

    total += Math.max(0, Math.floor(studyCount));
  }

  return total;
}
