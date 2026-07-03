import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import type { DefiningWorldPlazaGirlSampleWalkDirection } from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaPlayerWorldLayer } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/**
 * Live avatar render position used by DOM overlays (name tags, chat bubbles).
 *
 * @module components/world/domains/definingWorldPlazaPlayerRenderPosition
 */

/** Pixi-published avatar position for overlay anchoring. */
export interface DefiningWorldPlazaPlayerRenderPosition extends DefiningWorldPlazaWorldPoint {
  /**
   * Total avatar vertical screen offset from the ground grid projection,
   * including world layer lift plus jump and fall arcs (world-local pixels).
   */
  avatarScreenOffsetYPx?: number;
  /** Standing-layer lift only (no jump arc), used for floor-layer shadow placement. */
  avatarStandingLayerScreenOffsetYPx?: number;
  /** Facing strip used to shape the ground shadow ellipse. */
  avatarFacingDirection?: DefiningWorldPlazaGirlSampleWalkDirection;
  /** Normalized jump height (0 on ground) for shadow scale and fade. */
  avatarGroundShadowJumpHeightRatio?: number;
}

/**
 * Returns the vertical screen offset to align DOM overlays with the avatar.
 *
 * Prefers the Pixi tick offset when available; otherwise derives lift from the
 * standing world layer on the grid point.
 *
 * @param gridPoint - Speaker grid position (may include `layer`).
 * @param renderPosition - Optional live render registry entry for this player.
 */
export function computingWorldPlazaAvatarOverlayVerticalScreenOffsetPx(
  gridPoint: DefiningWorldPlazaWorldPoint,
  renderPosition?: DefiningWorldPlazaPlayerRenderPosition | null,
): number {
  if (renderPosition?.avatarScreenOffsetYPx !== undefined) {
    return renderPosition.avatarScreenOffsetYPx;
  }

  return computingWorldBuildingWorldLayerScreenOffsetPx(
    resolvingWorldPlazaPlayerWorldLayer(gridPoint),
  );
}
