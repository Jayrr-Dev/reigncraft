import { DEFINING_WORLD_PLAZA_AVATAR_SKIN } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import {
  resolvingWorldPlazaArmorBodyPlanForAvatarSkin,
  resolvingWorldPlazaArmorSlotsForAvatarSkin,
} from '@/components/world/equipment/domains/resolvingWorldPlazaArmorSlotsForAvatarSkin';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaArmorSlotsForAvatarSkin', () => {
  it('uses humanoid slots for girl-sample', () => {
    expect(
      resolvingWorldPlazaArmorBodyPlanForAvatarSkin(
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
      )
    ).toBe('humanoid');

    expect(
      resolvingWorldPlazaArmorSlotsForAvatarSkin(
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
      ).map((slot) => slot.id)
    ).toEqual(['helm', 'arm', 'body', 'leg', 'foot']);
  });

  it('uses animal slots for playable animal skins', () => {
    expect(
      resolvingWorldPlazaArmorBodyPlanForAvatarSkin(
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY
      )
    ).toBe('animal');

    expect(
      resolvingWorldPlazaArmorSlotsForAvatarSkin(
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.HUSKY
      ).map((slot) => slot.id)
    ).toEqual(['helm', 'arm', 'torso', 'paw-hooves']);
  });
});
