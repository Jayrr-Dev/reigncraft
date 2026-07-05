import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaPlayerWorldLayer } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/**
 * Screen anchor at the center of an isometric tile diamond.
 *
 * Unlike {@link computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint},
 * this does not apply avatar foot offsets and expects integer tile indices.
 */
export function computingWorldPlazaTileCenterScreenAnchorFromGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
): { readonly centerXPx: number; readonly centerYPx: number } {
  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint);
  const layerOffsetPx = computingWorldBuildingWorldLayerScreenOffsetPx(
    resolvingWorldPlazaPlayerWorldLayer(gridPoint),
  );

  return {
    centerXPx: screenPoint.x,
    centerYPx: screenPoint.y + layerOffsetPx,
  };
}
