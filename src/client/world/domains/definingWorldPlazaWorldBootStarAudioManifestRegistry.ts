import {
  buildingWorldPlazaAvatarFootstepBootPriorityStarAudioManifest,
  buildingWorldPlazaAvatarFootstepDeferredStarAudioManifest,
} from '@/components/world/domains/buildingWorldPlazaAvatarFootstepStarAudioManifest';
import { buildingWorldPlazaBiomeMusicBootStarAudioManifest } from '@/components/world/domains/buildingWorldPlazaBiomeMusicBootStarAudioManifest';
import { checkingWildlifeTextureEvictionMobileViewport } from '@/components/world/wildlife/domains/resolvingWildlifeTextureEvictionProfile';
import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';

/** Builds one star-audio preload manifest slice for world boot. */
export type DefiningWorldPlazaWorldBootStarAudioManifestBuilder =
  () => Manifest;

/**
 * Immediate gameplay feedback warmed before the loading bar completes
 * on desktop / wide viewports.
 *
 * Only continuous music and immediate locomotion block entry. Biome ambience,
 * selected-avatar voice, combat, and nearby wildlife load from scene scopes.
 */
const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_DESKTOP_PRIORITY_MANIFEST_BUILDERS: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] =
  [
    buildingWorldPlazaBiomeMusicBootStarAudioManifest,
    buildingWorldPlazaAvatarFootstepBootPriorityStarAudioManifest,
  ];

/**
 * Mobile priority: music + spawn footsteps only. Extra SFX warm in the
 * deferred background slice so HTML5 Audio pool exhaustion cannot soft-lock
 * the bar at ~79%.
 */
const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MOBILE_PRIORITY_MANIFEST_BUILDERS: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] =
  [
    buildingWorldPlazaBiomeMusicBootStarAudioManifest,
    buildingWorldPlazaAvatarFootstepBootPriorityStarAudioManifest,
  ];

const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MOBILE_DEFERRED_MANIFEST_BUILDERS: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] =
  [buildingWorldPlazaAvatarFootstepDeferredStarAudioManifest];

/** Non-spawn avatar surfaces warm after desktop boot without blocking it. */
const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_DESKTOP_DEFERRED_MANIFEST_BUILDERS: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] =
  [buildingWorldPlazaAvatarFootstepDeferredStarAudioManifest];

/**
 * Immediate gameplay feedback warmed before the loading bar completes.
 *
 * @deprecated Prefer `resolvingWorldPlazaWorldBootStarAudioPriorityManifestBuilders`
 * so mobile can slim the blocking set. Kept for callers that need a static list.
 */
export const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_PRIORITY_MANIFEST_BUILDERS: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] =
  DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_DESKTOP_PRIORITY_MANIFEST_BUILDERS;

/**
 * Optional background boot slices. Heavy or situational audio now lazy-loads
 * from runtime hooks when the player needs it (desktop default is empty;
 * mobile moves non-essential slices here).
 */
export const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_DEFERRED_MANIFEST_BUILDERS: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] =
  DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_DESKTOP_DEFERRED_MANIFEST_BUILDERS;

/**
 * Priority slices that block the loading bar for the current viewport.
 */
export function resolvingWorldPlazaWorldBootStarAudioPriorityManifestBuilders(): readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] {
  if (checkingWildlifeTextureEvictionMobileViewport()) {
    return DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MOBILE_PRIORITY_MANIFEST_BUILDERS;
  }

  return DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_DESKTOP_PRIORITY_MANIFEST_BUILDERS;
}

/**
 * Background slices that continue after the loading bar completes.
 */
export function resolvingWorldPlazaWorldBootStarAudioDeferredManifestBuilders(): readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] {
  if (checkingWildlifeTextureEvictionMobileViewport()) {
    return DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MOBILE_DEFERRED_MANIFEST_BUILDERS;
  }

  return DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_DEFERRED_MANIFEST_BUILDERS;
}

/**
 * Full ordered manifest builders warmed during world boot for the viewport.
 */
export function resolvingWorldPlazaWorldBootStarAudioManifestBuilders(): readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] {
  return [
    ...resolvingWorldPlazaWorldBootStarAudioPriorityManifestBuilders(),
    ...resolvingWorldPlazaWorldBootStarAudioDeferredManifestBuilders(),
  ];
}

/**
 * Full ordered manifest builders warmed during world boot.
 *
 * @deprecated Prefer `resolvingWorldPlazaWorldBootStarAudioManifestBuilders`.
 */
export const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MANIFEST_BUILDERS: readonly DefiningWorldPlazaWorldBootStarAudioManifestBuilder[] =
  [
    ...DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_PRIORITY_MANIFEST_BUILDERS,
    ...DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_DEFERRED_MANIFEST_BUILDERS,
  ];
