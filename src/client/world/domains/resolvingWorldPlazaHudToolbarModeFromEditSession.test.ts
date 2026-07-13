import { DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import {
  checkingWorldPlazaHudToolbarModeShouldExitEditSession,
  resolvingWorldPlazaHudToolbarModeFromEditSession,
} from '@/components/world/domains/resolvingWorldPlazaHudToolbarModeFromEditSession';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaHudToolbarModeFromEditSession', () => {
  it('keeps Craft when build is active under a Craft-pinned HUD', () => {
    expect(
      resolvingWorldPlazaHudToolbarModeFromEditSession({
        isClaimModeActive: false,
        isBlockBuildModeActive: true,
        currentMode: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT,
      })
    ).toBe(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT);
  });

  it('forces Build when build is active and HUD is not Craft', () => {
    expect(
      resolvingWorldPlazaHudToolbarModeFromEditSession({
        isClaimModeActive: false,
        isBlockBuildModeActive: true,
        currentMode: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS,
      })
    ).toBe(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD);
  });

  it('lets Claim win over Craft pin', () => {
    expect(
      resolvingWorldPlazaHudToolbarModeFromEditSession({
        isClaimModeActive: true,
        isBlockBuildModeActive: true,
        currentMode: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT,
      })
    ).toBe(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM);
  });
});

describe('checkingWorldPlazaHudToolbarModeShouldExitEditSession', () => {
  it('does not exit edit when re-selecting Craft during craft placement', () => {
    expect(
      checkingWorldPlazaHudToolbarModeShouldExitEditSession({
        mode: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT,
        currentHudToolbarMode: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT,
        isEditSessionActive: true,
      })
    ).toBe(false);
  });

  it('exits edit when switching from Build to Craft', () => {
    expect(
      checkingWorldPlazaHudToolbarModeShouldExitEditSession({
        mode: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT,
        currentHudToolbarMode: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD,
        isEditSessionActive: true,
      })
    ).toBe(true);
  });

  it('exits edit when selecting Items', () => {
    expect(
      checkingWorldPlazaHudToolbarModeShouldExitEditSession({
        mode: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS,
        currentHudToolbarMode: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT,
        isEditSessionActive: true,
      })
    ).toBe(true);
  });
});
