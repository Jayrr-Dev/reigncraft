import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_CLIP_IDS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_HIT_SHORT_SFX_CLIP_IDS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_JUMP_SFX_CLIP_IDS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_SFX_CLIP_IDS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ROLL_SFX_CLIP_IDS,
  type DefiningWorldPlazaGirlSampleVoiceClipId,
  type DefiningWorldPlazaGirlSampleVoiceSfxEventKind,
} from '@/components/world/domains/definingWorldPlazaGirlSampleVoiceSfxConstants';

const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_SFX_CLIP_POOL_BY_EVENT: Record<
  DefiningWorldPlazaGirlSampleVoiceSfxEventKind,
  readonly DefiningWorldPlazaGirlSampleVoiceClipId[]
> = {
  attack_swing: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_CLIP_IDS,
  jump_takeoff: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_JUMP_SFX_CLIP_IDS,
  roll_dodge: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ROLL_SFX_CLIP_IDS,
  hit_taken: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_HIT_SHORT_SFX_CLIP_IDS,
  pain: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_SFX_CLIP_IDS,
};

/**
 * Resolves the clip id for one girl voice event and rotation index.
 */
export function resolvingWorldPlazaGirlSampleVoiceSfxClipId(
  eventKind: DefiningWorldPlazaGirlSampleVoiceSfxEventKind,
  rotationIndex: number
): DefiningWorldPlazaGirlSampleVoiceClipId {
  const pool =
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_SFX_CLIP_POOL_BY_EVENT[eventKind];

  return pool[rotationIndex % pool.length] ?? pool[0];
}

/**
 * Returns pool length for one girl voice event kind.
 */
export function resolvingWorldPlazaGirlSampleVoiceSfxClipPoolLength(
  eventKind: DefiningWorldPlazaGirlSampleVoiceSfxEventKind
): number {
  return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_SFX_CLIP_POOL_BY_EVENT[
    eventKind
  ].length;
}
