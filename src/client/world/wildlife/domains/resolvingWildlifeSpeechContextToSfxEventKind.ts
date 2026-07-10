import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';
import type { DefiningWildlifeSpeechContextKind } from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';

/**
 * Maps a speech bubble context to a species vocal event kind.
 */
export function resolvingWildlifeSpeechContextToSfxEventKind(
  context: DefiningWildlifeSpeechContextKind | 'sleep' | string,
  isContextEnter: boolean
): DefiningWildlifeSpeciesSfxEventKind | null {
  if (context === 'sleep') {
    return 'sleep';
  }

  if (context === 'neutral') {
    return 'idle_ambient';
  }

  if (context === 'friendly') {
    return 'friendly';
  }

  if (context === 'eating') {
    return 'idle_eating';
  }

  if (context === 'flee') {
    return isContextEnter ? 'flee_start' : 'flee_mid';
  }

  if (context === 'chase') {
    return 'chase_call';
  }

  if (context === 'attack') {
    return 'attack';
  }

  if (context === 'warn' || context === 'eatingAggressive') {
    return 'warn';
  }

  if (context === 'stalk') {
    return 'stalk';
  }

  if (context === 'howl') {
    return 'howl';
  }

  if (context === 'wake') {
    return 'wake';
  }

  return null;
}
