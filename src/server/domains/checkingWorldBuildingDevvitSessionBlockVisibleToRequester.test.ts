import { describe, expect, it } from 'vitest';
import { checkingWorldBuildingDevvitSessionBlockVisibleToRequester } from './checkingWorldBuildingDevvitSessionBlockVisibleToRequester';

describe('checkingWorldBuildingDevvitSessionBlockVisibleToRequester', () => {
  it('keeps the requester own session campfire without multiplayer presence', () => {
    expect(
      checkingWorldBuildingDevvitSessionBlockVisibleToRequester(
        'user-1',
        'user-1',
        false
      )
    ).toBe(true);
  });

  it('hides another player offline session campfire without deleting intent', () => {
    expect(
      checkingWorldBuildingDevvitSessionBlockVisibleToRequester(
        'user-2',
        'user-1',
        false
      )
    ).toBe(false);
  });

  it('shows another player live session campfire', () => {
    expect(
      checkingWorldBuildingDevvitSessionBlockVisibleToRequester(
        'user-2',
        'user-1',
        true
      )
    ).toBe(true);
  });
});
