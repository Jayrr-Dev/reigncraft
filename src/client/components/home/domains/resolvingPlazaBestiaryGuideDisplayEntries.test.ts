import { describe, expect, it } from 'vitest';

import {
  formattingPlazaBestiaryCodexMenuDescription,
  resolvingPlazaBestiaryGuideDisplayEntries,
} from '@/components/home/domains/resolvingPlazaBestiaryGuideDisplayEntries';

describe('resolvingPlazaBestiaryGuideDisplayEntries', () => {
  it('keeps locked species hidden until sighted', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(),
      new Set()
    );
    const deer = entries.find((entry) => entry.speciesId === 'deer');

    expect(deer?.discoveryState).toBe('locked');
    expect(deer?.displayName).toBe('???');
    expect(deer?.diet).toBeNull();
  });

  it('reveals summary after sighting and full study after a kill', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(['deer']),
      new Set(['deer'])
    );
    const deer = entries.find((entry) => entry.speciesId === 'deer');

    expect(deer?.discoveryState).toBe('studied');
    expect(deer?.displayName).toBe('Deer');
    expect(deer?.summary.length).toBeGreaterThan(0);
    expect(deer?.studiedSummary.length).toBeGreaterThan(0);
    expect(deer?.temperamentLabel).toBe('Skittish');
    expect(deer?.diet).toBe('Herbivore');
    expect(deer?.biomeKinds.length).toBeGreaterThan(0);
  });

  it('shows sighted-only detail before a kill', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(['grey-wolf']),
      new Set()
    );
    const wolf = entries.find((entry) => entry.speciesId === 'grey-wolf');

    expect(wolf?.discoveryState).toBe('sighted');
    expect(wolf?.isStudied).toBe(false);
    expect(wolf?.temperamentLabel).toBeNull();
    expect(wolf?.apostleFlavor).toBeNull();
  });
});

describe('formattingPlazaBestiaryCodexMenuDescription', () => {
  it('formats empty, partial, and complete progress', () => {
    expect(formattingPlazaBestiaryCodexMenuDescription(0, 43)).toBe(
      'No animals sighted yet'
    );
    expect(formattingPlazaBestiaryCodexMenuDescription(2, 43)).toBe(
      '2 of 43 animals sighted'
    );
    expect(formattingPlazaBestiaryCodexMenuDescription(43, 43)).toBe(
      'All 43 animals sighted'
    );
  });
});
