import { computingPlazaPathologyTotalStudyPoints } from '@/components/home/domains/computingPlazaPathologyStudyPoints';
import { listingPlazaPathologyDiseaseIdsCausedBySpecies } from '@/components/home/domains/resolvingPlazaPathologyCreatureDiseaseLinks';
import {
  creditingWorldPlazaPathologyFromInfectionHours,
  creditingWorldPlazaPathologyFromWildlifeSpeciesStudy,
  gettingWorldPlazaPathologyInfectionStudyPointsSnapshot,
  gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot,
  gettingWorldPlazaPathologyObtainedDiseasesSnapshot,
  initializingWorldPlazaPathologyDiscoveryStore,
  recordingWorldPlazaPathologyDiseaseObtained,
  resettingWorldPlazaPathologyDiscoveryStoreForTests,
} from '@/components/world/domains/managingWorldPlazaPathologyDiscoveryStore';
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

  it('credits linked creature studies across carrier diseases', () => {
    creditingWorldPlazaPathologyFromWildlifeSpeciesStudy('chicken', 1);
    creditingWorldPlazaPathologyFromWildlifeSpeciesStudy('chicken', 2);

    const linked =
      gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot().salmonellosis ??
      0;
    expect(
      gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot()['cucco-rage'] ??
        0
    ).toBeGreaterThan(0);
    expect(linked).toBe(3);
    expect(computingPlazaPathologyTotalStudyPoints(linked, 0)).toBe(1);
  });

  it('credits infection-hour Pathology points per disease', () => {
    recordingWorldPlazaPathologyDiseaseObtained('salmonellosis');
    creditingWorldPlazaPathologyFromInfectionHours('salmonellosis', 2);
    creditingWorldPlazaPathologyFromInfectionHours('salmonellosis', 3);

    expect(
      gettingWorldPlazaPathologyInfectionStudyPointsSnapshot().salmonellosis
    ).toBe(5);
    expect(
      computingPlazaPathologyTotalStudyPoints(
        0,
        gettingWorldPlazaPathologyInfectionStudyPointsSnapshot()
          .salmonellosis ?? 0
      )
    ).toBe(5);
  });

  it('ignores wildlife species with no disease links', () => {
    const unlinkedSpeciesId = 'pathology-test-species-without-meat';

    expect(
      listingPlazaPathologyDiseaseIdsCausedBySpecies(unlinkedSpeciesId)
    ).toEqual([]);

    creditingWorldPlazaPathologyFromWildlifeSpeciesStudy(unlinkedSpeciesId, 5);

    expect(
      Object.keys(gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot())
    ).toEqual([]);
  });
});
