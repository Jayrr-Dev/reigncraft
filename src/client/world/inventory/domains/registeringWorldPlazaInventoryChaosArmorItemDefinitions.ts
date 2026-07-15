import { resolvingWorldPlazaChaosArmorPieceDefinition } from '@/components/world/equipment/domains/definingWorldPlazaChaosArmorSetRegistry';
import { resolvingWorldPlazaInventoryChaosArmorSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryChaosArmorSpriteSheetConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { DEFINING_WORLD_PLAZA_INVENTORY_CHAOS_ARMOR_ITEM_TYPE_IDS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';

export function registeringWorldPlazaInventoryChaosArmorItemDefinitions(): DefiningWorldPlazaInventoryItemTypeDefinition[] {
  return DEFINING_WORLD_PLAZA_INVENTORY_CHAOS_ARMOR_ITEM_TYPE_IDS.map(
    (typeId) => {
      const piece = resolvingWorldPlazaChaosArmorPieceDefinition(typeId);

      if (!piece) {
        throw new Error(`Missing chaos armor piece: ${typeId}`);
      }

      const spriteSheetIcon =
        resolvingWorldPlazaInventoryChaosArmorSpriteSheetIcon(typeId);

      if (!spriteSheetIcon) {
        throw new Error(`Missing chaos armor sprite: ${typeId}`);
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
