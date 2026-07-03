import type { BuildingWorldPlazaVisibleTreeDrawEntry } from "@/components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries";
import { DEFINING_WORLD_PLAZA_TREE_DEPTH_BAND_HEIGHT_PX } from "@/components/world/domains/definingWorldPlazaTreeDepthBandConstants";
import { DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_Z_INDEX_SCALE } from "@/components/world/domains/definingWorldPlazaIsometricConstants";

/**
 * Groups tree draw entries into screen-Y depth bands for entity-layer sorting.
 *
 * @module components/world/domains/groupingWorldPlazaTreeDrawEntriesByDepthBand
 */

/**
 * Maps a tree base screen Y to its depth band index.
 *
 * @param baseScreenY - Trunk base Y in world screen space.
 */
export function resolvingWorldPlazaTreeDepthBandIndexFromScreenY(
  baseScreenY: number,
): number {
  return Math.floor(baseScreenY / DEFINING_WORLD_PLAZA_TREE_DEPTH_BAND_HEIGHT_PX);
}

/**
 * z-index for a depth band, aligned with avatar {@link resolvingWorldPlazaIsometricEntityZIndex}.
 *
 * @param bandIndex - Depth band index from {@link resolvingWorldPlazaTreeDepthBandIndexFromScreenY}.
 */
export function resolvingWorldPlazaTreeDepthBandZIndex(
  bandIndex: number,
): number {
  const bandCenterScreenY =
    bandIndex * DEFINING_WORLD_PLAZA_TREE_DEPTH_BAND_HEIGHT_PX +
    DEFINING_WORLD_PLAZA_TREE_DEPTH_BAND_HEIGHT_PX / 2;

  return Math.round(
    bandCenterScreenY * DEFINING_WORLD_PLAZA_ISOMETRIC_ENTITY_Z_INDEX_SCALE,
  );
}

/**
 * Groups draw entries by depth band and sorts within each band back-to-front.
 *
 * @param drawEntries - Visible tree draw entries.
 */
export function groupingWorldPlazaTreeDrawEntriesByDepthBand(
  drawEntries: readonly BuildingWorldPlazaVisibleTreeDrawEntry[],
): Map<number, BuildingWorldPlazaVisibleTreeDrawEntry[]> {
  const bands = new Map<number, BuildingWorldPlazaVisibleTreeDrawEntry[]>();

  for (const entry of drawEntries) {
    const bandIndex = resolvingWorldPlazaTreeDepthBandIndexFromScreenY(
      entry.baseScreenY,
    );
    const bandEntries = bands.get(bandIndex);

    if (bandEntries) {
      bandEntries.push(entry);
    } else {
      bands.set(bandIndex, [entry]);
    }
  }

  for (const bandEntries of bands.values()) {
    bandEntries.sort(
      (entryA, entryB) => entryA.baseScreenY - entryB.baseScreenY,
    );
  }

  return bands;
}
