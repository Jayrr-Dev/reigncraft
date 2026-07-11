'use client';

import {
  computingWorldDepthSortKey,
  DEFINING_WORLD_DEPTH_CLICK_ARROW_EFFECT_Z_INDEX_OFFSET,
} from '@/components/world/depth';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_CIRCLE_END_SCALE,
  DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_CIRCLE_START_SCALE,
  DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_DURATION_MS,
} from '@/components/world/domains/definingWorldPlazaClickArrowEffectConstants';
import type { DefiningWorldPlazaClickArrowEffectState } from '@/components/world/domains/definingWorldPlazaClickArrowEffectState';
import { drawingWorldPlazaIsometricClickMarkerCircleOnGraphics } from '@/components/world/domains/drawingWorldPlazaIsometricClickMarkerCircleOnGraphics';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import type { Graphics } from 'pixi.js';
import { useCallback, useRef } from 'react';

export interface RenderingWorldPlazaClickArrowEffectProps {
  /** Latest click marker payload; null when idle. */
  clickArrowEffectRef: React.RefObject<DefiningWorldPlazaClickArrowEffectState | null>;
}

/**
 * Brief shrinking circle at the click destination tile.
 */
export function RenderingWorldPlazaClickArrowEffect({
  clickArrowEffectRef,
}: RenderingWorldPlazaClickArrowEffectProps): React.JSX.Element | null {
  const arrowGraphicsRef = useRef<Graphics | null>(null);
  const lastRenderedStartedAtMsRef = useRef(0);

  const drawingClickArrow = useCallback((graphics: Graphics): void => {
    arrowGraphicsRef.current = graphics;
    graphics.visible = false;
    graphics.alpha = 0;
  }, []);

  usingWorldPlazaSafeTick(() => {
    const graphics = arrowGraphicsRef.current;
    const clickArrowEffect = clickArrowEffectRef.current;

    if (!graphics) {
      return;
    }

    if (!clickArrowEffect) {
      graphics.visible = false;
      graphics.alpha = 0;
      lastRenderedStartedAtMsRef.current = 0;
      return;
    }

    const elapsedMs = Date.now() - clickArrowEffect.startedAtMs;
    const progress =
      elapsedMs / DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_DURATION_MS;

    if (progress >= 1) {
      clickArrowEffectRef.current = null;
      graphics.visible = false;
      graphics.alpha = 0;
      lastRenderedStartedAtMsRef.current = 0;
      return;
    }

    if (lastRenderedStartedAtMsRef.current !== clickArrowEffect.startedAtMs) {
      drawingWorldPlazaIsometricClickMarkerCircleOnGraphics(graphics);
      lastRenderedStartedAtMsRef.current = clickArrowEffect.startedAtMs;
    }

    const targetScreenPoint =
      convertingWorldPlazaGridPointToIsometricScreenPoint(
        clickArrowEffect.targetGrid
      );
    const shrinkProgress = 1 - Math.pow(1 - progress, 2);
    const scale =
      DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_CIRCLE_START_SCALE +
      (DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_CIRCLE_END_SCALE -
        DEFINING_WORLD_PLAZA_CLICK_ARROW_EFFECT_CIRCLE_START_SCALE) *
        shrinkProgress;
    const alpha = 1 - shrinkProgress;

    graphics.visible = true;
    graphics.alpha = alpha;
    graphics.position.set(targetScreenPoint.x, targetScreenPoint.y);
    graphics.rotation = 0;
    graphics.scale.set(scale);
    graphics.zIndex =
      computingWorldDepthSortKey(clickArrowEffect.targetGrid) +
      DEFINING_WORLD_DEPTH_CLICK_ARROW_EFFECT_Z_INDEX_OFFSET;
  }, 'tick:click-arrow');

  return <pixiGraphics draw={drawingClickArrow} eventMode="none" />;
}
