'use client';

/**
 * Pixi layer for Spirited Sprites beta visual spawns (slide-walk preview).
 *
 * @module components/world/beta/spirited/components/renderingSpiritedSpritesBetaLayer
 */

import { advancingSpiritedSpritesBetaWalkTick } from '@/components/world/beta/spirited/domains/advancingSpiritedSpritesBetaWalkTick';
import {
  DEFINING_SPIRITED_SPRITES_BETA_DISPLAY_SCALE,
  DEFINING_SPIRITED_SPRITES_BETA_FRAME_HEIGHT_PX,
  DEFINING_SPIRITED_SPRITES_BETA_FRAME_WIDTH_PX,
} from '@/components/world/beta/spirited/domains/definingSpiritedSpritesBetaCatalog';
import { loadingSpiritedSpritesBetaTextures } from '@/components/world/beta/spirited/domains/loadingSpiritedSpritesBetaTextures';
import {
  listingSpiritedSpritesBetaSpawnInstances,
  type ManagingSpiritedSpritesBetaSpawnInstance,
  type ManagingSpiritedSpritesBetaSpawnStore,
} from '@/components/world/beta/spirited/domains/managingSpiritedSpritesBetaSpawnStore';
import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { useTick } from '@pixi/react';
import type { Sprite, Texture } from 'pixi.js';
import { memo, useEffect, useRef, useState } from 'react';

export type RenderingSpiritedSpritesBetaLayerProps = {
  readonly storeRef: React.RefObject<ManagingSpiritedSpritesBetaSpawnStore>;
};

type RenderingSpiritedSpritesBetaLoadedFrames = {
  readonly animalId: string;
  readonly frames: readonly Texture[];
};

function RenderingSpiritedSpritesBetaInstanceSprite({
  instance,
}: {
  readonly instance: ManagingSpiritedSpritesBetaSpawnInstance;
}): React.JSX.Element | null {
  const spriteRef = useRef<Sprite | null>(null);
  const framesRef = useRef<readonly Texture[] | null>(null);
  const instanceRef = useRef(instance);
  instanceRef.current = instance;

  const [sheet, setSheet] =
    useState<RenderingSpiritedSpritesBetaLoadedFrames | null>(null);

  useEffect(() => {
    let cancelled = false;

    void loadingSpiritedSpritesBetaTextures(instance.animalId).then(
      (loaded) => {
        if (cancelled || !loaded || loaded.frames.length === 0) {
          return;
        }

        framesRef.current = loaded.frames;
        setSheet({ animalId: instance.animalId, frames: loaded.frames });
      }
    );

    return () => {
      cancelled = true;
    };
  }, [instance.animalId]);

  useTick((ticker) => {
    const sprite = spriteRef.current;
    const frames = framesRef.current;
    const live = instanceRef.current;
    if (!sprite || !frames || frames.length === 0) {
      return;
    }

    const deltaSec = ticker.deltaMS / 1000;
    const nowSec = performance.now() / 1000;
    const bobOffsetPx = advancingSpiritedSpritesBetaWalkTick(
      live,
      deltaSec,
      nowSec
    );

    const standingLayer = resolvingWorldPlazaPlayerWorldLayer(live.position);
    const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(
      live.position
    );
    const standingLayerOffsetPx =
      computingWorldBuildingWorldLayerScreenOffsetPx(standingLayer);
    const facingFrame =
      ((live.facingFrame % frames.length) + frames.length) % frames.length;

    sprite.texture = frames[facingFrame] ?? frames[0];
    sprite.position.set(
      screenPoint.x,
      screenPoint.y + standingLayerOffsetPx + bobOffsetPx
    );
    sprite.width =
      DEFINING_SPIRITED_SPRITES_BETA_FRAME_WIDTH_PX *
      DEFINING_SPIRITED_SPRITES_BETA_DISPLAY_SCALE;
    sprite.height =
      DEFINING_SPIRITED_SPRITES_BETA_FRAME_HEIGHT_PX *
      DEFINING_SPIRITED_SPRITES_BETA_DISPLAY_SCALE;
    sprite.zIndex = computingWorldDepthSortKey(live.position);
  });

  if (!sheet || sheet.frames.length === 0) {
    return null;
  }

  const standingLayer = resolvingWorldPlazaPlayerWorldLayer(instance.position);
  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint(
    instance.position
  );
  const standingLayerOffsetPx =
    computingWorldBuildingWorldLayerScreenOffsetPx(standingLayer);
  const initialFrame =
    ((instance.facingFrame % sheet.frames.length) + sheet.frames.length) %
    sheet.frames.length;

  return (
    <pixiSprite
      ref={spriteRef}
      texture={sheet.frames[initialFrame] ?? sheet.frames[0]}
      anchor={{ x: 0.5, y: 1 }}
      x={screenPoint.x}
      y={screenPoint.y + standingLayerOffsetPx}
      width={
        DEFINING_SPIRITED_SPRITES_BETA_FRAME_WIDTH_PX *
        DEFINING_SPIRITED_SPRITES_BETA_DISPLAY_SCALE
      }
      height={
        DEFINING_SPIRITED_SPRITES_BETA_FRAME_HEIGHT_PX *
        DEFINING_SPIRITED_SPRITES_BETA_DISPLAY_SCALE
      }
      zIndex={computingWorldDepthSortKey(instance.position)}
      eventMode="none"
    />
  );
}

function RenderingSpiritedSpritesBetaLayerComponent({
  storeRef,
}: RenderingSpiritedSpritesBetaLayerProps): React.JSX.Element {
  const [revision, setRevision] = useState(0);
  const lastRevisionRef = useRef(-1);

  useTick(() => {
    const store = storeRef.current;
    if (!store || store.revision === lastRevisionRef.current) {
      return;
    }

    lastRevisionRef.current = store.revision;
    setRevision(store.revision);
  });

  const instances = storeRef.current
    ? listingSpiritedSpritesBetaSpawnInstances(storeRef.current)
    : [];

  void revision;

  return (
    <>
      {instances.map((instance) => (
        <RenderingSpiritedSpritesBetaInstanceSprite
          key={instance.instanceId}
          instance={instance}
        />
      ))}
    </>
  );
}

export const RenderingSpiritedSpritesBetaLayer = memo(
  RenderingSpiritedSpritesBetaLayerComponent
);
