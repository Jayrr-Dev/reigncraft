import {
  DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_ASSET_BASE_URL,
  type DefiningWorldPlazaEquipmentSfxClipId,
} from '@/components/world/equipment/domains/definingWorldPlazaEquipmentSfxConstants';

/**
 * Maps a clip id (`wood_hit_01`) to its shipped filename (`wood-hit-01.wav`).
 */
export function formattingWorldPlazaEquipmentSfxFileName(
  clipId: DefiningWorldPlazaEquipmentSfxClipId
): string {
  return `${clipId.replaceAll('_', '-')}.wav`;
}

/**
 * Builds a browser-safe public URL for one FilmCow equipment clip.
 */
export function resolvingWorldPlazaEquipmentSfxUrl(
  clipId: DefiningWorldPlazaEquipmentSfxClipId
): string {
  const encodedBaseUrl =
    DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_ASSET_BASE_URL.split('/')
      .filter((segment) => segment.length > 0)
      .map((segment) => encodeURIComponent(segment))
      .join('/');

  return `/${encodedBaseUrl}/${encodeURIComponent(formattingWorldPlazaEquipmentSfxFileName(clipId))}`;
}
