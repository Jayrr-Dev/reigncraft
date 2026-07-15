/**
 * Declarative Bessemer Plate set: steady tank opposite of Chaos Armour.
 *
 * @module components/world/equipment/domains/definingWorldPlazaBessemerArmorSetRegistry
 */

import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import type {
  DefiningWorldPlazaArmorSetDamageRollCrumb,
  DefiningWorldPlazaArmorSetThresholdBonus,
} from '@/components/world/equipment/domains/definingWorldPlazaChaosArmorSetRegistry';
import {
  DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_ID_PREFIX,
  formattingWorldPlazaArmorSetCombatModifierId,
} from '@/components/world/equipment/domains/definingWorldPlazaChaosArmorSetRegistry';

export const DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_SET_ID = 'bessemer' as const;

export const DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_FULL_SET_MARKER_ID =
  `${DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_ID_PREFIX}bessemer:full-marker` as const;

/** Physical absorb pool granted while full Bessemer set is worn. */
export const DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_FULL_SET_SHIELD_POINTS = 80;

export type DefiningWorldPlazaBessemerArmorPieceDefinition = {
  readonly itemTypeId: string;
  readonly slotId: DefiningWorldPlazaArmorSlotId;
  readonly displayName: string;
  readonly tooltip: string;
  readonly pieceModifiers: readonly DefiningWorldPlazaArmorSetDamageRollCrumb[];
};

export const DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_PIECE_REGISTRY: readonly DefiningWorldPlazaBessemerArmorPieceDefinition[] =
  [
    {
      itemTypeId: 'world-plaza-bessemer-casque',
      slotId: 'helm',
      displayName: 'Bessemer Casque',
      tooltip:
        'Polished steel helm. Tiny cut to expected damage. Unique Bessemer Plate drop.',
      pieceModifiers: [{ kind: 'expected', value: 0.98 }],
    },
    {
      itemTypeId: 'world-plaza-bessemer-gauntlets',
      slotId: 'arm',
      displayName: 'Bessemer Gauntlets',
      tooltip:
        'Copper-knuckled gauntlets. Steady incoming rolls. Unique Bessemer Plate drop.',
      pieceModifiers: [{ kind: 'stability', value: 0.95 }],
    },
    {
      itemTypeId: 'world-plaza-bessemer-breastplate',
      slotId: 'body',
      displayName: 'Bessemer Breastplate',
      tooltip:
        'Forge-cored cuirass. Cuts expected damage. Unique Bessemer Plate drop.',
      pieceModifiers: [{ kind: 'expected', value: 0.96 }],
    },
    {
      itemTypeId: 'world-plaza-bessemer-greaves',
      slotId: 'leg',
      displayName: 'Bessemer Greaves',
      tooltip:
        'Plate greaves. Steady incoming rolls. Unique Bessemer Plate drop.',
      pieceModifiers: [{ kind: 'stability', value: 0.95 }],
    },
    {
      itemTypeId: 'world-plaza-bessemer-sabatons',
      slotId: 'foot',
      displayName: 'Bessemer Sabatons',
      tooltip:
        'Copper-toed sabatons. Tiny cut to expected damage. Unique Bessemer Plate drop.',
      pieceModifiers: [{ kind: 'expected', value: 0.98 }],
    },
  ] as const;

/** 2 / 3 / 4+ thresholds (4+ = full set; animals can complete without legs). */
export const DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_SET_THRESHOLDS: readonly DefiningWorldPlazaArmorSetThresholdBonus[] =
  [
    {
      minPieces: 2,
      label: 'Bessemer 2-piece',
      modifiers: [{ kind: 'stability', value: 0.85 }],
    },
    {
      minPieces: 3,
      label: 'Bessemer 3-piece',
      modifiers: [{ kind: 'expected', value: 0.85 }],
    },
    {
      minPieces: 4,
      label: 'Bessemer full set',
      modifiers: [{ kind: 'block_bias', value: 1 }],
      grantsFullSetMarker: true,
    },
  ] as const;

const DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_PIECE_BY_TYPE_ID = new Map(
  DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_PIECE_REGISTRY.map((piece) => [
    piece.itemTypeId,
    piece,
  ])
);

export function resolvingWorldPlazaBessemerArmorPieceDefinition(
  itemTypeId: string
): DefiningWorldPlazaBessemerArmorPieceDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_PIECE_BY_TYPE_ID.get(itemTypeId) ?? null
  );
}

export function checkingWorldPlazaInventoryItemIsBessemerArmor(
  itemTypeId: string
): boolean {
  return DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_PIECE_BY_TYPE_ID.has(itemTypeId);
}

export function formattingWorldPlazaBessemerArmorSetCombatModifierId(
  crumbKey: string
): string {
  return formattingWorldPlazaArmorSetCombatModifierId(
    DEFINING_WORLD_PLAZA_BESSEMER_ARMOR_SET_ID,
    crumbKey
  );
}
