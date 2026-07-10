import { describe, expect, it } from 'vitest';

import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_CLIP_IDS,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_HIT_SHORT_SFX_CLIP_IDS,
} from '@/components/world/domains/definingWorldPlazaGirlSampleVoiceSfxConstants';
import {
  resolvingWorldPlazaGirlSampleVoiceSfxClipId,
  resolvingWorldPlazaGirlSampleVoiceSfxClipPoolLength,
} from '@/components/world/domains/resolvingWorldPlazaGirlSampleVoiceSfxClipId';
import { resolvingWorldPlazaGirlSampleVoiceSfxEventKindFromPlayerDamage } from '@/components/world/domains/resolvingWorldPlazaGirlSampleVoiceSfxEventKindFromPlayerDamage';

describe('resolvingWorldPlazaGirlSampleVoiceSfxClipId', () => {
  it('rotates attack swing clips', () => {
    const poolLength =
      resolvingWorldPlazaGirlSampleVoiceSfxClipPoolLength('attack_swing');

    expect(poolLength).toBe(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_CLIP_IDS.length
    );
    expect(resolvingWorldPlazaGirlSampleVoiceSfxClipId('attack_swing', 0)).toBe(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_CLIP_IDS[0]
    );
  });

  it('wraps hit reaction rotation indices', () => {
    const poolLength =
      resolvingWorldPlazaGirlSampleVoiceSfxClipPoolLength('hit_taken');

    expect(
      resolvingWorldPlazaGirlSampleVoiceSfxClipId('hit_taken', poolLength)
    ).toBe(resolvingWorldPlazaGirlSampleVoiceSfxClipId('hit_taken', 0));
    expect(resolvingWorldPlazaGirlSampleVoiceSfxClipId('hit_taken', 1)).toBe(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_HIT_SHORT_SFX_CLIP_IDS[1]
    );
  });
});

describe('resolvingWorldPlazaGirlSampleVoiceSfxEventKindFromPlayerDamage', () => {
  it('maps heavy tiers to pain and normal hits to hit_taken', () => {
    expect(
      resolvingWorldPlazaGirlSampleVoiceSfxEventKindFromPlayerDamage(
        'critical',
        12
      )
    ).toBe('pain');
    expect(
      resolvingWorldPlazaGirlSampleVoiceSfxEventKindFromPlayerDamage(
        'normal',
        4
      )
    ).toBe('hit_taken');
    expect(
      resolvingWorldPlazaGirlSampleVoiceSfxEventKindFromPlayerDamage(
        'normal',
        0
      )
    ).toBeNull();
  });
});
