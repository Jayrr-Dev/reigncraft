import { describe, expect, it, vi } from 'vitest';

import { applyingWildlifePlayerMeleeHitSideEffects } from '@/components/world/wildlife/domains/applyingWildlifePlayerMeleeHitSideEffects';
import type { DefiningWildlifePlayerMeleeHit } from '@/components/world/wildlife/domains/definingWildlifeTypes';

function buildingTestHit(
  overrides: Partial<DefiningWildlifePlayerMeleeHit> = {}
): DefiningWildlifePlayerMeleeHit {
  return {
    instanceId: 'wildlife:wolf:1',
    speciesId: 'grey-wolf',
    damageAmount: 30,
    aggressionLevel: 'normal',
    ...overrides,
  };
}

describe('applyingWildlifePlayerMeleeHitSideEffects', () => {
  it('applies disease from a bite when the roll succeeds', () => {
    const handlers = {
      applyBleed: vi.fn(),
      applyPoison: vi.fn(),
      applyBuff: vi.fn(),
      applyDisease: vi.fn(),
    };

    const hit = buildingTestHit({
      speciesId: 'grey-wolf',
      aggressionLevel: 'aggressive',
    });

    applyingWildlifePlayerMeleeHitSideEffects(hit, handlers, () => 0);

    expect(handlers.applyDisease).toHaveBeenCalledWith('wolf-fever');
  });

  it('does not apply disease when the roll fails', () => {
    const handlers = {
      applyBleed: vi.fn(),
      applyPoison: vi.fn(),
      applyBuff: vi.fn(),
      applyDisease: vi.fn(),
    };

    const hit = buildingTestHit({
      speciesId: 'grey-wolf',
      aggressionLevel: 'aggressive',
    });

    applyingWildlifePlayerMeleeHitSideEffects(hit, handlers, () => 0.999);

    expect(handlers.applyDisease).not.toHaveBeenCalled();
  });

  it('never applies disease to friendly disposition', () => {
    const handlers = {
      applyBleed: vi.fn(),
      applyPoison: vi.fn(),
      applyBuff: vi.fn(),
      applyDisease: vi.fn(),
    };

    const hit = buildingTestHit({
      speciesId: 'chicken',
      aggressionLevel: 'tame',
    });

    applyingWildlifePlayerMeleeHitSideEffects(hit, handlers, () => 0);

    expect(handlers.applyDisease).not.toHaveBeenCalled();
  });

  it('does nothing for species without a disease transmission profile', () => {
    const handlers = {
      applyBleed: vi.fn(),
      applyPoison: vi.fn(),
      applyBuff: vi.fn(),
      applyDisease: vi.fn(),
    };

    const hit = buildingTestHit({
      speciesId: 'deer',
      aggressionLevel: 'aggressive',
    });

    applyingWildlifePlayerMeleeHitSideEffects(hit, handlers, () => 0);

    expect(handlers.applyDisease).not.toHaveBeenCalled();
  });
});
