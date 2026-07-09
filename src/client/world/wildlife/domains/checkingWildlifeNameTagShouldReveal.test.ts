import { checkingWildlifeNameTagShouldReveal } from '@/components/world/wildlife/domains/checkingWildlifeNameTagShouldReveal';
import { DEFINING_WILDLIFE_NAME_TAG_PROXIMITY_REVEAL_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import { describe, expect, it } from 'vitest';

const BASE_INSTANCE = {
  instanceId: 'deer-1',
  position: { x: 20, y: 20, layer: 0 },
  aggroState: {
    threats: [],
    activeTargetId: null,
    lastDamagedAtMs: null,
  },
} as const;

const BASE_REVEAL_PARAMS = {
  instance: BASE_INSTANCE,
  playerUserId: 'player-1',
  nowMs: 10_000,
  hoveredInstanceId: null,
  wildlifeDamagedPlayerAtMs: null,
} as const;

describe('checkingWildlifeNameTagShouldReveal', () => {
  it('reveals on pointer hover', () => {
    expect(
      checkingWildlifeNameTagShouldReveal({
        ...BASE_REVEAL_PARAMS,
        playerPosition: { x: 0, y: 0, layer: 0 },
        playerFacingDirection: 'Down',
        hoveredInstanceId: 'deer-1',
      })
    ).toBe(true);
  });

  it('reveals when the player is nearby and the animal is ahead while facing down', () => {
    expect(
      checkingWildlifeNameTagShouldReveal({
        ...BASE_REVEAL_PARAMS,
        playerPosition: { x: 19, y: 19, layer: 0 },
        playerFacingDirection: 'Down',
      })
    ).toBe(true);
  });

  it('stays hidden when nearby but behind the player facing direction', () => {
    expect(
      checkingWildlifeNameTagShouldReveal({
        ...BASE_REVEAL_PARAMS,
        playerPosition: { x: 19, y: 19, layer: 0 },
        playerFacingDirection: 'Up',
      })
    ).toBe(false);
  });

  it('stays hidden when nearby but off to the rear while facing sideways', () => {
    expect(
      checkingWildlifeNameTagShouldReveal({
        ...BASE_REVEAL_PARAMS,
        playerPosition: {
          x: 20 + DEFINING_WILDLIFE_NAME_TAG_PROXIMITY_REVEAL_RADIUS_GRID - 1,
          y: 20,
          layer: 0,
        },
        playerFacingDirection: 'Down',
      })
    ).toBe(false);
  });

  it('reveals when the animal is aggroed on the player', () => {
    expect(
      checkingWildlifeNameTagShouldReveal({
        ...BASE_REVEAL_PARAMS,
        instance: {
          ...BASE_INSTANCE,
          aggroState: {
            ...BASE_INSTANCE.aggroState,
            activeTargetId: 'player-1',
          },
        },
        playerPosition: { x: 0, y: 0, layer: 0 },
        playerFacingDirection: 'Down',
      })
    ).toBe(true);
  });

  it('reveals after recent player damage or a recent hit on the player', () => {
    expect(
      checkingWildlifeNameTagShouldReveal({
        ...BASE_REVEAL_PARAMS,
        instance: {
          ...BASE_INSTANCE,
          aggroState: {
            ...BASE_INSTANCE.aggroState,
            lastDamagedAtMs: 9_000,
          },
        },
        playerPosition: { x: 0, y: 0, layer: 0 },
        playerFacingDirection: 'Down',
      })
    ).toBe(true);

    expect(
      checkingWildlifeNameTagShouldReveal({
        ...BASE_REVEAL_PARAMS,
        playerPosition: { x: 0, y: 0, layer: 0 },
        playerFacingDirection: 'Down',
        wildlifeDamagedPlayerAtMs: 9_500,
      })
    ).toBe(true);
  });

  it('stays hidden when far away and not in combat', () => {
    expect(
      checkingWildlifeNameTagShouldReveal({
        ...BASE_REVEAL_PARAMS,
        playerPosition: { x: 0, y: 0, layer: 0 },
        playerFacingDirection: 'Down',
      })
    ).toBe(false);
  });
});
