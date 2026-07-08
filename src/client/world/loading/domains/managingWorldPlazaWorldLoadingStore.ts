/**
 * Singleton progress store for the world boot loading pipeline.
 *
 * Runs the declarative step registry exactly once per page load (idempotent
 * against React StrictMode double-mounts and exit-to-home remounts) and
 * publishes weighted progress snapshots to subscribers.
 *
 * @module components/world/loading/domains/managingWorldPlazaWorldLoadingStore
 */

import {
  DEFINING_WORLD_PLAZA_WORLD_LOADING_STEP_REGISTRY,
  type DefiningWorldPlazaWorldLoadingStep,
} from '@/components/world/loading/domains/definingWorldPlazaWorldLoadingStepRegistry';

/** Published loading pipeline snapshot. */
export type ManagingWorldPlazaWorldLoadingSnapshot = {
  readonly status: 'idle' | 'loading' | 'complete' | 'error';
  /** Overall weighted progress from 0 to 100. */
  readonly percentLoaded: number;
  readonly errorMessage: string | null;
};

const managingWorldPlazaWorldLoadingSubscribers = new Set<() => void>();

let managingWorldPlazaWorldLoadingSnapshot: ManagingWorldPlazaWorldLoadingSnapshot =
  {
    status: 'idle',
    percentLoaded: 0,
    errorMessage: null,
  };

let managingWorldPlazaWorldLoadingRunPromise: Promise<void> | null = null;

function publishingWorldPlazaWorldLoadingSnapshot(
  nextSnapshot: ManagingWorldPlazaWorldLoadingSnapshot
): void {
  managingWorldPlazaWorldLoadingSnapshot = nextSnapshot;
  managingWorldPlazaWorldLoadingSubscribers.forEach((notify) => notify());
}

function computingWorldPlazaWorldLoadingPercent(
  steps: readonly DefiningWorldPlazaWorldLoadingStep[],
  completedStepCount: number,
  activeStepRatio: number
): number {
  const totalWeight = steps.reduce((sum, step) => sum + step.weight, 0);

  if (totalWeight <= 0) {
    return 100;
  }

  const completedWeight = steps
    .slice(0, completedStepCount)
    .reduce((sum, step) => sum + step.weight, 0);
  const activeStepWeight = steps[completedStepCount]?.weight ?? 0;
  const clampedRatio = Math.min(1, Math.max(0, activeStepRatio));

  return Math.min(
    100,
    Math.round(
      ((completedWeight + activeStepWeight * clampedRatio) / totalWeight) * 100
    )
  );
}

/** Subscribes to loading snapshot changes; returns an unsubscribe callback. */
export function subscribingWorldPlazaWorldLoading(
  onChange: () => void
): () => void {
  managingWorldPlazaWorldLoadingSubscribers.add(onChange);

  return () => {
    managingWorldPlazaWorldLoadingSubscribers.delete(onChange);
  };
}

/** Returns the current loading snapshot (stable reference between changes). */
export function peekingWorldPlazaWorldLoadingSnapshot(): ManagingWorldPlazaWorldLoadingSnapshot {
  return managingWorldPlazaWorldLoadingSnapshot;
}

/**
 * Starts the loading pipeline once; later calls reuse the same run.
 */
export function startingWorldPlazaWorldLoading(): Promise<void> {
  if (managingWorldPlazaWorldLoadingRunPromise) {
    return managingWorldPlazaWorldLoadingRunPromise;
  }

  const steps = DEFINING_WORLD_PLAZA_WORLD_LOADING_STEP_REGISTRY;

  managingWorldPlazaWorldLoadingRunPromise = (async () => {
    publishingWorldPlazaWorldLoadingSnapshot({
      status: 'loading',
      percentLoaded: 0,
      errorMessage: null,
    });

    try {
      for (let stepIndex = 0; stepIndex < steps.length; stepIndex += 1) {
        const step = steps[stepIndex];

        if (!step) {
          continue;
        }

        await step.load((completedRatio) => {
          publishingWorldPlazaWorldLoadingSnapshot({
            status: 'loading',
            percentLoaded: computingWorldPlazaWorldLoadingPercent(
              steps,
              stepIndex,
              completedRatio
            ),
            errorMessage: null,
          });
        });

        publishingWorldPlazaWorldLoadingSnapshot({
          status: 'loading',
          percentLoaded: computingWorldPlazaWorldLoadingPercent(
            steps,
            stepIndex + 1,
            0
          ),
          errorMessage: null,
        });
      }

      publishingWorldPlazaWorldLoadingSnapshot({
        status: 'complete',
        percentLoaded: 100,
        errorMessage: null,
      });
    } catch (error) {
      publishingWorldPlazaWorldLoadingSnapshot({
        status: 'error',
        percentLoaded: managingWorldPlazaWorldLoadingSnapshot.percentLoaded,
        errorMessage:
          error instanceof Error ? error.message : 'World failed to load.',
      });

      throw error;
    }
  })();

  managingWorldPlazaWorldLoadingRunPromise.catch(() => {
    // Snapshot already carries the error; allow a retry on the next start call.
    managingWorldPlazaWorldLoadingRunPromise = null;
  });

  return managingWorldPlazaWorldLoadingRunPromise;
}
