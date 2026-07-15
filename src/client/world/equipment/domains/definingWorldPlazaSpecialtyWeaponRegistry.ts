/**
 * Declarative specialty weapons: EV, roll crumbs, AS%, lifesteal, on-hit procs.
 * Early uniques are find-only; late signatures may be craftable.
 *
 * @module components/world/equipment/domains/definingWorldPlazaSpecialtyWeaponRegistry
 */

import type { DefiningWorldPlazaEquipmentEvModifier } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentEvModifier';
import type { DefiningWorldPlazaHeldItemTier } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type {
  DefiningWorldPlazaDamageOutcomeTier,
  DefiningWorldPlazaEntityHealthDamageRollModifierKind,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEntityPoisonPotency } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import { encodingWorldPlazaEntityHealthDamageRollForcedTierValue } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthDamageRollForcedTier';

export const DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_MODIFIER_ID_PREFIX =
  'specialty-weapon-' as const;

/** How the player obtains this unique weapon. */
export type DefiningWorldPlazaSpecialtyWeaponObtainMethod = 'find' | 'craft';

/** Stable specialty weapon ids. */
export const DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID = {
  SPLINTER_STICK: 'splinter-stick',
  KNOT_MACE: 'knot-mace',
  REED_NEEDLE: 'reed-needle',
  CAMPFIRE_BRAND: 'campfire-brand',
  THAW_PICK: 'thaw-pick',
  LUCKY_TWIG: 'lucky-twig',
  BESSEMER_EDGE: 'bessemer-edge',
  GLASS_SHARD: 'glass-shard',
  LEECH_KNIFE: 'leech-knife',
  LEDGER_STUB: 'ledger-stub',
  CHOIR_BLADE: 'choir-blade',
  VENOM_BARB: 'venom-barb',
  CHAOS_DIE: 'chaos-die',
  QUIET_HAND: 'quiet-hand',
  GLASS_NEEDLE: 'glass-needle',
  SIPHON_FANG: 'siphon-fang',
  FATED_LEDGER: 'fated-ledger',
  SOFT_CLAY_CLEAVER: 'soft-clay-cleaver',
} as const;

export type DefiningWorldPlazaSpecialtyWeaponId =
  (typeof DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID)[keyof typeof DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID];

export type DefiningWorldPlazaSpecialtyWeaponRollCrumb = {
  readonly kind: DefiningWorldPlazaEntityHealthDamageRollModifierKind;
  readonly value: number;
};

export type DefiningWorldPlazaSpecialtyWeaponOnHitForcedTierProc = {
  readonly kind: 'forced_tier';
  readonly weight: number;
  readonly tier: DefiningWorldPlazaDamageOutcomeTier;
};

export type DefiningWorldPlazaSpecialtyWeaponOnHitLockInProc = {
  readonly kind: 'lock_in';
  readonly weight: number;
};

export type DefiningWorldPlazaSpecialtyWeaponOnHitPotentialDamageProc = {
  readonly kind: 'potential_damage';
  readonly weight: number;
  /** Fraction of swing EV planted as fated damage. */
  readonly pendingEvRatio: number;
  readonly resolveDelayMs: number;
};

export type DefiningWorldPlazaSpecialtyWeaponOnHitSelfCurseProc = {
  readonly kind: 'self_curse';
  readonly weight: number;
  readonly tier: DefiningWorldPlazaDamageOutcomeTier;
  readonly durationMs: number;
};

export type DefiningWorldPlazaSpecialtyWeaponOnHitBleedProc = {
  readonly kind: 'bleed';
  readonly weight: number;
  readonly severity: DefiningWorldPlazaEntityBleedSeverity;
  /** Flat bleed pool EV when the proc lands. */
  readonly flatExpectedDamage: number;
};

export type DefiningWorldPlazaSpecialtyWeaponOnHitTemperatureProc = {
  readonly kind: 'temperature';
  readonly weight: number;
  readonly deltaCelsius: number;
};

export type DefiningWorldPlazaSpecialtyWeaponOnHitPoisonProc = {
  readonly kind: 'poison';
  readonly weight: number;
  readonly potency: DefiningWorldPlazaEntityPoisonPotency;
  /** Flat poison pool EV when the proc lands. */
  readonly flatExpectedDamage: number;
};

