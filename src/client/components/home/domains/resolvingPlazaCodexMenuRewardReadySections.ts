/**
 * Resolves which Codex menu sections have a reached milestone reward ready.
 *
 * @module components/home/domains/resolvingPlazaCodexMenuRewardReadySections
 */

import { checkingPlazaCodexMilestoneRewardClaimed } from '@/components/home/domains/claimingPlazaCodexMilestoneReward';
import { resolvingPlazaCodexMilestoneRewardsForSection } from '@/components/home/domains/definingPlazaCodexMilestoneRewardRegistry';
import {
  checkingPlazaCodexDiscoveryProgressHasRewardReady,
  checkingPlazaCodexOverallProgressHasRewardReady,
} from '@/components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers';
import type { WorldPlazaCodexSectionId } from '@/components/world/domains/definingWorldPlazaCodexConstants';

/** One section's Sighted/Logged + Studied meters (same as dual progress). */
export type PlazaCodexMenuRewardReadyMeterPair = {
  readonly discoveredValue: number;
  readonly discoveredMax: number;
  readonly studiedValue: number;
  readonly studiedMax: number;
};

/** Single discovery meter (Biomes / Recipes) with four chests. */
export type PlazaCodexMenuRewardReadyDiscoveryMeter = {
  readonly value: number;
  readonly max: number;
};

function checkingPlazaCodexDefinedDualMeterRewardReady(
  meters: PlazaCodexMenuRewardReadyMeterPair,
  sectionId: WorldPlazaCodexSectionId,
  attachedRecipeIds: ReadonlySet<string>
): boolean {
  const definitions = resolvingPlazaCodexMilestoneRewardsForSection(sectionId);

  return definitions.some((definition) => {
    const value =
      definition.meterKind === 'discovered'
        ? meters.discoveredValue
        : meters.studiedValue;
    const max =
      definition.meterKind === 'discovered'
        ? meters.discoveredMax
        : meters.studiedMax;

    if (max <= 0) {
      return false;
    }

    const threshold = Math.round((definition.percent / 100) * max);
    if (value < threshold) {
      return false;
    }

    return !checkingPlazaCodexMilestoneRewardClaimed(
      definition,
      attachedRecipeIds
    );
  });
}

/**
 * True when either overall meter has a claimable reward.
 * Sections with registry rows only light for defined unclaimed grants.
 * Sections without rows keep placeholder "any reached chest" behavior.
 */
export function checkingPlazaCodexDualMetersHaveRewardReady(
  meters: PlazaCodexMenuRewardReadyMeterPair,
  sectionId?: WorldPlazaCodexSectionId,
  attachedRecipeIds: ReadonlySet<string> = new Set()
): boolean {
  if (sectionId) {
    const definedRewards =
      resolvingPlazaCodexMilestoneRewardsForSection(sectionId);
    if (definedRewards.length > 0) {
      return checkingPlazaCodexDefinedDualMeterRewardReady(
        meters,
        sectionId,
        attachedRecipeIds
      );
    }
  }

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
 * Section ids whose dual or discovery meters have a reached chest (reward ready).
 */
export function resolvingPlazaCodexMenuRewardReadySections(
  metersBySection: Readonly<
    Partial<
      Record<WorldPlazaCodexSectionId, PlazaCodexMenuRewardReadyMeterPair>
    >
  >,
  discoveryMetersBySection: Readonly<
    Partial<
      Record<WorldPlazaCodexSectionId, PlazaCodexMenuRewardReadyDiscoveryMeter>
    >
  > = {},
  attachedRecipeIds: ReadonlySet<string> = new Set()
): ReadonlySet<WorldPlazaCodexSectionId> {
  const ready = new Set<WorldPlazaCodexSectionId>();

  for (const [sectionId, meters] of Object.entries(
    metersBySection
  ) as readonly [
    WorldPlazaCodexSectionId,
    PlazaCodexMenuRewardReadyMeterPair | undefined,
  ][]) {
    if (
      meters &&
      checkingPlazaCodexDualMetersHaveRewardReady(
        meters,
        sectionId,
        attachedRecipeIds
      )
    ) {
      ready.add(sectionId);
    }
  }

  for (const [sectionId, meter] of Object.entries(
    discoveryMetersBySection
  ) as readonly [
    WorldPlazaCodexSectionId,
    PlazaCodexMenuRewardReadyDiscoveryMeter | undefined,
  ][]) {
    if (
      meter &&
      checkingPlazaCodexDiscoveryProgressHasRewardReady(meter.value, meter.max)
    ) {
      ready.add(sectionId);
    }
  }

  return ready;
}
