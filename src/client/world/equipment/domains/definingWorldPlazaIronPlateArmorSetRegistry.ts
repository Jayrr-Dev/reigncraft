/**
 * Declarative Iron Plate set: basic blacksmith-craftable armour.
 *
 * Weaker than unique Bessemer Plate. Hammered at an anvil from iron ingots.
 *
 * @module components/world/equipment/domains/definingWorldPlazaIronPlateArmorSetRegistry
 */

import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import type {
  DefiningWorldPlazaArmorSetDamageRollCrumb,
  DefiningWorldPlazaArmorSetThresholdBonus,
} from '@/components/world/equipment/domains/definingWorldPlazaChaosArmorSetRegistry';
import { formattingWorldPlazaArmorSetCombatModifierId } from '@/components/world/equipment/domains/definingWorldPlazaChaosArmorSetRegistry';

export const DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_SET_ID =
  'iron-plate' as const;

export type DefiningWorldPlazaIronPlateArmorPieceDefinition = {
  readonly itemTypeId: string;
  readonly slotId: DefiningWorldPlazaArmorSlotId;
  readonly displayName: string;
  readonly tooltip: string;
  readonly pieceModifiers: readonly DefiningWorldPlazaArmorSetDamageRollCrumb[];
};

export const DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_PIECE_REGISTRY: readonly DefiningWorldPlazaIronPlateArmorPieceDefinition[] =
  [
    {
      itemTypeId: 'world-plaza-iron-plate-casque',
      slotId: 'helm',
      displayName: 'Iron Casque',
      tooltip:
        'Plain iron helm. Tiny cut to expected damage. Hammer at an anvil.',
      pieceModifiers: [{ kind: 'expected', value: 0.99 }],
    },
    {
      itemTypeId: 'world-plaza-iron-plate-gauntlets',
      slotId: 'arm',
      displayName: 'Iron Gauntlets',
      tooltip:
        'Iron hand plates. Slightly steadier incoming rolls. Hammer at an anvil.',
      pieceModifiers: [{ kind: 'stability', value: 0.98 }],
    },
    {
      itemTypeId: 'world-plaza-iron-plate-breastplate',
      slotId: 'body',
      displayName: 'Iron Breastplate',
      tooltip:
        'Basic iron cuirass. Soft cut to expected damage. Hammer at an anvil.',
      pieceModifiers: [{ kind: 'expected', value: 0.98 }],
    },
    {
      itemTypeId: 'world-plaza-iron-plate-greaves',
      slotId: 'leg',
      displayName: 'Iron Greaves',
      tooltip:
        'Iron shin plates. Slightly steadier incoming rolls. Hammer at an anvil.',
      pieceModifiers: [{ kind: 'stability', value: 0.98 }],
    },
    {
      itemTypeId: 'world-plaza-iron-plate-sabatons',
      slotId: 'foot',
      displayName: 'Iron Sabatons',
      tooltip:
        'Iron foot plates. Tiny cut to expected damage. Hammer at an anvil.',
      pieceModifiers: [{ kind: 'expected', value: 0.99 }],
    },
  ] as const;

/** 2 / 3 / 4+ thresholds (4+ = full set; animals can complete without legs). */
export const DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_SET_THRESHOLDS: readonly DefiningWorldPlazaArmorSetThresholdBonus[] =
  [
    {
      minPieces: 2,
      label: 'Iron Plate 2-piece',
      modifiers: [{ kind: 'stability', value: 0.95 }],
    },
    {
      minPieces: 3,
      label: 'Iron Plate 3-piece',
      modifiers: [{ kind: 'expected', value: 0.95 }],
    },
    {
      minPieces: 4,
      label: 'Iron Plate full set',
      modifiers: [{ kind: 'expected', value: 0.93 }],
      grantsFullSetMarker: true,
    },
  ] as const;

const DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_PIECE_BY_TYPE_ID = new Map(
  DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_PIECE_REGISTRY.map((piece) => [
    piece.itemTypeId,
    piece,
  ])
);

export function resolvingWorldPlazaIronPlateArmorPieceDefinition(
  itemTypeId: string
): DefiningWorldPlazaIronPlateArmorPieceDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_PIECE_BY_TYPE_ID.get(itemTypeId) ??
    null
  );
}

export function checkingWorldPlazaInventoryItemIsIronPlateArmor(
  itemTypeId: string
): boolean {
  return DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_PIECE_BY_TYPE_ID.has(itemTypeId);
}

export function formattingWorldPlazaIronPlateArmorSetCombatModifierId(
  crumbKey: string
): string {
  return formattingWorldPlazaArmorSetCombatModifierId(
    DEFINING_WORLD_PLAZA_IRON_PLATE_ARMOR_SET_ID,
    crumbKey
  );
}