export type DefiningWorldPlazaSpecialtyWeaponOnHitSelfShieldProc = {
  readonly kind: 'self_shield';
  readonly weight: number;
  readonly shieldPoints: number;
};

export type DefiningWorldPlazaSpecialtyWeaponOnHitProc =
  | DefiningWorldPlazaSpecialtyWeaponOnHitForcedTierProc
  | DefiningWorldPlazaSpecialtyWeaponOnHitLockInProc
  | DefiningWorldPlazaSpecialtyWeaponOnHitPotentialDamageProc
  | DefiningWorldPlazaSpecialtyWeaponOnHitSelfCurseProc
  | DefiningWorldPlazaSpecialtyWeaponOnHitBleedProc
  | DefiningWorldPlazaSpecialtyWeaponOnHitTemperatureProc
  | DefiningWorldPlazaSpecialtyWeaponOnHitPoisonProc
  | DefiningWorldPlazaSpecialtyWeaponOnHitSelfShieldProc;

export type DefiningWorldPlazaSpecialtyWeaponDefinition = {
  readonly weaponId: DefiningWorldPlazaSpecialtyWeaponId;
  readonly itemTypeId: string;
  readonly displayName: string;
  readonly tooltip: string;
  /** Iconify fallback when no inventory sprite sheet cell exists. */
  readonly iconifyIcon: string;
  readonly rarity: 'uncommon' | 'rare' | 'epic' | 'legendary';
  readonly obtainMethod: DefiningWorldPlazaSpecialtyWeaponObtainMethod;
  readonly heldItemTier: DefiningWorldPlazaHeldItemTier;
  readonly attackEvModifier: DefiningWorldPlazaEquipmentEvModifier;
  readonly attackSpeedMultiplier?: number;
  readonly physicalDamageLifestealRatio?: number;
  /** Always-on attacker roll crumbs while equipped. */
  readonly attackerRollModifiers: readonly DefiningWorldPlazaSpecialtyWeaponRollCrumb[];
  /** Weighted per-hit procs (remaining weight = no special proc). */
  readonly onHitProcs: readonly DefiningWorldPlazaSpecialtyWeaponOnHitProc[];
  /** Max durability for the inventory row. */
  readonly maxDurability: number;
};

