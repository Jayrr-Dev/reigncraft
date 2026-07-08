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
        'Plucked off a plaza hen, still slick and cold. Cook it at a campfire before you double-click to eat.',
      cookedDescription:
        'Brown and a little stringy, but it does the job. Double-click to eat when hunger starts to bite.',
    },
    {
      speciesId: 'deer',
      rawDescription:
        'Lean haunch from a deer that bolted too slow. Raw venison is risky; roast it over a campfire first.',
      cookedDescription:
        'Smoke left a crust on the outside, pink gone from the middle. Mild, lean, and safe to eat.',
    },
    {
      speciesId: 'boar',
      rawDescription:
        'Thick slabs from a tusked boar. Tough and greasy raw; fire softens it and kills what you cannot see.',
      cookedDescription:
        'Fat rendered down over the flames. Heavy on the stomach, honest about filling you up.',
    },
    {
      speciesId: 'cow',
      rawDescription:
        'A solid cut from plaza cattle. Cook it well: raw beef still carries sickness and poison risk.',
      cookedDescription:
        'Seared until the juices run clear. One of the better meals you can pull off a campfire.',
    },
    {
      speciesId: 'sheep',
      rawDescription:
        'The wool is gone but the gaminess is not. Cook this mutton before you double-click to eat.',
      cookedDescription:
        'Warm, greasy, and fragrant with smoke. Fills you up without much fuss.',
    },
    {
      speciesId: 'zebra',
      rawDescription:
        'Striped hide is gone; the meat underneath is not. Roast at camp before you try eating it.',
      cookedDescription:
        'Oddly sweet for game meat. Campfire cooking makes it safe and surprisingly filling.',
    },
    {
      speciesId: 'grey-wolf',
      rawDescription:
        'Meat from the hunter that was stalking you. Risky raw; a campfire is not optional here.',
      cookedDescription:
        'Gamey and dense. You earned this meal, and cooked it is safe to eat.',
    },
    {
      speciesId: 'brown-bear',
      rawDescription:
        'A heavy haul from a brown bear. Raw bear meat is a gamble; cook it slow over the fire.',
      cookedDescription:
        'Rich and filling, the kind of meal that quiets hunger for a while. Worth the long cook.',
    },
    {
      speciesId: 'lion',
      rawDescription:
        'Cut from the king of the plaza grasslands. Eating this raw courts poison and sickness.',
      cookedDescription:
        'Bold flavor with campfire char on the edges. Dangerous prey turned into a proper meal.',
    },
    {
      speciesId: 'lioness',
      rawDescription:
        'Taken from a pride hunter on the prowl. Same rule as any big cat: cook it or pay for it.',
      cookedDescription:
        'Tender where the heat reached it. Safe, warm, and enough to restore real hunger.',
    },
    {
      speciesId: 'crocodile',
      rawDescription:
        'Pale muscle from a river ambusher. Chewy and risky until it has seen flame.',
      cookedDescription:
        'White flakes with the swampy edge cooked out. Odd meal, but it works.',
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
