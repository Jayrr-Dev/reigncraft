/**
 * Pure enqueue helper for same-target timed interaction click spam.
 *
 * @module components/world/interaction/domains/resolvingWorldPlazaTimedInteractionQueueEnqueue
 */

export type ResolvingWorldPlazaTimedInteractionQueueEnqueueResult<TRequest> = {
  readonly accepted: boolean;
  readonly nextQueue: readonly TRequest[];
};

/**
 * Appends one queued request when under the max depth.
 */
export function resolvingWorldPlazaTimedInteractionQueueEnqueue<TRequest>(
  queue: readonly TRequest[],
  request: TRequest,
  maxQueued: number
): ResolvingWorldPlazaTimedInteractionQueueEnqueueResult<TRequest> {
  if (maxQueued <= 0 || queue.length >= maxQueued) {
    return {
      accepted: false,
      nextQueue: queue,
    };
  }

  return {
    accepted: true,
    nextQueue: [...queue, request],
  };
}
