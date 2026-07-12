/**
 * Session-specific audio readiness.
 *
 * Unlike world code/textures, session audio cannot warm during the home screen:
 * save position, active avatar, biome, and nearby species are not known yet.
 *
 * @module components/world/audio/lifecycle/managingWorldPlazaSessionAudioLoadingStore
 */

import { preloadingWorldPlazaWorldBootStarAudio } from '@/components/world/domains/preloadingWorldPlazaWorldBootStarAudio';

export type ManagingWorldPlazaSessionAudioLoadingSnapshot = {
  readonly status: 'idle' | 'loading' | 'complete' | 'error';
  readonly percentLoaded: number;
  readonly errorMessage: string | null;
};

const managingWorldPlazaSessionAudioLoadingSubscribers = new Set<() => void>();
let managingWorldPlazaSessionAudioLoadingSnapshot: ManagingWorldPlazaSessionAudioLoadingSnapshot =
  {
    status: 'idle',
    percentLoaded: 0,
    errorMessage: null,
  };
let managingWorldPlazaSessionAudioLoadingRunPromise: Promise<void> | null = null;
let managingWorldPlazaSessionAudioLoadingGeneration = 0;

function publishingWorldPlazaSessionAudioLoadingSnapshot(
  snapshot: ManagingWorldPlazaSessionAudioLoadingSnapshot
): void {
  managingWorldPlazaSessionAudioLoadingSnapshot = snapshot;
  managingWorldPlazaSessionAudioLoadingSubscribers.forEach((notify) =>
    notify()
  );
}

export function peekingWorldPlazaSessionAudioLoadingSnapshot(): ManagingWorldPlazaSessionAudioLoadingSnapshot {
  return managingWorldPlazaSessionAudioLoadingSnapshot;
}

export function subscribingWorldPlazaSessionAudioLoading(
  listener: () => void
): () => void {
  managingWorldPlazaSessionAudioLoadingSubscribers.add(listener);

  return () => {
    managingWorldPlazaSessionAudioLoadingSubscribers.delete(listener);
  };
}

export function startingWorldPlazaSessionAudioLoading(): Promise<void> {
  if (managingWorldPlazaSessionAudioLoadingRunPromise) {
    return managingWorldPlazaSessionAudioLoadingRunPromise;
  }

  managingWorldPlazaSessionAudioLoadingGeneration += 1;
  const generation = managingWorldPlazaSessionAudioLoadingGeneration;
  publishingWorldPlazaSessionAudioLoadingSnapshot({
    status: 'loading',
    percentLoaded: 0,
    errorMessage: null,
  });

  const runPromise = preloadingWorldPlazaWorldBootStarAudio(
    (completedRatio) => {
      if (generation !== managingWorldPlazaSessionAudioLoadingGeneration) {
        return;
      }

      publishingWorldPlazaSessionAudioLoadingSnapshot({
        status: 'loading',
        percentLoaded: Math.round(
          Math.min(1, Math.max(0, completedRatio)) * 100
        ),
        errorMessage: null,
      });
    }
  )
    .then(() => {
      if (generation !== managingWorldPlazaSessionAudioLoadingGeneration) {
        return;
      }

      publishingWorldPlazaSessionAudioLoadingSnapshot({
        status: 'complete',
        percentLoaded: 100,
        errorMessage: null,
      });
    })
    .catch((error: unknown) => {
      if (generation !== managingWorldPlazaSessionAudioLoadingGeneration) {
        return;
      }

      publishingWorldPlazaSessionAudioLoadingSnapshot({
        status: 'error',
        percentLoaded:
          managingWorldPlazaSessionAudioLoadingSnapshot.percentLoaded,
        errorMessage:
          error instanceof Error ? error.message : 'Audio failed to load.',
      });
      throw error;
    })
    .finally(() => {
      if (
        generation === managingWorldPlazaSessionAudioLoadingGeneration &&
        managingWorldPlazaSessionAudioLoadingSnapshot.status === 'error'
      ) {
        managingWorldPlazaSessionAudioLoadingRunPromise = null;
      }
    });

  managingWorldPlazaSessionAudioLoadingRunPromise = runPromise;
  return runPromise;
}

export function resettingWorldPlazaSessionAudioLoading(): void {
  managingWorldPlazaSessionAudioLoadingGeneration += 1;
  managingWorldPlazaSessionAudioLoadingRunPromise = null;
  publishingWorldPlazaSessionAudioLoadingSnapshot({
    status: 'idle',
    percentLoaded: 0,
    errorMessage: null,
  });
}
