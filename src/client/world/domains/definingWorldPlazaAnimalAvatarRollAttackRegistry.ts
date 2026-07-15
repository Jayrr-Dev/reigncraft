/**
 * Declarative roll / leap attack archetypes and per-species overrides.
 *
 * @module components/world/domains/definingWorldPlazaAnimalAvatarRollAttackRegistry
 */

import {
  DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_DEFAULT_PROFILE,
  type DefiningWorldPlazaAnimalAvatarRollAttackArchetypeId,
  type DefiningWorldPlazaAnimalAvatarRollAttackProfile,
} from '@/components/world/domains/definingWorldPlazaAnimalAvatarRollAttackConstants';
import type { DefiningWildlifeSpeciesOnHitEffect } from '@/components/world/wildlife/domains/definingWildlifeSpeciesOnHitEffectRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

const KICK_WIND: readonly DefiningWildlifeSpeciesOnHitEffect[] = [
  {
    kind: 'buff',
    buffId: 'winded-debuff',
    procChance: 0.28,
  },
];

const TRAMPLE_SLOW: readonly DefiningWildlifeSpeciesOnHitEffect[] = [
  {
    kind: 'buff',
    buffId: 'sluggish-debuff',
    procChance: 0.3,
  },
];

const SHELL_BASH: readonly DefiningWildlifeSpeciesOnHitEffect[] = [
  {
    kind: 'buff',
    buffId: 'sluggish-debuff',
    procChance: 0.35,
  },
];

/** Shared feel per locomotion bucket. */
export const DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_ARCHETYPE_PROFILES: Readonly<
  Record<
    DefiningWorldPlazaAnimalAvatarRollAttackArchetypeId,
    DefiningWorldPlazaAnimalAvatarRollAttackProfile
  >
> = {
  prey: {
    ...DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_DEFAULT_PROFILE,
    archetypeId: 'prey',
  },
  pouncer: {
    archetypeId: 'pouncer',
    dealsContactDamage: true,
    damageMultiplier: 1.5,
    staminaCostMultiplier: 1.45,
    // Long leap; strip plays a bit faster so it feels snappy.
    forwardGridDistance: 3.75,
    durationScale: 0.82,
    extraOnHitEffects: [],
  },
  canine: {
    archetypeId: 'canine',
    dealsContactDamage: true,
    damageMultiplier: 1.5,
    staminaCostMultiplier: 1.3,
    forwardGridDistance: 3.15,
    durationScale: 0.9,
    extraOnHitEffects: [],
  },
  bruiser: {
    archetypeId: 'bruiser',
    dealsContactDamage: true,
    damageMultiplier: 1.75,
    staminaCostMultiplier: 1.65,
    forwardGridDistance: 2.35,
    durationScale: 1.12,
    extraOnHitEffects: [],
  },
  charger: {
    archetypeId: 'charger',
    dealsContactDamage: true,
    damageMultiplier: 1.65,
    staminaCostMultiplier: 1.5,
    forwardGridDistance: 3.85,
    durationScale: 0.92,
    extraOnHitEffects: [],
  },
  slider: {
    archetypeId: 'slider',
    dealsContactDamage: true,
    damageMultiplier: 1.4,
    staminaCostMultiplier: 1.15,
    forwardGridDistance: 4.25,
    durationScale: 1,
    extraOnHitEffects: [],
  },
  tank: {
    archetypeId: 'tank',
    dealsContactDamage: true,
    damageMultiplier: 1.85,
    staminaCostMultiplier: 1.8,
    forwardGridDistance: 1.85,
    durationScale: 1.2,
    extraOnHitEffects: [],
  },
  frostCaster: {
    archetypeId: 'frostCaster',
    // Cyroborn R already fires ice bolt; body contact stays non-damaging.
    dealsContactDamage: false,
    damageMultiplier: 1.5,
    staminaCostMultiplier: 1.4,
    forwardGridDistance: 2.5,
    durationScale: 1,
    extraOnHitEffects: [],
  },
};

/**
 * Species → archetype. Unlisted playable animals fall back to `prey`.
 */
export const DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_ARCHETYPE_BY_SPECIES: Partial<
  Record<
    DefiningWildlifeSpeciesId,
    DefiningWorldPlazaAnimalAvatarRollAttackArchetypeId
  >
> = {
  // Pouncers
  'cat-black': 'pouncer',
  'cat-white': 'pouncer',
  'cat-orange': 'pouncer',
  'cat-large': 'pouncer',
  lion: 'pouncer',
  lioness: 'pouncer',
  tiger: 'pouncer',
  jaguar: 'pouncer',

  // Canines / hyena
  'grey-wolf': 'canine',
  'omega-wolf': 'canine',
  husky: 'canine',
  'golden-retriever': 'canine',
  'shepherd-dog': 'canine',
  hyena: 'canine',

  // Bruisers
  'brown-bear': 'bruiser',
  grizzly: 'bruiser',
  'polar-bear': 'bruiser',
  crocodile: 'bruiser',
  hippo: 'bruiser',
  sunhead: 'bruiser',

  // Chargers / rams
  boar: 'charger',
  rhino: 'charger',
  'rhino-female': 'charger',
  bison: 'charger',
  bull: 'charger',
  ram: 'charger',
  stag: 'charger',
  'water-buffalo': 'charger',

  // Belly slide
  pinguin: 'slider',

  // Heavy / shell
  tortoise: 'tank',
  turtle: 'tank',
  elephant: 'tank',
  'elephant-female': 'tank',
  mammoth: 'tank',

  // Ranged frost form
  cyroborn: 'frostCaster',
};

/**
 * Prey / livestock kick-and-trampling procs (species with no shared on-hit table).
 */
export const DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_EXTRA_ON_HIT_BY_SPECIES: Partial<
  Record<DefiningWildlifeSpeciesId, readonly DefiningWildlifeSpeciesOnHitEffect[]>
> = {
  deer: KICK_WIND,
  stag: KICK_WIND,
  antilope: KICK_WIND,
  oryx: KICK_WIND,
  ram: KICK_WIND,
  'arabian-horse': KICK_WIND,
  'brown-horse': KICK_WIND,
  'work-horse': KICK_WIND,
  zebra: KICK_WIND,
  donkey: KICK_WIND,
  cow: TRAMPLE_SLOW,
  'cow-brown': TRAMPLE_SLOW,
  yak: TRAMPLE_SLOW,
  'water-buffalo': TRAMPLE_SLOW,
  bison: TRAMPLE_SLOW,
  elephant: TRAMPLE_SLOW,
  'elephant-female': TRAMPLE_SLOW,
  mammoth: TRAMPLE_SLOW,
  tortoise: SHELL_BASH,
  turtle: SHELL_BASH,
};

/**
 * Optional per-species field overrides on top of the archetype profile.
 */
export const DEFINING_WORLD_PLAZA_ANIMAL_AVATAR_ROLL_ATTACK_SPECIES_OVERRIDES: Partial<
  Record<
    DefiningWildlifeSpeciesId,
    Partial<
      Omit<DefiningWorldPlazaAnimalAvatarRollAttackProfile, 'archetypeId' | 'extraOnHitEffects'>
    >
  >
> = {
  // Omega wolf hits a bit harder on the leap.
  'omega-wolf': { damageMultiplier: 1.65 },
  // Croc lunge is short and nasty.
  crocodile: { forwardGridDistance: 2.1, damageMultiplier: 1.85 },
  // Penguin slide covers ground cheaply.
  pinguin: { staminaCostMultiplier: 1.05 },
};
