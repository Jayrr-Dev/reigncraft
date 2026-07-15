import { checkingWildlifeStatusHudOverlayShouldShow } from '@/components/world/wildlife/domains/checkingWildlifeStatusHudOverlayShouldShow';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeStatusHudOverlayShouldShow', () => {
  it('hides when dead or no icons', () => {
    expect(
      checkingWildlifeStatusHudOverlayShouldShow({
        isDead: true,
        iconCount: 2,
        lastDamagedAtMs: 1,
        isCombatLocked: false,
        isHovered: false,
      })
    ).toBe(false);

    expect(
      checkingWildlifeStatusHudOverlayShouldShow({
        isDead: false,
        iconCount: 0,
        lastDamagedAtMs: 1,
        isCombatLocked: true,
        isHovered: true,
      })
    ).toBe(false);
  });

  it('shows for engaged wildlife with icons', () => {
    expect(
      checkingWildlifeStatusHudOverlayShouldShow({
        isDead: false,
        iconCount: 1,
        lastDamagedAtMs: 100,
        isCombatLocked: false,
        isHovered: false,
      })
    ).toBe(true);

    expect(
      checkingWildlifeStatusHudOverlayShouldShow({
        isDead: false,
        iconCount: 1,
        lastDamagedAtMs: null,
        isCombatLocked: true,
        isHovered: false,
      })
    ).toBe(true);
  });

  it('hides unengaged wildlife even with icons', () => {
    expect(
      checkingWildlifeStatusHudOverlayShouldShow({
        isDead: false,
        iconCount: 3,
        lastDamagedAtMs: null,
        isCombatLocked: false,
        isHovered: false,
      })
    ).toBe(false);
  });
});