export const DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_REGISTRY: readonly DefiningWorldPlazaSpecialtyWeaponDefinition[] =
  [
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.SPLINTER_STICK,
      itemTypeId: 'world-plaza-weapon-splinter-stick',
      displayName: 'Splinter Stick',
      tooltip:
        'Broken branch with a mean tip. Unique find. Chips a light bleed on hit.',
      iconifyIcon: 'game-icons:broadsword',
      rarity: 'uncommon',
      obtainMethod: 'find',
      heldItemTier: 'wood',
      attackEvModifier: { mode: 'multiplicative', value: 1 },
      attackerRollModifiers: [],
      onHitProcs: [
        {
          kind: 'bleed',
          weight: 1,
          severity: 'bleeding',
          flatExpectedDamage: 8,
        },
      ],
      maxDurability: 80,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.KNOT_MACE,
      itemTypeId: 'world-plaza-weapon-knot-mace',
      displayName: 'Knot Mace',
      tooltip:
        'Knotted club. Unique find. Slightly lower EV, tighter damage rolls.',
      iconifyIcon: 'game-icons:broadsword',
      rarity: 'uncommon',
      obtainMethod: 'find',
      heldItemTier: 'wood',
      attackEvModifier: { mode: 'multiplicative', value: 0.95 },
      attackerRollModifiers: [{ kind: 'stability', value: 0.85 }],
      onHitProcs: [],
      maxDurability: 90,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.REED_NEEDLE,
      itemTypeId: 'world-plaza-weapon-reed-needle',
      displayName: 'Reed Needle',
      tooltip: 'Thin reed spike. Unique find. Weak hits, faster swings.',
      iconifyIcon: 'game-icons:backstab',
      rarity: 'uncommon',
      obtainMethod: 'find',
      heldItemTier: 'wood',
      attackEvModifier: { mode: 'multiplicative', value: 0.85 },
      attackSpeedMultiplier: 1.15,
      attackerRollModifiers: [],
      onHitProcs: [],
      maxDurability: 70,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.CAMPFIRE_BRAND,
      itemTypeId: 'world-plaza-weapon-campfire-brand',
      displayName: 'Campfire Brand',
      tooltip:
        'Charred brand still warm. Unique find. Hits push a little heat into the target.',
      iconifyIcon: 'game-icons:campfire',
      rarity: 'uncommon',
      obtainMethod: 'find',
      heldItemTier: 'wood',
      attackEvModifier: { mode: 'multiplicative', value: 0.9 },
      attackerRollModifiers: [],
      onHitProcs: [{ kind: 'temperature', weight: 1, deltaCelsius: 6 }],
      maxDurability: 85,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.THAW_PICK,
      itemTypeId: 'world-plaza-weapon-thaw-pick',
      displayName: 'Thaw Pick',
      tooltip:
        'Bone-head pick. Unique find. Hits push a little cold into the target.',
      iconifyIcon: 'game-icons:war-pick',
      rarity: 'uncommon',
      obtainMethod: 'find',
      heldItemTier: 'wood',
      attackEvModifier: { mode: 'multiplicative', value: 0.9 },
      attackerRollModifiers: [],
      onHitProcs: [{ kind: 'temperature', weight: 1, deltaCelsius: -6 }],
      maxDurability: 100,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.LUCKY_TWIG,
      itemTypeId: 'world-plaza-weapon-lucky-twig',
      displayName: 'Lucky Twig',
      tooltip:
        'Forked charm stick. Unique find. Soft luck skew toward better rolls.',
      iconifyIcon: 'game-icons:two-coins',
      rarity: 'uncommon',
      obtainMethod: 'find',
      heldItemTier: 'wood',
      attackEvModifier: { mode: 'multiplicative', value: 0.9 },
      attackerRollModifiers: [{ kind: 'luck', value: 0.15 }],
      onHitProcs: [],
      maxDurability: 60,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.BESSEMER_EDGE,
      itemTypeId: 'world-plaza-weapon-bessemer-edge',
      displayName: 'Bessemer Edge',
      tooltip:
        'Industrial plate blade. Unique find. Steady EV and tighter rolls. Hits drip a little shield onto you.',
      iconifyIcon: 'game-icons:broadsword',
      rarity: 'rare',
      obtainMethod: 'find',
      heldItemTier: 'steel',
      attackEvModifier: { mode: 'multiplicative', value: 1.1 },
      attackerRollModifiers: [{ kind: 'stability', value: 0.8 }],
      onHitProcs: [{ kind: 'self_shield', weight: 1, shieldPoints: 6 }],
      maxDurability: 180,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.GLASS_SHARD,
      itemTypeId: 'world-plaza-weapon-glass-shard',
      displayName: 'Glass Shard',
      tooltip:
        'Jagged crystal knife. Unique find. Lower EV, faster swings, critical bias.',
      iconifyIcon: 'game-icons:backstab',
      rarity: 'rare',
      obtainMethod: 'find',
      heldItemTier: 'iron',
      attackEvModifier: { mode: 'multiplicative', value: 0.9 },
      attackSpeedMultiplier: 1.1,
      attackerRollModifiers: [{ kind: 'critical_bias', value: 1 }],
      onHitProcs: [],
      maxDurability: 120,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.LEECH_KNIFE,
      itemTypeId: 'world-plaza-weapon-leech-knife',
      displayName: 'Leech Knife',
      tooltip:
        'Blood-groove knife. Unique find. Slightly lower EV. Siphons a cut of physical damage you deal.',
      iconifyIcon: 'game-icons:broken-heart',
      rarity: 'rare',
      obtainMethod: 'find',
      heldItemTier: 'iron',
      attackEvModifier: { mode: 'multiplicative', value: 0.95 },
      physicalDamageLifestealRatio: 0.08,
      attackerRollModifiers: [],
      onHitProcs: [],
      maxDurability: 150,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.LEDGER_STUB,
      itemTypeId: 'world-plaza-weapon-ledger-stub',
      displayName: 'Ledger Stub',
      tooltip:
        'Short blade with a bound scrap page. Unique find. Weak cut; sometimes plants fated damage.',
      iconifyIcon: 'game-icons:scroll-unfurled',
      rarity: 'rare',
      obtainMethod: 'find',
      heldItemTier: 'iron',
      attackEvModifier: { mode: 'multiplicative', value: 0.85 },
      attackerRollModifiers: [],
      onHitProcs: [
        {
          kind: 'potential_damage',
          weight: 0.3,
          pendingEvRatio: 0.35,
          resolveDelayMs: 1500,
        },
      ],
      maxDurability: 140,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.CHOIR_BLADE,
      itemTypeId: 'world-plaza-weapon-choir-blade',
      displayName: 'Choir Blade',
      tooltip:
        'Bleed-song steel. Unique find. Hits open a heavier bleed than a wood stick.',
      iconifyIcon: 'game-icons:broadsword',
      rarity: 'rare',
      obtainMethod: 'find',
      heldItemTier: 'steel',
      attackEvModifier: { mode: 'multiplicative', value: 1 },
      attackerRollModifiers: [],
      onHitProcs: [
        {
          kind: 'bleed',
          weight: 1,
          severity: 'bleeding',
          flatExpectedDamage: 14,
        },
      ],
      maxDurability: 170,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.VENOM_BARB,
      itemTypeId: 'world-plaza-weapon-venom-barb',
      displayName: 'Venom Barb',
      tooltip:
        'Green-tipped stiletto. Unique find. Lower EV; every hit plants a toxic pool.',
      iconifyIcon: 'game-icons:backstab',
      rarity: 'rare',
      obtainMethod: 'find',
      heldItemTier: 'iron',
      attackEvModifier: { mode: 'multiplicative', value: 0.9 },
      attackerRollModifiers: [],
      onHitProcs: [
        {
          kind: 'poison',
          weight: 1,
          potency: 'toxic',
          flatExpectedDamage: 12,
        },
      ],
      maxDurability: 130,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.CHAOS_DIE,
      itemTypeId: 'world-plaza-weapon-chaos-die',
      displayName: 'Chaos Diceblade',
      tooltip:
        'Dice-plate blade. Lower mean, wilder swings, chaotic rolls. Sometimes spikes lethal, locks true, or plants a fated echo.',
      iconifyIcon: 'game-icons:broadsword',
      rarity: 'epic',
      obtainMethod: 'craft',
      heldItemTier: 'gold',
      attackEvModifier: { mode: 'multiplicative', value: 0.92 },
      attackerRollModifiers: [
        { kind: 'variance', value: 1.35 },
        { kind: 'chaotic', value: 1 },
        { kind: 'luck', value: 0.1 },
      ],
      onHitProcs: [
        { kind: 'forced_tier', weight: 0.1, tier: 'lethal' },
        { kind: 'lock_in', weight: 0.1 },
        {
          kind: 'potential_damage',
          weight: 0.05,
          pendingEvRatio: 0.4,
          resolveDelayMs: 1500,
        },
      ],
      maxDurability: 266,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.QUIET_HAND,
      itemTypeId: 'world-plaza-weapon-quiet-hand',
      displayName: 'Quiet Hand Blade',
      tooltip:
        'Manus-calm steel. Slightly lower EV, tighter rolls. Many swings lock true to expected damage.',
      iconifyIcon: 'game-icons:broadsword',
      rarity: 'epic',
      obtainMethod: 'craft',
      heldItemTier: 'gold',
      attackEvModifier: { mode: 'multiplicative', value: 0.9 },
      attackerRollModifiers: [
        { kind: 'stability', value: 0.75 },
        { kind: 'luck', value: 0.2 },
      ],
      onHitProcs: [{ kind: 'lock_in', weight: 0.4 }],
      maxDurability: 266,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.GLASS_NEEDLE,
      itemTypeId: 'world-plaza-weapon-glass-needle',
      displayName: 'Glass Needle Stiletto',
      tooltip:
        'Thin greed. Lower EV, faster swings, strong critical bias. Hits hard when the roll spikes.',
      iconifyIcon: 'game-icons:backstab',
      rarity: 'epic',
      obtainMethod: 'craft',
      heldItemTier: 'gold',
      attackEvModifier: { mode: 'multiplicative', value: 0.88 },
      attackSpeedMultiplier: 1.12,
      attackerRollModifiers: [{ kind: 'critical_bias', value: 1 }],
      onHitProcs: [],
      maxDurability: 200,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.SIPHON_FANG,
      itemTypeId: 'world-plaza-weapon-siphon-fang',
      displayName: 'Siphon Fang Dagger',
      tooltip:
        'Leech edge. Slightly lower EV. Heals you for a cut of physical damage you deal.',
      iconifyIcon: 'game-icons:broken-heart',
      rarity: 'epic',
      obtainMethod: 'craft',
      heldItemTier: 'gold',
      attackEvModifier: { mode: 'multiplicative', value: 0.95 },
      physicalDamageLifestealRatio: 0.15,
      attackerRollModifiers: [],
      onHitProcs: [],
      maxDurability: 266,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.FATED_LEDGER,
      itemTypeId: 'world-plaza-weapon-fated-ledger',
      displayName: 'Fated Ledger Blade',
      tooltip:
        'Writes death late. Weak first cut; every hit plants fated damage that lands after a short delay.',
      iconifyIcon: 'game-icons:broadsword',
      rarity: 'legendary',
      obtainMethod: 'craft',
      heldItemTier: 'gold',
      attackEvModifier: { mode: 'multiplicative', value: 0.75 },
      attackerRollModifiers: [],
      onHitProcs: [
        {
          kind: 'potential_damage',
          weight: 1,
          pendingEvRatio: 0.5,
          resolveDelayMs: 2000,
        },
      ],
      maxDurability: 266,
    },
    {
      weaponId: DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ID.SOFT_CLAY_CLEAVER,
      itemTypeId: 'world-plaza-weapon-soft-clay-cleaver',
      displayName: 'Soft Clay Cleaver',
      tooltip:
        'Apostle-cursed cut. High EV and wild variance. Sometimes marks you Exposed for the next blows.',
      iconifyIcon: 'game-icons:wood-axe',
      rarity: 'legendary',
      obtainMethod: 'craft',
      heldItemTier: 'gold',
      attackEvModifier: { mode: 'multiplicative', value: 1.35 },
      attackerRollModifiers: [{ kind: 'variance', value: 1.2 }],
      onHitProcs: [
        {
          kind: 'self_curse',
          weight: 0.08,
          tier: 'critical',
          durationMs: 4000,
        },
      ],
      maxDurability: 200,
    },
  ] as const;

