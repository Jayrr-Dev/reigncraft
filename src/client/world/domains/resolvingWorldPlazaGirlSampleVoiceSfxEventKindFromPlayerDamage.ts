import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_DAMAGE_OUTCOME_TIERS,
  type DefiningWorldPlazaGirlSampleVoiceSfxEventKind,
} from '@/components/world/domains/definingWorldPlazaGirlSampleVoiceSfxConstants';
import type { DefiningWorldPlazaEntityHealthDamageOptions } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Maps incoming player damage to a girl voice event, or null when silent.
 */
export function resolvingWorldPlazaGirlSampleVoiceSfxEventKindFromPlayerDamage(
  outcomeTier: string | null,
  healthDamage: number,
  options?: Pick<DefiningWorldPlazaEntityHealthDamageOptions, 'skipDamageRoll'>
): DefiningWorldPlazaGirlSampleVoiceSfxEventKind | null {
  if (healthDamage <= 0 || options?.skipDamageRoll === true) {
    return null;
  }

  if (
    outcomeTier !== null &&
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_DAMAGE_OUTCOME_TIERS.includes(
      outcomeTier as (typeof DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_DAMAGE_OUTCOME_TIERS)[number]
    )
  ) {
    return 'pain';
  }

  return 'hit_taken';
}
