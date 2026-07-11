import { computingWorldPlazaSfxEffectiveVolume } from '@/components/world/audio/computingWorldPlazaSfxEffectiveVolume';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_HIT_SFX_TARGET_VOLUME,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_SFX_TARGET_VOLUME,
  type DefiningWorldPlazaGirlSampleVoiceSfxEventKind,
} from '@/components/world/domains/definingWorldPlazaGirlSampleVoiceSfxConstants';
import { gettingWorldPlazaSfxVolume } from '@/components/world/domains/managingWorldPlazaSfxVolumeStore';

function resolvingWorldPlazaGirlSampleVoiceSfxBaseTargetVolume(
  eventKind: DefiningWorldPlazaGirlSampleVoiceSfxEventKind
): number {
  if (eventKind === 'attack_swing') {
    return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_TARGET_VOLUME;
  }

  if (eventKind === 'pain') {
    return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_SFX_TARGET_VOLUME;
  }

  return DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_HIT_SFX_TARGET_VOLUME;
}

/**
 * Effective playback volume for one girl voice event after SFX volume.
 */
export function computingWorldPlazaGirlSampleVoiceSfxEffectiveVolume(
  eventKind: DefiningWorldPlazaGirlSampleVoiceSfxEventKind,
  clipVolumeMultiplier = 1
): number {
  return computingWorldPlazaSfxEffectiveVolume({
    baseTargetVolume:
      resolvingWorldPlazaGirlSampleVoiceSfxBaseTargetVolume(eventKind),
    multipliers: [clipVolumeMultiplier],
    sliderVolume: gettingWorldPlazaSfxVolume(),
  });
}
