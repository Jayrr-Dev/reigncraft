/**
 * Species → vocal pool and enabled event kinds for farm animal SFX.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesSfxProfileRegistry
 */

import type { DefiningWildlifeSpeciesSfxSizeClass } from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import type { DefiningWildlifeSpeciesSfxPoolId } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';
import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';

/** One species vocal profile row. */
export type DefiningWildlifeSpeciesSfxProfile = {
  poolId: DefiningWildlifeSpeciesSfxPoolId;
  /** Optional second pool (e.g. chicken cluck + rooster crow on idle). */
  secondaryPoolId?: DefiningWildlifeSpeciesSfxPoolId;
  /** When set, secondary pool only fires for these events. */
  secondaryEventKinds?: readonly DefiningWildlifeSpeciesSfxEventKind[];
  sizeClass: DefiningWildlifeSpeciesSfxSizeClass;
  enabledEventKinds: readonly DefiningWildlifeSpeciesSfxEventKind[];
};

const DEFINING_WILDLIFE_SPECIES_SFX_FARM_IDLE_EVENTS = [
  'idle_ambient',
  'idle_eating',
  'wake',
  'friendly',
] as const satisfies readonly DefiningWildlifeSpeciesSfxEventKind[];

const DEFINING_WILDLIFE_SPECIES_SFX_FARM_FLEE_EVENTS = [
  'flee_start',
  'hit_taken',
] as const satisfies readonly DefiningWildlifeSpeciesSfxEventKind[];

const DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_COMBAT_EVENTS = [
  'warn',
  'attack',
  'hit_taken',
  'chase_call',
  'stalk',
] as const satisfies readonly DefiningWildlifeSpeciesSfxEventKind[];

const DEFINING_WILDLIFE_SPECIES_SFX_SKITTISH_PREY_EVENTS = [
  'flee_start',
  'hit_taken',
] as const satisfies readonly DefiningWildlifeSpeciesSfxEventKind[];

/** Wave A + B species wired to Orange Free Sounds pools. */
export const DEFINING_WILDLIFE_SPECIES_SFX_PROFILE_BY_SPECIES_ID: Record<
  string,
  DefiningWildlifeSpeciesSfxProfile
