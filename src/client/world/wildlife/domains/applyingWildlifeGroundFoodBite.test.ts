import { applyingWildlifeGroundFoodBite } from '@/components/world/wildlife/domains/applyingWildlifeGroundFoodBite';
import { formattingWildlifeGroundFlowerItemId } from '@/components/world/wildlife/domains/definingWildlifeGroundFlowerIdConstants';
import { DEFINING_WILDLIFE_GROUND_FLOWER_HUNGER_REFILL_RATIO } from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  clearingWildlifeOptimisticPickedGroundFlowers,
  registeringWildlifeGroundFlowerBridge,
} from '@/components/world/wildlife/domains/managingWildlifeGroundFlowerBridge';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  registeringWildlifeGroundFlowerBridge(null);
  clearingWildlifeOptimisticPickedGroundFlowers();
  vi.restoreAllMocks();
});

describe('applyingWildlifeGroundFoodBite flower path', () => {
  it('consumes a synthetic flower id and refills hunger by the flower ratio', () => {
    const consumeGroundFlower = vi.fn(() => true);
    registeringWildlifeGroundFlowerBridge({ consumeGroundFlower });

    const flowerId = formattingWildlifeGroundFlowerItemId(5, 7);
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;
    const startedAtMs = 1_000;
    const readyAtMs = 6_000;
    const instance = creatingWildlifeTestInstance({
      speciesId: 'deer',
      position: { x: 5.5, y: 7.5, layer: 1 },
      hungerState: {
        hungerRatio: 0.3,
        driveLevel: 'hungry',
        lastFedAtMs: null,
      },
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        pendingGroundFoodBite: {
          groundItemId: flowerId,
          startedAtMs,
          readyAtMs,
        },
      },
    });

    const next = applyingWildlifeGroundFoodBite(
      instance,
      species,
      flowerId,
      readyAtMs
    );

    expect(consumeGroundFlower).toHaveBeenCalledWith(5, 7, instance.position);
    expect(next.hungerState.hungerRatio).toBeCloseTo(
      0.3 + DEFINING_WILDLIFE_GROUND_FLOWER_HUNGER_REFILL_RATIO
    );
    expect(next.aiState.pendingGroundFoodBite).toBeNull();
    expect(next.aiState.motionClip).toBe('attack');
  });

  it('starts a chew timer before consuming the flower', () => {
    const consumeGroundFlower = vi.fn(() => true);
    registeringWildlifeGroundFlowerBridge({ consumeGroundFlower });

    const flowerId = formattingWildlifeGroundFlowerItemId(5, 7);
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;
    const instance = creatingWildlifeTestInstance({
      speciesId: 'deer',
      position: { x: 5.5, y: 7.5, layer: 1 },
      hungerState: {
        hungerRatio: 0.3,
        driveLevel: 'hungry',
        lastFedAtMs: null,
      },
    });

    const chewing = applyingWildlifeGroundFoodBite(
      instance,
      species,
      flowerId,
      1_000
    );

    expect(consumeGroundFlower).not.toHaveBeenCalled();
    expect(chewing.aiState.pendingGroundFoodBite?.groundItemId).toBe(flowerId);
    expect(chewing.aiState.motionClip).toBe('idle');
  });
});
