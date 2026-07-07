import { checkingWildlifeStalkAttackPhaseExpired } from '@/components/world/wildlife/domains/checkingWildlifeStalkAttackPhaseExpired';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_STALK_ATTACK_KILL_TIMEOUT_MS } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import { resolvingWildlifeStalkPackDamageResponse } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackDamageResponse';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeStalkAttackPhaseExpired', () => {
  it('returns false before the five-second attack window ends', () => {
    expect(
      checkingWildlifeStalkAttackPhaseExpired({
        stalkAttackingPreySinceMs: 1_000,
        nowMs: 1_000 + DEFINING_WILDLIFE_STALK_ATTACK_KILL_TIMEOUT_MS - 1,
      })
    ).toBe(false);
  });

  it('returns true once ten seconds pass without a kill', () => {
    expect(
      checkingWildlifeStalkAttackPhaseExpired({
        stalkAttackingPreySinceMs: 1_000,
        nowMs: 1_000 + DEFINING_WILDLIFE_STALK_ATTACK_KILL_TIMEOUT_MS,
      })
    ).toBe(true);
  });
});

describe('resolvingWildlifeStalkPackDamageResponse', () => {
  it('uses a stable flee-or-enrage roll for the same pack anchor', () => {
    const packmates = [
      creatingWildlifeTestInstance({ instanceId: 'wolf-b' }),
      creatingWildlifeTestInstance({ instanceId: 'wolf-a' }),
    ];

    expect(resolvingWildlifeStalkPackDamageResponse(packmates)).toBe(
      resolvingWildlifeStalkPackDamageResponse(packmates)
    );
  });
});
