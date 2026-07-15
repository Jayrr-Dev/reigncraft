import { resolvingWorldPlazaIronPlateArmorPieceDefinition } from '@/components/world/equipment/domains/definingWorldPlazaIronPlateArmorSetRegistry';
import { resolvingWorldPlazaInventoryIronPlateArmorSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryIronPlateArmorSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_INVENTORY_IRON_PLATE_ARMOR_ITEM_TYPE_IDS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export function registeringWorldPlazaInventoryIronPlateArmorItemDefinitions(): DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_INVENTORY_IRON_PLATE_ARMOR_ITEM_TYPE_IDS.map(
    (typeId) => {
      const piece = resolvingWorldPlazaIronPlateArmorPieceDefinition(typeId);

      if (!piece) {
        throw new Error(`Missing Iron Plate armor piece: ${typeId}`);
      }

      const spriteSheetIcon =
        resolvingWorldPlazaInventoryIronPlateArmorSpriteSheetIcon(typeId);

      if (!spriteSheetIcon) {
        throw new Error(`Missing Iron Plate armor sprite: ${typeId}`);
      }

      return {
        typeId,
        name: piece.displayName,
        rarity: 'common' as const,
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
