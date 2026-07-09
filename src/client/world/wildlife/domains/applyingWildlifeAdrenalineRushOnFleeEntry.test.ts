import { applyingWildlifeAdrenalineRushOnFleeEntry } from '@/components/world/wildlife/domains/applyingWildlifeAdrenalineRushOnFleeEntry';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('applyingWildlifeAdrenalineRushOnFleeEntry', () => {
  it('restores grey-wolf stamina to full when entering flee', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'grey-wolf',
      staminaState: {
        staminaRatio: 0.12,
        isExhausted: true,
        runningForSeconds: 4,
      },
    });
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];

    const next = applyingWildlifeAdrenalineRushOnFleeEntry({
      instance,
      species,
      previousIntentMode: 'chase',
      nextIntentMode: 'flee',
    });

    expect(next.staminaState.staminaRatio).toBe(1);
    expect(next.staminaState.isExhausted).toBe(false);
    expect(next.staminaState.runningForSeconds).toBe(4);
  });

  it('restores omega-wolf stamina when entering flee', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'omega-wolf',
      staminaState: {
        staminaRatio: 0.05,
        isExhausted: true,
        runningForSeconds: 0,
      },
    });
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['omega-wolf'];

    const next = applyingWildlifeAdrenalineRushOnFleeEntry({
      instance,
      species,
      previousIntentMode: 'stalk',
      nextIntentMode: 'flee',
    });

    expect(next.staminaState.staminaRatio).toBe(1);
    expect(next.staminaState.isExhausted).toBe(false);
  });

  it('does not re-trigger while already fleeing', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'grey-wolf',
      staminaState: {
        staminaRatio: 0.4,
        isExhausted: false,
        runningForSeconds: 2,
      },
    });
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];

    const next = applyingWildlifeAdrenalineRushOnFleeEntry({
      instance,
      species,
      previousIntentMode: 'flee',
      nextIntentMode: 'flee',
    });

    expect(next).toBe(instance);
  });

  it('leaves species without the trait unchanged', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'deer',
      staminaState: {
        staminaRatio: 0.2,
        isExhausted: true,
        runningForSeconds: 1,
      },
    });
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;

    const next = applyingWildlifeAdrenalineRushOnFleeEntry({
      instance,
      species,
      previousIntentMode: 'wander',
      nextIntentMode: 'flee',
    });

    expect(next).toBe(instance);
  });
});
