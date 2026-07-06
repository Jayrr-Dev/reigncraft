'use client';

/**
 * Renders live wildlife instances and advances simulation inside Pixi Application.
 *
 * @module components/world/wildlife/components/renderingWildlifeLayer
 */

import { RenderingWorldPlazaDeclarativeAnimatedSprite } from '@/components/world/animation/components/renderingWorldPlazaDeclarativeAnimatedSprite';
import { resolvingWorldDepthAvatarBodySortKey } from '@/components/world/depth/domains/resolvingWorldDepthAvatarBodySortKey';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import {
  advancingWildlifeSimulationTick,
  applyingWildlifeInstanceDamage,
} from '@/components/world/wildlife/domains/advancingWildlifeSimulationTick';
import type { DefiningWildlifeSimulationTickConfig } from '@/components/world/wildlife/domains/definingWildlifeSimulationTickConfig';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { electingWildlifeSimulationLeaderUserId } from '@/components/world/wildlife/domains/electingWildlifeSimulationLeaderUserId';
import { loadingWildlifeSpeciesTextures } from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { listingWildlifeInstances } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  ensuringWildlifeAnimationClipsRegistered,
  formattingWildlifeAnimationClipId,
} from '@/components/world/wildlife/domains/registeringWildlifeAnimationClips';
import { useTick } from '@pixi/react';
import { useRef, useState } from 'react';

export type RenderingWildlifeLayerProps = {
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>;
  tickConfigRef: React.RefObject<DefiningWildlifeSimulationTickConfig>;
};

function RenderingWildlifeInstanceSprite({
  instance,
}: {
  instance: DefiningWildlifeInstance;
}): React.JSX.Element | null {
  const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

  if (!species) {
    return null;
  }

  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(
    instance.position
  );
  const clipId = formattingWildlifeAnimationClipId(
    species.speciesId,
    instance.aiState.motionClip
  );

  return (
    <RenderingWorldPlazaDeclarativeAnimatedSprite
      playback={{
        clipId,
        variantKey:
          instance.facingDirection as DefiningWorldPlazaGirlSampleWalkDirection,
        playing: true,
      }}
      position={{ x: screenPoint.x, y: screenPoint.y }}
      anchor={{ x: 0.5, y: 0.72 }}
      scale={species.sizeScale}
      zIndex={resolvingWorldDepthAvatarBodySortKey(instance.position)}
    />
  );
}

export function RenderingWildlifeLayer({
  wildlifeStoreRef,
  tickConfigRef,
}: RenderingWildlifeLayerProps): React.JSX.Element | null {
  const [instances, setInstances] = useState<
    readonly DefiningWildlifeInstance[]
  >([]);
  const loadedSpeciesRef = useRef<Set<string>>(new Set());
  const lastTickMsRef = useRef<number | null>(null);

  useTick((ticker) => {
    const config = tickConfigRef.current;
    const store = wildlifeStoreRef.current;
    const playerPosition = config.playerPositionRef.current;

    if (config.enabled && playerPosition) {
      const nowMs = ticker.lastTime;
      const lastTickMs = lastTickMsRef.current ?? nowMs;
      const deltaSeconds = Math.max(0, (nowMs - lastTickMs) / 1000);
      lastTickMsRef.current = nowMs;

      const leaderUserId = electingWildlifeSimulationLeaderUserId(
        config.localUserId,
        config.remoteUserIds
      );
      const isLeader =
        !config.localUserId || leaderUserId === config.localUserId;

      if (
        isLeader &&
        config.pendingWildlifeDamageEventsRef?.current &&
        config.pendingWildlifeDamageEventsRef.current.length > 0
      ) {
        for (const event of config.pendingWildlifeDamageEventsRef.current) {
          applyingWildlifeInstanceDamage(
            store,
            event.instanceId,
            event.damageAmount,
            event.attackerUserId,
            resolvingWildlifeSpeciesDefinition,
            event.atMs
          );
        }

        config.pendingWildlifeDamageEventsRef.current.length = 0;
      }

      const result = advancingWildlifeSimulationTick({
        store,
        center: playerPosition,
        playerPosition,
        playerUserId: config.localUserId,
        resolveSpecies: resolvingWildlifeSpeciesDefinition,
        deltaSeconds,
        nowMs,
        placedBlocks: config.placedBlocksRef?.current?.blocks ?? [],
        onPlayerDamaged: config.onPlayerDamaged,
        isLeader,
        remoteSnapshots: config.remoteWildlifeSnapshotsRef?.current ?? [],
      });

      if (config.wildlifeSnapshotsOutRef?.current) {
        config.wildlifeSnapshotsOutRef.current.length = 0;
        config.wildlifeSnapshotsOutRef.current.push(...result.snapshots);
      }
    }

    const nextInstances = listingWildlifeInstances(store);

    if (nextInstances.length === 0 && instances.length === 0) {
      return;
    }

    for (const instance of nextInstances) {
      const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

      if (!species || loadedSpeciesRef.current.has(species.speciesId)) {
        continue;
      }

      loadedSpeciesRef.current.add(species.speciesId);
      void ensuringWildlifeAnimationClipsRegistered(
        species,
        loadingWildlifeSpeciesTextures
      );
    }

    setInstances(nextInstances);
  });

  if (instances.length === 0) {
    return null;
  }

  return (
    <>
      {instances.map((instance) => (
        <RenderingWildlifeInstanceSprite
          key={instance.instanceId}
          instance={instance}
        />
      ))}
    </>
  );
}
