/**
 * Flavor copy for fishing-catch meats (wildlife meat species ids = catch ids).
 * Sensory leads compose from body family + habitat (water kind / biome tag),
 * with optional per-catch authored overrides for named lore fish.
 *
 * @module components/world/wildlife/domains/definingWildlifeFishMeatItemDescriptionCorpus
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWorldPlazaWaterKind } from '@/components/world/domains/definingWorldPlazaWaterKind';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import {
  resolvingWorldPlazaEntityDiseaseDescriptor,
  type DefiningWorldPlazaEntityDiseaseId,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import {
  listingWorldPlazaFishingCatchCreatures,
  type DefiningWorldPlazaFishingCatchCreatureEntry,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry';
import type { DefiningWildlifeMeatItemDescriptionEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatItemDescriptionCorpus';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

type DefiningWildlifeFishMeatBodyFamily =
  | 'finfish'
  | 'shellfish'
  | 'crustacean'
  | 'eel'
  | 'turtle'
  | 'amphibian'
  | 'starfish';

type DefiningWildlifeFishMeatBiomeFlavorTag =
  | 'cold'
  | 'coast'
  | 'jungle'
  | 'swamp'
  | 'savanna'
  | 'flower';

type DefiningWildlifeFishMeatFlavorLead = {
  readonly rawLead: string;
  readonly cookedLead: string;
};

/** {name} = catch short name (no "Raw " prefix). */
const DEFINING_WILDLIFE_FISH_MEAT_BODY_FAMILY_LEADS: Record<
  DefiningWildlifeFishMeatBodyFamily,
  DefiningWildlifeFishMeatFlavorLead
> = {
  finfish: {
    rawLead: '{name}, cold flesh and wet scales',
    cookedLead: 'Cooked {name}, flaky and clean',
  },
  shellfish: {
    rawLead: '{name}, shell cracked, meat gray and wet',
    cookedLead: 'Cooked {name}, chewy-sweet and hot',
  },
  crustacean: {
    rawLead: '{name}, damp shell, raw meat smelling sweet',
    cookedLead: 'Cooked {name}, pink and firm',
  },
  eel: {
    rawLead: '{name}, slick as rope and still cold',
    cookedLead: 'Cooked {name}, rich and oily',
  },
  turtle: {
    rawLead: '{name} meat, dense and muddy-smelling',
    cookedLead: 'Cooked {name}, dense stew meat',
  },
  amphibian: {
    rawLead: '{name}, pale legs cold to the touch',
    cookedLead: 'Cooked {name}, mild white meat',
  },
  starfish: {
    rawLead: '{name}, rubbery arms with a salt bite',
    cookedLead: 'Cooked {name}, chewy and oddly savory',
  },
};

const DEFINING_WILDLIFE_FISH_MEAT_WATER_HABITAT_CLAUSES: Record<
  DefiningWorldPlazaWaterKind,
  string
> = {
  lake: 'from a still Corpus lake',
  river: 'hauled from a Corpus river current',
  stream: 'from a cold Corpus rill',
  pond: 'from a quiet Corpus pond',
  swamp_pond: 'from black Corpus bogwater',
};

const DEFINING_WILDLIFE_FISH_MEAT_BIOME_HABITAT_CLAUSES: Record<
  DefiningWildlifeFishMeatBiomeFlavorTag,
  string
> = {
  cold: 'from iced Corpus water that bites the fingers',
  coast: 'from brackish Corpus shore water',
  jungle: 'from warm, tannin-stained Corpus water',
  swamp: 'from Corpus marsh that smells like peat',
  savanna: 'from a shallow Corpus channel under dry sky',
  flower: 'from a clear Corpus pool under blossom shade',
};

/**
 * Authored leads for lore-named catches. Prefer these over composed templates.
 * Keep disease/buff sentences outside; leads are sensory only.
 */
const DEFINING_WILDLIFE_FISH_MEAT_AUTHORED_LEADS_BY_CATCH_ID: Readonly<
  Partial<Record<string, DefiningWildlifeFishMeatFlavorLead>>
