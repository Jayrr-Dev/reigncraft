import {
  checkingWildlifeStalkConfidentAssaultReady,
  checkingWildlifeStalkPackIsConfident,
  resolvingWildlifeStalkConfidentFormationDurationMs,
} from '@/components/world/wildlife/domains/checkingWildlifeStalkConfidentPack';
import {
  DEFINING_WILDLIFE_STALK_CONFIDENT_FORMATION_MIN_MS,
  DEFINING_WILDLIFE_STALK_CONFIDENT_FORMATION_SPAN_MS,
  DEFINING_WILDLIFE_STALK_CONFIDENT_PACK_MIN_COUNT,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeStalkPackIsConfident', () => {
  it('needs five or more hunters on one prey', () => {
    expect(
      checkingWildlifeStalkPackIsConfident(
        DEFINING_WILDLIFE_STALK_CONFIDENT_PACK_MIN_COUNT - 1
      )
    ).toBe(false);
    expect(
      checkingWildlifeStalkPackIsConfident(
        DEFINING_WILDLIFE_STALK_CONFIDENT_PACK_MIN_COUNT
      )
    ).toBe(true);
  });
});

describe('resolvingWildlifeStalkConfidentFormationDurationMs', () => {
  it('rolls a 10-15 second window deterministically per prey', () => {
    const duration =
      resolvingWildlifeStalkConfidentFormationDurationMs('player-1');

    expect(duration).toBeGreaterThanOrEqual(
      DEFINING_WILDLIFE_STALK_CONFIDENT_FORMATION_MIN_MS
    );
    expect(duration).toBeLessThanOrEqual(
      DEFINING_WILDLIFE_STALK_CONFIDENT_FORMATION_MIN_MS +
        DEFINING_WILDLIFE_STALK_CONFIDENT_FORMATION_SPAN_MS
    );
    expect(duration).toBe(
      resolvingWildlifeStalkConfidentFormationDurationMs('player-1')
    );
  });
});

describe('checkingWildlifeStalkConfidentAssaultReady', () => {
  it('holds during the formation phase and fires after it', () => {
    const startedAtMs = 50_000;
    const duration =
      resolvingWildlifeStalkConfidentFormationDurationMs('player-1');

    expect(
      checkingWildlifeStalkConfidentAssaultReady({
        stalkConfidentSinceMs: startedAtMs,
        preyTargetId: 'player-1',
        nowMs: startedAtMs + duration - 1,
      })
    ).toBe(false);
    expect(
      checkingWildlifeStalkConfidentAssaultReady({
        stalkConfidentSinceMs: startedAtMs,
        preyTargetId: 'player-1',
        nowMs: startedAtMs + duration,
      })
    ).toBe(true);
  });

  it('never fires without a confidence timestamp', () => {
    expect(
      checkingWildlifeStalkConfidentAssaultReady({
        stalkConfidentSinceMs: null,
        preyTargetId: 'player-1',
        nowMs: 999_999,
      })
    ).toBe(false);
  });
});
