import { describe, expect, it } from 'vitest';

import {
  DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES,
  DEFINING_WILDLIFE_DISEASE_TRANSMISSION_REGISTRY,
} from '@/components/world/wildlife/domains/definingWildlifeDiseaseTransmissionRegistry';
import type { DefiningWildlifeAggressionLevel } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeDiseaseDisposition,
  resolvingWildlifeDiseaseTransmissionChance,
} from '@/components/world/wildlife/domains/resolvingWildlifeDiseaseTransmissionChance';

describe('resolvingWildlifeDiseaseTransmissionChance', () => {
  it('returns 0 for foodborne transmission', () => {
    expect(
      resolvingWildlifeDiseaseTransmissionChance({
        speciesId: 'chicken',
        temperamentId: 'passive',
        aggressionLevel: 'normal',
        kind: 'foodborne',
      })
    ).toBe(0);
  });

  it('returns 0 for species without a transmission profile', () => {
    expect(
      resolvingWildlifeDiseaseTransmissionChance({
        speciesId: 'deer' as keyof typeof DEFINING_WILDLIFE_DISEASE_TRANSMISSION_REGISTRY,
        temperamentId: 'passive',
        aggressionLevel: 'normal',
        kind: 'bite',
      })
    ).toBe(0);
  });

  it('returns 0 chance for friendly disposition', () => {
    expect(
      resolvingWildlifeDiseaseTransmissionChance({
        speciesId: 'chicken',
        temperamentId: 'docile',
        aggressionLevel: 'tame',
        kind: 'bite',
      })
    ).toBe(0);
  });

  it('uses normal chance for non-aggressive temperament', () => {
    expect(
      resolvingWildlifeDiseaseTransmissionChance({
        speciesId: 'chicken',
        temperamentId: 'passive',
        aggressionLevel: 'normal',
        kind: 'bite',
      })
    ).toBe(DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES.normalChance);
  });

  it('uses aggressive chance for predator temperament', () => {
    expect(
      resolvingWildlifeDiseaseTransmissionChance({
        speciesId: 'crocodile',
        temperamentId: 'predator',
        aggressionLevel: 'normal',
        kind: 'bite',
      })
    ).toBe(
      DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES.aggressiveChance
    );
  });

  it('uses aggressive chance for aggressive spawn regardless of temperament', () => {
    expect(
      resolvingWildlifeDiseaseTransmissionChance({
        speciesId: 'chicken',
        temperamentId: 'passive',
        aggressionLevel: 'aggressive',
        kind: 'bite',
      })
    ).toBe(
      DEFINING_WILDLIFE_DISEASE_TRANSMISSION_DEFAULT_CHANCES.aggressiveChance
    );
  });

  it('returns 0 for contact when the profile omits contact', () => {
    expect(
      resolvingWildlifeDiseaseTransmissionChance({
        speciesId: 'deer' as keyof typeof DEFINING_WILDLIFE_DISEASE_TRANSMISSION_REGISTRY,
        temperamentId: 'passive',
        aggressionLevel: 'normal',
        kind: 'contact',
      })
    ).toBe(0);
  });
});

describe('resolvingWildlifeDiseaseDisposition', () => {
  it.each<[DefiningWildlifeAggressionLevel, 'friendly' | 'normal' | 'aggressive']>([
    ['tame', 'friendly'],
    ['normal', 'normal'],
    ['aggressive', 'aggressive'],
  ])('maps aggression level %s to %s', (aggressionLevel, expected) => {
    expect(
      resolvingWildlifeDiseaseDisposition('skittish', aggressionLevel)
    ).toBe(expected);
  });

  it('treats docile temperament as friendly even on normal spawn', () => {
    expect(resolvingWildlifeDiseaseDisposition('docile', 'normal')).toBe(
      'friendly'
    );
  });

  it('treats predator temperament as aggressive even on normal spawn', () => {
    expect(resolvingWildlifeDiseaseDisposition('predator', 'normal')).toBe(
      'aggressive'
    );
  });
});
