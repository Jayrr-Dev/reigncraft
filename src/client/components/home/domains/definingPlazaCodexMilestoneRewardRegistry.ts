/**
 * Declarative grants for Codex overall-meter milestone chests.
 * Sighted/Logged and Studied percents come from milestone constants.
 *
 * Theme lanes:
 * - Herbarium: plant / field healing
 * - Lapidary: mining, smithing, kiln vessels, tools
 * - Bestiary: survival gear + animal-medical healing
 * - Pathology: disease / fate healing (+ restorative prep, medical specialty blades)
 * - Biomes: large shelters / field structures
 * - Recipes: cookbook collection slices (already filled)
 *
 * @module components/home/domains/definingPlazaCodexMilestoneRewardRegistry
 */

import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeToolRecipeIds';
import type { WorldPlazaCodexSectionId } from '@/components/world/domains/definingWorldPlazaCodexConstants';
import type { DefiningWorldPlazaInventoryStorageExpansionPageTier } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';

/** Which dual-progress meter the chest sits on. */
export type PlazaCodexMilestoneRewardMeterKind = 'discovered' | 'studied';

/** Attach a craft recipe page to the player's cookbook. */
export type PlazaCodexMilestoneAttachRecipeReward = {
  readonly kind: 'attach-recipe';
  readonly recipeId: DefiningWorldPlazaCraftModeRecipeId;
  /** Short player-facing label for popovers / claim dialog title. */
  readonly label: string;
  /** One-line claim dialog blurb (what the player just got). */
  readonly description: string;
};

/** Unlock one bonus inventory storage page (+6 slots; global cap 3). */
export type PlazaCodexMilestoneUnlockStorageRowReward = {
  readonly kind: 'unlock-storage-row';
  /** Dialog / popover art tier (rare / mythic / legendary ledger page). */
  readonly pageTier: DefiningWorldPlazaInventoryStorageExpansionPageTier;
  readonly label: string;
  readonly description: string;
};

export type PlazaCodexMilestoneRewardGrant =
  | PlazaCodexMilestoneAttachRecipeReward
  | PlazaCodexMilestoneUnlockStorageRowReward;

export type PlazaCodexMilestoneRewardDefinition = {
  readonly sectionId: WorldPlazaCodexSectionId;
  readonly meterKind: PlazaCodexMilestoneRewardMeterKind;
  /**
   * Matches a chest percent for this meter:
   * discovered → overall / discovery / recipes arrays;
   * studied → `DEFINING_PLAZA_CODEX_STUDIED_MILESTONE_REWARD_PERCENTS`.
   */
  readonly percent: number;
  readonly reward: PlazaCodexMilestoneRewardGrant;
};

const PACKING_LEDGER_DESCRIPTION =
  'Added to your bag. Use it to unlock one storage page (+6 slots). At most three ledgers can expand your pack.' as const;

function attachRecipeReward(
  recipeId: DefiningWorldPlazaCraftModeRecipeId,
  label: string,
  description: string
): PlazaCodexMilestoneAttachRecipeReward {
  return {
    kind: 'attach-recipe',
    recipeId,
    label,
    description,
  };
}

/**
 * Progressive Codex chest grants. Early percents = basics; late = advanced.
 * Packing ledgers stay on herb Studied mid, biomes max, bestiary Sighted max.
 */
