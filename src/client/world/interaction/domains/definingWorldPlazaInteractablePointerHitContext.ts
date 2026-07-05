import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/**
 * Pointer context for interactable block clicks in the plaza viewport.
 */
export type DefiningWorldPlazaInteractablePointerHitContext = {
  readonly gridPoint: DefiningWorldPlazaWorldPoint;
  readonly viewportScreenPoint?: { readonly x: number; readonly y: number };
  readonly cameraOffset?: DefiningWorldPlazaCameraOffset;
  readonly cameraWorldZoom?: number;
};
