/**
 * Declarative Siphon set: absorb on hit taken + full-set outgoing lifesteal.
 *
 * @module components/world/equipment/domains/definingWorldPlazaSiphonArmorSetRegistry
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

export const DEFINING_WORLD_PLAZA_SIPHON_ARMOR_SET_ID = 'siphon' as const;

export const DEFINING_WORLD_PLAZA_SIPHON_ARMOR_FULL_SET_MARKER_ID =
  `${DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_ID_PREFIX}siphon:full-marker` as const;

/** Ratio crumb for absorb (incoming) or lifesteal (outgoing). */
export type DefiningWorldPlazaArmorSetHealRatioCrumb = {
  readonly kind: 'absorb' | 'lifesteal';
  readonly ratio: number;
};

export type DefiningWorldPlazaSiphonArmorPieceDefinition = {
  readonly itemTypeId: string;
  readonly slotId: DefiningWorldPlazaArmorSlotId;
  readonly displayName: string;
  readonly tooltip: string;
  readonly pieceModifiers: readonly DefiningWorldPlazaArmorSetDamageRollCrumb[];
  readonly pieceHealModifiers: readonly DefiningWorldPlazaArmorSetHealRatioCrumb[];
};

export type DefiningWorldPlazaSiphonArmorSetThresholdBonus =
  DefiningWorldPlazaArmorSetThresholdBonus & {
    readonly healModifiers?: readonly DefiningWorldPlazaArmorSetHealRatioCrumb[];
  };

export const DEFINING_WORLD_PLAZA_SIPHON_ARMOR_PIECE_REGISTRY: readonly DefiningWorldPlazaSiphonArmorPieceDefinition[] =
  [
    {
      itemTypeId: 'world-plaza-siphon-cowl',
      slotId: 'helm',
      displayName: 'Siphon Cowl',
      tooltip: 'Leech-hood. Tiny absorb when hit. Unique Siphon drop.',
      pieceModifiers: [{ kind: 'expected', value: 0.99 }],
      pieceHealModifiers: [{ kind: 'absorb', ratio: 0.01 }],
    },
    {
      itemTypeId: 'world-plaza-siphon-claws',
      slotId: 'arm',
      displayName: 'Siphon Claws',
      tooltip:
        'Blood-claw gauntlets. Tiny absorb when hit. Unique Siphon drop.',
      pieceModifiers: [{ kind: 'expected', value: 0.99 }],
      pieceHealModifiers: [{ kind: 'absorb', ratio: 0.01 }],
    },
    {
      itemTypeId: 'world-plaza-siphon-carapace',
      slotId: 'body',
      displayName: 'Siphon Carapace',
      tooltip:
        'Heart-leech breastplate. Soft absorb when hit. Unique Siphon drop.',
      pieceModifiers: [{ kind: 'expected', value: 0.98 }],
      pieceHealModifiers: [{ kind: 'absorb', ratio: 0.02 }],
    },
    {
      itemTypeId: 'world-plaza-siphon-greaves',
      slotId: 'leg',
      displayName: 'Siphon Greaves',
      tooltip:
        'Vein-cracked greaves. Tiny absorb when hit. Unique Siphon drop.',
      pieceModifiers: [{ kind: 'expected', value: 0.99 }],
      pieceHealModifiers: [{ kind: 'absorb', ratio: 0.01 }],
    },
    {
      itemTypeId: 'world-plaza-siphon-treads',
      slotId: 'foot',
      displayName: 'Siphon Treads',
      tooltip: 'Fang-toe sabatons. Tiny absorb when hit. Unique Siphon drop.',
      pieceModifiers: [{ kind: 'expected', value: 0.99 }],
      pieceHealModifiers: [{ kind: 'absorb', ratio: 0.01 }],
    },
  ] as const;

/**
 * Thresholds stack additively: 2 → +8% absorb, 3 → +7% more (15% set),
 * 4+ → +10% more (25% set) + 8% outgoing lifesteal.
 */
export const DEFINING_WORLD_PLAZA_SIPHON_ARMOR_SET_THRESHOLDS: readonly DefiningWorldPlazaSiphonArmorSetThresholdBonus[] =
  [
    {
      minPieces: 2,
      label: 'Siphon 2-piece',
      modifiers: [],
      healModifiers: [{ kind: 'absorb', ratio: 0.08 }],
    },
    {
      minPieces: 3,
      label: 'Siphon 3-piece',
      modifiers: [],
      healModifiers: [{ kind: 'absorb', ratio: 0.07 }],
    },
    {
      minPieces: 4,
      label: 'Siphon full set',
      modifiers: [],
      healModifiers: [
        { kind: 'absorb', ratio: 0.1 },
        { kind: 'lifesteal', ratio: 0.08 },
      ],
      grantsFullSetMarker: true,
    },
  ] as const;

const DEFINING_WORLD_PLAZA_SIPHON_ARMOR_PIECE_BY_TYPE_ID = new Map(
  DEFINING_WORLD_PLAZA_SIPHON_ARMOR_PIECE_REGISTRY.map((piece) => [
    piece.itemTypeId,
    piece,
  ])
);

export function resolvingWorldPlazaSiphonArmorPieceDefinition(
  itemTypeId: string
): DefiningWorldPlazaSiphonArmorPieceDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_SIPHON_ARMOR_PIECE_BY_TYPE_ID.get(itemTypeId) ?? null
  );
}

export function checkingWorldPlazaInventoryItemIsSiphonArmor(
  itemTypeId: string
): boolean {
  return DEFINING_WORLD_PLAZA_SIPHON_ARMOR_PIECE_BY_TYPE_ID.has(itemTypeId);
}

export function formattingWorldPlazaSiphonArmorSetCombatModifierId(
  crumbKey: string
): string {
  return formattingWorldPlazaArmorSetCombatModifierId(
    DEFINING_WORLD_PLAZA_SIPHON_ARMOR_SET_ID,
    crumbKey
  );
}
