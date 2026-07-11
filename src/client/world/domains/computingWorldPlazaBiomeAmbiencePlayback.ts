import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import {
  DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_TARGET_VOLUME,
} from '@/components/world/domains/definingWorldPlazaBiomeAmbienceConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { gettingWorldPlazaAmbienceVolume } from '@/components/world/domains/managingWorldPlazaAmbienceVolumeStore';
import { resolvingWorldPlazaBiomeAmbienceClipId } from '@/components/world/domains/resolvingWorldPlazaBiomeAmbienceClipId';
import { resolvingWorldPlazaFlowingWaterAmbienceNearPlayer } from '@/components/world/domains/resolvingWorldPlazaFlowingWaterAmbienceNearPlayer';

export type ComputingWorldPlazaBiomeAmbiencePlayback = {
  readonly clipId: NonNullable<
    ReturnType<typeof resolvingWorldPlazaBiomeAmbienceClipId>
  >;
  readonly volume: number;
};

/**
 * Resolves the active ambience clip and effective loop volume for the player.
 */
export function computingWorldPlazaBiomeAmbiencePlayback(
  biomeKind: DefiningWorldPlazaBiomeKind,
  listenerPoint: DefiningWorldPlazaWorldPoint | null,
  clipVolumeMultiplier = 1
): ComputingWorldPlazaBiomeAmbiencePlayback | null {
  const clipId = resolvingWorldPlazaBiomeAmbienceClipId(
    biomeKind,
    listenerPoint
  );

  if (!clipId) {
    return null;
  }

  const flowingWaterAmbience =
    resolvingWorldPlazaFlowingWaterAmbienceNearPlayer(listenerPoint);
  const ambienceVolume = gettingWorldPlazaAmbienceVolume();

  if (flowingWaterAmbience && flowingWaterAmbience.clipId === clipId) {
    return {
      clipId,
      volume: computingWorldPlazaSfxEffectiveVolume({
        baseTargetVolume:
          DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_TARGET_VOLUME,
        multipliers: [flowingWaterAmbience.attenuation, clipVolumeMultiplier],
        sliderVolume: ambienceVolume,
      }),
    };
  }

  return {
    clipId,
    volume: computingWorldPlazaSfxEffectiveVolume({
      baseTargetVolume: DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_TARGET_VOLUME,
      multipliers: [clipVolumeMultiplier],
      sliderVolume: ambienceVolume,
    }),
  };
}
