import { resolvingWorldPlazaSurvivalWearCatalogEntry } from '@/components/world/equipment/domains/definingWorldPlazaSurvivalWearBuffRegistry';
import { resolvingWorldPlazaInventorySurvivalSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventorySurvivalSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_ITEM_TYPE_IDS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

type DefiningWorldPlazaSurvivalItemSeed = {
  readonly name: string;
  readonly tooltip: string;
  readonly rarity: DefiningWorldPlazaInventoryItemTypeDefinition['rarity'];
  readonly maxStack: number;
};

const DEFINING_WORLD_PLAZA_SURVIVAL_ITEM_SEED_BY_TYPE_ID: Readonly<
  Record<string, DefiningWorldPlazaSurvivalItemSeed>
> = {
  'world-plaza-survival-straw-sun-hat': {
    name: 'Straw Sun Hat',
    tooltip: 'Wide brim for noon marches. Raises heat comfort while worn.',
    rarity: 'basic',
    maxStack: 1,
  },
  'world-plaza-survival-wool-neck-wrap': {
    name: 'Wool Neck Wrap',
    tooltip: 'Soft wool at the throat. Lowers cold comfort floor while worn.',
    rarity: 'basic',
    maxStack: 1,
  },
  'world-plaza-survival-frost-glare-lenses': {
    name: 'Frost Glare Lenses',
    tooltip: 'Slit eyes for snow glare. Mild cold resist while worn.',
    rarity: 'common',
    maxStack: 1,
  },
  'world-plaza-survival-swamp-mesh-veil': {
    name: 'Swamp Mesh Veil',
    tooltip: 'Fine mesh over the face. Eases heat at dusk in wet ground.',
    rarity: 'common',
    maxStack: 1,
  },
  'world-plaza-survival-hide-trail-vest': {
    name: 'Hide Trail Vest',
    tooltip: 'Cured hide over the chest. Cold comfort while worn.',
    rarity: 'common',
    maxStack: 1,
  },
  'world-plaza-survival-fur-shoulder-cape': {
    name: 'Fur Shoulder Cape',
    tooltip: 'Heavy fur across the shoulders. Strong cold buffer while worn.',
    rarity: 'common',
    maxStack: 1,
  },
  'world-plaza-survival-palm-leaf-poncho': {
    name: 'Palm Leaf Poncho',
    tooltip: 'Loose palm fronds. Shade on the move in hot biomes.',
    rarity: 'common',
    maxStack: 1,
  },
  'world-plaza-survival-bark-bracers': {
    name: 'Bark Bracers',
    tooltip: 'Bark strips on the forearms. Mild cold ease while worn.',
    rarity: 'basic',
    maxStack: 1,
  },
  'world-plaza-survival-fingerless-work-mitts': {
    name: 'Fingerless Work Mitts',
    tooltip: 'Fingerless mitts for camp chores. Mild cold ease while worn.',
    rarity: 'basic',
    maxStack: 1,
  },
  'world-plaza-survival-cloth-leg-wraps': {
    name: 'Cloth Leg Wraps',
    tooltip: 'Cloth bound around the calves. Cold comfort while worn.',
    rarity: 'basic',
    maxStack: 1,
  },
  'world-plaza-survival-hide-trail-boots': {
    name: 'Hide Trail Boots',
    tooltip: 'Soft hide boots for long walks. Cold comfort while worn.',
    rarity: 'common',
    maxStack: 1,
  },
  'world-plaza-survival-split-planks': {
    name: 'Split Planks',
    tooltip: 'Wood split for frames, floors, and shelter walls.',
    rarity: 'basic',
    maxStack: 99,
  },
  'world-plaza-survival-wattle-panel': {
    name: 'Wattle Panel',
    tooltip: 'Sticks woven with cord. Soft wall panel for windbreaks.',
    rarity: 'basic',
    maxStack: 99,
  },
  'world-plaza-survival-adobe-brick': {
    name: 'Adobe Brick',
    tooltip: 'Clay and straw pressed dry. Hard wall fill for field builds.',
    rarity: 'common',
    maxStack: 99,
  },
  'world-plaza-survival-rope-coil': {
    name: 'Rope Coil',
    tooltip: 'Bark cordage wound tight. Binds frames, racks, and tents.',
    rarity: 'basic',
    maxStack: 99,
  },
  'world-plaza-survival-peg-stake-pack': {
    name: 'Peg and Stake Pack',
    tooltip: 'Wood pegs for pinning lean-tos, tents, and windbreaks.',
    rarity: 'basic',
    maxStack: 99,
  },
  'world-plaza-survival-reed-mat': {
    name: 'Reed Mat',
    tooltip: 'Woven reed pad. Floor under a tent or bedroll.',
    rarity: 'basic',
    maxStack: 99,
  },
  'world-plaza-survival-clay-daub-mix': {
    name: 'Clay Daub Mix',
    tooltip: 'Wet clay, straw, and grit. Smear onto wattle for a hard face.',
    rarity: 'common',
    maxStack: 99,
  },
  'world-plaza-survival-lashing-twine-spool': {
    name: 'Lashing Twine Spool',
    tooltip: 'Thin cord on a spool. Bind panels, racks, and scaffolds.',
    rarity: 'basic',
    maxStack: 99,
  },
};

export function registeringWorldPlazaInventorySurvivalItemDefinitions(): DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_INVENTORY_SURVIVAL_ITEM_TYPE_IDS.map(
    (typeId) => {
      const seed = DEFINING_WORLD_PLAZA_SURVIVAL_ITEM_SEED_BY_TYPE_ID[typeId];

      if (!seed) {
        throw new Error(`Missing survival item seed: ${typeId}`);
      }

      const spriteSheetIcon =
        resolvingWorldPlazaInventorySurvivalSpriteSheetIcon(typeId);

      if (!spriteSheetIcon) {
        throw new Error(`Missing survival sprite: ${typeId}`);
      }

      const wearEntry = resolvingWorldPlazaSurvivalWearCatalogEntry(typeId);

      return {
        typeId,
        name: seed.name,
        rarity: seed.rarity,
        iconSpriteSheet: spriteSheetIcon,
        tooltip: seed.tooltip,
        maxStack: seed.maxStack,
        isDroppable: true,
        isStackable: seed.maxStack > 1,
        ...(wearEntry
          ? {
              armor: {
                slotId: wearEntry.slotId,
              },
            }
          : {}),
      };
    }
  );
}
