/**
 * Backfills Corpus volume unlocks from existing codex discovery progress.
 *
 * Existing saves never recorded lore unlocks; sighted wildlife, studied kills,
 * diseases, and legendary biomes still count.
 *
 * @module components/world/domains/syncingWorldPlazaLoreBookUnlocksFromExistingDiscovery
 */

import { DEFINING_PLAZA_BIOMES_LEGENDARY_KINDS } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import {
  gettingWorldPlazaBestiarySightedSpeciesSnapshot,
  gettingWorldPlazaBestiaryStudyCountsSnapshot,
} from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import { gettingWorldPlazaExploredBiomesSnapshot } from '@/components/world/domains/managingWorldPlazaExploredBiomesStore';
import { recordingWorldPlazaLoreBookUnlockEvent } from '@/components/world/domains/managingWorldPlazaLoreBookDiscoveryStore';
import { gettingWorldPlazaPathologyObtainedDiseasesSnapshot } from '@/components/world/domains/managingWorldPlazaPathologyDiscoveryStore';

/**
 * Records unlock events already implied by other discovery stores.
 */
export function syncingWorldPlazaLoreBookUnlocksFromExistingDiscovery(): void {
  recordingWorldPlazaLoreBookUnlockEvent('session-start');

  if (gettingWorldPlazaBestiarySightedSpeciesSnapshot().length > 0) {
    recordingWorldPlazaLoreBookUnlockEvent('first-wildlife-sighted');
  }

  const studyCounts = gettingWorldPlazaBestiaryStudyCountsSnapshot();
  const hasStudiedWildlife = Object.values(studyCounts).some(
    (studyCount) => typeof studyCount === 'number' && studyCount > 0
  );

  if (hasStudiedWildlife) {
    recordingWorldPlazaLoreBookUnlockEvent('first-wildlife-studied');
  }

  if (gettingWorldPlazaPathologyObtainedDiseasesSnapshot().length > 0) {
    recordingWorldPlazaLoreBookUnlockEvent('first-disease-obtained');
  }

  const exploredBiomeKinds = new Set(gettingWorldPlazaExploredBiomesSnapshot());
  const hasLegendaryBiome = DEFINING_PLAZA_BIOMES_LEGENDARY_KINDS.some(
    (biomeKind) => exploredBiomeKinds.has(biomeKind)
  );

  if (hasLegendaryBiome) {
    recordingWorldPlazaLoreBookUnlockEvent('legendary-biome-entered');
  }
}
