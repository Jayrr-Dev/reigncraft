/**
 * Declarative fishing catch catalog: water-kind + biome filters, raw/cooked food,
 * and junk. Common/rare hunger already ×2/3 vs first draft; common/rare species
 * trimmed ~1/3.
 *
 * @module components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  DEFINING_WORLD_PLAZA_WATER_KIND_POND,
  DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
  DEFINING_WORLD_PLAZA_WATER_KIND_STREAM,
  DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND,
  type DefiningWorldPlazaWaterKind,
} from '@/components/world/domains/definingWorldPlazaWaterKind';
import {
  DEFINING_WORLD_PLAZA_FISHING_CATCH_COOK_DURATION_MS_BY_RARITY,
  DEFINING_WORLD_PLAZA_FISHING_CATCH_DEFAULT_CARRY_WEIGHT,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchConstants';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';

export type DefiningWorldPlazaFishingCatchCreatureEntry = {
  readonly kind: 'creature';
  readonly catchId: string;
  readonly rarity: DefiningWorldPlazaInventoryItemRarity;
  readonly waterKinds: readonly DefiningWorldPlazaWaterKind[];
  /** When set, only these biomes may roll the catch. Omit = any biome. */
  readonly biomeKinds?: readonly DefiningWorldPlazaBiomeKind[];
  readonly rawDisplayName: string;
  readonly cookedDisplayName: string;
  readonly rawItemTypeId: string;
  readonly cookedItemTypeId: string;
  readonly rawHungerRestoreRatio: number;
  readonly cookedHungerRestoreRatio: number;
  readonly cookDurationMs: number;
  readonly rawDiseaseId?: DefiningWorldPlazaEntityDiseaseId;
  readonly rawDiseaseChance?: number;
  readonly cookedWellFedBuffId?: string;
  readonly cookedWellFedChance?: number;
  readonly carryWeight: number;
  readonly rawIconEmoji: string;
  readonly cookedIconEmoji: string;
};

export type DefiningWorldPlazaFishingCatchJunkEntry = {
  readonly kind: 'junk';
  readonly catchId: string;
  readonly rarity: DefiningWorldPlazaInventoryItemRarity;
  readonly waterKinds: readonly DefiningWorldPlazaWaterKind[];
  readonly biomeKinds?: readonly DefiningWorldPlazaBiomeKind[];
  readonly displayName: string;
  readonly itemTypeId: string;
  readonly carryWeight: number;
  readonly iconEmoji: string;
};

export type DefiningWorldPlazaFishingCatchCatalogEntry =
  | DefiningWorldPlazaFishingCatchCreatureEntry
  | DefiningWorldPlazaFishingCatchJunkEntry;

const COLD_BIOMES = ['snowy_plains', 'frostsink'] as const satisfies readonly DefiningWorldPlazaBiomeKind[];

function formattingCatchItemTypeId(
  catchId: string,
  phase: 'raw' | 'cooked' | 'junk'
): string {
  if (phase === 'junk') {
    return `world-plaza-fishing-junk-${catchId}`;
  }

  return `world-plaza-${phase}-${catchId}`;
}

function creatingCreatureCatch(params: {
  readonly catchId: string;
  readonly rarity: DefiningWorldPlazaInventoryItemRarity;
  readonly waterKinds: readonly DefiningWorldPlazaWaterKind[];
  readonly biomeKinds?: readonly DefiningWorldPlazaBiomeKind[];
  readonly rawDisplayName: string;
  readonly cookedDisplayName: string;
  readonly rawHungerRestoreRatio: number;
  readonly cookedHungerRestoreRatio: number;
  readonly rawDiseaseId?: DefiningWorldPlazaEntityDiseaseId;
  readonly rawDiseaseChance?: number;
  readonly cookedWellFedBuffId?: string;
  readonly cookedWellFedChance?: number;
  readonly rawIconEmoji?: string;
  readonly cookedIconEmoji?: string;
  readonly carryWeight?: number;
}): DefiningWorldPlazaFishingCatchCreatureEntry {
  return {
    kind: 'creature',
    catchId: params.catchId,
    rarity: params.rarity,
    waterKinds: params.waterKinds,
    biomeKinds: params.biomeKinds,
    rawDisplayName: params.rawDisplayName,
    cookedDisplayName: params.cookedDisplayName,
    rawItemTypeId: formattingCatchItemTypeId(params.catchId, 'raw'),
    cookedItemTypeId: formattingCatchItemTypeId(params.catchId, 'cooked'),
    rawHungerRestoreRatio: params.rawHungerRestoreRatio,
    cookedHungerRestoreRatio: params.cookedHungerRestoreRatio,
    cookDurationMs:
      DEFINING_WORLD_PLAZA_FISHING_CATCH_COOK_DURATION_MS_BY_RARITY[
        params.rarity
      ],
    rawDiseaseId: params.rawDiseaseId,
    rawDiseaseChance: params.rawDiseaseChance,
    cookedWellFedBuffId: params.cookedWellFedBuffId,
    cookedWellFedChance: params.cookedWellFedChance,
    carryWeight:
      params.carryWeight ?? DEFINING_WORLD_PLAZA_FISHING_CATCH_DEFAULT_CARRY_WEIGHT,
    rawIconEmoji: params.rawIconEmoji ?? '🐟',
    cookedIconEmoji: params.cookedIconEmoji ?? '🍖',
  };
}

