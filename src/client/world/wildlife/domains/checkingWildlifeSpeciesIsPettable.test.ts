import {
  checkingWildlifeSpeciesIsPettable,
  resolvingWildlifeDocilePetKind,
} from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsPettable';
import {
  resolvingWildlifeDocilePetIdleLabel,
  resolvingWildlifeDocilePettingLabel,
} from '@/components/world/wildlife/domains/resolvingWildlifeDocilePetLabel';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeSpeciesIsPettable', () => {
  it('marks cats and dogs as pettable', () => {
    expect(checkingWildlifeSpeciesIsPettable('cat-black')).toBe(true);
    expect(checkingWildlifeSpeciesIsPettable('husky')).toBe(true);
    expect(checkingWildlifeSpeciesIsPettable('pinguin')).toBe(true);
    expect(checkingWildlifeSpeciesIsPettable('monkey')).toBe(true);
    expect(checkingWildlifeSpeciesIsPettable('fairy')).toBe(false);
    expect(checkingWildlifeSpeciesIsPettable('grey-wolf')).toBe(false);
  });

  it('resolves pet kind and idle labels', () => {
    expect(resolvingWildlifeDocilePetKind('cat-orange')).toBe('cat');
    expect(resolvingWildlifeDocilePetKind('golden-retriever')).toBe('dog');
    expect(resolvingWildlifeDocilePetKind('pinguin')).toBe('pinguin');
    expect(resolvingWildlifeDocilePetKind('monkey')).toBe('monkey');
    expect(resolvingWildlifeDocilePetIdleLabel('cat')).toBe('Pet the Cat');
    expect(resolvingWildlifeDocilePetIdleLabel('dog')).toBe('Pet the Dog');
    expect(resolvingWildlifeDocilePetIdleLabel('pinguin')).toBe(
      'Pet the Pinguin'
    );
    expect(resolvingWildlifeDocilePetIdleLabel('monkey')).toBe(
      'Pet the Monkey'
    );
    expect(resolvingWildlifeDocilePettingLabel()).toBe('Petting....');
  });
});
