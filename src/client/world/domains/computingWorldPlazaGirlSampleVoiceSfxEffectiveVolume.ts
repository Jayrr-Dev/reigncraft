import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_HIT_SFX_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_JUMP_SFX_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_SFX_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ROLL_SFX_TARGET_VOLUME,
  type DefiningWorldPlazaGirlSampleVoiceSfxEventKind,
} from '@/components/world/domains/definingWorldPlazaGirlSampleVoiceSfxConstants';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';

const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_SFX_BASE_TARGET_VOLUME_BY_EVENT: Record<
  DefiningWorldPlazaGirlSampleVoiceSfxEventKind,
  number
> = {
  attack_swing: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_TARGET_VOLUME,
  jump_takeoff: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_JUMP_SFX_TARGET_VOLUME,
  roll_dodge: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ROLL_SFX_TARGET_VOLUME,
  hit_taken: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_HIT_SFX_TARGET_VOLUME,
  pain: DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_SFX_TARGET_VOLUME,
};

/**
 * Effective playback volume for one girl voice event after SFX volume.
 */
export function computingWorldPlazaGirlSampleVoiceSfxEffectiveVolume(
  eventKind: DefiningWorldPlazaGirlSampleVoiceSfxEventKind,
  clipVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume:
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_SFX_BASE_TARGET_VOLUME_BY_EVENT[
        eventKind
      ],
    multipliers: [clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}
