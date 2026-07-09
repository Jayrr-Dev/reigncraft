import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import {
  checkingWildlifeStalkPackHasCommittedRoll,
  resolvingWildlifeStalkPackCommittedRoll,
} from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackCommittedRoll';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeStalkPackCommittedRoll', () => {
  it('returns flee when any packmate is fleeing', () => {
    const packmates = [
      creatingWildlifeTestInstance({
        aggroState: {
          ...creatingWildlifeTestInstance().aggroState,
          stalkPhase: 'shadowing',
        },
      }),
      creatingWildlifeTestInstance({
        instanceId: 'wildlife:4:7:1',
        aggroState: {
          ...creatingWildlifeTestInstance().aggroState,
          stalkPhase: 'fleeing',
        },
      }),
    ];

    expect(resolvingWildlifeStalkPackCommittedRoll(packmates)).toBe('flee');
    expect(checkingWildlifeStalkPackHasCommittedRoll(packmates)).toBe(true);
  });

  it('returns regroup when any packmate is regrouping', () => {
    const packmates = [
      creatingWildlifeTestInstance({
        aggroState: {
          ...creatingWildlifeTestInstance().aggroState,
          stalkPhase: 'regrouping',
        },
      }),
    ];

    expect(resolvingWildlifeStalkPackCommittedRoll(packmates)).toBe('regroup');
  });

  it('returns enrage when any packmate is attacking', () => {
    const packmates = [
      creatingWildlifeTestInstance({
        aggroState: {
          ...creatingWildlifeTestInstance().aggroState,
          stalkPhase: 'attacking',
        },
      }),
    ];

    expect(resolvingWildlifeStalkPackCommittedRoll(packmates)).toBe('enrage');
  });

  it('returns null when the pack is still shadowing', () => {
    const packmates = [
      creatingWildlifeTestInstance({
        aggroState: {
          ...creatingWildlifeTestInstance().aggroState,
          stalkPhase: 'shadowing',
        },
      }),
    ];

    expect(resolvingWildlifeStalkPackCommittedRoll(packmates)).toBeNull();
    expect(checkingWildlifeStalkPackHasCommittedRoll(packmates)).toBe(false);
  });
});
