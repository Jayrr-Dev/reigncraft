import { checkingWildlifeSharesPlayerTransformSpecies } from '@/components/world/wildlife/domains/checkingWildlifeSharesPlayerTransformSpecies';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeSharesPlayerTransformSpecies', () => {
  it('returns false without a player transform species', () => {
    expect(checkingWildlifeSharesPlayerTransformSpecies('husky', null)).toBe(
      false
    );
    expect(
      checkingWildlifeSharesPlayerTransformSpecies('husky', undefined)
    ).toBe(false);
  });

  it('returns true only for the exact matching species', () => {
    expect(checkingWildlifeSharesPlayerTransformSpecies('husky', 'husky')).toBe(
      true
    );
    expect(
      checkingWildlifeSharesPlayerTransformSpecies('grey-wolf', 'husky')
    ).toBe(false);
  });
});
