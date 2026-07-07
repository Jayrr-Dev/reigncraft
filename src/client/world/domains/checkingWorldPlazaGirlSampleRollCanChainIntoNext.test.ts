import { checkingWorldPlazaGirlSampleRollCanChainIntoNext } from '@/components/world/domains/checkingWorldPlazaGirlSampleRollCanChainIntoNext';
import { computingWorldPlazaGirlSampleRollChainUnlockAtMs } from '@/components/world/domains/computingWorldPlazaGirlSampleRollChainUnlockAtMs';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaGirlSampleRollCanChainIntoNext', () => {
  const rollStartedAtMs = 1_000;
  const chainUnlockAtMs =
    computingWorldPlazaGirlSampleRollChainUnlockAtMs(rollStartedAtMs);

  it('allows a roll before any roll has been started', () => {
    expect(checkingWorldPlazaGirlSampleRollCanChainIntoNext(1_000, 0)).toBe(
      true
    );
  });

  it('blocks chaining during the roll and post-roll delay', () => {
    expect(
      checkingWorldPlazaGirlSampleRollCanChainIntoNext(
        1_000 + 300,
        chainUnlockAtMs
      )
    ).toBe(false);
    expect(
      checkingWorldPlazaGirlSampleRollCanChainIntoNext(
        1_000 + 550,
        chainUnlockAtMs
      )
    ).toBe(false);
  });

  it('allows chaining once the roll and extra delay finish', () => {
    expect(
      checkingWorldPlazaGirlSampleRollCanChainIntoNext(
        chainUnlockAtMs,
        chainUnlockAtMs
      )
    ).toBe(true);
  });
});
