import type { DefiningWorldPlazaCozyTuneId } from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';
import { resolvingWorldPlazaBiomeMusicUrl } from '@/components/world/domains/resolvingWorldPlazaBiomeMusicUrl';

const managingWorldPlazaBiomeMusicBufferCacheState = new Map<
  DefiningWorldPlazaCozyTuneId,
  AudioBuffer
>();

/**
 * Fetches and decodes one Cozy Tunes track, reusing cached buffers when possible.
 */
export async function loadingWorldPlazaBiomeMusicAudioBuffer(
  audioContext: AudioContext,
  tuneId: DefiningWorldPlazaCozyTuneId
): Promise<AudioBuffer> {
  const cachedBuffer = managingWorldPlazaBiomeMusicBufferCacheState.get(tuneId);

  if (cachedBuffer) {
    return cachedBuffer;
  }

  const response = await fetch(resolvingWorldPlazaBiomeMusicUrl(tuneId));

  if (!response.ok) {
    throw new Error(
      `Failed to load biome music "${tuneId}" (${response.status})`
    );
  }

  const encodedBuffer = await response.arrayBuffer();
  const decodedBuffer = await audioContext.decodeAudioData(encodedBuffer);
  managingWorldPlazaBiomeMusicBufferCacheState.set(tuneId, decodedBuffer);

  return decodedBuffer;
}

/**
 * Warms the cache for one tune without starting playback.
 */
export function prefetchingWorldPlazaBiomeMusicAudioBuffer(
  audioContext: AudioContext,
  tuneId: DefiningWorldPlazaCozyTuneId
): void {
  void loadingWorldPlazaBiomeMusicAudioBuffer(audioContext, tuneId).catch(
    () => {}
  );
}

/**
 * Clears decoded biome music buffers (hook teardown).
 */
export function clearingWorldPlazaBiomeMusicBufferCache(): void {
  managingWorldPlazaBiomeMusicBufferCacheState.clear();
}
