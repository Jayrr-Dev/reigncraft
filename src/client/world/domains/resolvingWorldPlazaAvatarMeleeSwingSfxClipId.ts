import { resolvingWorldPlazaSfxClipEntryId } from '@/components/world/audio/resolvingWorldPlazaSfxClipEntry';
import {
  DEFINING_WORLD_PLAZA_AVATAR_MELEE_SWING_COMBO_CLIP_IDS,
  type DefiningWorldPlazaAvatarMeleeClipId,
} from '@/components/world/domains/definingWorldPlazaAvatarMeleeSfxConstants';

/**
 * Resolves the next swing wind-up clip entry in the 1-1-2 combo cycle.
 */
export function resolvingWorldPlazaAvatarMeleeSwingSfxClipEntry(
  comboIndex: number
) {
  const normalizedIndex =
    ((comboIndex %
      DEFINING_WORLD_PLAZA_AVATAR_MELEE_SWING_COMBO_CLIP_IDS.length) +
      DEFINING_WORLD_PLAZA_AVATAR_MELEE_SWING_COMBO_CLIP_IDS.length) %
    DEFINING_WORLD_PLAZA_AVATAR_MELEE_SWING_COMBO_CLIP_IDS.length;

  return DEFINING_WORLD_PLAZA_AVATAR_MELEE_SWING_COMBO_CLIP_IDS[
    normalizedIndex
  ];
}

/**
 * Resolves the next swing wind-up clip in the 1-1-2 combo cycle.
 */
export function resolvingWorldPlazaAvatarMeleeSwingSfxClipId(
  comboIndex: number
): DefiningWorldPlazaAvatarMeleeClipId {
  return resolvingWorldPlazaSfxClipEntryId(
    resolvingWorldPlazaAvatarMeleeSwingSfxClipEntry(comboIndex)
  );
}

/**
 * Returns the combo index to use after one swing clip plays.
 */
export function resolvingWorldPlazaAvatarMeleeSwingComboIndexAfterSwing(
  comboIndex: number
): number {
  return comboIndex + 1;
}
