/**
 * Resolves which Codex menu sections have a reached milestone reward ready.
 *
 * @module components/home/domains/resolvingPlazaCodexMenuRewardReadySections
 */

import { checkingPlazaCodexOverallProgressHasRewardReady } from '@/components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers';
import type { WorldPlazaCodexSectionId } from '@/components/world/domains/definingWorldPlazaCodexConstants';

/** One section's Sighted/Logged + Studied meters (same as dual progress). */
export type PlazaCodexMenuRewardReadyMeterPair = {
  readonly discoveredValue: number;
  readonly discoveredMax: number;
  readonly studiedValue: number;
  readonly studiedMax: number;
};

/**
 * True when either overall meter has a reached milestone chest.
 */
export function checkingPlazaCodexDualMetersHaveRewardReady(
  meters: PlazaCodexMenuRewardReadyMeterPair
): boolean {
  return (
    checkingPlazaCodexOverallProgressHasRewardReady(
      meters.discoveredValue,
      meters.discoveredMax
    ) ||
    checkingPlazaCodexOverallProgressHasRewardReady(
      meters.studiedValue,
      meters.studiedMax
    )
  );
}

/**
 * Section ids whose dual-progress meters have a reached chest (reward ready).
 */
export function resolvingPlazaCodexMenuRewardReadySections(
  metersBySection: Readonly<
    Partial<Record<WorldPlazaCodexSectionId, PlazaCodexMenuRewardReadyMeterPair>>
  >
): ReadonlySet<WorldPlazaCodexSectionId> {
  const ready = new Set<WorldPlazaCodexSectionId>();

  for (const [sectionId, meters] of Object.entries(metersBySection) as readonly [
    WorldPlazaCodexSectionId,
    PlazaCodexMenuRewardReadyMeterPair | undefined,
  ][]) {
    if (meters && checkingPlazaCodexDualMetersHaveRewardReady(meters)) {
      ready.add(sectionId);
    }
  }

  return ready;
}
