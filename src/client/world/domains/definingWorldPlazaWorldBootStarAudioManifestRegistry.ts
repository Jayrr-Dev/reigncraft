import { buildingWorldPlazaAvatarFootstepBootPriorityStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaAvatarFootstepStarAudioManifest';
import { buildingWorldPlazaAvatarMeleeStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaAvatarMeleeStarAudioManifest';
import { buildingWorldPlazaBiomeAmbienceStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaBiomeAmbienceStarAudioManifest';
import { buildingWorldPlazaBiomeMusicBootStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaBiomeMusicBootStarAudioManifest';
import { buildingWorldPlazaGirlSampleVoiceStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaGirlSampleVoiceStarAudioManifest';
import { buildingWildlifeBootSpeciesStarAudioManifest } from '@/components/world/wildlife/domains/buildingWildlifeBootSpeciesStarAudioManifest';
import type { Manifest } from 'star-audio';

/** Builds one star-audio preload manifest slice for world boot. */
export type DefiningWorldPlazaWorldBootStarAudioManifestBuilder =
  () => Manifest;

/**
 * Immediate gameplay feedback warmed before the loading bar completes.
 *
 * Order: spawn-biome music first (keep BGM continuous from title), then
 * footsteps, ambience beds, avatar voice and melee one-shots, then boot-biome
 * wildlife vocals (same roster as texture warm-up).
 */
export const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_PRIORITY_MANIFEST_BUILDERS: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] =
  [
    buildingWorldPlazaBiomeMusicBootStarAudioManifest,
    buildingWorldPlazaAvatarFootstepBootPriorityStarAudioManifest,
    buildingWorldPlazaBiomeAmbienceStarAudioManifest,
    buildingWorldPlazaGirlSampleVoiceStarAudioManifest,
    buildingWorldPlazaAvatarMeleeStarAudioManifest,
    buildingWildlifeBootSpeciesStarAudioManifest,
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
