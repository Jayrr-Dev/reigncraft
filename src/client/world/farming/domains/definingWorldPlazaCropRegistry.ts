/**
 * Declarative crop growth timings and harvest yields.
 *
 * @module components/world/farming/domains/definingWorldPlazaCropRegistry
 */

export type DefiningWorldPlazaCropDefinition = {
  readonly cropId: string;
  readonly displayName: string;
  readonly seedItemTypeId: string;
  readonly harvestItemTypeId: string;
  readonly harvestQuantity: number;
  /** Ms from planted → growing. */
  readonly sproutDurationMs: number;
  /** Ms from growing → mature. */
  readonly growDurationMs: number;
};

export const DEFINING_WORLD_PLAZA_CROP_WHEAT_ID = 'wheat' as const;

export const DEFINING_WORLD_PLAZA_CROP_REGISTRY: Record<
  string,
  DefiningWorldPlazaCropDefinition
> = {
  [DEFINING_WORLD_PLAZA_CROP_WHEAT_ID]: {
    cropId: DEFINING_WORLD_PLAZA_CROP_WHEAT_ID,
    displayName: 'Wheat',
    seedItemTypeId: 'world-plaza-wheat-seed',
    harvestItemTypeId: 'world-plaza-wheat',
    harvestQuantity: 2,
    sproutDurationMs: 12_000,
    growDurationMs: 24_000,
  },
};
