import {
  checkingWorldPlazaOnlineParticipantsSnapshotChanged,
  checkingWorldPlazaOnlineRoomSnapshotPatchChanged,
} from '@/components/world/domains/checkingWorldPlazaOnlineParticipantsSnapshotChanged';
import type { DefiningWorldPlazaOnlineRoomSnapshot } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import { describe, expect, it } from 'vitest';

const CONNECTED_SNAPSHOT: DefiningWorldPlazaOnlineRoomSnapshot = {
  remotePlayers: [],
  onlineParticipants: [{ userId: 'local', displayName: 'Player' }],
  participantCount: 1,
  roomIndex: 1,
  roomChannelName: 'devvit-polling-room-1',
  isConnected: true,
  isJoined: true,
  isReconnecting: false,
  isRoomFull: false,
  lastError: null,
};

describe('checkingWorldPlazaOnlineParticipantsSnapshotChanged', () => {
  it('treats equivalent participant arrays as unchanged', () => {
    expect(
      checkingWorldPlazaOnlineParticipantsSnapshotChanged(
        CONNECTED_SNAPSHOT,
        1,
        [{ userId: 'local', displayName: 'Player' }]
      )
    ).toBe(false);
  });

  it('detects participant roster changes', () => {
    expect(
      checkingWorldPlazaOnlineParticipantsSnapshotChanged(
        CONNECTED_SNAPSHOT,
        1,
        [{ userId: 'local', displayName: 'Renamed' }]
      )
    ).toBe(true);
  });
});

describe('checkingWorldPlazaOnlineRoomSnapshotPatchChanged', () => {
  it('skips an equivalent successful 150ms sync patch', () => {
    expect(
      checkingWorldPlazaOnlineRoomSnapshotPatchChanged(CONNECTED_SNAPSHOT, {
        isConnected: true,
        isJoined: true,
        isReconnecting: false,
        isRoomFull: false,
        lastError: null,
        participantCount: 1,
        onlineParticipants: [{ userId: 'local', displayName: 'Player' }],
      })
    ).toBe(false);
  });

  it('keeps connection and participant changes observable', () => {
    expect(
      checkingWorldPlazaOnlineRoomSnapshotPatchChanged(CONNECTED_SNAPSHOT, {
        isConnected: false,
      })
    ).toBe(true);
    expect(
      checkingWorldPlazaOnlineRoomSnapshotPatchChanged(CONNECTED_SNAPSHOT, {
        participantCount: 2,
        onlineParticipants: [
          { userId: 'local', displayName: 'Player' },
          { userId: 'remote', displayName: 'Visitor' },
        ],
      })
    ).toBe(true);
  });
});
