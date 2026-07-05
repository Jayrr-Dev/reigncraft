import type {
  AdvancingWorldPlazaDeclarativeAnimationPlaybackState,
  DefiningWorldPlazaAnimationClipDefinition,
  DefiningWorldPlazaAnimationPlaybackRequest,
} from '@/components/world/animation/domains/definingWorldPlazaAnimationTypes';

/**
 * Creates a fresh playback state for a new clip or variant.
 *
 * @param request - Declarative playback request.
 * @param clip - Registered clip definition.
 * @param nowMs - Monotonic clock for optional phase randomization.
 */
export function creatingWorldPlazaDeclarativeAnimationPlaybackState(
  request: DefiningWorldPlazaAnimationPlaybackRequest,
  clip: DefiningWorldPlazaAnimationClipDefinition,
  nowMs = 0
): AdvancingWorldPlazaDeclarativeAnimationPlaybackState {
  const variantKey = request.variantKey ?? '';
  const frameDurationMs = resolvingWorldPlazaAnimationClipFrameDurationMs(clip);
  const initialElapsedMs = clip.randomizePhase
    ? (Math.sin(nowMs * 0.001 + variantKey.length) * 0.5 + 0.5) *
      frameDurationMs
    : 0;

  return {
    clipId: request.clipId,
    variantKey,
    frameIndex: 0,
    elapsedMs: initialElapsedMs,
    pingPongDirection: 1,
    isComplete: false,
    phaseOffsetMs: 0,
  };
}

function resolvingWorldPlazaAnimationClipFrameDurationMs(
  clip: DefiningWorldPlazaAnimationClipDefinition
): number {
  if (clip.frameDurationMs !== undefined && clip.frameDurationMs > 0) {
    return clip.frameDurationMs;
  }

  if (clip.fps !== undefined && clip.fps > 0) {
    return 1000 / clip.fps;
  }

  return 1000 / 8;
}

function checkingWorldPlazaAnimationPlaybackRequestMatchesState(
  request: DefiningWorldPlazaAnimationPlaybackRequest,
  state: AdvancingWorldPlazaDeclarativeAnimationPlaybackState
): boolean {
  return (
    request.clipId === state.clipId &&
    (request.variantKey ?? '') === state.variantKey
  );
}

/**
 * Advances one declarative playback state by `deltaMs`.
 *
 * @param input - Current state, playback request, clip, and frame delta.
 */
export function advancingWorldPlazaDeclarativeAnimationPlayback(input: {
  readonly state: AdvancingWorldPlazaDeclarativeAnimationPlaybackState;
  readonly request: DefiningWorldPlazaAnimationPlaybackRequest;
  readonly clip: DefiningWorldPlazaAnimationClipDefinition;
  readonly deltaMs: number;
  readonly nowMs?: number;
}): AdvancingWorldPlazaDeclarativeAnimationPlaybackState {
  const { request, clip, deltaMs } = input;

  if (
    !checkingWorldPlazaAnimationPlaybackRequestMatchesState(
      request,
      input.state
    )
  ) {
    return creatingWorldPlazaDeclarativeAnimationPlaybackState(
      request,
      clip,
      input.nowMs ?? 0
    );
  }

  const frames = clip.resolveFrames(input.state.variantKey) ?? [];

  if (frames.length === 0 || request.playing === false) {
    return input.state;
  }

  const playbackMode = clip.playbackMode ?? 'loop';
  const frameDurationMs = resolvingWorldPlazaAnimationClipFrameDurationMs(clip);
  const nextState: AdvancingWorldPlazaDeclarativeAnimationPlaybackState = {
    ...input.state,
    elapsedMs: input.state.elapsedMs + deltaMs,
    isComplete: false,
  };

  while (nextState.elapsedMs >= frameDurationMs && !nextState.isComplete) {
    nextState.elapsedMs -= frameDurationMs;

    if (playbackMode === 'ping-pong') {
      const atEnd =
        nextState.pingPongDirection === 1 &&
        nextState.frameIndex >= frames.length - 1;
      const atStart =
        nextState.pingPongDirection === -1 && nextState.frameIndex <= 0;

      if (atEnd) {
        nextState.pingPongDirection = -1;
        nextState.frameIndex = Math.max(0, frames.length - 2);
        continue;
      }

      if (atStart) {
        nextState.pingPongDirection = 1;
        nextState.frameIndex = Math.min(frames.length - 1, 1);
        continue;
      }

      nextState.frameIndex += nextState.pingPongDirection;
      continue;
    }

    const isLastFrame = nextState.frameIndex >= frames.length - 1;

    if (playbackMode === 'once' || playbackMode === 'hold-last') {
      if (isLastFrame) {
        nextState.isComplete = true;
        break;
      }

      nextState.frameIndex += 1;

      if (
        playbackMode === 'once' &&
        nextState.frameIndex >= frames.length - 1
      ) {
        nextState.isComplete = true;
      }

      continue;
    }

    nextState.frameIndex = (nextState.frameIndex + 1) % frames.length;
  }

  return nextState;
}

/**
 * Resolves the frame duration for a clip in milliseconds.
 */
export function resolvingWorldPlazaDeclarativeAnimationClipFrameDurationMs(
  clip: DefiningWorldPlazaAnimationClipDefinition
): number {
  return resolvingWorldPlazaAnimationClipFrameDurationMs(clip);
}
