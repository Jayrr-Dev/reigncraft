/**
 * Resolves speech lines for one wildlife instance (god spawn → human taunts).
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpeechLinesForInstance
 */

import { checkingWildlifeIsGodSpawn } from '@/components/world/wildlife/domains/checkingWildlifeIsGodSpawn';
import { DEFINING_WILDLIFE_GOD_SPAWN_SPEECH_LINES } from '@/components/world/wildlife/domains/definingWildlifeGodSpawnConstants';
import {
  resolvingWildlifeSpeciesSpeechLines,
  resolvingWildlifeSpeciesSpeechLinesOnly,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesSpeechRegistry';
import type { DefiningWildlifeSpeechContextKind } from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type { DefiningWildlifeSpeechLine } from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Species + shared lines, or god-spawn human taunts for every context.
 */
export function resolvingWildlifeSpeechLinesForInstance(
  instance: Pick<DefiningWildlifeInstance, 'speciesId' | 'isGodSpawn'>,
  context: DefiningWildlifeSpeechContextKind
): readonly DefiningWildlifeSpeechLine[] {
  if (checkingWildlifeIsGodSpawn(instance)) {
    return DEFINING_WILDLIFE_GOD_SPAWN_SPEECH_LINES;
  }

  return resolvingWildlifeSpeciesSpeechLines(instance.speciesId, context);
}

/**
 * Species-only lines (no shared fallbacks), or god-spawn human taunts.
 */
export function resolvingWildlifeSpeechLinesOnlyForInstance(
  instance: Pick<DefiningWildlifeInstance, 'speciesId' | 'isGodSpawn'>,
  context: DefiningWildlifeSpeechContextKind
): readonly DefiningWildlifeSpeechLine[] {
  if (checkingWildlifeIsGodSpawn(instance)) {
    return DEFINING_WILDLIFE_GOD_SPAWN_SPEECH_LINES;
  }

  return resolvingWildlifeSpeciesSpeechLinesOnly(instance.speciesId, context);
}
