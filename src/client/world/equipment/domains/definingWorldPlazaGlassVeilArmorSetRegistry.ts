/**
 * Declarative Glass Veil set: fragile dodge armour (opposite of Bessemer tank).
 *
 * @module components/world/equipment/domains/definingWorldPlazaGlassVeilArmorSetRegistry
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
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { encodingWorldPlazaEntityHealthDamageRollForcedTierValue } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollForcedTier';

export const DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_SET_ID =
  'glass-veil' as const;

export const DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_FULL_SET_MARKER_ID =
  `${DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_ID_PREFIX}glass-veil:full-marker` as const;

/** Cooldown between full-set instinct dodges (ms). */
export const DEFINING_WORLD_PLAZA_GLASS_VEIL_INSTINCT_COOLDOWN_MS = 20_000;

export type DefiningWorldPlazaGlassVeilArmorPieceDefinition = {
  readonly itemTypeId: string;
  readonly slotId: DefiningWorldPlazaArmorSlotId;
  readonly displayName: string;
  readonly tooltip: string;
  readonly pieceModifiers: readonly DefiningWorldPlazaArmorSetDamageRollCrumb[];
};

export const DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_PIECE_REGISTRY: readonly DefiningWorldPlazaGlassVeilArmorPieceDefinition[] =
  [
    {
      itemTypeId: 'world-plaza-glass-veil-diadem',
      slotId: 'helm',
      displayName: 'Glass Veil Diadem',
      tooltip:
        'Crystal circlet. Soft dodge skew, but hits hurt more. Unique Glass Veil drop.',
      pieceModifiers: [
        { kind: 'dodge_bias', value: 0.25 },
        { kind: 'expected', value: 1.04 },
      ],
    },
    {
      itemTypeId: 'world-plaza-glass-veil-bracers',
      slotId: 'arm',
      displayName: 'Glass Veil Bracers',
      tooltip:
        'Thin crystal bracers. Soft dodge skew, fragile. Unique Glass Veil drop.',
      pieceModifiers: [
        { kind: 'dodge_bias', value: 0.25 },
        { kind: 'expected', value: 1.03 },
      ],
    },
    {
      itemTypeId: 'world-plaza-glass-veil-mantle',
      slotId: 'body',
      displayName: 'Glass Veil Mantle',
      tooltip:
        'Shattered-glass mantle. Soft dodge skew, hits hurt more. Unique Glass Veil drop.',
      pieceModifiers: [
        { kind: 'dodge_bias', value: 0.35 },
        { kind: 'expected', value: 1.06 },
      ],
    },
    {
      itemTypeId: 'world-plaza-glass-veil-greaves',
      slotId: 'leg',
      displayName: 'Glass Veil Greaves',
      tooltip:
        'Crystal greaves. Soft dodge skew, fragile. Unique Glass Veil drop.',
      pieceModifiers: [
        { kind: 'dodge_bias', value: 0.25 },
        { kind: 'expected', value: 1.03 },
      ],
    },
    {
      itemTypeId: 'world-plaza-glass-veil-slippers',
      slotId: 'foot',
      displayName: 'Glass Veil Slippers',
      tooltip:
        'Crystal slippers. Soft dodge skew, fragile. Unique Glass Veil drop.',
      pieceModifiers: [
        { kind: 'dodge_bias', value: 0.25 },
        { kind: 'expected', value: 1.03 },
      ],
    },
  ] as const;

/** 2 / 3 / 4+ thresholds (4+ = full set). */
export const DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_SET_THRESHOLDS: readonly DefiningWorldPlazaArmorSetThresholdBonus[] =
  [
    {
      minPieces: 2,
      label: 'Glass Veil 2-piece',
      modifiers: [{ kind: 'luck', value: -0.2 }],
    },
    {
      minPieces: 3,
      label: 'Glass Veil 3-piece',
      modifiers: [{ kind: 'dodge_bias', value: 1 }],
    },
    {
      minPieces: 4,
      label: 'Glass Veil full set',
      modifiers: [{ kind: 'expected', value: 1.05 }],
      grantsFullSetMarker: true,
    },
  ] as const;

const DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_PIECE_BY_TYPE_ID = new Map(
  DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_PIECE_REGISTRY.map((piece) => [
    piece.itemTypeId,
    piece,
  ])
);

export function resolvingWorldPlazaGlassVeilArmorPieceDefinition(
  itemTypeId: string
): DefiningWorldPlazaGlassVeilArmorPieceDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_PIECE_BY_TYPE_ID.get(itemTypeId) ??
    null
  );
}

export function checkingWorldPlazaInventoryItemIsGlassVeilArmor(
  itemTypeId: string
): boolean {
  return DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_PIECE_BY_TYPE_ID.has(itemTypeId);
}

export function formattingWorldPlazaGlassVeilArmorSetCombatModifierId(
  crumbKey: string
): string {
  return formattingWorldPlazaArmorSetCombatModifierId(
    DEFINING_WORLD_PLAZA_GLASS_VEIL_ARMOR_SET_ID,
    crumbKey
  );
}

export function encodingWorldPlazaGlassVeilForcedDodgedValue(): number {
  return encodingWorldPlazaEntityHealthDamageRollForcedTierValue(
    'dodged' satisfies DefiningWorldPlazaDamageOutcomeTier
  );
}
