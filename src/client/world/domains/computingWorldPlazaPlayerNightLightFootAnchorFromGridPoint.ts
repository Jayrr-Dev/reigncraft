import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import { computingWorldPlazaCameraFollowWorldLocalScreenPointFromWorldPoint } from "@/components/world/domains/computingWorldPlazaCameraFollowWorldLocalScreenPointFromWorldPoint";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import { DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_VERTICAL_OFFSET_WORLD_LOCAL_PX } from "@/components/world/domains/definingWorldPlazaPlayerNightLightConstants";
import { computingWorldPlazaGirlSampleFootOffsetBelowGridAnchorPx } from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaPlayerWorldLayer } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/** Foot anchor offset shared by the Pixi glow and DOM darkness mask. */
export function computingWorldPlazaPlayerNightLightFootOffsetBelowGridAnchorPx(): number {
  return (
    computingWorldPlazaGirlSampleFootOffsetBelowGridAnchorPx() +
    DEFINING_WORLD_PLAZA_PLAYER_NIGHT_LIGHT_VERTICAL_OFFSET_WORLD_LOCAL_PX
  );
}

function computingWorldPlazaPlayerNightLightStandingLayerScreenOffsetPx(
  gridPoint: DefiningWorldPlazaWorldPoint,
): number {
  return computingWorldBuildingWorldLayerScreenOffsetPx(
    resolvingWorldPlazaPlayerWorldLayer(gridPoint),
  );
}

/**
 * Foot anchor in isometric world-local screen space (inside the camera rig).
 *
 * @param gridPoint - Player grid position.
 */
export function computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
): { readonly centerXPx: number; readonly centerYPx: number } {
  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint);
  const footOffsetPx = computingWorldPlazaPlayerNightLightFootOffsetBelowGridAnchorPx();

  return {
    centerXPx: screenPoint.x,
    centerYPx:
      screenPoint.y +
      computingWorldPlazaPlayerNightLightStandingLayerScreenOffsetPx(gridPoint) +
      footOffsetPx,
  };
}

/**
 * Foot anchor in camera-follow world-local space for viewport projection.
 *
 * @param gridPoint - Player grid position.
 */
export function computingWorldPlazaPlayerNightLightFootAnchorWorldLocalFromGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
): { readonly x: number; readonly y: number } {
  const worldLocalPoint =
    computingWorldPlazaCameraFollowWorldLocalScreenPointFromWorldPoint(gridPoint);
  const footOffsetPx = computingWorldPlazaPlayerNightLightFootOffsetBelowGridAnchorPx();

  return {
    x: worldLocalPoint.x,
    y:
      worldLocalPoint.y +
      computingWorldPlazaPlayerNightLightStandingLayerScreenOffsetPx(gridPoint) +
      footOffsetPx,
  };
}
