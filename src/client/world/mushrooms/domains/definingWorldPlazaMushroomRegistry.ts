/**
 * Declarative mushroom forage catalog: biomes, schedules, food, disease.
 *
 * @module components/world/mushrooms/domains/definingWorldPlazaMushroomRegistry
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import {
  DEFINING_WORLD_PLAZA_MUSHROOM_COOK_DURATION_MS,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAWN_MAX,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAWN_MIN,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAWN_TO_MIDDAY_MAX,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAWN_TO_MIDDAY_MIN,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAY_MAX,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAY_MIN,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DUSK_MAX,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DUSK_MIN,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_MIDDAY_MAX,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_MIDDAY_MIN,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_NIGHT_DAWN_MAX,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_NIGHT_DAWN_MIN,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_TWILIGHT_MAX_A,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_TWILIGHT_MAX_B,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_TWILIGHT_MIN_A,
  DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_TWILIGHT_MIN_B,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomConstants';
import type {
  DefiningWorldPlazaMushroomRarity,
  DefiningWorldPlazaMushroomTimeOfDay,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpawnBalanceConstants';
import type {
  DefiningWorldPlazaMushroomLookAlikePairId,
  DefiningWorldPlazaMushroomSpeciesId,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';
import { DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_IDS } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';

export type DefiningWorldPlazaMushroomPolarity = 'good' | 'bad';

export type DefiningWorldPlazaMushroomDayParity = 'any' | 'odd' | 'even';

export type DefiningWorldPlazaMushroomPhaseWindowId =
  | 'any'
  | 'day'
  | 'night'
  | 'dawn'
  | 'dusk'
  | 'midday'
  | 'dawn_to_midday'
  | 'twilight'
  | 'night_dawn';

export type DefiningWorldPlazaMushroomCatalogEntry = {
  readonly speciesId: DefiningWorldPlazaMushroomSpeciesId;
  readonly lookAlikePairId: DefiningWorldPlazaMushroomLookAlikePairId;
  readonly polarity: DefiningWorldPlazaMushroomPolarity;
  readonly rawDisplayName: string;
  readonly cookedDisplayName: string;
  readonly rawItemTypeId: string;
  readonly cookedItemTypeId: string;
  readonly biomeKinds: readonly DefiningWorldPlazaBiomeKind[];
  readonly dayParity: DefiningWorldPlazaMushroomDayParity;
  /** Empty = any day digit. Else day number last digit must match. */
  readonly dayDigitEnds: readonly number[];
  /** Coarse day / night / anytime fruiting band. */
  readonly timeOfDay: DefiningWorldPlazaMushroomTimeOfDay;
  /** Finer phase window inside the coarse band. */
  readonly phaseWindow: DefiningWorldPlazaMushroomPhaseWindowId;
  /** Spawn pick weight tier among eligible species. */
  readonly rarity: DefiningWorldPlazaMushroomRarity;
  readonly rawHungerRestoreRatio: number;
  readonly cookedHungerRestoreRatio: number;
  readonly cookDurationMs: number;
  readonly rawDiseaseId?: string;
  readonly rawDiseaseChance?: number;
  readonly rawPoisonFlatEv?: number;
  readonly rawPoisonDurationMs?: number;
  readonly cookedWellFedBuffId?: string;
  readonly cookedWellFedChance?: number;
  readonly cookedResidualDiseaseId?: string;
  readonly cookedResidualDiseaseChance?: number;
};

function formattingWorldPlazaMushroomRawItemTypeId(
  speciesId: DefiningWorldPlazaMushroomSpeciesId
): string {
  return `world-plaza-raw-${speciesId}-mushroom`;
}

function formattingWorldPlazaMushroomCookedItemTypeId(
  speciesId: DefiningWorldPlazaMushroomSpeciesId
): string {
  return `world-plaza-cooked-${speciesId}-mushroom`;
}

const COOK_MS = DEFINING_WORLD_PLAZA_MUSHROOM_COOK_DURATION_MS;

