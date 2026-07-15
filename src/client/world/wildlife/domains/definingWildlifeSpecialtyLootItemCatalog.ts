/**
 * Unique wildlife specialty loot items (body parts / products). Meat stays separate.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpecialtyLootItemCatalog
 */

import type { DefiningInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';

export type DefiningWildlifeSpecialtyLootItemDefinition = {
  readonly itemTypeId: string;
  readonly displayName: string;
  readonly rarity: DefiningInventoryItemRarity;
  readonly description: string;
  /** Sprite sheet group id used by specialty sprite constants. */
  readonly spriteGroupId: DefiningWildlifeSpecialtyLootSpriteGroupId;
  /** Index within that group's left→right, top→bottom cell order. */
  readonly spriteCellIndex: number;
};

export type DefiningWildlifeSpecialtyLootSpriteGroupId =
  | 'farm'
  | 'companions'
  | 'runners'
  | 'horses'
  | 'shell'
  | 'predators'
  | 'giants';

/** All unique specialty loot item definitions (shared across species). */
export const DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_CATALOG: readonly DefiningWildlifeSpecialtyLootItemDefinition[] =
  [
    // farm (12) — 4×3
    {
      itemTypeId: 'world-plaza-wildlife-milk',
      displayName: 'Milk',
      rarity: 'common',
      description: 'Warm from a plains cow. Healer work loves it; so does a dry throat on the road.',
      spriteGroupId: 'farm',
      spriteCellIndex: 0,
    },
    {
      itemTypeId: 'world-plaza-wildlife-wool',
      displayName: 'Wool',
      rarity: 'common',
      description: 'Greasy fleece off a grazer. Packs wounds, stuffs bedding, and stops a cold wind.',
      spriteGroupId: 'farm',
      spriteCellIndex: 1,
    },
    {
      itemTypeId: 'world-plaza-wildlife-feather',
      displayName: 'Feather',
      rarity: 'common',
      description: 'Light hen plume. Fever cloths take it; so do fletchers who cannot afford better.',
      spriteGroupId: 'farm',
      spriteCellIndex: 2,
    },
    {
      itemTypeId: 'world-plaza-wildlife-egg',
      displayName: 'Egg',
      rarity: 'rare',
      description: 'Warm from the nest. Crack it into a pan before it remembers it had a mother.',
      spriteGroupId: 'farm',
      spriteCellIndex: 3,
    },
    {
      itemTypeId: 'world-plaza-wildlife-bristle',
      displayName: 'Bristle',
      rarity: 'common',
      description: 'Stiff hair from pig or boar. Makes brushes, and it shows up in drawing poultices that pull rot out.',
      spriteGroupId: 'farm',
      spriteCellIndex: 4,
    },
    {
      itemTypeId: 'world-plaza-wildlife-pig-fat',
      displayName: 'Pig Fat',
      rarity: 'rare',
      description: 'Dense lard that cooks hot and fills a bag. Salves, liniments, and greasy meals all run on it.',
      spriteGroupId: 'farm',
      spriteCellIndex: 5,
    },
    {
      itemTypeId: 'world-plaza-wildlife-hide',
      displayName: 'Hide',
      rarity: 'common',
      description: 'Plain cattle skin, still stiff with blood. First cut of leather for anyone who scrapes it clean.',
      spriteGroupId: 'farm',
      spriteCellIndex: 6,
    },
    {
      itemTypeId: 'world-plaza-wildlife-brown-hide',
      displayName: 'Brown Hide',
      rarity: 'rare',
      description: 'Coat from brown plains cattle. Same leather work as plain hide, just darker when tanned.',
      spriteGroupId: 'farm',
      spriteCellIndex: 7,
    },
    {
      itemTypeId: 'world-plaza-wildlife-sheep-skin',
      displayName: 'Sheep Skin',
      rarity: 'rare',
      description: 'Skin with wool still clinging. Wound packs love the padding; bedrolls love the rest.',
      spriteGroupId: 'farm',
      spriteCellIndex: 8,
    },
    {
      itemTypeId: 'world-plaza-wildlife-muddy-hide',
      displayName: 'Muddy Hide',
      rarity: 'common',
      description: 'Water-buffalo skin caked in river mud. Scrape the muck and the leather underneath is stubborn.',
      spriteGroupId: 'farm',
      spriteCellIndex: 9,
    },
    {
      itemTypeId: 'world-plaza-wildlife-horn',
      displayName: 'Horn',
      rarity: 'rare',
      description: 'Solid tip from bull, bison, ram, or worse. Scrapes into tools, handles, and bitter tonics.',
      spriteGroupId: 'farm',
      spriteCellIndex: 10,
    },
    {
      itemTypeId: 'world-plaza-wildlife-shaggy-coat',
      displayName: 'Shaggy Coat',
      rarity: 'common',
      description: 'Thick bison fleece full of burs and plains dust. Keeps a wanderer warm when the wind turns mean.',
      spriteGroupId: 'farm',
      spriteCellIndex: 11,
    },

    // companions (8) — 4×2
    {
      itemTypeId: 'world-plaza-wildlife-dog-fur',
      displayName: 'Dog Fur',
      rarity: 'common',
      description: 'Soft undercoat from a companion that ran with you. Kennel salves bind better with it mixed in.',
      spriteGroupId: 'companions',
      spriteCellIndex: 0,
    },
    {
      itemTypeId: 'world-plaza-wildlife-dog-tooth',
      displayName: 'Dog Tooth',
      rarity: 'rare',
      description: 'Clean canine off a hound. Worn on a collar more often than hung as a trophy.',
      spriteGroupId: 'companions',
      spriteCellIndex: 1,
    },
    {
      itemTypeId: 'world-plaza-wildlife-whisker',
      displayName: 'Whisker',
      rarity: 'common',
      description: 'A long cat whisker.',
      spriteGroupId: 'companions',
      spriteCellIndex: 2,
    },
    {
      itemTypeId: 'world-plaza-wildlife-pale-fur',
      displayName: 'Pale Fur',
      rarity: 'common',
      description: 'White tuft off a pale house cat. Shows every speck of trail dust.',
      spriteGroupId: 'companions',
      spriteCellIndex: 3,
    },
    {
      itemTypeId: 'world-plaza-wildlife-sun-fur',
      displayName: 'Sun Fur',
      rarity: 'common',
      description: 'Orange cat fluff that still holds a little warm-stone smell.',
      spriteGroupId: 'companions',
      spriteCellIndex: 4,
    },
    {
      itemTypeId: 'world-plaza-wildlife-heavy-fur',
      displayName: 'Heavy Fur',
      rarity: 'common',
      description: 'Thick coat from a big house cat. Heavier than it looks in the bag.',
      spriteGroupId: 'companions',
      spriteCellIndex: 5,
    },
    {
      itemTypeId: 'world-plaza-wildlife-cat-claw',
      displayName: 'Cat Claw',
      rarity: 'rare',
      description: 'Curved nail from a house cat. Ground fine, it stops a scratch from bleeding longer than it should.',
      spriteGroupId: 'companions',
      spriteCellIndex: 6,
    },
    {
      itemTypeId: 'world-plaza-wildlife-night-whisker',
      displayName: 'Night Whisker',
      rarity: 'common',
      description: 'One long whisker from a black cat. Fine as thread, stubborn as the animal.',
      spriteGroupId: 'companions',
      spriteCellIndex: 7,
    },

    // runners (12) — 4×3
    {
      itemTypeId: 'world-plaza-wildlife-soft-hide',
      displayName: 'Soft Hide',
      rarity: 'common',
      description: 'Thin skin from a deer that almost got away. Soft enough to pillow a fever sleep.',
      spriteGroupId: 'runners',
      spriteCellIndex: 0,
    },
    {
      itemTypeId: 'world-plaza-wildlife-tendon',
      displayName: 'Tendon',
      rarity: 'rare',
      description: 'Tough sinew from a runner\'s leg. Bowstring, splint wrap, and bruise liniment all start here.',
      spriteGroupId: 'runners',
      spriteCellIndex: 1,
    },
    {
      itemTypeId: 'world-plaza-wildlife-antler',
      displayName: 'Antler',
      rarity: 'rare',
      description: 'Branched rack from a stag that lost the chase. Saw it down for hafts.',
      spriteGroupId: 'runners',
      spriteCellIndex: 2,
    },
    {
      itemTypeId: 'world-plaza-wildlife-stripe-hide',
      displayName: 'Stripe Hide',
      rarity: 'common',
      description: 'Zebra hide still wearing its stripes. Easy to spot. Hard to lose.',
      spriteGroupId: 'runners',
      spriteCellIndex: 3,
    },
    {
      itemTypeId: 'world-plaza-wildlife-thin-hide',
      displayName: 'Thin Hide',
      rarity: 'common',
      description: 'Light hide from an antilope sprinter. Tears if you pull wrong.',
      spriteGroupId: 'runners',
      spriteCellIndex: 4,
    },
    {
      itemTypeId: 'world-plaza-wildlife-desert-hide',
      displayName: 'Desert Hide',
      rarity: 'common',
      description: 'Dry oryx hide, stiff with sand. Holds a crease forever.',
      spriteGroupId: 'runners',
      spriteCellIndex: 5,
    },
    {
      itemTypeId: 'world-plaza-wildlife-plume',
      displayName: 'Plume',
      rarity: 'common',
      description: 'Tall ostrich plume. Looks fancy until the wind shreds it.',
      spriteGroupId: 'runners',
      spriteCellIndex: 6,
    },
    {
      itemTypeId: 'world-plaza-wildlife-ostrich-egg',
      displayName: 'Ostrich Egg',
      rarity: 'rare',
      description: 'Egg the size of a stone bowl. Crack it careful or wear the yolk.',
      spriteGroupId: 'runners',
      spriteCellIndex: 7,
    },
    {
      itemTypeId: 'world-plaza-wildlife-camel-hair',
      displayName: 'Camel Hair',
      rarity: 'common',
      description: 'Coarse camel hair. Itches first. Keeps you warm anyway.',
      spriteGroupId: 'runners',
      spriteCellIndex: 8,
    },
    {
      itemTypeId: 'world-plaza-wildlife-bladder',
      displayName: 'Bladder',
      rarity: 'rare',
      description: 'Sealed camel bladder. Holds water if you clean and plug it right.',
      spriteGroupId: 'runners',
      spriteCellIndex: 9,
    },
    {
      itemTypeId: 'world-plaza-wildlife-tall-hide',
      displayName: 'Tall Hide',
      rarity: 'common',
      description: 'Hide off a giraffe\'s long side. Too much leather for one bag.',
      spriteGroupId: 'runners',
      spriteCellIndex: 10,
    },
    {
      itemTypeId: 'world-plaza-wildlife-neck-bone',
      displayName: 'Neck Bone',
      rarity: 'rare',
      description: 'Long giraffe neck bone. Makes a haft if you don\'t mind the reach.',
      spriteGroupId: 'runners',
      spriteCellIndex: 11,
    },

    // horses (12) — 4×3
    {
      itemTypeId: 'world-plaza-wildlife-horsehair',
      displayName: 'Horsehair',
      rarity: 'common',
      description: 'Mane and tail from a feral runner. Twists into cord that holds.',
      spriteGroupId: 'horses',
      spriteCellIndex: 0,
    },
    {
      itemTypeId: 'world-plaza-wildlife-fine-hair',
      displayName: 'Fine Hair',
      rarity: 'common',
      description: 'Fine desert hair off the fastest thing on four legs. Soft enough to braid.',
      spriteGroupId: 'horses',
      spriteCellIndex: 1,
    },
    {
      itemTypeId: 'world-plaza-wildlife-coarse-hair',
      displayName: 'Coarse Hair',
      rarity: 'common',
      description: 'Rough hair from a stubborn animal. Scratchy, still useful.',
      spriteGroupId: 'horses',
      spriteCellIndex: 2,
    },
    {
      itemTypeId: 'world-plaza-wildlife-hoof',
      displayName: 'Hoof',
      rarity: 'rare',
      description: 'Hard chunk from horse, zebra, or donkey. Smells like road dust even after you wash it.',
      spriteGroupId: 'horses',
      spriteCellIndex: 3,
    },
    {
      itemTypeId: 'world-plaza-wildlife-llama-wool',
      displayName: 'Llama Wool',
      rarity: 'common',
      description: 'Highland wool with grit still in it. Warm if you can stand the smell.',
      spriteGroupId: 'horses',
      spriteCellIndex: 4,
    },
    {
      itemTypeId: 'world-plaza-wildlife-spit-sac',
      displayName: 'Spit Sac',
      rarity: 'rare',
      description: 'Wet pouch from a llama that hated you first. Don\'t open it indoors.',
      spriteGroupId: 'horses',
      spriteCellIndex: 5,
    },
    {
      itemTypeId: 'world-plaza-wildlife-soft-fleece',
      displayName: 'Soft Fleece',
      rarity: 'rare',
      description: 'Alpaca fleece soft enough to feel wrong in a pack. Yes, it was that soft.',
      spriteGroupId: 'horses',
      spriteCellIndex: 6,
    },
    {
      itemTypeId: 'world-plaza-wildlife-yak-wool',
      displayName: 'Yak Wool',
      rarity: 'common',
      description: 'Dense cold-country wool under a foot of hair. Keeps frost out of whatever you wrap.',
      spriteGroupId: 'horses',
      spriteCellIndex: 7,
    },
    {
      itemTypeId: 'world-plaza-wildlife-monkey-fur',
      displayName: 'Monkey Fur',
      rarity: 'common',
      description: 'Soft jungle monkey fur. Still smells like canopy and theft.',
      spriteGroupId: 'horses',
      spriteCellIndex: 8,
    },
    {
      itemTypeId: 'world-plaza-wildlife-stolen-fruit',
      displayName: 'Stolen Fruit',
      rarity: 'rare',
      description: 'Fruit from a monkey cheek pouch. Warm, dented, still edible.',
      spriteGroupId: 'horses',
      spriteCellIndex: 9,
    },
    {
      itemTypeId: 'world-plaza-wildlife-chimp-fur',
      displayName: 'Chimp Fur',
      rarity: 'common',
      description: 'Dark chimp fur. Dense, oily, hard to scrub off your hands.',
      spriteGroupId: 'horses',
      spriteCellIndex: 10,
    },
    {
      itemTypeId: 'world-plaza-wildlife-knuckle-bone',
      displayName: 'Knuckle Bone',
      rarity: 'rare',
      description: 'Thick knuckle bone. Something walked on these for years.',
      spriteGroupId: 'horses',
      spriteCellIndex: 11,
    },

    // shell (8) — 4×2
    {
      itemTypeId: 'world-plaza-wildlife-shell-scute',
      displayName: 'Shell Scute',
      rarity: 'common',
      description: 'One plate off a turtle, tortoise, or river catch. Stacks into armor or scrapes into beadwork.',
      spriteGroupId: 'shell',
      spriteCellIndex: 0,
    },
    {
      itemTypeId: 'world-plaza-wildlife-full-shell',
      displayName: 'Full Shell',
      rarity: 'rare',
      description: 'Whole carapace, still curved. Bowl, shield plate, or a lid that never warps.',
      spriteGroupId: 'shell',
      spriteCellIndex: 1,
    },
    {
      itemTypeId: 'world-plaza-wildlife-down',
      displayName: 'Down',
      rarity: 'common',
      description: 'Soft fluff from under a coat of fat. Stuff a lining and stop shivering.',
      spriteGroupId: 'shell',
      spriteCellIndex: 2,
    },
    {
      itemTypeId: 'world-plaza-wildlife-blubber',
      displayName: 'Blubber',
      rarity: 'rare',
      description: 'Thick fat from a bird that lived on ice. Greasy, heavy, worth the mess.',
      spriteGroupId: 'shell',
      spriteCellIndex: 3,
    },
    {
      itemTypeId: 'world-plaza-wildlife-river-hide',
      displayName: 'River Hide',
      rarity: 'common',
      description: 'Thick hide from the swamp\'s worst temper. Takes forever to dry.',
      spriteGroupId: 'shell',
      spriteCellIndex: 4,
    },
    {
      itemTypeId: 'world-plaza-wildlife-ivory-tooth',
      displayName: 'Ivory Tooth',
      rarity: 'rare',
      description: 'Big ivory tooth from a river brute. Heavy enough to matter in your palm.',
      spriteGroupId: 'shell',
      spriteCellIndex: 5,
    },
    {
      itemTypeId: 'world-plaza-wildlife-scale',
      displayName: 'Scale',
      rarity: 'common',
      description: 'Tough plate from crocodile, fish, or colder kin. Rattles in the bag like loose coin.',
      spriteGroupId: 'shell',
      spriteCellIndex: 6,
    },
    {
      itemTypeId: 'world-plaza-wildlife-tooth',
      displayName: 'Tooth',
      rarity: 'rare',
      description: 'Sharp tooth from a river ambusher. Still wants to bite something.',
      spriteGroupId: 'shell',
      spriteCellIndex: 7,
    },

    // predators (12) — 4×3
    {
      itemTypeId: 'world-plaza-wildlife-tusk',
      displayName: 'Tusk',
      rarity: 'rare',
      description: 'Curved tusk from a boar that charged first. File the tip and it becomes a tool.',
      spriteGroupId: 'predators',
      spriteCellIndex: 0,
    },
    {
      itemTypeId: 'world-plaza-wildlife-brown-fur',
      displayName: 'Brown Fur',
      rarity: 'common',
      description: 'Warm coat off a brown bear or grizzly. Holds heat after the animal is long gone.',
      spriteGroupId: 'predators',
      spriteCellIndex: 1,
    },
    {
      itemTypeId: 'world-plaza-wildlife-claw',
      displayName: 'Claw',
      rarity: 'rare',
      description: 'Heavy hook from bear or lion. Digs into leather work and into anything that still fights back.',
      spriteGroupId: 'predators',
      spriteCellIndex: 2,
    },
    {
      itemTypeId: 'world-plaza-wildlife-white-fur',
      displayName: 'White Fur',
      rarity: 'common',
      description: 'Thick white fur from a polar bear. Still smells like snow and fish.',
      spriteGroupId: 'predators',
      spriteCellIndex: 3,
    },
    {
      itemTypeId: 'world-plaza-wildlife-fang',
      displayName: 'Fang',
      rarity: 'rare',
      description: 'Long tooth from wolf, tiger, or polar bear. Healer kits keep one for wolf-fever work.',
      spriteGroupId: 'predators',
      spriteCellIndex: 4,
    },
    {
      itemTypeId: 'world-plaza-wildlife-wolf-fur',
      displayName: 'Wolf Fur',
      rarity: 'common',
      description: 'Grey fur from the wolf that was stalking you. Pack scent clings for days.',
      spriteGroupId: 'predators',
      spriteCellIndex: 5,
    },
    {
      itemTypeId: 'world-plaza-wildlife-night-pelt',
      displayName: 'Night Pelt',
      rarity: 'common',
      description: 'Near-black pelt from an omega wolf. Starlight used to slide off it.',
      spriteGroupId: 'predators',
      spriteCellIndex: 6,
    },
    {
      itemTypeId: 'world-plaza-wildlife-omega-fang',
      displayName: 'Omega Fang',
      rarity: 'epic',
      description: 'Heavy fang from a pack leader that hunted by starlight. Something in the enamel feels wrong.',
      spriteGroupId: 'predators',
      spriteCellIndex: 7,
    },
    {
      itemTypeId: 'world-plaza-wildlife-spotted-hide',
      displayName: 'Spotted Hide',
      rarity: 'common',
      description: 'Spotted hide from a night scavenger. Rank, durable, never quite clean.',
      spriteGroupId: 'predators',
      spriteCellIndex: 8,
    },
    {
      itemTypeId: 'world-plaza-wildlife-bone',
      displayName: 'Bone',
      rarity: 'rare',
      description: 'Stout bone a hyena cracked open. Marrow long gone.',
      spriteGroupId: 'predators',
      spriteCellIndex: 9,
    },
    {
      itemTypeId: 'world-plaza-wildlife-mane',
      displayName: 'Mane',
      rarity: 'common',
      description: 'Tuft of lion mane. Proud on a wall, silly on a belt.',
      spriteGroupId: 'predators',
      spriteCellIndex: 10,
    },
    {
      itemTypeId: 'world-plaza-wildlife-lean-hide',
      displayName: 'Lean Hide',
      rarity: 'common',
      description: 'Lean hide from a lioness. Less show than a mane, more work hours in it.',
      spriteGroupId: 'predators',
      spriteCellIndex: 11,
    },

    // giants (12) — 4×3
    {
      itemTypeId: 'world-plaza-wildlife-stripe-fur',
      displayName: 'Stripe Fur',
      rarity: 'common',
      description: 'Fur striped like the tiger that wore it. Grass camouflage you will never match.',
      spriteGroupId: 'giants',
      spriteCellIndex: 0,
    },
    {
      itemTypeId: 'world-plaza-wildlife-spot-fur',
      displayName: 'Spot Fur',
      rarity: 'common',
      description: 'Jaguar-spotted fur. Soft until you remember what it cost.',
      spriteGroupId: 'giants',
      spriteCellIndex: 1,
    },
    {
      itemTypeId: 'world-plaza-wildlife-jawbone',
      displayName: 'Jawbone',
      rarity: 'rare',
      description: 'Crushing jawbone from a jaguar. Hinge still works if you force it.',
      spriteGroupId: 'giants',
      spriteCellIndex: 2,
    },
    {
      itemTypeId: 'world-plaza-wildlife-ember-scale',
      displayName: 'Ember Scale',
      rarity: 'common',
      description: 'Heat-hardened plate from a sunhead, or a rare Cyroborn shed. Still warm to the touch.',
      spriteGroupId: 'giants',
      spriteCellIndex: 3,
    },
    {
      itemTypeId: 'world-plaza-wildlife-crown-plate',
      displayName: 'Crown Plate',
      rarity: 'epic',
      description: 'Heat-warped plate from a sunhead crown. Warm long after the Firelands cool.',
      spriteGroupId: 'giants',
      spriteCellIndex: 4,
    },
    {
      itemTypeId: 'world-plaza-wildlife-thick-hide',
      displayName: 'Thick Hide',
      rarity: 'common',
      description: 'Elephant skin measured in fingers. Takes forever to tan and forever to punch through.',
      spriteGroupId: 'giants',
      spriteCellIndex: 5,
    },
    {
      itemTypeId: 'world-plaza-wildlife-ivory',
      displayName: 'Ivory',
      rarity: 'rare',
      description: 'Pale shard from an elephant tusk. Carves clean, and every Forgewright ruin wants more of it.',
      spriteGroupId: 'giants',
      spriteCellIndex: 6,
    },
    {
      itemTypeId: 'world-plaza-wildlife-plate-hide',
      displayName: 'Plate Hide',
      rarity: 'common',
      description: 'Rhino skin thick as armor board. Fold it wrong and it cracks; fold it right and arrows bounce.',
      spriteGroupId: 'giants',
      spriteCellIndex: 7,
    },
    {
      itemTypeId: 'world-plaza-wildlife-shag-wool',
      displayName: 'Shag Wool',
      rarity: 'common',
      description: 'Shaggy mammoth wool. Holds cold like a bad habit.',
      spriteGroupId: 'giants',
      spriteCellIndex: 8,
    },
    {
      itemTypeId: 'world-plaza-wildlife-ice-tusk',
      displayName: 'Ice Tusk',
      rarity: 'epic',
      description: 'Tip of a mammoth tusk. Frost never quite leaves the grain.',
      spriteGroupId: 'giants',
      spriteCellIndex: 9,
    },
    {
      itemTypeId: 'world-plaza-wildlife-gold-dust',
      displayName: 'Gold Dust',
      rarity: 'common',
      description: 'Fine gold dust shed by a fairy. Cold in the palm, quieter than a Spritcore.',
      spriteGroupId: 'giants',
      spriteCellIndex: 10,
    },
    {
      itemTypeId: 'world-plaza-wildlife-wing-mote',
      displayName: 'Wing Mote',
      rarity: 'epic',
      description: 'Bright mote torn from a fairy wing. Hold it still and it tries to leave.',
      spriteGroupId: 'giants',
      spriteCellIndex: 11,
    },
  ];

const DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_BY_TYPE_ID = Object.fromEntries(
  DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_CATALOG.map((entry) => [
    entry.itemTypeId,
    entry,
  ])
) as Record<string, DefiningWildlifeSpecialtyLootItemDefinition>;

export function resolvingWildlifeSpecialtyLootItemDefinition(
  itemTypeId: string
): DefiningWildlifeSpecialtyLootItemDefinition | null {
  return DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_BY_TYPE_ID[itemTypeId] ?? null;
}

export function checkingWildlifeSpecialtyLootItemTypeId(
  itemTypeId: string
): boolean {
  return itemTypeId in DEFINING_WILDLIFE_SPECIALTY_LOOT_ITEM_BY_TYPE_ID;
}