export const DEFINING_PLAZA_CODEX_MILESTONE_REWARD_REGISTRY = [
  // --- Herbarium Sighted: wood axe + plant field heals ---
  {
    sectionId: 'herbarium',
    meterKind: 'discovered',
    percent: 5,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_WOOD,
      'Wood Axe recipe',
      'Pinned in your cookbook. Carve a spare axe from wood when the starter one fails.'
    ),
  },
  {
    sectionId: 'herbarium',
    meterKind: 'discovered',
    percent: 20,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_CALENDULA_WOUND_SALVE,
      'Calendula Wound Salve recipe',
      'Pinned in your cookbook. Salve shallow cuts with calendula.'
    ),
  },
  {
    sectionId: 'herbarium',
    meterKind: 'discovered',
    percent: 50,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_CHAMOMILE_COMPRESS,
      'Chamomile Compress recipe',
      'Pinned in your cookbook. Lay a warm chamomile compress on sore skin.'
    ),
  },
  {
    sectionId: 'herbarium',
    meterKind: 'discovered',
    percent: 75,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_LAVENDER_ANTISEPTIC_WASH,
      'Lavender Antiseptic Wash recipe',
      'Pinned in your cookbook. Rinse wounds with lavender wash before they sour.'
    ),
  },
  {
    sectionId: 'herbarium',
    meterKind: 'discovered',
    percent: 100,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_FIELD_AGARIC_RESTORATIVE_TABLET,
      'Field Agaric Restorative Tablet recipe',
      'Pinned in your cookbook. Press field agaric into a restorative tablet.'
    ),
  },
  // --- Herbarium Studied: deeper plant heals; mid chest = rare packing ledger ---
  {
    sectionId: 'herbarium',
    meterKind: 'studied',
    percent: 2,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_PEPPERMINT_DIGESTIVE_DROPS,
      'Peppermint Digestive Drops recipe',
      'Pinned in your cookbook. Settle a bad stomach with peppermint drops.'
    ),
  },
  {
    sectionId: 'herbarium',
    meterKind: 'studied',
    percent: 5,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_MEADOWSWEET_FEVER_CLOTH,
      'Meadowsweet Fever Cloth recipe',
      'Pinned in your cookbook. Cool a fever with meadowsweet cloth.'
    ),
  },
  {
    sectionId: 'herbarium',
    meterKind: 'studied',
    percent: 9,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_ROSE_LINIMENT,
      'Rose Liniment recipe',
      'Pinned in your cookbook. Rub rose liniment into strained joints.'
    ),
  },
  {
    sectionId: 'herbarium',
    meterKind: 'studied',
    percent: 14,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_ARNICA_BRUISE_LINIMENT,
      'Arnica Bruise Liniment recipe',
      'Pinned in your cookbook. Ease bruises with arnica liniment.'
    ),
  },
  {
    sectionId: 'herbarium',
    meterKind: 'studied',
    percent: 20,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_ECHINACEA_TINCTURE,
      'Echinacea Tincture recipe',
      'Pinned in your cookbook. Brew echinacea tincture for stubborn infections.'
    ),
  },
  {
    sectionId: 'herbarium',
    meterKind: 'studied',
    percent: 28,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_VALERIAN_NIGHT_DRAUGHT,
      'Valerian Night Draught recipe',
      'Pinned in your cookbook. Drink valerian draught when sleep will not come.'
    ),
  },
  {
    sectionId: 'herbarium',
    meterKind: 'studied',
    percent: 38,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_REST_CURE_PILLOW,
      'Rest-Cure Pillow recipe',
      'Pinned in your cookbook. Stuff a rest-cure pillow for longer recovery sleep.'
    ),
  },
  {
    sectionId: 'herbarium',
    meterKind: 'studied',
    percent: 51,
    reward: {
      kind: 'unlock-storage-row',
      pageTier: 'rare',
      label: 'Rare Packing Ledger',
      description: PACKING_LEDGER_DESCRIPTION,
    },
  },
  {
    sectionId: 'herbarium',
    meterKind: 'studied',
    percent: 69,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_FOXGLOVE_HEART_AMPOULE,
      'Foxglove Heart Ampoule recipe',
      'Pinned in your cookbook. Dose foxglove carefully when the heart falters.'
    ),
  },
  {
    sectionId: 'herbarium',
    meterKind: 'studied',
    percent: 100,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_FATEBREAK_WARD,
      'Fatebreak Ward recipe',
      'Pinned in your cookbook. Ward off a fate-bound wound when lesser salves fail.'
    ),
  },

  // --- Lapidary Sighted: wood pick + kiln/bloomery → iron mining ---
  {
    sectionId: 'lapidary',
    meterKind: 'discovered',
    percent: 5,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.PICKAXE_WOOD,
      'Wood Pickaxe recipe',
      'Pinned in your cookbook. Remake a pick from wood and stone when soft rock stops yielding.'
    ),
  },
  {
    sectionId: 'lapidary',
    meterKind: 'discovered',
    percent: 20,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CLAY_KILN,
      'Clay Kiln recipe',
      'Pinned in your cookbook. Fire wet clay vessels once you have a kiln.'
    ),
  },
  {
    sectionId: 'lapidary',
    meterKind: 'discovered',
    percent: 50,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BLOOMERY,
      'Bloomery recipe',
      'Pinned in your cookbook. Smelt ore into workable ingots in a bloomery.'
    ),
  },
  {
    sectionId: 'lapidary',
    meterKind: 'discovered',
    percent: 75,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_IRON,
      'Iron Axe recipe',
      'Pinned in your cookbook. Chop harder timber when wood tools dull.'
    ),
  },
  {
    sectionId: 'lapidary',
    meterKind: 'discovered',
    percent: 100,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.PICKAXE_IRON,
      'Iron Pickaxe recipe',
      'Pinned in your cookbook. Break harder stone once iron is at the forge.'
    ),
  },
  // --- Lapidary Studied: kiln vessels → anvil → iron/steel tools → plate → gold pick ---
  {
    sectionId: 'lapidary',
    meterKind: 'studied',
    percent: 2,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WET_CLAY_CUP,
      'Wet Clay Cup recipe',
      'Pinned in your cookbook. Shape a wet clay cup for the kiln.'
    ),
  },
  {
    sectionId: 'lapidary',
    meterKind: 'studied',
    percent: 5,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WET_CLAY_BOTTLE,
      'Wet Clay Bottle recipe',
      'Pinned in your cookbook. Form a wet clay bottle for liquids and oils.'
    ),
  },
  {
    sectionId: 'lapidary',
    meterKind: 'studied',
    percent: 9,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WET_CLAY_TEAPOT,
      'Wet Clay Tea Pot recipe',
      'Pinned in your cookbook. Shape a wet clay teapot for stove work.'
    ),
  },
  {
    sectionId: 'lapidary',
    meterKind: 'studied',
    percent: 14,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WET_CLAY_CROCK,
      'Wet Clay Crock recipe',
      'Pinned in your cookbook. Throw a wet clay crock for stores and smoke-oil.'
    ),
  },
  {
    sectionId: 'lapidary',
    meterKind: 'studied',
    percent: 20,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.ANVIL,
      'Anvil recipe',
      'Pinned in your cookbook. Plant an anvil so iron and steel tools can be forged.'
    ),
  },
  {
    sectionId: 'lapidary',
    meterKind: 'studied',
    percent: 28,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.PICKAXE_STEEL,
      'Steel Pickaxe recipe',
      'Pinned in your cookbook. Drive steel into ore veins wood and iron cannot.'
    ),
  },
  {
    sectionId: 'lapidary',
    meterKind: 'studied',
    percent: 38,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SWORD_STEEL,
      'Steel Sword recipe',
      'Pinned in your cookbook. Forge a steel blade when iron edges fail.'
    ),
  },
  {
    sectionId: 'lapidary',
    meterKind: 'studied',
    percent: 51,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.AXE_STEEL,
      'Steel Axe recipe',
      'Pinned in your cookbook. Fell dense timber with a steel axe.'
    ),
  },
  {
    sectionId: 'lapidary',
    meterKind: 'studied',
    percent: 69,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.LEATHER_PLATE_BREASTPLATE,
      'Leather Plate Breastplate recipe',
      'Pinned in your cookbook. Stitch a leather breastplate for early plate work.'
    ),
  },
  {
    sectionId: 'lapidary',
    meterKind: 'studied',
    percent: 100,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.PICKAXE_GOLD,
      'Gold Pickaxe recipe',
      'Pinned in your cookbook. Cut the rarest stone with a gold pick.'
    ),
  },

  // --- Bestiary Sighted: fishrod + trail mats; max = legendary packing ledger ---
  {
    sectionId: 'bestiary',
    meterKind: 'discovered',
    percent: 5,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.FISHROD_WOOD,
      'Wood Fishing Rod recipe',
      'Pinned in your cookbook. Rebuild a wood rod when the tip snaps.'
    ),
  },
  {
    sectionId: 'bestiary',
    meterKind: 'discovered',
    percent: 20,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_SPLIT_PLANKS,
      'Split Planks recipe',
      'Pinned in your cookbook. Split planks for trail builds and repairs.'
    ),
  },
  {
    sectionId: 'bestiary',
    meterKind: 'discovered',
    percent: 50,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_ROPE_COIL,
      'Rope Coil recipe',
      'Pinned in your cookbook. Twist rope for traps, tents, and lashings.'
    ),
  },
  {
    sectionId: 'bestiary',
    meterKind: 'discovered',
    percent: 75,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_CLAIM_BEDROLL,
      'Claim Bedroll recipe',
      'Pinned in your cookbook. Roll a claim bedroll for safe rest in the wild.'
    ),
  },
  {
    sectionId: 'bestiary',
    meterKind: 'discovered',
    percent: 100,
    reward: {
      kind: 'unlock-storage-row',
      pageTier: 'legendary',
      label: 'Legendary Packing Ledger',
      description: PACKING_LEDGER_DESCRIPTION,
    },
  },
  // --- Bestiary Studied: trail wear → animal-medical → scout tent ---
  {
    sectionId: 'bestiary',
    meterKind: 'studied',
    percent: 2,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_BARK_BRACERS,
      'Bark Bracers recipe',
      'Pinned in your cookbook. Bind bark bracers for scrapes on the trail.'
    ),
  },
  {
    sectionId: 'bestiary',
    meterKind: 'studied',
    percent: 5,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_STRAW_SUN_HAT,
      'Straw Sun Hat recipe',
      'Pinned in your cookbook. Weave a straw hat against hard sun.'
    ),
  },
  {
    sectionId: 'bestiary',
    meterKind: 'studied',
    percent: 9,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_HIDE_TRAIL_VEST,
      'Hide Trail Vest recipe',
      'Pinned in your cookbook. Sew a hide vest for brush and cold wind.'
    ),
  },
  {
    sectionId: 'bestiary',
    meterKind: 'studied',
    percent: 14,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_KENNEL_PAW_SALVE,
      'Kennel Paw Salve recipe',
      'Pinned in your cookbook. Salve cracked paws after long marches.'
    ),
  },
  {
    sectionId: 'bestiary',
    meterKind: 'studied',
    percent: 20,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_CAT_SCRATCH_STYPTIC,
      'Cat-Scratch Styptic recipe',
      'Pinned in your cookbook. Stop bleeding from claw scratches fast.'
    ),
  },
  {
    sectionId: 'bestiary',
    meterKind: 'studied',
    percent: 28,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_SHEEPSKIN_WOUND_PACK,
      'Sheepskin Wound Pack recipe',
      'Pinned in your cookbook. Pack a sheepskin dressing for deep field wounds.'
    ),
  },
  {
    sectionId: 'bestiary',
    meterKind: 'studied',
    percent: 38,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_WOLF_BITE_ANTISERUM,
      'Wolf-Bite Antiserum recipe',
      'Pinned in your cookbook. Counter wolf-bite poison before it spreads.'
    ),
  },
  {
    sectionId: 'bestiary',
    meterKind: 'studied',
    percent: 51,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_BOAR_LARD_DRAWING_POULTICE,
      'Boar-Lard Drawing Poultice recipe',
      'Pinned in your cookbook. Draw infection with a boar-lard poultice.'
    ),
  },
  {
    sectionId: 'bestiary',
    meterKind: 'studied',
    percent: 69,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_BONE_SET_SPLINT_WRAP,
      'Bone-Set Splint Wrap recipe',
      'Pinned in your cookbook. Splint a break until you can reach safer ground.'
    ),
  },
  {
    sectionId: 'bestiary',
    meterKind: 'studied',
    percent: 100,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_SCOUT_TENT,
      'Scout Tent recipe',
      'Pinned in your cookbook. Raise a scout tent for longer stays in the wild.'
    ),
  },

  // --- Pathology Sighted: disease / plague line ---
  {
    sectionId: 'pathology',
    meterKind: 'discovered',
    percent: 5,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_LITTERBOX_GUT_DROPS,
      'Litterbox Gut Drops recipe',
      'Pinned in your cookbook. Settle gut sickness early.'
    ),
  },
  {
    sectionId: 'pathology',
    meterKind: 'discovered',
    percent: 20,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_PACKHOUND_PLAGUE_COLLAR,
      'Packhound Plague Collar recipe',
      'Pinned in your cookbook. Ward pack-borne plague before it nests.'
    ),
  },
  {
    sectionId: 'pathology',
    meterKind: 'discovered',
    percent: 50,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_CYROBORN_FROSTBITE_PACK,
      'Cyroborn Frostbite Pack recipe',
      'Pinned in your cookbook. Treat deep frostbite from cyroborn cold.'
    ),
  },
  {
    sectionId: 'pathology',
    meterKind: 'discovered',
    percent: 75,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_GRADED_PLAGUE_PURGE,
      'Graded Plague Purge recipe',
      'Pinned in your cookbook. Purge graded plague stages in order.'
    ),
  },
  {
    sectionId: 'pathology',
    meterKind: 'discovered',
    percent: 100,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_DOOM_POSTPONE_POULTICE,
      'Doom Postpone Poultice recipe',
      'Pinned in your cookbook. Buy time against a doom-marked sickness.'
    ),
  },
  // --- Pathology Studied: fate heals → restorative prep → medical specialty blades → climate wards ---
  {
    sectionId: 'pathology',
    meterKind: 'studied',
    percent: 2,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_DEEP_REST_SERUM,
      'Deep Rest Serum recipe',
      'Pinned in your cookbook. Force deep rest when the body will not recover awake.'
    ),
  },
  {
    sectionId: 'pathology',
    meterKind: 'studied',
    percent: 5,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_FATE_UNRAVEL_SALTS,
      'Fate Unravel Salts recipe',
      'Pinned in your cookbook. Unravel a fate-bound affliction with salts.'
    ),
  },
  {
    sectionId: 'pathology',
    meterKind: 'studied',
    percent: 9,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_BELLADONNA_LAST_RITES,
      'Belladonna Last Rites recipe',
      'Pinned in your cookbook. Last-rite belladonna when milder cures are spent.'
    ),
  },
  {
    sectionId: 'pathology',
    meterKind: 'studied',
    percent: 14,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BOWL_OF_PORRIDGE,
      'Bowl of Berry Porridge recipe',
      'Pinned in your cookbook. Cook restorative porridge after hard recovery.'
    ),
  },
  {
    sectionId: 'pathology',
    meterKind: 'studied',
    percent: 20,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SMOKE_OIL_CROCK,
      'Smoke-Oil Crock recipe',
      'Pinned in your cookbook. Render smoke-oil for dressings and field kits.'
    ),
  },
  {
    sectionId: 'pathology',
    meterKind: 'studied',
    percent: 28,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_GLASS_NEEDLE,
      'Glass Needle Stiletto recipe',
      'Pinned in your cookbook. Craft the Glass Needle, a thin specialty blade.'
    ),
  },
  {
    sectionId: 'pathology',
    meterKind: 'studied',
    percent: 38,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_SIPHON_FANG,
      'Siphon Fang Dagger recipe',
      'Pinned in your cookbook. Craft the Siphon Fang, a specialty dagger that drinks.'
    ),
  },
  {
    sectionId: 'pathology',
    meterKind: 'studied',
    percent: 51,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_QUIET_HAND,
      'Quiet Hand Blade recipe',
      'Pinned in your cookbook. Craft the Quiet Hand Blade, a specialty edged tool.'
    ),
  },
  {
    sectionId: 'pathology',
    meterKind: 'studied',
    percent: 69,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_SWAMP_MESH_VEIL,
      'Swamp Mesh Veil recipe',
      'Pinned in your cookbook. Wear a mesh veil against swamp-borne sickness.'
    ),
  },
  {
    sectionId: 'pathology',
    meterKind: 'studied',
    percent: 100,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_FROST_GLARE_LENSES,
      'Frost Glare Lenses recipe',
      'Pinned in your cookbook. Shield eyes from frost glare before snow blindness sets in.'
    ),
  },

  // --- Biomes Discovered: large shelters; max = mythic packing ledger ---
  {
    sectionId: 'biomes',
    meterKind: 'discovered',
    percent: 25,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_SHADE_LEAN_TO,
      'Shade Lean-To recipe',
      'Pinned in your cookbook. Raise a shade lean-to against hard sun.'
    ),
  },
  {
    sectionId: 'biomes',
    meterKind: 'discovered',
    percent: 50,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_BRUSH_WINDBREAK,
      'Brush Windbreak recipe',
      'Pinned in your cookbook. Build a brush windbreak for exposed camps.'
    ),
  },
  {
    sectionId: 'biomes',
    meterKind: 'discovered',
    percent: 75,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.SURVIVAL_SMOKE_RACK,
      'Smoke Rack recipe',
      'Pinned in your cookbook. Raise a smoke rack for curing meat in the field.'
    ),
  },
  {
    sectionId: 'biomes',
    meterKind: 'discovered',
    percent: 100,
    reward: {
      kind: 'unlock-storage-row',
      pageTier: 'mythic',
      label: 'Mythic Packing Ledger',
      description: PACKING_LEDGER_DESCRIPTION,
    },
  },

  // --- Recipes Attached (8 slices): wood → ceramics → stove → healer → iron blade →
  // tube → soft clay cleaver → fated ledger blade.
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 13,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SWORD_WOOD,
      'Wood Sword recipe',
      'Pinned in your cookbook. Carve a spare blade from wood when your starter sword fails.'
    ),
  },
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 25,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WET_CLAY_BOWL,
      'Wet Clay Bowl recipe',
      'Pinned in your cookbook. Shape a wet clay bowl for kilns and kitchen work.'
    ),
  },
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 38,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CLAY_STOVE,
      'Clay Stove recipe',
      'Pinned in your cookbook. Build a clay stove for cooking and tea once you have the materials.'
    ),
  },
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 50,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.HEALER_YARROW_PRESSURE_DRESSING,
      'Yarrow Pressure Dressing recipe',
      'Pinned in your cookbook. Bind a yarrow dressing for field wounds.'
    ),
  },
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 63,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_TOOL_RECIPE_ID.SWORD_IRON,
      'Iron Sword recipe',
      'Pinned in your cookbook. Forge an iron blade when wood stops cutting.'
    ),
  },
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 75,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.IRON_TUBE,
      'Iron Tube recipe',
      'Pinned in your cookbook. Forge iron tubes for bessemer forges and other advanced builds.'
    ),
  },
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 88,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_SOFT_CLAY_CLEAVER,
      'Soft Clay Cleaver recipe',
      'Pinned in your cookbook. Craft the Soft Clay Cleaver, a specialty blade from ceramics work.'
    ),
  },
  {
    sectionId: 'recipes',
    meterKind: 'discovered',
    percent: 100,
    reward: attachRecipeReward(
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.WEAPON_FATED_LEDGER,
      'Fated Ledger Blade recipe',
      'Pinned in your cookbook. Craft the Fated Ledger Blade, a specialty weapon bound to written fate.'
    ),
  },
] as const satisfies readonly PlazaCodexMilestoneRewardDefinition[];

export type PlazaCodexMilestoneRewardLookupKey = {
  readonly sectionId: WorldPlazaCodexSectionId;
  readonly meterKind: PlazaCodexMilestoneRewardMeterKind;
  readonly percent: number;
};

/**
 * Resolves the declarative reward for one chest, or null when unset.
 */
export function resolvingPlazaCodexMilestoneRewardDefinition(
  key: PlazaCodexMilestoneRewardLookupKey
): PlazaCodexMilestoneRewardDefinition | null {
  return (
    DEFINING_PLAZA_CODEX_MILESTONE_REWARD_REGISTRY.find(
      (entry) =>
        entry.sectionId === key.sectionId &&
        entry.meterKind === key.meterKind &&
        entry.percent === key.percent
    ) ?? null
  );
}

/**
 * All defined rewards for one section (either dual meter).
 */
export function resolvingPlazaCodexMilestoneRewardsForSection(
  sectionId: WorldPlazaCodexSectionId
): readonly PlazaCodexMilestoneRewardDefinition[] {
  return DEFINING_PLAZA_CODEX_MILESTONE_REWARD_REGISTRY.filter(
    (entry) => entry.sectionId === sectionId
  );
}
