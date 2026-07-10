/**
 * Defers Pixi GPU resource destruction until after the current frame.
 *
 * Destroying shaders, render textures, or filtered display objects during an
 * active render tick can leave WebGL in a bad state.
 *
 * @module components/world/domains/queueingWorldPlazaPixiGpuResourceDisposal
 */

type QueueingWorldPlazaPixiGpuResourceDisposalTask = () => void;

let queueingWorldPlazaPixiGpuResourceDisposalPendingTasks: QueueingWorldPlazaPixiGpuResourceDisposalTask[] =
  [];
let queueingWorldPlazaPixiGpuResourceDisposalFrameIsScheduled = false;

function runningWorldPlazaPixiGpuResourceDisposalTasks(): void {
  queueingWorldPlazaPixiGpuResourceDisposalFrameIsScheduled = false;

  const tasks = queueingWorldPlazaPixiGpuResourceDisposalPendingTasks;
  queueingWorldPlazaPixiGpuResourceDisposalPendingTasks = [];

  for (const task of tasks) {
    task();
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
