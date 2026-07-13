import {
  buildingPlazaDevvitOnlineRoomApiUrl,
  buildingPlazaDevvitOnlineRoomIdFromDisplayName,
  checkingPlazaDevvitOnlineMaxPlayers,
  checkingPlazaDevvitOnlineRoomDisplayName,
  checkingPlazaDevvitOnlineRoomIsPublicBrowseable,
  normalizingPlazaDevvitOnlineRoomName,
} from './plazaDevvitOnline';
import { describe, expect, it } from 'vitest';

describe('normalizingPlazaDevvitOnlineRoomName', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(normalizingPlazaDevvitOnlineRoomName('  Oak Hollow  ')).toBe(
      'oak-hollow'
    );
  });

  it('strips unsupported characters', () => {
    expect(normalizingPlazaDevvitOnlineRoomName('Oak! Hollow?')).toBe(
      'oak-hollow'
    );
  });
});

describe('checkingPlazaDevvitOnlineRoomDisplayName', () => {
  it('accepts valid display names', () => {
    expect(checkingPlazaDevvitOnlineRoomDisplayName('Oak Hollow')).toBe(true);
    expect(checkingPlazaDevvitOnlineRoomDisplayName('abc')).toBe(true);
  });

  it('rejects too-short or illegal names', () => {
    expect(checkingPlazaDevvitOnlineRoomDisplayName('ab')).toBe(false);
    expect(checkingPlazaDevvitOnlineRoomDisplayName('@@@')).toBe(false);
  });
});

describe('buildingPlazaDevvitOnlineRoomIdFromDisplayName', () => {
  it('builds a stable slug room id', () => {
    expect(buildingPlazaDevvitOnlineRoomIdFromDisplayName('Oak Hollow')).toBe(
      'oak-hollow'
    );
  });
});

describe('checkingPlazaDevvitOnlineMaxPlayers', () => {
  it('allows 2–4 only', () => {
    expect(checkingPlazaDevvitOnlineMaxPlayers(1)).toBe(false);
    expect(checkingPlazaDevvitOnlineMaxPlayers(2)).toBe(true);
    expect(checkingPlazaDevvitOnlineMaxPlayers(4)).toBe(true);
    expect(checkingPlazaDevvitOnlineMaxPlayers(5)).toBe(false);
  });
});

describe('buildingPlazaDevvitOnlineRoomApiUrl', () => {
  it('appends room query and preserves existing params', () => {
    expect(buildingPlazaDevvitOnlineRoomApiUrl('/api/plaza/sync', 'oak-hollow')).toBe(
      '/api/plaza/sync?room=oak-hollow'
    );
    expect(
      buildingPlazaDevvitOnlineRoomApiUrl(
        '/api/world/harvest/chopped-trees?saveSlotIndex=1',
        'oak-hollow'
      )
    ).toBe(
      '/api/world/harvest/chopped-trees?saveSlotIndex=1&room=oak-hollow'
    );
  });
});

describe('checkingPlazaDevvitOnlineRoomIsPublicBrowseable', () => {
  it('hides private and empty public rooms', () => {
    expect(
      checkingPlazaDevvitOnlineRoomIsPublicBrowseable({
        isPrivate: true,
        participantCount: 2,
      })
    ).toBe(false);
    expect(
      checkingPlazaDevvitOnlineRoomIsPublicBrowseable({
        isPrivate: false,
        participantCount: 0,
      })
    ).toBe(false);
  });

  it('shows occupied public rooms', () => {
    expect(
      checkingPlazaDevvitOnlineRoomIsPublicBrowseable({
        isPrivate: false,
        participantCount: 1,
      })
    ).toBe(true);
  });
});
