/**
 * Builds night light sources for every living fairy wildlife instance.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeFairyLightSources
 */

import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaLightSource } from '@/components/world/lighting/domains/definingWorldPlazaLightSource';
import {
  DEFINING_WILDLIFE_FAIRY_LIGHT_BRIGHTNESS,
  DEFINING_WILDLIFE_FAIRY_LIGHT_RADIUS_SCALE,
  DEFINING_WILDLIFE_FAIRY_LIGHT_TINT,
  DEFINING_WILDLIFE_FAIRY_SPECIES_ID,
} from '@/components/world/wildlife/domains/definingWildlifeFairyConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Maps living fairy instances to plaza light sources for the shared night engine.
 */
export function resolvingWildlifeFairyLightSources(
  instances: readonly DefiningWildlifeInstance[]
): readonly DefiningWorldPlazaLightSource[] {
  const lights: DefiningWorldPlazaLightSource[] = [];

  for (const instance of instances) {
    if (
      instance.isDead ||
      instance.speciesId !== DEFINING_WILDLIFE_FAIRY_SPECIES_ID
    ) {
      continue;
    }

    lights.push({
      id: `fairy:${instance.instanceId}`,
      gridX: instance.position.x,
      gridY: instance.position.y,
      worldLayer: resolvingWorldPlazaPlayerWorldLayer(instance.position),
      radiusScale: DEFINING_WILDLIFE_FAIRY_LIGHT_RADIUS_SCALE,
      brightness: DEFINING_WILDLIFE_FAIRY_LIGHT_BRIGHTNESS,
      colorTint: DEFINING_WILDLIFE_FAIRY_LIGHT_TINT,
    });
  }

  return lights;
}
