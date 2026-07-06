import type { CommunityMemberProfileStatusKind } from '@/components/community/domains/definingCommunityMemberProfileStatus';
import {
  LABELING_COMMUNITY_MEMBER_PROFILE_STATUS_ADMIN,
  LABELING_COMMUNITY_MEMBER_PROFILE_STATUS_FOUNDER,
  LABELING_COMMUNITY_MEMBER_PROFILE_STATUS_PRIME_TYPOLOGIST,
  LABELING_COMMUNITY_MEMBER_PROFILE_STATUS_TYPOLOGIST,
} from '@/components/community/domains/definingCommunityMemberProfileStatus';
import { DEFINING_WORLD_PLAZA_ENTITY_BLEED_SEVERITY_REGISTRY } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import { DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY } from '@/components/world/health/domains/definingWorldPlazaEntityDamageKindRegistry';
import { DEFINING_WORLD_PLAZA_ENTITY_POISON_POTENCY_REGISTRY } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';

/** Top-level mechanics guide tab. */
export type PlazaMechanicsTabId = 'statuses' | 'damage' | 'status-effects';

/** One profile status badge entry in the Statuses tab. */
export type PlazaMechanicsProfileStatusId = CommunityMemberProfileStatusKind;

/** One damage-type explainer card in the Damage tab. */
export type PlazaMechanicsDamageSectionId =
  | 'physical'
  | 'fall'
  | 'environmental-heat'
  | 'environmental-cold'
  | 'environmental-lava'
  | 'poison-toxic'
  | 'poison-venomous'
  | 'poison-lethal'
  | 'bleed-bleeding'
  | 'bleed-hemorrhaging'
  | 'bleed-exsanguinating'
  | 'starvation'
  | 'potential-damage';

/** One combat status-effect explainer card in the Status Effects tab. */
export type PlazaMechanicsStatusEffectSectionId =
  | 'bleed'
  | 'poison'
  | 'temperature'
  | 'burn-dot'
  | 'shield'
  | 'invincibility'
  | 'bonus-max-health'
  | 'fated-damage';

export type PlazaMechanicsSectionDefinition = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type PlazaMechanicsProfileStatusDefinition = {
  id: PlazaMechanicsProfileStatusId;
  title: string;
  description: string;
};

export type PlazaMechanicsTabDefinition = {
  id: PlazaMechanicsTabId;
  label: string;
};

/** Default tab when the mechanics panel opens. */
export const DEFINING_PLAZA_MECHANICS_DEFAULT_TAB_ID: PlazaMechanicsTabId =
  'statuses';

/** Subtitle copy shown under the mechanics panel title. */
export const DEFINING_PLAZA_MECHANICS_PANEL_SUBTITLE =
  'Combat rules, profile badges, and status effects' as const;

/** Top-level mechanics category tabs. */
export const DEFINING_PLAZA_MECHANICS_TABS: readonly PlazaMechanicsTabDefinition[] =
  [
    { id: 'statuses', label: 'Statuses' },
    { id: 'damage', label: 'Damage' },
    { id: 'status-effects', label: 'Status Effects' },
  ] as const;

const bleedBleeding =
  DEFINING_WORLD_PLAZA_ENTITY_BLEED_SEVERITY_REGISTRY.bleeding;
const bleedHemorrhaging =
  DEFINING_WORLD_PLAZA_ENTITY_BLEED_SEVERITY_REGISTRY.hemorrhaging;
const bleedExsanguinating =
  DEFINING_WORLD_PLAZA_ENTITY_BLEED_SEVERITY_REGISTRY.exsanguinating;

const poisonToxic = DEFINING_WORLD_PLAZA_ENTITY_POISON_POTENCY_REGISTRY.toxic;
const poisonVenomous =
  DEFINING_WORLD_PLAZA_ENTITY_POISON_POTENCY_REGISTRY.venomous;
const poisonLethal = DEFINING_WORLD_PLAZA_ENTITY_POISON_POTENCY_REGISTRY.lethal;

const damageFall = DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY.fall;
const damageHeat =
  DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY.environmental_heat;
const damageCold =
  DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY.environmental_cold;
const damageLava =
  DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY.environmental_lava;
const damageStarvation =
  DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY.starvation;
const damagePotential =
  DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY.potential_damage;

/** Profile status badges shown beside player names in the plaza. */
export const DEFINING_PLAZA_MECHANICS_PROFILE_STATUSES: readonly PlazaMechanicsProfileStatusDefinition[] =
  [
    {
      id: 'admin',
      title: LABELING_COMMUNITY_MEMBER_PROFILE_STATUS_ADMIN,
      description:
        'Platform administrators. The chess-king icon marks staff who help run the community and moderate the plaza.',
    },
    {
      id: 'founder',
      title: LABELING_COMMUNITY_MEMBER_PROFILE_STATUS_FOUNDER,
      description:
        'Early supporters who helped build Reigncraft. The chess-queen icon appears beside their name in the world.',
    },
    {
      id: 'prime_typologist',
      title: LABELING_COMMUNITY_MEMBER_PROFILE_STATUS_PRIME_TYPOLOGIST,
      description:
        'Lead typologists who curate the world’s design language. The crown icon highlights community owners.',
    },
    {
      id: 'typologist',
      title: LABELING_COMMUNITY_MEMBER_PROFILE_STATUS_TYPOLOGIST,
      description:
        'Active typologists who shape biomes, blocks, and visual style. The book icon marks their contributions.',
    },
  ] as const;

/** Intro copy for the Statuses tab before a badge is selected. */
export const DEFINING_PLAZA_MECHANICS_STATUSES_INTRO =
  'Profile badges appear next to player names in the plaza. Select a badge below to learn what each one means.' as const;

