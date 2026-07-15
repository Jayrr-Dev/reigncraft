import {
  DEFINING_WORLD_PLAZA_DEATH_SFX_ASSET_BASE_URL,
  type DefiningWorldPlazaDeathSfxClipId,
} from '@/components/world/audio/lifecycle/definingWorldPlazaDeathSfxConstants';

const DEFINING_WORLD_PLAZA_DEATH_SFX_FILE_NAME_BY_CLIP_ID: Record<
  DefiningWorldPlazaDeathSfxClipId,
  string
> = {
  impact_boom: 'impact-boom-008.ogg',
};

/**
 * Builds a browser-safe public URL for one player-death clip.
 */
export function resolvingWorldPlazaDeathSfxUrl(
  clipId: DefiningWorldPlazaDeathSfxClipId
): string {
  const encodedBaseUrl = DEFINING_WORLD_PLAZA_DEATH_SFX_ASSET_BASE_URL.split(
    '/'
  )
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(DEFINING_WORLD_PLAZA_DEATH_SFX_FILE_NAME_BY_CLIP_ID[clipId])}`;
}
