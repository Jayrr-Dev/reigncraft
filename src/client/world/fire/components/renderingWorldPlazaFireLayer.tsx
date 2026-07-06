'use client';

import { advancingWorldPlazaDeclarativeAnimationPlayback } from '@/components/world/animation/domains/advancingWorldPlazaDeclarativeAnimationPlayback';
import type { AdvancingWorldPlazaDeclarativeAnimationPlaybackState } from '@/components/world/animation/domains/definingWorldPlazaAnimationTypes';
import {
  formattingWorldPlazaFireFlameClipId,
  formattingWorldPlazaFireSmokeClipId,
} from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import { resolvingWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { registeringWorldPlazaFireAnimationClips } from '@/components/world/animation/domains/registeringWorldPlazaFireAnimationClips';
import {
  applyingWorldPlazaDeclarativeAnimationFrameToSprite,
  initializingWorldPlazaDeclarativeAnimationPlaybackForSprites,
  resolvingWorldPlazaDeclarativeAnimationFrame,
} from '@/components/world/animation/domains/resolvingWorldPlazaDeclarativeAnimationFrame';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_DEPTH_FIRE_GLOW_FLOOR_DEPTH_BIAS } from '@/components/world/depth';
import { computingWorldPlazaEmissiveNightBrightnessMultiplierFromSunState } from '@/components/world/domains/computingWorldPlazaEmissiveNightBrightnessMultiplierFromSunState';
import { computingWorldPlazaTileCenterScreenAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaTileCenterScreenAnchorFromGridPoint';
import { DEFINING_WORLD_PLAZA_EMISSIVE_CAMPFIRE_FLAME_ALPHA_BOOST_AT_MIDNIGHT } from '@/components/world/domains/definingWorldPlazaEmissiveNightBoostConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex } from '@/components/world/domains/resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex';
import {
  checkingWorldPlazaFireCellUsesSmallSurfaceFlame,
  DEFINING_WORLD_PLAZA_FIRE_SMALL_SURFACE_FLAME_SCALE,
  DEFINING_WORLD_PLAZA_FIRE_SMALL_SURFACE_MAX_TIER,
} from '@/components/world/fire/domains/checkingWorldPlazaFireCellUsesSmallSurfaceFlame';
import { DEFINING_WORLD_PLAZA_FIRE_GLOW_MAX_VISIBLE_COUNT } from '@/components/world/fire/domains/definingWorldPlazaFireConstants';
import {
  resolvingWorldPlazaFireFlameDisplayScaleForTier,
  resolvingWorldPlazaFireFlameGroupForKind,
  resolvingWorldPlazaFireIntensityTier,
  resolvingWorldPlazaFireSmokeAlphaForTier,
  type DefiningWorldPlazaFireIntensityTier,
} from '@/components/world/fire/domains/definingWorldPlazaFireSpriteConstants';
import { resolvingWorldPlazaCampfireFlameFootOffsetFromFootAnchorPx } from '@/components/world/fire/domains/drawingWorldPlazaCampfireOnGraphics';
import {
  checkingWorldPlazaFireSpriteTexturesAreReady,
  preloadingWorldPlazaFireSpriteTextures,
} from '@/components/world/fire/domains/loadingWorldPlazaFireSpriteTextures';
import { usingWorldPlazaDayNightSunState } from '@/components/world/hooks/usingWorldPlazaDayNightSunState';
import type { DefiningWorldPlazaLightSource } from '@/components/world/lighting/domains/definingWorldPlazaLightSource';
import {
  clearingWorldPlazaLightSourcesForOwner,
  syncingWorldPlazaLightSourcesForOwner,
} from '@/components/world/lighting/domains/managingWorldPlazaLightSourceStore';
import { useTick } from '@pixi/react';
import type { Container, Sprite, Ticker } from 'pixi.js';
import {
  Container as PixiContainer,
  Sprite as PixiSprite,
  Texture,
} from 'pixi.js';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import {
  computingWorldCampfireEffectiveIntensity,
  computingWorldCampfireEffectiveWoodCount,
  computingWorldCampfireFlameFuelDimmingScale,
  computingWorldCampfireLightBrightnessFromBurnTier,
  computingWorldCampfireLightRadiusScaleFromBurnTier,
  countingWorldCampfireNearbyFuelWoodBlocksFromPlacedBlocks,
  resolvingWorldCampfireBurnTierFromNearbyWoodCount,
  resolvingWorldCampfireFlameIntensityTierFromEffectiveWoodCount,
  WORLD_CAMPFIRE_BURN_TIER_FLAME_SCALE_MULTIPLIER,
  WORLD_CAMPFIRE_FLAME_BASE_DISPLAY_SCALE,
  type WorldCampfireBurnTier,
} from '../../../../shared/worldCampfireFuel';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

type RenderingWorldPlazaFireLayerPlacedBlocks =
  | ReadonlyArray<DefiningWorldBuildingPlacedBlock>
  | undefined;

/** Light store namespace owned by the fire layer. */
const RENDERING_WORLD_PLAZA_FIRE_LIGHT_OWNER_KEY = 'fire';

/** Glow footprint relative to the player torch texture. */
const RENDERING_WORLD_PLAZA_FIRE_LIGHT_RADIUS_SCALE = 1.4;

/** Vertical offset so flame base sits on the tile foot anchor. */
const RENDERING_WORLD_PLAZA_FIRE_FLAME_FOOT_OFFSET_PX = 4;

export interface RenderingWorldPlazaFireLayerProps {
  readonly entityLayerRef: RefObject<Container | null>;
  readonly fireCells: readonly WorldFireDevvitCell[];
  readonly placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
}

type RenderingWorldPlazaFireVisualState = {
  readonly flameGroup: number;
  readonly tier: DefiningWorldPlazaFireIntensityTier;
  readonly scaleMultiplier: number;
};

type RenderingWorldPlazaFireVisualEntry = {
  readonly root: Container;
  readonly flameSprite: Sprite;
  readonly smokeSprite: Sprite;
  flamePlaybackState: AdvancingWorldPlazaDeclarativeAnimationPlaybackState;
  smokePlaybackState: AdvancingWorldPlazaDeclarativeAnimationPlaybackState;
  visualState: RenderingWorldPlazaFireVisualState | null;
};

function buildingWorldPlazaFireTileKey(cell: WorldFireDevvitCell): string {
  return `${cell.tileX},${cell.tileY},${cell.worldLayer}`;
}

function resolvingWorldPlazaFireFlameFootOffsetPx(
  cell: WorldFireDevvitCell
): number {
  if (cell.kind === 'campfire') {
    return resolvingWorldPlazaCampfireFlameFootOffsetFromFootAnchorPx();
  }

  return RENDERING_WORLD_PLAZA_FIRE_FLAME_FOOT_OFFSET_PX;
}

function resolvingWorldPlazaFireGridPointFromCell(
  cell: WorldFireDevvitCell
): DefiningWorldPlazaWorldPoint {
  return {
    x: cell.tileX,
    y: cell.tileY,
    layer: cell.worldLayer,
  };
}

function resolvingWorldPlazaCampfireCellIntensity(
  cell: WorldFireDevvitCell,
  placedBlocks: RenderingWorldPlazaFireLayerPlacedBlocks
): number {
  const nearbyWoodCount =
    countingWorldCampfireNearbyFuelWoodBlocksFromPlacedBlocks(
      cell.tileX,
      cell.tileY,
      cell.worldLayer,
      placedBlocks ?? []
    );
  const initialFuelMs =
    cell.initialFuelMs > 0 ? cell.initialFuelMs : cell.fuelRemainingMs;

  return computingWorldCampfireEffectiveIntensity(
    nearbyWoodCount,
    cell.fuelRemainingMs,
    initialFuelMs,
    cell.inventoryFuelWoodCount ?? 0
  );
}

function resolvingWorldPlazaCampfireEffectiveWoodCount(
  cell: WorldFireDevvitCell,
  placedBlocks: RenderingWorldPlazaFireLayerPlacedBlocks
): number {
  const nearbyWoodCount =
    countingWorldCampfireNearbyFuelWoodBlocksFromPlacedBlocks(
      cell.tileX,
      cell.tileY,
      cell.worldLayer,
      placedBlocks ?? []
    );

  return computingWorldCampfireEffectiveWoodCount(
    nearbyWoodCount,
    cell.inventoryFuelWoodCount ?? 0
  );
}

function resolvingWorldPlazaCampfireBurnTier(
  cell: WorldFireDevvitCell,
  placedBlocks: RenderingWorldPlazaFireLayerPlacedBlocks
): WorldCampfireBurnTier {
  return resolvingWorldCampfireBurnTierFromNearbyWoodCount(
    resolvingWorldPlazaCampfireEffectiveWoodCount(cell, placedBlocks)
  );
}

function resolvingWorldPlazaFireVisualStateFromCell(
  cell: WorldFireDevvitCell,
  placedBlocks: RenderingWorldPlazaFireLayerPlacedBlocks
): RenderingWorldPlazaFireVisualState {
  const usesSmallSurfaceFlame = checkingWorldPlazaFireCellUsesSmallSurfaceFlame(
    cell,
    placedBlocks
  );
  const campfireBurnTier =
    cell.kind === 'campfire'
      ? resolvingWorldPlazaCampfireBurnTier(cell, placedBlocks)
      : null;
  const initialFuelMs =
    cell.initialFuelMs > 0 ? cell.initialFuelMs : cell.fuelRemainingMs;
  const campfireFuelDimmingScale =
    cell.kind === 'campfire'
      ? computingWorldCampfireFlameFuelDimmingScale(
          cell.fuelRemainingMs,
          initialFuelMs
        )
      : 1;
  const intensity =
    cell.kind === 'campfire'
      ? resolvingWorldPlazaCampfireCellIntensity(cell, placedBlocks)
      : cell.intensity;
  const tier =
    cell.kind === 'campfire'
      ? resolvingWorldCampfireFlameIntensityTierFromEffectiveWoodCount(
          resolvingWorldPlazaCampfireEffectiveWoodCount(cell, placedBlocks)
        )
      : resolvingWorldPlazaFireIntensityTier(intensity);

  return {
    flameGroup: resolvingWorldPlazaFireFlameGroupForKind(cell.kind),
    tier: usesSmallSurfaceFlame
      ? (Math.min(
          tier,
          DEFINING_WORLD_PLAZA_FIRE_SMALL_SURFACE_MAX_TIER
        ) as DefiningWorldPlazaFireIntensityTier)
      : tier,
    scaleMultiplier: usesSmallSurfaceFlame
      ? DEFINING_WORLD_PLAZA_FIRE_SMALL_SURFACE_FLAME_SCALE
      : campfireBurnTier !== null
        ? WORLD_CAMPFIRE_BURN_TIER_FLAME_SCALE_MULTIPLIER[campfireBurnTier] *
          WORLD_CAMPFIRE_FLAME_BASE_DISPLAY_SCALE *
          campfireFuelDimmingScale
        : 1,
  };
}

function filteringWorldPlazaFireLayerCells(
  fireCells: readonly WorldFireDevvitCell[]
): readonly WorldFireDevvitCell[] {
  return fireCells.filter(
    (cell) => cell.kind === 'spreading' || cell.kind === 'campfire'
  );
}

function mappingWorldPlazaFireCellToLightSource(
  cell: WorldFireDevvitCell,
  placedBlocks: RenderingWorldPlazaFireLayerPlacedBlocks
): DefiningWorldPlazaLightSource {
  const isCampfire = cell.kind === 'campfire';
  const initialFuelMs =
    cell.initialFuelMs > 0 ? cell.initialFuelMs : cell.fuelRemainingMs;

  if (isCampfire) {
    const burnTier = resolvingWorldPlazaCampfireBurnTier(cell, placedBlocks);

    return {
      id: `fire:${buildingWorldPlazaFireTileKey(cell)}`,
      gridX: cell.tileX,
      gridY: cell.tileY,
      worldLayer: cell.worldLayer,
      radiusScale: computingWorldCampfireLightRadiusScaleFromBurnTier(
        burnTier,
        cell.fuelRemainingMs,
        initialFuelMs
      ),
      brightness: computingWorldCampfireLightBrightnessFromBurnTier(
        burnTier,
        cell.fuelRemainingMs,
        initialFuelMs
      ),
    };
  }

  const intensity = cell.intensity;
  const tier = resolvingWorldPlazaFireIntensityTier(intensity);

  return {
    id: `fire:${buildingWorldPlazaFireTileKey(cell)}`,
    gridX: cell.tileX,
    gridY: cell.tileY,
    worldLayer: cell.worldLayer,
    radiusScale:
      RENDERING_WORLD_PLAZA_FIRE_LIGHT_RADIUS_SCALE *
      resolvingWorldPlazaFireFlameDisplayScaleForTier(tier),
    brightness: Math.max(0.35, intensity),
  };
}

function creatingWorldPlazaFireVisualEntry(): RenderingWorldPlazaFireVisualEntry {
  const root = new PixiContainer();
  root.eventMode = 'none';
  root.visible = false;

  const flameSprite = new PixiSprite(Texture.EMPTY);
  flameSprite.eventMode = 'none';
  flameSprite.anchor.set(0.5, 1);

  const smokeSprite = new PixiSprite(Texture.EMPTY);
  smokeSprite.eventMode = 'none';
  smokeSprite.anchor.set(0.5, 1);

  root.addChild(flameSprite);
  root.addChild(smokeSprite);

  return {
    root,
    flameSprite,
    smokeSprite,
    flamePlaybackState: {
      clipId: '',
      variantKey: '',
      frameIndex: 0,
      elapsedMs: 0,
      pingPongDirection: 1,
      isComplete: false,
      phaseOffsetMs: 0,
    },
    smokePlaybackState: {
      clipId: '',
      variantKey: '',
      frameIndex: 0,
      elapsedMs: 0,
      pingPongDirection: 1,
      isComplete: false,
      phaseOffsetMs: 0,
    },
    visualState: null,
  };
}

function applyingWorldPlazaFireVisualPresentation(
  entry: RenderingWorldPlazaFireVisualEntry,
  visualState: RenderingWorldPlazaFireVisualState
): void {
  const displayScale =
    resolvingWorldPlazaFireFlameDisplayScaleForTier(visualState.tier) *
    visualState.scaleMultiplier;
  const smokeAlpha = resolvingWorldPlazaFireSmokeAlphaForTier(visualState.tier);

  entry.flameSprite.scale.set(displayScale);
  entry.smokeSprite.scale.set(displayScale * 0.95);
  entry.smokeSprite.alpha = smokeAlpha;
  entry.smokeSprite.visible = smokeAlpha > 0.01;
  entry.smokeSprite.y = -entry.flameSprite.height * displayScale * 0.55;
}

function initializingWorldPlazaFireDeclarativePlayback(
  entry: RenderingWorldPlazaFireVisualEntry,
  visualState: RenderingWorldPlazaFireVisualState,
  nowMs: number
): boolean {
  const flameClipId = formattingWorldPlazaFireFlameClipId(
    visualState.flameGroup,
    visualState.tier
  );
  const smokeClipId = formattingWorldPlazaFireSmokeClipId(visualState.tier);
  const flameClip = resolvingWorldPlazaAnimationClip(flameClipId);
  const smokeClip = resolvingWorldPlazaAnimationClip(smokeClipId);

  if (!flameClip || !smokeClip) {
    return false;
  }

  entry.flamePlaybackState =
    initializingWorldPlazaDeclarativeAnimationPlaybackForSprites(
      { clipId: flameClipId, playing: true },
      flameClip,
      [entry.flameSprite],
      nowMs
    );
  entry.smokePlaybackState =
    initializingWorldPlazaDeclarativeAnimationPlaybackForSprites(
      { clipId: smokeClipId, playing: smokeAlphaShowsSmoke(visualState.tier) },
      smokeClip,
      [entry.smokeSprite],
      nowMs
    );
  entry.visualState = visualState;
  entry.root.visible = true;
  applyingWorldPlazaFireVisualPresentation(entry, visualState);

  return true;
}

function applyingWorldPlazaCampfireNightFlameAlphaBoost(
  entry: RenderingWorldPlazaFireVisualEntry,
  cell: WorldFireDevvitCell,
  nightFlameAlphaMultiplier: number
): void {
  if (cell.kind !== 'campfire' || nightFlameAlphaMultiplier <= 1) {
    return;
  }

  entry.flameSprite.alpha = Math.min(
    1,
    entry.flameSprite.alpha * nightFlameAlphaMultiplier
  );
}

function smokeAlphaShowsSmoke(
  tier: DefiningWorldPlazaFireIntensityTier
): boolean {
  return resolvingWorldPlazaFireSmokeAlphaForTier(tier) > 0.01;
}

function advancingWorldPlazaFireDeclarativePlayback(
  entry: RenderingWorldPlazaFireVisualEntry,
  visualState: RenderingWorldPlazaFireVisualState,
  deltaMs: number,
  nowMs: number
): void {
  const flameClipId = formattingWorldPlazaFireFlameClipId(
    visualState.flameGroup,
    visualState.tier
  );
  const smokeClipId = formattingWorldPlazaFireSmokeClipId(visualState.tier);
  const flameClip = resolvingWorldPlazaAnimationClip(flameClipId);
  const smokeClip = resolvingWorldPlazaAnimationClip(smokeClipId);

  if (!flameClip || !smokeClip) {
    return;
  }

  entry.flamePlaybackState = advancingWorldPlazaDeclarativeAnimationPlayback({
    state: entry.flamePlaybackState,
    request: { clipId: flameClipId, playing: true },
    clip: flameClip,
    deltaMs,
    nowMs,
  });
  applyingWorldPlazaDeclarativeAnimationFrameToSprite(
    entry.flameSprite,
    resolvingWorldPlazaDeclarativeAnimationFrame(
      entry.flamePlaybackState,
      flameClip
    )
  );

  entry.smokePlaybackState = advancingWorldPlazaDeclarativeAnimationPlayback({
    state: entry.smokePlaybackState,
    request: {
      clipId: smokeClipId,
      playing: smokeAlphaShowsSmoke(visualState.tier),
    },
    clip: smokeClip,
    deltaMs,
    nowMs,
  });
  applyingWorldPlazaDeclarativeAnimationFrameToSprite(
    entry.smokeSprite,
    resolvingWorldPlazaDeclarativeAnimationFrame(
      entry.smokePlaybackState,
      smokeClip
    )
  );
}

function checkingWorldPlazaFirePlaybackStateMatches(
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
 * Renders animated fire flames and smoke from declarative clip definitions.
 * Each burning cell is also published as a world light source.
 */
export function RenderingWorldPlazaFireLayer({
  entityLayerRef,
  fireCells,
  placedBlocks,
}: RenderingWorldPlazaFireLayerProps): null {
  const sunState = usingWorldPlazaDayNightSunState();
  const campfireNightFlameAlphaMultiplierRef = useRef(1);
  const fireVisualPoolRef = useRef<
    Map<string, RenderingWorldPlazaFireVisualEntry>
  >(new Map());
  const [areSpriteTexturesReady, setAreSpriteTexturesReady] = useState(false);
  const visibleFireCells = useMemo(
    () =>
      filteringWorldPlazaFireLayerCells(fireCells).slice(
        0,
        DEFINING_WORLD_PLAZA_FIRE_GLOW_MAX_VISIBLE_COUNT
      ),
    [fireCells]
  );
  const visibleFireCellsRef = useRef(visibleFireCells);
  const placedBlocksRef = useRef(placedBlocks);

  placedBlocksRef.current = placedBlocks;

  useEffect(() => {
    campfireNightFlameAlphaMultiplierRef.current =
      computingWorldPlazaEmissiveNightBrightnessMultiplierFromSunState(
        sunState,
        DEFINING_WORLD_PLAZA_EMISSIVE_CAMPFIRE_FLAME_ALPHA_BOOST_AT_MIDNIGHT
      );
  }, [sunState]);

  useEffect(() => {
    visibleFireCellsRef.current = visibleFireCells;
  }, [visibleFireCells]);

  useEffect(() => {
    let isCancelled = false;

    void preloadingWorldPlazaFireSpriteTextures().then(() => {
      registeringWorldPlazaFireAnimationClips();

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

  useTick((ticker: Ticker) => {
    if (!areSpriteTexturesReady) {
      return;
    }

    const entityLayer = entityLayerRef.current;
    const fireVisualPool = fireVisualPoolRef.current;
    const cells = visibleFireCellsRef.current;
    const nowMs = performance.now();

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
      const tileAnchor =
        computingWorldPlazaTileCenterScreenAnchorFromGridPoint(gridPoint);
      const flameZIndex =
        resolvingWorldPlazaPlayerNightLightFloorTorchGraphicsZIndex(
          gridPoint,
          DEFINING_WORLD_DEPTH_FIRE_GLOW_FLOOR_DEPTH_BIAS
        );
      const nextVisualState = resolvingWorldPlazaFireVisualStateFromCell(
        cell,
        placedBlocksRef.current
      );

      entry.root.position.set(
        tileAnchor.centerXPx,
        tileAnchor.centerYPx + resolvingWorldPlazaFireFlameFootOffsetPx(cell)
      );

      if (entry.root.zIndex !== flameZIndex) {
        entry.root.zIndex = flameZIndex;
        didMutateEntityLayerOrder = true;
      }

      if (
        !checkingWorldPlazaFirePlaybackStateMatches(
          entry.visualState,
          nextVisualState
        )
      ) {
        initializingWorldPlazaFireDeclarativePlayback(
          entry,
          nextVisualState,
          nowMs
        );
        applyingWorldPlazaCampfireNightFlameAlphaBoost(
          entry,
          cell,
          campfireNightFlameAlphaMultiplierRef.current
        );
      } else {
        applyingWorldPlazaFireVisualPresentation(entry, nextVisualState);
        advancingWorldPlazaFireDeclarativePlayback(
          entry,
          nextVisualState,
          ticker.deltaMS,
          nowMs
        );
        applyingWorldPlazaCampfireNightFlameAlphaBoost(
          entry,
          cell,
          campfireNightFlameAlphaMultiplierRef.current
        );
      }

      if (entry.root.visible && entry.root.parent !== entityLayer) {
        entityLayer.addChild(entry.root);
      }
    }

    if (didMutateEntityLayerOrder && entityLayer.sortableChildren) {
      entityLayer.sortChildren();
    }

    syncingWorldPlazaLightSourcesForOwner(
      RENDERING_WORLD_PLAZA_FIRE_LIGHT_OWNER_KEY,
      cells.map((cell) =>
        mappingWorldPlazaFireCellToLightSource(
          cell,
          placedBlocksRef.current ?? []
        )
      )
    );
  });

  return null;
}
