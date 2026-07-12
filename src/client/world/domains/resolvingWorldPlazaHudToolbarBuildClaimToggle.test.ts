import { DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import {
  checkingWorldPlazaHudToolbarBuildClaimToggleActive,
  resolvingWorldPlazaHudToolbarBuildClaimToggleFace,
  resolvingWorldPlazaHudToolbarBuildClaimToggleNextMode,
} from '@/components/world/domains/resolvingWorldPlazaHudToolbarBuildClaimToggle';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaHudToolbarBuildClaimToggle', () => {
  it('marks the toggle active for build and claim only', () => {
    expect(
      checkingWorldPlazaHudToolbarBuildClaimToggleActive(
        DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD
      )
    ).toBe(true);
    expect(
      checkingWorldPlazaHudToolbarBuildClaimToggleActive(
        DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM
      )
    ).toBe(true);
    expect(
      checkingWorldPlazaHudToolbarBuildClaimToggleActive(
        DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS
      )
    ).toBe(false);
  });

  it('shows claim face while claiming, otherwise build', () => {
    expect(
      resolvingWorldPlazaHudToolbarBuildClaimToggleFace(
        DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM
      ).label
    ).toBe('Claim');
    expect(
      resolvingWorldPlazaHudToolbarBuildClaimToggleFace(
        DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD
      ).label
    ).toBe('Build');
    expect(
      resolvingWorldPlazaHudToolbarBuildClaimToggleFace(
        DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS
      ).label
    ).toBe('Build');
    expect(
      resolvingWorldPlazaHudToolbarBuildClaimToggleFace(
        DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD
      ).activeButtonClassName
    ).toContain('amber');
    expect(
      resolvingWorldPlazaHudToolbarBuildClaimToggleFace(
        DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM
      ).activeButtonClassName
    ).toContain('sky');
  });

  it('toggles build ↔ claim and enters build from other modes', () => {
    expect(
      resolvingWorldPlazaHudToolbarBuildClaimToggleNextMode(
        DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD
      )
    ).toBe(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM);
    expect(
      resolvingWorldPlazaHudToolbarBuildClaimToggleNextMode(
        DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM
      )
    ).toBe(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD);
    expect(
      resolvingWorldPlazaHudToolbarBuildClaimToggleNextMode(
        DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS
      )
    ).toBe(DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD);
  });
});
