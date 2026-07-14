import { resolvingWildlifePetIdleInteractionLabel } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetIdleInteractionLabel';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifePetIdleInteractionLabel', () => {
  it('shows Pet the Dog below Familiar', () => {
    expect(
      resolvingWildlifePetIdleInteractionLabel({
        speciesId: 'shepherd-dog',
        loyalty: 13,
        displayName: null,
      })
    ).toBe('Pet the Dog');
  });

  it('shows Name? at Familiar when unnamed', () => {
    expect(
      resolvingWildlifePetIdleInteractionLabel({
        speciesId: 'shepherd-dog',
        loyalty: 52,
        displayName: null,
      })
    ).toBe('Name?');
  });

  it('shows the custom name once named at Familiar+', () => {
    expect(
      resolvingWildlifePetIdleInteractionLabel({
        speciesId: 'shepherd-dog',
        loyalty: 52,
        displayName: 'Rex',
      })
    ).toBe('Rex');
  });
});
