import { resolvingWorldPlazaAvatarMotionSfxClipId } from '@/components/world/domains/resolvingWorldPlazaAvatarMotionSfxClipId';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaAvatarMotionSfxClipId', () => {
  it('rotates jump takeoff clips', () => {
    expect(resolvingWorldPlazaAvatarMotionSfxClipId('jump_takeoff', 0)).toBe(
      'grass_light_01'
    );
    expect(resolvingWorldPlazaAvatarMotionSfxClipId('jump_takeoff', 1)).toBe(
      'grass_light_02'
    );
    expect(resolvingWorldPlazaAvatarMotionSfxClipId('jump_takeoff', 3)).toBe(
      'grass_light_01'
    );
  });

  it('rotates roll dodge clips', () => {
    expect(resolvingWorldPlazaAvatarMotionSfxClipId('roll_dodge', 0)).toBe(
      'leaves_run'
    );
    expect(resolvingWorldPlazaAvatarMotionSfxClipId('roll_dodge', 1)).toBe(
      'dirt_run'
    );
    expect(resolvingWorldPlazaAvatarMotionSfxClipId('roll_dodge', 2)).toBe(
      'leaves_run'
    );
  });
});
