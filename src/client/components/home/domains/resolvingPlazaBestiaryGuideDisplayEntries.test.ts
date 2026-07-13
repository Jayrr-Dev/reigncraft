import { describe, expect, it } from 'vitest';

import {
  formattingPlazaBestiaryCodexMenuDescription,
  resolvingPlazaBestiaryGuideDisplayEntries,
} from '@/components/home/domains/resolvingPlazaBestiaryGuideDisplayEntries';

describe('resolvingPlazaBestiaryGuideDisplayEntries', () => {
  it('keeps locked species hidden until sighted', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(new Set(), {});
    const deer = entries.find((entry) => entry.speciesId === 'deer');

    expect(deer?.discoveryState).toBe('locked');
    expect(deer?.displayName).toBe('???');
    expect(deer?.diet).toBeNull();
    expect(deer?.killCount).toBe(0);
  });

  it('reveals studied notes after the first kill', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(['deer']),
      { deer: 1 }
    );
    const deer = entries.find((entry) => entry.speciesId === 'deer');

    expect(deer?.discoveryState).toBe('studied');
    expect(deer?.displayName).toBe('Deer');
    expect(deer?.temperamentLabel).toBe('Skittish');
    expect(deer?.diet).toBe('Herbivore');
    expect(deer?.combatStats).toBeNull();
    expect(deer?.onHitProcRows).toBeNull();
  });

  it('unlocks combat stats at 10 studies but not procs', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(['grey-wolf']),
      { 'grey-wolf': 10 }
    );
    const wolf = entries.find((entry) => entry.speciesId === 'grey-wolf');

    expect(wolf?.studyTierId).toBe('combat');
    expect(wolf?.combatStats?.attackPower).toBeGreaterThan(0);
    expect(wolf?.onHitProcRows).toBeNull();
    expect(wolf?.apostleFlavor).toBeNull();
  });

  it('unlocks on-hit proc rows at 20 studies', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(['grey-wolf']),
      { 'grey-wolf': 20 }
    );
    const wolf = entries.find((entry) => entry.speciesId === 'grey-wolf');

    expect(wolf?.studyTierId).toBe('procs');
    expect(wolf?.onHitProcRows).toEqual([
      expect.objectContaining({
        label: 'Bleeding',
        procChancePercent: 35,
      }),
    ]);
    expect(wolf?.ecologyStats).toBeNull();
  });

  it('shows sighted-only detail before a kill', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(['grey-wolf']),
      {}
    );
    const wolf = entries.find((entry) => entry.speciesId === 'grey-wolf');

    expect(wolf?.discoveryState).toBe('sighted');
    expect(wolf?.isStudied).toBe(false);
    expect(wolf?.temperamentLabel).toBeNull();
    expect(wolf?.apostleFlavor).toBeNull();
  });

  it('masks habitat biome chips until that biome is explored', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(['grey-wolf']),
      {},
      new Set(['forest'])
    );
    const wolf = entries.find((entry) => entry.speciesId === 'grey-wolf');
    const forestChip = wolf?.biomeChips.find((chip) => chip.kind === 'forest');
    const rockyChip = wolf?.biomeChips.find((chip) => chip.kind === 'rocky');

    expect(forestChip).toMatchObject({
      isExplored: true,
      label: 'Forest',
    });
    expect(rockyChip).toMatchObject({
      isExplored: false,
      label: '???',
    });
  });
});

describe('formattingPlazaBestiaryCodexMenuDescription', () => {
  it('formats empty, partial, and complete progress', () => {
    expect(formattingPlazaBestiaryCodexMenuDescription(0, 44)).toBe(
      'No animals sighted yet'
    );
    expect(formattingPlazaBestiaryCodexMenuDescription(2, 44)).toBe(
      '2 of 44 animals sighted'
    );
    expect(formattingPlazaBestiaryCodexMenuDescription(44, 44)).toBe(
      'All 44 animals sighted'
    );
  });
});
