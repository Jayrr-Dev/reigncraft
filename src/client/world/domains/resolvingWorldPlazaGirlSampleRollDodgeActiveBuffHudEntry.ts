import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MAX_DAMAGE_REDUCTION_RATIO,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MIN_DAMAGE_REDUCTION_RATIO,
} from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_BUFF_HUD_ICON,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_BUFF_ID,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_BUFF_LABEL,
} from '@/components/world/domains/definingWorldPlazaGirlSampleRollDodgeBuffConstants';
import type { DefiningWorldPlazaEntityActiveBuffHudEntry } from '@/components/world/health/domains/listingWorldPlazaEntityActiveBuffHudEntries';

/**
 * Ephemeral roll-dodge buff row entry for the local player health HUD.
 */
export function resolvingWorldPlazaGirlSampleRollDodgeActiveBuffHudEntry({
  isRolling,
}: {
  isRolling: boolean;
}): DefiningWorldPlazaEntityActiveBuffHudEntry | null {
  if (!isRolling) {
    return null;
  }

  const minReductionPercent = Math.round(
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MIN_DAMAGE_REDUCTION_RATIO * 100
  );
  const maxReductionPercent = Math.round(
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_MAX_DAMAGE_REDUCTION_RATIO * 100
  );

  return {
    id: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_BUFF_ID,
    label: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_BUFF_LABEL,
    description: `${minReductionPercent}-${maxReductionPercent}% physical damage reduction while rolling (peaks mid-dodge). No stagger.`,
    polarity: 'buff',
    icon: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_DODGE_BUFF_HUD_ICON,
    expiresAtMs: null,
  };
}
