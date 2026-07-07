/**
 * True when `nowMs` has passed the persisted roll chain unlock timestamp.
 */
export function checkingWorldPlazaGirlSampleRollCanChainIntoNext(
  nowMs: number,
  rollChainUnlockAtMs: number
): boolean {
  return nowMs >= rollChainUnlockAtMs;
}
