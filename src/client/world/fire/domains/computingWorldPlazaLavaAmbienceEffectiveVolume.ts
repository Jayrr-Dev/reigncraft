import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { gettingWorldPlazaAmbienceVolume } from '@/components/world/domains/managingWorldPlazaAmbienceVolumeStore';
import { DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_TARGET_VOLUME } from '@/components/world/fire/domains/definingWorldPlazaLavaAmbienceConstants';
import { resolvingWorldPlazaLavaAmbienceNearPlayer } from '@/components/world/fire/domains/resolvingWorldPlazaLavaAmbienceNearPlayer';

/**
 * Effective loop volume from the nearest lava tile around the listener.
 */
export function computingWorldPlazaLavaAmbienceEffectiveVolume(
  listenerPoint: DefiningWorldPlazaWorldPoint | null,
  clipVolumeMultiplier = 1
): number {
  const lavaAmbience = resolvingWorldPlazaLavaAmbienceNearPlayer(listenerPoint);

  if (!lavaAmbience || lavaAmbience.attenuation <= 0) {
    return 0;
  }

  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume: DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_TARGET_VOLUME,
    multipliers: [lavaAmbience.attenuation, clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaAmbienceVolume(),
  });
}
