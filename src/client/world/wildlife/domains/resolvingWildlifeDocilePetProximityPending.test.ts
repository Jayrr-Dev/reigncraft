import { listingWorldPlazaInteractableSelectionKeysInPlayerProximity } from '@/components/world/interaction/domains/listingWorldPlazaInteractableSelectionKeysInPlayerProximity';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { formattingWildlifeCorpseStudySelectionKey } from '@/components/world/wildlife/domains/formattingWildlifeCorpseStudySelectionKey';
import { formattingWildlifeDocilePetSelectionKey } from '@/components/world/wildlife/domains/formattingWildlifeDocilePetSelectionKey';
import {
  creatingWildlifeInstanceStore,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeDocilePetProximityPending } from '@/components/world/wildlife/domains/resolvingWildlifeDocilePetProximityPending';
import { describe, expect, it } from 'vitest';

describe('wildlife docile pet proximity selection', () => {
  it('lists living cats and dogs in proximity as pet keys', () => {
    const store = creatingWildlifeInstanceStore();
    replacingWildlifeInstance(
      store,
      creatingWildlifeTestInstance({
        instanceId: 'cat-near',
        speciesId: 'cat-orange',
        position: { x: 5.2, y: 5.4, layer: 1 },
        isDead: false,
      })
    );
    replacingWildlifeInstance(
      store,
      creatingWildlifeTestInstance({
        instanceId: 'cow-near',
        speciesId: 'cow',
        position: { x: 5.3, y: 5.1, layer: 1 },
        isDead: false,
      })
    );

    const keys = listingWorldPlazaInteractableSelectionKeysInPlayerProximity({
      playerPosition: { x: 5.1, y: 5.2, layer: 1 },
      placedBlocks: [],
      wildlifeStore: store,
    });

    expect(keys.has(formattingWildlifeDocilePetSelectionKey('cat-near'))).toBe(
      true
    );
    expect(keys.has(formattingWildlifeDocilePetSelectionKey('cow-near'))).toBe(
      false
    );
  });

  it('still lists corpses for Study separately from living pets', () => {
    const store = creatingWildlifeInstanceStore();
    replacingWildlifeInstance(
      store,
      creatingWildlifeTestInstance({
        instanceId: 'dog-dead',
        speciesId: 'shepherd-dog',
        position: { x: 1.2, y: 1.1, layer: 1 },
        isDead: true,
        diedAtMs: 1,
        hasBeenStudied: false,
      })
    );

    const keys = listingWorldPlazaInteractableSelectionKeysInPlayerProximity({
      playerPosition: { x: 1.1, y: 1.2, layer: 1 },
      placedBlocks: [],
      wildlifeStore: store,
    });

    expect(
      keys.has(formattingWildlifeCorpseStudySelectionKey('dog-dead'))
    ).toBe(true);
    expect(keys.has(formattingWildlifeDocilePetSelectionKey('dog-dead'))).toBe(
      false
    );
  });

  it('resolves nearest living pet pending from proximity keys', () => {
    const store = creatingWildlifeInstanceStore();
    replacingWildlifeInstance(
      store,
      creatingWildlifeTestInstance({
        instanceId: 'cat-near',
        speciesId: 'cat-black',
        position: { x: 2.1, y: 2.0, layer: 1 },
      })
    );
    replacingWildlifeInstance(
      store,
      creatingWildlifeTestInstance({
        instanceId: 'dog-farther',
        speciesId: 'husky',
        position: { x: 2.8, y: 2.7, layer: 1 },
      })
    );

    const pending = resolvingWildlifeDocilePetProximityPending({
      wildlifeStore: store,
      selectedKeys: new Set([
        formattingWildlifeDocilePetSelectionKey('cat-near'),
        formattingWildlifeDocilePetSelectionKey('dog-farther'),
      ]),
      playerPosition: { x: 2.0, y: 2.0, layer: 1 },
      currentPending: null,
      activePettingInstanceId: null,
      nowMs: 1_000,
    });

    expect(pending?.instanceId).toBe('cat-near');
    expect(pending?.petKind).toBe('cat');
  });

  it('skips companions still on pet cooldown', () => {
    const store = creatingWildlifeInstanceStore();
    replacingWildlifeInstance(
      store,
      creatingWildlifeTestInstance({
        instanceId: 'cat-cooling',
        speciesId: 'cat-white',
        position: { x: 5.1, y: 5.1, layer: 1 },
        petCooldownUntilMs: 50_000,
      })
    );

    const keys = listingWorldPlazaInteractableSelectionKeysInPlayerProximity({
      playerPosition: { x: 5.0, y: 5.0, layer: 1 },
      placedBlocks: [],
      wildlifeStore: store,
      nowMs: 10_000,
    });

    expect(
      keys.has(formattingWildlifeDocilePetSelectionKey('cat-cooling'))
    ).toBe(false);

    const pending = resolvingWildlifeDocilePetProximityPending({
      wildlifeStore: store,
      selectedKeys: new Set([
        formattingWildlifeDocilePetSelectionKey('cat-cooling'),
      ]),
      playerPosition: { x: 5.0, y: 5.0, layer: 1 },
      currentPending: null,
      activePettingInstanceId: null,
      nowMs: 10_000,
    });

    expect(pending).toBeNull();
  });

  it('keeps the active petting target even without proximity keys', () => {
    const store = creatingWildlifeInstanceStore();
    replacingWildlifeInstance(
      store,
      creatingWildlifeTestInstance({
        instanceId: 'dog-active',
        speciesId: 'golden-retriever',
        position: { x: 8, y: 8, layer: 1 },
      })
    );

    const pending = resolvingWildlifeDocilePetProximityPending({
      wildlifeStore: store,
      selectedKeys: new Set(),
      playerPosition: { x: 2, y: 2, layer: 1 },
      currentPending: {
        instanceId: 'dog-active',
        speciesId: 'golden-retriever',
        displayName: 'Golden Retriever',
        petKind: 'dog',
      },
      activePettingInstanceId: 'dog-active',
      nowMs: 1_000,
    });

    expect(pending?.instanceId).toBe('dog-active');
    expect(pending?.petKind).toBe('dog');
  });
});
