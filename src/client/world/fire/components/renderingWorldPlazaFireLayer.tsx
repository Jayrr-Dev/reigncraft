'use client';

import { computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex } from '@/components/world/domains/resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex';
import { DEFINING_WORLD_PLAZA_FIRE_GLOW_MAX_VISIBLE_COUNT } from '@/components/world/fire/domains/definingWorldPlazaFireConstants';
import {
  DEFINING_WORLD_PLAZA_FIRE_FLAME_ANIMATION_SPEED,
  DEFINING_WORLD_PLAZA_FIRE_SMOKE_ANIMATION_SPEED,
  resolvingWorldPlazaFireFlameDisplayScaleForTier,
  resolvingWorldPlazaFireFlameGroupForKind,
  resolvingWorldPlazaFireIntensityTier,
  resolvingWorldPlazaFireSmokeAlphaForTier,
  type DefiningWorldPlazaFireIntensityTier,
} from '@/components/world/fire/domains/definingWorldPlazaFireSpriteConstants';
import {
  checkingWorldPlazaFireSpriteTexturesAreReady,
  peekingWorldPlazaFireFlameFrameTextures,
  peekingWorldPlazaFireSmokeFrameTextures,
  preloadingWorldPlazaFireSpriteTextures,
  resolvingWorldPlazaFireFlameFrameTextures,
  resolvingWorldPlazaFireSmokeFrameTextures,
} from '@/components/world/fire/domains/loadingWorldPlazaFireSpriteTextures';
import type { DefiningWorldPlazaLightSource } from '@/components/world/lighting/domains/definingWorldPlazaLightSource';
import {
  clearingWorldPlazaLightSourcesForOwner,
  syncingWorldPlazaLightSourcesForOwner,
} from '@/components/world/lighting/domains/managingWorldPlazaLightSourceStore';
import { useTick } from '@pixi/react';
import type { Container } from 'pixi.js';
import { AnimatedSprite, Container as PixiContainer, Texture } from 'pixi.js';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

/** Light store namespace owned by the fire layer. */
const RENDERING_WORLD_PLAZA_FIRE_LIGHT_OWNER_KEY = 'fire';

/** Glow footprint relative to the player torch texture. */
const RENDERING_WORLD_PLAZA_FIRE_LIGHT_RADIUS_SCALE = 1.4;

/** Vertical offset so flame base sits on the tile foot anchor. */
const RENDERING_WORLD_PLAZA_FIRE_FLAME_FOOT_OFFSET_PX = 4;

export interface RenderingWorldPlazaFireLayerProps {
  readonly entityLayerRef: RefObject<Container | null>;
  readonly fireCells: readonly WorldFireDevvitCell[];
}

type RenderingWorldPlazaFireVisualState = {
  readonly flameGroup: number;
  readonly tier: DefiningWorldPlazaFireIntensityTier;
};

type RenderingWorldPlazaFireVisualEntry = {
  readonly root: Container;
  readonly flameSprite: AnimatedSprite;
  readonly smokeSprite: AnimatedSprite;
  visualState: RenderingWorldPlazaFireVisualState | null;
};

function buildingWorldPlazaFireTileKey(cell: WorldFireDevvitCell): string {
  return `${cell.tileX},${cell.tileY},${cell.worldLayer}`;
}

function resolvingWorldPlazaFireGridPointFromCell(
  cell: WorldFireDevvitCell
): DefiningWorldPlazaWorldPoint {
  return {
    x: cell.tileX + 0.5,
    y: cell.tileY + 0.5,
    layer: cell.worldLayer,
  };
}

function resolvingWorldPlazaFireVisualStateFromCell(
  cell: WorldFireDevvitCell
): RenderingWorldPlazaFireVisualState {
  return {
    flameGroup: resolvingWorldPlazaFireFlameGroupForKind(cell.kind),
    tier: resolvingWorldPlazaFireIntensityTier(cell.intensity),
  };
}

function mappingWorldPlazaFireCellToLightSource(
  cell: WorldFireDevvitCell
): DefiningWorldPlazaLightSource {
  const tier = resolvingWorldPlazaFireIntensityTier(cell.intensity);

  return {
    id: `fire:${buildingWorldPlazaFireTileKey(cell)}`,
    gridX: cell.tileX + 0.5,
    gridY: cell.tileY + 0.5,
    worldLayer: cell.worldLayer,
    radiusScale:
      RENDERING_WORLD_PLAZA_FIRE_LIGHT_RADIUS_SCALE *
      resolvingWorldPlazaFireFlameDisplayScaleForTier(tier),
    brightness: Math.max(0.35, cell.intensity),
  };
}

