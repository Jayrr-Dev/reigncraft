import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';

/**
 * Formal click-action contract for interactable placed blocks in the plaza world.
 *
 * Pointer input is projected to grid space, resolved against this registry, then
 * dispatched to a per-block handler registered at runtime (popover UI, immediate
 * action, etc.).
 *
 * @module components/world/interaction/domains/definingWorldPlazaInteractableBlockClickAction
 */

/** How a pointer hit is tested against a placed block. */
export type DefiningWorldPlazaInteractableBlockClickHitTest =
  | 'tile'
  | 'forgiving';

/**
 * What happens after a valid click is recognized.
 *
 * - `popover` — open anchored UI; the handler only selects the target.
 * - `immediate` — the handler performs the action on click.
 */
export type DefiningWorldPlazaInteractableBlockClickDispatch =
  | 'popover'
  | 'immediate';

/** Static click-action metadata for one block definition id. */
export type DefiningWorldPlazaInteractableBlockClickActionDefinition = {
  readonly dispatch: DefiningWorldPlazaInteractableBlockClickDispatch;
  readonly hitTest: DefiningWorldPlazaInteractableBlockClickHitTest;
  /** Max Chebyshev distance from pointer to block tile (forgiving hits only). */
  readonly pointerHitRadiusTiles?: number;
  /** Max Chebyshev distance from player to block tile center. */
  readonly playerRangeTiles: number;
  /** When true, only the plot owner may click this block. */
  readonly requiresPlotOwner: boolean;
};

/** Result of resolving an interactable block under the pointer. */
export type ResolvingWorldPlazaInteractablePlacedBlockFromPointerGridPointResult =
  {
    readonly block: DefiningWorldBuildingPlacedBlock;
    readonly action: DefiningWorldPlazaInteractableBlockClickActionDefinition;
  };
