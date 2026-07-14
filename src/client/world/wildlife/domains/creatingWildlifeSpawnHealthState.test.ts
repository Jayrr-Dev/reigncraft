import { creatingWildlifeSpawnHealthState } from '@/components/world/wildlife/domains/creatingWildlifeSpawnHealthState';
import {
  DEFINING_WILDLIFE_TURTLE_SHELL_DAMAGE_ROLL_MODIFIER_ID,
  DEFINING_WILDLIFE_TURTLE_SHELL_INCOMING_BLOCK_BIAS,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesPassiveTraitConstants';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('creatingWildlifeSpawnHealthState', () => {
  it('applies turtle shell incoming block bias at spawn', () => {
    const turtle = DEFINING_WILDLIFE_SPECIES_REGISTRY.turtle;
    const healthState = creatingWildlifeSpawnHealthState(30, null, turtle);
    const shellModifier = healthState.damageRollModifiers.find(
      (modifier) =>
        modifier.id === DEFINING_WILDLIFE_TURTLE_SHELL_DAMAGE_ROLL_MODIFIER_ID
    );

    expect(shellModifier).toEqual({
      id: DEFINING_WILDLIFE_TURTLE_SHELL_DAMAGE_ROLL_MODIFIER_ID,
      kind: 'block_bias',
      value: DEFINING_WILDLIFE_TURTLE_SHELL_INCOMING_BLOCK_BIAS,
      expiresAtMs: null,
    });
  });

  it('leaves species without passives on frame-only modifiers', () => {
    const chicken = DEFINING_WILDLIFE_SPECIES_REGISTRY.chicken;
    const healthState = creatingWildlifeSpawnHealthState(15, null, chicken);

    expect(healthState.damageRollModifiers).toEqual([]);
  });

  it('stacks turtle shell with obese frame block bias', () => {
    const turtle = DEFINING_WILDLIFE_SPECIES_REGISTRY.turtle;
    const healthState = creatingWildlifeSpawnHealthState(30, 'obese', turtle);
    const blockBiasModifiers = healthState.damageRollModifiers.filter(
      (modifier) => modifier.kind === 'block_bias'
    );

    expect(blockBiasModifiers).toHaveLength(2);
    expect(
      blockBiasModifiers.some(
        (modifier) =>
          modifier.id === DEFINING_WILDLIFE_TURTLE_SHELL_DAMAGE_ROLL_MODIFIER_ID
      )
    ).toBe(true);
  });

  it('seeds sunhead innate cold weakness and firelands comfort band', () => {
    const sunhead = DEFINING_WILDLIFE_SPECIES_REGISTRY.sunhead;
    const healthState = creatingWildlifeSpawnHealthState(150, null, sunhead);

    expect(healthState.temperatureResistance.coldWeakness).toBe(0.5);
    expect(healthState.temperatureResistance.baseComfortLowCelsius).toBe(22);
    expect(healthState.temperatureResistance.baseComfortHighCelsius).toBe(60);
    expect(healthState.temperatureResistance.isColdImmune).toBe(false);
    expect(healthState.temperatureResistance.isHeatImmune).toBe(true);
  });
});
