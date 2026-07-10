import { describe, expect, it } from 'vitest';

import { checkingWorldPlazaBiomeMusicIsAudible } from '@/components/world/domains/checkingWorldPlazaBiomeMusicIsAudible';

describe('checkingWorldPlazaBiomeMusicIsAudible', () => {
  it('returns false when every slot is paused or silent', () => {
    const audio = {
      paused: true,
      volume: 0,
    } as HTMLAudioElement;

    expect(
      checkingWorldPlazaBiomeMusicIsAudible([
        { audio, tuneId: 'sheep' },
        { audio, tuneId: null },
      ])
    ).toBe(false);
  });

  it('returns true when an active slot is playing above silence', () => {
    const audio = {
      paused: false,
      volume: 0.2,
    } as HTMLAudioElement;

    expect(
      checkingWorldPlazaBiomeMusicIsAudible([{ audio, tuneId: 'sheep' }])
    ).toBe(true);
  });
});
