import { checkingWorldPlazaAvatarMeleeOutcomeTierPlaysCritFatalSfx } from '@/components/world/domains/checkingWorldPlazaAvatarMeleeOutcomeTierPlaysCritFatalSfx';
import { resolvingWorldPlazaAvatarMeleeSfxUrl } from '@/components/world/domains/resolvingWorldPlazaAvatarMeleeSfxUrl';
import { resolvingWorldPlazaAvatarMeleeStarAudioId } from '@/components/world/domains/resolvingWorldPlazaAvatarMeleeStarAudioId';
import {
  resolvingWorldPlazaAvatarMeleeSwingComboIndexAfterSwing,
  resolvingWorldPlazaAvatarMeleeSwingSfxClipId,
} from '@/components/world/domains/resolvingWorldPlazaAvatarMeleeSwingSfxClipId';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaAvatarMeleeStarAudioId', () => {
  it('prefixes stable avatar melee ids for star-audio', () => {
    expect(resolvingWorldPlazaAvatarMeleeStarAudioId('swipe')).toBe(
      'avatar-melee.swipe'
    );
  });
});

describe('resolvingWorldPlazaAvatarMeleeSfxUrl', () => {
  it('builds a browser-safe public URL for melee clips', () => {
    expect(resolvingWorldPlazaAvatarMeleeSfxUrl('punch_1')).toBe(
      '/sfx/400-sounds-combat/punch.wav'
    );
  });
});

describe('resolvingWorldPlazaAvatarMeleeSwingSfxClipId', () => {
  it('cycles swipe, swipe, slap for the 1-1-2 combo', () => {
    expect(resolvingWorldPlazaAvatarMeleeSwingSfxClipId(0)).toBe('swipe');
    expect(resolvingWorldPlazaAvatarMeleeSwingSfxClipId(1)).toBe('swipe');
    expect(resolvingWorldPlazaAvatarMeleeSwingSfxClipId(2)).toBe('slap');
    expect(resolvingWorldPlazaAvatarMeleeSwingSfxClipId(3)).toBe('swipe');
  });

  it('advances the combo index after each swing', () => {
    expect(resolvingWorldPlazaAvatarMeleeSwingComboIndexAfterSwing(2)).toBe(3);
  });
});

describe('checkingWorldPlazaAvatarMeleeOutcomeTierPlaysCritFatalSfx', () => {
  it('accepts critical, fatal, and lethal tiers', () => {
    expect(
      checkingWorldPlazaAvatarMeleeOutcomeTierPlaysCritFatalSfx('critical')
    ).toBe(true);
    expect(
      checkingWorldPlazaAvatarMeleeOutcomeTierPlaysCritFatalSfx('fatal')
    ).toBe(true);
    expect(
      checkingWorldPlazaAvatarMeleeOutcomeTierPlaysCritFatalSfx('lethal')
    ).toBe(true);
  });

  it('ignores normal hits', () => {
    expect(
      checkingWorldPlazaAvatarMeleeOutcomeTierPlaysCritFatalSfx('normal')
    ).toBe(false);
  });
});
