import { describe, expect, it } from 'vitest';

import { mergingPlazaSinglePlayerSaveBestiaryDiscovery } from '@/components/home/domains/mergingPlazaSinglePlayerSaveBestiaryDiscovery';

describe('mergingPlazaSinglePlayerSaveBestiaryDiscovery', () => {
  it('unions sighted species and keeps the higher study count', () => {
    const merged = mergingPlazaSinglePlayerSaveBestiaryDiscovery(
      {
        sightedSpeciesIds: new Set(['deer', 'boar']),
        studyCountsBySpeciesId: new Map([
          ['deer', 5],
          ['boar', 2],
        ]),
      },
      {
        sightedSpeciesIds: new Set(['boar', 'rabbit']),
        studyCountsBySpeciesId: new Map([
          ['deer', 3],
          ['boar', 10],
          ['rabbit', 1],
        ]),
      }
    );

    expect([...merged.sightedSpeciesIds].sort()).toEqual([
      'boar',
      'deer',
      'rabbit',
    ]);
    expect(merged.studyCountsBySpeciesId.get('deer')).toBe(5);
    expect(merged.studyCountsBySpeciesId.get('boar')).toBe(10);
    expect(merged.studyCountsBySpeciesId.get('rabbit')).toBe(1);
  });

  it('does not let a sighted-only remote wipe local study counts', () => {
    const merged = mergingPlazaSinglePlayerSaveBestiaryDiscovery(
      {
        sightedSpeciesIds: new Set(['boar']),
        studyCountsBySpeciesId: new Map([['boar', 12]]),
      },
      {
        sightedSpeciesIds: new Set(['boar', 'deer']),
        studyCountsBySpeciesId: new Map(),
      }
    );

    expect([...merged.sightedSpeciesIds].sort()).toEqual(['boar', 'deer']);
    expect(merged.studyCountsBySpeciesId.get('boar')).toBe(12);
  });
});
