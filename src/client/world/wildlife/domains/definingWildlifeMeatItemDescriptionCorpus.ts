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
    {
      speciesId: 'antilope',
      rawDescription:
        'Light cut from a savanna sprinter. Raw antilope risks sleeping sickness: confusion and sudden drowsiness.',
      cookedDescription:
        'Lean and quick off the fire. Safe to eat; may put some spring back in your legs.',
    },
    {
      speciesId: 'oryx',
      rawDescription:
        'Dense shoulder from a horned desert grazer. Raw oryx can carry liver fluke: slow shuffle and brutal stamina drain.',
      cookedDescription:
        'Dry-country meat, all muscle. Safe when cooked; may boost stamina regen for a while.',
    },
    {
      speciesId: 'giraffe',
      rawDescription:
        'A long strip from a very long neck. Raw giraffe risks sleeping sickness: confusion and sudden drowsiness.',
      cookedDescription:
        'Takes forever over the fire and feeds you for longer. Safe; may amplify healing from other sources.',
    },
    {
      speciesId: 'ostrich',
      rawDescription:
        'Red meat off the bird that kicks back. Raw ostrich risks salmonellosis: nausea, poison, and half hunger while sick.',
      cookedDescription:
        'Darker than any chicken and twice the meal. Safe; may make you fleet-footed.',
    },
    {
      speciesId: 'elephant',
      rawDescription:
        'A haul that barely fits in the bag. Raw elephant can carry liver fluke: slow shuffle and brutal stamina drain.',
      cookedDescription:
        'One cut feeds a camp. Safe when cooked; may swell your max health for a hearty stretch.',
    },
    {
      speciesId: 'elephant-female',
      rawDescription:
        'Taken from a matriarch who warned you first. Raw elephant can carry liver fluke: slow shuffle and stamina drain.',
      cookedDescription:
        'Rich, dense, and slightly guilt-flavored. Safe; may swell your max health for a while.',
    },
    {
      speciesId: 'rhino',
      rawDescription:
        'Thick slab from under an armored hide. Raw rhino can carry liver fluke: slow shuffle and brutal stamina drain.',
      cookedDescription:
        'Chewy even after a long fire. Safe; may toughen you against incoming hits.',
    },
    {
      speciesId: 'rhino-female',
      rawDescription:
        'Cut from a rhino cow that charged anyway. Raw rhino can carry liver fluke: slow shuffle and stamina drain.',
      cookedDescription:
        'Slightly less chewy than the bull, say those who survived both. Safe; may toughen you against hits.',
    },
    {
      speciesId: 'hyena',
      rawDescription:
        'Rank meat from a night scavenger. Raw hyena risks toxoplasmosis: nausea and scrambled footing.',
      cookedDescription:
        'The smell mostly cooks out. Mostly. Safe; may sharpen your strike damage for a short time.',
    },
    {
      speciesId: 'bison',
      rawDescription:
        'A heavy cut from a plains wall of muscle. Raw bison risks mad cow disease: confusion and delayed neural damage.',
      cookedDescription:
        'Rich and beefy with a wilder edge. Safe; may swell your max health. Prion sickness is rare but possible.',
    },
    {
      speciesId: 'pig',
      rawDescription:
        'Softer and fattier than boar. Raw pork risks trichinellosis: muscle lock, no sprint or jump, then venomous poison.',
      cookedDescription:
        'The fat crisps up beautifully. Safe meal; may grant a short comfort buff that eases stamina recovery.',
    },
    {
      speciesId: 'bull',
      rawDescription:
        'Taken from a bull that gave you exactly one warning. Raw beef risks mad cow disease: confusion and neural damage.',
      cookedDescription:
        'Thick, dark, and earned. May grant prime strength; prion sickness is rare but possible.',
    },
    {
      speciesId: 'stag',
      rawDescription:
        'A proud rack, a heavy haunch. Raw venison can cause chronic wasting: confusion and a long, creeping sickness.',
      cookedDescription:
        'Richer than common deer. Usually safe; may make you fleet-footed. Prions rarely survive the fire.',
    },
    {
      speciesId: 'brown-horse',
      rawDescription:
        'Lean meat from a feral runner. Raw horse risks sleeping sickness: confusion and sudden drowsiness.',
      cookedDescription:
        'Sweet, lean, and a little sad. Safe when cooked; may boost stamina regen for a while.',
    },
    {
      speciesId: 'work-horse',
      rawDescription:
        'A heavy cut from a heavy hauler. Raw horse risks sleeping sickness: confusion and sudden drowsiness.',
      cookedDescription:
        'Dense working muscle, slow to chew. Safe; may amplify healing from other sources.',
    },
    {
      speciesId: 'arabian-horse',
      rawDescription:
        'Fine-grained meat from the fastest thing on four legs. Raw horse risks sleeping sickness: sudden drowsiness.',
      cookedDescription:
        'Lean enough to vanish off the skewer. Safe; may make you fleet-footed.',
    },
    {
      speciesId: 'donkey',
      rawDescription:
        'Tough meat from a stubborn animal. Raw donkey risks sleeping sickness: confusion and sudden drowsiness.',
      cookedDescription:
        'Chewy but honest. Safe to eat; may grant a short comfort buff.',
    },
    {
      speciesId: 'hippo',
      rawDescription:
        'A massive cut from the swamp\u2019s worst temper. Raw hippo risks vibrio infection: poison, nausea, then delayed shock.',
      cookedDescription:
        'Fatty, filling, and hard won. Safe; may swell your max health for a hearty stretch.',
    },
    {
      speciesId: 'water-buffalo',
      rawDescription:
        'Marsh-fed beef with a mud perfume. Raw buffalo risks mad cow disease: confusion and delayed neural damage.',
      cookedDescription:
        'Hearty and slightly sweet. Safe; may amplify healing. Prion sickness is rare but possible.',
    },
    {
      speciesId: 'turtle',
      rawDescription:
        'A small cut pried out of a shell. Raw turtle risks salmonellosis: nausea, poison, and half hunger while sick.',
      cookedDescription:
        'Delicate, almost sweet. Safe when cooked; may harden you slightly against hits.',
    },
    {
      speciesId: 'tortoise',
      rawDescription:
        'The shell was most of the animal. Raw tortoise risks salmonellosis: nausea, poison, and half hunger while sick.',
      cookedDescription:
        'Slow food from a slow animal. Safe; may harden you slightly against hits.',
    },
    {
      speciesId: 'polar-bear',
      rawDescription:
        'Pale fat over dark meat. Raw polar bear almost always carries bear worm: weakness, then delayed bleeding.',
      cookedDescription:
        'Greasy and enormous. Cook it thoroughly, then cook it again. May swell your max health.',
    },
    {
      speciesId: 'mammoth',
      rawDescription:
        'A shaggy mountain reduced to portions. Raw mammoth can carry liver fluke: slow shuffle and stamina drain.',
      cookedDescription:
        'Tastes like history and feeds like a feast. Safe; may swell your max health for a long stretch.',
    },
    {
      speciesId: 'camel',
      rawDescription:
        'Firm meat from a desert walker. Raw camel can carry liver fluke: slow shuffle and brutal stamina drain.',
      cookedDescription:
        'Dry but dependable, like the animal. Safe; may boost stamina regen for a while.',
    },
    {
      speciesId: 'ram',
      rawDescription:
        'Mutton off a cliff-hopper that charged first. Raw ram can carry liver fluke: slow shuffle and stamina drain.',
      cookedDescription:
        'Gamier than sheep and prouder about it. Safe; may toughen you against incoming hits.',
    },
    {
      speciesId: 'llama',
      rawDescription:
        'Lean meat under a lot of wool. Raw llama risks toxoplasmosis: nausea and scrambled footing.',
      cookedDescription:
        'Mild highland fare. Safe to eat; may grant a short comfort buff.',
    },
    {
      speciesId: 'alpaca',
      rawDescription:
        'A small cut from a smaller llama. Raw alpaca risks toxoplasmosis: nausea and scrambled footing.',
      cookedDescription:
        'Tender and faintly sweet. Safe; may grant a short comfort buff. Yes, it was very soft. Eat.',
    },
    {
      speciesId: 'yak',
      rawDescription:
        'Cold-country beef under a foot of hair. Raw yak risks mad cow disease: confusion and delayed neural damage.',
      cookedDescription:
        'Fatty enough to keep the frost out. Safe; may swell your max health. Prion sickness is rare but possible.',
    },
    {
      speciesId: 'tiger',
      rawDescription:
        'Striped hide, striped luck. Raw tiger risks toxoplasmosis: nausea and scrambled footing.',
      cookedDescription:
        'Bold, dark meat from the jungle\u2019s landlord. Safe meal with a chance at predator strength.',
    },
    {
      speciesId: 'jaguar',
      rawDescription:
        'Cut from an ambusher that picked the wrong shadow. Raw jaguar risks toxoplasmosis: nausea and scrambled footing.',
      cookedDescription:
        'Dense cat meat with a smoky edge. Safe; may grant a brief strength buff.',
    },
    {
      speciesId: 'monkey',
      rawDescription:
        'A very small meal that screamed a lot. Raw monkey risks toxoplasmosis: nausea and scrambled footing.',
      cookedDescription:
        'Barely a skewer\u2019s worth. Safe when cooked; may grant a short comfort buff.',
    },
    {
      speciesId: 'chimp',
      rawDescription:
        'Taken from something uncomfortably strong. Raw chimp risks toxoplasmosis: nausea and scrambled footing.',
      cookedDescription:
        'Filling, and best not thought about too hard. Safe; may amplify healing from other sources.',
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
