import {
  checkingWorldPlazaEntityTimestampLooksLikeWallClock,
  computingWorldPlazaEntityEffectRemainingSeconds,
  resolvingWorldPlazaEntityEffectCountdownNowMs,
} from '@/components/world/health/domains/resolvingWorldPlazaEntityEffectCountdownNowMs';
import { describe, expect, it, vi } from 'vitest';

describe('resolvingWorldPlazaEntityEffectCountdownNowMs', () => {
  it('uses simulation now for performance-stamped expiries', () => {
    expect(resolvingWorldPlazaEntityEffectCountdownNowMs(12_000, 10_000)).toBe(
      10_000
    );
  });

  it('uses wall clock for Date.now-stamped expiries', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_783_577_000_000);

    expect(
      resolvingWorldPlazaEntityEffectCountdownNowMs(1_783_577_035_000, 12_345)
    ).toBe(1_783_577_000_000);
  });

  it('detects wall-clock timestamps', () => {
    expect(checkingWorldPlazaEntityTimestampLooksLikeWallClock(1e12)).toBe(
      true
    );
    expect(checkingWorldPlazaEntityTimestampLooksLikeWallClock(60_000)).toBe(
      false
    );
  });
});

describe('computingWorldPlazaEntityEffectRemainingSeconds', () => {
  it('returns short remaining seconds for simulation clocks', () => {
    expect(computingWorldPlazaEntityEffectRemainingSeconds(6_500, 1_000)).toBe(
      6
    );
  });

  it('returns short remaining seconds when expiry was stamped with Date.now', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_783_577_779_000);

    expect(
      computingWorldPlazaEntityEffectRemainingSeconds(1_783_577_814_000, 45_000)
    ).toBe(35);
  });
});
