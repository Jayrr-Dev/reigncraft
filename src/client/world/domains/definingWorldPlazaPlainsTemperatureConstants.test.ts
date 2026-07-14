import {
  applyingWorldPlazaPlainsAmbientCelsius,
  DEFINING_WORLD_PLAZA_PLAINS_AMBIENT_MAX_CELSIUS,
} from '@/components/world/domains/definingWorldPlazaPlainsTemperatureConstants';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaPlainsAmbientCelsius', () => {
  it('caps plains ambient at the mild grassland ceiling', () => {
    expect(applyingWorldPlazaPlainsAmbientCelsius(48, 'plains')).toBe(
      DEFINING_WORLD_PLAZA_PLAINS_AMBIENT_MAX_CELSIUS
    );
    expect(applyingWorldPlazaPlainsAmbientCelsius(28, 'plains')).toBe(28);
  });

  it('leaves non-plains biomes unchanged', () => {
    expect(applyingWorldPlazaPlainsAmbientCelsius(48, 'desert')).toBe(48);
    expect(applyingWorldPlazaPlainsAmbientCelsius(48, 'forest')).toBe(48);
  });
});
