import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { gettingWorldPlazaAmbienceVolume } from '@/components/world/domains/managingWorldPlazaAmbienceVolumeStore';
import { DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_TARGET_VOLUME } from '@/components/world/fire/domains/definingWorldPlazaLavaAmbienceConstants';
import { resolvingWorldPlazaLavaAmbienceNearPlayer } from '@/components/world/fire/domains/resolvingWorldPlazaLavaAmbienceNearPlayer';

/**
 * Effective loop volume from the nearest lava tile around the listener.
 */
export function computingWorldPlazaLavaAmbienceEffectiveVolume(
  listenerPoint: DefiningWorldPlazaWorldPoint | null
): number {
  const lavaAmbience = resolvingWorldPlazaLavaAmbienceNearPlayer(listenerPoint);

  if (!lavaAmbience || lavaAmbience.attenuation <= 0) {
    return 0;
  }

  return (
    DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_TARGET_VOLUME *
    lavaAmbience.attenuation *
    gettingWorldPlazaAmbienceVolume()
  );
}