export const DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG: readonly DefiningWorldPlazaMushroomCatalogEntry[] =
  [
    {
      speciesId: 'golden-chanter',
      lookAlikePairId: 'chanter-lantern',
      polarity: 'good',
      rawDisplayName: 'Golden Cap',
      cookedDisplayName: 'Cooked Golden Cap',
      rawItemTypeId:
        formattingWorldPlazaMushroomRawItemTypeId('golden-chanter'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('golden-chanter'),
      biomeKinds: ['forest', 'flower_forest'],
      dayParity: 'odd',
      dayDigitEnds: [],
      timeOfDay: 'day',
      phaseWindow: 'day',
      rarity: 'uncommon',
      rawHungerRestoreRatio: 0.3,
      cookedHungerRestoreRatio: 0.4,
      cookDurationMs: COOK_MS,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.42,
    },
    {
      speciesId: 'false-lantern',
      lookAlikePairId: 'chanter-lantern',
      polarity: 'bad',
      rawDisplayName: 'Orange Cap',
      cookedDisplayName: 'Cooked Orange Cap',
      rawItemTypeId: formattingWorldPlazaMushroomRawItemTypeId('false-lantern'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('false-lantern'),
      biomeKinds: ['forest', 'flower_forest'],
      dayParity: 'even',
      dayDigitEnds: [],
      timeOfDay: 'night',
      phaseWindow: 'dusk',
      rarity: 'rare',
      rawHungerRestoreRatio: 0.08,
      cookedHungerRestoreRatio: 0.12,
      cookDurationMs: COOK_MS,
      rawDiseaseId: 'lantern-gut',
      rawDiseaseChance: 1,
      cookedResidualDiseaseId: 'lantern-gut',
      cookedResidualDiseaseChance: 0.4,
    },
    {
      speciesId: 'honeycomb-morel',
      lookAlikePairId: 'morel-brain',
      polarity: 'good',
      rawDisplayName: 'Honey Cap',
      cookedDisplayName: 'Cooked Honey Cap',
      rawItemTypeId:
        formattingWorldPlazaMushroomRawItemTypeId('honeycomb-morel'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('honeycomb-morel'),
      biomeKinds: ['forest', 'rocky'],
      dayParity: 'any',
      dayDigitEnds: [4, 7],
      timeOfDay: 'day',
      phaseWindow: 'dawn_to_midday',
      rarity: 'uncommon',
      rawHungerRestoreRatio: 0.22,
      cookedHungerRestoreRatio: 0.42,
      cookDurationMs: COOK_MS,
      rawPoisonFlatEv: 18,
      rawPoisonDurationMs: 12_000,
      cookedWellFedBuffId: 'well-fed-fleet-buff',
      cookedWellFedChance: 0.48,
    },
    {
      speciesId: 'brain-cap',
      lookAlikePairId: 'morel-brain',
      polarity: 'bad',
      rawDisplayName: 'Brain Brown',
      cookedDisplayName: 'Cooked Brain Brown',
      rawItemTypeId: formattingWorldPlazaMushroomRawItemTypeId('brain-cap'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('brain-cap'),
      biomeKinds: ['forest', 'rocky'],
      dayParity: 'even',
      dayDigitEnds: [],
      timeOfDay: 'day',
      phaseWindow: 'day',
      rarity: 'rare',
      rawHungerRestoreRatio: 0.06,
      cookedHungerRestoreRatio: 0.1,
      cookDurationMs: COOK_MS,
      rawDiseaseId: 'gyromitra-storm',
      rawDiseaseChance: 1,
      cookedResidualDiseaseId: 'gyromitra-storm',
      cookedResidualDiseaseChance: 0.35,
    },
    {
      speciesId: 'king-bolete',
      lookAlikePairId: 'bolete-devil',
      polarity: 'good',
      rawDisplayName: 'Brown Pore-cap',
      cookedDisplayName: 'Cooked Brown Pore-cap',
      rawItemTypeId: formattingWorldPlazaMushroomRawItemTypeId('king-bolete'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('king-bolete'),
      biomeKinds: ['forest', 'plains'],
      dayParity: 'any',
      dayDigitEnds: [],
      timeOfDay: 'day',
      phaseWindow: 'day',
      rarity: 'uncommon',
      rawHungerRestoreRatio: 0.4,
      cookedHungerRestoreRatio: 0.58,
      cookDurationMs: COOK_MS,
      cookedWellFedBuffId: 'well-fed-strength-buff',
      cookedWellFedChance: 0.5,
    },
    {
      speciesId: 'devils-bolete',
      lookAlikePairId: 'bolete-devil',
      polarity: 'bad',
      rawDisplayName: 'Red-pore Cap',
      cookedDisplayName: 'Cooked Red-pore Cap',
      rawItemTypeId: formattingWorldPlazaMushroomRawItemTypeId('devils-bolete'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('devils-bolete'),
      biomeKinds: ['savanna', 'plains', 'badlands'],
      dayParity: 'odd',
      dayDigitEnds: [],
      timeOfDay: 'day',
      phaseWindow: 'midday',
      rarity: 'rare',
      rawHungerRestoreRatio: 0.1,
      cookedHungerRestoreRatio: 0.14,
      cookDurationMs: COOK_MS,
      rawDiseaseId: 'bolete-bile',
      rawDiseaseChance: 0.85,
      cookedResidualDiseaseId: 'bolete-bile',
      cookedResidualDiseaseChance: 0.2,
    },
    {
      speciesId: 'cloud-puff',
      lookAlikePairId: 'puff-angel',
      polarity: 'good',
      rawDisplayName: 'White Puff',
      cookedDisplayName: 'Cooked White Puff',
      rawItemTypeId: formattingWorldPlazaMushroomRawItemTypeId('cloud-puff'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('cloud-puff'),
      biomeKinds: ['plains', 'savanna', 'flower_forest'],
      dayParity: 'any',
      dayDigitEnds: [],
      timeOfDay: 'day',
      phaseWindow: 'day',
      rarity: 'common',
      rawHungerRestoreRatio: 0.4,
      cookedHungerRestoreRatio: 0.46,
      cookDurationMs: COOK_MS,
      cookedWellFedBuffId: 'well-fed-comfort-buff',
      cookedWellFedChance: 0.28,
    },
    {
      speciesId: 'angel-button',
      lookAlikePairId: 'puff-angel',
      polarity: 'bad',
      rawDisplayName: 'Ivory Button',
      cookedDisplayName: 'Cooked Ivory Button',
      rawItemTypeId: formattingWorldPlazaMushroomRawItemTypeId('angel-button'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('angel-button'),
      biomeKinds: ['forest', 'flower_forest', 'plains'],
      dayParity: 'any',
      dayDigitEnds: [4, 7],
      timeOfDay: 'night',
      phaseWindow: 'twilight',
      rarity: 'legendary',
      rawHungerRestoreRatio: 0.04,
      cookedHungerRestoreRatio: 0.04,
      cookDurationMs: COOK_MS,
      rawDiseaseId: 'amatoxin-angel',
      rawDiseaseChance: 1,
      cookedResidualDiseaseId: 'amatoxin-angel',
      cookedResidualDiseaseChance: 0.95,
    },
    {
      speciesId: 'cluster-honey',
      lookAlikePairId: 'honey-bell',
      polarity: 'good',
      rawDisplayName: 'Honey Tuft',
      cookedDisplayName: 'Cooked Honey Tuft',
      rawItemTypeId: formattingWorldPlazaMushroomRawItemTypeId('cluster-honey'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('cluster-honey'),
      biomeKinds: ['forest', 'swamp', 'jungle'],
      dayParity: 'odd',
      dayDigitEnds: [],
      timeOfDay: 'day',
      phaseWindow: 'day',
      rarity: 'common',
      rawHungerRestoreRatio: 0.18,
      cookedHungerRestoreRatio: 0.36,
      cookDurationMs: COOK_MS,
      rawPoisonFlatEv: 22,
      rawPoisonDurationMs: 14_000,
      cookedWellFedBuffId: 'well-fed-fleet-buff',
      cookedWellFedChance: 0.35,
      cookedResidualDiseaseId: 'bolete-bile',
      cookedResidualDiseaseChance: 0.25,
    },
    {
      speciesId: 'funeral-bell',
      lookAlikePairId: 'honey-bell',
      polarity: 'bad',
      rawDisplayName: 'Brown Bell',
      cookedDisplayName: 'Cooked Brown Bell',
      rawItemTypeId: formattingWorldPlazaMushroomRawItemTypeId('funeral-bell'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('funeral-bell'),
      biomeKinds: ['forest', 'swamp', 'jungle'],
      dayParity: 'any',
      dayDigitEnds: [],
      timeOfDay: 'night',
      phaseWindow: 'night',
      rarity: 'rare',
      rawHungerRestoreRatio: 0.04,
      cookedHungerRestoreRatio: 0.04,
      cookDurationMs: COOK_MS,
      rawDiseaseId: 'amatoxin-bell',
      rawDiseaseChance: 1,
      cookedResidualDiseaseId: 'amatoxin-bell',
      cookedResidualDiseaseChance: 0.9,
    },
    {
      speciesId: 'white-parasol',
      lookAlikePairId: 'parasol-vomiter',
      polarity: 'good',
      rawDisplayName: 'Tall White Cap',
      cookedDisplayName: 'Cooked Tall White Cap',
      rawItemTypeId: formattingWorldPlazaMushroomRawItemTypeId('white-parasol'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('white-parasol'),
      biomeKinds: ['plains', 'savanna'],
      dayParity: 'even',
      dayDigitEnds: [],
      timeOfDay: 'day',
      phaseWindow: 'day',
      rarity: 'uncommon',
      rawHungerRestoreRatio: 0.44,
      cookedHungerRestoreRatio: 0.55,
      cookDurationMs: COOK_MS,
      cookedWellFedBuffId: 'well-fed-toughened-buff',
      cookedWellFedChance: 0.4,
    },
    {
      speciesId: 'green-vomiter',
      lookAlikePairId: 'parasol-vomiter',
      polarity: 'bad',
      rawDisplayName: 'Olive-gill Cap',
      cookedDisplayName: 'Cooked Olive-gill Cap',
      rawItemTypeId: formattingWorldPlazaMushroomRawItemTypeId('green-vomiter'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('green-vomiter'),
      biomeKinds: ['plains', 'savanna', 'desert', 'beach'],
      dayParity: 'odd',
      dayDigitEnds: [],
      timeOfDay: 'day',
      phaseWindow: 'day',
      rarity: 'rare',
      rawHungerRestoreRatio: 0.06,
      cookedHungerRestoreRatio: 0.1,
      cookDurationMs: COOK_MS,
      rawDiseaseId: 'parasol-purge',
      rawDiseaseChance: 1,
      cookedResidualDiseaseId: 'parasol-purge',
      cookedResidualDiseaseChance: 0.55,
    },
    {
      speciesId: 'field-agaric',
      lookAlikePairId: 'agaric-stain',
      polarity: 'good',
      rawDisplayName: 'White Field Cap',
      cookedDisplayName: 'Cooked White Field Cap',
      rawItemTypeId: formattingWorldPlazaMushroomRawItemTypeId('field-agaric'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('field-agaric'),
      biomeKinds: ['plains', 'savanna'],
      dayParity: 'any',
      dayDigitEnds: [],
      timeOfDay: 'day',
      phaseWindow: 'dawn',
      rarity: 'common',
      rawHungerRestoreRatio: 0.35,
      cookedHungerRestoreRatio: 0.45,
      cookDurationMs: COOK_MS,
      cookedWellFedBuffId: 'well-fed-vigor-buff',
      cookedWellFedChance: 0.4,
    },
    {
      speciesId: 'yellow-stain',
      lookAlikePairId: 'agaric-stain',
      polarity: 'bad',
      rawDisplayName: 'Yellow-bruise Cap',
      cookedDisplayName: 'Cooked Yellow-bruise Cap',
      rawItemTypeId: formattingWorldPlazaMushroomRawItemTypeId('yellow-stain'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('yellow-stain'),
      biomeKinds: ['plains', 'flower_forest'],
      dayParity: 'any',
      dayDigitEnds: [],
      timeOfDay: 'day',
      phaseWindow: 'day',
      rarity: 'uncommon',
      rawHungerRestoreRatio: 0.12,
      cookedHungerRestoreRatio: 0.16,
      cookDurationMs: COOK_MS,
      rawDiseaseId: 'yellow-stain-gut',
      rawDiseaseChance: 0.6,
      cookedResidualDiseaseId: 'yellow-stain-gut',
      cookedResidualDiseaseChance: 0.15,
    },
    {
      speciesId: 'shelf-oyster',
      lookAlikePairId: 'oyster-ghost',
      polarity: 'good',
      rawDisplayName: 'Cream Shelf',
      cookedDisplayName: 'Cooked Cream Shelf',
      rawItemTypeId: formattingWorldPlazaMushroomRawItemTypeId('shelf-oyster'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('shelf-oyster'),
      biomeKinds: ['forest', 'swamp', 'jungle'],
      dayParity: 'any',
      dayDigitEnds: [],
      timeOfDay: 'any',
      phaseWindow: 'any',
      rarity: 'common',
      rawHungerRestoreRatio: 0.32,
      cookedHungerRestoreRatio: 0.48,
      cookDurationMs: COOK_MS,
      cookedWellFedBuffId: 'well-fed-endurance-buff',
      cookedWellFedChance: 0.45,
    },
    {
      speciesId: 'ghost-wing',
      lookAlikePairId: 'oyster-ghost',
      polarity: 'bad',
      rawDisplayName: 'Pale Frost Shelf',
      cookedDisplayName: 'Cooked Pale Frost Shelf',
      rawItemTypeId: formattingWorldPlazaMushroomRawItemTypeId('ghost-wing'),
      cookedItemTypeId:
        formattingWorldPlazaMushroomCookedItemTypeId('ghost-wing'),
      biomeKinds: ['snowy_plains', 'frostsink', 'forest', 'rocky'],
      dayParity: 'even',
      dayDigitEnds: [],
      timeOfDay: 'night',
      phaseWindow: 'night_dawn',
      rarity: 'rare',
      rawHungerRestoreRatio: 0.06,
      cookedHungerRestoreRatio: 0.08,
      cookDurationMs: COOK_MS,
      rawDiseaseId: 'ghost-wing-fog',
      rawDiseaseChance: 0.7,
      cookedResidualDiseaseId: 'ghost-wing-fog',
      cookedResidualDiseaseChance: 0.45,
    },
  ] as const satisfies readonly DefiningWorldPlazaMushroomCatalogEntry[];

const DEFINING_WORLD_PLAZA_MUSHROOM_BY_SPECIES_ID = Object.fromEntries(
  DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG.map((entry) => [entry.speciesId, entry])
) as Record<
  DefiningWorldPlazaMushroomSpeciesId,
  DefiningWorldPlazaMushroomCatalogEntry
>;

const DEFINING_WORLD_PLAZA_MUSHROOM_BY_RAW_ITEM_TYPE_ID = Object.fromEntries(
  DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG.map((entry) => [
    entry.rawItemTypeId,
    entry,
  ])
) as Record<string, DefiningWorldPlazaMushroomCatalogEntry>;

export function resolvingWorldPlazaMushroomCatalogEntryBySpeciesId(
  speciesId: DefiningWorldPlazaMushroomSpeciesId
): DefiningWorldPlazaMushroomCatalogEntry {
  return DEFINING_WORLD_PLAZA_MUSHROOM_BY_SPECIES_ID[speciesId];
}

export function resolvingWorldPlazaMushroomCatalogEntryByRawItemTypeId(
  rawItemTypeId: string
): DefiningWorldPlazaMushroomCatalogEntry | null {
  return (
    DEFINING_WORLD_PLAZA_MUSHROOM_BY_RAW_ITEM_TYPE_ID[rawItemTypeId] ?? null
  );
}

export function listingWorldPlazaMushroomCatalogEntries(): readonly DefiningWorldPlazaMushroomCatalogEntry[] {
  return DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG;
}

export function checkingWorldPlazaMushroomCatalogCoversAllSpecies(): boolean {
  return (
    DEFINING_WORLD_PLAZA_MUSHROOM_CATALOG.length ===
    DEFINING_WORLD_PLAZA_MUSHROOM_SPECIES_IDS.length
  );
}

type PhaseBand = {
  readonly min: number;
  readonly max: number;
};

function listingWorldPlazaMushroomPhaseBands(
  phaseWindow: DefiningWorldPlazaMushroomPhaseWindowId
): readonly PhaseBand[] {
  switch (phaseWindow) {
    case 'any':
      return [{ min: 0, max: 1 }];
    case 'day':
      return [
        {
          min: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAY_MIN,
          max: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAY_MAX,
        },
      ];
    case 'night':
      return [
        {
          min: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAY_MAX,
          max: 1,
        },
        {
          min: 0,
          max: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAY_MIN,
        },
      ];
    case 'dawn':
      return [
        {
          min: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAWN_MIN,
          max: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAWN_MAX,
        },
      ];
    case 'dusk':
      return [
        {
          min: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DUSK_MIN,
          max: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DUSK_MAX,
        },
      ];
    case 'midday':
      return [
        {
          min: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_MIDDAY_MIN,
          max: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_MIDDAY_MAX,
        },
      ];
    case 'dawn_to_midday':
      return [
        {
          min: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAWN_TO_MIDDAY_MIN,
          max: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_DAWN_TO_MIDDAY_MAX,
        },
      ];
    case 'twilight':
      return [
        {
          min: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_TWILIGHT_MIN_A,
          max: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_TWILIGHT_MAX_A,
        },
        {
          min: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_TWILIGHT_MIN_B,
          max: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_TWILIGHT_MAX_B,
        },
      ];
    case 'night_dawn':
      return [
        {
          min: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_NIGHT_DAWN_MIN,
          max: 1,
        },
        {
          min: 0,
          max: DEFINING_WORLD_PLAZA_MUSHROOM_PHASE_NIGHT_DAWN_MAX,
        },
      ];
  }
}

export function checkingWorldPlazaMushroomPhaseWindowMatches(
  phaseWindow: DefiningWorldPlazaMushroomPhaseWindowId,
  cyclePhase: number
): boolean {
  const phase = ((cyclePhase % 1) + 1) % 1;

  for (const band of listingWorldPlazaMushroomPhaseBands(phaseWindow)) {
    if (phase >= band.min && phase < band.max) {
      return true;
    }
  }

  return false;
}

export function checkingWorldPlazaMushroomDayScheduleMatches(
  entry: DefiningWorldPlazaMushroomCatalogEntry,
  dayNumber: number
): boolean {
  if (entry.dayParity === 'odd' && dayNumber % 2 === 0) {
    return false;
  }

  if (entry.dayParity === 'even' && dayNumber % 2 !== 0) {
    return false;
  }

  if (entry.dayDigitEnds.length === 0) {
    return true;
  }

  const lastDigit = dayNumber % 10;
  return entry.dayDigitEnds.includes(lastDigit);
}
