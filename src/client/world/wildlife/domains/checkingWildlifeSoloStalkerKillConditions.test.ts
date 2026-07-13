import { describe, expect, it } from 'vitest';

import { checkingWildlifeSoloStalkerKillConditions } from '@/components/world/wildlife/domains/checkingWildlifeStalkKillConditions';
import { DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';

describe('checkingWildlifeSoloStalkerKillConditions', () => {
  const base = {
    preyHealthRatio: 1,
    preyStaminaRatio: 1,
    preyStaminaIsDepleted: false,
    preyStillDurationMs: 0,
    hungerDriveLevel: 'sated' as const,
    aggressionLevel: 'normal' as const,
  };

  it('stays closed during the opening shadow even when hungry', () => {
    expect(
      checkingWildlifeSoloStalkerKillConditions({
        ...base,
        stalkingElapsedMs: DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS - 1,
        hungerDriveLevel: 'hungry',
      })
    ).toBe(false);
  });

  it('opens on prey weakness after the opening shadow', () => {
    expect(
      checkingWildlifeSoloStalkerKillConditions({
        ...base,
        stalkingElapsedMs: DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS,
        preyHealthRatio: 0.4,
      })
    ).toBe(true);
  });

  it('opens after the opening shadow when hungry', () => {
    expect(
      checkingWildlifeSoloStalkerKillConditions({
        ...base,
        stalkingElapsedMs: DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS,
        hungerDriveLevel: 'hungry',
      })
    ).toBe(true);
  });

  it('opens after the opening shadow when aggressive', () => {
    expect(
      checkingWildlifeSoloStalkerKillConditions({
        ...base,
        stalkingElapsedMs: DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS,
        aggressionLevel: 'aggressive',
      })
    ).toBe(true);
  });

  it('stays closed for sated normal spawns without weakness', () => {
    expect(
      checkingWildlifeSoloStalkerKillConditions({
        ...base,
        stalkingElapsedMs: DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS + 5_000,
      })
    ).toBe(false);
  });
});
