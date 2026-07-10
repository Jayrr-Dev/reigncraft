import {
  DEFINING_WILDLIFE_CONTESTED_GROUND_FOOD_PICKUP_DURATION_MAX_MS,
  DEFINING_WILDLIFE_CONTESTED_GROUND_FOOD_PICKUP_DURATION_MIN_MS,
} from '@/components/world/wildlife/domains/definingWildlifeMealTheftConstants';
import { rollingWildlifeContestedGroundFoodPickupDurationMs } from '@/components/world/wildlife/domains/rollingWildlifeContestedGroundFoodPickupDurationMs';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('rollingWildlifeContestedGroundFoodPickupDurationMs', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the contested minimum at random 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(rollingWildlifeContestedGroundFoodPickupDurationMs()).toBe(
      DEFINING_WILDLIFE_CONTESTED_GROUND_FOOD_PICKUP_DURATION_MIN_MS
    );
  });

  it('returns near the contested maximum at random almost 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999999);
    const durationMs = rollingWildlifeContestedGroundFoodPickupDurationMs();
    expect(durationMs).toBeGreaterThanOrEqual(
      DEFINING_WILDLIFE_CONTESTED_GROUND_FOOD_PICKUP_DURATION_MIN_MS
    );
    expect(durationMs).toBeLessThanOrEqual(
      DEFINING_WILDLIFE_CONTESTED_GROUND_FOOD_PICKUP_DURATION_MAX_MS
    );
  });
});
