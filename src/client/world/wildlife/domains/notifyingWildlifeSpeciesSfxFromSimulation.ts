/**
 * Emits species vocal SFX when speech bubbles fire or intents shift.
 *
 * @module components/world/wildlife/domains/notifyingWildlifeSpeciesSfxFromSimulation
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeSpeciesSfxEventEnabled } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxProfileRegistry';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeSpeechState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { notifyingWildlifeSpeciesSfxEvent } from '@/components/world/wildlife/domains/notifyingWildlifeSpeciesSfxEvent';
import { resolvingWildlifeSpeechContextToSfxEventKind } from '@/components/world/wildlife/domains/resolvingWildlifeSpeechContextToSfxEventKind';

export type NotifyingWildlifeSpeciesSfxFromSpeechEmissionParams = {
  instanceId: string;
  speciesId: string;
  worldPoint: DefiningWorldPlazaWorldPoint;
  previousSpeechState: DefiningWildlifeSpeechState | null | undefined;
  nextSpeechState: DefiningWildlifeSpeechState;
};

/**
 * Plays a species vocal when a new speech bubble was emitted this tick.
 */
export function notifyingWildlifeSpeciesSfxFromSpeechEmission({
  instanceId,
  speciesId,
  worldPoint,
  previousSpeechState,
  nextSpeechState,
}: NotifyingWildlifeSpeciesSfxFromSpeechEmissionParams): void {
  const didEmitSpeech =
    nextSpeechState.lastEmittedAtMs !== null &&
    nextSpeechState.lastEmittedAtMs !== previousSpeechState?.lastEmittedAtMs;

  if (!didEmitSpeech) {
    return;
  }

  const contextKey = nextSpeechState.lastContextKey;

  if (contextKey === null) {
    return;
  }

  const isContextEnter =
    previousSpeechState?.lastContextKey !== contextKey ||
    previousSpeechState?.lastEmittedAtMs !== nextSpeechState.lastEmittedAtMs;
  const eventKind = resolvingWildlifeSpeechContextToSfxEventKind(
    contextKey,
    isContextEnter
  );

  if (eventKind === null) {
    return;
  }

  if (!checkingWildlifeSpeciesSfxEventEnabled(speciesId, eventKind)) {
    return;
  }

  notifyingWildlifeSpeciesSfxEvent({
    instanceId,
    speciesId,
    eventKind,
    worldPoint,
  });
}

export type NotifyingWildlifeSpeciesSfxOnIntentTransitionParams = {
  instanceId: string;
  speciesId: string;
  worldPoint: DefiningWorldPlazaWorldPoint;
  previousIntentMode: DefiningWildlifeBehaviorIntent['mode'];
  nextIntentMode: DefiningWildlifeBehaviorIntent['mode'];
};

/**
 * Plays edge-triggered species vocals on intent mode changes.
 */
export function notifyingWildlifeSpeciesSfxOnIntentTransition({
  instanceId,
  speciesId,
  worldPoint,
  previousIntentMode,
  nextIntentMode,
}: NotifyingWildlifeSpeciesSfxOnIntentTransitionParams): void {
  if (previousIntentMode === nextIntentMode) {
    return;
  }

  if (
    nextIntentMode === 'flee' &&
    previousIntentMode !== 'flee' &&
    checkingWildlifeSpeciesSfxEventEnabled(speciesId, 'flee_start')
  ) {
    notifyingWildlifeSpeciesSfxEvent({
      instanceId,
      speciesId,
      eventKind: 'flee_start',
      worldPoint,
    });
    return;
  }

  if (
    nextIntentMode === 'territoryWarn' &&
    previousIntentMode !== 'territoryWarn' &&
    checkingWildlifeSpeciesSfxEventEnabled(speciesId, 'warn')
  ) {
    notifyingWildlifeSpeciesSfxEvent({
      instanceId,
      speciesId,
      eventKind: 'warn',
      worldPoint,
    });
    return;
  }

  if (
    nextIntentMode === 'chase' &&
    previousIntentMode !== 'chase' &&
    checkingWildlifeSpeciesSfxEventEnabled(speciesId, 'chase_call')
  ) {
    notifyingWildlifeSpeciesSfxEvent({
      instanceId,
      speciesId,
      eventKind: 'chase_call',
      worldPoint,
    });
    return;
  }

  if (
    nextIntentMode === 'stalk' &&
    previousIntentMode !== 'stalk' &&
    checkingWildlifeSpeciesSfxEventEnabled(speciesId, 'stalk')
  ) {
    notifyingWildlifeSpeciesSfxEvent({
      instanceId,
      speciesId,
      eventKind: 'stalk',
      worldPoint,
    });
  }
}
