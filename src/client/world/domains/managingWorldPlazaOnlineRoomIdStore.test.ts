import {
  appendingWorldPlazaOnlineRoomQueryToApiPath,
  readingWorldPlazaOnlineRoomId,
  settingWorldPlazaOnlineRoomId,
} from '@/components/world/domains/managingWorldPlazaOnlineRoomIdStore';
import { afterEach, describe, expect, it } from 'vitest';

describe('managingWorldPlazaOnlineRoomIdStore', () => {
  afterEach(() => {
    settingWorldPlazaOnlineRoomId(null);
  });

  it('appends room query only when a room id is active', () => {
    expect(appendingWorldPlazaOnlineRoomQueryToApiPath('/api/world/fire/cells')).toBe(
      '/api/world/fire/cells'
    );

    settingWorldPlazaOnlineRoomId('oak-hollow');
    expect(readingWorldPlazaOnlineRoomId()).toBe('oak-hollow');
    expect(appendingWorldPlazaOnlineRoomQueryToApiPath('/api/world/fire/cells')).toBe(
      '/api/world/fire/cells?room=oak-hollow'
    );
    expect(
      appendingWorldPlazaOnlineRoomQueryToApiPath(
        '/api/world/inventory/ground-items?saveSlotIndex=1'
      )
    ).toBe(
      '/api/world/inventory/ground-items?saveSlotIndex=1&room=oak-hollow'
    );
  });
});
