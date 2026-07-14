/**
 * Resolves player-facing Study subject names from codex guide registries.
 *
 * @module components/home/domains/resolvingPlazaStudySubjectDisplayName
 */

import { DEFINING_PLAZA_HERBARIUM_BERRY_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaHerbariumBerryGuideConstants';
import { DEFINING_PLAZA_HERBARIUM_CLOVER_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaHerbariumCloverGuideConstants';
import {
  DEFINING_PLAZA_HERBARIUM_FLOWER_GUIDE_ENTRIES,
  DEFINING_PLAZA_HERBARIUM_TREE_GUIDE_ENTRIES,
} from '@/components/home/domains/definingPlazaHerbariumGuideConstants';
import { DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaLapidaryGuideConstants';
import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { WorldCloverSearchLootKind } from '../../../../shared/worldCloverSearchLoot';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';
import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';
import type { WorldShrubBerryLootKind } from '../../../../shared/worldShrubBerryLoot';

export function resolvingPlazaHerbariumFlowerStudyDisplayName(
  speciesId: WorldFlowerSpeciesId
): string {
  return (
    DEFINING_PLAZA_HERBARIUM_FLOWER_GUIDE_ENTRIES.find(
      (entry) => entry.speciesId === speciesId
    )?.displayName ?? speciesId
  );
}

export function resolvingPlazaHerbariumTreeStudyDisplayName(
  variant: DefiningWorldPlazaTreeVariantKind
): string {
  return (
    DEFINING_PLAZA_HERBARIUM_TREE_GUIDE_ENTRIES.find(
      (entry) => entry.variant === variant
    )?.displayName ?? variant
  );
}

export function resolvingPlazaHerbariumCloverStudyDisplayName(
  cloverKind: WorldCloverSearchLootKind
): string {
  return (
    DEFINING_PLAZA_HERBARIUM_CLOVER_GUIDE_ENTRIES.find(
      (entry) => entry.cloverKind === cloverKind
    )?.displayName ?? cloverKind
  );
}

export function resolvingPlazaHerbariumBerryStudyDisplayName(
  lootKind: WorldShrubBerryLootKind
): string {
  return (
    DEFINING_PLAZA_HERBARIUM_BERRY_GUIDE_ENTRIES.find(
      (entry) => entry.berryLootKind === lootKind
    )?.displayName ?? lootKind
  );
}

export function resolvingPlazaLapidaryOreStudyDisplayName(
  speciesId: WorldOreSpeciesId
): string {
  return (
    DEFINING_PLAZA_LAPIDARY_ORE_GUIDE_ENTRIES.find(
      (entry) => entry.speciesId === speciesId
    )?.displayName ?? speciesId
  );
}

export function resolvingPlazaBestiarySpeciesStudyDisplayName(
  speciesId: DefiningWildlifeSpeciesId
): string {
  return resolvingWildlifeSpeciesDefinition(speciesId)?.displayName ?? speciesId;
}
