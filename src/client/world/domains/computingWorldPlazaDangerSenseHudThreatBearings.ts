/**
 * Collects continuous-bearing danger threats from live wildlife.
 *
 * @module components/world/domains/computingWorldPlazaDangerSenseHudThreatBearings
 */

import { computingWorldPlazaDangerSenseHudScreenBearingRadians } from '@/components/world/domains/computingWorldPlazaDangerSenseHudScreenBearingRadians';
import type { DefiningWorldPlazaDangerSenseHudThreatBearing } from '@/components/world/domains/definingWorldPlazaDangerSenseHudConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { computingWildlifeDangerSenseThreatSignal } from '@/components/world/wildlife/domains/computingWildlifeDangerSenseThreatIntensity';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ComputingWorldPlazaDangerSenseHudThreatBearingsParams = {
  readonly instances: readonly DefiningWildlifeInstance[];
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
  readonly playerUserId: string | null;
};

/**
 * Scans wildlife and returns every active threat with a screen bearing + tint.
 */
export function computingWorldPlazaDangerSenseHudThreatBearings({
  instances,
  playerPosition,
  playerUserId,
}: ComputingWorldPlazaDangerSenseHudThreatBearingsParams): readonly DefiningWorldPlazaDangerSenseHudThreatBearing[] {
  if (!playerUserId) {
    return [];
  }

  const threats: DefiningWorldPlazaDangerSenseHudThreatBearing[] = [];

  for (const instance of instances) {
    const gridDeltaX = instance.position.x - playerPosition.x;
    const gridDeltaY = instance.position.y - playerPosition.y;
    const distanceGrid = Math.hypot(gridDeltaX, gridDeltaY);
    const signal = computingWildlifeDangerSenseThreatSignal(
      instance,
      playerUserId,
      distanceGrid
    );

    if (!signal) {
      continue;
    }

    const bearingRadians = computingWorldPlazaDangerSenseHudScreenBearingRadians(
      gridDeltaX,
      gridDeltaY
    );
    if (bearingRadians == null) {
      continue;
    }

    threats.push({
      bearingRadians,
      intensity: signal.intensity,
      tint: signal.tint,
    });
  }

  return threats;
}