> = {
  'stillglass-pike': {
    rawLead: 'Stillglass Pike, pale as lake ice and almost clear',
    cookedLead: 'Cooked Stillglass Pike, white flakes that fall apart clean',
  },
  'quiet-hand-sunfish': {
    rawLead: 'Quiet-Hand Sunfish, warm gold even off the hook',
    cookedLead: 'Cooked Quiet-Hand Sunfish, soft and oddly comforting',
  },
  'ladder-rime-char': {
    rawLead: 'Ladder-Rime Char, frost still clinging to the belly',
    cookedLead: 'Cooked Ladder-Rime Char, pink flesh that holds the cold',
  },
  'current-thread-eel': {
    rawLead: 'Current-Thread Eel, thin as line and hard to hold',
    cookedLead: 'Cooked Current-Thread Eel, oily and quick to finish',
  },
  'carnegus-gravel-ray': {
    rawLead: "Carnegus Gravel-Ray, skin like river stone grit",
    cookedLead: 'Cooked Carnegus Gravel-Ray, dense and mineral-tasting',
  },
  'vinecoil-moray': {
    rawLead: 'Vinecoil Moray, coiled wet and smelling of jungle rot',
    cookedLead: 'Cooked Vinecoil Moray, dark meat with a sharp finish',
  },
  'spritcore-tadling': {
    rawLead: 'Spritcore Tadling, tiny body humming like a packed core',
    cookedLead: 'Cooked Spritcore Tadling, barely a bite, bright afterward',
  },
  'mirrorpuddle-carp': {
    rawLead: 'Mirrorpuddle Carp, scales throwing pond light back at you',
    cookedLead: 'Cooked Mirrorpuddle Carp, thick and filling',
  },
  'uncored-leechfish': {
    rawLead: 'Uncored Leechfish, soft and wrong, like it gave its core away',
    cookedLead: 'Cooked Uncored Leechfish, gray meat that still tastes hollow',
  },
  'red-choir-bogmaw': {
    rawLead: 'Red-Choir Bogmaw, jaws still set, bog-stink thick on it',
    cookedLead: 'Cooked Red-Choir Bogmaw, heavy meat with a bitter edge',
  },
  'mereon-judgment-gar': {
    rawLead: "Mereon's Judgment Gar, long and armored, catch of the Worthy",
    cookedLead: "Cooked Mereon's Judgment Gar, firm steaks worth the fight",
  },
  'painted-snail': {
    rawLead: 'Painted Snail, shell mottled like spilled flower dye',
    cookedLead: 'Cooked Painted Snail, small and floral-tasting',
  },
  'dustwake-barb': {
    rawLead: 'Dustwake Barb, dry-country fish that still tastes of silt',
    cookedLead: 'Cooked Dustwake Barb, lean and sun-warm',
  },
};

const DEFINING_WILDLIFE_FISH_MEAT_BODY_FAMILY_BY_CATCH_ID: Readonly<
  Partial<Record<string, DefiningWildlifeFishMeatBodyFamily>>
> = {
  'freshwater-mussel': 'shellfish',
  'soft-shell-clam': 'shellfish',
  'painted-snail': 'shellfish',
  'freshwater-snail': 'shellfish',
  'apple-snail': 'shellfish',
  crayfish: 'crustacean',
  'cold-water-shrimp': 'crustacean',
  'giant-river-prawn': 'crustacean',
  'dwarf-crayfish': 'crustacean',
  'ice-rill-shrimp': 'crustacean',
  'freshwater-crab': 'crustacean',
  'mangrove-crab': 'crustacean',
  'swamp-crayfish': 'crustacean',
  'swamp-mud-crab': 'crustacean',
  'current-thread-eel': 'eel',
  'vinecoil-moray': 'eel',
  'mud-turtle': 'turtle',
  bullfrog: 'amphibian',
  'spritcore-tadling': 'amphibian',
  'common-starfish': 'starfish',
};

const DEFINING_WILDLIFE_FISH_MEAT_BODY_FAMILY_ID_RULES: readonly {
  readonly pattern: RegExp;
  readonly family: DefiningWildlifeFishMeatBodyFamily;
}[] = [
  { pattern: /mussel|clam|snail/u, family: 'shellfish' },
  { pattern: /crab|crayfish|shrimp|prawn/u, family: 'crustacean' },
  { pattern: /eel|moray/u, family: 'eel' },
  { pattern: /turtle/u, family: 'turtle' },
  { pattern: /frog|tadling/u, family: 'amphibian' },
  { pattern: /starfish/u, family: 'starfish' },
];

function formattingCatchShortName(rawDisplayName: string): string {
  return rawDisplayName.replace(/^Raw\s+/u, '');
}

function formattingLeadTemplate(template: string, shortName: string): string {
  return template.replaceAll('{name}', shortName);
}

function resolvingFishMeatBodyFamily(
  catchId: string
): DefiningWildlifeFishMeatBodyFamily {
  const authored = DEFINING_WILDLIFE_FISH_MEAT_BODY_FAMILY_BY_CATCH_ID[catchId];
  if (authored) {
    return authored;
  }

  for (const rule of DEFINING_WILDLIFE_FISH_MEAT_BODY_FAMILY_ID_RULES) {
    if (rule.pattern.test(catchId)) {
      return rule.family;
    }
  }

  return 'finfish';
}

function resolvingFishMeatBiomeFlavorTag(
  biomeKinds: readonly DefiningWorldPlazaBiomeKind[] | undefined
): DefiningWildlifeFishMeatBiomeFlavorTag | null {
  if (!biomeKinds || biomeKinds.length === 0) {
    return null;
  }

  if (
    biomeKinds.includes('snowy_plains') ||
    biomeKinds.includes('frostsink')
  ) {
    return 'cold';
  }
  if (biomeKinds.includes('beach') || biomeKinds.includes('ocean')) {
    return 'coast';
  }
  if (biomeKinds.includes('jungle')) {
    return 'jungle';
  }
  if (biomeKinds.includes('swamp')) {
    return 'swamp';
  }
  if (biomeKinds.includes('savanna')) {
    return 'savanna';
  }
  if (biomeKinds.includes('flower_forest')) {
    return 'flower';
  }

  return null;
}