function creatingWorldPlazaFireVisualEntry(): RenderingWorldPlazaFireVisualEntry {
  const root = new PixiContainer();
  root.eventMode = 'none';
  root.visible = false;

  const flameSprite = new AnimatedSprite([Texture.EMPTY]);
  flameSprite.eventMode = 'none';
  flameSprite.anchor.set(0.5, 1);
  flameSprite.animationSpeed = DEFINING_WORLD_PLAZA_FIRE_FLAME_ANIMATION_SPEED;
  flameSprite.loop = true;

  const smokeSprite = new AnimatedSprite([Texture.EMPTY]);
  smokeSprite.eventMode = 'none';
  smokeSprite.anchor.set(0.5, 1);
  smokeSprite.animationSpeed = DEFINING_WORLD_PLAZA_FIRE_SMOKE_ANIMATION_SPEED;
  smokeSprite.loop = true;

  root.addChild(flameSprite);
  root.addChild(smokeSprite);

  return {
    root,
    flameSprite,
    smokeSprite,
    visualState: null,
  };
}

function applyingWorldPlazaFireSpriteTextures(
  entry: RenderingWorldPlazaFireVisualEntry,
  flameFrames: readonly Texture[],
  smokeFrames: readonly Texture[],
  visualState: RenderingWorldPlazaFireVisualState
): void {
  entry.flameSprite.textures = [...flameFrames];
  entry.smokeSprite.textures = [...smokeFrames];
  entry.visualState = visualState;
  entry.root.visible = true;

  applyingWorldPlazaFireVisualPresentation(entry, visualState.tier);
  entry.flameSprite.gotoAndPlay(Math.floor(Math.random() * flameFrames.length));

  if (entry.smokeSprite.visible) {
    entry.smokeSprite.gotoAndPlay(
      Math.floor(Math.random() * smokeFrames.length)
    );
  } else {
    entry.smokeSprite.stop();
  }
}

function applyingWorldPlazaFireVisualTexturesFromCache(
  entry: RenderingWorldPlazaFireVisualEntry,
  visualState: RenderingWorldPlazaFireVisualState
): boolean {
  const flameFrames = peekingWorldPlazaFireFlameFrameTextures(
    visualState.flameGroup,
    visualState.tier
  );
  const smokeFrames = peekingWorldPlazaFireSmokeFrameTextures(visualState.tier);

  if (!flameFrames || !smokeFrames) {
    return false;
  }

  applyingWorldPlazaFireSpriteTextures(
    entry,
    flameFrames,
    smokeFrames,
    visualState
  );

  return true;
}

function applyingWorldPlazaFireVisualPresentation(
  entry: RenderingWorldPlazaFireVisualEntry,
  tier: DefiningWorldPlazaFireIntensityTier
): void {
  const displayScale = resolvingWorldPlazaFireFlameDisplayScaleForTier(tier);
  const smokeAlpha = resolvingWorldPlazaFireSmokeAlphaForTier(tier);

  entry.flameSprite.scale.set(displayScale);
  entry.smokeSprite.scale.set(displayScale * 0.95);
  entry.smokeSprite.alpha = smokeAlpha;
  entry.smokeSprite.visible = smokeAlpha > 0.01;
  entry.smokeSprite.y = -entry.flameSprite.height * displayScale * 0.55;
  entry.flameSprite.animationSpeed =
    DEFINING_WORLD_PLAZA_FIRE_FLAME_ANIMATION_SPEED * (0.85 + tier * 0.06);
}

async function updatingWorldPlazaFireVisualTextures(
  entry: RenderingWorldPlazaFireVisualEntry,
  visualState: RenderingWorldPlazaFireVisualState
): Promise<void> {
  if (applyingWorldPlazaFireVisualTexturesFromCache(entry, visualState)) {
    return;
  }

  const [flameFrames, smokeFrames] = await Promise.all([
    resolvingWorldPlazaFireFlameFrameTextures(
      visualState.flameGroup,
      visualState.tier
    ),
    resolvingWorldPlazaFireSmokeFrameTextures(visualState.tier),
  ]);

  applyingWorldPlazaFireSpriteTextures(
    entry,
    flameFrames,
    smokeFrames,
    visualState
  );
}

