'use client';

/**
 * Cookbook preview of the procedural map campfire (stone ring + log teepee).
 *
 * @module components/world/building/components/renderingWorldPlazaCampfireRecipePreview
 */

import { DEFINING_PLAZA_BESTIARY_PORTRAIT_SILHOUETTE_FILTER } from '@/components/home/domains/definingPlazaBestiarySpritePortraitConstants';
import { Icon } from '@/components/ui/icon';
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
        className={cn(
          'absolute h-[26%] w-[58%] translate-y-[38%] rounded-[50%] bg-[#5d3a1f]/15',
          isCard && 'h-[24%] w-[64%]'
        )}
      />
      <Icon
        icon="game-icons:campfire"
        className={cn(
          'relative text-[#8b5a2b] drop-shadow-[0_2px_0_rgba(74,55,40,0.22)]',
          isCard ? 'size-[72%]' : 'size-24 sm:size-28'
        )}
      />
    </div>
  );
}
