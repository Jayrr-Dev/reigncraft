import { buildingPlazaBookStarAudioManifest } from '@/components/home/domains/buildingPlazaBookStarAudioManifest';
import {
  buildingWorldPlazaAvatarFootstepBootPriorityStarAudioManifest,
  buildingWorldPlazaAvatarFootstepDeferredStarAudioManifest,
} from '@/components/world/domains/buildingWorldPlazaAvatarFootstepStarAudioManifest';
import { buildingWorldPlazaAvatarMeleeStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaAvatarMeleeStarAudioManifest';
import { buildingWorldPlazaBiomeAmbienceStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaBiomeAmbienceStarAudioManifest';
import { buildingWorldPlazaBiomeMusicStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaBiomeMusicStarAudioManifest';
import { buildingWorldPlazaGirlSampleVoiceStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaGirlSampleVoiceStarAudioManifest';
import { buildingWorldPlazaEquipmentStarAudioManifest } from '@/components/world/equipment/domains/buildingWorldPlazaEquipmentStarAudioManifest';
import { buildingWorldPlazaCampfireAmbienceStarAudioManifest } from '@/components/world/fire/domains/buildingWorldPlazaCampfireAmbienceStarAudioManifest';
import { buildingWorldPlazaInventoryBagStarAudioManifest } from '@/components/world/inventory/domains/buildingWorldPlazaInventoryBagStarAudioManifest';
import { buildingWildlifeOmegaWolfStarAudioManifest } from '@/components/world/wildlife/domains/buildingWildlifeOmegaWolfStarAudioManifest';
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
 * Larger or situational slices warmed in the background after boot.
 *
 * Biome music is the heaviest slice and stays out of the critical path.
 */
export const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_DEFERRED_MANIFEST_BUILDERS: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] =
  [
    buildingWorldPlazaAvatarFootstepDeferredStarAudioManifest,
    buildingWorldPlazaBiomeMusicStarAudioManifest,
    buildingWildlifeOmegaWolfStarAudioManifest,
    buildingWorldPlazaEquipmentStarAudioManifest,
    buildingWorldPlazaCampfireAmbienceStarAudioManifest,
    buildingWorldPlazaInventoryBagStarAudioManifest,
    buildingPlazaBookStarAudioManifest,
  ];

/**
 * Full ordered manifest builders warmed during world boot.
 */
export const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MANIFEST_BUILDERS: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] =
  [
    ...DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_PRIORITY_MANIFEST_BUILDERS,
    ...DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_DEFERRED_MANIFEST_BUILDERS,
  ];
