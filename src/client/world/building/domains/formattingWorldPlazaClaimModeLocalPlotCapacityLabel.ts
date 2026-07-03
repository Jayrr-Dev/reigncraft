import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";

/**
 * Formats claim-mode capacity labels for the local player's plot limits.
 *
 * @module components/world/building/domains/formattingWorldPlazaClaimModeLocalPlotCapacityLabel
 */

/** Input for local plot and tile capacity labels. */
export interface FormattingWorldPlazaClaimModeLocalPlotCapacityInput {
  ownedPlotCount: number;
  tileClaimCount: number;
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits;
}

/** Resolved local plot and tile capacity with max limits. */
export interface FormattingWorldPlazaClaimModeLocalPlotCapacityModel
  extends FormattingWorldPlazaClaimModeLocalPlotCapacityInput {
  maxOwnedPlotCount: number;
  maxTileClaimCount: number;
  isPlotCapacityReached: boolean;
  isTileCapacityReached: boolean;
}

/**
 * Resolves local plot and tile capacity against per-user limits.
 *
 * @param input - Current local plot and tile claim counts with user limits.
 */
export function resolvingWorldPlazaClaimModeLocalPlotCapacity(
  input: FormattingWorldPlazaClaimModeLocalPlotCapacityInput,
): FormattingWorldPlazaClaimModeLocalPlotCapacityModel {
  const { plotOwnerLimits } = input;

  return {
    ...input,
    maxOwnedPlotCount: plotOwnerLimits.maxOwnedPlotCount,
    maxTileClaimCount: plotOwnerLimits.maxTileClaimCount,
    isPlotCapacityReached:
      input.ownedPlotCount >= plotOwnerLimits.maxOwnedPlotCount,
    isTileCapacityReached:
      input.tileClaimCount >= plotOwnerLimits.maxTileClaimCount,
  };
}

/**
 * Formats the claim sidebar section header with plot and tile usage.
 *
 * @param input - Current local plot and tile claim counts with user limits.
 */
export function formattingWorldPlazaClaimModeLocalPlotCapacitySectionLabel(
  input: FormattingWorldPlazaClaimModeLocalPlotCapacityInput,
): string {
  const capacity = resolvingWorldPlazaClaimModeLocalPlotCapacity(input);

  return `Plots ${capacity.ownedPlotCount}/${capacity.maxOwnedPlotCount} | Tiles ${capacity.tileClaimCount}/${capacity.maxTileClaimCount}`;
}

/**
 * Formats the local owner row tile capacity label.
 *
 * @param tileClaimCount - Current local tile claim count.
 * @param plotOwnerLimits - Per-user plot and tile caps.
 */
export function formattingWorldPlazaClaimModeLocalPlotCapacityTileLabel(
  tileClaimCount: number,
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits,
): string {
  return `Tiles ${tileClaimCount}/${plotOwnerLimits.maxTileClaimCount}`;
}
