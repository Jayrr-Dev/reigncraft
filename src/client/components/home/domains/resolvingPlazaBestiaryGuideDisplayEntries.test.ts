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

  it('marks studied at familiarity and withholds behavior until application', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(['deer']),
      { deer: 1 }
    );
    const deer = entries.find((entry) => entry.speciesId === 'deer');

    expect(deer?.discoveryState).toBe('studied');
    expect(deer?.isStudied).toBe(true);
    expect(deer?.studyTierId).toBe('familiarity');
    expect(deer?.displayName).toBe('Deer');
    expect(deer?.temperamentLabel).toBeNull();
    expect(deer?.diet).toBeNull();
    expect(deer?.combatStats).toBeNull();
    expect(deer?.onHitProcRows).toBeNull();
    expect(deer?.biomeChips).toEqual([]);
  });

  it('unlocks behavior and habitat chips at application', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(['deer']),
      { deer: 20 },
      new Set(['plains'])
    );
    const deer = entries.find((entry) => entry.speciesId === 'deer');

    expect(deer?.studyTierId).toBe('application');
    expect(deer?.temperamentLabel).toBe('Skittish');
    expect(deer?.diet).toBe('Herbivore');
    expect(deer?.biomeChips.length).toBeGreaterThan(0);
    expect(deer?.combatStats).toBeNull();
    expect(deer?.ecologyStats).toBeNull();
  });

  it('unlocks ecology at proficiency before combat', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(['grey-wolf']),
      { 'grey-wolf': 50 }
    );
    const wolf = entries.find((entry) => entry.speciesId === 'grey-wolf');

    expect(wolf?.studyTierId).toBe('proficiency');
    expect(wolf?.ecologyStats).not.toBeNull();
    expect(wolf?.combatStats).toBeNull();
    expect(wolf?.onHitProcRows).toBeNull();
    expect(wolf?.apostleFlavor).toBeNull();
  });

  it('unlocks combat and on-hit procs together at expertise', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(['grey-wolf']),
      { 'grey-wolf': 75 }
    );
    const wolf = entries.find((entry) => entry.speciesId === 'grey-wolf');

    expect(wolf?.studyTierId).toBe('expertise');
    expect(wolf?.combatStats?.attackPower).toBeGreaterThan(0);
    expect(wolf?.onHitProcRows).toEqual([
      expect.objectContaining({
        label: 'Bleeding',
        procChancePercent: 35,
      }),
    ]);
    expect(wolf?.lootStats).toBeNull();
  });

  it('unlocks loot and apostle at mastery', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(['grey-wolf']),
      { 'grey-wolf': 100 }
    );
    const wolf = entries.find((entry) => entry.speciesId === 'grey-wolf');

    expect(wolf?.studyTierId).toBe('mastery');
    expect(wolf?.isFullyStudied).toBe(true);
    expect(wolf?.lootStats).not.toBeNull();
    expect(wolf?.apostleFlavor).not.toBeNull();
  });

  it('shows sighted-only detail before a kill', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(['grey-wolf']),
      {}
    );
    const wolf = entries.find((entry) => entry.speciesId === 'grey-wolf');

    expect(wolf?.discoveryState).toBe('sighted');
    expect(wolf?.isStudied).toBe(false);
    expect(wolf?.studyTierId).toBe('awareness');
    expect(wolf?.temperamentLabel).toBeNull();
    expect(wolf?.apostleFlavor).toBeNull();
  });

  it('masks habitat biome chips until that biome is explored', () => {
    const entries = resolvingPlazaBestiaryGuideDisplayEntries(
      new Set(['grey-wolf']),
      { 'grey-wolf': 20 },
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
