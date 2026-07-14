import { computingWorldPlazaInGameHoursToRealMs } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import { applyingWildlifeDocilePetComplete } from '@/components/world/wildlife/domains/applyingWildlifeDocilePetComplete';
import {
  checkingWildlifeDocilePetIsReady,
  rollingWildlifeDocilePetCooldownDurationMs,
} from '@/components/world/wildlife/domains/checkingWildlifeDocilePetIsReady';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import {
  DEFINING_WILDLIFE_DOCILE_PET_COOLDOWN_MAX_IN_GAME_HOURS,
  DEFINING_WILDLIFE_DOCILE_PET_COOLDOWN_MIN_IN_GAME_HOURS,
} from '@/components/world/wildlife/domains/definingWildlifeDocilePetConstants';
import { describe, expect, it } from 'vitest';

describe('wildlife docile pet cooldown', () => {
  it('treats null cooldown as ready', () => {
    expect(
      checkingWildlifeDocilePetIsReady(
        creatingWildlifeTestInstance({ petCooldownUntilMs: null }),
        1_000
      )
    ).toBe(true);
  });

  it('blocks petting until the cooldown expires', () => {
    const instance = creatingWildlifeTestInstance({
      petCooldownUntilMs: 5_000,
    });

    expect(checkingWildlifeDocilePetIsReady(instance, 4_999)).toBe(false);
    expect(checkingWildlifeDocilePetIsReady(instance, 5_000)).toBe(true);
  });

  it('rolls cooldown duration across the 8–16 in-game-hour band', () => {
    expect(rollingWildlifeDocilePetCooldownDurationMs(0)).toBe(
      computingWorldPlazaInGameHoursToRealMs(
        DEFINING_WILDLIFE_DOCILE_PET_COOLDOWN_MIN_IN_GAME_HOURS
      )
    );
    expect(rollingWildlifeDocilePetCooldownDurationMs(1)).toBe(
      computingWorldPlazaInGameHoursToRealMs(
        DEFINING_WILDLIFE_DOCILE_PET_COOLDOWN_MAX_IN_GAME_HOURS
      )
    );
  });

  it('stamps petCooldownUntilMs on pet complete', () => {
    const nowMs = 10_000;
    const { instance: next, becamePersistent } = applyingWildlifeDocilePetComplete({
      instance: creatingWildlifeTestInstance({
        speciesId: 'cat-orange',
      }),
      studyPoints: 1,
      nowMs,
      cooldownRollUnit: 0,
    });

    expect(next.petCooldownUntilMs).toBe(
      nowMs +
        computingWorldPlazaInGameHoursToRealMs(
          DEFINING_WILDLIFE_DOCILE_PET_COOLDOWN_MIN_IN_GAME_HOURS
        )
    );
    expect(next.floatingTexts.length).toBeGreaterThan(0);
    expect(becamePersistent).toBe(false);
  });
});
