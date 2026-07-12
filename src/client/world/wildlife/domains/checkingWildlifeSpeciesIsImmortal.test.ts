import { applyingWildlifeInstanceHealthDamageWithFloatFeedback } from '@/components/world/wildlife/domains/applyingWildlifeInstanceHealthDamageWithFloatFeedback';
import { checkingWildlifeSpeciesIsImmortal } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsImmortal';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeSpeciesIsImmortal', () => {
  it('marks fairy as immortal via passiveTraitIds', () => {
    const fairy = resolvingWildlifeSpeciesDefinition('fairy');

    expect(fairy).not.toBeNull();
    expect(checkingWildlifeSpeciesIsImmortal(fairy!)).toBe(true);
  });

  it('ignores damage and never dies', () => {
    const fairySpecies = resolvingWildlifeSpeciesDefinition('fairy')!;
    const instance = creatingWildlifeTestInstance({
      instanceId: 'wildlife:fairy:immortal',
      speciesId: 'fairy',
      healthState: {
        ...creatingWildlifeTestInstance().healthState,
        baseMaxHealth: fairySpecies.vitals.baseMaxHealth,
        currentHealth: fairySpecies.vitals.baseMaxHealth,
      },
    });

    const nextInstance = applyingWildlifeInstanceHealthDamageWithFloatFeedback({
      instance,
      rawAmount: 9999,
      kind: 'physical',
      nowMs: 1_000,
    });

    expect(nextInstance.healthState.currentHealth).toBe(
      instance.healthState.currentHealth
    );
    expect(nextInstance.isDead).toBe(false);
    expect(nextInstance.floatingTexts).toHaveLength(0);
    expect(nextInstance.aiState.motionClip).toBe(instance.aiState.motionClip);
  });
});
