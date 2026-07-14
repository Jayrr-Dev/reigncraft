import { resolvingWorldPlazaTimedInteractionQueueEnqueue } from '@/components/world/interaction/domains/resolvingWorldPlazaTimedInteractionQueueEnqueue';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaTimedInteractionQueueEnqueue', () => {
  it('appends when under the max depth', () => {
    const result = resolvingWorldPlazaTimedInteractionQueueEnqueue(
      ['a'],
      'b',
      3
    );

    expect(result.accepted).toBe(true);
    expect(result.nextQueue).toEqual(['a', 'b']);
  });

  it('rejects when the queue is full', () => {
    const result = resolvingWorldPlazaTimedInteractionQueueEnqueue(
      ['a', 'b'],
      'c',
      2
    );

    expect(result.accepted).toBe(false);
    expect(result.nextQueue).toEqual(['a', 'b']);
  });

  it('rejects when max queued is zero', () => {
    const result = resolvingWorldPlazaTimedInteractionQueueEnqueue([], 'a', 0);

    expect(result.accepted).toBe(false);
    expect(result.nextQueue).toEqual([]);
  });
});
