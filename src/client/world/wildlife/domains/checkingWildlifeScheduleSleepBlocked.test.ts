import { checkingWildlifeScheduleSleepBlocked } from '@/components/world/wildlife/domains/checkingWildlifeScheduleSleepBlocked';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_POST_AGGRO_SLEEP_BLOCK_MS } from '@/components/world/wildlife/domains/definingWildlifeSleepConstants';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeScheduleSleepBlocked', () => {
  it('blocks while an active combat target is set', () => {
    const instance = creatingWildlifeTestInstance({
      aggroState: {
        ...creatingWildlifeTestInstance().aggroState,
        activeTargetId: 'player-1',
        lastAggroedAtMs: 1_000,
      },
    });

    expect(checkingWildlifeScheduleSleepBlocked(instance, 60_000)).toBe(true);
  });

  it('blocks during the post-aggro cooldown after combat ends', () => {
    const lastAggroedAtMs = 10_000;
    const instance = creatingWildlifeTestInstance({
      aggroState: {
        ...creatingWildlifeTestInstance().aggroState,
        activeTargetId: null,
        lastAggroedAtMs,
      },
    });

    expect(
      checkingWildlifeScheduleSleepBlocked(
        instance,
        lastAggroedAtMs + DEFINING_WILDLIFE_POST_AGGRO_SLEEP_BLOCK_MS - 1
      )
    ).toBe(true);
    expect(
      checkingWildlifeScheduleSleepBlocked(
        instance,
        lastAggroedAtMs + DEFINING_WILDLIFE_POST_AGGRO_SLEEP_BLOCK_MS
      )
    ).toBe(false);
  });
});