/** Damage type explainers for the Damage tab. */
export const DEFINING_PLAZA_MECHANICS_DAMAGE_SECTIONS: readonly PlazaMechanicsSectionDefinition[] =
  [
    {
      id: 'physical',
      title: 'Physical',
      description:
        'Direct hits from combat and tools. Physical damage uses the statistical roll engine — hits can land weak, normal, strong, or critical. Shield points absorb physical damage before health is touched.',
      icon: 'boxicons:sword-filled',
    },
    {
      id: 'fall',
      title: 'Fall',
      description:
        'Damage from landing after a long drop. Fall hits also use the roll engine — the farther you fall, the harder the impact.',
      icon: damageFall.floatIcon ?? 'mdi:arrow-down-bold',
    },
    {
      id: 'environmental-heat',
      title: 'Scorch (Heat)',
      description:
        'Extreme heat in desert and badlands biomes deals scorch damage per second while you are exposed. Heat resistance slows the drain.',
      icon: damageHeat.floatIcon ?? 'solar:fire-bold',
    },
    {
      id: 'environmental-cold',
      title: 'Frost (Cold)',
      description:
        'Freezing biomes deal frost damage per second. Cold resistance reduces how quickly the chill wears you down.',
      icon: damageCold.floatIcon ?? 'mdi:snowflake',
    },
    {
      id: 'environmental-lava',
      title: 'Burn (Lava)',
      description:
        'Standing in lava applies burning damage over time. Heat resistance reduces the rate — leave the lava quickly or you will burn out.',
      icon: damageLava.floatIcon ?? 'solar:fire-bold',
    },
    {
      id: 'poison-toxic',
      title: poisonToxic.label,
      description: poisonToxic.description,
      icon: poisonToxic.floatIcon,
    },
    {
      id: 'poison-venomous',
      title: poisonVenomous.label,
      description: poisonVenomous.description,
      icon: poisonVenomous.floatIcon,
    },
    {
      id: 'poison-lethal',
      title: poisonLethal.label,
      description: poisonLethal.description,
      icon: poisonLethal.floatIcon,
    },
    {
      id: 'bleed-bleeding',
      title: bleedBleeding.label,
      description: bleedBleeding.description,
      icon: bleedBleeding.floatIcon,
    },
    {
      id: 'bleed-hemorrhaging',
      title: bleedHemorrhaging.label,
      description: bleedHemorrhaging.description,
      icon: bleedHemorrhaging.floatIcon,
    },
    {
      id: 'bleed-exsanguinating',
      title: bleedExsanguinating.label,
      description: bleedExsanguinating.description,
      icon: bleedExsanguinating.floatIcon,
    },
    {
      id: 'starvation',
      title: 'Starvation',
      description:
        'When hunger reaches zero you begin starving. Starvation deals steady damage over time and slows movement until you eat.',
      icon: damageStarvation.floatIcon ?? 'mdi:food-drumstick-off',
    },
    {
      id: 'potential-damage',
      title: 'Fated (Pending)',
      description:
        'Some curses and debuffs store pending damage that resolves after a delay. The HUD shows how much is still coming — heal or shield before it lands.',
      icon: damagePotential.floatIcon ?? 'mdi:flash',
    },
  ] as const;

/** Status effect explainers for the Status Effects tab. */
export const DEFINING_PLAZA_MECHANICS_STATUS_EFFECT_SECTIONS: readonly PlazaMechanicsSectionDefinition[] =
  [
    {
      id: 'bleed',
      title: 'Bleed',
      description:
        'The red droplet badge tracks total bleed damage still ticking down. Stacks from repeat hits escalate through Bleeding → Hemorrhaging → Exsanguinating.',
      icon: bleedBleeding.floatIcon,
    },
    {
      id: 'poison',
      title: 'Poison',
      description:
        'The biohazard badge shows remaining poison damage. Toxic, Venomous, and Lethal tiers stack additively — higher tiers drain faster and hit harder at the end.',
      icon: poisonToxic.floatIcon,
    },
    {
      id: 'temperature',
      title: 'Heat & Frost Exposure',
      description:
        'While standing in extreme heat or cold, a fire or snowflake badge shows damage per second. Move to a milder biome or wait for resistance to help.',
      icon: 'mdi:thermometer',
    },
    {
      id: 'burn-dot',
      title: 'Burn Damage Pool',
      description:
        'Lava and lingering burn effects show remaining fire damage as a number. The badge counts down as ticks land until the pool is empty.',
      icon: 'solar:fire-bold',
    },
    {
      id: 'shield',
      title: 'Shield',
      description:
        'The shield-plus badge shows bonus shield points. Shields absorb physical hits first — when the number reaches zero, damage goes straight to health.',
      icon: 'mdi:shield-plus',
    },
    {
      id: 'invincibility',
      title: 'Invincibility',
      description:
        'A golden heart-pulse badge means you cannot take damage. Timed invincibility shows seconds remaining; some sources grant infinite invincibility.',
      icon: 'solar:heart-pulse-bold',
    },
    {
      id: 'bonus-max-health',
      title: 'Bonus Max Health',
      description:
        'The heart-plus badge shows temporary bonus max HP from potions or buffs. The number is how much extra health you gained; it expires when the timer runs out.',
      icon: 'mdi:heart-plus',
    },
    {
      id: 'fated-damage',
      title: 'Fated Damage',
      description:
        'The amber flash badge tracks pending damage waiting to resolve. The number is how much will hit when the timer expires — clear it with healing or shields.',
      icon: damagePotential.floatIcon ?? 'mdi:flash',
    },
  ] as const;
