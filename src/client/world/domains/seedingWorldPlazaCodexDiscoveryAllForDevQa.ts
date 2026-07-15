/**
 * Seeds every Guide codex track to full unlock for Dev QA load.
 *
 * Call after discovery stores hydrate (PixiScene store-init effect). Idempotent
 * per Dev QA revision so remount / HMR does not stack study points.
 *
 * @module components/world/domains/seedingWorldPlazaCodexDiscoveryAllForDevQa
 */

import { DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import { DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT } from '@/components/home/domains/definingPlazaCodexStudyTier';
import { DEFINING_PLAZA_HERBARIUM_BERRY_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaHerbariumBerryGuideConstants';
import {
  DEFINING_PLAZA_HERBARIUM_FLOWER_GUIDE_ENTRIES,
  DEFINING_PLAZA_HERBARIUM_TREE_GUIDE_ENTRIES,
} from '@/components/home/domains/definingPlazaHerbariumGuideConstants';
import { DEFINING_PLAZA_HERBARIUM_MUSHROOM_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaHerbariumMushroomGuideConstants';
import { DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaLapidaryGuideConstants';
import { DEFINING_PLAZA_LORE_BOOKS } from '@/components/home/domains/definingPlazaLoreBookConstants';
import { DEFINING_PLAZA_PATHOLOGY_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaPathologyGuideConstants';
import { attachingWorldPlazaAllCraftModeRecipesForDevQa } from '@/components/world/domains/attachingWorldPlazaAllCraftModeRecipesForDevQa';
import {
  DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_FULL_UNLOCK_KILL_COUNT,
  DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_UNLOCK_SPECIES_IDS,
} from '@/components/world/domains/definingWorldPlazaDevModeBestiaryUnlockConstants';
import { unlockingWorldPlazaBestiaryDiscoveryAllForDev } from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import {
  checkingWorldPlazaDevQaLoadEnabled,
  readingWorldPlazaDevQaLoadRevision,
} from '@/components/world/domains/managingWorldPlazaDevQaLoadStore';
import { recordingWorldPlazaExploredBiomeKind } from '@/components/world/domains/managingWorldPlazaExploredBiomesStore';
import {
  ensuringWorldPlazaHerbariumBerryStudyAtLeast,
  ensuringWorldPlazaHerbariumCloverStudyAtLeast,
  ensuringWorldPlazaHerbariumFlowerStudyAtLeast,
  ensuringWorldPlazaHerbariumMushroomStudyAtLeast,
  recordingWorldPlazaHerbariumTreeStudied,
} from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';
import { ensuringWorldPlazaLapidaryOreStudyAtLeast } from '@/components/world/domains/managingWorldPlazaLapidaryDiscoveryStore';
import { unlockingWorldPlazaLoreBookDiscoveryAllForDev } from '@/components/world/domains/managingWorldPlazaLoreBookDiscoveryStore';
import {
  creditingWorldPlazaPathologyFromInfectionHours,
  recordingWorldPlazaPathologyDiseaseObtained,
} from '@/components/world/domains/managingWorldPlazaPathologyDiscoveryStore';
import { WORLD_CLOVER_SEARCH_LOOT_REGISTRY } from '../../../shared/worldCloverSearchLoot';

const seededWorldPlazaCodexDiscoveryDevQaKeys = new Set<string>();

/** Test helper: allow Dev QA codex seed to run again. */
export function resettingWorldPlazaCodexDiscoveryDevQaSeedGuardForTests(): void {
  seededWorldPlazaCodexDiscoveryDevQaKeys.clear();
}

/**
 * Unlocks Biomes, Bestiary, Herbarium, Lapidary, Pathology, Recipes, and Lore
 * for the active Dev QA session. No-op when Dev QA is off or already seeded for
 * this revision.
 */
export function seedingWorldPlazaCodexDiscoveryAllForDevQa(): void {
  if (!checkingWorldPlazaDevQaLoadEnabled()) {
    return;
  }

  const seedKey = `dev-qa-codex:${readingWorldPlazaDevQaLoadRevision()}`;
  if (seededWorldPlazaCodexDiscoveryDevQaKeys.has(seedKey)) {
    return;
  }

  seededWorldPlazaCodexDiscoveryDevQaKeys.add(seedKey);

  for (const biomeEntry of DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES) {
    recordingWorldPlazaExploredBiomeKind(biomeEntry.kind);
  }

  unlockingWorldPlazaBestiaryDiscoveryAllForDev(
    DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_UNLOCK_SPECIES_IDS,
    DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_FULL_UNLOCK_KILL_COUNT
  );

  for (const flowerEntry of DEFINING_PLAZA_HERBARIUM_FLOWER_GUIDE_ENTRIES) {
    ensuringWorldPlazaHerbariumFlowerStudyAtLeast(
      flowerEntry.speciesId,
      DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT
    );
  }

  for (const treeEntry of DEFINING_PLAZA_HERBARIUM_TREE_GUIDE_ENTRIES) {
    recordingWorldPlazaHerbariumTreeStudied(
      treeEntry.variant,
      DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT
    );
  }

  for (const cloverEntry of WORLD_CLOVER_SEARCH_LOOT_REGISTRY) {
    ensuringWorldPlazaHerbariumCloverStudyAtLeast(
      cloverEntry.itemKind,
      DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT
    );
  }

  for (const berryEntry of DEFINING_PLAZA_HERBARIUM_BERRY_GUIDE_ENTRIES) {
    ensuringWorldPlazaHerbariumBerryStudyAtLeast(
      berryEntry.berryLootKind,
      DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT
    );
  }

  for (const mushroomEntry of DEFINING_PLAZA_HERBARIUM_MUSHROOM_GUIDE_ENTRIES) {
    ensuringWorldPlazaHerbariumMushroomStudyAtLeast(
      mushroomEntry.speciesId,
      DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT
    );
  }

  for (const oreEntry of DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES) {
    ensuringWorldPlazaLapidaryOreStudyAtLeast(
      oreEntry.speciesId,
      DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT
    );
  }

  for (const pathologyEntry of DEFINING_PLAZA_PATHOLOGY_GUIDE_ENTRIES) {
    recordingWorldPlazaPathologyDiseaseObtained(pathologyEntry.diseaseId);
    creditingWorldPlazaPathologyFromInfectionHours(
      pathologyEntry.diseaseId,
      DEFINING_PLAZA_CODEX_STUDY_FULL_COUNT
    );
  }

  attachingWorldPlazaAllCraftModeRecipesForDevQa();

  unlockingWorldPlazaLoreBookDiscoveryAllForDev(
    DEFINING_PLAZA_LORE_BOOKS.map((book) => book.id)
  );
}
