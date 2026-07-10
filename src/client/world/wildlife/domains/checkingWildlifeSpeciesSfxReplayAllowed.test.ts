import { checkingWildlifeSpeciesSfxReplayAllowed } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesSfxReplayAllowed';
import {
  resettingWildlifeSpeciesSfxPlaybackTimestamps,
  stampingWildlifeSpeciesSfxLastPlayedAtMs,
} from '@/components/world/wildlife/domains/managingWildlifeSpeciesSfxPlaybackStore';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeSpeciesSfxReplayAllowed', () => {
  it('allows the first tiger growl for an instance', () => {
    resettingWildlifeSpeciesSfxPlaybackTimestamps();

    expect(
      checkingWildlifeSpeciesSfxReplayAllowed({
        instanceId: 'tiger-1',
        speciesId: 'tiger',
        nowMs: 10_000,
      })
    ).toBe(true);
  });

  it('blocks a second tiger growl inside the replay window', () => {
    resettingWildlifeSpeciesSfxPlaybackTimestamps();
    stampingWildlifeSpeciesSfxLastPlayedAtMs(
      'tiger-1',
      'pixabay_tiger_roar',
      10_000
    );

    expect(
      checkingWildlifeSpeciesSfxReplayAllowed({
        instanceId: 'tiger-1',
        speciesId: 'tiger',
        nowMs: 14_999,
      })
    ).toBe(false);
  });

  it('allows tiger growl again after the replay window', () => {
    resettingWildlifeSpeciesSfxPlaybackTimestamps();
    stampingWildlifeSpeciesSfxLastPlayedAtMs(
      'tiger-1',
      'pixabay_tiger_roar',
      10_000
    );

    expect(
      checkingWildlifeSpeciesSfxReplayAllowed({
        instanceId: 'tiger-1',
        speciesId: 'tiger',
        nowMs: 15_000,
      })
    ).toBe(true);
  });

  it('does not share replay cooldown across instances', () => {
    resettingWildlifeSpeciesSfxPlaybackTimestamps();
    stampingWildlifeSpeciesSfxLastPlayedAtMs(
      'tiger-1',
      'pixabay_tiger_roar',
      10_000
    );

    expect(
      checkingWildlifeSpeciesSfxReplayAllowed({
        instanceId: 'tiger-2',
        speciesId: 'tiger',
        nowMs: 11_000,
      })
    ).toBe(true);
  });
});
