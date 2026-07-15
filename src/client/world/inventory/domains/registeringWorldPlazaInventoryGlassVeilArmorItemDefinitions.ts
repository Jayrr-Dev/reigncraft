import { resolvingWorldPlazaGlassVeilArmorPieceDefinition } from '@/components/world/equipment/domains/definingWorldPlazaGlassVeilArmorSetRegistry';
import { resolvingWorldPlazaInventoryGlassVeilArmorSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryGlassVeilArmorSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_ITEM_TYPE_IDS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export function registeringWorldPlazaInventoryGlassVeilArmorItemDefinitions(): DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_INVENTORY_GLASS_VEIL_ARMOR_ITEM_TYPE_IDS.map(
    (typeId) => {
      const piece = resolvingWorldPlazaGlassVeilArmorPieceDefinition(typeId);

      if (!piece) {
        throw new Error(`Missing Glass Veil armor piece: ${typeId}`);
      }

      const spriteSheetIcon =
        resolvingWorldPlazaInventoryGlassVeilArmorSpriteSheetIcon(typeId);

      if (!spriteSheetIcon) {
        throw new Error(`Missing Glass Veil armor sprite: ${typeId}`);
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