> = {
  cow: {
    poolId: 'cow_moo',
    sizeClass: 'farm',
    enabledEventKinds: [
      ...DEFINING_WILDLIFE_SPECIES_SFX_FARM_IDLE_EVENTS,
      ...DEFINING_WILDLIFE_SPECIES_SFX_FARM_FLEE_EVENTS,
      'warn',
      'attack',
    ],
  },
  sheep: {
    poolId: 'sheep_baa',
    sizeClass: 'farm',
    enabledEventKinds: ['idle_ambient', 'wake', 'flee_start', 'hit_taken'],
  },
  chicken: {
    poolId: 'chicken_cluck',
    secondaryPoolId: 'chicken_crow',
    secondaryEventKinds: ['idle_ambient'],
    sizeClass: 'farm',
    enabledEventKinds: [
      'idle_ambient',
      'wake',
      'flee_start',
      'attack',
      'hit_taken',
    ],
  },
  pig: {
    poolId: 'pig_grunt',
    sizeClass: 'farm',
    enabledEventKinds: [
      ...DEFINING_WILDLIFE_SPECIES_SFX_FARM_IDLE_EVENTS,
      ...DEFINING_WILDLIFE_SPECIES_SFX_FARM_FLEE_EVENTS,
      'warn',
      'attack',
    ],
  },
  'shepherd-dog': {
    poolId: 'dog_bark',
    sizeClass: 'farm',
    enabledEventKinds: ['friendly', 'flee_start', 'hit_taken', 'chase_call'],
  },
  'cat-black': {
    poolId: 'cat_meow',
    sizeClass: 'farm',
    enabledEventKinds: ['friendly', 'wake', 'flee_start', 'hit_taken'],
  },
  'cat-white': {
    poolId: 'cat_meow',
    sizeClass: 'farm',
    enabledEventKinds: ['friendly', 'wake', 'flee_start', 'hit_taken'],
  },
  'cat-large': {
    poolId: 'cat_meow',
    sizeClass: 'farm',
    enabledEventKinds: ['friendly', 'wake', 'flee_start', 'hit_taken'],
  },
  'brown-horse': {
    poolId: 'horse_whinny',
    sizeClass: 'farm',
    enabledEventKinds: ['idle_ambient', 'wake', 'flee_start'],
  },
  'work-horse': {
    poolId: 'horse_whinny',
    sizeClass: 'farm',
    enabledEventKinds: ['idle_ambient', 'wake', 'flee_start'],
  },
  'arabian-horse': {
    poolId: 'horse_whinny',
    sizeClass: 'farm',
    enabledEventKinds: ['idle_ambient', 'wake', 'flee_start'],
  },
  donkey: {
    poolId: 'donkey_bray',
    sizeClass: 'farm',
    enabledEventKinds: ['idle_ambient', 'wake', 'flee_start'],
  },
  llama: {
    poolId: 'goat_bleat',
    sizeClass: 'farm',
    enabledEventKinds: ['idle_ambient', 'warn', 'flee_start', 'hit_taken'],
  },
  alpaca: {
    poolId: 'goat_bleat',
    sizeClass: 'farm',
    enabledEventKinds: ['idle_ambient', 'warn', 'flee_start', 'hit_taken'],
  },
  boar: {
    poolId: 'pig_grunt',
    sizeClass: 'farm',
    enabledEventKinds: [
      'idle_ambient',
      'warn',
      'attack',
      'flee_start',
      'hit_taken',
    ],
  },
  ram: {
    poolId: 'goat_bleat',
    sizeClass: 'farm',
    enabledEventKinds: ['idle_ambient', 'warn', 'attack', 'hit_taken'],
  },
  yak: {
    poolId: 'cow_moo',
    sizeClass: 'farm',
    enabledEventKinds: ['idle_ambient', 'flee_start', 'hit_taken'],
  },
  bison: {
    poolId: 'cow_moo',
    sizeClass: 'farm',
    enabledEventKinds: ['idle_ambient', 'warn', 'flee_start', 'hit_taken'],
  },
  bull: {
    poolId: 'cow_moo',
    sizeClass: 'farm',
    enabledEventKinds: [
      'idle_ambient',
      'warn',
      'attack',
      'flee_start',
      'hit_taken',
    ],
  },
  'water-buffalo': {
    poolId: 'cow_moo',
    sizeClass: 'farm',
    enabledEventKinds: ['idle_ambient', 'warn', 'flee_start', 'hit_taken'],
  },
  'grey-wolf': {
    poolId: 'mixkit_wolf_howl',
    sizeClass: 'predator',
    enabledEventKinds: ['howl', 'warn', 'chase_call', 'attack', 'hit_taken'],
  },
  'brown-bear': {
    poolId: 'bear_growl',
    sizeClass: 'predator',
    enabledEventKinds: [
      ...DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_COMBAT_EVENTS,
    ],
  },
  'polar-bear': {
    poolId: 'bear_growl',
    sizeClass: 'predator',
    enabledEventKinds: [
      ...DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_COMBAT_EVENTS,
    ],
  },
  tiger: {
    poolId: 'tiger_growl',
    sizeClass: 'predator',
    enabledEventKinds: [
      ...DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_COMBAT_EVENTS,
    ],
  },
  jaguar: {
    poolId: 'tiger_growl',
    sizeClass: 'predator',
    enabledEventKinds: [
      ...DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_COMBAT_EVENTS,
    ],
  },
  lion: {
    poolId: 'mixkit_lion_roar',
    sizeClass: 'predator',
    enabledEventKinds: [
      ...DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_COMBAT_EVENTS,
    ],
  },
  lioness: {
    poolId: 'mixkit_lion_roar',
    sizeClass: 'predator',
    enabledEventKinds: [
      ...DEFINING_WILDLIFE_SPECIES_SFX_PREDATOR_COMBAT_EVENTS,
    ],
  },
  elephant: {
    poolId: 'elephant_trumpet',
    sizeClass: 'megafauna',
    enabledEventKinds: ['warn', 'attack', 'hit_taken', 'chase_call'],
  },
  'elephant-female': {
    poolId: 'elephant_trumpet',
    sizeClass: 'megafauna',
    enabledEventKinds: ['warn', 'attack', 'hit_taken', 'chase_call'],
  },
  mammoth: {
    poolId: 'elephant_trumpet',
    sizeClass: 'megafauna',
    enabledEventKinds: ['warn', 'attack', 'hit_taken', 'chase_call'],
  },
  deer: {
    poolId: 'beast_short_bellow',
    sizeClass: 'farm',
    enabledEventKinds: [...DEFINING_WILDLIFE_SPECIES_SFX_SKITTISH_PREY_EVENTS],
  },
  stag: {
    poolId: 'beast_short_bellow',
    sizeClass: 'farm',
    enabledEventKinds: [...DEFINING_WILDLIFE_SPECIES_SFX_SKITTISH_PREY_EVENTS],
  },
  zebra: {
    poolId: 'beast_bellow',
    sizeClass: 'farm',
    enabledEventKinds: [...DEFINING_WILDLIFE_SPECIES_SFX_SKITTISH_PREY_EVENTS],
  },
  antilope: {
    poolId: 'beast_short_bellow',
    sizeClass: 'farm',
    enabledEventKinds: [...DEFINING_WILDLIFE_SPECIES_SFX_SKITTISH_PREY_EVENTS],
  },
  oryx: {
    poolId: 'beast_short_bellow',
    sizeClass: 'farm',
    enabledEventKinds: [...DEFINING_WILDLIFE_SPECIES_SFX_SKITTISH_PREY_EVENTS],
  },
  ostrich: {
    poolId: 'mixkit_bird_screech',
    sizeClass: 'farm',
    enabledEventKinds: [...DEFINING_WILDLIFE_SPECIES_SFX_SKITTISH_PREY_EVENTS],
  },
  camel: {
    poolId: 'beast_grunt',
    secondaryPoolId: 'beast_bellow',
    secondaryEventKinds: ['idle_ambient'],
    sizeClass: 'farm',
    enabledEventKinds: ['idle_ambient', 'flee_start'],
  },
  monkey: {
    poolId: 'mixkit_monkey',
    sizeClass: 'farm',
    enabledEventKinds: ['idle_ambient', 'flee_start', 'hit_taken'],
  },
  chimp: {
    poolId: 'mixkit_monkey',
    sizeClass: 'predator',
    enabledEventKinds: ['warn', 'attack', 'hit_taken', 'flee_start'],
  },
  giraffe: {
    poolId: 'beast_bellow',
    sizeClass: 'megafauna',
    enabledEventKinds: ['warn', 'attack'],
  },
  rhino: {
    poolId: 'beast_snort',
    secondaryPoolId: 'beast_roar',
    secondaryEventKinds: ['attack'],
    sizeClass: 'megafauna',
    enabledEventKinds: ['warn', 'attack'],
  },
  'rhino-female': {
    poolId: 'beast_snort',
    secondaryPoolId: 'beast_roar',
    secondaryEventKinds: ['attack'],
    sizeClass: 'megafauna',
    enabledEventKinds: ['warn', 'attack'],
  },
  hippo: {
    poolId: 'beast_bellow',
    secondaryPoolId: 'beast_growl',
    secondaryEventKinds: ['attack'],
    sizeClass: 'megafauna',
    enabledEventKinds: ['warn', 'attack'],
  },
  hyena: {
    poolId: 'beast_warble',
    secondaryPoolId: 'beast_growl',
    secondaryEventKinds: ['howl', 'chase_call', 'attack'],
    sizeClass: 'predator',
    enabledEventKinds: ['howl', 'chase_call', 'attack', 'hit_taken'],
  },
  crocodile: {
    poolId: 'beast_soft_growl',
    secondaryPoolId: 'beast_croak',
    secondaryEventKinds: ['attack'],
    sizeClass: 'predator',
    enabledEventKinds: ['attack', 'hit_taken'],
  },
};

/** Returns the vocal profile for a species id, or null when unmapped. */
export const resolvingWildlifeSpeciesSfxProfile = (
  speciesId: string
): DefiningWildlifeSpeciesSfxProfile | null =>
  DEFINING_WILDLIFE_SPECIES_SFX_PROFILE_BY_SPECIES_ID[speciesId] ?? null;

/** True when the species has a profile and the event kind is enabled. */
export const checkingWildlifeSpeciesSfxEventEnabled = (
  speciesId: string,
  eventKind: DefiningWildlifeSpeciesSfxEventKind
): boolean => {
  const profile = resolvingWildlifeSpeciesSfxProfile(speciesId);
  if (!profile) {
    return false;
  }
  return profile.enabledEventKinds.includes(eventKind);
};
