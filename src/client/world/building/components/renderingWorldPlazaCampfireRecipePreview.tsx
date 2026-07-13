'use client';

/**
 * Cookbook preview of the procedural map campfire (stone ring + log teepee).
 *
 * @module components/world/building/components/renderingWorldPlazaCampfireRecipePreview
 */

import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_CENTER_X_PX,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_CENTER_Y_PX,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_WIDTH_PX,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeUiConstants';
import { drawingWorldPlazaCampfireOnGraphicsAtScreenPoint } from '@/components/world/fire/domains/drawingWorldPlazaCampfireOnGraphics';
import { Application, Graphics } from 'pixi.js';
import 'pixi.js/unsafe-eval';
import { useEffect, useRef } from 'react';

/**
 * Renders the same unlit campfire body used on the world map.
 */
export function RenderingWorldPlazaCampfireRecipePreview(): React.JSX.Element {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    let disposed = false;
    let application: Application | null = null;

    const bootingCampfirePreview = async (): Promise<void> => {
      const nextApplication = new Application();

      await nextApplication.init({
        width: DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_WIDTH_PX,
        height:
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_HEIGHT_PX,
        backgroundAlpha: 0,
        antialias: false,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
      });

      if (disposed) {
        nextApplication.destroy(true);
        return;
      }

      application = nextApplication;
      host.appendChild(nextApplication.canvas);
      nextApplication.canvas.style.width = '100%';
      nextApplication.canvas.style.height = '100%';
      nextApplication.canvas.style.imageRendering = 'pixelated';

      const graphics = new Graphics();
      drawingWorldPlazaCampfireOnGraphicsAtScreenPoint(
        graphics,
        DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_CENTER_X_PX,
        DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_CENTER_Y_PX,
        'unlit'
      );
      nextApplication.stage.addChild(graphics);
    };

    void bootingCampfirePreview();

    return () => {
      disposed = true;
      application?.destroy(true);
      host.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="size-20 shrink-0 sm:size-24 [&_canvas]:size-full [&_canvas]:[image-rendering:pixelated]"
      aria-hidden
    />
  );
}
