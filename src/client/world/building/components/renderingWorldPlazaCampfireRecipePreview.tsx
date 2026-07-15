'use client';

/**
 * Cookbook preview of the campfire craft recipe (stone ring + log teepee).
 *
 * @module components/world/building/components/renderingWorldPlazaCampfireRecipePreview
 */

import { DEFINING_PLAZA_BESTIARY_PORTRAIT_SILHOUETTE_FILTER } from '@/components/home/domains/definingPlazaBestiarySpritePortraitConstants';
import { resolvingWorldPlazaCampfireInventorySpriteSheetIcon } from '@/components/world/building/domains/definingWorldPlazaCampfireInventorySpriteConstants';
import { cn } from '@/lib/utils';

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
 * Renders a DOM-only campfire preview without creating another Pixi renderer.
 */
export function RenderingWorldPlazaCampfireRecipePreview({
  presentation = 'full',
  isSilhouette = false,
  className,
}: RenderingWorldPlazaCampfireRecipePreviewProps): React.JSX.Element {
  const isCard = presentation === 'card';
  const spriteSheetIcon = resolvingWorldPlazaCampfireInventorySpriteSheetIcon();

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
      <div
        className={cn('shrink-0', isCard ? 'size-[92%]' : 'size-24 sm:size-28')}
        style={{
          backgroundImage: `url(${spriteSheetIcon.spriteSheetUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
