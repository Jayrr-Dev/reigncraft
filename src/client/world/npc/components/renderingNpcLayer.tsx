/**
 * Thin Pixi layer: placed NPCs as declarative animated sprites.
 *
 * @module components/world/npc/components/renderingNpcLayer
 */

'use client';

import { RenderingWorldPlazaDeclarativeAnimatedSprite } from '@/components/world/animation/components/renderingWorldPlazaDeclarativeAnimatedSprite';
import { advancingAllWorldPlazaDeclarativeAnimationPlayback } from '@/components/world/animation/domains/managingWorldPlazaDeclarativeAnimationPlaybackRegistry';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { resolvingNpcSpeciesDefinition } from '@/components/world/npc/domains/definingNpcSpeciesRegistry';
import {
  listingNpcInstances,
  subscribingNpcInstanceStore,
  type ManagingNpcInstanceStore,
} from '@/components/world/npc/domains/managingNpcInstanceStore';
import {
  ensuringNpcAnimationClipsRegistered,
  formattingNpcAnimationClipId,
} from '@/components/world/npc/domains/registeringNpcAnimationClips';
import { resolvingWorldDepthAvatarBodySortKey } from '@/components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey';
import { useEffect, useState, useSyncExternalStore } from 'react';

export type RenderingNpcLayerProps = {
  readonly npcStoreRef: React.RefObject<ManagingNpcInstanceStore>;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
};

function readingNpcLayerSnapshot(
  store: ManagingNpcInstanceStore
): string {
  return listingNpcInstances(store)
    .map(
      (entry) =>
        `${entry.npcId}:${entry.isDead ? 1 : 0}:${entry.motionClip}:${entry.facing}`
    )
    .join('|');
}

/**
 * Renders fixed plaza NPCs. No AI tick — placement registry + damage updates only.
 */
export function RenderingNpcLayer({
  npcStoreRef,
}: RenderingNpcLayerProps): React.JSX.Element | null {
  const enabled = checkingWorldPlazaGenerationFeatureEnabled(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.NPCS
  );
  const [clipsReady, setClipsReady] = useState(false);
  const storeRevision = useSyncExternalStore(
    subscribingNpcInstanceStore,
    () => readingNpcLayerSnapshot(npcStoreRef.current),
    () => ''
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const instances = listingNpcInstances(npcStoreRef.current);
      const speciesIds = [
        ...new Set(instances.map((entry) => entry.speciesId)),
      ];

      await Promise.all(
        speciesIds.map(async (speciesId) => {
          const species = resolvingNpcSpeciesDefinition(speciesId);

          if (!species) {
            return;
          }

          await ensuringNpcAnimationClipsRegistered(species);
        })
      );

      if (!cancelled) {
        setClipsReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, npcStoreRef, storeRevision]);

  usingWorldPlazaSafeTick(() => {
    if (!enabled) {
      return;
    }

    advancingAllWorldPlazaDeclarativeAnimationPlayback(performance.now());
  });

  if (!enabled || !clipsReady) {
    return null;
  }

  const instances = listingNpcInstances(npcStoreRef.current);

  return (
    <>
      {instances.map((instance) => {
        const species = resolvingNpcSpeciesDefinition(instance.speciesId);

        if (!species) {
          return null;
        }

        const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(
          instance.position
        );
        const clipId = formattingNpcAnimationClipId(
          instance.speciesId,
          instance.isDead ? 'die' : instance.motionClip
        );
        const sortKey = resolvingWorldDepthAvatarBodySortKey(instance.position);

        return (
          <RenderingWorldPlazaDeclarativeAnimatedSprite
            key={instance.npcId}
            playback={{
              clipId,
              variantKey: instance.facing,
              playing: true,
            }}
            position={{ x: screenPoint.x, y: screenPoint.y }}
            anchor={{ x: 0.5, y: 0.92 }}
            scale={species.sizeScale}
            zIndex={sortKey}
            visible={!instance.isDead || instance.motionClip === 'die'}
          />
        );
      })}
    </>
  );
}
