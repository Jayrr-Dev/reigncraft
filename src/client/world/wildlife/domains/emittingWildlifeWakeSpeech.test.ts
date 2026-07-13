import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeSpeciesSpeechLines } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSpeechRegistry';
import { emittingWildlifeWakeSpeech } from '@/components/world/wildlife/domains/emittingWildlifeWakeSpeech';
import { resolvingWildlifeSpeechLineText } from '@/components/world/wildlife/domains/resolvingWildlifeSpeechLinePresentation';
import { describe, expect, it } from 'vitest';

describe('emittingWildlifeWakeSpeech', () => {
  it('shows a wake bubble for the species', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'cow',
      position: { x: 2.2, y: 3.4, layer: 1 },
    });

    const speechState = emittingWildlifeWakeSpeech({
      instance,
      nowMs: 5_000,
    });

    expect(speechState.activeBubble).not.toBeNull();
    expect(speechState.lastContextKey).toBe('wake');
    expect(speechState.activeBubble?.message).toMatch(/\?!/);
  });

  it('gives every registered species at least one unique wake line', () => {
    const firstWakeBySpecies = new Map<string, string>();

    for (const speciesId of Object.keys(DEFINING_WILDLIFE_SPECIES_REGISTRY)) {
      const lines = resolvingWildlifeSpeciesSpeechLines(speciesId, 'wake');
      expect(lines.length, speciesId).toBeGreaterThan(0);

      const firstLine = resolvingWildlifeSpeechLineText(lines[0]!);
      expect(firstLine.length, speciesId).toBeGreaterThan(0);

      const priorSpecies = firstWakeBySpecies.get(firstLine);
      expect(
        priorSpecies,
        `wake line ${JSON.stringify(firstLine)} shared by ${priorSpecies} and ${speciesId}`
      ).toBeUndefined();
      firstWakeBySpecies.set(firstLine, speciesId);
    }
  });
});
