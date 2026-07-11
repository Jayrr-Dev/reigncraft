'use client';

import type { DefiningWorldPlazaPerformanceTesterStepId } from '@/components/world/domains/definingWorldPlazaPerformanceTesterStepRegistry';
import type { ManagingWorldPlazaPerformanceTesterStoreSnapshot } from '@/components/world/domains/managingWorldPlazaPerformanceTesterStore';
import {
  cancellingWorldPlazaPerformanceTesterRun,
  clearingWorldPlazaPerformanceTesterResults,
  gettingWorldPlazaPerformanceTesterResults,
  gettingWorldPlazaPerformanceTesterStoreSnapshot,
  startingWorldPlazaPerformanceTesterStep,
  startingWorldPlazaPerformanceTesterSuite,
  subscribingWorldPlazaPerformanceTesterStore,
} from '@/components/world/domains/managingWorldPlazaPerformanceTesterStore';
import { useCallback, useSyncExternalStore } from 'react';

export type UsingWorldPlazaPerformanceTesterResult = {
  readonly snapshot: ManagingWorldPlazaPerformanceTesterStoreSnapshot;
  readonly runningPerfTesterSuite: () => void;
  readonly runningPerfTesterStep: (
    stepId: DefiningWorldPlazaPerformanceTesterStepId
  ) => void;
  readonly cancellingPerfTesterRun: () => void;
  readonly clearingPerfTesterResults: () => void;
};

/**
 * Subscribes to the multistep performance tester store.
 */
export function usingWorldPlazaPerformanceTester(): UsingWorldPlazaPerformanceTesterResult {
  const snapshot = useSyncExternalStore(
    subscribingWorldPlazaPerformanceTesterStore,
    gettingWorldPlazaPerformanceTesterStoreSnapshot,
    gettingWorldPlazaPerformanceTesterStoreSnapshot
  );

  const runningPerfTesterSuite = useCallback((): void => {
    startingWorldPlazaPerformanceTesterSuite();
  }, []);

  const runningPerfTesterStep = useCallback(
    (stepId: DefiningWorldPlazaPerformanceTesterStepId): void => {
      startingWorldPlazaPerformanceTesterStep(stepId);
    },
    []
  );

  const cancellingPerfTesterRun = useCallback((): void => {
    cancellingWorldPlazaPerformanceTesterRun();
  }, []);

  const clearingPerfTesterResults = useCallback((): void => {
    clearingWorldPlazaPerformanceTesterResults();
  }, []);

  return {
    snapshot,
    runningPerfTesterSuite,
    runningPerfTesterStep,
    cancellingPerfTesterRun,
    clearingPerfTesterResults,
  };
}

export { gettingWorldPlazaPerformanceTesterResults };
