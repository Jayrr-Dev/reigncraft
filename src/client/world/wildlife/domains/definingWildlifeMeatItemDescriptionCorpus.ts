/**
 * Player-facing flavor copy for wildlife raw and cooked meat items.
 *
 * @module components/world/wildlife/domains/definingWildlifeMeatItemDescriptionCorpus
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type DefiningWildlifeMeatItemDescriptionEntry = {
  readonly speciesId: DefiningWildlifeSpeciesId;
  readonly rawDescription: string;
  readonly cookedDescription: string;
};

/** Per-species meat item info-dialog descriptions. */
export const DEFINING_WILDLIFE_MEAT_ITEM_DESCRIPTION_ENTRIES: readonly DefiningWildlifeMeatItemDescriptionEntry[] =
  [
    {
      speciesId: 'chicken',
      rawDescription:
        'Plucked off a plaza hen, still slick and cold. Eating raw risks salmonellosis: nausea, poison, and half hunger while sick.',
      cookedDescription:
        'Brown and a little stringy. Safe to eat; may grant a short comfort buff that eases stamina recovery.',
    },
    {
      speciesId: 'deer',
      rawDescription:
        'Lean haunch from a deer that bolted too slow. Raw venison can cause chronic wasting: confusion and a long, creeping sickness.',
      cookedDescription:
        'Smoke left a crust on the outside. Usually safe; may make you fleet-footed. Prions rarely survive the fire.',
    },
    {
      speciesId: 'boar',
      rawDescription:
        'Thick slabs from a tusked boar. Raw pork risks trichinellosis: muscle lock, no sprint or jump, then venomous poison.',
      cookedDescription:
        'Fat rendered down over the flames. Safe meal with a chance to toughen you against incoming hits.',
    },
    {
      speciesId: 'cow',
      rawDescription:
        'A solid cut from plaza cattle. Raw beef risks mad cow disease: confusion and delayed neural damage.',
      cookedDescription:
        'Seared until the juices run clear. May grant prime strength; prion sickness is rare but possible.',
    },
    {
      speciesId: 'sheep',
      rawDescription:
        'The wool is gone but the gaminess is not. Raw mutton can carry liver fluke: slow shuffle and brutal stamina drain.',
      cookedDescription:
        'Warm, greasy, and fragrant with smoke. Safe to eat; may amplify healing from other sources.',
    },
    {
      speciesId: 'zebra',
      rawDescription:
        'Striped hide is gone; the meat underneath is not. Raw zebra risks sleeping sickness: confusion and sudden drowsiness.',
      cookedDescription:
        'Oddly sweet for game meat. Safe when cooked; may boost stamina regen for a while.',
    },
    {
      speciesId: 'grey-wolf',
      rawDescription:
        'Meat from the hunter that was stalking you. Raw wolf risks wolf fever: no jump or roll, then confusion.',
      cookedDescription:
        'Gamey and dense. Cooked it is safe; may sharpen your strike damage for a short time.',
    },
    {
      speciesId: 'brown-bear',
      rawDescription:
        'A heavy haul from a brown bear. Raw bear risks bear worm: weakness, then delayed bleeding as it worsens.',
      cookedDescription:
        'Rich and filling. Safe when cooked; may swell your max health for a hearty stretch.',
    },
    {
      speciesId: 'lion',
      rawDescription:
        'Cut from the king of the plaza grasslands. Raw lion risks toxoplasmosis: nausea and scrambled footing.',
      cookedDescription:
        'Bold flavor with campfire char. Safe meal with a chance at predator strength.',
    },
    {
      speciesId: 'lioness',
      rawDescription:
        'Taken from a pride hunter on the prowl. Raw big-cat meat carries the same toxoplasmosis risk as lion.',
      cookedDescription:
        'Tender where the heat reached it. Safe and may grant a brief strength buff.',
    },
    {
      speciesId: 'crocodile',
      rawDescription:
        'Pale muscle from a river ambusher. Raw crocodile risks vibrio infection: poison, nausea, then delayed shock damage.',
      cookedDescription:
        'White flakes with the swampy edge cooked out. Safe; may harden you slightly against hits.',
    },
  ];

const DEFINING_WILDLIFE_MEAT_ITEM_DESCRIPTION_BY_SPECIES = Object.fromEntries(
  DEFINING_WILDLIFE_MEAT_ITEM_DESCRIPTION_ENTRIES.map((entry) => [
    entry.speciesId,
    entry,
  ])
) as Record<
  DefiningWildlifeSpeciesId,
  DefiningWildlifeMeatItemDescriptionEntry
>;

/** Resolves flavor copy for one wildlife meat species. */
export function resolvingWildlifeMeatItemDescriptionEntry(
  speciesId: DefiningWildlifeSpeciesId
): DefiningWildlifeMeatItemDescriptionEntry | null {
  return DEFINING_WILDLIFE_MEAT_ITEM_DESCRIPTION_BY_SPECIES[speciesId] ?? null;
}
