/**
 * Time-sliced Pixi GPU resource disposal with per-frame task caps.
 *
 * @module components/world/domains/queueingWorldPlazaPixiGpuResourceDisposal
 */

import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import { invokingWorldPlazaLoopBodySafely } from '@/components/world/domains/loggingWorldPlazaClientErrors';
import { beginningWorldPlazaPerformanceSample } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';

type QueueingWorldPlazaPixiGpuResourceDisposalTask = () => void;

/** Max destroy callbacks executed per animation frame. */
const QUEUEING_WORLD_PLAZA_PIXI_GPU_RESOURCE_DISPOSAL_MAX_TASKS_PER_FRAME = 8;

let queueingWorldPlazaPixiGpuResourceDisposalPendingTasks: QueueingWorldPlazaPixiGpuResourceDisposalTask[] =
  [];
let queueingWorldPlazaPixiGpuResourceDisposalFrameIsScheduled = false;

function runningWorldPlazaPixiGpuResourceDisposalTasks(): void {
  queueingWorldPlazaPixiGpuResourceDisposalFrameIsScheduled = false;

  if (queueingWorldPlazaPixiGpuResourceDisposalPendingTasks.length === 0) {
    return;
  }

  const finishDisposalSample = beginningWorldPlazaPerformanceSample(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.GPU_DISPOSAL
  );
  const tasksToRun =
    queueingWorldPlazaPixiGpuResourceDisposalPendingTasks.splice(
      0,
      QUEUEING_WORLD_PLAZA_PIXI_GPU_RESOURCE_DISPOSAL_MAX_TASKS_PER_FRAME
    );

  for (const task of tasksToRun) {
    invokingWorldPlazaLoopBodySafely('gpu-disposal', () => {
      task();
    });
  }

  finishDisposalSample();

  if (queueingWorldPlazaPixiGpuResourceDisposalPendingTasks.length > 0) {
    queueingWorldPlazaPixiGpuResourceDisposalFrameIsScheduled = true;
    requestAnimationFrame(runningWorldPlazaPixiGpuResourceDisposalTasks);
  }
}

/**
 * Runs {@link dispose} after the current animation frame finishes rendering.
 *
 * @param dispose - Synchronous Pixi destroy callback.
 */
export function queueingWorldPlazaPixiGpuResourceDisposal(
  dispose: QueueingWorldPlazaPixiGpuResourceDisposalTask
): void {
  queueingWorldPlazaPixiGpuResourceDisposalPendingTasks.push(dispose);

  if (queueingWorldPlazaPixiGpuResourceDisposalFrameIsScheduled) {
    return;
  }

  queueingWorldPlazaPixiGpuResourceDisposalFrameIsScheduled = true;
  requestAnimationFrame(runningWorldPlazaPixiGpuResourceDisposalTasks);
}

/**
 * Returns the number of pending GPU disposal tasks (for diagnostics gauges).
 */
export function countingWorldPlazaPixiGpuResourceDisposalPendingTasks(): number {
  return queueingWorldPlazaPixiGpuResourceDisposalPendingTasks.length;
}
