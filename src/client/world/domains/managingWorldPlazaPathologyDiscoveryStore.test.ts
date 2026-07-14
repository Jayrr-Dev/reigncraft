import {
  creditingWorldPlazaPathologyFromWildlifeSpeciesStudy,
  gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot,
  gettingWorldPlazaPathologyObtainedDiseasesSnapshot,
  initializingWorldPlazaPathologyDiscoveryStore,
  recordingWorldPlazaPathologyDiseaseObtained,
  resettingWorldPlazaPathologyDiscoveryStoreForTests,
} from '@/components/world/domains/managingWorldPlazaPathologyDiscoveryStore';
import { computingPlazaPathologyStudyPoints } from '@/components/home/domains/computingPlazaPathologyStudyPoints';
import { listingPlazaPathologyDiseaseIdsCausedBySpecies } from '@/components/home/domains/resolvingPlazaPathologyCreatureDiseaseLinks';
import { beforeEach, describe, expect, it } from 'vitest';

describe('managingWorldPlazaPathologyDiscoveryStore', () => {
  beforeEach(() => {
    resettingWorldPlazaPathologyDiscoveryStoreForTests();
    initializingWorldPlazaPathologyDiscoveryStore('test-pathology');
  });

  it('records obtained diseases once', () => {
    recordingWorldPlazaPathologyDiseaseObtained('salmonellosis');
    recordingWorldPlazaPathologyDiseaseObtained('salmonellosis');

    expect(gettingWorldPlazaPathologyObtainedDiseasesSnapshot()).toEqual([
      'salmonellosis',
    ]);
  });

  it('credits linked creature studies for diseases the species causes', () => {
    creditingWorldPlazaPathologyFromWildlifeSpeciesStudy('chicken', 1);
    creditingWorldPlazaPathologyFromWildlifeSpeciesStudy('chicken', 2);

    const linked =
      gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot().salmonellosis ??
      0;
    const cuccoLinked =
      gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot()['cucco-rage'] ??
      0;

    expect(linked).toBe(3);
    expect(computingPlazaPathologyStudyPoints(linked)).toBe(1);
    // Aggressive chicken variant disease shares the chicken species id.
    expect(cuccoLinked).toBe(3);
  });

  it('ignores species with no disease links', () => {
    const unlinkedSpeciesId = 'pathology-test-species-without-meat';

    expect(
      listingPlazaPathologyDiseaseIdsCausedBySpecies(unlinkedSpeciesId)
    ).toEqual([]);

    creditingWorldPlazaPathologyFromWildlifeSpeciesStudy(unlinkedSpeciesId, 5);

    expect(
      Object.keys(gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot())
    ).toHaveLength(0);
  });
});
