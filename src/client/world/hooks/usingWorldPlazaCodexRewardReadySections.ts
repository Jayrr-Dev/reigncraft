'use client';

/**
 * Subscribes to Codex discovery stores and resolves sections with reward-ready chests.
 *
 * @module components/world/hooks/usingWorldPlazaCodexRewardReadySections
 */

import { computingPlazaCodexAggregateStudyProgress } from '@/components/home/domains/computingPlazaCodexAggregateStudyProgress';
import { DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import { DEFINING_PLAZA_RECIPES_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaRecipesGuideConstants';
import { resolvingPlazaBestiaryGuideDisplayEntries } from '@/components/home/domains/resolvingPlazaBestiaryGuideDisplayEntries';
import {
  resolvingPlazaCodexMenuRewardReadySections,
  type PlazaCodexMenuRewardReadyMeterPair,
} from '@/components/home/domains/resolvingPlazaCodexMenuRewardReadySections';
import { resolvingPlazaHerbariumCodexStudyTrackId } from '@/components/home/domains/resolvingPlazaHerbariumCodexStudyTrackId';
import { resolvingPlazaHerbariumGuideDisplayEntries } from '@/components/home/domains/resolvingPlazaHerbariumGuideDisplayEntries';
import { resolvingPlazaLapidaryGuideDisplayEntries } from '@/components/home/domains/resolvingPlazaLapidaryGuideDisplayEntries';
import { resolvingPlazaPathologyGuideDisplayEntries } from '@/components/home/domains/resolvingPlazaPathologyGuideDisplayEntries';
import type { WorldPlazaCodexSectionId } from '@/components/world/domains/definingWorldPlazaCodexConstants';
import {
  gettingWorldPlazaBestiarySightedSpeciesSnapshot,
  gettingWorldPlazaBestiaryStudyCountsSnapshot,
  subscribingWorldPlazaBestiaryDiscovery,
} from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import {
  gettingWorldPlazaExploredBiomesSnapshot,
  subscribingWorldPlazaExploredBiomes,
} from '@/components/world/domains/managingWorldPlazaExploredBiomesStore';
import {
  gettingWorldPlazaHerbariumBerryStudyCountsSnapshot,
  gettingWorldPlazaHerbariumCloverStudyCountSnapshot,
  gettingWorldPlazaHerbariumFlowerStudyCountsSnapshot,
  gettingWorldPlazaHerbariumMushroomStudyCountsSnapshot,
  gettingWorldPlazaHerbariumSightedBerryLootKindsSnapshot,
  gettingWorldPlazaHerbariumSightedCloverKindsSnapshot,
  gettingWorldPlazaHerbariumSightedMushroomSpeciesSnapshot,
  gettingWorldPlazaHerbariumSightedTreeVariantsSnapshot,
  gettingWorldPlazaHerbariumTreeStudyCountsSnapshot,
  subscribingWorldPlazaHerbariumDiscovery,
} from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';
import {
  gettingWorldPlazaLapidaryOreStudyCountsSnapshot,
  gettingWorldPlazaLapidarySightedOreSpeciesSnapshot,
  subscribingWorldPlazaLapidaryDiscovery,
} from '@/components/world/domains/managingWorldPlazaLapidaryDiscoveryStore';
import {
  gettingWorldPlazaPathologyInfectionStudyPointsSnapshot,
  gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot,
  gettingWorldPlazaPathologyObtainedDiseasesSnapshot,
  subscribingWorldPlazaPathologyDiscovery,
} from '@/components/world/domains/managingWorldPlazaPathologyDiscoveryStore';
import {
  gettingWorldPlazaRecipeAttachedSnapshot,
  subscribingWorldPlazaRecipeDiscovery,
} from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import { useMemo, useSyncExternalStore } from 'react';

function buildingPlazaCodexDualMeterPair(
  discoveredValue: number,
  discoveredMax: number,
  studiedValue: number,
  studiedMax: number
): PlazaCodexMenuRewardReadyMeterPair {
  return {
    discoveredValue,
    discoveredMax,
    studiedValue,
    studiedMax,
  };
}

/**
 * Codex section ids that currently have a reached milestone chest (reward ready).
 */
export function usingWorldPlazaCodexRewardReadySections(): ReadonlySet<WorldPlazaCodexSectionId> {
  const exploredBiomeKinds = useSyncExternalStore(
    subscribingWorldPlazaExploredBiomes,
    gettingWorldPlazaExploredBiomesSnapshot,
    () => []
  );
  const sightedBestiarySpeciesIds = useSyncExternalStore(
    subscribingWorldPlazaBestiaryDiscovery,
    gettingWorldPlazaBestiarySightedSpeciesSnapshot,
    () => []
  );
  const bestiaryKillCountsBySpeciesId = useSyncExternalStore(
    subscribingWorldPlazaBestiaryDiscovery,
    gettingWorldPlazaBestiaryStudyCountsSnapshot,
    () => ({})
  );
  const herbariumFlowerStudyCounts = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumFlowerStudyCountsSnapshot,
    () => ({})
  );
  const sightedHerbariumTreeVariants = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumSightedTreeVariantsSnapshot,
    () => []
  );
  const herbariumTreeStudyCounts = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumTreeStudyCountsSnapshot,
    () => ({})
  );
  const sightedHerbariumCloverKinds = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumSightedCloverKindsSnapshot,
    () => []
  );
  const herbariumCloverStudyCount = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumCloverStudyCountSnapshot,
    () => 0
  );
  const sightedHerbariumBerryLootKinds = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumSightedBerryLootKindsSnapshot,
    () => []
  );
  const herbariumBerryStudyCounts = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumBerryStudyCountsSnapshot,
    () => ({})
  );
  const sightedHerbariumMushroomSpeciesIds = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumSightedMushroomSpeciesSnapshot,
    () => []
  );
  const herbariumMushroomStudyCounts = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumMushroomStudyCountsSnapshot,
    () => ({})
  );
  const lapidaryOreStudyCounts = useSyncExternalStore(
    subscribingWorldPlazaLapidaryDiscovery,
    gettingWorldPlazaLapidaryOreStudyCountsSnapshot,
    () => ({})
  );
  const sightedLapidaryOreSpeciesIds = useSyncExternalStore(
    subscribingWorldPlazaLapidaryDiscovery,
    gettingWorldPlazaLapidarySightedOreSpeciesSnapshot,
    () => []
  );
  const obtainedPathologyDiseaseIds = useSyncExternalStore(
    subscribingWorldPlazaPathologyDiscovery,
    gettingWorldPlazaPathologyObtainedDiseasesSnapshot,
    () => []
  );
  const pathologyLinkedCreatureStudies = useSyncExternalStore(
    subscribingWorldPlazaPathologyDiscovery,
    gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot,
    () => ({})
  );
  const pathologyInfectionStudyPoints = useSyncExternalStore(
    subscribingWorldPlazaPathologyDiscovery,
    gettingWorldPlazaPathologyInfectionStudyPointsSnapshot,
    () => ({})
  );
  const attachedRecipeIds = useSyncExternalStore(
    subscribingWorldPlazaRecipeDiscovery,
    gettingWorldPlazaRecipeAttachedSnapshot,
    () => []
  );

  return useMemo(() => {
    const exploredSet = new Set(exploredBiomeKinds);
    const bestiaryEntries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(sightedBestiarySpeciesIds),
      bestiaryKillCountsBySpeciesId,
      exploredSet
    );
    const bestiaryStudied = computingPlazaCodexAggregateStudyProgress(
      bestiaryEntries.map((entry) => ({
        trackId: 'bestiary' as const,
        studyCount: entry.killCount,
      }))
    );

    const herbariumEntries = resolvingPlazaHerbariumGuideDisplayEntries(
      herbariumFlowerStudyCounts,
      new Set(sightedHerbariumTreeVariants),
      herbariumTreeStudyCounts,
      exploredSet,
      new Set(sightedHerbariumCloverKinds),
      herbariumCloverStudyCount,
      new Set(sightedHerbariumBerryLootKinds),
      herbariumBerryStudyCounts,
      new Set(sightedHerbariumMushroomSpeciesIds),
      herbariumMushroomStudyCounts
    );
    const herbariumStudied = computingPlazaCodexAggregateStudyProgress(
      herbariumEntries.map((entry) => ({
        trackId: resolvingPlazaHerbariumCodexStudyTrackId(entry.kind),
        studyCount: entry.studyCount,
      }))
    );

    const lapidaryEntries = resolvingPlazaLapidaryGuideDisplayEntries(
      lapidaryOreStudyCounts,
      new Set(sightedLapidaryOreSpeciesIds),
      exploredSet
    );
    const lapidaryStudied = computingPlazaCodexAggregateStudyProgress(
      lapidaryEntries.map((entry) => ({
        trackId: 'lapidary' as const,
        studyCount: entry.studyCount,
      }))
    );

    const pathologyEntries = resolvingPlazaPathologyGuideDisplayEntries(
      new Set(obtainedPathologyDiseaseIds),
      pathologyLinkedCreatureStudies,
      pathologyInfectionStudyPoints
    );
    const pathologyStudied = computingPlazaCodexAggregateStudyProgress(
      pathologyEntries.map((entry) => ({
        trackId: 'pathology' as const,
        studyCount: entry.studyCount,
      }))
    );

    return resolvingPlazaCodexMenuRewardReadySections(
      {
        bestiary: buildingPlazaCodexDualMeterPair(
          bestiaryEntries.filter((entry) => entry.isSighted).length,
          bestiaryEntries.length,
          bestiaryStudied.value,
          bestiaryStudied.max
        ),
        herbarium: buildingPlazaCodexDualMeterPair(
          herbariumEntries.filter((entry) => entry.isSighted).length,
          herbariumEntries.length,
          herbariumStudied.value,
          herbariumStudied.max
        ),
        lapidary: buildingPlazaCodexDualMeterPair(
          lapidaryEntries.filter((entry) => entry.isSighted).length,
          lapidaryEntries.length,
          lapidaryStudied.value,
          lapidaryStudied.max
        ),
        pathology: buildingPlazaCodexDualMeterPair(
          pathologyEntries.filter((entry) => entry.isObtained).length,
          pathologyEntries.length,
          pathologyStudied.value,
          pathologyStudied.max
        ),
      },
      {
        biomes: {
          value: DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES.filter((entry) =>
            exploredSet.has(entry.kind)
          ).length,
          max: DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES.length,
        },
        recipes: {
          value: DEFINING_PLAZA_RECIPES_GUIDE_ENTRIES.filter((entry) =>
            attachedRecipeIds.includes(entry.recipeId)
          ).length,
          max: DEFINING_PLAZA_RECIPES_GUIDE_ENTRIES.length,
        },
      }
    );
  }, [
    attachedRecipeIds,
    bestiaryKillCountsBySpeciesId,
    exploredBiomeKinds,
    herbariumBerryStudyCounts,
    herbariumCloverStudyCount,
    herbariumFlowerStudyCounts,
    herbariumMushroomStudyCounts,
    herbariumTreeStudyCounts,
    lapidaryOreStudyCounts,
    obtainedPathologyDiseaseIds,
    pathologyInfectionStudyPoints,
    pathologyLinkedCreatureStudies,
    sightedBestiarySpeciesIds,
    sightedHerbariumBerryLootKinds,
    sightedHerbariumCloverKinds,
    sightedHerbariumMushroomSpeciesIds,
    sightedHerbariumTreeVariants,
    sightedLapidaryOreSpeciesIds,
  ]);
}
