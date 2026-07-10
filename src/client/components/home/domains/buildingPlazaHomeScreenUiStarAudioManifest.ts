import { buildingPlazaBookStarAudioManifest } from '@/components/home/domains/buildingPlazaBookStarAudioManifest';
import { buildingPlazaHomeScreenButtonStarAudioManifest } from '@/components/home/domains/buildingPlazaHomeScreenButtonStarAudioManifest';
import type { Manifest } from 'star-audio';

/**
 * Star-audio manifest for every home menu UI click clip (book + chest-close).
 */
export function buildingPlazaHomeScreenUiStarAudioManifest(): Manifest {
  return {
    ...buildingPlazaBookStarAudioManifest(),
    ...buildingPlazaHomeScreenButtonStarAudioManifest(),
  };
}
