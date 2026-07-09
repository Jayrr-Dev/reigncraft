import { advancingWorldPlazaEntitySleepSpeechBubble } from '@/components/world/health/domains/advancingWorldPlazaEntitySleepSpeechBubble';
import {
  DEFINING_WORLD_PLAZA_SLEEP_FALL_DURATION_MS,
  DEFINING_WORLD_PLAZA_SLEEP_SPEECH_BUBBLE_DURATION_MS,
} from '@/components/world/health/domains/definingWorldPlazaEntitySleepConstants';
import { describe, expect, it } from 'vitest';

describe('advancingWorldPlazaEntitySleepSpeechBubble', () => {
  it('returns null while awake', () => {
    expect(
      advancingWorldPlazaEntitySleepSpeechBubble({
        nowMs: 10_000,
        isAsleep: false,
        sleepStartedAtMs: 1000,
        activeBubble: null,
      })
    ).toBeNull();
  });

  it('waits for the sleep fall to finish before showing Zzz', () => {
    const sleepStartedAtMs = 1000;

    expect(
      advancingWorldPlazaEntitySleepSpeechBubble({
        nowMs:
          sleepStartedAtMs + DEFINING_WORLD_PLAZA_SLEEP_FALL_DURATION_MS - 1,
        isAsleep: true,
        sleepStartedAtMs,
        activeBubble: null,
      })
    ).toBeNull();
  });

  it('emits a Zzz bubble after the fall completes', () => {
    const sleepStartedAtMs = 1000;
    const nowMs =
      sleepStartedAtMs + DEFINING_WORLD_PLAZA_SLEEP_FALL_DURATION_MS;
    const bubble = advancingWorldPlazaEntitySleepSpeechBubble({
      nowMs,
      isAsleep: true,
      sleepStartedAtMs,
      activeBubble: null,
    });

    expect(bubble).not.toBeNull();
    expect(bubble?.message.toLowerCase()).toContain('z');
    expect(bubble?.expiresAtMs).toBe(
      nowMs + DEFINING_WORLD_PLAZA_SLEEP_SPEECH_BUBBLE_DURATION_MS
    );
    expect(bubble?.lineIndex).toBe(0);
  });

  it('keeps the active bubble until it expires', () => {
    const sleepStartedAtMs = 1000;
    const nowMs =
      sleepStartedAtMs + DEFINING_WORLD_PLAZA_SLEEP_FALL_DURATION_MS;
    const activeBubble = advancingWorldPlazaEntitySleepSpeechBubble({
      nowMs,
      isAsleep: true,
      sleepStartedAtMs,
      activeBubble: null,
    });

    expect(activeBubble).not.toBeNull();

    const kept = advancingWorldPlazaEntitySleepSpeechBubble({
      nowMs: nowMs + 500,
      isAsleep: true,
      sleepStartedAtMs,
      activeBubble,
    });

    expect(kept).toEqual(activeBubble);
  });

  it('rotates to the next Zzz line after expiry', () => {
    const sleepStartedAtMs = 1000;
    const firstAtMs =
      sleepStartedAtMs + DEFINING_WORLD_PLAZA_SLEEP_FALL_DURATION_MS;
    const first = advancingWorldPlazaEntitySleepSpeechBubble({
      nowMs: firstAtMs,
      isAsleep: true,
      sleepStartedAtMs,
      activeBubble: null,
    });

    expect(first).not.toBeNull();

    const second = advancingWorldPlazaEntitySleepSpeechBubble({
      nowMs: first!.expiresAtMs,
      isAsleep: true,
      sleepStartedAtMs,
      activeBubble: first,
    });

    expect(second?.lineIndex).toBe(1);
    expect(second?.message).not.toBe(first?.message);
  });
});
