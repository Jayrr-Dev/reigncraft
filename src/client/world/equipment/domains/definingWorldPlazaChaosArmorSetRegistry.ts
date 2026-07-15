/**
 * Declarative Chaos Armour set: pieces, set thresholds, and on-hit proc table.
 *
 * @module components/world/equipment/domains/definingWorldPlazaChaosArmorSetRegistry
 */

import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import type {
  DefiningWorldPlazaDamageOutcomeTier,
  DefiningWorldPlazaEntityHealthDamageRollModifierKind,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { encodingWorldPlazaEntityHealthDamageRollForcedTierValue } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollForcedTier';

export const DEFINING_WORLD_PLAZA_CHAOS_ARMOR_SET_ID = 'chaos' as const;

export const DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_ID_PREFIX =
  'armor-set-' as const;

export const DEFINING_WORLD_PLAZA_CHAOS_ARMOR_FULL_SET_MARKER_ID =
  `${DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_ID_PREFIX}chaos:full-marker` as const;

/** Damage-roll crumb declared on one armour piece or set tier. */
export type DefiningWorldPlazaArmorSetDamageRollCrumb = {
  readonly kind: DefiningWorldPlazaEntityHealthDamageRollModifierKind;
  readonly value: number;
};

export type DefiningWorldPlazaChaosArmorPieceDefinition = {
  readonly itemTypeId: string;
  readonly slotId: DefiningWorldPlazaArmorSlotId;
  readonly displayName: string;
  readonly tooltip: string;
  readonly pieceModifiers: readonly DefiningWorldPlazaArmorSetDamageRollCrumb[];
};

export type DefiningWorldPlazaArmorSetThresholdBonus = {
  readonly minPieces: number;
  readonly label: string;
  readonly modifiers: readonly DefiningWorldPlazaArmorSetDamageRollCrumb[];
  /** When true, marks full-set for on-hit proc rolls. */
  readonly grantsFullSetMarker?: boolean;
};

export type DefiningWorldPlazaChaosArmorOnHitProc = {
  readonly weight: number;
  readonly tier: DefiningWorldPlazaDamageOutcomeTier;
};

export const DEFINING_WORLD_PLAZA_CHAOS_ARMOR_PIECE_REGISTRY: readonly DefiningWorldPlazaChaosArmorPieceDefinition[] =
  [
    {
      itemTypeId: 'world-plaza-chaos-visor',
      slotId: 'helm',
      displayName: 'Chaos Visor',
      tooltip:
        'Cracked iron helm. Slightly widens incoming damage swings. Unique Chaos Set drop.',
      pieceModifiers: [{ kind: 'variance', value: 1.08 }],
    },
    {
      itemTypeId: 'world-plaza-chaos-fate-gauntlets',
      slotId: 'arm',
      displayName: 'Fate Gauntlets',
      tooltip:
        'Rune-knuckled gauntlets. Soft luck skew toward safer rolls. Unique Chaos Set drop.',
      pieceModifiers: [{ kind: 'luck', value: -0.1 }],
    },
    {
      itemTypeId: 'world-plaza-chaos-entropy-cuirass',
      slotId: 'body',
      displayName: 'Entropy Cuirass',
      tooltip:
        'Magenta-veined breastplate. Tiny cut to expected damage. Unique Chaos Set drop.',
      pieceModifiers: [{ kind: 'expected', value: 0.97 }],
    },
    {
      itemTypeId: 'world-plaza-chaos-wild-greaves',
      slotId: 'leg',
      displayName: 'Wild Greaves',
      tooltip:
        'Lightning-cracked greaves. Soft luck skew toward safer rolls. Unique Chaos Set drop.',
      pieceModifiers: [{ kind: 'luck', value: -0.1 }],
    },
    {
      itemTypeId: 'world-plaza-chaos-coinflip-treads',
      slotId: 'foot',
      displayName: 'Coinflip Treads',
      tooltip:
        'Coin-toed sabatons. Tiny cut to expected damage. Unique Chaos Set drop.',
      pieceModifiers: [{ kind: 'expected', value: 0.98 }],
    },
  ] as const;

/** 2 / 3 / 4+ piece thresholds (4+ = full set; animals can complete without legs). */
export const DEFINING_WORLD_PLAZA_CHAOS_ARMOR_SET_THRESHOLDS: readonly DefiningWorldPlazaArmorSetThresholdBonus[] =
  [
    {
      minPieces: 2,
      label: 'Chaos 2-piece',
      modifiers: [{ kind: 'variance', value: 1.25 }],
    },
    {
      minPieces: 3,
      label: 'Chaos 3-piece',
      modifiers: [{ kind: 'chaotic', value: 1 }],
    },
    {
      minPieces: 4,
      label: 'Chaos full set',
      modifiers: [{ kind: 'expected', value: 0.95 }],
      grantsFullSetMarker: true,
    },
  ] as const;

/**
 * Full-set on-hit table (physical). Remaining weight = normal chaotic roll.
 * 12% dodged, 12% critical against you, 3% fatal spike.
 */
export const DEFINING_WORLD_PLAZA_CHAOS_ARMOR_FULL_SET_ON_HIT_PROCS: readonly DefiningWorldPlazaChaosArmorOnHitProc[] =
  [
    { weight: 0.12, tier: 'dodged' },
    { weight: 0.12, tier: 'critical' },
    { weight: 0.03, tier: 'fatal' },
  ] as const;

const DEFINING_WORLD_PLAZA_CHAOS_ARMOR_PIECE_BY_TYPE_ID = new Map(
  DEFINING_WORLD_PLAZA_CHAOS_ARMOR_PIECE_REGISTRY.map((piece) => [
    piece.itemTypeId,
    piece,
  ])
);

export function resolvingWorldPlazaChaosArmorPieceDefinition(
  itemTypeId: string
): DefiningWorldPlazaChaosArmorPieceDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_CHAOS_ARMOR_PIECE_BY_TYPE_ID.get(itemTypeId) ?? null
  );
}

export function checkingWorldPlazaInventoryItemIsChaosArmor(
  itemTypeId: string
): boolean {
  return DEFINING_WORLD_PLAZA_CHAOS_ARMOR_PIECE_BY_TYPE_ID.has(itemTypeId);
}

export function formattingWorldPlazaArmorSetCombatModifierId(
  setId: string,
  crumbKey: string
): string {
  return `${DEFINING_WORLD_PLAZA_ARMOR_SET_COMBAT_MODIFIER_ID_PREFIX}${setId}:${crumbKey}`;
}

export function encodingWorldPlazaChaosArmorForcedTierValue(
  tier: DefiningWorldPlazaDamageOutcomeTier
): number {
  return encodingWorldPlazaEntityHealthDamageRollForcedTierValue(tier);
}
