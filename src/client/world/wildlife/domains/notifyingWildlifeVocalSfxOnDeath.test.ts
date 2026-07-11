import {
  notifyingWildlifeInstanceVocalSfxSilence,
  registeringWildlifeInstanceVocalSfxSilenceListener,
} from '@/components/world/wildlife/domains/notifyingWildlifeInstanceVocalSfxSilence';
import { notifyingWildlifeVocalSfxOnDeath } from '@/components/world/wildlife/domains/notifyingWildlifeVocalSfxOnDeath';
import { describe, expect, it } from 'vitest';

describe('notifyingWildlifeVocalSfxOnDeath', () => {
  it('silences vocals on the live-to-dead edge only', () => {
    const silencedInstanceIds: string[] = [];
    const unregister = registeringWildlifeInstanceVocalSfxSilenceListener(
      ({ instanceId }) => {
        silencedInstanceIds.push(instanceId);
      }
    );

    notifyingWildlifeVocalSfxOnDeath({
      instanceId: 'wolf-1',
      wasDead: false,
      isDead: true,
    });
    notifyingWildlifeVocalSfxOnDeath({
      instanceId: 'wolf-1',
      wasDead: true,
      isDead: true,
    });
    notifyingWildlifeVocalSfxOnDeath({
      instanceId: 'wolf-2',
      wasDead: false,
      isDead: false,
    });

    expect(silencedInstanceIds).toEqual(['wolf-1']);
    unregister();
  });

  it('forwards silence to every registered listener', () => {
    const first: string[] = [];
    const second: string[] = [];
    const unregisterFirst = registeringWildlifeInstanceVocalSfxSilenceListener(
      ({ instanceId }) => {
        first.push(instanceId);
      }
    );
    const unregisterSecond = registeringWildlifeInstanceVocalSfxSilenceListener(
      ({ instanceId }) => {
        second.push(instanceId);
      }
    );

    notifyingWildlifeInstanceVocalSfxSilence({ instanceId: 'cow-9' });

    expect(first).toEqual(['cow-9']);
    expect(second).toEqual(['cow-9']);
    unregisterFirst();
    unregisterSecond();
  });
});
