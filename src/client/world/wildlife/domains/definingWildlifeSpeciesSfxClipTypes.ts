/**
 * Shared clip and pool id unions for wildlife species vocal SFX catalogs.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes
 */

import type {
  DefiningWildlifeBeastSfxClipId,
  DefiningWildlifeBeastSfxPoolId,
} from '@/components/world/wildlife/domains/definingWildlifeBeastSfxConstants';
import type {
  DefiningWildlifeFarmAnimalSfxClipId,
  DefiningWildlifeFarmAnimalSfxPoolId,
} from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import type {
  DefiningWildlifeMixkitWildSfxClipId,
  DefiningWildlifeMixkitWildSfxPoolId,
} from '@/components/world/wildlife/domains/definingWildlifeMixkitWildSfxConstants';

/** Every shipped wildlife species vocal clip id. */
export type DefiningWildlifeSpeciesSfxClipId =
  | DefiningWildlifeFarmAnimalSfxClipId
  | DefiningWildlifeBeastSfxClipId
  | DefiningWildlifeMixkitWildSfxClipId;

/** Every wildlife species vocal pool id. */
export type DefiningWildlifeSpeciesSfxPoolId =
  | DefiningWildlifeFarmAnimalSfxPoolId
  | DefiningWildlifeBeastSfxPoolId
  | DefiningWildlifeMixkitWildSfxPoolId;
