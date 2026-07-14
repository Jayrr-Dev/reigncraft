'use client';

/**
 * Front-facing idle species portrait for companion UI (modal + name dialog).
 *
 * @module components/world/wildlife/pets/components/renderingWildlifePetSpeciesPortrait
 */

import { RenderingPlazaBestiarySpritePortrait } from '@/components/home/components/renderingPlazaBestiarySpritePortrait';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_PET_MODAL_PORTRAIT_ZOOM } from '@/components/world/wildlife/pets/domains/definingWildlifePetModalConstants';

export type RenderingWildlifePetSpeciesPortraitProps = {
  readonly speciesId: string;
  readonly zoom?: number;
  readonly className?: string;
};

/**
 * Cropped idle sprite for a wildlife species. Returns null when unknown.
 */
export function RenderingWildlifePetSpeciesPortrait({
  speciesId,
  zoom = DEFINING_WILDLIFE_PET_MODAL_PORTRAIT_ZOOM,
  className = 'absolute inset-0',
}: RenderingWildlifePetSpeciesPortraitProps): React.JSX.Element | null {
  const species = resolvingWildlifeSpeciesDefinition(speciesId);

  if (!species) {
    return null;
  }

  return (
    <RenderingPlazaBestiarySpritePortrait
      speciesId={species.speciesId}
      variant="revealed"
      zoom={zoom}
      className={className}
    />
  );
}
