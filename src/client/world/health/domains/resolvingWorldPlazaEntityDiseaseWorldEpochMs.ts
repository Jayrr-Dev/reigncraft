/**
 * Wall-clock epoch used for disease incubation, staging, and persistence.
 * Diseases survive logouts because they are keyed to `Date.now()`, not frame time.
 */
export function resolvingWorldPlazaEntityDiseaseWorldEpochMs(
  worldEpochMs = Date.now()
): number {
  return worldEpochMs;
}
