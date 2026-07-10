import { buildingWorldPlazaAvatarFootstepStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaAvatarFootstepStarAudioManifest';
import { buildingWorldPlazaAvatarMeleeStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaAvatarMeleeStarAudioManifest';
import { buildingWorldPlazaBiomeMusicStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaBiomeMusicStarAudioManifest';
import { buildingWorldPlazaGirlSampleVoiceStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaGirlSampleVoiceStarAudioManifest';
import { buildingWildlifeOmegaWolfStarAudioManifest } from '@/components/world/wildlife/domains/buildingWildlifeOmegaWolfStarAudioManifest';
import type { Manifest } from 'star-audio';

/** Builds one star-audio preload manifest slice for world boot. */
export type DefiningWorldPlazaWorldBootStarAudioManifestBuilder =
  () => Manifest;

/**
 * Ordered manifest builders warmed during world boot.
 *
 * Biome music is listed first because it is the largest slice and dominates
 * download time on slow connections.
 */
export const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MANIFEST_BUILDERS: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] =
  [
    buildingWorldPlazaBiomeMusicStarAudioManifest,
    buildingWorldPlazaAvatarFootstepStarAudioManifest,
    buildingWorldPlazaAvatarMeleeStarAudioManifest,
    buildingWorldPlazaGirlSampleVoiceStarAudioManifest,
    buildingWildlifeOmegaWolfStarAudioManifest,
  ];
