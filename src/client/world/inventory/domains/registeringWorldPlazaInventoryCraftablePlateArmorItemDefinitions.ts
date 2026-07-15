import {
  DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_ITEM_TYPE_IDS,
  resolvingWorldPlazaCraftablePlateArmorPieceDefinition,
} from '@/components/world/equipment/domains/definingWorldPlazaCraftablePlateArmorSetRegistry';
import { resolvingWorldPlazaInventoryCraftablePlateArmorSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCraftablePlateArmorSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';

export function registeringWorldPlazaInventoryCraftablePlateArmorItemDefinitions(): DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_CRAFTABLE_PLATE_ARMOR_ITEM_TYPE_IDS.map(
    (typeId) => {
      const piece =
        resolvingWorldPlazaCraftablePlateArmorPieceDefinition(typeId);

      if (!piece) {
        throw new Error(`Missing craftable plate armor piece: ${typeId}`);
      }

      const spriteSheetIcon =
        resolvingWorldPlazaInventoryCraftablePlateArmorSpriteSheetIcon(typeId);

      if (!spriteSheetIcon) {
        throw new Error(`Missing craftable plate armor sprite: ${typeId}`);
      }

      return {
        typeId,
        name: piece.displayName,
        rarity: piece.rarity,
        iconSpriteSheet: spriteSheetIcon,
        tooltip: piece.tooltip,
        maxStack: 1,
        isDroppable: true,
        isStackable: false,
        armor: {
          slotId: piece.slotId,
        },
      };
    }
  );
}
