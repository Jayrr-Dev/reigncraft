import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_CLIP_IDS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_HIT_SHORT_SFX_CLIP_IDS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_SFX_CLIP_IDS,
  type DefiningWorldPlazaGirlSampleVoiceClipId,
  type DefiningWorldPlazaGirlSampleVoiceSfxEventKind,
} from '@/components/world/domains/definingWorldPlazaGirlSampleVoiceSfxConstants';

/**
 * Resolves the clip id for one girl voice event and rotation index.
 */
export function resolvingWorldPlazaGirlSampleVoiceSfxClipId(
  eventKind: DefiningWorldPlazaGirlSampleVoiceSfxEventKind,
  rotationIndex: number
): DefiningWorldPlazaGirlSampleVoiceClipId {
  if (eventKind === 'attack_swing') {
    return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_CLIP_IDS[
      rotationIndex %
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_CLIP_IDS.length
    ];
  }

  if (eventKind === 'hit_taken') {
    return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_HIT_SHORT_SFX_CLIP_IDS[
      rotationIndex %
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_HIT_SHORT_SFX_CLIP_IDS.length
    ];
  }

  return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_SFX_CLIP_IDS[
    rotationIndex %
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_SFX_CLIP_IDS.length
  ];
}

/**
 * Returns pool length for one girl voice event kind.
 */
export function resolvingWorldPlazaGirlSampleVoiceSfxClipPoolLength(
  eventKind: DefiningWorldPlazaGirlSampleVoiceSfxEventKind
): number {
  if (eventKind === 'attack_swing') {
    return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_CLIP_IDS.length;
  }

  if (eventKind === 'hit_taken') {
    return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_HIT_SHORT_SFX_CLIP_IDS.length;
  }

  return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_SFX_CLIP_IDS.length;
}
