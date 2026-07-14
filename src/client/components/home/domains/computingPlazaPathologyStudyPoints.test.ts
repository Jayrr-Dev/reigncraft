import {
  computingPlazaPathologyStudyPoints,
  DEFINING_PLAZA_PATHOLOGY_CREATURE_STUDIES_PER_POINT,
} from '@/components/home/domains/computingPlazaPathologyStudyPoints';
import { describe, expect, it } from 'vitest';

describe('computingPlazaPathologyStudyPoints', () => {
  it('uses 3 creature studies per Pathology point', () => {
    expect(DEFINING_PLAZA_PATHOLOGY_CREATURE_STUDIES_PER_POINT).toBe(3);
  });

  it('floors linked creature studies into Pathology points', () => {
    expect(computingPlazaPathologyStudyPoints(0)).toBe(0);
    expect(computingPlazaPathologyStudyPoints(2)).toBe(0);
    expect(computingPlazaPathologyStudyPoints(3)).toBe(1);
    expect(computingPlazaPathologyStudyPoints(5)).toBe(1);
    expect(computingPlazaPathologyStudyPoints(6)).toBe(2);
    expect(computingPlazaPathologyStudyPoints(75)).toBe(25);
  });

  it('ignores negative and fractional inputs', () => {
    expect(computingPlazaPathologyStudyPoints(-9)).toBe(0);
    expect(computingPlazaPathologyStudyPoints(3.9)).toBe(1);
  });
});
