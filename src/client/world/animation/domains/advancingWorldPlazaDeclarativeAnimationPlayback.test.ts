import {
  advancingWorldPlazaDeclarativeAnimationPlayback,
  creatingWorldPlazaDeclarativeAnimationPlaybackState,
} from '@/components/world/animation/domains/advancingWorldPlazaDeclarativeAnimationPlayback';
import { buildingWorldPlazaAnimationClipFromFrameList } from '@/components/world/animation/domains/buildingWorldPlazaAnimationClipFromFrameList';
import { resolvingWorldPlazaDeclarativeAnimationFrameAtTime } from '@/components/world/animation/domains/resolvingWorldPlazaDeclarativeAnimationFrame';
import { describe, expect, it } from 'vitest';

describe('advancingWorldPlazaDeclarativeAnimationPlayback', () => {
  const clip = buildingWorldPlazaAnimationClipFromFrameList({
    clipId: 'test-loop',
    resolveFrames: () => [{}, {}, {}] as never,
    frameDurationMs: 100,
    playbackMode: 'loop',
  });

  it('loops frame indices', () => {
    let state = creatingWorldPlazaDeclarativeAnimationPlaybackState(
      { clipId: 'test-loop' },
      clip
    );

    state = advancingWorldPlazaDeclarativeAnimationPlayback({
      state,
      request: { clipId: 'test-loop', playing: true },
      clip,
      deltaMs: 100,
    });
    expect(state.frameIndex).toBe(1);

    state = advancingWorldPlazaDeclarativeAnimationPlayback({
      state,
      request: { clipId: 'test-loop', playing: true },
      clip,
      deltaMs: 100,
    });
    expect(state.frameIndex).toBe(2);

    state = advancingWorldPlazaDeclarativeAnimationPlayback({
      state,
      request: { clipId: 'test-loop', playing: true },
      clip,
      deltaMs: 100,
    });
    expect(state.frameIndex).toBe(0);
  });

  it('resets when the clip changes', () => {
    const state = creatingWorldPlazaDeclarativeAnimationPlaybackState(
      { clipId: 'test-loop', variantKey: 'a' },
      clip
    );

    const nextState = advancingWorldPlazaDeclarativeAnimationPlayback({
      state: { ...state, frameIndex: 2 },
      request: { clipId: 'test-loop', variantKey: 'b', playing: true },
      clip,
      deltaMs: 16,
    });

    expect(nextState.variantKey).toBe('b');
    expect(nextState.frameIndex).toBe(0);
  });

  it('keeps a steady frame cadence when randomizePhase is enabled', () => {
    const phasedClip = buildingWorldPlazaAnimationClipFromFrameList({
      clipId: 'test-phased-loop',
      resolveFrames: () => [{}, {}, {}] as never,
      frameDurationMs: 100,
      playbackMode: 'loop',
      randomizePhase: true,
    });
    let state = creatingWorldPlazaDeclarativeAnimationPlaybackState(
      { clipId: 'test-phased-loop' },
      phasedClip,
      42
    );

    expect(state.elapsedMs).toBeGreaterThan(0);
    expect(state.elapsedMs).toBeLessThan(100);

    state = advancingWorldPlazaDeclarativeAnimationPlayback({
      state,
      request: { clipId: 'test-phased-loop', playing: true },
      clip: phasedClip,
      deltaMs: 100 - state.elapsedMs,
    });
    expect(state.frameIndex).toBe(1);

    state = advancingWorldPlazaDeclarativeAnimationPlayback({
      state,
      request: { clipId: 'test-phased-loop', playing: true },
      clip: phasedClip,
      deltaMs: 100,
    });
    expect(state.frameIndex).toBe(2);
  });
});

describe('resolvingWorldPlazaDeclarativeAnimationFrameAtTime', () => {
  const clip = buildingWorldPlazaAnimationClipFromFrameList({
    clipId: 'test-time',
    resolveFrames: () => [{}, {}, {}, {}] as never,
    frameDurationMs: 50,
    playbackMode: 'loop',
  });

  it('selects frames from a global clock', () => {
    const frame = resolvingWorldPlazaDeclarativeAnimationFrameAtTime(
      { clipId: 'test-time' },
      clip,
      125
    );

    expect(frame.frameIndex).toBe(2);
  });
});
