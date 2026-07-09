'use client';

import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import {
  computingWorldDepthSortKey,
  DEFINING_WORLD_DEPTH_CLICK_ARROW_EFFECT_Z_INDEX_OFFSET,
} from '@/components/world/depth';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_CHEST_LIFT_PX } from '@/components/world/domains/definingWorldPlazaPlayerCombatLockConstants';
import type { DefiningWorldPlazaPlayerCombatLockState } from '@/components/world/domains/definingWorldPlazaPlayerCombatLockTypes';
import { drawingWorldPlazaPlayerCombatLockCrosshairOnGraphics } from '@/components/world/domains/drawingWorldPlazaPlayerCombatLockCrosshairOnGraphics';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  gettingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeInstanceSizeScale } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { computingWildlifeJumpArcLiftPx } from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
import { useTick } from '@pixi/react';
import type { Graphics } from 'pixi.js';
import { useCallback, useRef } from 'react';

export type RenderingWorldPlazaPlayerCombatLockCrosshairProps = {
  combatLockRef: React.RefObject<DefiningWorldPlazaPlayerCombatLockState | null>;
  wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>;
};

/**
 * Small amber crosshair that follows the combat-locked wildlife instance.
 */
export function RenderingWorldPlazaPlayerCombatLockCrosshair({
  combatLockRef,
  wildlifeStoreRef,
}: RenderingWorldPlazaPlayerCombatLockCrosshairProps): React.JSX.Element {
  const graphicsRef = useRef<Graphics | null>(null);
  const hasDrawnGeometryRef = useRef(false);

  const drawingCrosshair = useCallback((graphics: Graphics): void => {
    graphicsRef.current = graphics;
    graphics.visible = false;
    graphics.alpha = 0;
    hasDrawnGeometryRef.current = false;
  }, []);

  useTick(() => {
    const graphics = graphicsRef.current;
    const lock = combatLockRef.current;

    if (!graphics) {
      return;
    }

    if (!lock) {
      graphics.visible = false;
      graphics.alpha = 0;
      return;
    }

    const instance = gettingWildlifeInstance(
      wildlifeStoreRef.current,
      lock.targetInstanceId
    );

    if (!instance || instance.isDead) {
      graphics.visible = false;
      graphics.alpha = 0;
      return;
    }

    const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

    if (!species) {
      graphics.visible = false;
      graphics.alpha = 0;
      return;
    }

    if (!hasDrawnGeometryRef.current) {
      drawingWorldPlazaPlayerCombatLockCrosshairOnGraphics(graphics);
      hasDrawnGeometryRef.current = true;
    }

    const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: instance.position.x,
      y: instance.position.y,
    });
    const standingLayerOffsetPx =
      computingWorldBuildingWorldLayerScreenOffsetPx(instance.position.layer);
    const sizeScale = resolvingWildlifeInstanceSizeScale(species, instance);
    const jumpState = instance.aiState.jumpState;
    const jumpLiftPx = jumpState
      ? computingWildlifeJumpArcLiftPx(
          species.jump.jumpArcPeakPx,
          jumpState.progress
        )
      : 0;
    const chestLiftPx =
      DEFINING_WORLD_PLAZA_PLAYER_COMBAT_LOCK_CROSSHAIR_CHEST_LIFT_PX *
      sizeScale;

    graphics.visible = true;
    graphics.alpha = 1;
    graphics.position.set(
      screenPoint.x,
      screenPoint.y + standingLayerOffsetPx - jumpLiftPx - chestLiftPx
    );
    graphics.zIndex =
      computingWorldDepthSortKey({
        x: instance.position.x,
        y: instance.position.y,
        layer: instance.position.layer,
      }) +
      DEFINING_WORLD_DEPTH_CLICK_ARROW_EFFECT_Z_INDEX_OFFSET +
      1;
  });

  return <pixiGraphics draw={drawingCrosshair} eventMode="none" />;
}
