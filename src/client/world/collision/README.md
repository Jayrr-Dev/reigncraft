# World collision engine

Unified movement collision for the plaza world. Import from `@/components/world/collision` for all new collision work.

## Mental model

1. **Player footprint** — circle radius `0.25` grid tiles + standing world layer band (4 layers tall).
2. **Shapes** — `circle`, `tileSquare`, `baseDiamond`, `cutSubSquares` in grid space (not sprite bounds).
3. **Vertical column rule** — shared layer-delta logic: walk +1, jump +2..+4, wall >+4.
4. **Resolver pipeline** — push-out → footprint block test → binary-search clamp → ring ejection.

## Resolver order

| Phase      | Providers                                                                                          |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Push-out   | placed blocks → column-rock diamonds → tree circles → Firelands props → pebble rocks → water tiles |
| Block test | rock footprint bypass → placed blocks → terrain columns → obstacle kinds                           |

## Spatial query API

- `checkingWorldCollisionBlockedAtPoint` — movement block test via unified blocker finder
- `listingWorldCollisionTileIndicesOverlappingShape` — footprint tile sampling (used by environmental hazards)
- `creatingWorldCollisionCircleQueryShape` — build query shapes for future combat hitboxes

## Adding a new obstacle type

1. Add a `DefiningWorldCollisionProvider` entry to `definingWorldCollisionProviderRegistry.ts` with id, blocker kind, and label.
2. Implement push-out and/or tile-grid block logic in `resolvingWorldCollisionBlockedPoint.ts` (or extract a provider module).
3. Wire push-out/block logic and debug strokes in the provider registry — `debugStroke` colors drive the overlay drawer.
4. Add characterization tests in `resolvingWorldCollisionCharacterization.test.ts`.

## Module map

| File                                                         | Role                                  |
| ------------------------------------------------------------ | ------------------------------------- |
| `computingWorldCollisionShapeGeometry.ts`                    | Pure overlap / push-out math          |
| `checkingWorldCollisionVerticalColumnRule.ts`                | Shared column wall rule               |
| `definingWorldCollisionProviderRegistry.ts`                  | Declarative provider order            |
| `resolvingWorldCollisionBlockedPoint.ts`                     | Push-out, clamp, eject pipeline       |
| `findingWorldCollisionBlockerAtPoint.ts`                     | Debug blocker diagnosis               |
| `drawingWorldCollisionProviderDebugOnGraphics.ts`            | Registry-driven debug overlay strokes |
| `drawingWorldCollisionPlacedBlockProviderDebugOnGraphics.ts` | Placed-block debug strokes            |
| `queryingWorldCollisionSpatialOverlaps.ts`                   | Generic spatial queries               |

Legacy shims under `domains/` re-export the collision API for gradual migration.
