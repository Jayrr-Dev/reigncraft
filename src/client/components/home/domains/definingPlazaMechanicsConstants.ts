import { DEFINING_WORLD_PLAZA_ENTITY_BLEED_SEVERITY_REGISTRY } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import { DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY } from '@/components/world/health/domains/definingWorldPlazaEntityDamageKindRegistry';
import { DEFINING_WORLD_PLAZA_ENTITY_POISON_POTENCY_REGISTRY } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';

/** Top-level mechanics guide tab. */
export type PlazaMechanicsTabId =
  | 'combat'
  | 'status-effects'
  | 'world'
  | 'badges';

/** Filter for the Badges tab list. */
export type PlazaMechanicsBuffBadgeFilterId = 'all' | 'buff' | 'debuff';

/** One damage-type explainer card in the Damage tab. */
export type PlazaMechanicsDamageSectionId =
  | 'ev-damage'
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

/** One world explainer card in the World tab. */
export type PlazaMechanicsWorldSectionId =
  | 'explore-biomes'
  | 'watch-temperature'
  | 'frost-movement-slow';

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

export type PlazaMechanicsTabDefinition = {
  id: PlazaMechanicsTabId;
  label: string;
};

/** Default tab when the mechanics panel opens. */
export const DEFINING_PLAZA_MECHANICS_DEFAULT_TAB_ID: PlazaMechanicsTabId =
  'combat';

/** Example EV used for combat roll previews in the mechanics guide. */
export const DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_EXAMPLE_EV =
  12 as const;

/** Subtitle copy shown under the mechanics panel title. */
export const DEFINING_PLAZA_MECHANICS_PANEL_SUBTITLE =
  'Combat, status effects, world, and buff badges' as const;

/** Top-level mechanics category tabs. */
export const DEFINING_PLAZA_MECHANICS_TABS: readonly PlazaMechanicsTabDefinition[] =
  [
    { id: 'combat', label: 'Combat' },
    { id: 'status-effects', label: 'Effects' },
    { id: 'world', label: 'World' },
    { id: 'badges', label: 'Badges' },
  ] as const;

/** Intro copy for the Badges tab. */
export const DEFINING_PLAZA_MECHANICS_BADGES_INTRO =
  'Buff and debuff badges appear as small icons below your health bar. Gold borders are buffs; red borders are debuffs. Timed badges show seconds counting down underneath.' as const;

/** Polarity filters for the Badges tab list. */
export const DEFINING_PLAZA_MECHANICS_BUFF_BADGE_FILTERS: readonly {
  id: PlazaMechanicsBuffBadgeFilterId;
  label: string;
}[] = [
  { id: 'all', label: 'All' },
  { id: 'buff', label: 'Buffs' },
  { id: 'debuff', label: 'Debuffs' },
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

/** Damage type explainers for the Damage tab. */
export const DEFINING_PLAZA_MECHANICS_DAMAGE_SECTIONS: readonly PlazaMechanicsSectionDefinition[] =
  [
    {
      id: 'ev-damage',
      title: 'EV Damage',
      description:
        'EV (expected value) is the baseline every rolled hit starts from. The engine rolls around that number using spread (about 20% of EV by default), then maps the result to a tier. Armor and buffs can shift EV, spread, luck, and whether you lean toward blocks or crits. Physical hits and falls use this system. The float text above your avatar is the rolled amount and tier, not the EV itself.',
      icon: 'mdi:dice-multiple',
    },
    {
      id: 'physical',
      title: 'Physical',
      description:
        'Direct hits from combat and tools. Physical damage rolls through the EV engine. Shield points absorb physical damage before health is touched.',
      icon: 'boxicons:sword-filled',
    },
    {
      id: 'fall',
      title: 'Fall',
      description:
        'Damage from landing after a long drop. Fall damage rolls through the EV engine. The farther you fall, the higher the EV.',
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
        'Freezing biomes deal frost damage per second. Cold resistance reduces how quickly the chill wears you down. Below freezing, frost also slows walk and run speed. The colder it gets, the slower you move. At absolute zero you cannot move at all.',
      icon: damageCold.floatIcon ?? 'mdi:snowflake',
    },
    {
      id: 'environmental-lava',
      title: 'Burn (Lava)',
      description:
        'Standing in lava applies burning damage over time. Heat resistance reduces the rate. Leave lava quickly or you will burn out.',
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
        'Some curses and debuffs store pending EV damage that resolves after a delay. The HUD shows how much is still coming. Heal or shield before it lands.',
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
        'The biohazard badge shows remaining poison damage. Toxic, Venomous, and Lethal tiers stack additively. Higher tiers drain faster and hit harder at the end.',
      icon: poisonToxic.floatIcon,
    },
    {
      id: 'temperature',
      title: 'Heat & Frost Exposure',
      description:
        'While standing in extreme heat or cold, a fire or snowflake badge shows damage per second. In freezing air, frost also slows movement down to a stop at absolute zero. Move to a milder biome or wait for resistance to help.',
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
        'The shield-plus badge shows bonus shield points. Shields absorb physical hits first. When the number reaches zero, damage goes straight to health.',
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
        'The amber flash badge tracks pending damage waiting to resolve. The number is how much will hit when the timer expires. Clear it with healing or shields.',
      icon: damagePotential.floatIcon ?? 'mdi:flash',
    },
  ] as const;

/** World explainers for the World tab. */
export const DEFINING_PLAZA_MECHANICS_WORLD_SECTIONS: readonly (PlazaMechanicsSectionDefinition & {
  id: PlazaMechanicsWorldSectionId;
})[] = [
  {
    id: 'explore-biomes',
    title: 'Explore Biomes',
    description:
      'The world is split into regions like plains, forests, deserts, and snowy tundra. Each biome changes the ground, trees, water, music, and weather. Check the minimap label to see where you are.',
    icon: 'mdi:pine-tree',
  },
  {
    id: 'watch-temperature',
    title: 'Watch Temperature',
    description:
      'Your local temperature sits on the minimap next to the clock. Mild weather is safe. Extreme heat or cold deals damage over time. Below freezing, frost slows every character and NPC. Move to shelter or buff up resistance before you scorch or freeze.',
    icon: 'mdi:thermometer',
  },
  {
    id: 'frost-movement-slow',
    title: 'Frost Movement Slow',
    description:
      'Any character or NPC standing in sub-zero temperatures moves slower as the air gets colder. Above 0°C there is no frost slow. At absolute zero (-273°C) movement stops completely. Cold immunity bypasses the slow.',
    icon: 'mdi:snowflake',
  },
] as const;
