import { describe, expect, it } from 'vitest';

import { checkingWorldPlazaBiomeMusicIsAudible } from '@/components/world/domains/checkingWorldPlazaBiomeMusicIsAudible';
import { checkingWorldPlazaBiomeMusicIsPlaying } from '@/components/world/domains/checkingWorldPlazaBiomeMusicIsPlaying';

describe('checkingWorldPlazaBiomeMusicIsAudible', () => {
  it('returns false when every slot is paused or silent', () => {
    const audio = {
      paused: true,
    } as HTMLAudioElement;
    const gainNode = {
      gain: { value: 0 },
    } as GainNode;

    expect(
      checkingWorldPlazaBiomeMusicIsAudible([
        { audio, gainNode, tuneId: 'sheep' },
        { audio, gainNode, tuneId: null },
      ])
    ).toBe(false);
  });

  it('returns true when an active slot is playing above silence', () => {
    const audio = {
      paused: false,
    } as HTMLAudioElement;
    const gainNode = {
      gain: { value: 0.2 },
    } as GainNode;

    expect(
      checkingWorldPlazaBiomeMusicIsAudible([
        { audio, gainNode, tuneId: 'sheep' },
      ])
    ).toBe(true);
  });
});

describe('checkingWorldPlazaBiomeMusicIsPlaying', () => {
  it('returns true when a slot has a tune and is not paused', () => {
    const audio = {
      paused: false,
    } as HTMLAudioElement;

    expect(
      checkingWorldPlazaBiomeMusicIsPlaying([{ audio, tuneId: 'sheep' }])
    ).toBe(true);
  });

  it('returns false when every slot is paused', () => {
    const audio = {
      paused: true,
    } as HTMLAudioElement;

    expect(
      checkingWorldPlazaBiomeMusicIsPlaying([{ audio, tuneId: 'sheep' }])
    ).toBe(false);
  });
});
