import {
  DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_TARGET_VOLUME,
} from '@/components/world/domains/definingWorldPlazaBiomeAmbienceConstants';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';
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
  listenerPoint: DefiningWorldPlazaWorldPoint | null
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
  const sfxVolume = gettingWorldPlazaSfxVolume();

  if (flowingWaterAmbience && flowingWaterAmbience.clipId === clipId) {
    return {
      clipId,
      volume:
        DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_TARGET_VOLUME *
        flowingWaterAmbience.attenuation *
        sfxVolume,
    };
  }

  return {
    clipId,
    volume: DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_TARGET_VOLUME * sfxVolume,
  };
}
