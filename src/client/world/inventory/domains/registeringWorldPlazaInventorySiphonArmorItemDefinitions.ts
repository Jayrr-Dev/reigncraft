import { resolvingWorldPlazaSiphonArmorPieceDefinition } from '@/components/world/equipment/domains/definingWorldPlazaSiphonArmorSetRegistry';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_INVENTORY_SIPHON_ARMOR_ITEM_TYPE_IDS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaInventorySiphonArmorSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventorySiphonArmorSpriteSheetConstants';

export function registeringWorldPlazaInventorySiphonArmorItemDefinitions(): DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_INVENTORY_SIPHON_ARMOR_ITEM_TYPE_IDS.map(
    (typeId) => {
      const piece = resolvingWorldPlazaSiphonArmorPieceDefinition(typeId);

      if (!piece) {
        throw new Error(`Missing Siphon armor piece: ${typeId}`);
      }

      const spriteSheetIcon =
        resolvingWorldPlazaInventorySiphonArmorSpriteSheetIcon(typeId);

      if (!spriteSheetIcon) {
        throw new Error(`Missing Siphon armor sprite: ${typeId}`);
      }

      return {
        typeId,
        name: piece.displayName,
        rarity: 'epic' as const,
        iconSpriteSheet: spriteSheetIcon,
        tooltip: piece.tooltip,
        maxStack: 1,
        isDroppable: true,
        isStackable: false,
        tags: ['unique'] as const,
        armor: {
          slotId: piece.slotId,
        },
      };
    }
  );
}
