'use client';

/**
 * Cookbook preview of the procedural map campfire (stone ring + log teepee).
 *
 * @module components/world/building/components/renderingWorldPlazaCampfireRecipePreview
 */

import { DEFINING_PLAZA_BESTIARY_PORTRAIT_SILHOUETTE_FILTER } from '@/components/home/domains/definingPlazaBestiarySpritePortraitConstants';
import { Icon } from '@/components/ui/icon';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_CENTER_X_PX,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_CENTER_Y_PX,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_SCALE,
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_WIDTH_PX,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeUiConstants';
import { drawingWorldPlazaCampfireOnGraphicsAtScreenPoint } from '@/components/world/fire/domains/drawingWorldPlazaCampfireOnGraphics';
import { cn } from '@/lib/utils';
import { Application, Graphics } from 'pixi.js';
import 'pixi.js/unsafe-eval';
import { useEffect, useRef, useState } from 'react';

export type RenderingWorldPlazaCampfireRecipePreviewPresentation =
  | 'full'
  | 'card';

export type RenderingWorldPlazaCampfireRecipePreviewProps = {
  /** `full` for detail / cookbook pages; `card` for guide grid tiles. */
  readonly presentation?: RenderingWorldPlazaCampfireRecipePreviewPresentation;
  /** Dark silhouette (locked Recipes guide entries). */
  readonly isSilhouette?: boolean;
  readonly className?: string;
};

/**
 * Renders the same unlit campfire body used on the world map.
 */
export function RenderingWorldPlazaCampfireRecipePreview({
  presentation = 'full',
  isSilhouette = false,
  className,
}: RenderingWorldPlazaCampfireRecipePreviewProps): React.JSX.Element {
  const hostRef = useRef<HTMLDivElement>(null);
  const [previewStatus, setPreviewStatus] = useState<
    'loading' | 'ready' | 'failed'
  >('loading');
  const isCard = presentation === 'card';

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    let disposed = false;
    let application: Application | null = null;

    const bootingCampfirePreview = async (): Promise<void> => {
      const nextApplication = new Application();

      try {
        await nextApplication.init({
          width:
            DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_WIDTH_PX,
          height:
            DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_HEIGHT_PX,
          backgroundAlpha: 0,
          antialias: false,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          autoDensity: true,
          autoStart: false,
          preference: 'webgl',
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
        graphics.scale.set(
          DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_CAMPFIRE_PREVIEW_SCALE
        );
        nextApplication.stage.addChild(graphics);
        nextApplication.render();
        setPreviewStatus('ready');
      } catch {
        if (!disposed) {
          setPreviewStatus('failed');
        }
      }
    };

    void bootingCampfirePreview();

    return () => {
      disposed = true;
      application?.stop();
      application?.destroy(true);
      host.replaceChildren();
    };
  }, []);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        isCard
          ? 'size-[78%] max-h-full max-w-full'
          : 'h-28 w-44 shrink-0 sm:h-36 sm:w-56',
        className
      )}
      style={
        isSilhouette
          ? { filter: DEFINING_PLAZA_BESTIARY_PORTRAIT_SILHOUETTE_FILTER }
          : undefined
      }
      aria-hidden
    >
      {previewStatus !== 'ready' ? (
        <Icon
          icon="mdi:campfire"
          className={cn(
            'text-[#8b5a2b]',
            isCard ? 'size-[70%]' : 'size-16 sm:size-20',
            previewStatus === 'loading' ? 'opacity-45' : 'opacity-80'
          )}
        />
      ) : null}
      <div
        ref={hostRef}
        className="absolute inset-0 [&_canvas]:size-full [&_canvas]:[image-rendering:pixelated]"
      />
    </div>
  );
}
