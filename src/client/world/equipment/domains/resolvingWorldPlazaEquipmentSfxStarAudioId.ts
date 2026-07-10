import type { DefiningWorldPlazaEquipmentSfxClipId } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentSfxConstants';

/** Prefix for equipment impact ids inside the star-audio manifest. */
export const DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_STAR_AUDIO_ID_PREFIX =
  'equipment-hit.' as const;

/**
 * Maps one equipment clip id to a star-audio manifest key.
 */
export function resolvingWorldPlazaEquipmentSfxStarAudioId(
  clipId: DefiningWorldPlazaEquipmentSfxClipId
): string {
  return `${DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_STAR_AUDIO_ID_PREFIX}${clipId}`;
}
