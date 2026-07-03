import {
  creatingWorldBuildingPlot,
  type DefiningWorldBuildingPlot,
} from "@/components/world/building/domains/definingWorldBuildingPlot";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";

/**
 * Local build draft state kept in memory until the player saves.
 *
 * @module components/world/building/domains/definingWorldBuildingBuildDraft
 */

/** Prefix for plot ids created locally before save. */
export const DEFINING_WORLD_BUILDING_BUILD_DRAFT_PLOT_ID_PREFIX =
  "draft-plot-" as const;

/** In-memory edits applied during an active build session. */
export interface DefiningWorldBuildingBuildDraftState {
  readonly workingPlots: DefiningWorldBuildingPlot[];
  readonly addedDraftBlockIds: ReadonlySet<string>;
  readonly removedPersistedBlockIds: readonly string[];
  readonly removedPersistedPlotIds: readonly string[];
}

/**
 * Deep-copies a plot aggregate so draft edits do not mutate query cache data.
 *
 * @param plot - Server plot aggregate.
 */
export function cloningWorldBuildingPlotForBuildDraft(
  plot: DefiningWorldBuildingPlot,
): DefiningWorldBuildingPlot {
  return {
    ...plot,
    bounds: { ...plot.bounds },
    blocksByTileKey: new Map(plot.blocksByTileKey),
  };
}

/**
 * Returns true when a plot id refers to a locally provisioned starter plot.
 *
 * @param plotId - Plot aggregate id.
 */
export function checkingWorldBuildingBuildDraftPlotIdIsLocal(
  plotId: string,
): boolean {
  return plotId.startsWith(DEFINING_WORLD_BUILDING_BUILD_DRAFT_PLOT_ID_PREFIX);
}

/**
 * Returns true when the draft contains changes not yet saved to Supabase.
 *
 * @param draft - Active build draft, if any.
 */
export function checkingWorldBuildingBuildDraftHasUnsavedChanges(
  draft: DefiningWorldBuildingBuildDraftState | null,
): boolean {
  if (!draft) {
    return false;
  }

  return (
    draft.addedDraftBlockIds.size > 0 ||
    draft.removedPersistedBlockIds.length > 0 ||
    draft.removedPersistedPlotIds.length > 0 ||
    draft.workingPlots.some((plot) =>
      checkingWorldBuildingBuildDraftPlotIdIsLocal(plot.plotId),
    )
  );
}

/**
 * Returns true when the draft includes an owned plot the player can build on.
 *
 * @param draft - Active build draft, if any.
 * @param ownerUserId - Authenticated user id.
 */
export function checkingWorldBuildingBuildDraftHasOwnedPlot(
  draft: DefiningWorldBuildingBuildDraftState | null,
  ownerUserId: string | null,
): boolean {
  if (!ownerUserId || !draft) {
    return false;
  }

  return draft.workingPlots.some((plot) => plot.ownerId === ownerUserId);
}

/**
 * Creates an empty draft shell for a first-time builder session.
 */
export function creatingEmptyWorldBuildingBuildDraftState(): DefiningWorldBuildingBuildDraftState {
  return {
    workingPlots: [],
    addedDraftBlockIds: new Set(),
    removedPersistedBlockIds: [],
    removedPersistedPlotIds: [],
  };
}

/**
 * Creates a local one-tile plot claim in the build draft.
 *
 * @param ownerUserId - Authenticated user id.
 * @param tilePosition - Claimed tile position.
 */
export function creatingWorldBuildingBuildDraftTilePlot(
  ownerUserId: string,
  tilePosition: DefiningWorldBuildingTilePosition,
  options?: {
    readonly isTemporary?: boolean;
  },
): DefiningWorldBuildingPlot {
  return creatingWorldBuildingPlot({
    plotId: `${DEFINING_WORLD_BUILDING_BUILD_DRAFT_PLOT_ID_PREFIX}${crypto.randomUUID()}`,
    ownerId: ownerUserId,
    bounds: {
      minTileX: tilePosition.tileX,
      minTileY: tilePosition.tileY,
      maxTileX: tilePosition.tileX,
      maxTileY: tilePosition.tileY,
    },
    createdAt: new Date().toISOString(),
    isTemporary: options?.isTemporary === true,
    expiresAt: null,
    blocks: [],
  });
}

/**
 * Hydrates a draft from current server plot aggregates when build mode opens.
 *
 * @param viewportPlots - Plots loaded around the player.
 * @param ownedPlots - All plots owned by the authenticated user.
 * @param ownerUserId - Authenticated user id.
 */
export function initializingWorldBuildingBuildDraftFromServerPlots(
  viewportPlots: DefiningWorldBuildingPlot[],
  ownedPlots: DefiningWorldBuildingPlot[],
  ownerUserId: string,
): DefiningWorldBuildingBuildDraftState {
  const plotsById = new Map<string, DefiningWorldBuildingPlot>();

  for (const plot of ownedPlots) {
    if (plot.ownerId === ownerUserId) {
      plotsById.set(plot.plotId, cloningWorldBuildingPlotForBuildDraft(plot));
    }
  }

  for (const plot of viewportPlots) {
    if (plot.ownerId === ownerUserId && !plotsById.has(plot.plotId)) {
      plotsById.set(plot.plotId, cloningWorldBuildingPlotForBuildDraft(plot));
    }
  }

  return {
    workingPlots: Array.from(plotsById.values()),
    addedDraftBlockIds: new Set(),
    removedPersistedBlockIds: [],
    removedPersistedPlotIds: [],
  };
}

/**
 * Replaces owned plots in the viewport list with in-memory draft plots.
 *
 * @param viewportPlots - Server plots around the player.
 * @param draft - Active build draft.
 * @param ownerUserId - Authenticated user id.
 */
export function mergingWorldBuildingViewportPlotsWithBuildDraft(
  viewportPlots: DefiningWorldBuildingPlot[],
  draft: DefiningWorldBuildingBuildDraftState,
  ownerUserId: string,
): DefiningWorldBuildingPlot[] {
  const draftPlotIds = new Set(
    draft.workingPlots
      .filter((plot) => plot.ownerId === ownerUserId)
      .map((plot) => plot.plotId),
  );

  const otherPlots = viewportPlots.filter(
    (plot) => plot.ownerId !== ownerUserId || !draftPlotIds.has(plot.plotId),
  );

  return [
    ...otherPlots,
    ...draft.workingPlots.filter((plot) => plot.ownerId === ownerUserId),
  ];
}

/**
 * Lists local plot claims in the draft that still need to be saved.
 *
 * @param draft - Active build draft.
 * @param ownerUserId - Authenticated user id.
 */
export function listingWorldBuildingBuildDraftPendingLocalPlots(
  draft: DefiningWorldBuildingBuildDraftState,
  ownerUserId: string,
): DefiningWorldBuildingPlot[] {
  return draft.workingPlots.filter(
    (plot) =>
      plot.ownerId === ownerUserId &&
      checkingWorldBuildingBuildDraftPlotIdIsLocal(plot.plotId) &&
      !draft.removedPersistedPlotIds.includes(plot.plotId),
  );
}
