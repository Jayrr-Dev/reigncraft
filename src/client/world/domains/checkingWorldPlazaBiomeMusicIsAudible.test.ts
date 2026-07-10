import { describe, expect, it } from 'vitest';

import { checkingWorldPlazaBiomeMusicIsAudible } from '@/components/world/domains/checkingWorldPlazaBiomeMusicIsAudible';
import { checkingWorldPlazaBiomeMusicIsPlaying } from '@/components/world/domains/checkingWorldPlazaBiomeMusicIsPlaying';

describe('checkingWorldPlazaBiomeMusicIsAudible', () => {
  it('returns false when every slot is paused or silent', () => {
    const gainNode = {
      gain: { value: 0 },
    } as GainNode;

    expect(
      checkingWorldPlazaBiomeMusicIsAudible([
        { gainNode, tuneId: 'sheep', isPlaying: false },
        { gainNode, tuneId: null, isPlaying: false },
      ])
    ).toBe(false);
  });

  it('returns true when an active slot is playing above silence', () => {
    const gainNode = {
      gain: { value: 0.2 },
    } as GainNode;

    expect(
      checkingWorldPlazaBiomeMusicIsAudible([
        { gainNode, tuneId: 'sheep', isPlaying: true },
      ])
    ).toBe(true);
  });
});

describe('checkingWorldPlazaBiomeMusicIsPlaying', () => {
  it('returns true when a slot has a tune and is playing', () => {
    const gainNode = {
      gain: { value: 0.2 },
    } as GainNode;

    expect(
      checkingWorldPlazaBiomeMusicIsPlaying([
        { gainNode, tuneId: 'sheep', isPlaying: true },
      ])
    ).toBe(true);
  });

  it('returns false when every slot is stopped', () => {
    const gainNode = {
      gain: { value: 0.2 },
    } as GainNode;

    expect(
      checkingWorldPlazaBiomeMusicIsPlaying([
        { gainNode, tuneId: 'sheep', isPlaying: false },
      ])
    ).toBe(false);
  });
});