function resolvingFishMeatHabitatClause(
  creature: DefiningWorldPlazaFishingCatchCreatureEntry
): string {
  const biomeTag = resolvingFishMeatBiomeFlavorTag(creature.biomeKinds);
  if (biomeTag) {
    return DEFINING_WILDLIFE_FISH_MEAT_BIOME_HABITAT_CLAUSES[biomeTag];
  }

  const primaryWaterKind = creature.waterKinds[0] ?? 'lake';
  return DEFINING_WILDLIFE_FISH_MEAT_WATER_HABITAT_CLAUSES[primaryWaterKind];
}

function resolvingFishMeatFlavorLeads(
  creature: DefiningWorldPlazaFishingCatchCreatureEntry,
  shortName: string
): DefiningWildlifeFishMeatFlavorLead {
  const authored =
    DEFINING_WILDLIFE_FISH_MEAT_AUTHORED_LEADS_BY_CATCH_ID[creature.catchId];
  if (authored) {
    return {
      rawLead: formattingLeadTemplate(authored.rawLead, shortName),
      cookedLead: formattingLeadTemplate(authored.cookedLead, shortName),
    };
  }

  const family = resolvingFishMeatBodyFamily(creature.catchId);
  const familyLeads = DEFINING_WILDLIFE_FISH_MEAT_BODY_FAMILY_LEADS[family];
  const habitat = resolvingFishMeatHabitatClause(creature);
  const rawFamilyLead = formattingLeadTemplate(familyLeads.rawLead, shortName);
  const cookedFamilyLead = formattingLeadTemplate(
    familyLeads.cookedLead,
    shortName.toLowerCase()
  );

  return {
    rawLead: `${rawFamilyLead}, ${habitat}`,
    cookedLead: cookedFamilyLead,
  };
}

function buildingFishMeatDescriptionEntry(
  creature: DefiningWorldPlazaFishingCatchCreatureEntry
): DefiningWildlifeMeatItemDescriptionEntry {
  const shortName = formattingCatchShortName(creature.rawDisplayName);
  const rawDiseaseId = creature.rawDiseaseId ?? 'salmonellosis';
  const rawDiseaseChance = creature.rawDiseaseChance ?? 0;
  const cookedWellFedBuffId =
    creature.cookedWellFedBuffId ?? 'well-fed-comfort-buff';
  const cookedWellFedChance = creature.cookedWellFedChance ?? 0;

  const diseaseLabel = resolvingWorldPlazaEntityDiseaseDescriptor(
    rawDiseaseId as DefiningWorldPlazaEntityDiseaseId
  ).label;
  const buffLabel =
    resolvingWorldPlazaEntityBuffDescriptor(cookedWellFedBuffId)?.label ??
    'a short well-fed buff';
  const rawRisk =
    rawDiseaseChance > 0
      ? `Eating raw risks ${diseaseLabel.toLowerCase()}.`
      : 'Surprisingly mild raw, but fire still makes it safer.';
  const cookedBuff =
    cookedWellFedChance > 0
      ? `Safe after the fire; may grant ${buffLabel}.`
      : 'Safe after the fire.';

  const leads = resolvingFishMeatFlavorLeads(creature, shortName);

  return {
    speciesId: creature.catchId,
    rawDescription: `${leads.rawLead}. ${rawRisk}`,
    cookedDescription: `${leads.cookedLead}. ${cookedBuff}`,
  };
}

/** Per-catch fish meat descriptions derived from the fishing catch creatures. */
export const DEFINING_WILDLIFE_FISH_MEAT_ITEM_DESCRIPTION_ENTRIES: readonly DefiningWildlifeMeatItemDescriptionEntry[] =
  listingWorldPlazaFishingCatchCreatures().map(buildingFishMeatDescriptionEntry);

const DEFINING_WILDLIFE_FISH_MEAT_ITEM_DESCRIPTION_BY_SPECIES =
  Object.fromEntries(
    DEFINING_WILDLIFE_FISH_MEAT_ITEM_DESCRIPTION_ENTRIES.map((entry) => [
      entry.speciesId,
      entry,
    ])
  ) as Record<
    DefiningWildlifeSpeciesId,
    DefiningWildlifeMeatItemDescriptionEntry
  >;

/** Resolves fish meat flavor copy by catch / species id. */
export function resolvingWildlifeFishMeatItemDescriptionEntry(
  speciesId: DefiningWildlifeSpeciesId
): DefiningWildlifeMeatItemDescriptionEntry | null {
  return (
    DEFINING_WILDLIFE_FISH_MEAT_ITEM_DESCRIPTION_BY_SPECIES[speciesId] ?? null
  );
}
