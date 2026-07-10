import { buildingWorldPlazaAvatarFootstepBootPriorityStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaAvatarFootstepStarAudioManifest';
import { buildingWorldPlazaAvatarMeleeStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaAvatarMeleeStarAudioManifest';
import { buildingWorldPlazaBiomeAmbienceStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaBiomeAmbienceStarAudioManifest';
import { buildingWorldPlazaGirlSampleVoiceStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaGirlSampleVoiceStarAudioManifest';
import type { Manifest } from 'star-audio';

/** Builds one star-audio preload manifest slice for world boot. */
export type DefiningWorldPlazaWorldBootStarAudioManifestBuilder =
  () => Manifest;

/**
 * Immediate gameplay feedback warmed before the loading bar completes.
 *
 * Order: footsteps for common surfaces, ambience beds, then avatar voice and
 * melee one-shots.
 */
export const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_PRIORITY_MANIFEST_BUILDERS: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] =
  [
    buildingWorldPlazaAvatarFootstepBootPriorityStarAudioManifest,
    buildingWorldPlazaBiomeAmbienceStarAudioManifest,
    buildingWorldPlazaGirlSampleVoiceStarAudioManifest,
    buildingWorldPlazaAvatarMeleeStarAudioManifest,
  ];

/**
 * Optional background boot slices. Heavy or situational audio now lazy-loads
 * from runtime hooks when the player needs it.
 */
export const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_DEFERRED_MANIFEST_BUILDERS: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] =
  [];

/**
 * Full ordered manifest builders warmed during world boot.
 */
export const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MANIFEST_BUILDERS: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] =
  [
    ...DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_PRIORITY_MANIFEST_BUILDERS,
    ...DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_DEFERRED_MANIFEST_BUILDERS,
  ];