function checkingWorldPlazaFireVisualStateMatches(
  current: RenderingWorldPlazaFireVisualState | null,
  next: RenderingWorldPlazaFireVisualState
): boolean {
  return (
    current !== null &&
    current.flameGroup === next.flameGroup &&
    current.tier === next.tier
  );
}

/**
 * Renders animated fire flames and smoke from sprite sheets, scaling the
 * visual tier with remaining fuel intensity. Each burning cell is also
 * published as a world light source for the night lighting engine.
 */
export function RenderingWorldPlazaFireLayer({
  entityLayerRef,
  fireCells,
}: RenderingWorldPlazaFireLayerProps): null {
  const fireVisualPoolRef = useRef<
    Map<string, RenderingWorldPlazaFireVisualEntry>
  >(new Map());
  const [areSpriteTexturesReady, setAreSpriteTexturesReady] = useState(false);
  const visibleFireCells = useMemo(
    () => fireCells.slice(0, DEFINING_WORLD_PLAZA_FIRE_GLOW_MAX_VISIBLE_COUNT),
    [fireCells]
  );
  const visibleFireCellsRef = useRef(visibleFireCells);

  useEffect(() => {
    visibleFireCellsRef.current = visibleFireCells;
    syncingWorldPlazaLightSourcesForOwner(
      RENDERING_WORLD_PLAZA_FIRE_LIGHT_OWNER_KEY,
      visibleFireCells.map(mappingWorldPlazaFireCellToLightSource)
    );
  }, [visibleFireCells]);

  useEffect(() => {
    let isCancelled = false;

    void preloadingWorldPlazaFireSpriteTextures().then(() => {
      if (!isCancelled) {
        setAreSpriteTexturesReady(
          checkingWorldPlazaFireSpriteTexturesAreReady()
        );
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const fireVisualPool = fireVisualPoolRef.current;

    return () => {
      clearingWorldPlazaLightSourcesForOwner(
        RENDERING_WORLD_PLAZA_FIRE_LIGHT_OWNER_KEY
      );

      for (const entry of fireVisualPool.values()) {
        entry.root.destroy({ children: true });
      }

      fireVisualPool.clear();
    };
  }, []);

  useTick(() => {
    if (!areSpriteTexturesReady) {
      return;
    }

    const entityLayer = entityLayerRef.current;
    const fireVisualPool = fireVisualPoolRef.current;
    const cells = visibleFireCellsRef.current;

    if (!entityLayer) {
      return;
    }

    const activeTileKeys = new Set(cells.map(buildingWorldPlazaFireTileKey));

    for (const [tileKey, entry] of fireVisualPool) {
      if (!activeTileKeys.has(tileKey)) {
        entityLayer.removeChild(entry.root);
        entry.root.destroy({ children: true });
        fireVisualPool.delete(tileKey);
      }
    }

    let didMutateEntityLayerOrder = false;

    for (const cell of cells) {
      const tileKey = buildingWorldPlazaFireTileKey(cell);
      let entry = fireVisualPool.get(tileKey);

      if (!entry) {
        entry = creatingWorldPlazaFireVisualEntry();
        fireVisualPool.set(tileKey, entry);
      }

      const gridPoint = resolvingWorldPlazaFireGridPointFromCell(cell);
      const footAnchor =
        computingWorldPlazaPlayerNightLightFootAnchorFromGridPoint(gridPoint);
      const flameZIndex =
        resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex(
          gridPoint,
          2
        );
      const nextVisualState = resolvingWorldPlazaFireVisualStateFromCell(cell);

      entry.root.position.set(
        footAnchor.centerXPx,
        footAnchor.centerYPx + RENDERING_WORLD_PLAZA_FIRE_FLAME_FOOT_OFFSET_PX
      );

      if (entry.root.zIndex !== flameZIndex) {
        entry.root.zIndex = flameZIndex;
        didMutateEntityLayerOrder = true;
      }

      if (
        !checkingWorldPlazaFireVisualStateMatches(
          entry.visualState,
          nextVisualState
        )
      ) {
        if (
          !applyingWorldPlazaFireVisualTexturesFromCache(entry, nextVisualState)
        ) {
          void updatingWorldPlazaFireVisualTextures(entry, nextVisualState);
        }
      } else {
        applyingWorldPlazaFireVisualPresentation(entry, nextVisualState.tier);
      }

      if (entry.root.visible && entry.root.parent !== entityLayer) {
        entityLayer.addChild(entry.root);
      }
    }

    if (didMutateEntityLayerOrder && entityLayer.sortableChildren) {
      entityLayer.sortChildren();
    }
  });

  return null;
}