function creatingJunkCatch(params: {
  readonly catchId: string;
  readonly rarity: DefiningWorldPlazaInventoryItemRarity;
  readonly waterKinds: readonly DefiningWorldPlazaWaterKind[];
  readonly biomeKinds?: readonly DefiningWorldPlazaBiomeKind[];
  readonly displayName: string;
  readonly iconEmoji?: string;
  readonly carryWeight?: number;
}): DefiningWorldPlazaFishingCatchJunkEntry {
  return {
    kind: 'junk',
    catchId: params.catchId,
    rarity: params.rarity,
    waterKinds: params.waterKinds,
    biomeKinds: params.biomeKinds,
    displayName: params.displayName,
    itemTypeId: formattingCatchItemTypeId(params.catchId, 'junk'),
    carryWeight:
      params.carryWeight ?? DEFINING_WORLD_PLAZA_FISHING_CATCH_DEFAULT_CARRY_WEIGHT,
    iconEmoji: params.iconEmoji ?? '🧹',
  };
}

/** Full fishing catch catalog (creatures + junk). */
export const DEFINING_WORLD_PLAZA_FISHING_CATCH_CATALOG: readonly DefiningWorldPlazaFishingCatchCatalogEntry[] =
  [
    // —— Lake ——
    creatingCreatureCatch({
      catchId: 'largemouth-bass',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      rawDisplayName: 'Raw Largemouth Bass',
      cookedDisplayName: 'Cooked Largemouth Bass',
      rawHungerRestoreRatio: 0.12,
      cookedHungerRestoreRatio: 0.27,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.12,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.3,
    }),
    creatingCreatureCatch({
      catchId: 'yellow-perch',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      rawDisplayName: 'Raw Yellow Perch',
      cookedDisplayName: 'Cooked Yellow Perch',
      rawHungerRestoreRatio: 0.09,
      cookedHungerRestoreRatio: 0.21,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.1,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.28,
    }),
    creatingCreatureCatch({
      catchId: 'freshwater-mussel',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      rawDisplayName: 'Raw Freshwater Mussel',
      cookedDisplayName: 'Cooked Freshwater Mussel',
      rawHungerRestoreRatio: 0.07,
      cookedHungerRestoreRatio: 0.17,
      rawDiseaseId: 'liver-fluke',
      rawDiseaseChance: 0.18,
      cookedWellFedBuffId: 'well-fed-toughened-buff',
      cookedWellFedChance: 0.22,
      rawIconEmoji: '🐚',
    }),
    creatingCreatureCatch({
      catchId: 'crayfish',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      rawDisplayName: 'Raw Crayfish',
      cookedDisplayName: 'Cooked Crayfish',
      rawHungerRestoreRatio: 0.12,
      cookedHungerRestoreRatio: 0.3,
      rawDiseaseId: 'vibrio-infection',
      rawDiseaseChance: 0.14,
      cookedWellFedBuffId: 'well-fed-toughened-buff',
      cookedWellFedChance: 0.3,
      rawIconEmoji: '🦞',
    }),
    creatingCreatureCatch({
      catchId: 'stillglass-pike',
      rarity: 'rare',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      rawDisplayName: 'Raw Stillglass Pike',
      cookedDisplayName: 'Cooked Stillglass Pike',
      rawHungerRestoreRatio: 0.15,
      cookedHungerRestoreRatio: 0.33,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.08,
      cookedWellFedBuffId: 'well-fed-vigor-buff',
      cookedWellFedChance: 0.4,
    }),
    creatingCreatureCatch({
      catchId: 'quiet-hand-sunfish',
      rarity: 'epic',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      rawDisplayName: 'Raw Quiet-Hand Sunfish',
      cookedDisplayName: 'Cooked Quiet-Hand Sunfish',
      rawHungerRestoreRatio: 0.16,
      cookedHungerRestoreRatio: 0.45,
      cookedWellFedBuffId: 'well-fed-prime-buff',
      cookedWellFedChance: 0.35,
    }),
    creatingCreatureCatch({
      catchId: 'striped-bass',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      biomeKinds: ['beach', 'ocean'],
      rawDisplayName: 'Raw Striped Bass',
      cookedDisplayName: 'Cooked Striped Bass',
      rawHungerRestoreRatio: 0.2,
      cookedHungerRestoreRatio: 0.44,
      rawDiseaseId: 'vibrio-infection',
      rawDiseaseChance: 0.16,
      cookedWellFedBuffId: 'well-fed-endurance-buff',
      cookedWellFedChance: 0.32,
    }),
    creatingCreatureCatch({
      catchId: 'soft-shell-clam',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      biomeKinds: ['beach', 'ocean'],
      rawDisplayName: 'Raw Soft-Shell Clam',
      cookedDisplayName: 'Cooked Soft-Shell Clam',
      rawHungerRestoreRatio: 0.07,
      cookedHungerRestoreRatio: 0.19,
      rawDiseaseId: 'vibrio-infection',
      rawDiseaseChance: 0.2,
      cookedWellFedBuffId: 'well-fed-toughened-buff',
      cookedWellFedChance: 0.28,
      rawIconEmoji: '🐚',
    }),
    creatingCreatureCatch({
      catchId: 'lake-whitefish',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      biomeKinds: COLD_BIOMES,
      rawDisplayName: 'Raw Lake Whitefish',
      cookedDisplayName: 'Cooked Lake Whitefish',
      rawHungerRestoreRatio: 0.16,
      cookedHungerRestoreRatio: 0.38,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.08,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.3,
    }),
    creatingCreatureCatch({
      catchId: 'cold-water-shrimp',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      biomeKinds: COLD_BIOMES,
      rawDisplayName: 'Raw Cold-Water Shrimp',
      cookedDisplayName: 'Cooked Cold-Water Shrimp',
      rawHungerRestoreRatio: 0.11,
      cookedHungerRestoreRatio: 0.28,
      rawDiseaseId: 'vibrio-infection',
      rawDiseaseChance: 0.12,
      cookedWellFedBuffId: 'well-fed-fleet-buff',
      cookedWellFedChance: 0.3,
      rawIconEmoji: '🦐',
    }),
    creatingCreatureCatch({
      catchId: 'ladder-rime-char',
      rarity: 'epic',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      biomeKinds: COLD_BIOMES,
      rawDisplayName: 'Raw Ladder-Rime Char',
      cookedDisplayName: 'Cooked Ladder-Rime Char',
      rawHungerRestoreRatio: 0.2,
      cookedHungerRestoreRatio: 0.52,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.06,
      cookedWellFedBuffId: 'well-fed-endurance-buff',
      cookedWellFedChance: 0.45,
    }),
    creatingCreatureCatch({
      catchId: 'painted-snail',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      biomeKinds: ['flower_forest'],
      rawDisplayName: 'Raw Painted Snail',
      cookedDisplayName: 'Cooked Painted Snail',
      rawHungerRestoreRatio: 0.08,
      cookedHungerRestoreRatio: 0.22,
      rawDiseaseId: 'liver-fluke',
      rawDiseaseChance: 0.22,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.2,
      rawIconEmoji: '🐌',
    }),
    creatingJunkCatch({
      catchId: 'waterlogged-plank',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      displayName: 'Waterlogged Plank',
      iconEmoji: '🪵',
      carryWeight: 2,
    }),
    creatingJunkCatch({
      catchId: 'tangled-fishing-line',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      displayName: 'Tangled Fishing Line',
      iconEmoji: '🧵',
      carryWeight: 0.5,
    }),
    creatingJunkCatch({
      catchId: 'round-lake-stone',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_LAKE],
      displayName: 'Round Lake Stone',
      iconEmoji: '🪨',
      carryWeight: 2.5,
    }),

    // —— River ——
    creatingCreatureCatch({
      catchId: 'channel-catfish',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      rawDisplayName: 'Raw Channel Catfish',
      cookedDisplayName: 'Cooked Channel Catfish',
      rawHungerRestoreRatio: 0.13,
      cookedHungerRestoreRatio: 0.29,
      rawDiseaseId: 'scavenger-rot',
      rawDiseaseChance: 0.15,
      cookedWellFedBuffId: 'well-fed-hearty-buff',
      cookedWellFedChance: 0.28,
    }),
    creatingCreatureCatch({
      catchId: 'smallmouth-bass',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      rawDisplayName: 'Raw Smallmouth Bass',
      cookedDisplayName: 'Cooked Smallmouth Bass',
      rawHungerRestoreRatio: 0.11,
      cookedHungerRestoreRatio: 0.25,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.12,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.3,
    }),
    creatingCreatureCatch({
      catchId: 'freshwater-drum',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      rawDisplayName: 'Raw Freshwater Drum',
      cookedDisplayName: 'Cooked Freshwater Drum',
      rawHungerRestoreRatio: 0.18,
      cookedHungerRestoreRatio: 0.4,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.11,
      cookedWellFedBuffId: 'well-fed-endurance-buff',
      cookedWellFedChance: 0.3,
    }),
    creatingCreatureCatch({
      catchId: 'current-thread-eel',
      rarity: 'rare',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      rawDisplayName: 'Raw Current-Thread Eel',
      cookedDisplayName: 'Cooked Current-Thread Eel',
      rawHungerRestoreRatio: 0.11,
      cookedHungerRestoreRatio: 0.28,
      rawDiseaseId: 'liver-fluke',
      rawDiseaseChance: 0.16,
      cookedWellFedBuffId: 'well-fed-fleet-buff',
      cookedWellFedChance: 0.42,
      rawIconEmoji: '🐍',
    }),
    creatingCreatureCatch({
      catchId: 'carnegus-gravel-ray',
      rarity: 'epic',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      rawDisplayName: 'Raw Carnegus Gravel-Ray',
      cookedDisplayName: 'Cooked Carnegus Gravel-Ray',
      rawHungerRestoreRatio: 0.14,
      cookedHungerRestoreRatio: 0.38,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.1,
      cookedWellFedBuffId: 'well-fed-toughened-buff',
      cookedWellFedChance: 0.4,
    }),
    creatingCreatureCatch({
      catchId: 'peacock-bass',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      biomeKinds: ['jungle'],
      rawDisplayName: 'Raw Peacock Bass',
      cookedDisplayName: 'Cooked Peacock Bass',
      rawHungerRestoreRatio: 0.19,
      cookedHungerRestoreRatio: 0.42,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.14,
      cookedWellFedBuffId: 'well-fed-strength-buff',
      cookedWellFedChance: 0.3,
    }),
    creatingCreatureCatch({
      catchId: 'giant-river-prawn',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      biomeKinds: ['jungle'],
      rawDisplayName: 'Raw Giant River Prawn',
      cookedDisplayName: 'Cooked Giant River Prawn',
      rawHungerRestoreRatio: 0.14,
      cookedHungerRestoreRatio: 0.34,
      rawDiseaseId: 'vibrio-infection',
      rawDiseaseChance: 0.18,
      cookedWellFedBuffId: 'well-fed-toughened-buff',
      cookedWellFedChance: 0.32,
      rawIconEmoji: '🦐',
    }),
    creatingCreatureCatch({
      catchId: 'vinecoil-moray',
      rarity: 'epic',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      biomeKinds: ['jungle'],
      rawDisplayName: 'Raw Vinecoil Moray',
      cookedDisplayName: 'Cooked Vinecoil Moray',
      rawHungerRestoreRatio: 0.18,
      cookedHungerRestoreRatio: 0.46,
      rawDiseaseId: 'vibrio-infection',
      rawDiseaseChance: 0.22,
      cookedWellFedBuffId: 'well-fed-fleet-buff',
      cookedWellFedChance: 0.38,
      rawIconEmoji: '🐍',
    }),
    creatingCreatureCatch({
      catchId: 'dustwake-barb',
      rarity: 'rare',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      biomeKinds: ['savanna'],
      rawDisplayName: 'Raw Dustwake Barb',
      cookedDisplayName: 'Cooked Dustwake Barb',
      rawHungerRestoreRatio: 0.09,
      cookedHungerRestoreRatio: 0.24,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.12,
      cookedWellFedBuffId: 'well-fed-sunhead-heat-buff',
      cookedWellFedChance: 0.3,
    }),
    creatingCreatureCatch({
      catchId: 'bowfin-river',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      biomeKinds: ['swamp'],
      rawDisplayName: 'Raw Bowfin',
      cookedDisplayName: 'Cooked Bowfin',
      rawHungerRestoreRatio: 0.19,
      cookedHungerRestoreRatio: 0.42,
      rawDiseaseId: 'scavenger-rot',
      rawDiseaseChance: 0.18,
      cookedWellFedBuffId: 'well-fed-toughened-buff',
      cookedWellFedChance: 0.3,
    }),
    creatingCreatureCatch({
      catchId: 'mud-turtle',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      biomeKinds: ['swamp'],
      rawDisplayName: 'Raw Mud Turtle',
      cookedDisplayName: 'Cooked Mud Turtle',
      rawHungerRestoreRatio: 0.18,
      cookedHungerRestoreRatio: 0.4,
      rawDiseaseId: 'scavenger-rot',
      rawDiseaseChance: 0.18,
      cookedWellFedBuffId: 'well-fed-reptile-buff',
      cookedWellFedChance: 0.32,
      rawIconEmoji: '🐢',
    }),
    creatingCreatureCatch({
      catchId: 'burbot',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      biomeKinds: COLD_BIOMES,
      rawDisplayName: 'Raw Burbot',
      cookedDisplayName: 'Cooked Burbot',
      rawHungerRestoreRatio: 0.17,
      cookedHungerRestoreRatio: 0.4,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.08,
      cookedWellFedBuffId: 'well-fed-endurance-buff',
      cookedWellFedChance: 0.34,
    }),
    creatingJunkCatch({
      catchId: 'bent-iron-hook',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      displayName: 'Bent Iron Hook',
      iconEmoji: '🪝',
      carryWeight: 0.75,
    }),
    creatingJunkCatch({
      catchId: 'silt-filled-bottle',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      displayName: 'Silt-Filled Bottle',
      iconEmoji: '🍾',
      carryWeight: 1.25,
    }),
    creatingJunkCatch({
      catchId: 'smooth-river-glass',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_RIVER],
      displayName: 'Smooth River Glass',
      iconEmoji: '🪟',
      carryWeight: 0.75,
    }),

    // —— Stream ——
    creatingCreatureCatch({
      catchId: 'brook-trout',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      rawDisplayName: 'Raw Brook Trout',
      cookedDisplayName: 'Cooked Brook Trout',
      rawHungerRestoreRatio: 0.16,
      cookedHungerRestoreRatio: 0.38,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.08,
      cookedWellFedBuffId: 'well-fed-fleet-buff',
      cookedWellFedChance: 0.35,
    }),
    creatingCreatureCatch({
      catchId: 'creek-chub',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      rawDisplayName: 'Raw Creek Chub',
      cookedDisplayName: 'Cooked Creek Chub',
      rawHungerRestoreRatio: 0.07,
      cookedHungerRestoreRatio: 0.16,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.1,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.22,
    }),
    creatingCreatureCatch({
      catchId: 'freshwater-snail',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      rawDisplayName: 'Raw Freshwater Snail',
      cookedDisplayName: 'Cooked Freshwater Snail',
      rawHungerRestoreRatio: 0.04,
      cookedHungerRestoreRatio: 0.12,
      rawDiseaseId: 'liver-fluke',
      rawDiseaseChance: 0.25,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.18,
      rawIconEmoji: '🐌',
    }),
    creatingCreatureCatch({
      catchId: 'dwarf-crayfish',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      rawDisplayName: 'Raw Dwarf Crayfish',
      cookedDisplayName: 'Cooked Dwarf Crayfish',
      rawHungerRestoreRatio: 0.06,
      cookedHungerRestoreRatio: 0.16,
      rawDiseaseId: 'vibrio-infection',
      rawDiseaseChance: 0.12,
      cookedWellFedBuffId: 'well-fed-toughened-buff',
      cookedWellFedChance: 0.25,
      rawIconEmoji: '🦞',
    }),
    creatingCreatureCatch({
      catchId: 'skipstone-minnow',
      rarity: 'rare',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      rawDisplayName: 'Raw Skipstone Minnow',
      cookedDisplayName: 'Cooked Skipstone Minnow',
      rawHungerRestoreRatio: 0.05,
      cookedHungerRestoreRatio: 0.15,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.06,
      cookedWellFedBuffId: 'well-fed-fleet-buff',
      cookedWellFedChance: 0.45,
    }),
    creatingCreatureCatch({
      catchId: 'spritcore-tadling',
      rarity: 'legendary',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      rawDisplayName: 'Raw Spritcore Tadling',
      cookedDisplayName: 'Cooked Spritcore Tadling',
      rawHungerRestoreRatio: 0.05,
      cookedHungerRestoreRatio: 0.2,
      rawDiseaseId: 'moonblight',
      rawDiseaseChance: 0.08,
      cookedWellFedBuffId: 'well-fed-vigor-buff',
      cookedWellFedChance: 0.5,
      rawIconEmoji: '✨',
    }),
    creatingCreatureCatch({
      catchId: 'rainbow-darter',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      biomeKinds: ['jungle'],
      rawDisplayName: 'Raw Rainbow Darter',
      cookedDisplayName: 'Cooked Rainbow Darter',
      rawHungerRestoreRatio: 0.11,
      cookedHungerRestoreRatio: 0.26,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.1,
      cookedWellFedBuffId: 'well-fed-fleet-buff',
      cookedWellFedChance: 0.3,
    }),
    creatingCreatureCatch({
      catchId: 'apple-snail',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      biomeKinds: ['jungle'],
      rawDisplayName: 'Raw Apple Snail',
      cookedDisplayName: 'Cooked Apple Snail',
      rawHungerRestoreRatio: 0.07,
      cookedHungerRestoreRatio: 0.2,
      rawDiseaseId: 'liver-fluke',
      rawDiseaseChance: 0.28,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.2,
      rawIconEmoji: '🐌',
    }),
    creatingCreatureCatch({
      catchId: 'arctic-grayling',
      rarity: 'rare',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      biomeKinds: COLD_BIOMES,
      rawDisplayName: 'Raw Arctic Grayling',
      cookedDisplayName: 'Cooked Arctic Grayling',
      rawHungerRestoreRatio: 0.11,
      cookedHungerRestoreRatio: 0.27,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.06,
      cookedWellFedBuffId: 'well-fed-fleet-buff',
      cookedWellFedChance: 0.4,
    }),
    creatingCreatureCatch({
      catchId: 'ice-rill-shrimp',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      biomeKinds: COLD_BIOMES,
      rawDisplayName: 'Raw Ice-Rill Shrimp',
      cookedDisplayName: 'Cooked Ice-Rill Shrimp',
      rawHungerRestoreRatio: 0.09,
      cookedHungerRestoreRatio: 0.24,
      rawDiseaseId: 'vibrio-infection',
      rawDiseaseChance: 0.1,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.28,
      rawIconEmoji: '🦐',
    }),
    creatingCreatureCatch({
      catchId: 'rime-sprig-goby',
      rarity: 'epic',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      biomeKinds: COLD_BIOMES,
      rawDisplayName: 'Raw Rime-Sprig Goby',
      cookedDisplayName: 'Cooked Rime-Sprig Goby',
      rawHungerRestoreRatio: 0.12,
      cookedHungerRestoreRatio: 0.32,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.05,
      cookedWellFedBuffId: 'well-fed-endurance-buff',
      cookedWellFedChance: 0.42,
    }),
    creatingCreatureCatch({
      catchId: 'rosyface-shiner',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      biomeKinds: ['flower_forest'],
      rawDisplayName: 'Raw Rosyface Shiner',
      cookedDisplayName: 'Cooked Rosyface Shiner',
      rawHungerRestoreRatio: 0.1,
      cookedHungerRestoreRatio: 0.24,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.08,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.3,
    }),
    creatingJunkCatch({
      catchId: 'snagged-boot-sole',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      displayName: 'Snagged Boot Sole',
      iconEmoji: '👢',
      carryWeight: 1,
    }),
    creatingJunkCatch({
      catchId: 'rusted-sinker',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      displayName: 'Rusted Sinker',
      iconEmoji: '⚙️',
      carryWeight: 1.5,
    }),
    creatingJunkCatch({
      catchId: 'reed-bundle',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_STREAM],
      displayName: 'Bundle of Reeds',
      iconEmoji: '🌿',
      carryWeight: 0.75,
    }),

    // —— Pond ——
    creatingCreatureCatch({
      catchId: 'green-sunfish',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_POND],
      rawDisplayName: 'Raw Green Sunfish',
      cookedDisplayName: 'Cooked Green Sunfish',
      rawHungerRestoreRatio: 0.09,
      cookedHungerRestoreRatio: 0.2,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.11,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.28,
    }),
    creatingCreatureCatch({
      catchId: 'fathead-minnow',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_POND],
      rawDisplayName: 'Raw Fathead Minnow',
      cookedDisplayName: 'Cooked Fathead Minnow',
      rawHungerRestoreRatio: 0.05,
      cookedHungerRestoreRatio: 0.13,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.1,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.2,
    }),
    creatingCreatureCatch({
      catchId: 'freshwater-crab',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_POND],
      rawDisplayName: 'Raw Freshwater Crab',
      cookedDisplayName: 'Cooked Freshwater Crab',
      rawHungerRestoreRatio: 0.12,
      cookedHungerRestoreRatio: 0.3,
      rawDiseaseId: 'vibrio-infection',
      rawDiseaseChance: 0.16,
      cookedWellFedBuffId: 'well-fed-toughened-buff',
      cookedWellFedChance: 0.32,
      rawIconEmoji: '🦀',
    }),
    creatingCreatureCatch({
      catchId: 'bullfrog',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_POND],
      rawDisplayName: 'Raw Bullfrog',
      cookedDisplayName: 'Cooked Bullfrog',
      rawHungerRestoreRatio: 0.14,
      cookedHungerRestoreRatio: 0.32,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.2,
      cookedWellFedBuffId: 'well-fed-fleet-buff',
      cookedWellFedChance: 0.28,
      rawIconEmoji: '🐸',
    }),
    creatingCreatureCatch({
      catchId: 'mirrorpuddle-carp',
      rarity: 'rare',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_POND],
      rawDisplayName: 'Raw Mirrorpuddle Carp',
      cookedDisplayName: 'Cooked Mirrorpuddle Carp',
      rawHungerRestoreRatio: 0.13,
      cookedHungerRestoreRatio: 0.31,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.1,
      cookedWellFedBuffId: 'well-fed-hearty-buff',
      cookedWellFedChance: 0.35,
    }),
    creatingCreatureCatch({
      catchId: 'uncored-leechfish',
      rarity: 'epic',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_POND],
      rawDisplayName: 'Raw Uncored Leechfish',
      cookedDisplayName: 'Cooked Uncored Leechfish',
      rawHungerRestoreRatio: 0.1,
      cookedHungerRestoreRatio: 0.28,
      rawDiseaseId: 'scavenger-rot',
      rawDiseaseChance: 0.25,
      cookedWellFedBuffId: 'well-fed-omega-siphon-buff',
      cookedWellFedChance: 0.25,
    }),
    creatingCreatureCatch({
      catchId: 'common-starfish',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_POND],
      biomeKinds: ['beach', 'ocean'],
      rawDisplayName: 'Raw Common Starfish',
      cookedDisplayName: 'Cooked Common Starfish',
      rawHungerRestoreRatio: 0.08,
      cookedHungerRestoreRatio: 0.22,
      rawDiseaseId: 'vibrio-infection',
      rawDiseaseChance: 0.18,
      cookedWellFedBuffId: 'well-fed-toughened-buff',
      cookedWellFedChance: 0.3,
      rawIconEmoji: '⭐',
    }),
    creatingCreatureCatch({
      catchId: 'climbing-perch',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_POND],
      biomeKinds: ['jungle'],
      rawDisplayName: 'Raw Climbing Perch',
      cookedDisplayName: 'Cooked Climbing Perch',
      rawHungerRestoreRatio: 0.14,
      cookedHungerRestoreRatio: 0.32,
      rawDiseaseId: 'salmonellosis',
      rawDiseaseChance: 0.14,
      cookedWellFedBuffId: 'well-fed-endurance-buff',
      cookedWellFedChance: 0.3,
    }),
    creatingCreatureCatch({
      catchId: 'mangrove-crab',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_POND],
      biomeKinds: ['jungle'],
      rawDisplayName: 'Raw Mangrove Crab',
      cookedDisplayName: 'Cooked Mangrove Crab',
      rawHungerRestoreRatio: 0.13,
      cookedHungerRestoreRatio: 0.32,
      rawDiseaseId: 'vibrio-infection',
      rawDiseaseChance: 0.18,
      cookedWellFedBuffId: 'well-fed-toughened-buff',
      cookedWellFedChance: 0.34,
      rawIconEmoji: '🦀',
    }),
    creatingJunkCatch({
      catchId: 'algae-mat-scrap',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_POND],
      displayName: 'Algae-Mat Scrap',
      iconEmoji: '🟢',
      carryWeight: 0.5,
    }),
    creatingJunkCatch({
      catchId: 'cracked-clay-shard',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_POND],
      displayName: 'Cracked Clay Shard',
      iconEmoji: '🧱',
      carryWeight: 1,
    }),
    creatingJunkCatch({
      catchId: 'lost-toy-boat',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_POND],
      displayName: 'Lost Toy Boat',
      iconEmoji: '⛵',
      carryWeight: 0.75,
    }),

    // —— Swamp pond ——
    creatingCreatureCatch({
      catchId: 'warmouth',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND],
      rawDisplayName: 'Raw Warmouth',
      cookedDisplayName: 'Cooked Warmouth',
      rawHungerRestoreRatio: 0.1,
      cookedHungerRestoreRatio: 0.23,
      rawDiseaseId: 'scavenger-rot',
      rawDiseaseChance: 0.14,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.26,
    }),
    creatingCreatureCatch({
      catchId: 'swamp-crayfish',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND],
      rawDisplayName: 'Raw Swamp Crayfish',
      cookedDisplayName: 'Cooked Swamp Crayfish',
      rawHungerRestoreRatio: 0.07,
      cookedHungerRestoreRatio: 0.19,
      rawDiseaseId: 'vibrio-infection',
      rawDiseaseChance: 0.16,
      cookedWellFedBuffId: 'well-fed-toughened-buff',
      cookedWellFedChance: 0.28,
      rawIconEmoji: '🦞',
    }),
    creatingCreatureCatch({
      catchId: 'swamp-bowfin',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND],
      rawDisplayName: 'Raw Swamp Bowfin',
      cookedDisplayName: 'Cooked Swamp Bowfin',
      rawHungerRestoreRatio: 0.19,
      cookedHungerRestoreRatio: 0.42,
      rawDiseaseId: 'scavenger-rot',
      rawDiseaseChance: 0.18,
      cookedWellFedBuffId: 'well-fed-toughened-buff',
      cookedWellFedChance: 0.32,
    }),
    creatingCreatureCatch({
      catchId: 'swamp-mud-crab',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND],
      rawDisplayName: 'Raw Mud Crab',
      cookedDisplayName: 'Cooked Mud Crab',
      rawHungerRestoreRatio: 0.13,
      cookedHungerRestoreRatio: 0.32,
      rawDiseaseId: 'vibrio-infection',
      rawDiseaseChance: 0.18,
      cookedWellFedBuffId: 'well-fed-toughened-buff',
      cookedWellFedChance: 0.34,
      rawIconEmoji: '🦀',
    }),
    creatingCreatureCatch({
      catchId: 'red-choir-bogmaw',
      rarity: 'epic',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND],
      rawDisplayName: 'Raw Red-Choir Bogmaw',
      cookedDisplayName: 'Cooked Red-Choir Bogmaw',
      rawHungerRestoreRatio: 0.22,
      cookedHungerRestoreRatio: 0.5,
      rawDiseaseId: 'scavenger-rot',
      rawDiseaseChance: 0.28,
      cookedWellFedBuffId: 'well-fed-strength-buff',
      cookedWellFedChance: 0.38,
    }),
    creatingCreatureCatch({
      catchId: 'mereon-judgment-gar',
      rarity: 'legendary',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND],
      rawDisplayName: "Raw Mereon's Judgment Gar",
      cookedDisplayName: "Cooked Mereon's Judgment Gar",
      rawHungerRestoreRatio: 0.24,
      cookedHungerRestoreRatio: 0.58,
      rawDiseaseId: 'liver-fluke',
      rawDiseaseChance: 0.15,
      cookedWellFedBuffId: 'well-fed-prime-buff',
      cookedWellFedChance: 0.45,
    }),
    creatingJunkCatch({
      catchId: 'peat-brick-scrap',
      rarity: 'common',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND],
      displayName: 'Peat Brick Scrap',
      iconEmoji: '🧱',
      carryWeight: 2,
    }),
    creatingJunkCatch({
      catchId: 'rusted-trap-jaw',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND],
      displayName: 'Rusted Trap Jaw',
      iconEmoji: '⚙️',
      carryWeight: 2.5,
    }),
    creatingJunkCatch({
      catchId: 'empty-medicine-vial',
      rarity: 'uncommon',
      waterKinds: [DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND],
      displayName: 'Empty Medicine Vial',
      iconEmoji: '🧪',
      carryWeight: 0.5,
    }),
  ];