export const DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_ITEM_TYPE_IDS =
  DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_REGISTRY.map(
    (weapon) => weapon.itemTypeId
  );

const DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_BY_TYPE_ID = new Map(
  DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_REGISTRY.map((weapon) => [
    weapon.itemTypeId,
    weapon,
  ])
);

export function resolvingWorldPlazaSpecialtyWeaponDefinition(
  itemTypeId: string
): DefiningWorldPlazaSpecialtyWeaponDefinition | null {
  return (
    DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_BY_TYPE_ID.get(itemTypeId) ?? null
  );
}

export function checkingWorldPlazaInventoryItemIsSpecialtyWeapon(
  itemTypeId: string
): boolean {
  return DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_BY_TYPE_ID.has(itemTypeId);
}

export function formattingWorldPlazaSpecialtyWeaponModifierId(
  weaponId: string,
  crumbKey: string
): string {
  return `${DEFINING_WORLD_PLAZA_SPECIALTY_WEAPON_MODIFIER_ID_PREFIX}${weaponId}:${crumbKey}`;
}

export function encodingWorldPlazaSpecialtyWeaponForcedTierValue(
  tier: DefiningWorldPlazaDamageOutcomeTier
): number {
  return encodingWorldPlazaEntityHealthDamageRollForcedTierValue(tier);
}
