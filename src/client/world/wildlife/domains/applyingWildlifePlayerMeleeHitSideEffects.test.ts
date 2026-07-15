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

function buildingTestHandlers() {
  return {
    applyBleed: vi.fn(),
    applyPoison: vi.fn(),
    applyBuff: vi.fn(),
    applyTemperature: vi.fn(),
    applyDisease: vi.fn(),
  };
}

describe('applyingWildlifePlayerMeleeHitSideEffects', () => {
  it('applies disease from a bite when the roll succeeds', () => {
    const handlers = buildingTestHandlers();

    const hit = buildingTestHit({
      speciesId: 'grey-wolf',
      aggressionLevel: 'aggressive',
    });

    applyingWildlifePlayerMeleeHitSideEffects(hit, handlers, () => 0);

    expect(handlers.applyDisease).toHaveBeenCalledWith('wolf-fever');
  });

  it('does not apply disease when the roll fails', () => {
    const handlers = buildingTestHandlers();

    const hit = buildingTestHit({
      speciesId: 'grey-wolf',
      aggressionLevel: 'aggressive',
    });

    applyingWildlifePlayerMeleeHitSideEffects(hit, handlers, () => 0.999);

    expect(handlers.applyDisease).not.toHaveBeenCalled();
  });

  it('never applies disease to friendly disposition', () => {
    const handlers = buildingTestHandlers();

    const hit = buildingTestHit({
      speciesId: 'chicken',
      aggressionLevel: 'tame',
    });

    applyingWildlifePlayerMeleeHitSideEffects(hit, handlers, () => 0);

    expect(handlers.applyDisease).not.toHaveBeenCalled();
  });

  it('does nothing for species without a disease transmission profile', () => {
    const handlers = buildingTestHandlers();

    const hit = buildingTestHit({
      speciesId: 'deer',
      aggressionLevel: 'aggressive',
    });

    applyingWildlifePlayerMeleeHitSideEffects(hit, handlers, () => 0);

    expect(handlers.applyDisease).not.toHaveBeenCalled();
  });

  it('applies temperature impulse when polar-bear procs', () => {
    const handlers = buildingTestHandlers();

    applyingWildlifePlayerMeleeHitSideEffects(
      buildingTestHit({
        speciesId: 'polar-bear',
        damageAmount: 40,
      }),
      handlers,
      () => 0
    );

    expect(handlers.applyTemperature).toHaveBeenCalledWith(-18);
  });
});
