import {
  DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_CLIP_POOL_BY_TOOL_ACTION,
  type DefiningWorldPlazaEquipmentSfxClipId,
} from '@/components/world/equipment/domains/definingWorldPlazaEquipmentSfxConstants';
import { resolvingWorldPlazaEquipmentSfxStarAudioId } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentSfxStarAudioId';
import { resolvingWorldPlazaEquipmentSfxUrl } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentSfxUrl';
import type { Manifest } from '@/components/world/audio/definingWorldPlazaAudioTypes';

/**
 * Builds the star-audio preload manifest for every shipped equipment hit clip.
 */
export function buildingWorldPlazaEquipmentStarAudioManifest(): Manifest {
  const manifest: Manifest = {};
  const uniqueClipIds = new Set<DefiningWorldPlazaEquipmentSfxClipId>();

  for (const clipPool of Object.values(
    DEFINING_WORLD_PLAZA_EQUIPMENT_SFX_CLIP_POOL_BY_TOOL_ACTION
  )) {
    for (const clipId of clipPool) {
      uniqueClipIds.add(clipId);
    }
  }

  for (const clipId of uniqueClipIds) {
    manifest[resolvingWorldPlazaEquipmentSfxStarAudioId(clipId)] = {
      src: resolvingWorldPlazaEquipmentSfxUrl(clipId),
      group: 'sfx',
    };
  }

  return manifest;
}
