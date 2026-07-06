import {
  DEFINING_WILDLIFE_AI_THINK_INTERVAL_FAR_MS,
  DEFINING_WILDLIFE_AI_THINK_INTERVAL_MID_MS,
  DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS,
  resolvingWildlifeThinkIntervalMs,
} from '@/components/world/wildlife/domains/definingWildlifeAiLodConstants';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeThinkIntervalMs', () => {
  it('uses the near interval close to the player', () => {
    expect(resolvingWildlifeThinkIntervalMs(5)).toBe(
      DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS
    );
  });

  it('uses the mid interval at medium range', () => {
    expect(resolvingWildlifeThinkIntervalMs(15)).toBe(
      DEFINING_WILDLIFE_AI_THINK_INTERVAL_MID_MS
    );
  });

  it('uses the far interval at the outer sim ring', () => {
    expect(resolvingWildlifeThinkIntervalMs(25)).toBe(
      DEFINING_WILDLIFE_AI_THINK_INTERVAL_FAR_MS
    );
  });
});
