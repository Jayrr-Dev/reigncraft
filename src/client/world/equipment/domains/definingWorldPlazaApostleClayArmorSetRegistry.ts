/**
 * Declarative Apostle Clay set: soft tank clay that can crack into Exposed.
 *
 * @module components/world/equipment/domains/definingWorldPlazaApostleClayArmorSetRegistry
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

export const DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_SET_ID =
  'apostle-clay' as const;

export const DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_FULL_SET_MARKER_ID =
  `${DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_ID_PREFIX}apostle-clay:full-marker` as const;

export type DefiningWorldPlazaApostleClayArmorOnHitProc = {
  readonly weight: number;
  readonly tier: DefiningWorldPlazaDamageOutcomeTier;
};

export type DefiningWorldPlazaApostleClayArmorPieceDefinition = {
  readonly itemTypeId: string;
  readonly slotId: DefiningWorldPlazaArmorSlotId;
  readonly displayName: string;
  readonly tooltip: string;
  readonly pieceModifiers: readonly DefiningWorldPlazaArmorSetDamageRollCrumb[];
};

export const DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_PIECE_REGISTRY: readonly DefiningWorldPlazaApostleClayArmorPieceDefinition[] =
  [
    {
      itemTypeId: 'world-plaza-apostle-clay-mask',
      slotId: 'helm',
      displayName: 'Apostle Clay Mask',
      tooltip:
        'Fired clay great-helm. Soft soak, soft crack. Unique Apostle Clay drop.',
      pieceModifiers: [
        { kind: 'expected', value: 0.98 },
        { kind: 'variance', value: 1.05 },
      ],
    },
    {
      itemTypeId: 'world-plaza-apostle-clay-gauntlets',
      slotId: 'arm',
      displayName: 'Apostle Clay Gauntlets',
      tooltip:
        'Wet-fired clay gauntlets. Soft soak, soft crack. Unique Apostle Clay drop.',
      pieceModifiers: [
        { kind: 'expected', value: 0.98 },
        { kind: 'variance', value: 1.05 },
      ],
    },
    {
      itemTypeId: 'world-plaza-apostle-clay-harness',
      slotId: 'body',
      displayName: 'Apostle Clay Harness',
      tooltip:
        'Apostle-cursed clay breastplate. Soft soak, soft crack. Unique Apostle Clay drop.',
      pieceModifiers: [
        { kind: 'expected', value: 0.96 },
        { kind: 'variance', value: 1.08 },
      ],
    },
    {
      itemTypeId: 'world-plaza-apostle-clay-greaves',
      slotId: 'leg',
      displayName: 'Apostle Clay Greaves',
      tooltip: 'Clay greaves. Soft soak, soft crack. Unique Apostle Clay drop.',
      pieceModifiers: [
        { kind: 'expected', value: 0.98 },
        { kind: 'variance', value: 1.05 },
      ],
    },
    {
      itemTypeId: 'world-plaza-apostle-clay-sabatons',
      slotId: 'foot',
      displayName: 'Apostle Clay Sabatons',
      tooltip:
        'Clay sabatons. Soft soak, soft crack. Unique Apostle Clay drop.',
      pieceModifiers: [
        { kind: 'expected', value: 0.98 },
        { kind: 'variance', value: 1.05 },
      ],
    },
  ] as const;

/** 2 / 3 / 4+ thresholds (4+ = full set + Exposed crack risk). */
export const DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_SET_THRESHOLDS: readonly DefiningWorldPlazaArmorSetThresholdBonus[] =
  [
    {
      minPieces: 2,
      label: 'Apostle Clay 2-piece',
      modifiers: [{ kind: 'variance', value: 1.15 }],
    },
    {
      minPieces: 3,
      label: 'Apostle Clay 3-piece',
      modifiers: [{ kind: 'expected', value: 0.7 }],
    },
    {
      minPieces: 4,
      label: 'Apostle Clay full set',
      modifiers: [{ kind: 'variance', value: 1.1 }],
      grantsFullSetMarker: true,
    },
  ] as const;

/**
 * Full-set on-hit (physical): 8% force Critical (Exposed crack). Rest normal.
 */
export const DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_FULL_SET_ON_HIT_PROCS: readonly DefiningWorldPlazaApostleClayArmorOnHitProc[] =
  [{ weight: 0.08, tier: 'critical' }] as const;

const DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_PIECE_BY_TYPE_ID = new Map(
  DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_PIECE_REGISTRY.map((piece) => [
    piece.itemTypeId,
    piece,
  ])
);

export function resolvingWorldPlazaApostleClayArmorPieceDefinition(
  itemTypeId: string
): DefiningWorldPlazaApostleClayArmorPieceDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_PIECE_BY_TYPE_ID.get(itemTypeId) ??
    null
  );
}

export function checkingWorldPlazaInventoryItemIsApostleClayArmor(
  itemTypeId: string
): boolean {
  return DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_PIECE_BY_TYPE_ID.has(
    itemTypeId
  );
}

export function formattingWorldPlazaApostleClayArmorSetCombatModifierId(
  crumbKey: string
): string {
  return formattingWorldPlazaArmorSetCombatModifierId(
    DEFINING_WORLD_PLAZA_APOSTLE_CLAY_ARMOR_SET_ID,
    crumbKey
  );
}

export function encodingWorldPlazaApostleClayArmorForcedTierValue(
  tier: DefiningWorldPlazaDamageOutcomeTier
): number {
  return encodingWorldPlazaEntityHealthDamageRollForcedTierValue(tier);
}