const CATCH_BY_ID = Object.fromEntries(
  DEFINING_WORLD_PLAZA_FISHING_CATCH_CATALOG.map((entry) => [
    entry.catchId,
    entry,
  ])
) as Record<string, DefiningWorldPlazaFishingCatchCatalogEntry>;

const CREATURE_BY_RAW_ITEM_TYPE_ID = Object.fromEntries(
  DEFINING_WORLD_PLAZA_FISHING_CATCH_CATALOG.filter(
    (entry): entry is DefiningWorldPlazaFishingCatchCreatureEntry =>
      entry.kind === 'creature'
  ).map((entry) => [entry.rawItemTypeId, entry])
) as Record<string, DefiningWorldPlazaFishingCatchCreatureEntry>;

/** Looks up one catch by stable catch id. */
export function resolvingWorldPlazaFishingCatchById(
  catchId: string
): DefiningWorldPlazaFishingCatchCatalogEntry | null {
  return CATCH_BY_ID[catchId] ?? null;
}

/** Looks up a cookable creature catch by raw item type id. */
export function resolvingWorldPlazaFishingCatchCreatureByRawItemTypeId(
  rawItemTypeId: string
): DefiningWorldPlazaFishingCatchCreatureEntry | null {
  return CREATURE_BY_RAW_ITEM_TYPE_ID[rawItemTypeId] ?? null;
}

/** Creature entries only (raw + cooked pairs). */
export function listingWorldPlazaFishingCatchCreatures(): readonly DefiningWorldPlazaFishingCatchCreatureEntry[] {
  return DEFINING_WORLD_PLAZA_FISHING_CATCH_CATALOG.filter(
    (entry): entry is DefiningWorldPlazaFishingCatchCreatureEntry =>
      entry.kind === 'creature'
  );
}
