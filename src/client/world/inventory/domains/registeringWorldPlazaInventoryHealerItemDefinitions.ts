import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_INVENTORY_HEALER_ITEM_TYPE_IDS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaInventoryHealerSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryHealerSpriteSheetConstants';
import { resolvingWorldPlazaInventoryFoodHealDeclaration } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealDeclaration';

type DefiningWorldPlazaHealerItemDefinition = {
  readonly name: string;
  readonly tooltip: string;
  readonly rarity: DefiningWorldPlazaInventoryItemTypeDefinition['rarity'];
  readonly hungerRestoreRatio: number;
  readonly maxStack: number;
};

const DEFINING_WORLD_PLAZA_HEALER_ITEM_DEFINITION_BY_TYPE_ID: Readonly<
  Record<string, DefiningWorldPlazaHealerItemDefinition>
> = {
  'world-plaza-healer-yarrow-pressure-dressing': { name: 'Yarrow Pressure Dressing', tooltip: 'Stops a wound before it opens further.', rarity: 'basic', hungerRestoreRatio: 0.02, maxStack: 16 },
  'world-plaza-healer-calendula-wound-salve': { name: 'Calendula Wound Salve', tooltip: 'Warm salve for torn skin and slow recovery.', rarity: 'basic', hungerRestoreRatio: 0.03, maxStack: 16 },
  'world-plaza-healer-chamomile-compress': { name: 'Chamomile Compress', tooltip: 'A calming cloth for a rattled mind.', rarity: 'basic', hungerRestoreRatio: 0.02, maxStack: 16 },
  'world-plaza-healer-lavender-antiseptic-wash': { name: 'Lavender Antiseptic Wash', tooltip: 'Sharp-smelling wash that clears lingering sickness.', rarity: 'common', hungerRestoreRatio: 0.02, maxStack: 16 },
  'world-plaza-healer-peppermint-digestive-drops': { name: 'Peppermint Digestive Drops', tooltip: 'Cold, clean drops for harsh weather.', rarity: 'common', hungerRestoreRatio: 0.03, maxStack: 16 },
  'world-plaza-healer-meadowsweet-fever-cloth': { name: 'Meadowsweet Fever Cloth', tooltip: 'A cool cloth for heat and fever.', rarity: 'common', hungerRestoreRatio: 0.02, maxStack: 16 },
  'world-plaza-healer-rose-liniment': { name: 'Rose Liniment', tooltip: 'Fragrant oil that takes the edge off cold.', rarity: 'common', hungerRestoreRatio: 0.03, maxStack: 16 },
  'world-plaza-healer-field-agaric-restorative-tablet': { name: 'Field Agaric Restorative Tablet', tooltip: 'A bitter tablet that brings back fighting spirit.', rarity: 'common', hungerRestoreRatio: 0.04, maxStack: 16 },
  'world-plaza-healer-kennel-paw-salve': { name: 'Kennel Paw Salve', tooltip: 'Thick salve for a companion’s battered paws.', rarity: 'common', hungerRestoreRatio: 0.03, maxStack: 8 },
  'world-plaza-healer-litterbox-gut-drops': { name: 'Litterbox Gut Drops', tooltip: 'Pungent drops for a companion’s upset stomach.', rarity: 'common', hungerRestoreRatio: 0.03, maxStack: 8 },
  'world-plaza-healer-arnica-bruise-liniment': { name: 'Arnica Bruise Liniment', tooltip: 'Stiffens bruised limbs against another blow.', rarity: 'uncommon', hungerRestoreRatio: 0.03, maxStack: 16 },
  'world-plaza-healer-echinacea-tincture': { name: 'Echinacea Tincture', tooltip: 'A sharp tonic that cuts an illness short.', rarity: 'uncommon', hungerRestoreRatio: 0.03, maxStack: 16 },
  'world-plaza-healer-valerian-night-draught': { name: 'Valerian Night Draught', tooltip: 'Heavy draught for a deep, healing sleep.', rarity: 'uncommon', hungerRestoreRatio: 0.04, maxStack: 16 },
  'world-plaza-healer-rest-cure-pillow': { name: 'Rest-Cure Pillow', tooltip: 'A herb-stuffed pillow for sleeping off mild illness.', rarity: 'uncommon', hungerRestoreRatio: 0.03, maxStack: 8 },
  'world-plaza-healer-sheepskin-wound-pack': { name: 'Sheepskin Wound Pack', tooltip: 'A padded wrap that binds wounds and braces bone.', rarity: 'uncommon', hungerRestoreRatio: 0.04, maxStack: 8 },
  'world-plaza-healer-wolf-bite-antiserum': { name: 'Wolf-Bite Antiserum', tooltip: 'A concentrated answer to a wolf’s fever.', rarity: 'uncommon', hungerRestoreRatio: 0.04, maxStack: 8 },
  'world-plaza-healer-boar-lard-drawing-poultice': { name: 'Boar-Lard Drawing Poultice', tooltip: 'Draws fever and rot out through the skin.', rarity: 'uncommon', hungerRestoreRatio: 0.04, maxStack: 8 },
  'world-plaza-healer-packhound-plague-collar': { name: 'Packhound Plague Collar', tooltip: 'A companion collar steeped against infection.', rarity: 'uncommon', hungerRestoreRatio: 0.03, maxStack: 8 },
  'world-plaza-healer-cat-scratch-styptic': { name: 'Cat-Scratch Styptic', tooltip: 'Fast powder for small, stubborn bleeding wounds.', rarity: 'uncommon', hungerRestoreRatio: 0.02, maxStack: 16 },
  'world-plaza-healer-bone-set-splint-wrap': { name: 'Bone-Set Splint Wrap', tooltip: 'A firm antler splint that keeps a limb steady.', rarity: 'uncommon', hungerRestoreRatio: 0.03, maxStack: 8 },
  'world-plaza-healer-deep-rest-serum': { name: 'Deep Rest Serum', tooltip: 'An intense serum for rapid rest and recovery.', rarity: 'rare', hungerRestoreRatio: 0.05, maxStack: 8 },
  'world-plaza-healer-foxglove-heart-ampoule': { name: 'Foxglove Heart Ampoule', tooltip: 'A risky heart tonic with a better chance to help.', rarity: 'rare', hungerRestoreRatio: 0.04, maxStack: 8 },
  'world-plaza-healer-cyroborn-frostbite-pack': { name: 'Cyroborn Frostbite Pack', tooltip: 'A cold pack that steadies frost-numb limbs.', rarity: 'rare', hungerRestoreRatio: 0.04, maxStack: 8 },
  'world-plaza-healer-graded-plague-purge': { name: 'Graded Plague Purge', tooltip: 'A measured purge for all but the worst infections.', rarity: 'epic', hungerRestoreRatio: 0.04, maxStack: 8 },
  'world-plaza-healer-belladonna-last-rites': { name: 'Belladonna Last Rites', tooltip: 'A final wager against even terminal illness.', rarity: 'epic', hungerRestoreRatio: 0.05, maxStack: 8 },
};

export function registeringWorldPlazaInventoryHealerItemDefinitions(): readonly DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_INVENTORY_HEALER_ITEM_TYPE_IDS.map((typeId) => {
    const definition = DEFINING_WORLD_PLAZA_HEALER_ITEM_DEFINITION_BY_TYPE_ID[typeId];

    if (!definition) {
      throw new Error(`Missing healer item definition: ${typeId}`);
    }

    return {
      typeId,
      name: definition.name,
      rarity: definition.rarity,
      tooltip: definition.tooltip,
      maxStack: definition.maxStack,
      isDroppable: true,
      isStackable: true,
      iconSpriteSheet:
        resolvingWorldPlazaInventoryHealerSpriteSheetIcon(typeId) ?? undefined,
      food: {
        hungerRestoreRatio: definition.hungerRestoreRatio,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: definition.hungerRestoreRatio,
        }),
      },
    };
  });
}
