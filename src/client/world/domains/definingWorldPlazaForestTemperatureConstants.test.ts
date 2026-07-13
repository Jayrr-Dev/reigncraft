import {
  applyingWorldPlazaForestCanopyAmbientCelsius,
  DEFINING_WORLD_PLAZA_FLOWER_FOREST_AMBIENT_MAX_CELSIUS,
  DEFINING_WORLD_PLAZA_FOREST_AMBIENT_MAX_CELSIUS,
  DEFINING_WORLD_PLAZA_JUNGLE_AMBIENT_MAX_CELSIUS,
} from '@/components/world/domains/definingWorldPlazaForestTemperatureConstants';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaForestCanopyAmbientCelsius', () => {
  it('caps closed forest ambient at the temperate ceiling', () => {
    expect(applyingWorldPlazaForestCanopyAmbientCelsius(34, 'forest')).toBe(
      DEFINING_WORLD_PLAZA_FOREST_AMBIENT_MAX_CELSIUS
    );
    expect(applyingWorldPlazaForestCanopyAmbientCelsius(20, 'forest')).toBe(20);
  });

  it('caps flower forest ambient at a milder temperate ceiling', () => {
    expect(
      applyingWorldPlazaForestCanopyAmbientCelsius(40, 'flower_forest')
    ).toBe(DEFINING_WORLD_PLAZA_FLOWER_FOREST_AMBIENT_MAX_CELSIUS);
    expect(
      applyingWorldPlazaForestCanopyAmbientCelsius(22, 'flower_forest')
    ).toBe(22);
  });

  it('caps jungle ambient at the warm-temperate ceiling', () => {
    expect(applyingWorldPlazaForestCanopyAmbientCelsius(48, 'jungle')).toBe(
      DEFINING_WORLD_PLAZA_JUNGLE_AMBIENT_MAX_CELSIUS
    );
    expect(applyingWorldPlazaForestCanopyAmbientCelsius(26, 'jungle')).toBe(26);
  });

  it('leaves non-woodland biomes unchanged', () => {
    expect(applyingWorldPlazaForestCanopyAmbientCelsius(34, 'plains')).toBe(34);
    expect(applyingWorldPlazaForestCanopyAmbientCelsius(34, 'desert')).toBe(34);
  });
});
