import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeSpeciesSpritePresentation } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSpritePresentation';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeSpeciesSpritePresentation', () => {
  it('uses the measured 74px cow sheet frame height', () => {
    expect(
      resolvingWildlifeSpeciesSpritePresentation(
        DEFINING_WILDLIFE_SPECIES_REGISTRY.cow
      )
    ).toEqual({
      anchorYNormalized: 0.72,
      footYNormalized: 0.88,
      frameHeightPx: 74,
    });
  });

  it('lowers the chicken anchor to its painted foot line', () => {
    expect(
      resolvingWildlifeSpeciesSpritePresentation(
        DEFINING_WILDLIFE_SPECIES_REGISTRY.chicken
      )
    ).toEqual({
      anchorYNormalized: 0.65,
      footYNormalized: 0.65,
      frameHeightPx: 64,
    });
  });

  it('uses 96px frames for Omega Wolf so the ground shadow sits under the feet', () => {
    expect(
      resolvingWildlifeSpeciesSpritePresentation(
        DEFINING_WILDLIFE_SPECIES_REGISTRY['omega-wolf']
      )
    ).toEqual({
      anchorYNormalized: 0.72,
      footYNormalized: 0.88,
      frameHeightPx: 96,
    });
  });

  it('uses 64px frames for Grey Wolf sheets', () => {
    expect(
      resolvingWildlifeSpeciesSpritePresentation(
        DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf']
      )
    ).toEqual({
      anchorYNormalized: 0.72,
      footYNormalized: 0.88,
      frameHeightPx: 64,
    });
  });

  it('uses 128px frames for elephant sheets', () => {
    expect(
      resolvingWildlifeSpeciesSpritePresentation(
        DEFINING_WILDLIFE_SPECIES_REGISTRY.elephant
      ).frameHeightPx
    ).toBe(128);
  });
});
