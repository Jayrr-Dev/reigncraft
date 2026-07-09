/**
 * Declarative on-hit effects wildlife may proc when a melee swing hits the player.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesOnHitEffectRegistry
 */

import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type { DefiningWorldPlazaEntityPoisonPotency } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** One possible proc from a species melee hit against the player. */
export type DefiningWildlifeSpeciesOnHitEffect =
  | {
      kind: 'bleed';
      severity: DefiningWorldPlazaEntityBleedSeverity;
      /** 0..1 chance to proc on each landed swing. */
      procChance: number;
      /** Multiplier on melee damage for the bleed pool flat component. */
      damageScale?: number;
    }
  | {
      kind: 'poison';
      potency: DefiningWorldPlazaEntityPoisonPotency;
      procChance: number;
      damageScale?: number;
    }
  | {
      kind: 'buff';
      buffId: string;
      procChance: number;
    };

/**
 * Species on-hit profiles keyed to real attack styles: bites, tusks, mauls, and
 * swamp infection. Prey and livestock omit entries.
 */
export const DEFINING_WILDLIFE_SPECIES_ON_HIT_EFFECTS: Partial<
  Record<
    DefiningWildlifeSpeciesId,
    readonly DefiningWildlifeSpeciesOnHitEffect[]
  >
> = {
  boar: [
    {
      kind: 'bleed',
      severity: 'bleeding',
      procChance: 0.4,
      damageScale: 0.3,
    },
  ],
  'grey-wolf': [
    {
      kind: 'bleed',
      severity: 'bleeding',
      procChance: 0.35,
      damageScale: 0.25,
    },
  ],
  'omega-wolf': [
    {
      kind: 'bleed',
      severity: 'hemorrhaging',
      procChance: 0.45,
      damageScale: 0.35,
    },
  ],
  'brown-bear': [
    {
      kind: 'bleed',
      severity: 'hemorrhaging',
      procChance: 0.5,
      damageScale: 0.35,
    },
    {
      kind: 'buff',
      buffId: 'sluggish-debuff',
      procChance: 0.22,
    },
  ],
  lion: [
    {
      kind: 'bleed',
      severity: 'hemorrhaging',
      procChance: 0.45,
      damageScale: 0.35,
    },
    {
      kind: 'buff',
      buffId: 'exhausted-debuff',
      procChance: 0.2,
    },
  ],
  lioness: [
    {
      kind: 'bleed',
      severity: 'bleeding',
      procChance: 0.4,
      damageScale: 0.3,
    },
    {
      kind: 'buff',
      buffId: 'winded-debuff',
      procChance: 0.18,
    },
  ],
  crocodile: [
    {
      kind: 'bleed',
      severity: 'hemorrhaging',
      procChance: 0.55,
      damageScale: 0.4,
    },
    {
      kind: 'poison',
      potency: 'toxic',
      procChance: 0.35,
      damageScale: 0.2,
    },
    {
      kind: 'buff',
      buffId: 'heavy-legs-debuff',
      procChance: 0.3,
    },
  ],
  hyena: [
    {
      kind: 'bleed',
      severity: 'bleeding',
      procChance: 0.35,
      damageScale: 0.25,
    },
  ],
  'polar-bear': [
    {
      kind: 'bleed',
      severity: 'hemorrhaging',
      procChance: 0.5,
      damageScale: 0.35,
    },
    {
      kind: 'buff',
      buffId: 'sluggish-debuff',
      procChance: 0.22,
    },
  ],
  tiger: [
    {
      kind: 'bleed',
      severity: 'hemorrhaging',
      procChance: 0.45,
      damageScale: 0.35,
    },
    {
      kind: 'buff',
      buffId: 'exhausted-debuff',
      procChance: 0.2,
    },
  ],
  jaguar: [
    {
      kind: 'bleed',
      severity: 'hemorrhaging',
      procChance: 0.5,
      damageScale: 0.35,
    },
  ],
  hippo: [
    {
      kind: 'bleed',
      severity: 'hemorrhaging',
      procChance: 0.5,
      damageScale: 0.4,
    },
    {
      kind: 'buff',
      buffId: 'sluggish-debuff',
      procChance: 0.25,
    },
  ],
  elephant: [
    {
      kind: 'buff',
      buffId: 'sluggish-debuff',
      procChance: 0.3,
    },
  ],
  'elephant-female': [
    {
      kind: 'buff',
      buffId: 'sluggish-debuff',
      procChance: 0.25,
    },
  ],
  mammoth: [
    {
      kind: 'buff',
      buffId: 'sluggish-debuff',
      procChance: 0.3,
    },
  ],
  rhino: [
    {
      kind: 'bleed',
      severity: 'bleeding',
      procChance: 0.4,
      damageScale: 0.3,
    },
    {
      kind: 'buff',
      buffId: 'winded-debuff',
      procChance: 0.25,
    },
  ],
  'rhino-female': [
    {
      kind: 'bleed',
      severity: 'bleeding',
      procChance: 0.35,
      damageScale: 0.3,
    },
  ],
  bison: [
    {
      kind: 'buff',
      buffId: 'winded-debuff',
      procChance: 0.22,
    },
  ],
  bull: [
    {
      kind: 'bleed',
      severity: 'bleeding',
      procChance: 0.35,
      damageScale: 0.3,
    },
  ],
};

/** Lists configured on-hit effects for one species. */
export function listingWildlifeSpeciesOnHitEffects(
  speciesId: DefiningWildlifeSpeciesId
): readonly DefiningWildlifeSpeciesOnHitEffect[] {
  return DEFINING_WILDLIFE_SPECIES_ON_HIT_EFFECTS[speciesId] ?? [];
}
